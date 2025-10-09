import { test, expect } from '@playwright/test';

test.describe('Card Spacing Analysis', () => {

  test('should analyze current card spacing issues', async ({ page }) => {
    await page.goto('file://' + process.cwd() + '/export/therapair-widget/index.html');

    // Complete questionnaire to get to results
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
    await page.screenshot({ path: 'tests/current-spacing-issue.png', fullPage: true });

    console.log('--- Current Card Spacing Analysis ---');

    const cards = await page.locator('.therapist-card').all();
    console.log(`Analyzing ${cards.length} cards for spacing issues`);

    for (let i = 0; i < cards.length; i++) {
      const card = cards[i];

      // Get therapist name
      const nameElement = await card.locator('h3').first();
      const therapistName = await nameElement.textContent();

      console.log(`\n${therapistName.trim()}:`);

      // Get card dimensions
      const cardBox = await card.boundingBox();
      console.log(`  Card height: ${Math.round(cardBox.height)}px`);

      // Check content area
      const cardContent = card.locator('.card-content');
      if (await cardContent.count() > 0) {
        const contentBox = await cardContent.boundingBox();
        console.log(`  Content area height: ${Math.round(contentBox.height)}px`);
      }

      // Check button container
      const buttonContainer = card.locator('.card-buttons');
      if (await buttonContainer.count() > 0) {
        const buttonBox = await buttonContainer.boundingBox();
        console.log(`  Button container Y: ${Math.round(buttonBox.y)}px`);
        console.log(`  Button container height: ${Math.round(buttonBox.height)}px`);

        // Check CSS properties
        const containerStyles = await buttonContainer.evaluate(el => {
          const computed = window.getComputedStyle(el);
          return {
            position: computed.position,
            bottom: computed.bottom,
            marginTop: computed.marginTop,
            height: computed.height,
            padding: computed.padding
          };
        });

        console.log(`  CSS position: ${containerStyles.position}`);
        console.log(`  CSS bottom: ${containerStyles.bottom}`);
        console.log(`  CSS marginTop: ${containerStyles.marginTop}`);
        console.log(`  CSS height: ${containerStyles.height}`);
        console.log(`  CSS padding: ${containerStyles.padding}`);
      }

      // Find last content element
      const specialtyTags = card.locator('.specialty-tag');
      const specialtyCount = await specialtyTags.count();

      if (specialtyCount > 0) {
        const lastTag = specialtyTags.nth(specialtyCount - 1);
        const lastTagBox = await lastTag.boundingBox();
        const lastContentY = lastTagBox.y + lastTagBox.height;

        // Get first button
        const firstButton = card.locator('.card-buttons button').first();
        if (await firstButton.count() > 0) {
          const firstButtonBox = await firstButton.boundingBox();
          const spacing = Math.round(firstButtonBox.y - lastContentY);

          console.log(`  Content-to-button spacing: ${spacing}px`);

          if (spacing > 100) {
            console.log(`  ❌ TOO MUCH SPACING: ${spacing}px (excessive whitespace)`);
          } else if (spacing < 24) {
            console.log(`  ❌ TOO TIGHT: ${spacing}px (needs more space)`);
          } else {
            console.log(`  ✅ Good spacing: ${spacing}px`);
          }
        }
      }
    }

    // Check current CSS values
    console.log('\n--- CSS Analysis ---');

    const firstCard = page.locator('.therapist-card').first();
    const cardStyles = await firstCard.evaluate(el => {
      const computed = window.getComputedStyle(el);
      return {
        height: computed.height,
        display: computed.display,
        flexDirection: computed.flexDirection
      };
    });

    console.log(`Card styles: height=${cardStyles.height}, display=${cardStyles.display}, flexDirection=${cardStyles.flexDirection}`);

    return {
      totalCards: cards.length,
      analysisComplete: true
    };
  });

  test('should test optimized spacing solution', async ({ page }) => {
    await page.goto('file://' + process.cwd() + '/export/therapair-widget/index.html');

    // Add custom CSS to test optimal spacing
    await page.addStyleTag({
      content: `
        .card-buttons {
          position: absolute !important;
          bottom: 0 !important;
          left: 0 !important;
          right: 0 !important;
          height: 144px !important;
          margin-top: 0 !important;
          padding: 0 1.5rem 1.5rem 1.5rem !important;
          display: flex !important;
          flex-direction: column !important;
          gap: 1rem !important;
          justify-content: flex-end !important;
        }

        .card-content {
          padding: 1.5rem 1.5rem 1.5rem 1.5rem !important;
          padding-bottom: 160px !important;
          flex: 1 !important;
          display: flex !important;
          flex-direction: column !important;
        }
      `
    });

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

    // Take screenshot of optimized version
    await page.screenshot({ path: 'tests/optimized-spacing.png', fullPage: true });

    console.log('--- Optimized Spacing Test ---');

    const cards = await page.locator('.therapist-card').all();
    const spacings = [];

    for (let i = 0; i < cards.length; i++) {
      const card = cards[i];

      const nameElement = await card.locator('h3').first();
      const therapistName = await nameElement.textContent();

      // Find last specialty tag
      const specialtyTags = card.locator('.specialty-tag');
      const specialtyCount = await specialtyTags.count();

      if (specialtyCount > 0) {
        const lastTag = specialtyTags.nth(specialtyCount - 1);
        const lastTagBox = await lastTag.boundingBox();
        const lastContentY = lastTagBox.y + lastTagBox.height;

        const firstButton = card.locator('.card-buttons button').first();
        const firstButtonBox = await firstButton.boundingBox();
        const spacing = Math.round(firstButtonBox.y - lastContentY);

        spacings.push(spacing);
        console.log(`${therapistName.trim()}: ${spacing}px spacing`);
      }
    }

    const avgSpacing = Math.round(spacings.reduce((a, b) => a + b, 0) / spacings.length);
    const maxSpacing = Math.max(...spacings);
    const minSpacing = Math.min(...spacings);

    console.log(`\nSpacing Results:`);
    console.log(`Average: ${avgSpacing}px`);
    console.log(`Range: ${minSpacing}px - ${maxSpacing}px`);
    console.log(`Variation: ${maxSpacing - minSpacing}px`);

    // Verify consistent spacing
    expect(maxSpacing - minSpacing).toBeLessThan(5); // Within 5px tolerance
    expect(avgSpacing).toBeGreaterThan(30); // Adequate spacing
    expect(avgSpacing).toBeLessThan(60); // Not excessive

    return {
      averageSpacing: avgSpacing,
      spacingRange: [minSpacing, maxSpacing],
      spacingVariation: maxSpacing - minSpacing
    };
  });
});