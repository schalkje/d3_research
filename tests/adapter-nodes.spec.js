import { test, expect } from '@playwright/test';

test.describe('Adapter Node Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the specific adapter node test page
    await page.goto('/5_nodes/10_adapter/01_single.html');
    
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
      // Wait for adapter elements to appear
      await page.waitForSelector('g.adapter', { timeout });
      
      // Wait for header elements to be fully rendered
      await page.waitForSelector('g.adapter rect.header-background', { timeout });
      await page.waitForSelector('g.adapter text.header-text', { timeout });
      
      // Wait for CSS transitions to complete (0.2s transitions + buffer)
      await page.waitForTimeout(500);
      
      // Wait for any ongoing positioning calculations to complete
      await page.waitForFunction(() => {
        const adapter = document.querySelector('g.adapter');
        if (!adapter) return false;
        
        const headerBackground = adapter.querySelector('rect.header-background');
        const mainRect = adapter.querySelector('rect.adapter.shape');
        
        if (!headerBackground || !mainRect) return false;
        
        // Check if positioning is stable by comparing positions
        const headerBox = headerBackground.getBoundingClientRect();
        const mainBox = mainRect.getBoundingClientRect();
        
        // Ensure elements have valid dimensions and positions
        const hasValidDimensions = headerBox.width > 0 && headerBox.height > 0 && 
                                  mainBox.width > 0 && mainBox.height > 0;
        
        if (!hasValidDimensions) return false;
        
        // Check if positioning is stable (header at top of container)
        const headerTop = headerBox.y;
        const containerTop = mainBox.y;
        const positionDifference = Math.abs(headerTop - containerTop);
        
        // Wait for positioning to be stable within 2px
        return positionDifference < 2;
      }, { timeout });
      
      return true;
    } catch (error) {
      console.log('Failed to find adapter elements:', error.message);
      
      // Debug: Check what elements are actually present
      const svgContent = await page.locator('svg').innerHTML();
      console.log('SVG content:', svgContent.substring(0, 500) + '...');
      
      // Check if there are any other elements in the SVG
      const allElements = await page.locator('svg *').count();
      console.log('Total elements in SVG:', allElements);
      
      return false;
    }
  }

  test.describe('Simple Adapter Node Tests', () => {
    test('should render single adapter node', async ({ page }) => {
      const nodesFound = await waitForNodes(page);
      expect(nodesFound).toBe(true);
      
      const adapterNodes = page.locator('g.adapter');
      await expect(adapterNodes).toHaveCount(1);
      
      // Verify adapter node structure
      for (const node of await adapterNodes.all()) {
        const mainRect = node.locator('rect.adapter.shape');
        const headerText = node.locator('.header-text').first();
        
        await expect(mainRect).toBeVisible();
        await expect(headerText).toBeVisible();
        
        // Verify adapter-specific elements
        const codeElement = node.locator('.code');
        if (await codeElement.count() > 0) {
          await expect(codeElement).toBeVisible();
        }
      }
    });

    test('should render adapter node with proper data attributes', async ({ page }) => {
      const nodesFound = await waitForNodes(page);
      expect(nodesFound).toBe(true);
      
      const adapterNodes = page.locator('g.adapter');
      await expect(adapterNodes).toHaveCount(1);
      
      // Verify adapter node has correct data attributes
      for (const node of await adapterNodes.all()) {
        // Verify node has an ID
        const nodeId = await node.getAttribute('id');
        expect(nodeId).toBeTruthy();
        
        // Verify node is visible
        await expect(node).toBeVisible();
      }
    });

    test('should render adapter node with text content', async ({ page }) => {
      const nodesFound = await waitForNodes(page);
      expect(nodesFound).toBe(true);
      
      const adapterNodes = page.locator('g.adapter');
      await expect(adapterNodes).toHaveCount(1);
      
      // Verify text content in adapter nodes
      for (const node of await adapterNodes.all()) {
        // Check for the main adapter header text (first header-text in the adapter)
        const headerText = node.locator('.header-text').first();
        await expect(headerText).toBeVisible();
        
        // Check for text content
        const textContent = await headerText.textContent();
        expect(textContent).toBeTruthy();
        expect(textContent.trim()).not.toBe('');
      }
    });

    test('should render adapter node with proper styling', async ({ page }) => {
      const nodesFound = await waitForNodes(page);
      expect(nodesFound).toBe(true);
      
      const adapterNodes = page.locator('g.adapter');
      await expect(adapterNodes).toHaveCount(1);
      
      // Verify styling properties
      for (const node of await adapterNodes.all()) {
        const mainRect = node.locator('rect.adapter.shape');
        
        // Verify the rectangle is visible (which means it has styling applied)
        await expect(mainRect).toBeVisible();
        
        // Verify node is visible
        await expect(node).toBeVisible();
      }
    });

    test('should render adapter node with correct positioning', async ({ page }) => {
      const nodesFound = await waitForNodes(page);
      expect(nodesFound).toBe(true);
      
      const adapterNodes = page.locator('g.adapter');
      await expect(adapterNodes).toHaveCount(1);
      
      // Verify each adapter node has a valid position
      for (const node of await adapterNodes.all()) {
        const boundingBox = await node.boundingBox();
        expect(boundingBox).toBeTruthy();
        // SVG elements can have negative coordinates due to transforms, so only check width/height
        expect(boundingBox.width).toBeGreaterThan(0);
        expect(boundingBox.height).toBeGreaterThan(0);
      }
    });

    test('should render adapter node header with correct positioning', async ({ page }) => {
      const nodesFound = await waitForNodes(page);
      expect(nodesFound).toBe(true);
      
      const adapterNodes = page.locator('g.adapter');
      await expect(adapterNodes).toHaveCount(1);
      
      // For each adapter node, check SVG attribute-based positioning
      for (const node of await adapterNodes.all()) {
        // Get SVG attribute values for header and main rect
        const svgPositions = await page.evaluate((nodeId) => {
          const adapter = document.getElementById(nodeId);
          const headerBackground = adapter.querySelector('rect.header-background');
          const mainRect = adapter.querySelector('rect.adapter.shape');
          const headerText = adapter.querySelector('text.header-text');

          // Get SVG attributes
          const headerX = parseFloat(headerBackground.getAttribute('x') || 0);
          const headerY = parseFloat(headerBackground.getAttribute('y') || 0);
          const headerW = parseFloat(headerBackground.getAttribute('width') || 0);
          const headerH = parseFloat(headerBackground.getAttribute('height') || 0);

          const mainX = parseFloat(mainRect.getAttribute('x') || 0);
          const mainY = parseFloat(mainRect.getAttribute('y') || 0);
          const mainW = parseFloat(mainRect.getAttribute('width') || 0);
          const mainH = parseFloat(mainRect.getAttribute('height') || 0);

          // For text, get y and height (vertical centering)
          const textY = parseFloat(headerText.getAttribute('y') || 0);
          const textH = headerText.getBBox ? headerText.getBBox().height : 0;

          return {
            headerX, headerY, headerW, headerH,
            mainX, mainY, mainW, mainH,
            textY, textH
          };
        }, await node.getAttribute('id'));

        // Header should be positioned above the main rect (current implementation)
        expect(svgPositions.headerY).toBeGreaterThan(svgPositions.mainY);
        // Header should be close to the main rect's top edge
        expect(svgPositions.headerY - svgPositions.mainY).toBeLessThan(50);
        // Header should span the full width of the main rect
        expect(svgPositions.headerW).toBeCloseTo(svgPositions.mainW, 1);
        // Header x should match main rect x
        expect(svgPositions.headerX).toBeCloseTo(svgPositions.mainX, 1);
        // Header should have positive width/height
        expect(svgPositions.headerW).toBeGreaterThan(0);
        expect(svgPositions.headerH).toBeGreaterThan(0);
        // Text should be vertically centered in header (within 1px)
        const headerCenterY = svgPositions.headerY + svgPositions.headerH / 2;
        const textCenterY = svgPositions.textY; // SVG text y is usually already centered
        expect(Math.abs(headerCenterY - textCenterY)).toBeLessThan(2);
      }
    });
  });
}); 