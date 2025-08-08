import { test, expect } from '@playwright/test';

test.describe('Lane Node Tests', () => {
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
      // Wait for node elements to appear
      await page.waitForSelector('g.Node', { timeout });
      
      // Wait a bit more for the nodes to be fully rendered
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
      // Wait for lane node elements to appear
      await page.waitForSelector('g.Node[data-type="lane"]', { timeout });
      
      // Wait a bit more for the nodes to be fully rendered
      await page.waitForTimeout(1000);
      
      return true;
    } catch (error) {
      console.log('Failed to find lane node elements:', error.message);
      return false;
    }
  }

  test.describe('Basic Lane Tests', () => {
    test.beforeEach(async ({ page }) => {
      // Navigate to the basic lane demo page
      await page.goto('/04_laneNodes/01_basic/basic.html');
      
      // Wait for the page to load and SVG to appear
      await page.waitForSelector('svg', { timeout: 10000 });
      
      // Wait for the dashboard to be initialized
      await page.waitForFunction(() => {
        return window.flowdash !== undefined;
      }, { timeout: 15000 });
      
      // Wait a bit more for the dashboard to be fully ready
      await page.waitForTimeout(2000);
    });

    test('should render basic lane node', async ({ page }) => {
      // Wait for nodes to be rendered
      const nodesFound = await waitForLaneNodes(page);
      expect(nodesFound).toBe(true);
      
      // Check for lane nodes
      const laneNodes = page.locator('g.Node[data-type="lane"]');
      await expect(laneNodes).toHaveCount(1);
      
      // Verify the lane node is visible
      const laneNode = laneNodes.first();
      await expect(laneNode).toBeVisible();
      
      // Check for lane-specific elements
      const laneRect = laneNode.locator('rect');
      await expect(laneRect).toHaveCount(1);
      await expect(laneRect).toBeVisible();
      
      // Check for lane label
      const laneText = laneNode.locator('text');
      await expect(laneText).toHaveCount(1);
      await expect(laneText).toBeVisible();
    });
  });

  test.describe('Lane with 3 Rectangles - Default Mode', () => {
    test.beforeEach(async ({ page }) => {
      // Navigate to the lane with 3 rectangles demo
      await page.goto('/04_laneNodes/01_default-mode/default-mode.html');
      
      // Wait for the page to load and SVG to appear
      await page.waitForSelector('svg', { timeout: 10000 });
      
      // Wait for the dashboard to be initialized
      await page.waitForFunction(() => {
        return window.flowdash !== undefined;
      }, { timeout: 15000 });
      
      // Wait a bit more for the dashboard to be fully ready
      await page.waitForTimeout(2000);
    });

    test('should render lane with 3 rectangles in default mode', async ({ page }) => {
      // Wait for nodes to be rendered
      const nodesFound = await waitForLaneNodes(page);
      expect(nodesFound).toBe(true);
      
      // Check for lane node
      const laneNodes = page.locator('g.Node[data-type="lane"]');
      await expect(laneNodes).toHaveCount(1);
      
      // Check for child rectangle nodes
      const childNodes = page.locator('g.Node[data-type="rect"]');
      await expect(childNodes).toHaveCount(3);
      
      // Verify all child nodes are visible
      for (let i = 0; i < 3; i++) {
        const childNode = childNodes.nth(i);
        await expect(childNode).toBeVisible();
        
        // Check for rectangle element
        const rect = childNode.locator('rect');
        await expect(rect).toHaveCount(1);
        await expect(rect).toBeVisible();
        
        // Check for text label
        const text = childNode.locator('text');
        await expect(text).toHaveCount(1);
        await expect(text).toBeVisible();
      }
    });

    test('should center child rectangles horizontally within lane', async ({ page }) => {
      // Wait for nodes to be rendered
      const nodesFound = await waitForLaneNodes(page);
      expect(nodesFound).toBe(true);
      
      // Get lane node bounds
      const laneNode = page.locator('g.Node[data-type="lane"]').first();
      const laneRect = laneNode.locator('rect').first();
      
      const laneX = await laneRect.getAttribute('x');
      const laneY = await laneRect.getAttribute('y');
      const laneWidth = await laneRect.getAttribute('width');
      const laneHeight = await laneRect.getAttribute('height');
      
      expect(laneX).toBeTruthy();
      expect(laneY).toBeTruthy();
      expect(laneWidth).toBeTruthy();
      expect(laneHeight).toBeTruthy();
      
      // Check child positioning
      const childNodes = page.locator('g.Node[data-type="rect"]');
      await expect(childNodes).toHaveCount(3);
      
      for (let i = 0; i < 3; i++) {
        const childNode = childNodes.nth(i);
        const childRect = childNode.locator('rect').first();
        
        const childX = await childRect.getAttribute('x');
        const childWidth = await childRect.getAttribute('width');
        
        expect(childX).toBeTruthy();
        expect(childWidth).toBeTruthy();
        
        // Calculate if child is centered within lane
        const childCenterX = parseFloat(childX) + parseFloat(childWidth) / 2;
        const laneCenterX = parseFloat(laneX) + parseFloat(laneWidth) / 2;
        const horizontalOffset = Math.abs(childCenterX - laneCenterX);
        
        // Allow for small positioning tolerance
        expect(horizontalOffset).toBeLessThan(5);
      }
    });

    test('should stack child rectangles vertically with proper spacing', async ({ page }) => {
      // Wait for nodes to be rendered
      const nodesFound = await waitForLaneNodes(page);
      expect(nodesFound).toBe(true);
      
      // Get child nodes
      const childNodes = page.locator('g.Node[data-type="rect"]');
      await expect(childNodes).toHaveCount(3);
      
      // Check vertical positioning
      const positions = [];
      for (let i = 0; i < 3; i++) {
        const childNode = childNodes.nth(i);
        const childRect = childNode.locator('rect').first();
        
        const childY = await childRect.getAttribute('y');
        const childHeight = await childRect.getAttribute('height');
        
        expect(childY).toBeTruthy();
        expect(childHeight).toBeTruthy();
        
        positions.push({
          y: parseFloat(childY),
          height: parseFloat(childHeight),
          bottom: parseFloat(childY) + parseFloat(childHeight)
        });
      }
      
      // Verify vertical stacking order
      expect(positions[0].y).toBeLessThan(positions[1].y);
      expect(positions[1].y).toBeLessThan(positions[2].y);
      
      // Verify spacing between nodes (should be at least 10px)
      const spacing1 = positions[1].y - positions[0].bottom;
      const spacing2 = positions[2].y - positions[1].bottom;
      
      expect(spacing1).toBeGreaterThanOrEqual(8); // Allow for small tolerance
      expect(spacing2).toBeGreaterThanOrEqual(8);
    });
  });

  test.describe('Lane with 3 Rectangles - Collapsed Mode', () => {
    test.beforeEach(async ({ page }) => {
      // Navigate to the collapsed lane demo
      await page.goto('/04_laneNodes/02_collapsed-mode/collapsed-mode.html');
      
      // Wait for the page to load and SVG to appear
      await page.waitForSelector('svg', { timeout: 10000 });
      
      // Wait for the dashboard to be initialized
      await page.waitForFunction(() => {
        return window.flowdash !== undefined;
      }, { timeout: 15000 });
      
      // Wait a bit more for the dashboard to be fully ready
      await page.waitForTimeout(2000);
    });

    test('should render collapsed lane with hidden children', async ({ page }) => {
      // Wait for nodes to be rendered
      const nodesFound = await waitForLaneNodes(page);
      expect(nodesFound).toBe(true);
      
      // Check for lane node
      const laneNodes = page.locator('g.Node[data-type="lane"]');
      await expect(laneNodes).toHaveCount(1);
      
      // Check that child nodes are not visible (collapsed)
      const childNodes = page.locator('g.Node[data-type="rect"]');
      await expect(childNodes).toHaveCount(3);
      
      // All child nodes should be hidden in collapsed mode
      for (let i = 0; i < 3; i++) {
        const childNode = childNodes.nth(i);
        await expect(childNode).not.toBeVisible();
      }
    });

    test('should show collapsed indicator on lane', async ({ page }) => {
      // Wait for nodes to be rendered
      const nodesFound = await waitForLaneNodes(page);
      expect(nodesFound).toBe(true);
      
      // Check for lane node
      const laneNode = page.locator('g.Node[data-type="lane"]').first();
      await expect(laneNode).toBeVisible();
      
      // Check for collapse indicator (usually a small icon or text)
      const collapseIndicator = laneNode.locator('[data-collapsed="true"]');
      await expect(collapseIndicator).toHaveCount(1);
    });

    test('should expand lane when clicked', async ({ page }) => {
      // Wait for nodes to be rendered
      const nodesFound = await waitForLaneNodes(page);
      expect(nodesFound).toBe(true);
      
      // Click on the lane to expand it
      const laneNode = page.locator('g.Node[data-type="lane"]').first();
      await laneNode.click();
      
      // Wait for expansion animation
      await page.waitForTimeout(1000);
      
      // Check that child nodes become visible
      const childNodes = page.locator('g.Node[data-type="rect"]');
      await expect(childNodes).toHaveCount(3);
      
      // At least one child should be visible after expansion
      const visibleChildren = childNodes.filter({ hasText: /./ });
      await expect(visibleChildren).toHaveCount(3);
    });
  });

  test.describe('Lane with Auto-Size Labels - Dynamic Changes', () => {
    test.beforeEach(async ({ page }) => {
      // Navigate to the auto-size lane demo
      await page.goto('/04_laneNodes/03_auto-size-labels/auto-size-labels.html');
      
      // Wait for the page to load and SVG to appear
      await page.waitForSelector('svg', { timeout: 10000 });
      
      // Wait for the dashboard to be initialized
      await page.waitForFunction(() => {
        return window.flowdash !== undefined;
      }, { timeout: 15000 });
      
      // Wait a bit more for the dashboard to be fully ready
      await page.waitForTimeout(2000);
    });

    test('should render lane with auto-size labels of different lengths', async ({ page }) => {
      // Wait for nodes to be rendered
      const nodesFound = await waitForLaneNodes(page);
      expect(nodesFound).toBe(true);
      
      // Check for lane node
      const laneNodes = page.locator('g.Node[data-type="lane"]');
      await expect(laneNodes).toHaveCount(1);
      
      // Check for child nodes with different label lengths
      const childNodes = page.locator('g.Node[data-type="rect"]');
      await expect(childNodes).toHaveCount(3);
      
      // Verify different label lengths
      const labels = [];
      for (let i = 0; i < 3; i++) {
        const childNode = childNodes.nth(i);
        const text = childNode.locator('text');
        await expect(text).toBeVisible();
        
        const labelText = await text.textContent();
        labels.push(labelText);
      }
      
      // Verify labels have different lengths
      expect(labels[0].length).not.toBe(labels[1].length);
      expect(labels[1].length).not.toBe(labels[2].length);
      expect(labels[0].length).not.toBe(labels[2].length);
    });

    test('should have toggle button to change labels', async ({ page }) => {
      // Check for toggle button
      const toggleButton = page.locator('#toggleLabelsBtn');
      await expect(toggleButton).toBeVisible();
      await expect(toggleButton).toHaveText('Change Labels');
    });

    test('should change labels when toggle button is clicked', async ({ page }) => {
      // Wait for nodes to be rendered
      const nodesFound = await waitForLaneNodes(page);
      expect(nodesFound).toBe(true);
      
      // Get initial labels
      const childNodes = page.locator('g.Node[data-type="rect"]');
      await expect(childNodes).toHaveCount(3);
      
      const initialLabels = [];
      for (let i = 0; i < 3; i++) {
        const childNode = childNodes.nth(i);
        const text = childNode.locator('text');
        const labelText = await text.textContent();
        initialLabels.push(labelText);
      }
      
      // Click toggle button
      const toggleButton = page.locator('#toggleLabelsBtn');
      await toggleButton.click();
      
      // Wait for label changes
      await page.waitForTimeout(1000);
      
      // Get new labels
      const newLabels = [];
      for (let i = 0; i < 3; i++) {
        const childNode = childNodes.nth(i);
        const text = childNode.locator('text');
        const labelText = await text.textContent();
        newLabels.push(labelText);
      }
      
      // Verify labels have changed
      expect(newLabels).not.toEqual(initialLabels);
      
      // Verify all labels are different from initial
      for (let i = 0; i < 3; i++) {
        expect(newLabels[i]).not.toBe(initialLabels[i]);
      }
    });

    test('should maintain auto-sizing when labels change', async ({ page }) => {
      // Wait for nodes to be rendered
      const nodesFound = await waitForLaneNodes(page);
      expect(nodesFound).toBe(true);
      
      // Get initial node sizes
      const childNodes = page.locator('g.Node[data-type="rect"]');
      await expect(childNodes).toHaveCount(3);
      
      const initialSizes = [];
      for (let i = 0; i < 3; i++) {
        const childNode = childNodes.nth(i);
        const rect = childNode.locator('rect').first();
        const width = await rect.getAttribute('width');
        const height = await rect.getAttribute('height');
        initialSizes.push({ width: parseFloat(width), height: parseFloat(height) });
      }
      
      // Click toggle button multiple times
      const toggleButton = page.locator('#toggleLabelsBtn');
      
      for (let click = 0; click < 3; click++) {
        await toggleButton.click();
        await page.waitForTimeout(500);
        
        // Get new sizes
        const newSizes = [];
        for (let i = 0; i < 3; i++) {
          const childNode = childNodes.nth(i);
          const rect = childNode.locator('rect').first();
          const width = await rect.getAttribute('width');
          const height = await rect.getAttribute('height');
          newSizes.push({ width: parseFloat(width), height: parseFloat(height) });
        }
        
        // Verify sizes have changed (auto-sizing working)
        for (let i = 0; i < 3; i++) {
          expect(newSizes[i].width).not.toBe(initialSizes[i].width);
          expect(newSizes[i].height).not.toBe(initialSizes[i].height);
        }
      }
    });
  });

  test.describe('Lane with Fixed Size Labels - Dynamic Changes', () => {
    test.beforeEach(async ({ page }) => {
      // Navigate to the fixed-size lane demo
      await page.goto('/04_laneNodes/04_fixed-size-labels/fixed-size-labels.html');
      
      // Wait for the page to load and SVG to appear
      await page.waitForSelector('svg', { timeout: 10000 });
      
      // Wait for the dashboard to be initialized
      await page.waitForFunction(() => {
        return window.flowdash !== undefined;
      }, { timeout: 15000 });
      
      // Wait a bit more for the dashboard to be fully ready
      await page.waitForTimeout(2000);
    });

    test('should render lane with fixed-size labels of different lengths', async ({ page }) => {
      // Wait for nodes to be rendered
      const nodesFound = await waitForLaneNodes(page);
      expect(nodesFound).toBe(true);
      
      // Check for lane node
      const laneNodes = page.locator('g.Node[data-type="lane"]');
      await expect(laneNodes).toHaveCount(1);
      
      // Check for child nodes
      const childNodes = page.locator('g.Node[data-type="rect"]');
      await expect(childNodes).toHaveCount(3);
      
      // Verify all nodes have the same size (fixed-size mode)
      const nodeSizes = [];
      for (let i = 0; i < 3; i++) {
        const childNode = childNodes.nth(i);
        const rect = childNode.locator('rect').first();
        const width = await rect.getAttribute('width');
        const height = await rect.getAttribute('height');
        nodeSizes.push({ width: parseFloat(width), height: parseFloat(height) });
      }
      
      // All nodes should have the same size in fixed-size mode
      expect(nodeSizes[0].width).toBe(nodeSizes[1].width);
      expect(nodeSizes[1].width).toBe(nodeSizes[2].width);
      expect(nodeSizes[0].height).toBe(nodeSizes[1].height);
      expect(nodeSizes[1].height).toBe(nodeSizes[2].height);
    });

    test('should have toggle button to change labels', async ({ page }) => {
      // Check for toggle button
      const toggleButton = page.locator('#toggleLabelsBtn');
      await expect(toggleButton).toBeVisible();
      await expect(toggleButton).toHaveText('Change Labels');
    });

    test('should change labels when toggle button is clicked', async ({ page }) => {
      // Wait for nodes to be rendered
      const nodesFound = await waitForLaneNodes(page);
      expect(nodesFound).toBe(true);
      
      // Get initial labels
      const childNodes = page.locator('g.Node[data-type="rect"]');
      await expect(childNodes).toHaveCount(3);
      
      const initialLabels = [];
      for (let i = 0; i < 3; i++) {
        const childNode = childNodes.nth(i);
        const text = childNode.locator('text');
        const labelText = await text.textContent();
        initialLabels.push(labelText);
      }
      
      // Click toggle button
      const toggleButton = page.locator('#toggleLabelsBtn');
      await toggleButton.click();
      
      // Wait for label changes
      await page.waitForTimeout(1000);
      
      // Get new labels
      const newLabels = [];
      for (let i = 0; i < 3; i++) {
        const childNode = childNodes.nth(i);
        const text = childNode.locator('text');
        const labelText = await text.textContent();
        newLabels.push(labelText);
      }
      
      // Verify labels have changed
      expect(newLabels).not.toEqual(initialLabels);
    });

    test('should maintain fixed sizes when labels change', async ({ page }) => {
      // Wait for nodes to be rendered
      const nodesFound = await waitForLaneNodes(page);
      expect(nodesFound).toBe(true);
      
      // Get initial node sizes
      const childNodes = page.locator('g.Node[data-type="rect"]');
      await expect(childNodes).toHaveCount(3);
      
      const initialSizes = [];
      for (let i = 0; i < 3; i++) {
        const childNode = childNodes.nth(i);
        const rect = childNode.locator('rect').first();
        const width = await rect.getAttribute('width');
        const height = await rect.getAttribute('height');
        initialSizes.push({ width: parseFloat(width), height: parseFloat(height) });
      }
      
      // Click toggle button multiple times
      const toggleButton = page.locator('#toggleLabelsBtn');
      
      for (let click = 0; click < 3; click++) {
        await toggleButton.click();
        await page.waitForTimeout(500);
        
        // Get new sizes
        const newSizes = [];
        for (let i = 0; i < 3; i++) {
          const childNode = childNodes.nth(i);
          const rect = childNode.locator('rect').first();
          const width = await rect.getAttribute('width');
          const height = await rect.getAttribute('height');
          newSizes.push({ width: parseFloat(width), height: parseFloat(height) });
        }
        
        // Verify sizes remain the same (fixed-size mode)
        for (let i = 0; i < 3; i++) {
          expect(newSizes[i].width).toBe(initialSizes[i].width);
          expect(newSizes[i].height).toBe(initialSizes[i].height);
        }
      }
    });
  });

  test.describe('Lane with Dynamic Node Addition', () => {
    test.beforeEach(async ({ page }) => {
      // Navigate to the dynamic addition demo
      await page.goto('/04_laneNodes/05_dynamic-addition/dynamic-addition.html');
      
      // Wait for the page to load and SVG to appear
      await page.waitForSelector('svg', { timeout: 10000 });
      
      // Wait for the dashboard to be initialized
      await page.waitForFunction(() => {
        return window.flowdash !== undefined;
      }, { timeout: 15000 });
      
      // Wait a bit more for the dashboard to be fully ready
      await page.waitForTimeout(2000);
    });

    test('should render initial lane with one rectangle', async ({ page }) => {
      // Wait for nodes to be rendered
      const nodesFound = await waitForLaneNodes(page);
      expect(nodesFound).toBe(true);
      
      // Check for lane node
      const laneNodes = page.locator('g.Node[data-type="lane"]');
      await expect(laneNodes).toHaveCount(1);
      
      // Check for initial child node
      const childNodes = page.locator('g.Node[data-type="rect"]');
      await expect(childNodes).toHaveCount(1);
      
      // Verify the initial node is visible
      const initialNode = childNodes.first();
      await expect(initialNode).toBeVisible();
      
      // Check for rectangle element
      const rect = initialNode.locator('rect');
      await expect(rect).toHaveCount(1);
      await expect(rect).toBeVisible();
    });

    test('should have add node button', async ({ page }) => {
      // Check for add button
      const addButton = page.locator('#addNodeBtn');
      await expect(addButton).toBeVisible();
      await expect(addButton).toHaveText('Add Node');
    });

    test('should add new nodes when button is clicked', async ({ page }) => {
      // Wait for nodes to be rendered
      const nodesFound = await waitForLaneNodes(page);
      expect(nodesFound).toBe(true);
      
      // Get initial node count
      const childNodes = page.locator('g.Node[data-type="rect"]');
      let initialCount = await childNodes.count();
      expect(initialCount).toBe(1);
      
      // Click add button multiple times
      const addButton = page.locator('#addNodeBtn');
      
      for (let click = 0; click < 3; click++) {
        await addButton.click();
        await page.waitForTimeout(500);
        
        // Check that new node was added
        const newCount = await childNodes.count();
        expect(newCount).toBe(initialCount + click + 1);
        
        // Verify the new node is visible
        const newNode = childNodes.nth(newCount - 1);
        await expect(newNode).toBeVisible();
        
        // Check for rectangle element
        const rect = newNode.locator('rect');
        await expect(rect).toHaveCount(1);
        await expect(rect).toBeVisible();
        
        // Check for text label
        const text = newNode.locator('text');
        await expect(text).toHaveCount(1);
        await expect(text).toBeVisible();
      }
    });

    test('should maintain proper vertical stacking when nodes are added', async ({ page }) => {
      // Wait for nodes to be rendered
      const nodesFound = await waitForLaneNodes(page);
      expect(nodesFound).toBe(true);
      
      // Add multiple nodes
      const addButton = page.locator('#addNodeBtn');
      
      for (let click = 0; click < 3; click++) {
        await addButton.click();
        await page.waitForTimeout(500);
      }
      
      // Check that we have 4 nodes total
      const childNodes = page.locator('g.Node[data-type="rect"]');
      await expect(childNodes).toHaveCount(4);
      
      // Verify vertical stacking order
      const positions = [];
      for (let i = 0; i < 4; i++) {
        const childNode = childNodes.nth(i);
        const rect = childNode.locator('rect').first();
        
        const y = await rect.getAttribute('y');
        const height = await rect.getAttribute('height');
        
        positions.push({
          y: parseFloat(y),
          height: parseFloat(height),
          bottom: parseFloat(y) + parseFloat(height)
        });
      }
      
      // Verify vertical stacking order
      for (let i = 0; i < 3; i++) {
        expect(positions[i].y).toBeLessThan(positions[i + 1].y);
      }
      
      // Verify spacing between nodes
      for (let i = 0; i < 3; i++) {
        const spacing = positions[i + 1].y - positions[i].bottom;
        expect(spacing).toBeGreaterThanOrEqual(8); // Allow for small tolerance
      }
    });

    test('should center all nodes horizontally within lane', async ({ page }) => {
      // Wait for nodes to be rendered
      const nodesFound = await waitForLaneNodes(page);
      expect(nodesFound).toBe(true);
      
      // Add multiple nodes
      const addButton = page.locator('#addNodeBtn');
      
      for (let click = 0; click < 2; click++) {
        await addButton.click();
        await page.waitForTimeout(500);
      }
      
      // Get lane bounds
      const laneNode = page.locator('g.Node[data-type="lane"]').first();
      const laneRect = laneNode.locator('rect').first();
      
      const laneX = await laneRect.getAttribute('x');
      const laneWidth = await laneRect.getAttribute('width');
      
      // Check horizontal centering for all nodes
      const childNodes = page.locator('g.Node[data-type="rect"]');
      await expect(childNodes).toHaveCount(3);
      
      for (let i = 0; i < 3; i++) {
        const childNode = childNodes.nth(i);
        const childRect = childNode.locator('rect').first();
        
        const childX = await childRect.getAttribute('x');
        const childWidth = await childRect.getAttribute('width');
        
        // Calculate if child is centered within lane
        const childCenterX = parseFloat(childX) + parseFloat(childWidth) / 2;
        const laneCenterX = parseFloat(laneX) + parseFloat(laneWidth) / 2;
        const horizontalOffset = Math.abs(childCenterX - laneCenterX);
        
        // Allow for small positioning tolerance
        expect(horizontalOffset).toBeLessThan(5);
      }
    });
  });

  test.describe('Layout Mode Tests', () => {
    test('should test default layout mode', async ({ page }) => {
      await page.goto('/04_laneNodes/06_layout-modes/default-layout.html');
      
      await page.waitForSelector('svg', { timeout: 10000 });
      await page.waitForFunction(() => window.flowdash !== undefined, { timeout: 15000 });
      await page.waitForTimeout(2000);
      
      const nodesFound = await waitForLaneNodes(page);
      expect(nodesFound).toBe(true);
      
      const laneNodes = page.locator('g.Node[data-type="lane"]');
      await expect(laneNodes).toHaveCount(1);
      
      const childNodes = page.locator('g.Node[data-type="rect"]');
      await expect(childNodes).toHaveCount(3);
    });

    test('should test auto-size small layout mode', async ({ page }) => {
      await page.goto('/04_laneNodes/06_layout-modes/auto-size-small.html');
      
      await page.waitForSelector('svg', { timeout: 10000 });
      await page.waitForFunction(() => window.flowdash !== undefined, { timeout: 15000 });
      await page.waitForTimeout(2000);
      
      const nodesFound = await waitForLaneNodes(page);
      expect(nodesFound).toBe(true);
      
      const laneNodes = page.locator('g.Node[data-type="lane"]');
      await expect(laneNodes).toHaveCount(1);
      
      const childNodes = page.locator('g.Node[data-type="rect"]');
      await expect(childNodes).toHaveCount(3);
      
      // Verify auto-sizing behavior
      const nodeSizes = [];
      for (let i = 0; i < 3; i++) {
        const childNode = childNodes.nth(i);
        const rect = childNode.locator('rect').first();
        const width = await rect.getAttribute('width');
        const height = await rect.getAttribute('height');
        nodeSizes.push({ width: parseFloat(width), height: parseFloat(height) });
      }
      
      // In auto-size small mode, nodes should have smaller sizes
      for (let i = 0; i < 3; i++) {
        expect(nodeSizes[i].width).toBeLessThan(150);
        expect(nodeSizes[i].height).toBeLessThan(80);
      }
    });

    test('should test auto-size large layout mode', async ({ page }) => {
      await page.goto('/04_laneNodes/06_layout-modes/auto-size-large.html');
      
      await page.waitForSelector('svg', { timeout: 10000 });
      await page.waitForFunction(() => window.flowdash !== undefined, { timeout: 15000 });
      await page.waitForTimeout(2000);
      
      const nodesFound = await waitForLaneNodes(page);
      expect(nodesFound).toBe(true);
      
      const laneNodes = page.locator('g.Node[data-type="lane"]');
      await expect(laneNodes).toHaveCount(1);
      
      const childNodes = page.locator('g.Node[data-type="rect"]');
      await expect(childNodes).toHaveCount(3);
      
      // Verify auto-sizing behavior
      const nodeSizes = [];
      for (let i = 0; i < 3; i++) {
        const childNode = childNodes.nth(i);
        const rect = childNode.locator('rect').first();
        const width = await rect.getAttribute('width');
        const height = await rect.getAttribute('height');
        nodeSizes.push({ width: parseFloat(width), height: parseFloat(height) });
      }
      
      // In auto-size large mode, nodes should have larger sizes
      for (let i = 0; i < 3; i++) {
        expect(nodeSizes[i].width).toBeGreaterThan(200);
        expect(nodeSizes[i].height).toBeGreaterThan(100);
      }
    });

    test('should test fixed-size small layout mode', async ({ page }) => {
      await page.goto('/04_laneNodes/06_layout-modes/fixed-size-small.html');
      
      await page.waitForSelector('svg', { timeout: 10000 });
      await page.waitForFunction(() => window.flowdash !== undefined, { timeout: 15000 });
      await page.waitForTimeout(2000);
      
      const nodesFound = await waitForLaneNodes(page);
      expect(nodesFound).toBe(true);
      
      const laneNodes = page.locator('g.Node[data-type="lane"]');
      await expect(laneNodes).toHaveCount(1);
      
      const childNodes = page.locator('g.Node[data-type="rect"]');
      await expect(childNodes).toHaveCount(3);
      
      // Verify fixed-size behavior
      const nodeSizes = [];
      for (let i = 0; i < 3; i++) {
        const childNode = childNodes.nth(i);
        const rect = childNode.locator('rect').first();
        const width = await rect.getAttribute('width');
        const height = await rect.getAttribute('height');
        nodeSizes.push({ width: parseFloat(width), height: parseFloat(height) });
      }
      
      // All nodes should have the same size in fixed-size mode
      expect(nodeSizes[0].width).toBe(nodeSizes[1].width);
      expect(nodeSizes[1].width).toBe(nodeSizes[2].width);
      expect(nodeSizes[0].height).toBe(nodeSizes[1].height);
      expect(nodeSizes[1].height).toBe(nodeSizes[2].height);
      
      // Should be small size
      expect(nodeSizes[0].width).toBeLessThan(150);
      expect(nodeSizes[0].height).toBeLessThan(80);
    });

    test('should test fixed-size large layout mode', async ({ page }) => {
      await page.goto('/04_laneNodes/06_layout-modes/fixed-size-large.html');
      
      await page.waitForSelector('svg', { timeout: 10000 });
      await page.waitForFunction(() => window.flowdash !== undefined, { timeout: 15000 });
      await page.waitForTimeout(2000);
      
      const nodesFound = await waitForLaneNodes(page);
      expect(nodesFound).toBe(true);
      
      const laneNodes = page.locator('g.Node[data-type="lane"]');
      await expect(laneNodes).toHaveCount(1);
      
      const childNodes = page.locator('g.Node[data-type="rect"]');
      await expect(childNodes).toHaveCount(3);
      
      // Verify fixed-size behavior
      const nodeSizes = [];
      for (let i = 0; i < 3; i++) {
        const childNode = childNodes.nth(i);
        const rect = childNode.locator('rect').first();
        const width = await rect.getAttribute('width');
        const height = await rect.getAttribute('height');
        nodeSizes.push({ width: parseFloat(width), height: parseFloat(height) });
      }
      
      // All nodes should have the same size in fixed-size mode
      expect(nodeSizes[0].width).toBe(nodeSizes[1].width);
      expect(nodeSizes[1].width).toBe(nodeSizes[2].width);
      expect(nodeSizes[0].height).toBe(nodeSizes[1].height);
      expect(nodeSizes[1].height).toBe(nodeSizes[2].height);
      
      // Should be large size
      expect(nodeSizes[0].width).toBeGreaterThan(200);
      expect(nodeSizes[0].height).toBeGreaterThan(100);
    });
  });
});
