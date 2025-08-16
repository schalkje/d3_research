import { test, expect } from '@playwright/test';

async function gotoAndReady(page, path) {
  await page.goto(path);
  await page.waitForSelector('svg', { timeout: 10000 });
  await page.waitForTimeout(300);
}

async function extractRoles(page) {
  return await page.evaluate(() => {
    const el = document.querySelector('g.mart');
    if (!el) return null;
    const map = {};
    el.querySelectorAll('g.Node').forEach(n => {
      const inst = n.__node;
      if (inst?.data?.role) {
        map[inst.data.role] = { x: inst.x, y: inst.y, width: inst.data.width, height: inst.data.height };
      }
    });
    return map;
  });
}

test.describe('Mart Nodes - Orientation Modes', () => {
  const scenarios = [
    { name: 'Horizontal', path: '/08_martNodes/01_simple-tests/03_orientations/horizontal.html', orientation: 'horizontal' },
    { name: 'Vertical', path: '/08_martNodes/01_simple-tests/03_orientations/vertical.html', orientation: 'vertical' },
    { name: 'Rotate 90', path: '/08_martNodes/01_simple-tests/03_orientations/rotate90.html', orientation: 'rotate90' },
    { name: 'Rotate 270', path: '/08_martNodes/01_simple-tests/03_orientations/rotate270.html', orientation: 'rotate270' },
  ];

  for (const s of scenarios) {
    test(`layout: ${s.name}`, async ({ page }) => {
      await gotoAndReady(page, s.path);
      const roles = await extractRoles(page);
      expect(roles).toBeTruthy();
      expect(roles.load).toBeTruthy();
      expect(roles.report).toBeTruthy();

      if (s.orientation === 'horizontal') {
        expect(roles.report.x).toBeGreaterThan(roles.load.x);
        expect(Math.abs(roles.report.y - roles.load.y)).toBeLessThan(2);
      } else if (s.orientation === 'vertical' || s.orientation === 'rotate90') {
        expect(roles.report.y).toBeGreaterThan(roles.load.y);
        expect(Math.abs(roles.report.x - roles.load.x)).toBeLessThan(2);
      } else if (s.orientation === 'rotate270') {
        expect(roles.report.y).toBeLessThan(roles.load.y);
        expect(Math.abs(roles.report.x - roles.load.x)).toBeLessThan(2);
      }
    });
  }
});


