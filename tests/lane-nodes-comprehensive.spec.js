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
      // Try the original selector first
      try {
        await page.waitForSelector('g.Node[data-type="lane"]', { timeout: 5000 });
        await page.waitForTimeout(1000);
        return true;
      } catch (error) {
        // Fallback to CSS class selector based on actual rendering
        await page.waitForSelector('g.lane', { timeout });
        await page.waitForTimeout(1000);
        return true;
      }
    } catch (error) {
      console.log('Failed to find lane node elements:', error.message);
      return false;
    }
  }

  // Helper function to get lane node selector (works with both data-type and CSS class)
  function getLaneNodeSelector() {
    return 'g.lane, g.Node[data-type="lane"]';
  }

  // Helper function to get child node selector (works with both data-parent and CSS class)
  function getChildNodeSelector() {
    return 'g.rect.expanded, g.Node[data-type="rect"], g[data-parent]';
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
      const rect = child.locator('rect').first();
      
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

    test('should position child nodes in vertical stack', async ({ page }) => {
      const nodesFound = await waitForLaneNodes(page);
      expect(nodesFound).toBe(true);
      
      const laneNode = page.locator(getLaneNodeSelector()).first();
      const children = laneNode.locator(getChildNodeSelector());
      
      await expect(children).toHaveCount(3);
      
      const positions = await getChildPositions(page, getLaneNodeSelector());
      
      // Debug: Log the actual positions
      console.log('Child positions:', positions);
      
      // Verify children are stacked vertically (y increases)
      expect(positions.length).toBe(3);
      
      // Check vertical stacking order
      for (let i = 1; i < positions.length; i++) {
        const prevY = positions[i-1].y;
        const currY = positions[i].y;
        expect(currY).toBeGreaterThan(prevY);
      }
      
      // Check horizontal centering (all children should have similar x positions)
      const xPositions = positions.map(p => p.x);
      const avgX = xPositions.reduce((a, b) => a + b, 0) / xPositions.length;
      
      for (const pos of positions) {
        // Allow some tolerance for centering
        expect(Math.abs(pos.x - avgX)).toBeLessThan(50);
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

    test('should maintain proper spacing between child nodes', async ({ page }) => {
      const nodesFound = await waitForLaneNodes(page);
      expect(nodesFound).toBe(true);
      
      const positions = await getChildPositions(page, 'g.Node[data-type="lane"]');
      
      // Calculate spacing between consecutive children
      const spacings = [];
      for (let i = 1; i < positions.length; i++) {
        const prevBottom = positions[i-1].y + positions[i-1].height;
        const currTop = positions[i].y;
        const spacing = currTop - prevBottom;
        spacings.push(spacing);
      }
      
      // Verify consistent spacing (default is 10px)
      for (const spacing of spacings) {
        expect(spacing).toBeCloseTo(10, 1); // Allow 1px tolerance
      }
    });

    test('should calculate container height based on child content', async ({ page }) => {
      const nodesFound = await waitForLaneNodes(page);
      expect(nodesFound).toBe(true);
      
      const laneNode = page.locator('g.Node[data-type="lane"]').first();
      const children = laneNode.locator('g.Node[data-parent]');
      
      // Get child dimensions
      const childDimensions = [];
      for (let i = 0; i < await children.count(); i++) {
        const child = children.nth(i);
        const rect = child.locator('rect').first();
        const width = await rect.getAttribute('width');
        const height = await rect.getAttribute('height');
        childDimensions.push({
          width: parseFloat(width),
          height: parseFloat(height)
        });
      }
      
      // Calculate expected height
      const totalChildHeight = childDimensions.reduce((sum, child) => sum + child.height, 0);
      const expectedSpacing = (childDimensions.length - 1) * 10; // 10px spacing
      const expectedHeight = totalChildHeight + expectedSpacing + 36; // + margins and header
      
      // Get actual lane height
      const laneRect = laneNode.locator('rect').first();
      const actualHeight = await laneRect.getAttribute('height');
      
      // Verify height is close to expected (allow some tolerance)
      expect(parseFloat(actualHeight)).toBeCloseTo(expectedHeight, -1); // Allow 10px tolerance
    });
  });

  test.describe('Lane Collapse/Expand Tests', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/04_laneNodes/01_simple-tests/01_default-mode/default-mode.html');
      await page.waitForSelector('svg', { timeout: 10000 });
      await page.waitForFunction(() => window.flowdash !== undefined, { timeout: 15000 });
      await page.waitForTimeout(2000);
    });

    test('should collapse lane and hide children', async ({ page }) => {
      const nodesFound = await waitForLaneNodes(page);
      expect(nodesFound).toBe(true);
      
      const laneNode = page.locator('g.Node[data-type="lane"]').first();
      
      // Get initial dimensions
      const initialDimensions = await getNodeDimensions(page, 'g.Node[data-type="lane"]');
      
      // Click zoom button to collapse
      await clickZoomButton(page, 'g.Node[data-type="lane"]');
      
      // Wait for collapse animation
      await page.waitForTimeout(1000);
      
      // Get collapsed dimensions
      const collapsedDimensions = await getNodeDimensions(page, 'g.Node[data-type="lane"]');
      
      // Verify height is reduced (collapsed)
      expect(collapsedDimensions.height).toBeLessThan(initialDimensions.height);
      
      // Verify children are hidden
      const children = laneNode.locator('g.Node[data-parent]');
      for (let i = 0; i < await children.count(); i++) {
        const child = children.nth(i);
        await expect(child).not.toBeVisible();
      }
    });

    test('should expand lane and show children', async ({ page }) => {
      const nodesFound = await waitForLaneNodes(page);
      expect(nodesFound).toBe(true);
      
      const laneNode = page.locator('g.Node[data-type="lane"]').first();
      
      // First collapse the lane
      await clickZoomButton(page, 'g.Node[data-type="lane"]');
      await page.waitForTimeout(1000);
      
      // Get collapsed dimensions
      const collapsedDimensions = await getNodeDimensions(page, 'g.Node[data-type="lane"]');
      
      // Click zoom button again to expand
      await clickZoomButton(page, 'g.Node[data-type="lane"]');
      await page.waitForTimeout(1000);
      
      // Get expanded dimensions
      const expandedDimensions = await getNodeDimensions(page, 'g.Node[data-type="lane"]');
      
      // Verify height is restored
      expect(expandedDimensions.height).toBeGreaterThan(collapsedDimensions.height);
      
      // Verify children are visible again
      const children = laneNode.locator('g.Node[data-parent]');
      for (let i = 0; i < await children.count(); i++) {
        const child = children.nth(i);
        await expect(child).toBeVisible();
      }
    });

    test('should maintain child positioning after expand/collapse cycle', async ({ page }) => {
      const nodesFound = await waitForLaneNodes(page);
      expect(nodesFound).toBe(true);
      
      // Get initial child positions
      const initialPositions = await getChildPositions(page, 'g.Node[data-type="lane"]');
      
      // Collapse and expand
      await clickZoomButton(page, 'g.Node[data-type="lane"]');
      await page.waitForTimeout(1000);
      await clickZoomButton(page, 'g.Node[data-type="lane"]');
      await page.waitForTimeout(1000);
      
      // Get final child positions
      const finalPositions = await getChildPositions(page, 'g.Node[data-type="lane"]');
      
      // Verify positions are restored (allow small tolerance for rounding)
      expect(finalPositions.length).toBe(initialPositions.length);
      
      for (let i = 0; i < initialPositions.length; i++) {
        expect(finalPositions[i].x).toBeCloseTo(initialPositions[i].x, 1);
        expect(finalPositions[i].y).toBeCloseTo(initialPositions[i].y, 1);
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

    test('should handle nested lane collapse/expand correctly', async ({ page }) => {
      const nodesFound = await waitForLaneNodes(page);
      expect(nodesFound).toBe(true);
      
      // Find nested lanes
      const nestedLanes = page.locator('g.Node[data-type="lane"][data-parent]');
      await expect(nestedLanes).toHaveCount(2); // Should have 2 nested lanes
      
      // Test collapsing a nested lane
      const firstNestedLane = nestedLanes.first();
      const initialHeight = await firstNestedLane.locator('rect').first().getAttribute('height');
      
      // Click zoom button on nested lane
      const zoomButton = firstNestedLane.locator('circle.zoom-button');
      await zoomButton.click();
      await page.waitForTimeout(1000);
      
      // Verify nested lane collapsed
      const collapsedHeight = await firstNestedLane.locator('rect').first().getAttribute('height');
      expect(parseFloat(collapsedHeight)).toBeLessThan(parseFloat(initialHeight));
      
      // Verify parent lane adjusted height
      const parentLane = page.locator('g.Node[data-type="lane"]:not([data-parent])').first();
      const parentRect = parentLane.locator('rect').first();
      const parentHeight = await parentRect.getAttribute('height');
      
      // Parent should be smaller after nested lane collapse
      expect(parseFloat(parentHeight)).toBeLessThan(parseFloat(initialHeight));
    });

    test('should maintain proper spacing in nested structure', async ({ page }) => {
      const nodesFound = await waitForLaneNodes(page);
      expect(nodesFound).toBe(true);
      
      // Get all lane nodes
      const allLanes = page.locator('g.Node[data-type="lane"]');
      const laneCount = await allLanes.count();
      
      // Verify we have the expected structure
      expect(laneCount).toBeGreaterThanOrEqual(3); // 1 parent + 2 nested
      
      // Check that nested lanes are properly positioned within parent
      const parentLane = page.locator('g.Node[data-type="lane"]:not([data-parent])').first();
      const nestedLanes = page.locator('g.Node[data-type="lane"][data-parent]');
      
      for (let i = 0; i < await nestedLanes.count(); i++) {
        const nestedLane = nestedLanes.nth(i);
        const parentRect = parentLane.locator('rect').first();
        const nestedRect = nestedLane.locator('rect').first();
        
        const parentBounds = await getNodeDimensions(page, 'g.Node[data-type="lane"]:not([data-parent])');
        const nestedBounds = await getNodeDimensions(page, `g.Node[data-type="lane"][data-parent]:nth-child(${i+1})`);
        
        // Nested lane should be within parent bounds
        expect(nestedBounds.x).toBeGreaterThanOrEqual(parentBounds.x);
        expect(nestedBounds.y).toBeGreaterThanOrEqual(parentBounds.y);
        expect(nestedBounds.x + nestedBounds.width).toBeLessThanOrEqual(parentBounds.x + parentBounds.width);
        expect(nestedBounds.y + nestedBounds.height).toBeLessThanOrEqual(parentBounds.y + parentBounds.height);
      }
    });
  });

  test.describe('Dynamic Lane Tests', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/04_laneNodes/01_simple-tests/05_dynamic-addition/dynamic-addition.html');
      await page.waitForSelector('svg', { timeout: 10000 });
      await page.waitForFunction(() => window.flowdash !== undefined, { timeout: 15000 });
      await page.waitForTimeout(2000);
    });

    test('should add new children and recalculate layout', async ({ page }) => {
      const nodesFound = await waitForLaneNodes(page);
      expect(nodesFound).toBe(true);
      
      // Get initial child count
      const laneNode = page.locator('g.Node[data-type="lane"]').first();
      const initialChildren = laneNode.locator('g.Node[data-parent]');
      const initialCount = await initialChildren.count();
      
      // Get initial dimensions
      const initialDimensions = await getNodeDimensions(page, 'g.Node[data-type="lane"]');
      
      // Click add button to add new child
      const addButton = page.locator('#addBtn');
      await addButton.click();
      await page.waitForTimeout(1000);
      
      // Verify new child was added
      const finalChildren = laneNode.locator('g.Node[data-parent]');
      const finalCount = await finalChildren.count();
      expect(finalCount).toBe(initialCount + 1);
      
      // Verify container height increased
      const finalDimensions = await getNodeDimensions(page, 'g.Node[data-type="lane"]');
      expect(finalDimensions.height).toBeGreaterThan(initialDimensions.height);
      
      // Verify new child is properly positioned
      const positions = await getChildPositions(page, 'g.Node[data-type="lane"]');
      expect(positions.length).toBe(finalCount);
      
      // Check vertical stacking order is maintained
      for (let i = 1; i < positions.length; i++) {
        const prevY = positions[i-1].y;
        const currY = positions[i].y;
        expect(currY).toBeGreaterThan(prevY);
      }
    });

    test('should remove children and recalculate layout', async ({ page }) => {
      const nodesFound = await waitForLaneNodes(page);
      expect(nodesFound).toBe(true);
      
      // Get initial child count
      const laneNode = page.locator('g.Node[data-type="lane"]').first();
      const initialChildren = laneNode.locator('g.Node[data-parent]');
      const initialCount = await initialChildren.count();
      
      // Get initial dimensions
      const initialDimensions = await getNodeDimensions(page, 'g.Node[data-type="lane"]');
      
      // Click remove button to remove a child
      const removeButton = page.locator('#removeBtn');
      await removeButton.click();
      await page.waitForTimeout(1000);
      
      // Verify child was removed
      const finalChildren = laneNode.locator('g.Node[data-parent]');
      const finalCount = await finalChildren.count();
      expect(finalCount).toBe(initialCount - 1);
      
      // Verify container height decreased
      const finalDimensions = await getNodeDimensions(page, 'g.Node[data-type="lane"]');
      expect(finalDimensions.height).toBeLessThan(initialDimensions.height);
      
      // Verify remaining children are properly positioned
      const positions = await getChildPositions(page, 'g.Node[data-type="lane"]');
      expect(positions.length).toBe(finalCount);
      
      // Check vertical stacking order is maintained
      for (let i = 1; i < positions.length; i++) {
        const prevY = positions[i-1].y;
        const currY = positions[i].y;
        expect(currY).toBeGreaterThan(prevY);
      }
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
      
      const laneNode = page.locator('g.Node[data-type="lane"]').first();
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
      
      const laneNode = page.locator('g.Node[data-type="lane"]').first();
      const children = laneNode.locator('g.Node[data-parent]');
      
      // Find the widest child
      let maxChildWidth = 0;
      for (let i = 0; i < await children.count(); i++) {
        const child = children.nth(i);
        const rect = child.locator('rect').first();
        const width = await rect.getAttribute('width');
        maxChildWidth = Math.max(maxChildWidth, parseFloat(width));
      }
      
      // Lane width should be at least as wide as the widest child (plus margins)
      const laneRect = laneNode.locator('rect').first();
      const laneWidth = await laneRect.getAttribute('width');
      
      expect(parseFloat(laneWidth)).toBeGreaterThanOrEqual(maxChildWidth);
    });
  });

  test.describe('Lane Performance Tests', () => {
    test('should handle many children efficiently', async ({ page }) => {
      // This test would be for performance validation
      // Could be implemented with a demo that has many children
      test.skip('Performance test - implement with large dataset');
    });

    test('should handle rapid collapse/expand operations', async ({ page }) => {
      await page.goto('/04_laneNodes/01_simple-tests/01_default-mode/default-mode.html');
      await page.waitForSelector('svg', { timeout: 10000 });
      await page.waitForFunction(() => window.flowdash !== undefined, { timeout: 15000 });
      await page.waitForTimeout(2000);
      
      const nodesFound = await waitForLaneNodes(page);
      expect(nodesFound).toBe(true);
      
      const laneNode = page.locator('g.Node[data-type="lane"]').first();
      const zoomButton = laneNode.locator('circle.zoom-button');
      
      // Perform rapid collapse/expand operations
      for (let i = 0; i < 5; i++) {
        await zoomButton.click();
        await page.waitForTimeout(200);
        await zoomButton.click();
        await page.waitForTimeout(200);
      }
      
      // Verify final state is correct
      const children = laneNode.locator('g.Node[data-parent]');
      await expect(children).toBeVisible();
      
      // Verify all children are visible
      for (let i = 0; i < await children.count(); i++) {
        const child = children.nth(i);
        await expect(child).toBeVisible();
      }
    });
  });
});
