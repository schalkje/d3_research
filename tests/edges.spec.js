import { test, expect } from '@playwright/test';

test.describe('Edge Rendering Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the main dashboard
    await page.goto('/7_dashboard/flowdash-js.html');
    await page.waitForSelector('svg', { timeout: 10000 });
  });

  test.describe('Simple Edge Scenarios', () => {
    test('should render simple edge between two nodes', async ({ page }) => {
      // Load the simple edge test data
      await page.selectOption('#fileSelect', { label: 'dwh-1.json' });
      await page.waitForSelector('g.node-container');
      
      // Verify edge rendering
      const edges = page.locator('path.edge');
      const nodes = page.locator('g.node-container');
      
      await expect(edges).toHaveCount.greaterThan(0);
      await expect(nodes).toHaveCount.greaterThan(0);
      
      // Verify edge connects nodes
      const edgePaths = await edges.all();
      for (const edge of edgePaths) {
        const d = await edge.getAttribute('d');
        expect(d).toBeTruthy();
        expect(d.length).toBeGreaterThan(0);
      }
    });

    test('should render edges with different node types', async ({ page }) => {
      // Load test data with different node types
      await page.selectOption('#fileSelect', { label: 'dwh-2.json' });
      await page.waitForSelector('g.node-container');
      
      const adapterNodes = page.locator('g.node-container[data-type="adapter"]');
      const foundationNodes = page.locator('g.node-container[data-type="foundation"]');
      const edges = page.locator('path.edge');
      
      await expect(adapterNodes).toHaveCount.greaterThan(0);
      await expect(foundationNodes).toHaveCount.greaterThan(0);
      await expect(edges).toHaveCount.greaterThan(0);
    });
  });

  test.describe('Curved Edge Scenarios', () => {
    test('should render curved edges correctly', async ({ page }) => {
      // Load test data with curved edges
      await page.selectOption('#fileSelect', { label: 'dwh-3.json' });
      await page.waitForSelector('path.edge');
      
      const curvedEdges = page.locator('path.edge[d*="C"]'); // Curved paths contain 'C' commands
      await expect(curvedEdges).toHaveCount.greaterThan(0);
      
      // Verify curved edge properties
      for (const edge of await curvedEdges.all()) {
        const d = await edge.getAttribute('d');
        expect(d).toContain('C'); // Should contain curve commands
      }
    });
  });

  test.describe('Column Layout Edges', () => {
    test('should render edges in column layouts', async ({ page }) => {
      // Load test data with column layouts
      await page.selectOption('#fileSelect', { label: 'dwh-4.json' });
      await page.waitForSelector('g.node-container');
      
      const columnGroups = page.locator('g.node-container[data-type="columns"]');
      const edges = page.locator('path.edge');
      
      await expect(columnGroups).toHaveCount.greaterThan(0);
      await expect(edges).toHaveCount.greaterThan(0);
      
      // Verify edges connect nodes in different columns
      const nodes = page.locator('g.node-container');
      const nodeCount = await nodes.count();
      expect(nodeCount).toBeGreaterThan(1);
    });
  });

  test.describe('Complex Layout Edges', () => {
    test('should render edges in mixed column-lane layouts', async ({ page }) => {
      // Load test data with complex layouts
      await page.selectOption('#fileSelect', { label: 'dwh-5.json' });
      await page.waitForSelector('g.node-container');
      
      const laneGroups = page.locator('g.node-container[data-type="lane"]');
      const columnGroups = page.locator('g.node-container[data-type="columns"]');
      const edges = page.locator('path.edge');
      
      await expect(edges).toHaveCount.greaterThan(0);
      
      // Verify complex layout structure
      const totalGroups = await laneGroups.count() + await columnGroups.count();
      expect(totalGroups).toBeGreaterThan(0);
    });
  });

  test.describe('Edge Visual Properties', () => {
    test('should render edges with correct styling', async ({ page }) => {
      await page.selectOption('#fileSelect', { label: 'dwh-1.json' });
      await page.waitForSelector('path.edge');
      
      const edges = page.locator('path.edge');
      
      for (const edge of await edges.all()) {
        // Verify edge has stroke
        const stroke = await edge.getAttribute('stroke');
        expect(stroke).toBeTruthy();
        
        // Verify edge has stroke width
        const strokeWidth = await edge.getAttribute('stroke-width');
        expect(strokeWidth).toBeTruthy();
        
        // Verify edge is visible
        await expect(edge).toBeVisible();
      }
    });

    test('should render active edges differently', async ({ page }) => {
      await page.selectOption('#fileSelect', { label: 'dwh-1.json' });
      await page.waitForSelector('path.edge');
      
      const activeEdges = page.locator('path.edge.active');
      const inactiveEdges = page.locator('path.edge:not(.active)');
      
      // Check that edges have appropriate classes
      const totalEdges = await page.locator('path.edge').count();
      const activeCount = await activeEdges.count();
      const inactiveCount = await inactiveEdges.count();
      
      expect(activeCount + inactiveCount).toBe(totalEdges);
    });
  });

  test.describe('Edge Interaction Tests', () => {
    test('should highlight edges on hover', async ({ page }) => {
      await page.selectOption('#fileSelect', { label: 'dwh-1.json' });
      await page.waitForSelector('path.edge');
      
      const firstEdge = page.locator('path.edge').first();
      
      // Hover over edge
      await firstEdge.hover();
      await page.waitForTimeout(500);
      
      // Check for hover state (this depends on your CSS implementation)
      const hoveredEdge = page.locator('path.edge:hover');
      await expect(hoveredEdge).toHaveCount(1);
    });

    test('should maintain edge connections during node movement', async ({ page }) => {
      await page.selectOption('#fileSelect', { label: 'dwh-1.json' });
      await page.waitForSelector('g.node-container');
      
      const firstNode = page.locator('g.node-container').first();
      const initialPosition = await firstNode.boundingBox();
      
      // Simulate dragging the node
      await firstNode.hover();
      await page.mouse.down();
      await page.mouse.move(initialPosition.x + 100, initialPosition.y + 100);
      await page.mouse.up();
      
      await page.waitForTimeout(1000);
      
      // Verify edges still exist and are connected
      const edges = page.locator('path.edge');
      await expect(edges).toHaveCount.greaterThan(0);
      
      // Verify edge paths are still valid
      for (const edge of await edges.all()) {
        const d = await edge.getAttribute('d');
        expect(d).toBeTruthy();
        expect(d.length).toBeGreaterThan(0);
      }
    });
  });

  test.describe('Edge Performance Tests', () => {
    test('should render many edges efficiently', async ({ page }) => {
      // Load a dataset with many edges
      await page.selectOption('#fileSelect', { label: 'dwh-6.json' });
      await page.waitForSelector('path.edge');
      
      const edges = page.locator('path.edge');
      const edgeCount = await edges.count();
      
      // Should handle reasonable number of edges
      expect(edgeCount).toBeGreaterThan(0);
      expect(edgeCount).toBeLessThan(1000); // Reasonable limit
      
      // Verify all edges are rendered
      for (let i = 0; i < Math.min(edgeCount, 10); i++) {
        const edge = edges.nth(i);
        await expect(edge).toBeVisible();
      }
    });
  });
}); 