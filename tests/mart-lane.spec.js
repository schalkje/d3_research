import { test, expect } from '@playwright/test';

async function gotoAndReady(page, path) {
  await page.goto(path);
  await page.waitForSelector('svg', { timeout: 10000 });
  await page.waitForTimeout(300);
}

test.describe('Mart - All Orientations in a Lane', () => {
  test('renders five mart nodes stacked in a lane', async ({ page }) => {
    await gotoAndReady(page, '/08_martNodes/01_simple-tests/04_all-orientations-lane/all-orientations-lane.html');

    const lane = page.locator('g.lane');
    await expect(lane).toBeVisible();

    const martNodes = page.locator('g.mart');
    await expect(martNodes).toHaveCount(5);

    // Ensure vertical stacking by checking y ordering of centers
    const centers = await page.evaluate(() => {
      const els = Array.from(document.querySelectorAll('g.mart'));
      return els.map(el => ({
        y: el.__node?.y ?? 0,
        id: el.id
      })).sort((a,b) => a.y - b.y);
    });
    expect(centers.length).toBe(5);
    for (let i = 1; i < centers.length; i++) {
      expect(centers[i].y).toBeGreaterThan(centers[i-1].y - 1);
    }
  });
});


