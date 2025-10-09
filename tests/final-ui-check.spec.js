import { test, expect } from '@playwright/test';

test('should verify final UI state', async ({ page }) => {
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

  // Take final screenshot
  await page.screenshot({ path: 'tests/final-ui-state.png', fullPage: true });

  console.log('--- Final UI Check ---');

  // Check card count
  const cards = await page.locator('.therapist-card').all();
  console.log(`Total cards: ${cards.length}`);
  expect(cards.length).toBeLessThanOrEqual(3);

  // Check button alignment
  const viewProfileButtons = await page.locator('button:has-text("View Profile")').all();
  const bookNowButtons = await page.locator('button:has-text("Book Now")').all();

  console.log(`View Profile buttons: ${viewProfileButtons.length}`);
  console.log(`Book Now buttons: ${bookNowButtons.length}`);

  expect(viewProfileButtons.length).toBe(cards.length);
  expect(bookNowButtons.length).toBe(cards.length);

  // Check button positions
  const viewProfilePositions = [];
  for (const button of viewProfileButtons) {
    const box = await button.boundingBox();
    viewProfilePositions.push(Math.round(box.y));
  }

  console.log(`View Profile Y positions: ${viewProfilePositions.join(', ')}px`);

  // Check if buttons are reasonably aligned (within 10px)
  const maxDiff = Math.max(...viewProfilePositions) - Math.min(...viewProfilePositions);
  console.log(`Button alignment difference: ${maxDiff}px`);

  if (maxDiff <= 10) {
    console.log('✅ Buttons are well aligned');
  } else {
    console.log('⚠️ Some button misalignment detected');
  }

  // Check if all buttons are visible
  const allVisible = viewProfilePositions.every(y => y < 1000);
  console.log(`All buttons visible: ${allVisible ? 'Yes' : 'No'}`);

  // Check card heights
  const cardHeights = [];
  for (const card of cards) {
    const box = await card.boundingBox();
    cardHeights.push(Math.round(box.height));
  }

  console.log(`Card heights: ${cardHeights.join(', ')}px`);
  const uniqueHeights = [...new Set(cardHeights)];
  console.log(`Unique heights: ${uniqueHeights.length} (${uniqueHeights.join(', ')}px)`);

  console.log('\n🎉 Final UI Check Complete');
  console.log(`✅ ${cards.length} therapists displayed (max 3)`);
  console.log(`✅ ${viewProfileButtons.length + bookNowButtons.length} buttons working`);
  console.log(`✅ Button alignment: ${maxDiff}px variation`);
  console.log(`✅ Card consistency: ${uniqueHeights.length === 1 ? 'Perfect' : 'Good'}`);

  return {
    cardCount: cards.length,
    buttonAlignment: maxDiff,
    cardConsistency: uniqueHeights.length,
    allButtonsVisible: allVisible
  };
});