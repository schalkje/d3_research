import { test, expect } from '@playwright/test';

// These tests assume a dev server that can serve the repo and that index navigation exists.
// Adjust page.goto paths as needed for your environment.

test.describe('Edge Demo Pages', () => {
  test('Horizontal LTR: edges between A->B->C', async ({ page }) => {
    await page.goto('/10_edges/01_simple-tests/horizontal-ltr.html');
    await page.waitForSelector('svg');
    await expect(page.locator('g.edge .path')).toHaveCount(2);
  });

  test('Horizontal RTL: edges between C->B->A', async ({ page }) => {
    await page.goto('/10_edges/01_simple-tests/horizontal-rtl.html');
    await page.waitForSelector('svg');
    await expect(page.locator('g.edge .path')).toHaveCount(2);
  });

  test('Vertical TTB: edges between N1->N2->N3', async ({ page }) => {
    await page.goto('/10_edges/01_simple-tests/vertical-ttb.html');
    await page.waitForSelector('svg');
    await expect(page.locator('g.edge .path')).toHaveCount(2);
  });

  test('Vertical BTT: edges between N3->N2->N1', async ({ page }) => {
    await page.goto('/10_edges/01_simple-tests/vertical-btt.html');
    await page.waitForSelector('svg');
    await expect(page.locator('g.edge .path')).toHaveCount(2);
  });

  test('Cross containers: edges across lane and columns', async ({ page }) => {
    await page.goto('/10_edges/02_extended-tests/cross-containers.html');
    await page.waitForSelector('svg');
    const edges = page.locator('g.edge .path');
    await expect(edges).toHaveCount(4);

    // Collapse lane and verify edges update (still present but potentially rerouted)
    await page.click('#collapseLane');
    await page.waitForTimeout(300);
    await expect(edges).toHaveCount(4);

    // Expand lane
    await page.click('#expandLane');
    await page.waitForTimeout(300);
    await expect(edges).toHaveCount(4);

    // Collapse columns
    await page.click('#collapseCols');
    await page.waitForTimeout(300);
    await expect(edges).toHaveCount(4);

    // Expand columns
    await page.click('#expandCols');
    await page.waitForTimeout(300);
    await expect(edges).toHaveCount(4);
  });
});


