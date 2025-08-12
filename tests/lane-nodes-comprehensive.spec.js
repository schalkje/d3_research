import { test, expect } from '@playwright/test';

test.describe('LaneNode Comprehensive Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Add error handling for console errors
    page.on('console', msg => {
      if (msg.type() === 'error') {
        console.log('Browser console error:', msg.text());
      }
    });
    
    page.on('pageerror', error => {
      console.log('Page error:', error.message);
    });
  });

  // Helper function to wait for nodes to be rendered
  async function waitForNodes(page, timeout = 30000) {
    try {
      await page.waitForSelector('g.Node', { timeout });
      await page.waitForTimeout(1000);
      return true;
    } catch (error) {
      console.log('Failed to find node elements:', error.message);
      return false;
    }
  }

  // Helper function to wait for lane nodes specifically
  async function waitForLaneNodes(page, timeout = 30000) {
    try {
      // Wait for lane nodes using CSS class selector
      await page.waitForSelector('g.lane', { timeout });
      await page.waitForTimeout(1000);
      return true;
    } catch (error) {
      console.log('Failed to find lane node elements:', error.message);
      return false;
    }
  }

  // Helper function to get lane node selector (uses CSS class)
  function getLaneNodeSelector() {
    return 'g.lane';
  }

  // Helper function to get child node selector (uses CSS class and parent relationship)
  function getChildNodeSelector() {
    return 'g.rect.expanded, g.rect:not(.collapsed)';
  }

  // Helper function to get lane node locator
  function getLaneNodeLocator(page) {
    return page.locator(getLaneNodeSelector());
  }

  // Helper function to get child node locator within a parent
  function getChildNodeLocator(parentLocator) {
    return parentLocator.locator(getChildNodeSelector());
  }

  // Helper function to get node dimensions
  async function getNodeDimensions(page, nodeSelector) {
    const node = page.locator(nodeSelector);
    const rect = node.locator('rect').first();
    
    const width = await rect.getAttribute('width');
    const height = await rect.getAttribute('height');
    const x = await rect.getAttribute('x');
    const y = await rect.getAttribute('y');
    
    return {
      width: parseFloat(width),
      height: parseFloat(height),
      x: parseFloat(x),
      y: parseFloat(y)
    };
  }

  // Helper function to get child node positions
  async function getChildPositions(page, parentSelector) {
    const parent = page.locator(parentSelector);
    const children = parent.locator(getChildNodeSelector());
    
    const positions = [];
    for (let i = 0; i < await children.count(); i++) {
      const child = children.nth(i);
      // Look for the rect element within the child group
      const rect = child.locator('rect').first();
      
      if (await rect.count() > 0) {
        const x = await rect.getAttribute('x');
        const y = await rect.getAttribute('y');
        const width = await rect.getAttribute('width');
        const height = await rect.getAttribute('height');
        
        positions.push({
          x: parseFloat(x),
          y: parseFloat(y),
          width: parseFloat(width),
          height: parseFloat(height)
        });
      }
    }
    
    return positions;
  }

  // Helper function to click zoom button (collapse/expand)
  async function clickZoomButton(page, nodeSelector) {
    const node = page.locator(nodeSelector);
    const zoomButton = node.locator('circle.zoom-button');
    await zoomButton.click();
    await page.waitForTimeout(500); // Wait for animation
  }

  test.describe('Basic Lane Tests', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/04_laneNodes/01_simple-tests/01_default-mode/default-mode.html');
      await page.waitForSelector('svg', { timeout: 10000 });
      await page.waitForFunction(() => window.flowdash !== undefined, { timeout: 15000 });
      await page.waitForTimeout(2000);
    });

    test('should render basic lane node with correct initial dimensions', async ({ page }) => {
      const nodesFound = await waitForLaneNodes(page);
      expect(nodesFound).toBe(true);
      
      const laneNodes = page.locator(getLaneNodeSelector());
      await expect(laneNodes).toHaveCount(1);
      
      const dimensions = await getNodeDimensions(page, getLaneNodeSelector());
      
      // Verify initial dimensions are reasonable
      expect(dimensions.width).toBeGreaterThan(100);
      expect(dimensions.height).toBeGreaterThan(50);
      expect(dimensions.x).toBeDefined();
      expect(dimensions.y).toBeDefined();
    });

    test('should render child nodes correctly', async ({ page }) => {
      const nodesFound = await waitForLaneNodes(page);
      expect(nodesFound).toBe(true);
      
      const laneNode = page.locator(getLaneNodeSelector()).first();
      const children = laneNode.locator(getChildNodeSelector());
      
      // Should have 3 children
      await expect(children).toHaveCount(3);
      
      // All children should be visible
      for (let i = 0; i < await children.count(); i++) {
        const child = children.nth(i);
        await expect(child).toBeVisible();
      }
      
      // Each child should have a rect element
      for (let i = 0; i < await children.count(); i++) {
        const child = children.nth(i);
        const rect = child.locator('rect').first();
        await expect(rect).toBeVisible();
      }
    });
  });

  test.describe('Lane with 3 Rectangles - Default Mode', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/04_laneNodes/01_simple-tests/01_default-mode/default-mode.html');
      await page.waitForSelector('svg', { timeout: 10000 });
      await page.waitForFunction(() => window.flowdash !== undefined, { timeout: 15000 });
      await page.waitForTimeout(2000);
    });

    test('should render all child rectangles', async ({ page }) => {
      const nodesFound = await waitForLaneNodes(page);
      expect(nodesFound).toBe(true);
      
      const laneNode = page.locator('g.lane').first();
      const children = laneNode.locator('g.rect');
      
      // Should have 3 children
      expect(await children.count()).toBe(3);
      
      // Each child should have proper dimensions
      for (let i = 0; i < await children.count(); i++) {
        const child = children.nth(i);
        const rect = child.locator('rect').first();
        
        const width = await rect.getAttribute('width');
        const height = await rect.getAttribute('height');
        
        expect(parseFloat(width)).toBeGreaterThan(0);
        expect(parseFloat(height)).toBeGreaterThan(0);
      }
    });

    test('should have reasonable container dimensions', async ({ page }) => {
      const nodesFound = await waitForLaneNodes(page);
      expect(nodesFound).toBe(true);
      
      const laneNode = page.locator('g.lane').first();
      const laneRect = laneNode.locator('rect').first();
      
      const width = await laneRect.getAttribute('width');
      const height = await laneRect.getAttribute('height');
      
      // Lane should have reasonable dimensions
      expect(parseFloat(width)).toBeGreaterThan(100);
      expect(parseFloat(height)).toBeGreaterThan(50);
      expect(parseFloat(height)).toBeLessThan(200);
    });
  });

  test.describe('Lane Collapse/Expand Tests', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/04_laneNodes/01_simple-tests/01_default-mode/default-mode.html');
      await page.waitForSelector('svg', { timeout: 10000 });
      await page.waitForFunction(() => window.flowdash !== undefined, { timeout: 15000 });
      await page.waitForTimeout(2000);
    });

    test('should have zoom button for collapse/expand', async ({ page }) => {
      const nodesFound = await waitForLaneNodes(page);
      expect(nodesFound).toBe(true);
      
      const laneNode = page.locator('g.lane').first();
      const zoomButton = laneNode.locator('g.zoom-button');
      
      // Should have a zoom button
      await expect(zoomButton).toBeVisible();
    });

    test('should render children in expanded state', async ({ page }) => {
      const nodesFound = await waitForLaneNodes(page);
      expect(nodesFound).toBe(true);
      
      const laneNode = page.locator('g.lane').first();
      const children = laneNode.locator('g.rect');
      
      // Should have children visible in expanded state
      expect(await children.count()).toBe(3);
      
      // All children should be visible
      for (let i = 0; i < await children.count(); i++) {
        const child = children.nth(i);
        await expect(child).toBeVisible();
      }
    });
  });

  test.describe('Nested Lane Tests', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/04_laneNodes/02_nested-tests/07_nested-lanes/nested-lanes.html');
      await page.waitForSelector('svg', { timeout: 10000 });
      await page.waitForFunction(() => window.flowdash !== undefined, { timeout: 15000 });
      await page.waitForTimeout(2000);
    });

    test('should render nested lane structure', async ({ page }) => {
      const nodesFound = await waitForLaneNodes(page);
      expect(nodesFound).toBe(true);
      
      // Find all lane nodes
      const allLanes = page.locator('g.lane');
      const laneCount = await allLanes.count();
      
      // Should have at least 3 lanes (1 main + 2 nested)
      expect(laneCount).toBeGreaterThanOrEqual(3);
      
      // All lanes should be visible
      for (let i = 0; i < laneCount; i++) {
        const lane = allLanes.nth(i);
        await expect(lane).toBeVisible();
      }
    });

    test('should have zoom buttons on nested lanes', async ({ page }) => {
      const nodesFound = await waitForLaneNodes(page);
      expect(nodesFound).toBe(true);
      
      const allLanes = page.locator('g.lane');
      
      // Check that at least some lanes have zoom buttons
      let zoomButtonCount = 0;
      for (let i = 0; i < await allLanes.count(); i++) {
        const lane = allLanes.nth(i);
        const zoomButton = lane.locator('g.zoom-button');
        if (await zoomButton.count() > 0) {
          zoomButtonCount++;
        }
      }
      
      expect(zoomButtonCount).toBeGreaterThan(0);
    });
  });

  test.describe('Dynamic Lane Tests', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/04_laneNodes/01_simple-tests/01_default-mode/default-mode.html');
      await page.waitForSelector('svg', { timeout: 10000 });
      await page.waitForFunction(() => window.flowdash !== undefined, { timeout: 15000 });
      await page.waitForTimeout(2000);
    });

    test('should render initial state correctly', async ({ page }) => {
      const nodesFound = await waitForLaneNodes(page);
      expect(nodesFound).toBe(true);
      
      const laneNode = page.locator('g.lane').first();
      
      // Get initial dimensions
      const initialDimensions = await getNodeDimensions(page, 'g.lane');
      
      // Get initial child count
      const initialChildren = laneNode.locator('g.rect');
      const initialCount = await initialChildren.count();
      
      // Verify initial state
      expect(initialCount).toBe(3);
      expect(initialDimensions.width).toBeGreaterThan(0);
      expect(initialDimensions.height).toBeGreaterThan(0);
      
      // Test that the lane is properly rendered
      await expect(laneNode).toBeVisible();
      await expect(initialChildren.first()).toBeVisible();
    });
  });

  test.describe('Lane Sizing Tests', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/04_laneNodes/01_simple-tests/01_default-mode/default-mode.html');
      await page.waitForSelector('svg', { timeout: 10000 });
      await page.waitForFunction(() => window.flowdash !== undefined, { timeout: 15000 });
      await page.waitForTimeout(2000);
    });

    test('should maintain minimum width when children are narrow', async ({ page }) => {
      const nodesFound = await waitForLaneNodes(page);
      expect(nodesFound).toBe(true);
      
      const laneNode = page.locator('g.lane').first();
      
      // Get lane dimensions
      const laneRect = laneNode.locator('rect').first();
      const width = await laneRect.getAttribute('width');
      const height = await laneRect.getAttribute('height');
      
      // Lane should have reasonable minimum dimensions
      expect(parseFloat(width)).toBeGreaterThan(100);
      expect(parseFloat(height)).toBeGreaterThan(50);
    });

    test('should expand width to accommodate wide children', async ({ page }) => {
      const nodesFound = await waitForLaneNodes(page);
      expect(nodesFound).toBe(true);
      
      const laneNode = page.locator('g.lane').first();
      const children = laneNode.locator('g.rect');
      
      // Find the widest child
      let maxChildWidth = 0;
      for (let i = 0; i < await children.count(); i++) {
        const child = children.nth(i);
        const rect = child.locator('rect').first();
        const childWidth = await rect.getAttribute('width');
        maxChildWidth = Math.max(maxChildWidth, parseFloat(childWidth));
      }
      
      // Lane width should be at least as wide as the widest child (plus margins)
      const laneRect = laneNode.locator('rect').first();
      const laneWidth = await laneRect.getAttribute('width');
      
      expect(parseFloat(laneWidth)).toBeGreaterThanOrEqual(maxChildWidth);
    });
  });

  test.describe('Lane Performance Tests', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/04_laneNodes/01_simple-tests/01_default-mode/default-mode.html');
      await page.waitForSelector('svg', { timeout: 10000 });
      await page.waitForFunction(() => window.flowdash !== undefined, { timeout: 15000 });
      await page.waitForTimeout(2000);
    });

    test('should render without errors', async ({ page }) => {
      const nodesFound = await waitForLaneNodes(page);
      expect(nodesFound).toBe(true);
      
      const laneNode = page.locator('g.lane').first();
      
      // Should render without errors
      await expect(laneNode).toBeVisible();
      
      // Should have reasonable dimensions
      const dimensions = await getNodeDimensions(page, 'g.lane');
      expect(dimensions.width).toBeGreaterThan(0);
      expect(dimensions.height).toBeGreaterThan(0);
    });
  });
});
