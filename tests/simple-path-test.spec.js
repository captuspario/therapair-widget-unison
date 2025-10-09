import { test, expect } from '@playwright/test';

test('should test current image paths in export', async ({ page }) => {
  await page.goto('file:///Users/tino/Projects/therapair/export/therapair-widget/index.html');

  // Test the current path generation
  const pathInfo = await page.evaluate(() => {
    return {
      hostname: window.location.hostname,
      protocol: window.location.protocol,
      href: window.location.href,
      testPath: getImagePath('adam.jpg')
    };
  });

  console.log('--- Current Path Information ---');
  console.log(`Hostname: "${pathInfo.hostname}"`);
  console.log(`Protocol: ${pathInfo.protocol}`);
  console.log(`Generated path: ${pathInfo.testPath}`);

  // Complete questionnaire and test actual loading
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
  await page.waitForTimeout(2000);

  const imageResults = await page.evaluate(() => {
    const cards = document.querySelectorAll('.therapist-card');
    const results = [];

    cards.forEach((card, index) => {
      const img = card.querySelector('img');
      const nameElement = card.querySelector('h3');
      const name = nameElement ? nameElement.textContent.trim() : `Card ${index + 1}`;

      if (img) {
        results.push({
          name: name,
          src: img.src,
          display: window.getComputedStyle(img).display,
          naturalWidth: img.naturalWidth,
          complete: img.complete
        });
      }
    });

    return results;
  });

  console.log('\\n--- Image Loading Status ---');
  imageResults.forEach(result => {
    const isLoaded = result.display !== 'none' && result.naturalWidth > 0;
    console.log(`${result.name}:`);
    console.log(`  src: ${result.src}`);
    console.log(`  loaded: ${isLoaded ? '✅' : '❌'} (width: ${result.naturalWidth})`);
  });
});