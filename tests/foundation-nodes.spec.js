import { test, expect } from '@playwright/test';

test.describe('Foundation Node Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the specific foundation node test page
    await page.goto('/5_nodes/11_foundation/01_single.html');
    
    // Wait for the page to load and basic elements to appear
    await page.waitForSelector('svg', { timeout: 10000 });
    
    // Wait a bit more for the page to be fully ready
    await page.waitForTimeout(2000);
    
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
    test('should render single foundation node', async ({ page }) => {
      const nodesFound = await waitForNodes(page);
      expect(nodesFound).toBe(true);
      
      const foundationNodes = page.locator('g.node-container[data-type="foundation"]');
      await expect(foundationNodes).toHaveCount.greaterThan(0);
      
      // Verify foundation node structure
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
      
      const foundationNodes = page.locator('g.node-container[data-type="foundation"]');
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
      
      const foundationNodes = page.locator('g.node-container[data-type="foundation"]');
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
      
      const foundationNodes = page.locator('g.node-container[data-type="foundation"]');
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
      
      const foundationNodes = page.locator('g.node-container[data-type="foundation"]');
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
}); 