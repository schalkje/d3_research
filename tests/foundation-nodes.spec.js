import { test, expect } from '@playwright/test';

test.describe('Foundation Node Tests', () => {
  async function gotoAndReady(page, path) {
    await page.goto(path);
    await page.waitForSelector('svg', { timeout: 10000 });
    await page.waitForTimeout(300);
  }

  // Helper function to wait for nodes to be rendered
  async function waitForNodes(page, timeout = 30000) {
    try {
      // Wait for node-container elements to appear
      await page.waitForSelector('g.node-container', { timeout });
      
      // Wait a bit more for the nodes to be fully rendered
      await page.waitForTimeout(1000);
      
      return true;
    } catch (error) {
      console.log('Failed to find node-container elements:', error.message);
      
      // Debug: Check what elements are actually present
      const svgContent = await page.locator('svg').innerHTML();
      console.log('SVG content:', svgContent.substring(0, 500) + '...');
      
      // Check if there are any other elements in the SVG
      const allElements = await page.locator('svg *').count();
      console.log('Total elements in SVG:', allElements);
      
      return false;
    }
  }

  test.describe('Simple Foundation Node Tests', () => {
    test.beforeEach(async ({ page }) => {
      // Use our new simple demo page for single foundation node in full mode
      await gotoAndReady(page, '/07_foundationNodes/01_simple-tests/01_full-mode/full-mode.html');
    });

    test('should render single foundation node', async ({ page }) => {
      const nodesFound = await waitForNodes(page);
      expect(nodesFound).toBe(true);
      
      const foundationNodes = page.locator('g.foundation');
      await expect(foundationNodes).toHaveCount.greaterThan(0);
      
      for (const node of await foundationNodes.all()) {
        const rect = node.locator('rect');
        const text = node.locator('text');
        await expect(rect).toBeVisible();
        await expect(text).toBeVisible();
      }
    });

    test('should render foundation node with proper data attributes', async ({ page }) => {
      const nodesFound = await waitForNodes(page);
      expect(nodesFound).toBe(true);
      
      const foundationNodes = page.locator('g.foundation');
      await expect(foundationNodes).toHaveCount.greaterThan(0);
      
      // Verify foundation node has correct data attributes
      for (const node of await foundationNodes.all()) {
        const nodeType = await node.getAttribute('data-type');
        expect(nodeType).toBe('foundation');
        
        // Verify node has an ID
        const nodeId = await node.getAttribute('data-id');
        expect(nodeId).toBeTruthy();
        
        // Verify node is visible
        await expect(node).toBeVisible();
      }
    });

    test('should render foundation node with text content', async ({ page }) => {
      const nodesFound = await waitForNodes(page);
      expect(nodesFound).toBe(true);
      
      const foundationNodes = page.locator('g.foundation');
      await expect(foundationNodes).toHaveCount.greaterThan(0);
      
      // Verify text content in foundation nodes
      for (const node of await foundationNodes.all()) {
        const textElements = node.locator('text');
        await expect(textElements).toBeVisible();
        
        // Check for text content
        const textContent = await textElements.textContent();
        expect(textContent).toBeTruthy();
        expect(textContent.trim()).not.toBe('');
      }
    });

    test('should render foundation node with proper styling', async ({ page }) => {
      const nodesFound = await waitForNodes(page);
      expect(nodesFound).toBe(true);
      
      const foundationNodes = page.locator('g.foundation');
      await expect(foundationNodes).toHaveCount.greaterThan(0);
      
      // Verify styling properties
      for (const node of await foundationNodes.all()) {
        const rect = node.locator('rect');
        
        // Verify fill color
        const fill = await rect.getAttribute('fill');
        expect(fill).toBeTruthy();
        
        // Verify stroke
        const stroke = await rect.getAttribute('stroke');
        expect(stroke).toBeTruthy();
        
        // Verify stroke width
        const strokeWidth = await rect.getAttribute('stroke-width');
        expect(strokeWidth).toBeTruthy();
        
        // Verify node is visible
        await expect(node).toBeVisible();
      }
    });

    test('should render foundation node with correct positioning', async ({ page }) => {
      const nodesFound = await waitForNodes(page);
      expect(nodesFound).toBe(true);
      
      const foundationNodes = page.locator('g.foundation');
      await expect(foundationNodes).toHaveCount.greaterThan(0);
      
      // Verify each foundation node has a valid position
      for (const node of await foundationNodes.all()) {
        const boundingBox = await node.boundingBox();
        expect(boundingBox).toBeTruthy();
        expect(boundingBox.x).toBeGreaterThanOrEqual(0);
        expect(boundingBox.y).toBeGreaterThanOrEqual(0);
        expect(boundingBox.width).toBeGreaterThan(0);
        expect(boundingBox.height).toBeGreaterThan(0);
      }
    });

    test('should render foundation node with proper dimensions', async ({ page }) => {
      const nodesFound = await waitForNodes(page);
      expect(nodesFound).toBe(true);
      
      const foundationNodes = page.locator('g.node-container[data-type="foundation"]');
      await expect(foundationNodes).toHaveCount.greaterThan(0);
      
      // Verify foundation node dimensions
      for (const node of await foundationNodes.all()) {
        const rect = node.locator('rect');
        await expect(rect).toBeVisible();
        
        // Verify rectangle has dimensions
        const width = await rect.getAttribute('width');
        const height = await rect.getAttribute('height');
        expect(width).toBeTruthy();
        expect(height).toBeTruthy();
        expect(parseFloat(width)).toBeGreaterThan(0);
        expect(parseFloat(height)).toBeGreaterThan(0);
      }
    });
  });

  test.describe('Orientation Modes', () => {
    const scenarios = [
      { name: 'Horizontal', path: '/07_foundationNodes/01_simple-tests/03_orientations/horizontal.html', orientation: 'horizontal' },
      { name: 'Horizontal Line', path: '/07_foundationNodes/01_simple-tests/03_orientations/horizontal_line.html', orientation: 'horizontal_line' },
      { name: 'Vertical', path: '/07_foundationNodes/01_simple-tests/03_orientations/vertical.html', orientation: 'vertical' },
      { name: 'Rotate 90', path: '/07_foundationNodes/01_simple-tests/03_orientations/rotate90.html', orientation: 'rotate90' },
      { name: 'Rotate 270', path: '/07_foundationNodes/01_simple-tests/03_orientations/rotate270.html', orientation: 'rotate270' },
    ];

    for (const s of scenarios) {
      test(`layout: ${s.name}`, async ({ page }) => {
        await gotoAndReady(page, s.path);

        // Extract role positions from the zone-based inner container
        const roles = await page.evaluate(() => {
          const foundationEl = document.querySelector('g.foundation');
          if (!foundationEl) return null;
          const nodes = foundationEl.querySelectorAll('g.Node');
          const map = {};
          nodes.forEach(n => {
            const inst = n.__node;
            if (inst?.data?.role) {
              map[inst.data.role] = { x: inst.x, y: inst.y, width: inst.data.width, height: inst.data.height };
            }
          });
          return map;
        });
        expect(roles).toBeTruthy();
        expect(roles.raw).toBeTruthy();
        expect(roles.base).toBeTruthy();

        // Orientation-specific assertions
        if (s.orientation === 'horizontal' || s.orientation === 'horizontal_line') {
          expect(roles.base.x).toBeGreaterThan(roles.raw.x);
          expect(Math.abs(roles.base.y - roles.raw.y)).toBeLessThan(2);
        } else if (s.orientation === 'vertical' || s.orientation === 'rotate90') {
          expect(roles.base.y).toBeGreaterThan(roles.raw.y);
          expect(Math.abs(roles.base.x - roles.raw.x)).toBeLessThan(2);
        } else if (s.orientation === 'rotate270') {
          // Base above raw
          expect(roles.base.y).toBeLessThan(roles.raw.y);
          expect(Math.abs(roles.base.x - roles.raw.x)).toBeLessThan(2);
        }
      });
    }
  });
}); 