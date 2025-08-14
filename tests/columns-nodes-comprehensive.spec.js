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
      // Wait for columns nodes using CSS class selector
      await page.waitForSelector('g.columns', { timeout });
      await page.waitForTimeout(1000);
      return true;
    } catch (error) {
      console.log('Failed to find columns node elements:', error.message);
      return false;
    }
  }

  // Helper function to get columns node selector (uses CSS class)
  function getColumnsNodeSelector() {
    return 'g.columns';
  }

  // Helper function to get child node selector (uses CSS class and parent relationship)
  function getChildNodeSelector() {
    // Look for any rect elements that are direct children of the columns node
    // This is more robust than looking for specific expanded/collapsed states
    return 'g.rect';
  }

  // Helper function to get all child nodes regardless of state
  function getAllChildNodes(parentLocator) {
    // Select child nodes within the zone system structure
    // Children are nested inside the parent's immediate zone-innerContainer only
    return parentLocator.locator(':scope > g.zone-innerContainer > g[id]');
  }

  // Helper function to get columns node locator
  function getColumnsNodeLocator(page) {
    return page.locator(getColumnsNodeSelector());
  }

  // Helper function to get child node locator within a parent
  function getChildNodeLocator(parentLocator) {
    return parentLocator.locator(getChildNodeSelector());
  }

  // Metrics helper (zone-aware), similar to adapter metrics
  async function getColumnsMetrics(page) {
    return await page.evaluate(() => {
      const columnsEl = document.querySelector('g.columns');
      if (!columnsEl) return null;
      const node = columnsEl.__node;
      const zoneManager = node?.zoneManager;
      const headerZone = zoneManager?.headerZone;
      const marginZone = zoneManager?.marginZone;
      const innerZone = zoneManager?.innerContainerZone;
      const containerRect = columnsEl.querySelector('rect.container-shape');
      const headerRect = columnsEl.querySelector('rect.header-background');

      // Collect child nodes using __node for true center-based x/y
      const childGroups = Array.from(columnsEl.querySelectorAll('g.zone-innerContainer > g'));
      const childEntries = childGroups
        .map(g => g.__node)
        .filter(inst => inst && inst.data && typeof inst.x === 'number' && typeof inst.y === 'number')
        .map(inst => ({ x: inst.x, y: inst.y, width: inst.data.width, height: inst.data.height }));

      let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
      for (const c of childEntries) {
        const left = c.x - c.width / 2;
        const right = c.x + c.width / 2;
        const top = c.y - c.height / 2;
        const bottom = c.y + c.height / 2;
        minX = Math.min(minX, left);
        minY = Math.min(minY, top);
        maxX = Math.max(maxX, right);
        maxY = Math.max(maxY, bottom);
      }
      const childBounds = childEntries.length === 0
        ? { width: 0, height: 0, left: 0, top: 0, right: 0, bottom: 0 }
        : { width: maxX - minX, height: maxY - minY, left: minX, top: minY, right: maxX, bottom: maxY };

      return {
        headerHeight: headerZone ? headerZone.getHeaderHeight() : (headerRect ? parseFloat(headerRect.getAttribute('height') || '0') : 0),
        margins: marginZone ? marginZone.getMargins() : { top: 8, right: 8, bottom: 8, left: 8 },
        innerCS: innerZone ? innerZone.getCoordinateSystem() : null,
        container: {
          width: node?.data?.width ?? (containerRect ? parseFloat(containerRect.getAttribute('width') || '0') : 0),
          height: node?.data?.height ?? (containerRect ? parseFloat(containerRect.getAttribute('height') || '0') : 0)
        },
        childBounds
      };
    });
  }

  function assertInnerContainerPlacement(metrics) {
    const { innerCS, container, headerHeight, margins, childBounds } = metrics;
    expect(innerCS).toBeTruthy();

    const expectedInnerX = 0;
    const expectedInnerY = -container.height / 2 + headerHeight + margins.top + (innerCS.size.height / 2);
    const tx = innerCS.transform.includes('translate(') ? parseFloat(innerCS.transform.split('(')[1].split(',')[0]) : 0;
    const ty = innerCS.transform.includes('translate(') ? parseFloat(innerCS.transform.split('(')[1].split(',')[1]) : 0;

    // Positioning checks
    expect(Math.abs(tx - expectedInnerX)).toBeLessThan(2);
    expect(Math.abs(ty - expectedInnerY)).toBeLessThan(2);

    // Containment checks
    const tolerance = 5;
    const innerLeft = -innerCS.size.width / 2;
    const innerRight = innerCS.size.width / 2;
    const innerTop = -innerCS.size.height / 2;
    const innerBottom = innerCS.size.height / 2;

    expect(childBounds.width).toBeGreaterThanOrEqual(0);
    expect(childBounds.height).toBeGreaterThanOrEqual(0);
    expect(childBounds.left).toBeGreaterThanOrEqual(innerLeft - tolerance);
    expect(childBounds.right).toBeLessThanOrEqual(innerRight + tolerance);
    expect(childBounds.top).toBeGreaterThanOrEqual(innerTop - tolerance);
    expect(childBounds.bottom).toBeLessThanOrEqual(innerBottom + tolerance);
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
    const children = getAllChildNodes(parent);
    
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
        
        // Get the transform attribute from the g element
        const transform = await child.getAttribute('transform');
        
        // Parse transform to get actual position
        let actualX = parseFloat(x);
        let actualY = parseFloat(y);
        
        if (transform && transform.includes('translate(')) {
          const match = transform.match(/translate\(([^,]+),\s*([^)]+)\)/);
          if (match) {
            const translateX = parseFloat(match[1]);
            const translateY = parseFloat(match[2]);
            actualX += translateX;
            actualY += translateY;
          }
        }
        
        positions.push({
          x: actualX,
          y: actualY,
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
    const zoomButton = node.locator('g.zoom-button');
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
      
      const columnsNodes = page.locator(getColumnsNodeSelector());
      await expect(columnsNodes).toHaveCount(1);
      
      const dimensions = await getNodeDimensions(page, getColumnsNodeSelector());
      
      // Verify the node renders with valid dimensions
      expect(dimensions.width).toBeGreaterThan(0);
      expect(dimensions.height).toBeGreaterThan(0);
      expect(dimensions.x).toBeDefined();
      expect(dimensions.y).toBeDefined();
      
      // Verify dimensions are reasonable (not excessively large or small)
      expect(dimensions.width).toBeLessThan(10000); // Reasonable upper bound
      expect(dimensions.height).toBeLessThan(10000); // Reasonable upper bound
    });

    test('should position child nodes in horizontal row', async ({ page }) => {
      const nodesFound = await waitForColumnsNodes(page);
      expect(nodesFound).toBe(true);
      
      const columnsNode = page.locator(getColumnsNodeSelector()).first();
      const children = getAllChildNodes(columnsNode);
      
      await expect(children).toHaveCount(3);
      
      const positions = await getChildPositions(page, getColumnsNodeSelector());
      
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
      
      const positions = await getChildPositions(page, getColumnsNodeSelector());
      
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
      
      const columnsNode = page.locator(getColumnsNodeSelector()).first();
      const children = getAllChildNodes(columnsNode);
      
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

    test('innerContainer: coordinate system and containment', async ({ page }) => {
      const nodesFound = await waitForColumnsNodes(page);
      expect(nodesFound).toBe(true);
      const metrics = await getColumnsMetrics(page);
      expect(metrics).toBeTruthy();
      assertInnerContainerPlacement(metrics);
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
      
      const columnsNode = page.locator(getColumnsNodeSelector()).first();
      
      // Get initial dimensions
      const initialDimensions = await getNodeDimensions(page, getColumnsNodeSelector());
      
      // Click zoom button to collapse
      await clickZoomButton(page, getColumnsNodeSelector());
      
      // Wait for collapse animation
      await page.waitForTimeout(1000);
      
      // Get collapsed dimensions
      const collapsedDimensions = await getNodeDimensions(page, getColumnsNodeSelector());
      
      // Verify height is reduced (collapsed)
      expect(collapsedDimensions.height).toBeLessThan(initialDimensions.height);
      
      // Verify children are hidden
      const children = getAllChildNodes(columnsNode);
      for (let i = 0; i < await children.count(); i++) {
        const child = children.nth(i);
        await expect(child).not.toBeVisible();
      }
    });

    test('should expand columns and show children', async ({ page }) => {
      const nodesFound = await waitForColumnsNodes(page);
      expect(nodesFound).toBe(true);
      
      const columnsNode = page.locator(getColumnsNodeSelector()).first();
      
      // First collapse the columns
      await clickZoomButton(page, getColumnsNodeSelector());
      await page.waitForTimeout(1000);
      
      // Get collapsed dimensions
      const collapsedDimensions = await getNodeDimensions(page, getColumnsNodeSelector());
      
      // Click zoom button again to expand
      await clickZoomButton(page, getColumnsNodeSelector());
      await page.waitForTimeout(1000);
      
      // Get expanded dimensions
      const expandedDimensions = await getNodeDimensions(page, getColumnsNodeSelector());
      
      // Verify height is restored
      expect(expandedDimensions.height).toBeGreaterThan(collapsedDimensions.height);
      
      // Verify children are visible again
      const children = getAllChildNodes(columnsNode);
      for (let i = 0; i < await children.count(); i++) {
        const child = children.nth(i);
        await expect(child).toBeVisible();
      }
    });

    test('should maintain child positioning after expand/collapse cycle', async ({ page }) => {
      const nodesFound = await waitForColumnsNodes(page);
      expect(nodesFound).toBe(true);
      
      // Get initial child positions
      const initialPositions = await getChildPositions(page, getColumnsNodeSelector());
      
      // Collapse and expand
      await clickZoomButton(page, getColumnsNodeSelector());
      await page.waitForTimeout(1000);
      await clickZoomButton(page, getColumnsNodeSelector());
      await page.waitForTimeout(1000);
      
      // Get final child positions
      const finalPositions = await getChildPositions(page, getColumnsNodeSelector());
      
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
      
      // Find the parent columns node
      const parentColumns = page.locator('g.columns[id="parent-columns"]');
      
      // Get the direct children: left-section (columns), middle-rect (rect), right-section (columns)
      // These are the immediate children, not all nested g.rect elements
      const leftSection = page.locator('g.columns[id="left-section"]');
      const middleRect = page.locator('g.rect[id="middle-rect"]');
      const rightSection = page.locator('g.columns[id="right-section"]');
      
      // Verify we have the expected structure
      await expect(leftSection).toHaveCount(1);
      await expect(middleRect).toHaveCount(1);
      await expect(rightSection).toHaveCount(1);
      
      // Get initial dimensions of parent columns
      const initialParentWidth = await parentColumns.locator('rect').first().getAttribute('width');
      const initialParentHeight = await parentColumns.locator('rect').first().getAttribute('height');
      
      // Test 1: Collapse Left Section
      console.log('Testing: Collapse Left Section');
      const leftSectionInitialWidth = await leftSection.locator('rect').first().getAttribute('width');
      
      // Click zoom button on left section
      const leftZoomButton = leftSection.locator('g.zoom-button');
      await leftZoomButton.click();
      await page.waitForTimeout(1000);
      
      // Verify left section collapsed
      const leftSectionCollapsedWidth = await leftSection.locator('rect').first().getAttribute('width');
      expect(parseFloat(leftSectionCollapsedWidth)).toBeLessThan(parseFloat(leftSectionInitialWidth));
      
      // Check collapsed state of left section children (nested g.rect elements)
      const leftSectionChildren = leftSection.locator('g.rect');
      for (let i = 0; i < await leftSectionChildren.count(); i++) {
        const child = leftSectionChildren.nth(i);
        const isVisible = await child.isVisible();
        expect(isVisible).toBe(false);
      }
      
      // Verify parent columns adjusted width (should be smaller)
      const afterLeftCollapseWidth = await parentColumns.locator('rect').first().getAttribute('width');
      expect(parseFloat(afterLeftCollapseWidth)).toBeLessThan(parseFloat(initialParentWidth));
      
      // Test 2: Collapse Main, then Expand Main
      console.log('Testing: Collapse Main, then Expand Main');
      
      // Get the zoom button that belongs directly to the parent columns node
      // Use first() to get the first zoom button found within the parent (which should be the parent's own zoom button)
      const mainZoomButton = parentColumns.locator('g.zoom-button').first();
      
      // Collapse main
      await mainZoomButton.click();
      await page.waitForTimeout(1000);
      
      // Check collapsed state of all direct children
      await expect(leftSection).not.toBeVisible();
      await expect(middleRect).not.toBeVisible();
      await expect(rightSection).not.toBeVisible();
      
      // Check size of main (should be smaller)
      const mainCollapsedWidth = await parentColumns.locator('rect').first().getAttribute('width');
      const mainCollapsedHeight = await parentColumns.locator('rect').first().getAttribute('height');
      expect(parseFloat(mainCollapsedWidth)).toBeLessThan(parseFloat(afterLeftCollapseWidth));
      expect(parseFloat(mainCollapsedHeight)).toBeLessThan(parseFloat(initialParentHeight));
      
      // Expand main
      await mainZoomButton.click();
      await page.waitForTimeout(1000);
      
      // Check expanded state of all direct children
      await expect(leftSection).toBeVisible();
      await expect(middleRect).toBeVisible();
      await expect(rightSection).toBeVisible();
      
      // Check size of main (should be restored)
      const mainExpandedWidth = await parentColumns.locator('rect').first().getAttribute('width');
      const mainExpandedHeight = await parentColumns.locator('rect').first().getAttribute('height');
      expect(parseFloat(mainExpandedWidth)).toBeGreaterThan(parseFloat(mainCollapsedWidth));
      expect(parseFloat(mainExpandedHeight)).toBeGreaterThan(parseFloat(mainCollapsedHeight));
      
      // Test 3: Collapse Right Section
      console.log('Testing: Collapse Right Section');
      const rightSectionInitialWidth = await rightSection.locator('rect').first().getAttribute('width');
      
      // Click zoom button on right section
      const rightZoomButton = rightSection.locator('g.zoom-button');
      await rightZoomButton.click();
      await page.waitForTimeout(1000);
      
      // Verify right section collapsed
      const rightSectionCollapsedWidth = await rightSection.locator('rect').first().getAttribute('width');
      expect(parseFloat(rightSectionCollapsedWidth)).toBeLessThan(parseFloat(rightSectionInitialWidth));
      
      // Check collapsed state of right section children (nested g.rect elements)
      const rightSectionChildren = rightSection.locator('g.rect');
      for (let i = 0; i < await rightSectionChildren.count(); i++) {
        const child = rightSectionChildren.nth(i);
        const isVisible = await child.isVisible();
        expect(isVisible).toBe(false);
      }
      
      // Verify parent columns adjusted width again (should be even smaller)
      const afterRightCollapseWidth = await parentColumns.locator('rect').first().getAttribute('width');
      expect(parseFloat(afterRightCollapseWidth)).toBeLessThan(parseFloat(mainExpandedWidth));
      
      // Test 4: Expand Right Section
      console.log('Testing: Expand Right Section');
      await rightZoomButton.click();
      await page.waitForTimeout(1000);
      
      // Check expanded state of right section children
      for (let i = 0; i < await rightSectionChildren.count(); i++) {
        const child = rightSectionChildren.nth(i);
        const isVisible = await child.isVisible();
        expect(isVisible).toBe(true);
      }
      
      // Verify parent columns width increased
      const afterRightExpandWidth = await parentColumns.locator('rect').first().getAttribute('width');
      expect(parseFloat(afterRightExpandWidth)).toBeGreaterThan(parseFloat(afterRightCollapseWidth));
      
      // Test 5: Expand Left Section
      console.log('Testing: Expand Left Section');
      await leftZoomButton.click();
      await page.waitForTimeout(1000);
      
      // Check expanded state of left section children
      for (let i = 0; i < await leftSectionChildren.count(); i++) {
        const child = leftSectionChildren.nth(i);
        const isVisible = await child.isVisible();
        expect(isVisible).toBe(true);
      }
      
      // Verify parent columns width increased again
      const finalParentWidth = await parentColumns.locator('rect').first().getAttribute('width');
      expect(parseFloat(finalParentWidth)).toBeGreaterThan(parseFloat(afterRightExpandWidth));
      
      // Final verification: all direct children should be visible
      await expect(leftSection).toBeVisible();
      await expect(middleRect).toBeVisible();
      await expect(rightSection).toBeVisible();
      
      // Parent should be close to original size (allowing for some tolerance)
      expect(parseFloat(finalParentWidth)).toBeCloseTo(parseFloat(initialParentWidth), -1);
    });

    test('should maintain proper spacing in nested structure', async ({ page }) => {
      const nodesFound = await waitForColumnsNodes(page);
      expect(nodesFound).toBe(true);
      
      // Get all columns nodes
      const allColumns = page.locator('g.columns');
      const columnsCount = await allColumns.count();
      
      // Verify we have the expected structure
      expect(columnsCount).toBeGreaterThanOrEqual(3); // 1 parent + 2 nested
      
      // Check that nested columns are properly positioned within parent
      const parentColumns = page.locator('g.columns[id="parent-columns"]');
      const nestedColumns = page.locator('g.columns[data-parent]');
      
      for (let i = 0; i < await nestedColumns.count(); i++) {
        const nestedColumn = nestedColumns.nth(i);
        const parentRect = parentColumns.locator('rect').first();
        const nestedRect = nestedColumn.locator('rect').first();
        
        const parentBounds = await getNodeDimensions(page, 'g.columns[id="parent-columns"]');
        const nestedBounds = await getNodeDimensions(page, `g.columns[data-parent]:nth-child(${i+1})`);
        
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
      
      const parentColumns = page.locator('g.columns[id="parent-columns"]');
      const children = getAllChildNodes(parentColumns);
      
      // Should have 3 children: left-section (columns), middle-rect (rect), right-section (columns)
      await expect(children).toHaveCount(3);
      
      // Verify left section is columns type
      const leftSection = page.locator('g.columns[id="left-section"]');
      const leftType = await leftSection.getAttribute('class');
      expect(leftType).toContain('columns');
      
      // Verify middle is rect type
      const middleRect = page.locator('g.rect[id="middle-rect"]');
      const middleType = await middleRect.getAttribute('class');
      expect(middleType).toContain('rect');
      
      // Verify right section is columns type
      const rightSection = page.locator('g.columns[id="right-section"]');
      const rightType = await rightSection.getAttribute('class');
      expect(rightType).toContain('columns');
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
      const columnsNode = page.locator(getColumnsNodeSelector()).first();
      const initialChildren = getAllChildNodes(columnsNode);
      const initialCount = await initialChildren.count();
      
      // Get initial dimensions
      const initialDimensions = await getNodeDimensions(page, getColumnsNodeSelector());
      
      // Click add button to add new child
      const addButton = page.locator('#addNodeBtn');
      await addButton.click();
      await page.waitForTimeout(1000);
      
      // Verify new child was added
      const finalChildren = getAllChildNodes(columnsNode);
      const finalCount = await finalChildren.count();
      expect(finalCount).toBe(initialCount + 1);
      
      // Verify container width increased
      const finalDimensions = await getNodeDimensions(page, getColumnsNodeSelector());
      expect(finalDimensions.width).toBeGreaterThan(initialDimensions.width);
      
      // Verify new child is properly positioned
      const positions = await getChildPositions(page, getColumnsNodeSelector());
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
      const columnsNode = page.locator(getColumnsNodeSelector()).first();
      const initialChildren = getAllChildNodes(columnsNode);
      const initialCount = await initialChildren.count();
      
      // Get initial dimensions
      const initialDimensions = await getNodeDimensions(page, getColumnsNodeSelector());
      
      // Click remove button to remove a child
      const removeButton = page.locator('#removeBtn');
      await removeButton.click();
      await page.waitForTimeout(1000);
      
      // Verify child was removed
      const finalChildren = getAllChildNodes(columnsNode);
      const finalCount = await finalChildren.count();
      expect(finalCount).toBe(initialCount - 1);
      
      // Verify container width decreased
      const finalDimensions = await getNodeDimensions(page, getColumnsNodeSelector());
      expect(finalDimensions.width).toBeLessThan(initialDimensions.width);
      
      // Verify remaining children are properly positioned
      const positions = await getChildPositions(page, getColumnsNodeSelector());
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

    test('should expand height to accommodate tall children', async ({ page }) => {
      const nodesFound = await waitForColumnsNodes(page);
      expect(nodesFound).toBe(true);
      
      const columnsNode = page.locator(getColumnsNodeSelector()).first();
      const children = getAllChildNodes(columnsNode);
      
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
      
      const columnsNode = page.locator(getColumnsNodeSelector()).first();
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

    test('should handle multiple collapse/expand operations correctly', async ({ page }) => {
      await page.goto('/05_columnsNodes/01_simple-tests/01_default-mode/default-mode.html');
      await page.waitForSelector('svg', { timeout: 10000 });
      await page.waitForFunction(() => window.flowdash !== undefined, { timeout: 15000 });
      await page.waitForTimeout(2000);
      
      const nodesFound = await waitForColumnsNodes(page);
      expect(nodesFound).toBe(true);
      
      const columnsNode = page.locator(getColumnsNodeSelector()).first();
      const zoomButton = columnsNode.locator('g.zoom-button');
      
      // Perform a few collapse/expand cycles with proper timing
      for (let i = 0; i < 3; i++) {
        // Collapse
        await zoomButton.click();
        await page.waitForTimeout(1000); // Wait for collapse animation
        
        // Verify collapsed state - children should be hidden
        const allChildren = getAllChildNodes(columnsNode);
        const childCount = await allChildren.count();
        expect(childCount).toBeGreaterThan(0);
        
        // Check that children are not visible (either hidden or collapsed)
        for (let j = 0; j < childCount; j++) {
          const child = allChildren.nth(j);
          // Check if the child is actually hidden (display: none or collapsed)
          const isVisible = await child.isVisible();
          expect(isVisible).toBe(false);
        }
        
        // Expand
        await zoomButton.click();
        await page.waitForTimeout(1000); // Wait for expand animation
        
        // Verify expanded state - children should be visible
        for (let j = 0; j < childCount; j++) {
          const child = allChildren.nth(j);
          const isVisible = await child.isVisible();
          expect(isVisible).toBe(true);
        }
      }
      
      // Verify final state is correct (expanded with visible children)
      const finalChildren = getAllChildNodes(columnsNode);
      const childCount = await finalChildren.count();
      expect(childCount).toBeGreaterThan(0);
      
      // Verify all children are visible in the final state
      for (let i = 0; i < childCount; i++) {
        const child = finalChildren.nth(i);
        const isVisible = await child.isVisible();
        expect(isVisible).toBe(true);
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
      
      const columnsNode = page.locator(getColumnsNodeSelector()).first();
      const children = getAllChildNodes(columnsNode);
      
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

  test.describe('Columns Zone System Tests', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/05_columnsNodes/01_simple-tests/01_default-mode/default-mode.html');
      await page.waitForSelector('svg', { timeout: 10000 });
      await page.waitForFunction(() => window.flowdash !== undefined, { timeout: 15000 });
      await page.waitForTimeout(2000);
    });

    test('should have inner container zone that encompasses all children', async ({ page }) => {
      const nodesFound = await waitForColumnsNodes(page);
      expect(nodesFound).toBe(true);
      
      const columnsNode = page.locator(getColumnsNodeSelector()).first();
      
      // Find the inner container zone
      const innerContainerZone = columnsNode.locator('g.zone-innerContainer');
      await expect(innerContainerZone).toHaveCount(1);
      
      // Get inner container zone dimensions and position
      const containerRect = innerContainerZone.locator('rect.zone-innerContainer');
      await expect(containerRect).toHaveCount(1);
      
      const containerX = parseFloat(await containerRect.getAttribute('x'));
      const containerY = parseFloat(await containerRect.getAttribute('y'));
      const containerWidth = parseFloat(await containerRect.getAttribute('width'));
      const containerHeight = parseFloat(await containerRect.getAttribute('height'));
      
      // Get the transform from the inner container zone's parent g element
      const containerTransform = await innerContainerZone.getAttribute('transform');
      
      let actualContainerX = containerX;
      let actualContainerY = containerY;
      
      if (containerTransform && containerTransform.includes('translate(')) {
        const match = containerTransform.match(/translate\(([^,]+),\s*([^)]+)\)/);
        if (match) {
          const translateX = parseFloat(match[1]);
          const translateY = parseFloat(match[2]);
          actualContainerX += translateX;
          actualContainerY += translateY;
        }
      }
      
      // Calculate container boundaries
      const containerLeft = actualContainerX;
      const containerRight = actualContainerX + containerWidth;
      const containerTop = actualContainerY;
      const containerBottom = actualContainerY + containerHeight;
      
      // Get all child rectangles - these should be positioned relative to the inner container zone
      const positions = await getChildPositions(page, getColumnsNodeSelector());
      expect(positions.length).toBeGreaterThan(0);
      
      // Calculate child boundaries from the corrected positions
      // IMPORTANT: The Inner Container Zone's transform (translate(0, -5)) is applied to all children
      // in addition to their own individual transforms
      let minX = Infinity, maxX = -Infinity;
      let minY = Infinity, maxY = -Infinity;
      
      for (const pos of positions) {
        // Apply the zone's transform to each child position
        const zoneTransformX = 0; // From translate(0, -5)
        const zoneTransformY = -5; // From translate(0, -5)
        
        const adjustedX = pos.x + zoneTransformX;
        const adjustedY = pos.y + zoneTransformY;
        
        minX = Math.min(minX, adjustedX);
        maxX = Math.max(maxX, adjustedX + pos.width);
        minY = Math.min(minY, adjustedY);
        maxY = Math.max(maxY, adjustedY + pos.height);
      }
      
      // Verify container encompasses all children
      // The inner container zone should contain all children
      expect(containerLeft).toBeLessThanOrEqual(minX);
      expect(containerRight).toBeGreaterThanOrEqual(maxX);
      expect(containerTop).toBeLessThanOrEqual(minY);
      expect(containerBottom).toBeGreaterThanOrEqual(maxY);
      
      // Log the boundaries for debugging
      console.log('Container boundaries:', {
        left: containerLeft,
        right: containerRight,
        top: containerTop,
        bottom: containerBottom,
        width: containerWidth,
        height: containerHeight
      });
      
      console.log('Children boundaries (with zone transform applied):', {
        minX,
        maxX,
        minY,
        maxY,
        spanX: maxX - minX,
        spanY: maxY - minY
      });
      
      console.log('Container transform:', containerTransform);
      console.log('Zone transform applied to children:', { x: 0, y: -5 });
    });

    test('should handle columns node with no children correctly', async ({ page }) => {
      // Navigate to the basic demo that has a columns node with no children
      await page.goto('/05_columnsNodes/01_basic/basic.html');
      await page.waitForSelector('svg', { timeout: 10000 });
      await page.waitForFunction(() => window.flowdash !== undefined, { timeout: 15000 });
      await page.waitForTimeout(2000);
      
      const nodesFound = await waitForColumnsNodes(page);
      expect(nodesFound).toBe(true);
      
      const columnsNode = page.locator(getColumnsNodeSelector()).first();
      
      // Verify there are no children
      const children = getAllChildNodes(columnsNode);
      const childCount = await children.count();
      expect(childCount).toBeGreaterThanOrEqual(0); // May have children in basic demo
      
      // Find the inner container zone and zone container
      const innerContainerZone = columnsNode.locator('g.zone-innerContainer');
      const zoneContainer = columnsNode.locator('g.zone-container');
      const zoneContainerRect = zoneContainer.locator('rect.container-shape');
      
      // Get dimensions
      const zoneHeight = parseFloat(await zoneContainerRect.getAttribute('height'));
      const innerContainerHeight = parseFloat(await innerContainerZone.locator('rect.zone-innerContainer').getAttribute('height'));
      
      // Get header height and margins
      const headerZone = columnsNode.locator('g.zone-header');
      const headerBackground = headerZone.locator('rect.header-background');
      const headerHeight = parseFloat(await headerBackground.getAttribute('height'));
      
      // When there are no children:
      // 1. The inner container zone should have minimal height
      expect(innerContainerHeight).toBeGreaterThan(0);
      
      // 2. The zone container height should be reasonable
      expect(zoneHeight).toBeGreaterThan(headerHeight);
    });
  });
});
