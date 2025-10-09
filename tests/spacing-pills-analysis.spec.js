import { test, expect } from '@playwright/test';

test('should analyze spacing between specialty pills and buttons', async ({ page }) => {
  await page.goto('file:///Users/tino/Projects/therapair/therapair-standalone.html');

  // Complete questionnaire
  await page.click('#start-btn');
  await page.waitForSelector('.option-button');
  await page.click('button:has-text("For myself")');
  await page.waitForSelector('.option-button:not(:disabled)');
  await page.click('button:has-text("Yes")');
  await page.waitForSelector('.option-button:not(:disabled)');
  await page.click('button:has-text("Either online or in-person")');
  await page.waitForSelector('.option-button:not(:disabled)');
  await page.click('button:has-text("General Support")');
  await page.click('#continue-btn');
  await page.waitForSelector('.option-button:not(:disabled)');
  await page.click('button:has-text("None of these apply")');
  await page.click('#continue-btn');
  await page.waitForSelector('.option-button:not(:disabled)');
  await page.click('button:has-text("I\'m flexible with timing")');
  await page.click('#continue-btn');
  await page.waitForSelector('.option-button:not(:disabled)');
  await page.click('button:has-text("I don\'t mind waiting for the right therapist")');
  await page.waitForSelector('.option-button:not(:disabled)');
  await page.click('button:has-text("No preference/unsure")');
  await page.click('#continue-btn');
  await page.waitForSelector('.option-button:not(:disabled)');
  await page.click('button:has-text("I\'m open to any qualified therapist")');
  await page.click('#continue-btn');

  await page.waitForSelector('#results-section:not(.hidden)');
  await page.waitForTimeout(3000);

  // Take screenshot for analysis
  await page.screenshot({ path: 'tests/pills-spacing-issue.png', fullPage: true });

  console.log('--- Specialty Pills to Buttons Spacing Analysis ---');

  const cards = await page.locator('.therapist-card').all();

  for (let i = 0; i < cards.length; i++) {
    const card = cards[i];

    const nameElement = await card.locator('h3').first();
    const therapistName = await nameElement.textContent();

    console.log(`\n${therapistName.trim()}:`);

    // Find last specialty tag (pill)
    const specialtyTags = card.locator('.specialty-tag');
    const specialtyCount = await specialtyTags.count();

    if (specialtyCount > 0) {
      const lastTag = specialtyTags.nth(specialtyCount - 1);
      const lastTagBox = await lastTag.boundingBox();
      const lastTagY = lastTagBox.y + lastTagBox.height;

      console.log(`  Last specialty pill bottom: ${Math.round(lastTagY)}px`);

      // Check for "+X more" span
      const moreSpans = card.locator('span').filter({ hasText: /\+\d+ more/ });
      let lastContentY = lastTagY;

      if (await moreSpans.count() > 0) {
        const moreSpan = moreSpans.first();
        const moreBox = await moreSpan.boundingBox();
        lastContentY = Math.max(lastContentY, moreBox.y + moreBox.height);
        console.log(`  "+more" span bottom: ${Math.round(moreBox.y + moreBox.height)}px`);
      }

      // Find first button
      const firstButton = card.locator('.card-buttons button').first();
      const firstButtonBox = await firstButton.boundingBox();
      const spacing = Math.round(firstButtonBox.y - lastContentY);

      console.log(`  Pills-to-button spacing: ${spacing}px`);

      if (spacing < 32) {
        console.log(`  ❌ TOO TIGHT: ${spacing}px (should be 32px+)`);
      } else if (spacing > 80) {
        console.log(`  ❌ TOO MUCH: ${spacing}px (excessive)`);
      } else {
        console.log(`  ✅ Good spacing: ${spacing}px`);
      }

      // Check button container properties
      const buttonContainer = card.locator('.card-buttons');
      const containerStyles = await buttonContainer.evaluate(el => {
        const computed = window.getComputedStyle(el);
        return {
          position: computed.position,
          bottom: computed.bottom,
          height: computed.height,
          paddingTop: computed.paddingTop
        };
      });

      console.log(`  Button container: position=${containerStyles.position}, bottom=${containerStyles.bottom}, height=${containerStyles.height}`);
    }
  }

  console.log('\n--- Recommended Fix ---');
  console.log('Increase .card-content padding-bottom to create more space between pills and buttons');
  console.log('Target: 32-48px spacing between specialty pills and buttons');

  return { cardsAnalyzed: cards.length };
});