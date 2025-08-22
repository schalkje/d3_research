import { test, expect } from '@playwright/test';

test.describe('Group Rendering Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the main dashboard
    await page.goto('/dashboard/flowdash-js.html');
    await page.waitForSelector('svg', { timeout: 10000 });
  });

  test.describe('Simple Group Tests', () => {
    test('should render simple group with child nodes', async ({ page }) => {
      // Load test data with simple groups
      await page.selectOption('#fileSelect', { label: 'group-simple.json' });
      await page.waitForSelector('g.node-container');
      
      const groupNodes = page.locator('g.node-container[data-type="group"]');
      const childNodes = page.locator('g.node-container[data-parent]');
      
      await expect(groupNodes).toHaveCount.greaterThan(0);
      await expect(childNodes).toHaveCount.greaterThan(0);
      
      // Verify group structure
      for (const group of await groupNodes.all()) {
        const groupId = await group.getAttribute('data-id');
        const children = page.locator(`g.node-container[data-parent="${groupId}"]`);
        await expect(children).toHaveCount.greaterThan(0);
      }
    });

    test('should render nested groups correctly', async ({ page }) => {
      await page.selectOption('#fileSelect', { label: 'group-nested.json' });
      await page.waitForSelector('g.node-container');
      
      const topLevelGroups = page.locator('g.node-container[data-type="group"]:not([data-parent])');
      const nestedGroups = page.locator('g.node-container[data-type="group"][data-parent]');
      
      await expect(topLevelGroups).toHaveCount.greaterThan(0);
      await expect(nestedGroups).toHaveCount.greaterThan(0);
      
      // Verify nested structure
      for (const nestedGroup of await nestedGroups.all()) {
        const parentId = await nestedGroup.getAttribute('data-parent');
        const parentGroup = page.locator(`g.node-container[data-id="${parentId}"]`);
        await expect(parentGroup).toBeVisible();
      }
    });
  });

  test.describe('Lane Layout Tests', () => {
    test('should render simple lane layout', async ({ page }) => {
      await page.selectOption('#fileSelect', { label: 'lane-simple.json' });
      await page.waitForSelector('g.node-container');
      
      const laneGroups = page.locator('g.node-container[data-type="lane"]');
      const nodesInLanes = page.locator('g.node-container[data-parent]');
      
      await expect(laneGroups).toHaveCount.greaterThan(0);
      await expect(nodesInLanes).toHaveCount.greaterThan(0);
      
      // Verify lane structure
      for (const lane of await laneGroups.all()) {
        const laneId = await lane.getAttribute('data-id');
        const laneChildren = page.locator(`g.node-container[data-parent="${laneId}"]`);
        await expect(laneChildren).toHaveCount.greaterThan(0);
      }
    });

    test('should render multiple adapters in lane', async ({ page }) => {
      await page.selectOption('#fileSelect', { label: 'lane-adapters.json' });
      await page.waitForSelector('g.node-container');
      
      const laneGroups = page.locator('g.node-container[data-type="lane"]');
      const adapterNodes = page.locator('g.node-container[data-type="adapter"]');
      
      await expect(laneGroups).toHaveCount.greaterThan(0);
      await expect(adapterNodes).toHaveCount.greaterThan(1);
      
      // Verify adapters are in lanes
      for (const adapter of await adapterNodes.all()) {
        const parentId = await adapter.getAttribute('data-parent');
        const parentLane = page.locator(`g.node-container[data-id="${parentId}"][data-type="lane"]`);
        await expect(parentLane).toBeVisible();
      }
    });

    test('should render nested lanes', async ({ page }) => {
      await page.selectOption('#fileSelect', { label: 'lane-nested.json' });
      await page.waitForSelector('g.node-container');
      
      const topLevelLanes = page.locator('g.node-container[data-type="lane"]:not([data-parent])');
      const nestedLanes = page.locator('g.node-container[data-type="lane"][data-parent]');
      
      await expect(topLevelLanes).toHaveCount.greaterThan(0);
      await expect(nestedLanes).toHaveCount.greaterThan(0);
      
      // Verify nested lane structure
      for (const nestedLane of await nestedLanes.all()) {
        const parentId = await nestedLane.getAttribute('data-parent');
        const parentLane = page.locator(`g.node-container[data-id="${parentId}"][data-type="lane"]`);
        await expect(parentLane).toBeVisible();
      }
    });

    test('should render complex lane layouts', async ({ page }) => {
      await page.selectOption('#fileSelect', { label: 'lane-complex.json' });
      await page.waitForSelector('g.node-container');
      
      const laneGroups = page.locator('g.node-container[data-type="lane"]');
      const allNodes = page.locator('g.node-container');
      
      await expect(laneGroups).toHaveCount.greaterThan(0);
      await expect(allNodes).toHaveCount.greaterThan(1);
      
      // Verify complex structure has multiple levels
      const nodeCount = await allNodes.count();
      const laneCount = await laneGroups.count();
      expect(nodeCount).toBeGreaterThan(laneCount);
    });
  });

  test.describe('Column Layout Tests', () => {
    test('should render simple column layout', async ({ page }) => {
      await page.selectOption('#fileSelect', { label: 'columns-simple.json' });
      await page.waitForSelector('g.node-container');
      
      const columnGroups = page.locator('g.node-container[data-type="columns"]');
      const nodesInColumns = page.locator('g.node-container[data-parent]');
      
      await expect(columnGroups).toHaveCount.greaterThan(0);
      await expect(nodesInColumns).toHaveCount.greaterThan(0);
      
      // Verify column structure
      for (const column of await columnGroups.all()) {
        const columnId = await column.getAttribute('data-id');
        const columnChildren = page.locator(`g.node-container[data-parent="${columnId}"]`);
        await expect(columnChildren).toHaveCount.greaterThan(0);
      }
    });

    test('should render adapters in columns', async ({ page }) => {
      await page.selectOption('#fileSelect', { label: 'columns-adapters.json' });
      await page.waitForSelector('g.node-container');
      
      const columnGroups = page.locator('g.node-container[data-type="columns"]');
      const adapterNodes = page.locator('g.node-container[data-type="adapter"]');
      
      await expect(columnGroups).toHaveCount.greaterThan(0);
      await expect(adapterNodes).toHaveCount.greaterThan(0);
      
      // Verify adapters are in columns
      for (const adapter of await adapterNodes.all()) {
        const parentId = await adapter.getAttribute('data-parent');
        const parentColumn = page.locator(`g.node-container[data-id="${parentId}"][data-type="columns"]`);
        await expect(parentColumn).toBeVisible();
      }
    });

    test('should render nested columns', async ({ page }) => {
      await page.selectOption('#fileSelect', { label: 'columns-nested.json' });
      await page.waitForSelector('g.node-container');
      
      const topLevelColumns = page.locator('g.node-container[data-type="columns"]:not([data-parent])');
      const nestedColumns = page.locator('g.node-container[data-type="columns"][data-parent]');
      
      await expect(topLevelColumns).toHaveCount.greaterThan(0);
      await expect(nestedColumns).toHaveCount.greaterThan(0);
      
      // Verify nested column structure
      for (const nestedColumn of await nestedColumns.all()) {
        const parentId = await nestedColumn.getAttribute('data-parent');
        const parentColumn = page.locator(`g.node-container[data-id="${parentId}"][data-type="columns"]`);
        await expect(parentColumn).toBeVisible();
      }
    });

    test('should render columns with lanes', async ({ page }) => {
      await page.selectOption('#fileSelect', { label: 'columns-lanes.json' });
      await page.waitForSelector('g.node-container');
      
      const columnGroups = page.locator('g.node-container[data-type="columns"]');
      const laneGroups = page.locator('g.node-container[data-type="lane"]');
      
      await expect(columnGroups).toHaveCount.greaterThan(0);
      await expect(laneGroups).toHaveCount.greaterThan(0);
      
      // Verify mixed structure
      for (const lane of await laneGroups.all()) {
        const parentId = await lane.getAttribute('data-parent');
        const parentColumn = page.locator(`g.node-container[data-id="${parentId}"][data-type="columns"]`);
        await expect(parentColumn).toBeVisible();
      }
    });

    test('should render multiple lanes in columns', async ({ page }) => {
      await page.selectOption('#fileSelect', { label: 'columns-multiple-lanes.json' });
      await page.waitForSelector('g.node-container');
      
      const columnGroups = page.locator('g.node-container[data-type="columns"]');
      const laneGroups = page.locator('g.node-container[data-type="lane"]');
      
      await expect(columnGroups).toHaveCount.greaterThan(0);
      await expect(laneGroups).toHaveCount.greaterThan(1);
      
      // Verify multiple lanes in columns
      for (const column of await columnGroups.all()) {
        const columnId = await column.getAttribute('data-id');
        const columnLanes = page.locator(`g.node-container[data-parent="${columnId}"][data-type="lane"]`);
        await expect(columnLanes).toHaveCount.greaterThan(0);
      }
    });
  });

  test.describe('Advanced Lane Tests', () => {
    test('should render advanced lane and group layouts', async ({ page }) => {
      await page.selectOption('#fileSelect', { label: 'lanes-advanced.json' });
      await page.waitForSelector('g.node-container');
      
      const laneGroups = page.locator('g.node-container[data-type="lane"]');
      const groupNodes = page.locator('g.node-container[data-type="group"]');
      const allNodes = page.locator('g.node-container');
      
      await expect(laneGroups).toHaveCount.greaterThan(0);
      await expect(allNodes).toHaveCount.greaterThan(1);
      
      // Verify complex structure
      const totalNodes = await allNodes.count();
      const laneCount = await laneGroups.count();
      const groupCount = await groupNodes.count();
      
      expect(totalNodes).toBeGreaterThan(laneCount + groupCount);
    });
  });

  test.describe('Group Visual Properties', () => {
    test('should render groups with correct styling', async ({ page }) => {
      await page.selectOption('#fileSelect', { label: 'group-simple.json' });
      await page.waitForSelector('g.node-container');
      
      const groupNodes = page.locator('g.node-container[data-type="group"]');
      
      for (const group of await groupNodes.all()) {
        const rect = group.locator('rect');
        
        // Verify group has visual representation
        await expect(rect).toBeVisible();
        
        // Verify group has proper styling
        const fill = await rect.getAttribute('fill');
        const stroke = await rect.getAttribute('stroke');
        expect(fill).toBeTruthy();
        expect(stroke).toBeTruthy();
      }
    });

    test('should render group labels correctly', async ({ page }) => {
      await page.selectOption('#fileSelect', { label: 'group-simple.json' });
      await page.waitForSelector('g.node-container');
      
      const groupNodes = page.locator('g.node-container[data-type="group"]');
      
      for (const group of await groupNodes.all()) {
        const label = group.locator('text');
        await expect(label).toBeVisible();
        
        const labelText = await label.textContent();
        expect(labelText).toBeTruthy();
        expect(labelText.length).toBeGreaterThan(0);
      }
    });

    test('should render groups with different group types', async ({ page }) => {
      await page.selectOption('#fileSelect', { label: 'group-nested.json' });
      await page.waitForSelector('g.node-container');
      
      const dynamicGroups = page.locator('g.node-container[data-group-type="dynamic"]');
      const fixedGroups = page.locator('g.node-container[data-group-type="fixed"]');
      const pinnedGroups = page.locator('g.node-container[data-group-type="pinned"]');
      
      // Verify different group types are rendered
      const totalGroups = await page.locator('g.node-container[data-type="group"]').count();
      const dynamicCount = await dynamicGroups.count();
      const fixedCount = await fixedGroups.count();
      const pinnedCount = await pinnedGroups.count();
      
      expect(dynamicCount + fixedCount + pinnedCount).toBeGreaterThan(0);
    });
  });

  test.describe('Group Interaction Tests', () => {
    test('should allow group dragging', async ({ page }) => {
      await page.selectOption('#fileSelect', { label: 'group-simple.json' });
      await page.waitForSelector('g.node-container');
      
      const firstGroup = page.locator('g.node-container[data-type="group"]').first();
      const initialPosition = await firstGroup.boundingBox();
      
      // Simulate dragging the group
      await firstGroup.hover();
      await page.mouse.down();
      await page.mouse.move(initialPosition.x + 100, initialPosition.y + 100);
      await page.mouse.up();
      
      await page.waitForTimeout(1000);
      
      // Verify group moved
      const newPosition = await firstGroup.boundingBox();
      const deltaX = Math.abs(newPosition.x - initialPosition.x);
      const deltaY = Math.abs(newPosition.y - initialPosition.y);
      
      expect(deltaX).toBeGreaterThan(0);
      expect(deltaY).toBeGreaterThan(0);
    });

    test('should maintain child node relationships during group movement', async ({ page }) => {
      await page.selectOption('#fileSelect', { label: 'group-simple.json' });
      await page.waitForSelector('g.node-container');
      
      const firstGroup = page.locator('g.node-container[data-type="group"]').first();
      const groupId = await firstGroup.getAttribute('data-id');
      const childNodes = page.locator(`g.node-container[data-parent="${groupId}"]`);
      
      const initialChildCount = await childNodes.count();
      expect(initialChildCount).toBeGreaterThan(0);
      
      // Move the group
      const initialPosition = await firstGroup.boundingBox();
      await firstGroup.hover();
      await page.mouse.down();
      await page.mouse.move(initialPosition.x + 100, initialPosition.y + 100);
      await page.mouse.up();
      
      await page.waitForTimeout(1000);
      
      // Verify child relationships are maintained
      const newChildCount = await childNodes.count();
      expect(newChildCount).toBe(initialChildCount);
      
      // Verify all children are still visible
      for (let i = 0; i < newChildCount; i++) {
        const child = childNodes.nth(i);
        await expect(child).toBeVisible();
      }
    });

    test('should highlight groups on hover', async ({ page }) => {
      await page.selectOption('#fileSelect', { label: 'group-simple.json' });
      await page.waitForSelector('g.node-container');
      
      const firstGroup = page.locator('g.node-container[data-type="group"]').first();
      
      // Hover over group
      await firstGroup.hover();
      await page.waitForTimeout(500);
      
      // Check for hover state
      const hoveredGroup = page.locator('g.node-container[data-type="group"]:hover');
      await expect(hoveredGroup).toHaveCount(1);
    });
  });

  test.describe('Group Performance Tests', () => {
    test('should render complex group structures efficiently', async ({ page }) => {
      // Load a dataset with complex group structures
      await page.selectOption('#fileSelect', { label: 'group-nested.json' });
      await page.waitForSelector('g.node-container');
      
      const allNodes = page.locator('g.node-container');
      const groupNodes = page.locator('g.node-container[data-type="group"]');
      const laneNodes = page.locator('g.node-container[data-type="lane"]');
      const columnNodes = page.locator('g.node-container[data-type="columns"]');
      
      const totalNodes = await allNodes.count();
      const groupCount = await groupNodes.count();
      const laneCount = await laneNodes.count();
      const columnCount = await columnNodes.count();
      
      // Should handle reasonable number of nodes and groups
      expect(totalNodes).toBeGreaterThan(0);
      expect(totalNodes).toBeLessThan(1000); // Reasonable limit
      expect(groupCount + laneCount + columnCount).toBeGreaterThan(0);
      
      // Verify all groups are rendered
      for (let i = 0; i < Math.min(groupCount, 5); i++) {
        const group = groupNodes.nth(i);
        await expect(group).toBeVisible();
      }
    });

    test('should maintain performance during group interactions', async ({ page }) => {
      await page.selectOption('#fileSelect', { label: 'group-simple.json' });
      await page.waitForSelector('g.node-container');
      
      const groups = page.locator('g.node-container[data-type="group"]');
      const startTime = Date.now();
      
      // Perform multiple group interactions
      for (let i = 0; i < Math.min(await groups.count(), 3); i++) {
        const group = groups.nth(i);
        await group.hover();
        await page.waitForTimeout(100);
      }
      
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      // Interactions should complete within reasonable time
      expect(duration).toBeLessThan(3000); // 3 seconds
    });
  });

  test.describe('Group Layout Tests', () => {
    test('should position child nodes correctly within groups', async ({ page }) => {
      await page.selectOption('#fileSelect', { label: 'group-simple.json' });
      await page.waitForSelector('g.node-container');
      
      const groupNodes = page.locator('g.node-container[data-type="group"]');
      
      for (const group of await groupNodes.all()) {
        const groupId = await group.getAttribute('data-id');
        const childNodes = page.locator(`g.node-container[data-parent="${groupId}"]`);
        
        if (await childNodes.count() > 0) {
          const groupBox = await group.boundingBox();
          
          // Verify children are positioned within group bounds
          for (const child of await childNodes.all()) {
            const childBox = await child.boundingBox();
            
            // Child should be within or near group bounds (with some tolerance)
            const tolerance = 50;
            expect(childBox.x).toBeGreaterThanOrEqual(groupBox.x - tolerance);
            expect(childBox.y).toBeGreaterThanOrEqual(groupBox.y - tolerance);
          }
        }
      }
    });

    test('should handle different group types correctly', async ({ page }) => {
      await page.selectOption('#fileSelect', { label: 'group-nested.json' });
      await page.waitForSelector('g.node-container');
      
      const dynamicGroups = page.locator('g.node-container[data-group-type="dynamic"]');
      const fixedGroups = page.locator('g.node-container[data-group-type="fixed"]');
      
      // Verify different group types are handled
      const dynamicCount = await dynamicGroups.count();
      const fixedCount = await fixedGroups.count();
      
      expect(dynamicCount + fixedCount).toBeGreaterThan(0);
      
      // Verify each group type has proper structure
      if (dynamicCount > 0) {
        const firstDynamic = dynamicGroups.first();
        await expect(firstDynamic).toBeVisible();
      }
      
      if (fixedCount > 0) {
        const firstFixed = fixedGroups.first();
        await expect(firstFixed).toBeVisible();
      }
    });
  });
}); 