import { test, expect } from '@playwright/test';

test('should verify spacing and image loading fixes', async ({ page }) => {
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

  console.log('--- Final Verification Test ---');

  // Check spacing
  const cards = await page.locator('.therapist-card').all();
  let spacingPassed = true;

  for (let i = 0; i < Math.min(cards.length, 3); i++) {
    const card = cards[i];
    const nameElement = await card.locator('h3').first();
    const therapistName = await nameElement.textContent();

    const specialtyTags = card.locator('.specialty-tag');
    const specialtyCount = await specialtyTags.count();

    if (specialtyCount > 0) {
      const lastTag = specialtyTags.nth(specialtyCount - 1);
      const lastTagBox = await lastTag.boundingBox();
      const lastTagY = lastTagBox.y + lastTagBox.height;

      const moreSpans = card.locator('span').filter({ hasText: /\+\d+ more/ });
      let lastContentY = lastTagY;

      if (await moreSpans.count() > 0) {
        const moreSpan = moreSpans.first();
        const moreBox = await moreSpan.boundingBox();
        lastContentY = Math.max(lastContentY, moreBox.y + moreBox.height);
      }

      const firstButton = card.locator('.card-buttons button').first();
      const firstButtonBox = await firstButton.boundingBox();
      const spacing = Math.round(firstButtonBox.y - lastContentY);

      console.log(`${therapistName.trim()}: Pills-to-button spacing = ${spacing}px`);

      if (spacing < 32) {
        spacingPassed = false;
        console.log(`❌ SPACING FAIL: ${spacing}px (should be 32px+)`);
      } else {
        console.log(`✅ SPACING PASS: ${spacing}px`);
      }
    }
  }

  // Check image loading logic
  const imageLoadingTest = await page.evaluate(() => {
    // Test the getImagePath function
    const testResults = [];

    // Test local file scenario
    Object.defineProperty(window.location, 'protocol', {
      writable: true,
      value: 'file:'
    });
    testResults.push({
      scenario: 'Local file',
      result: getImagePath('adam.jpg'),
      expected: 'images/resized/adam.jpg'
    });

    // Test production domain scenario
    Object.defineProperty(window.location, 'hostname', {
      writable: true,
      value: 'unisonmentalhealth.com'
    });
    Object.defineProperty(window.location, 'protocol', {
      writable: true,
      value: 'https:'
    });
    testResults.push({
      scenario: 'Production domain',
      result: getImagePath('adam.jpg'),
      expected: 'https://unisonmentalhealth.com/therapair-widget/images/adam.jpeg'
    });

    return testResults;
  });

  console.log('\n--- Image Loading Test ---');
  let imageLoadingPassed = true;

  imageLoadingTest.forEach(test => {
    const passed = test.result === test.expected;
    console.log(`${test.scenario}: ${passed ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`  Expected: ${test.expected}`);
    console.log(`  Got: ${test.result}`);
    if (!passed) imageLoadingPassed = false;
  });

  console.log(`\n--- Final Results ---`);
  console.log(`Spacing: ${spacingPassed ? '✅ FIXED' : '❌ NEEDS WORK'}`);
  console.log(`Image Loading: ${imageLoadingPassed ? '✅ FIXED' : '❌ NEEDS WORK'}`);

  // Take a final screenshot
  await page.screenshot({ path: 'tests/final-verification.png', fullPage: true });

  expect(spacingPassed).toBe(true);
  expect(imageLoadingPassed).toBe(true);
});