import { test, expect } from '@playwright/test';

test.describe('Lane Nested Collapsed: collapse-expand preserves layout', () => {
  test.beforeEach(async ({ page }) => {
    page.on('console', msg => {
      if (msg.type() === 'error') console.log('Browser console error:', msg.text());
    });
    page.on('pageerror', error => console.log('Page error:', error.message));
  });

  async function waitForLaneNodes(page, timeout = 30000) {
    try {
      await page.waitForSelector('g.lane', { timeout });
      await page.waitForTimeout(1000);
      return true;
    } catch (e) {
      console.log('Failed to find lane nodes:', e.message);
      return false;
    }
  }

  test('nested-collapsed page: expand after collapse restores vertical stack', async ({ page }) => {
    await page.goto('/04_laneNodes/02_nested-tests/08_nested-collapsed/nested-collapsed.html');
    await page.waitForSelector('svg', { timeout: 10000 });
    await page.waitForFunction(() => window.flowdash !== undefined, { timeout: 15000 });
    await expect(await waitForLaneNodes(page)).toBe(true);

    const main = page.locator('g.lane#mainLane');
    const sub1 = page.locator('g.lane#subLane1');
    const sub2 = page.locator('g.lane#subLane2');

    // Pre-check
    await expect(main).toBeVisible();
    await expect(sub1).toBeVisible();
    await expect(sub2).toBeVisible();

    // Collapse main (target only the main lane's header zoom button)
    await main.locator(':scope > g.zone-header > g.zoom-button').first().click();
    await page.waitForTimeout(800);

    // Expand main (target only the main lane's header zoom button)
    await main.locator(':scope > g.zone-header > g.zoom-button').first().click();
    await page.waitForTimeout(1000);

    // Wait for inner container to be recreated with proper height
    await page.waitForFunction(() => {
      const gSub1 = document.querySelector('g.lane#subLane1');
      if (!gSub1) return false;
      
      const innerRect = gSub1.querySelector('g.zone-innerContainer > rect.zone-innerContainer');
      if (!innerRect) return false;
      
      const height = parseFloat(innerRect.getAttribute('height') || '0');
      console.log('subLane1 inner container height:', height);
      
      return height > 1;
    }, { timeout: 10000 });

    // Collect metrics for subLane1 (expanded) and subLane2 (collapsed)
    const metrics = await page.evaluate(() => {
      function boundsFromCenters(children) {
        if (!children || children.length === 0) return { width: 0, height: 0, minX: 0, minY: 0, maxX: 0, maxY: 0 };
        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
        for (const c of children) {
          const left = c.x - c.width / 2;
          const right = c.x + c.width / 2;
          const top = c.y - c.height / 2;
          const bottom = c.y + c.height / 2;
          minX = Math.min(minX, left);
          minY = Math.min(minY, top);
          maxX = Math.max(maxX, right);
          maxY = Math.max(maxY, bottom);
        }
        return { width: maxX - minX, height: maxY - minY, minX, minY, maxX, maxY };
      }

      const gSub1 = document.querySelector('g.lane#subLane1');
      const gSub2 = document.querySelector('g.lane#subLane2');
      if (!gSub1 || !gSub1.__node) return null;
      const node1 = gSub1.__node;
      const inner1 = node1?.zoneManager?.innerContainerZone;
      const innerRect1 = gSub1.querySelector('g.zone-innerContainer > rect.zone-innerContainer');
      const inner1Height = innerRect1 ? parseFloat(innerRect1.getAttribute('height') || '0') : 0;
      const children1 = Array.from(gSub1.querySelectorAll('g.zone-innerContainer > g'))
        .map(g => g.__node)
        .filter(n => n && typeof n.x === 'number' && typeof n.y === 'number' && n.data && n.data.width && n.data.height)
        .map(n => ({ x: n.x, y: n.y, width: n.data.width, height: n.data.height }));
      const childBounds1 = boundsFromCenters(children1);

      const sub2HasCollapsedClass = gSub2 ? gSub2.classList.contains('collapsed') : false;

      return {
        inner1: {
          exists: !!inner1,
          height: inner1Height,
          childCount: children1.length,
          childBounds: childBounds1,
          childYs: children1.map(c => c.y)
        },
        sub2Collapsed: sub2HasCollapsedClass
      };
    });

    expect(metrics).toBeTruthy();
    expect(metrics.inner1.exists).toBeTruthy();
    expect(metrics.inner1.childCount).toBeGreaterThanOrEqual(3);

    // Inner container should have meaningful height and encompass children
    expect(metrics.inner1.height).toBeGreaterThan(1);
    expect(metrics.inner1.childBounds.height).toBeGreaterThan(0);
    expect(metrics.inner1.height).toBeGreaterThanOrEqual(metrics.inner1.childBounds.height - 2);

    // Children must be vertically stacked: strictly increasing Y
    const ys = metrics.inner1.childYs.slice();
    for (let i = 1; i < ys.length; i++) {
      expect(ys[i]).toBeGreaterThan(ys[i - 1]);
    }

    // Sub process 2 should remain collapsed
    expect(metrics.sub2Collapsed).toBeTruthy();
  });
});


