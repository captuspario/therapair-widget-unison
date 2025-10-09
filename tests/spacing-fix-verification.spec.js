import { test, expect } from '@playwright/test';

test('should verify spacing fix', async ({ page }) => {
  await page.goto('file://' + process.cwd() + '/export/therapair-widget/index.html');

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

  // Take screenshot of fixed version
  await page.screenshot({ path: 'tests/spacing-fixed.png', fullPage: true });

  console.log('--- Spacing Fix Verification ---');

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

  console.log(`\n✅ Spacing Results:`);
  console.log(`Average: ${avgSpacing}px`);
  console.log(`Range: ${minSpacing}px - ${maxSpacing}px`);
  console.log(`Variation: ${maxSpacing - minSpacing}px`);

  // Verify good spacing
  expect(minSpacing).toBeGreaterThan(20); // All spacing > 20px
  expect(maxSpacing).toBeLessThan(80); // Not excessive
  expect(maxSpacing - minSpacing).toBeLessThan(10); // Consistent spacing

  console.log('✅ All spacing issues fixed!');
});