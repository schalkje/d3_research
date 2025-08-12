import { test, expect } from '@playwright/test';

test.describe('ColumnsNode Comprehensive Tests', () => {
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

  // Helper function to wait for columns nodes specifically
  async function waitForColumnsNodes(page, timeout = 30000) {
    try {
      await page.waitForSelector('g.Node[data-type="columns"]', { timeout });
      await page.waitForTimeout(1000);
      return true;
    } catch (error) {
      console.log('Failed to find columns node elements:', error.message);
      return false;
    }
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
    const children = parent.locator('g.Node[data-parent]');
    
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

  test.describe('Basic Columns Tests', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/05_columnsNodes/01_basic/basic.html');
      await page.waitForSelector('svg', { timeout: 10000 });
      await page.waitForFunction(() => window.flowdash !== undefined, { timeout: 15000 });
      await page.waitForTimeout(2000);
    });

    test('should render basic columns node with correct initial dimensions', async ({ page }) => {
      const nodesFound = await waitForColumnsNodes(page);
      expect(nodesFound).toBe(true);
      
      const columnsNodes = page.locator('g.Node[data-type="columns"]');
      await expect(columnsNodes).toHaveCount(1);
      
      const dimensions = await getNodeDimensions(page, 'g.Node[data-type="columns"]');
      
      // Verify initial dimensions are reasonable
      expect(dimensions.width).toBeGreaterThan(100);
      expect(dimensions.height).toBeGreaterThan(50);
      expect(dimensions.x).toBeDefined();
      expect(dimensions.y).toBeDefined();
    });

    test('should position child nodes in horizontal row', async ({ page }) => {
      const nodesFound = await waitForColumnsNodes(page);
      expect(nodesFound).toBe(true);
      
      const columnsNode = page.locator('g.Node[data-type="columns"]').first();
      const children = columnsNode.locator('g.Node[data-parent]');
      
      await expect(children).toHaveCount(3);
      
      const positions = await getChildPositions(page, 'g.Node[data-type="columns"]');
      
      // Verify children are arranged horizontally (x increases)
      expect(positions.length).toBe(3);
      
      // Check horizontal arrangement order
      for (let i = 1; i < positions.length; i++) {
        const prevX = positions[i-1].x;
        const currX = positions[i].x;
        expect(currX).toBeGreaterThan(prevX);
      }
      
      // Check vertical centering (all children should have similar y positions)
      const yPositions = positions.map(p => p.y);
      const avgY = yPositions.reduce((a, b) => a + b, 0) / yPositions.length;
      
      for (const pos of positions) {
        // Allow some tolerance for centering
        expect(Math.abs(pos.y - avgY)).toBeLessThan(50);
      }
    });
  });

  test.describe('Columns with 3 Rectangles - Default Mode', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/05_columnsNodes/01_simple-tests/01_default-mode/default-mode.html');
      await page.waitForSelector('svg', { timeout: 10000 });
      await page.waitForFunction(() => window.flowdash !== undefined, { timeout: 15000 });
      await page.waitForTimeout(2000);
    });

    test('should maintain proper spacing between child nodes', async ({ page }) => {
      const nodesFound = await waitForColumnsNodes(page);
      expect(nodesFound).toBe(true);
      
      const positions = await getChildPositions(page, 'g.Node[data-type="columns"]');
      
      // Calculate spacing between consecutive children
      const spacings = [];
      for (let i = 1; i < positions.length; i++) {
        const prevRight = positions[i-1].x + positions[i-1].width;
        const currLeft = positions[i].x;
        const spacing = currLeft - prevRight;
        spacings.push(spacing);
      }
      
      // Verify consistent spacing (default is 20px)
      for (const spacing of spacings) {
        expect(spacing).toBeCloseTo(20, 1); // Allow 1px tolerance
      }
    });

    test('should calculate container width based on child content', async ({ page }) => {
      const nodesFound = await waitForColumnsNodes(page);
      expect(nodesFound).toBe(true);
      
      const columnsNode = page.locator('g.Node[data-type="columns"]').first();
      const children = columnsNode.locator('g.Node[data-parent]');
      
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
      
      // Calculate expected width
      const totalChildWidth = childDimensions.reduce((sum, child) => sum + child.width, 0);
      const expectedSpacing = (childDimensions.length - 1) * 20; // 20px spacing
      const expectedWidth = totalChildWidth + expectedSpacing + 16; // + margins (8px left + 8px right)
      
      // Get actual columns width
      const columnsRect = columnsNode.locator('rect').first();
      const actualWidth = await columnsRect.getAttribute('width');
      
      // Verify width is close to expected (allow some tolerance)
      expect(parseFloat(actualWidth)).toBeCloseTo(expectedWidth, -1); // Allow 10px tolerance
    });
  });

  test.describe('Columns Collapse/Expand Tests', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/05_columnsNodes/01_simple-tests/01_default-mode/default-mode.html');
      await page.waitForSelector('svg', { timeout: 10000 });
      await page.waitForFunction(() => window.flowdash !== undefined, { timeout: 15000 });
      await page.waitForTimeout(2000);
    });

    test('should collapse columns and hide children', async ({ page }) => {
      const nodesFound = await waitForColumnsNodes(page);
      expect(nodesFound).toBe(true);
      
      const columnsNode = page.locator('g.Node[data-type="columns"]').first();
      
      // Get initial dimensions
      const initialDimensions = await getNodeDimensions(page, 'g.Node[data-type="columns"]');
      
      // Click zoom button to collapse
      await clickZoomButton(page, 'g.Node[data-type="columns"]');
      
      // Wait for collapse animation
      await page.waitForTimeout(1000);
      
      // Get collapsed dimensions
      const collapsedDimensions = await getNodeDimensions(page, 'g.Node[data-type="columns"]');
      
      // Verify height is reduced (collapsed)
      expect(collapsedDimensions.height).toBeLessThan(initialDimensions.height);
      
      // Verify children are hidden
      const children = columnsNode.locator('g.Node[data-parent]');
      for (let i = 0; i < await children.count(); i++) {
        const child = children.nth(i);
        await expect(child).not.toBeVisible();
      }
    });

    test('should expand columns and show children', async ({ page }) => {
      const nodesFound = await waitForColumnsNodes(page);
      expect(nodesFound).toBe(true);
      
      const columnsNode = page.locator('g.Node[data-type="columns"]').first();
      
      // First collapse the columns
      await clickZoomButton(page, 'g.Node[data-type="columns"]');
      await page.waitForTimeout(1000);
      
      // Get collapsed dimensions
      const collapsedDimensions = await getNodeDimensions(page, 'g.Node[data-type="columns"]');
      
      // Click zoom button again to expand
      await clickZoomButton(page, 'g.Node[data-type="columns"]');
      await page.waitForTimeout(1000);
      
      // Get expanded dimensions
      const expandedDimensions = await getNodeDimensions(page, 'g.Node[data-type="columns"]');
      
      // Verify height is restored
      expect(expandedDimensions.height).toBeGreaterThan(collapsedDimensions.height);
      
      // Verify children are visible again
      const children = columnsNode.locator('g.Node[data-parent]');
      for (let i = 0; i < await children.count(); i++) {
        const child = children.nth(i);
        await expect(child).toBeVisible();
      }
    });

    test('should maintain child positioning after expand/collapse cycle', async ({ page }) => {
      const nodesFound = await waitForColumnsNodes(page);
      expect(nodesFound).toBe(true);
      
      // Get initial child positions
      const initialPositions = await getChildPositions(page, 'g.Node[data-type="columns"]');
      
      // Collapse and expand
      await clickZoomButton(page, 'g.Node[data-type="columns"]');
      await page.waitForTimeout(1000);
      await clickZoomButton(page, 'g.Node[data-type="columns"]');
      await page.waitForTimeout(1000);
      
      // Get final child positions
      const finalPositions = await getChildPositions(page, 'g.Node[data-type="columns"]');
      
      // Verify positions are restored (allow small tolerance for rounding)
      expect(finalPositions.length).toBe(initialPositions.length);
      
      for (let i = 0; i < initialPositions.length; i++) {
        expect(finalPositions[i].x).toBeCloseTo(initialPositions[i].x, 1);
        expect(finalPositions[i].y).toBeCloseTo(initialPositions[i].y, 1);
      }
    });
  });

  test.describe('Nested Columns Tests', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/05_columnsNodes/02_nested-tests/05_nested-columns/nested-columns.html');
      await page.waitForSelector('svg', { timeout: 10000 });
      await page.waitForFunction(() => window.flowdash !== undefined, { timeout: 15000 });
      await page.waitForTimeout(2000);
    });

    test('should handle nested columns collapse/expand correctly', async ({ page }) => {
      const nodesFound = await waitForColumnsNodes(page);
      expect(nodesFound).toBe(true);
      
      // Find nested columns
      const nestedColumns = page.locator('g.Node[data-type="columns"][data-parent]');
      await expect(nestedColumns).toHaveCount(2); // Should have 2 nested columns (left-section, right-section)
      
      // Test collapsing the left section
      const leftSection = page.locator('g.Node[data-id="left-section"]');
      const initialWidth = await leftSection.locator('rect').first().getAttribute('width');
      
      // Click zoom button on left section
      const zoomButton = leftSection.locator('circle.zoom-button');
      await zoomButton.click();
      await page.waitForTimeout(1000);
      
      // Verify left section collapsed
      const collapsedWidth = await leftSection.locator('rect').first().getAttribute('width');
      expect(parseFloat(collapsedWidth)).toBeLessThan(parseFloat(initialWidth));
      
      // Verify parent columns adjusted width
      const parentColumns = page.locator('g.Node[data-id="parent-columns"]');
      const parentRect = parentColumns.locator('rect').first();
      const parentWidth = await parentRect.getAttribute('width');
      
      // Parent should be smaller after left section collapse
      expect(parseFloat(parentWidth)).toBeLessThan(parseFloat(initialWidth));
    });

    test('should maintain proper spacing in nested structure', async ({ page }) => {
      const nodesFound = await waitForColumnsNodes(page);
      expect(nodesFound).toBe(true);
      
      // Get all columns nodes
      const allColumns = page.locator('g.Node[data-type="columns"]');
      const columnsCount = await allColumns.count();
      
      // Verify we have the expected structure
      expect(columnsCount).toBeGreaterThanOrEqual(3); // 1 parent + 2 nested
      
      // Check that nested columns are properly positioned within parent
      const parentColumns = page.locator('g.Node[data-id="parent-columns"]');
      const nestedColumns = page.locator('g.Node[data-type="columns"][data-parent]');
      
      for (let i = 0; i < await nestedColumns.count(); i++) {
        const nestedColumn = nestedColumns.nth(i);
        const parentRect = parentColumns.locator('rect').first();
        const nestedRect = nestedColumn.locator('rect').first();
        
        const parentBounds = await getNodeDimensions(page, 'g.Node[data-id="parent-columns"]');
        const nestedBounds = await getNodeDimensions(page, `g.Node[data-type="columns"][data-parent]:nth-child(${i+1})`);
        
        // Nested column should be within parent bounds
        expect(nestedBounds.x).toBeGreaterThanOrEqual(parentBounds.x);
        expect(nestedBounds.y).toBeGreaterThanOrEqual(parentBounds.y);
        expect(nestedBounds.x + nestedBounds.width).toBeLessThanOrEqual(parentBounds.x + parentBounds.width);
        expect(nestedBounds.y + nestedBounds.height).toBeLessThanOrEqual(parentBounds.y + parentBounds.height);
      }
    });

    test('should handle mixed children types correctly', async ({ page }) => {
      const nodesFound = await waitForColumnsNodes(page);
      expect(nodesFound).toBe(true);
      
      const parentColumns = page.locator('g.Node[data-id="parent-columns"]');
      const children = parentColumns.locator('g.Node[data-parent]');
      
      // Should have 3 children: left-section (columns), middle-rect (rect), right-section (columns)
      await expect(children).toHaveCount(3);
      
      // Verify left section is columns type
      const leftSection = page.locator('g.Node[data-id="left-section"]');
      const leftType = await leftSection.attr('data-type');
      expect(leftType).toBe('columns');
      
      // Verify middle is rect type
      const middleRect = page.locator('g.Node[data-id="middle-rect"]');
      const middleType = await middleRect.attr('data-type');
      expect(middleType).toBe('rect');
      
      // Verify right section is columns type
      const rightSection = page.locator('g.Node[data-id="right-section"]');
      const rightType = await rightSection.attr('data-type');
      expect(rightType).toBe('columns');
    });
  });

  test.describe('Dynamic Columns Tests', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/05_columnsNodes/01_simple-tests/04_dynamic-addition/dynamic-addition.html');
      await page.waitForSelector('svg', { timeout: 10000 });
      await page.waitForFunction(() => window.flowdash !== undefined, { timeout: 15000 });
      await page.waitForTimeout(2000);
    });

    test('should add new children and recalculate layout', async ({ page }) => {
      const nodesFound = await waitForColumnsNodes(page);
      expect(nodesFound).toBe(true);
      
      // Get initial child count
      const columnsNode = page.locator('g.Node[data-type="columns"]').first();
      const initialChildren = columnsNode.locator('g.Node[data-parent]');
      const initialCount = await initialChildren.count();
      
      // Get initial dimensions
      const initialDimensions = await getNodeDimensions(page, 'g.Node[data-type="columns"]');
      
      // Click add button to add new child
      const addButton = page.locator('#addBtn');
      await addButton.click();
      await page.waitForTimeout(1000);
      
      // Verify new child was added
      const finalChildren = columnsNode.locator('g.Node[data-parent]');
      const finalCount = await finalChildren.count();
      expect(finalCount).toBe(initialCount + 1);
      
      // Verify container width increased
      const finalDimensions = await getNodeDimensions(page, 'g.Node[data-type="columns"]');
      expect(finalDimensions.width).toBeGreaterThan(initialDimensions.width);
      
      // Verify new child is properly positioned
      const positions = await getChildPositions(page, 'g.Node[data-type="columns"]');
      expect(positions.length).toBe(finalCount);
      
      // Check horizontal arrangement order is maintained
      for (let i = 1; i < positions.length; i++) {
        const prevX = positions[i-1].x;
        const currX = positions[i].x;
        expect(currX).toBeGreaterThan(prevX);
      }
    });

    test('should remove children and recalculate layout', async ({ page }) => {
      const nodesFound = await waitForColumnsNodes(page);
      expect(nodesFound).toBe(true);
      
      // Get initial child count
      const columnsNode = page.locator('g.Node[data-type="columns"]').first();
      const initialChildren = columnsNode.locator('g.Node[data-parent]');
      const initialCount = await initialChildren.count();
      
      // Get initial dimensions
      const initialDimensions = await getNodeDimensions(page, 'g.Node[data-type="columns"]');
      
      // Click remove button to remove a child
      const removeButton = page.locator('#removeBtn');
      await removeButton.click();
      await page.waitForTimeout(1000);
      
      // Verify child was removed
      const finalChildren = columnsNode.locator('g.Node[data-parent]');
      const finalCount = await finalChildren.count();
      expect(finalCount).toBe(initialCount - 1);
      
      // Verify container width decreased
      const finalDimensions = await getNodeDimensions(page, 'g.Node[data-type="columns"]');
      expect(finalDimensions.width).toBeLessThan(initialDimensions.width);
      
      // Verify remaining children are properly positioned
      const positions = await getChildPositions(page, 'g.Node[data-type="columns"]');
      expect(positions.length).toBe(finalCount);
      
      // Check horizontal arrangement order is maintained
      for (let i = 1; i < positions.length; i++) {
        const prevX = positions[i-1].x;
        const currX = positions[i].x;
        expect(currX).toBeGreaterThan(prevX);
      }
    });
  });

  test.describe('Columns Sizing Tests', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/05_columnsNodes/01_simple-tests/01_default-mode/default-mode.html');
      await page.waitForSelector('svg', { timeout: 10000 });
      await page.waitForFunction(() => window.flowdash !== undefined, { timeout: 15000 });
      await page.waitForTimeout(2000);
    });

    test('should maintain minimum height when children are short', async ({ page }) => {
      const nodesFound = await waitForColumnsNodes(page);
      expect(nodesFound).toBe(true);
      
      const columnsNode = page.locator('g.Node[data-type="columns"]').first();
      const columnsRect = columnsNode.locator('rect').first();
      
      const width = await columnsRect.getAttribute('width');
      const height = await columnsRect.getAttribute('height');
      
      // Columns should have reasonable minimum dimensions
      expect(parseFloat(width)).toBeGreaterThan(100);
      expect(parseFloat(height)).toBeGreaterThan(50);
    });

    test('should expand height to accommodate tall children', async ({ page }) => {
      const nodesFound = await waitForColumnsNodes(page);
      expect(nodesFound).toBe(true);
      
      const columnsNode = page.locator('g.Node[data-type="columns"]').first();
      const children = columnsNode.locator('g.Node[data-parent]');
      
      // Find the tallest child
      let maxChildHeight = 0;
      for (let i = 0; i < await children.count(); i++) {
        const child = children.nth(i);
        const rect = child.locator('rect').first();
        const height = await rect.getAttribute('height');
        maxChildHeight = Math.max(maxChildHeight, parseFloat(height));
      }
      
      // Columns height should be at least as tall as the tallest child (plus margins)
      const columnsRect = columnsNode.locator('rect').first();
      const columnsHeight = await columnsRect.getAttribute('height');
      
      expect(parseFloat(columnsHeight)).toBeGreaterThanOrEqual(maxChildHeight);
    });
  });

  test.describe('Columns Auto-Size Tests', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/05_columnsNodes/01_simple-tests/02_auto-size-mode/auto-size-mode.html');
      await page.waitForSelector('svg', { timeout: 10000 });
      await page.waitForFunction(() => window.flowdash !== undefined, { timeout: 15000 });
      await page.waitForTimeout(2000);
    });

    test('should auto-size columns based on child content', async ({ page }) => {
      const nodesFound = await waitForColumnsNodes(page);
      expect(nodesFound).toBe(true);
      
      const columnsNode = page.locator('g.Node[data-type="columns"]').first();
      const children = columnsNode.locator('g.Node[data-parent]');
      
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
      
      // Calculate expected dimensions
      const totalChildWidth = childDimensions.reduce((sum, child) => sum + child.width, 0);
      const expectedSpacing = (childDimensions.length - 1) * 20; // 20px spacing
      const expectedWidth = totalChildWidth + expectedSpacing + 16; // + margins
      const maxChildHeight = Math.max(...childDimensions.map(child => child.height));
      const expectedHeight = maxChildHeight + 36; // + margins and header
      
      // Get actual columns dimensions
      const columnsRect = columnsNode.locator('rect').first();
      const actualWidth = await columnsRect.getAttribute('width');
      const actualHeight = await columnsRect.getAttribute('height');
      
      // Verify dimensions are close to expected (allow tolerance)
      expect(parseFloat(actualWidth)).toBeCloseTo(expectedWidth, -1); // Allow 10px tolerance
      expect(parseFloat(actualHeight)).toBeCloseTo(expectedHeight, -1); // Allow 10px tolerance
    });
  });

  test.describe('Columns Fixed-Size Tests', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/05_columnsNodes/01_simple-tests/03_fixed-size-mode/fixed-size-mode.html');
      await page.waitForSelector('svg', { timeout: 10000 });
      await page.waitForFunction(() => window.flowdash !== undefined, { timeout: 15000 });
      await page.waitForTimeout(2000);
    });

    test('should maintain fixed dimensions regardless of child content', async ({ page }) => {
      const nodesFound = await waitForColumnsNodes(page);
      expect(nodesFound).toBe(true);
      
      const columnsNode = page.locator('g.Node[data-type="columns"]').first();
      const columnsRect = columnsNode.locator('rect').first();
      
      const initialWidth = await columnsRect.getAttribute('width');
      const initialHeight = await columnsRect.getAttribute('height');
      
      // Add a child to see if dimensions change
      const addButton = page.locator('#addBtn');
      if (await addButton.isVisible()) {
        await addButton.click();
        await page.waitForTimeout(1000);
        
        // Dimensions should remain the same in fixed mode
        const finalWidth = await columnsRect.getAttribute('width');
        const finalHeight = await columnsRect.getAttribute('height');
        
        expect(parseFloat(finalWidth)).toBeCloseTo(parseFloat(initialWidth), 1);
        expect(parseFloat(finalHeight)).toBeCloseTo(parseFloat(initialHeight), 1);
      }
    });
  });

  test.describe('Columns Performance Tests', () => {
    test('should handle many children efficiently', async ({ page }) => {
      // This test would be for performance validation
      // Could be implemented with a demo that has many children
      test.skip('Performance test - implement with large dataset');
    });

    test('should handle rapid collapse/expand operations', async ({ page }) => {
      await page.goto('/05_columnsNodes/01_simple-tests/01_default-mode/default-mode.html');
      await page.waitForSelector('svg', { timeout: 10000 });
      await page.waitForFunction(() => window.flowdash !== undefined, { timeout: 15000 });
      await page.waitForTimeout(2000);
      
      const nodesFound = await waitForColumnsNodes(page);
      expect(nodesFound).toBe(true);
      
      const columnsNode = page.locator('g.Node[data-type="columns"]').first();
      const zoomButton = columnsNode.locator('circle.zoom-button');
      
      // Perform rapid collapse/expand operations
      for (let i = 0; i < 5; i++) {
        await zoomButton.click();
        await page.waitForTimeout(200);
        await zoomButton.click();
        await page.waitForTimeout(200);
      }
      
      // Verify final state is correct
      const children = columnsNode.locator('g.Node[data-parent]');
      await expect(children).toBeVisible();
      
      // Verify all children are visible
      for (let i = 0; i < await children.count(); i++) {
        const child = children.nth(i);
        await expect(child).toBeVisible();
      }
    });
  });

  test.describe('Columns Edge Cases', () => {
    test('should handle empty columns gracefully', async ({ page }) => {
      // This test would be for edge case validation
      // Could be implemented with a demo that has no children
      test.skip('Edge case test - implement with empty columns demo');
    });

    test('should handle single child correctly', async ({ page }) => {
      await page.goto('/05_columnsNodes/01_basic/basic.html');
      await page.waitForSelector('svg', { timeout: 10000 });
      await page.waitForFunction(() => window.flowdash !== undefined, { timeout: 15000 });
      await page.waitForTimeout(2000);
      
      const nodesFound = await waitForColumnsNodes(page);
      expect(nodesFound).toBe(true);
      
      const columnsNode = page.locator('g.Node[data-type="columns"]').first();
      const children = columnsNode.locator('g.Node[data-parent]');
      
      // Should have at least one child
      const childCount = await children.count();
      expect(childCount).toBeGreaterThan(0);
      
      if (childCount === 1) {
        // Single child should be centered
        const child = children.first();
        const childRect = child.locator('rect').first();
        const columnsRect = columnsNode.locator('rect').first();
        
        const childX = await childRect.getAttribute('x');
        const childWidth = await childRect.getAttribute('width');
        const columnsX = await columnsRect.getAttribute('x');
        const columnsWidth = await columnsRect.getAttribute('width');
        
        // Child should be roughly centered
        const childCenter = parseFloat(childX) + parseFloat(childWidth) / 2;
        const columnsCenter = parseFloat(columnsX) + parseFloat(columnsWidth) / 2;
        
        expect(Math.abs(childCenter - columnsCenter)).toBeLessThan(50); // Allow tolerance
      }
    });
  });
});
