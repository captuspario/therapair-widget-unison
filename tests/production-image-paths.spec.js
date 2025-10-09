import { test, expect } from '@playwright/test';

test('should verify image path generation for production deployment', async ({ page }) => {
  await page.goto('file:///Users/tino/Projects/therapair/export/therapair-widget/index.html');

  // Test the getImagePath function for different scenarios
  const pathTests = await page.evaluate(() => {
    const results = [];

    // Test 1: Simulate production domain
    const originalLocation = window.location;

    // Create a mock location object for unisonmentalhealth.com
    const mockLocation = {
      hostname: 'unisonmentalhealth.com',
      protocol: 'https:',
      href: 'https://unisonmentalhealth.com/therapair-widget/'
    };

    // Temporarily replace window.location
    Object.defineProperty(window, 'location', {
      value: mockLocation,
      writable: true
    });

    try {
      results.push({
        scenario: 'Production domain (unisonmentalhealth.com)',
        input: 'adam.jpg',
        result: getImagePath('adam.jpg'),
        expected: 'https://unisonmentalhealth.com/therapair-widget/images/adam.jpeg'
      });

      // Test different filename
      results.push({
        scenario: 'Production domain (nicki)',
        input: 'nicki.jpg',
        result: getImagePath('nicki.jpg'),
        expected: 'https://unisonmentalhealth.com/therapair-widget/images/nicki.jpeg'
      });
    } finally {
      // Restore original location
      Object.defineProperty(window, 'location', {
        value: originalLocation,
        writable: true
      });
    }

    // Test 2: Local file
    results.push({
      scenario: 'Local file testing',
      input: 'adam.jpg',
      result: getImagePath('adam.jpg'),
      expected: 'images/adam.jpeg'
    });

    return results;
  });

  console.log('--- Production Image Path Tests ---');

  let allPassed = true;
  pathTests.forEach(test => {
    const passed = test.result === test.expected;
    console.log(`\\n${test.scenario}:`);
    console.log(`  Input: ${test.input}`);
    console.log(`  Expected: ${test.expected}`);
    console.log(`  Got: ${test.result}`);
    console.log(`  Result: ${passed ? '✅ PASS' : '❌ FAIL'}`);

    if (!passed) allPassed = false;
  });

  console.log(`\\n--- Overall Result ---`);
  console.log(allPassed ? '✅ All path tests PASSED' : '❌ Some path tests FAILED');

  // Complete the questionnaire to test actual image loading
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

  // Check that images are loading correctly
  const imageLoadingResults = await page.evaluate(() => {
    const cards = document.querySelectorAll('.therapist-card');
    const results = [];

    cards.forEach((card, index) => {
      const img = card.querySelector('img');
      const nameElement = card.querySelector('h3');
      const name = nameElement ? nameElement.textContent.trim() : `Card ${index + 1}`;

      results.push({
        name: name,
        src: img ? img.src : 'No image found',
        display: img ? window.getComputedStyle(img).display : 'none',
        naturalWidth: img ? img.naturalWidth : 0
      });
    });

    return results;
  });

  console.log('\\n--- Image Loading Verification ---');
  imageLoadingResults.forEach(result => {
    const isLoading = result.display !== 'none' && result.naturalWidth > 0;
    console.log(`${result.name}: ${isLoading ? '✅' : '❌'} (${result.src})`);
  });

  expect(allPassed).toBe(true);
});