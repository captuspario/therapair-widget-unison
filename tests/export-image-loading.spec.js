import { test, expect } from '@playwright/test';

test('should test image loading in export folder', async ({ page }) => {
  await page.goto('file:///Users/tino/Projects/therapair/export/therapair-widget/index.html');

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

  console.log('--- Export Image Loading Test ---');

  const cards = await page.locator('.therapist-card').all();

  for (let i = 0; i < cards.length; i++) {
    const card = cards[i];
    const nameElement = await card.locator('h3').first();
    const therapistName = await nameElement.textContent();

    // Check the image element
    const img = card.locator('img').first();
    const imgSrc = await img.getAttribute('src');
    const imgDisplay = await img.evaluate(el => window.getComputedStyle(el).display);
    const imgNaturalWidth = await img.evaluate(el => el.naturalWidth);

    // Check the fallback div
    const fallbackDiv = card.locator('.image-container > div').first();
    const fallbackDisplay = await fallbackDiv.evaluate(el => window.getComputedStyle(el).display);

    console.log(`\\n${therapistName.trim()}:`);
    console.log(`  Image src: ${imgSrc}`);
    console.log(`  Image display: ${imgDisplay}`);
    console.log(`  Image natural width: ${imgNaturalWidth}`);
    console.log(`  Fallback display: ${fallbackDisplay}`);

    if (imgDisplay === 'none' || imgNaturalWidth === 0) {
      console.log(`  ❌ IMAGE NOT LOADING - using fallback`);
    } else {
      console.log(`  ✅ IMAGE LOADED SUCCESSFULLY`);
    }
  }

  // Test the getImagePath function directly
  const pathTest = await page.evaluate(() => {
    return {
      hostname: window.location.hostname,
      protocol: window.location.protocol,
      testPath: getImagePath('nicki.jpg')
    };
  });

  console.log(`\\n--- Path Detection Test ---`);
  console.log(`Hostname: ${pathTest.hostname}`);
  console.log(`Protocol: ${pathTest.protocol}`);
  console.log(`Generated path: ${pathTest.testPath}`);

  // Take screenshot for verification
  await page.screenshot({ path: 'tests/export-image-test.png', fullPage: true });
});