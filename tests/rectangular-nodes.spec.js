import { test, expect } from '@playwright/test';

test.describe('Rectangular Node Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the rectangular node demo page
    await page.goto('/5_nodes/01_rectNode/01_rectangularNode.html');
    
    // Wait for the page to load and SVG to appear
    await page.waitForSelector('svg', { timeout: 10000 });
    
    // Wait for the dashboard to be initialized
    await page.waitForFunction(() => {
      return window.flowdash !== undefined;
    }, { timeout: 15000 });
    
    // Wait a bit more for the dashboard to be fully ready
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
      // Wait for node elements to appear
      await page.waitForSelector('g.Node', { timeout });
      
      // Wait a bit more for the nodes to be fully rendered
      await page.waitForTimeout(1000);
      
      return true;
    } catch (error) {
      console.log('Failed to find node elements:', error.message);
      
      // Debug: Check what elements are actually present
      const svgContent = await page.locator('svg').innerHTML();
      console.log('SVG content:', svgContent.substring(0, 500) + '...');
      
      return false;
    }
  }

  test('should render basic rectangular node with single rectangle', async ({ page }) => {
    // Wait for nodes to be rendered
    const nodesFound = await waitForNodes(page);
    expect(nodesFound).toBe(true);
    
    // Check for rectangular nodes
    const nodes = page.locator('g.Node');
    await expect(nodes).toHaveCount(1);
    
    // Verify the node has exactly one rectangle (no separate border)
    const node = nodes.first();
    const rectangles = node.locator('rect');
    await expect(rectangles).toHaveCount(1);
    
    // Verify rectangle properties
    const rect = rectangles.first();
    await expect(rect).toBeVisible();
    
    const width = await rect.getAttribute('width');
    const height = await rect.getAttribute('height');
    const className = await rect.getAttribute('class');
    
    expect(width).toBeTruthy();
    expect(height).toBeTruthy();
    expect(parseFloat(width)).toBeGreaterThan(0);
    expect(parseFloat(height)).toBeGreaterThan(0);
    expect(className).toContain('Node'); // Should have Node class
    expect(className).toContain('shape'); // Should have shape class
  });

  test('should render label text centered in the rectangle', async ({ page }) => {
    // Wait for nodes to be rendered
    const nodesFound = await waitForNodes(page);
    expect(nodesFound).toBe(true);
    
    const nodes = page.locator('g.Node');
    await expect(nodes).toHaveCount(1);
    
    // Verify text element exists and is centered
    const node = nodes.first();
    const text = node.locator('text');
    await expect(text).toHaveCount(1);
    await expect(text).toBeVisible();
    
    // Check text positioning attributes
    const className = await text.getAttribute('class');
    const x = await text.getAttribute('x');
    const y = await text.getAttribute('y');
    
    expect(className).toContain('Node'); // Should have Node class
    expect(className).toContain('label'); // Should have label class
    expect(x).toBe('0');
    expect(y).toBe('0');
    
    // Check text content
    const textContent = await text.textContent();
    expect(textContent).toBe('Rectangular Node');
  });

  test('should not have zone system elements for simple rectangular node', async ({ page }) => {
    // Wait for nodes to be rendered
    const nodesFound = await waitForNodes(page);
    expect(nodesFound).toBe(true);
    
    const nodes = page.locator('g.Node');
    await expect(nodes).toHaveCount(1);
    
    const node = nodes.first();
    
    // Verify no zone-related elements exist
    const headerElements = node.locator('.header-zone, .header-background, .header-text');
    const containerZoneElements = node.locator('.container-zone, .container-border');
    const marginElements = node.locator('.margin-zone');
    const innerContainerElements = node.locator('.inner-container-zone');
    
    await expect(headerElements).toHaveCount(0);
    await expect(containerZoneElements).toHaveCount(0);
    await expect(marginElements).toHaveCount(0);
    await expect(innerContainerElements).toHaveCount(0);
  });

  test('should handle status changes correctly', async ({ page }) => {
    // Wait for nodes to be rendered
    const nodesFound = await waitForNodes(page);
    expect(nodesFound).toBe(true);
    
    const nodes = page.locator('g.Node');
    await expect(nodes).toHaveCount(1);
    
    const node = nodes.first();
    const rect = node.locator('rect');
    
    // Check initial status
    const initialStatus = await rect.getAttribute('status');
    expect(initialStatus).toBe('Unknown');
    
    // Change status programmatically
    await page.evaluate(() => {
      const nodeElement = document.querySelector('g.Node');
      if (nodeElement && nodeElement.__node) {
        nodeElement.__node.status = 'Ready';
      }
    });
    
    // Wait for status change to be applied
    await page.waitForTimeout(500);
    
    // Check updated status
    const updatedStatus = await rect.getAttribute('status');
    expect(updatedStatus).toBe('Ready');
  });

  test('should resize correctly when dimensions change', async ({ page }) => {
    // Wait for nodes to be rendered
    const nodesFound = await waitForNodes(page);
    expect(nodesFound).toBe(true);
    
    const nodes = page.locator('g.Node');
    await expect(nodes).toHaveCount(1);
    
    const node = nodes.first();
    const rect = node.locator('rect');
    const text = node.locator('text');
    
    // Get initial dimensions
    const initialWidth = await rect.getAttribute('width');
    const initialHeight = await rect.getAttribute('height');
    const initialX = await rect.getAttribute('x');
    const initialY = await rect.getAttribute('y');
    
    // Change dimensions programmatically
    await page.evaluate(() => {
      const nodeElement = document.querySelector('g.Node');
      if (nodeElement && nodeElement.__node) {
        nodeElement.__node.resize({ width: 200, height: 40 });
      }
    });
    
    // Wait for resize to be applied
    await page.waitForTimeout(500);
    
    // Check updated dimensions
    const updatedWidth = await rect.getAttribute('width');
    const updatedHeight = await rect.getAttribute('height');
    const updatedX = await rect.getAttribute('x');
    const updatedY = await rect.getAttribute('y');
    
    expect(updatedWidth).toBe('200');
    expect(updatedHeight).toBe('40');
    expect(updatedX).toBe('-100'); // -width/2
    expect(updatedY).toBe('-20'); // -height/2
    
    // Verify text remains centered
    const textX = await text.getAttribute('x');
    const textY = await text.getAttribute('y');
    expect(textX).toBe('0');
    expect(textY).toBe('0');
  });

  test('should handle long text labels correctly', async ({ page }) => {
    // Wait for nodes to be rendered
    const nodesFound = await waitForNodes(page);
    expect(nodesFound).toBe(true);
    
    const nodes = page.locator('g.Node');
    await expect(nodes).toHaveCount(1);
    
    const node = nodes.first();
    const text = node.locator('text');
    
    // Change to a long text label
    await page.evaluate(() => {
      const nodeElement = document.querySelector('g.Node');
      if (nodeElement && nodeElement.__node) {
        nodeElement.__node.data.label = 'This is a very long text label that should be handled properly';
        nodeElement.__node.redrawText(nodeElement.__node.data.label, 300);
      }
    });
    
    // Wait for text change to be applied
    await page.waitForTimeout(500);
    
    // Check that text is updated
    const textContent = await text.textContent();
    expect(textContent).toBe('This is a very long text label that should be handled properly');
    
    // Check that rectangle width was updated
    const rect = node.locator('rect');
    const width = await rect.getAttribute('width');
    expect(parseFloat(width)).toBeGreaterThanOrEqual(300);
  });

  test('should render lane with 3 rectangular nodes correctly', async ({ page }) => {
    // Navigate to the lane demo page
    await page.goto('/5_nodes/01_rectNode/03_node_lane.html');
    
    // Wait for the page to load and SVG to appear
    await page.waitForSelector('svg', { timeout: 10000 });
    
    // Wait for the dashboard to be initialized - use a more reliable approach
    await page.waitForFunction(() => {
      return window.flowdash !== undefined || window.flowDashboard !== undefined;
    }, { timeout: 15000 });
    
    // Wait a bit more for the dashboard to be fully ready
    await page.waitForTimeout(2000);
    
    // Wait for nodes to be rendered
    const nodesFound = await waitForNodes(page);
    expect(nodesFound).toBe(true);
    
    // Check for the lane container and child nodes
    const laneNode = page.locator('g.Node').filter({ hasText: 'Lane' });
    await expect(laneNode).toHaveCount(1);
    
    // Check for child rectangular nodes - use a more flexible selector
    const childNodes = page.locator('g.Node').filter({ hasText: /simple|longtext|very long/ });
    await expect(childNodes).toHaveCount(3);
    
    // Verify each child node has proper structure
    for (let i = 0; i < 3; i++) {
      const childNode = childNodes.nth(i);
      const rect = childNode.locator('rect');
      const text = childNode.locator('text');
      
      await expect(rect).toBeVisible();
      await expect(text).toBeVisible();
      
      // Check rectangle dimensions
      const width = await rect.getAttribute('width');
      const height = await rect.getAttribute('height');
      expect(parseFloat(width)).toBeGreaterThan(0);
      expect(parseFloat(height)).toBeGreaterThan(0);
      
      // Check text content
      const textContent = await text.textContent();
      expect(textContent).toBeTruthy();
    }
    
    // Test specific issues mentioned by user
    const longTextNode = page.locator('g.Node').filter({ hasText: 'this is a long text' });
    const veryLongTextNode = page.locator('g.Node').filter({ hasText: 'this is a very text' });
    
    // Check that long text nodes are properly sized
    await expect(longTextNode).toBeVisible();
    await expect(veryLongTextNode).toBeVisible();
    
    // Verify text positioning and containment
    const longTextPositions = await page.evaluate(() => {
      const nodes = document.querySelectorAll('g.Node');
      let targetNode = null;
      
      for (const node of nodes) {
        const text = node.querySelector('text');
        if (text && text.textContent.includes('this is a long text')) {
          targetNode = node;
          break;
        }
      }
      
      if (!targetNode) return null;
      
      const rect = targetNode.querySelector('rect');
      const text = targetNode.querySelector('text');
      
      if (!rect || !text) return null;
      
      const rectX = parseFloat(rect.getAttribute('x') || 0);
      const rectY = parseFloat(rect.getAttribute('y') || 0);
      const rectW = parseFloat(rect.getAttribute('width') || 0);
      const rectH = parseFloat(rect.getAttribute('height') || 0);
      
      const textX = parseFloat(text.getAttribute('x') || 0);
      const textY = parseFloat(text.getAttribute('y') || 0);
      
      return { rectX, rectY, rectW, rectH, textX, textY };
    });
    
    if (longTextPositions) {
      // Text should be centered (x=0, y=0 relative to node center)
      expect(longTextPositions.textX).toBe(0);
      expect(longTextPositions.textY).toBe(0);
      
      // Rectangle should be positioned relative to center
      expect(longTextPositions.rectX).toBe(-longTextPositions.rectW / 2);
      expect(longTextPositions.rectY).toBe(-longTextPositions.rectH / 2);
    }
    
    // Test that child nodes are centered within the lane container
    const centeringTest = await page.evaluate(() => {
      const laneNode = Array.from(document.querySelectorAll('g.Node')).find(node => {
        const text = node.querySelector('text');
        return text && text.textContent.includes('Lane');
      });
      
      if (!laneNode) return null;
      
      // Get lane container bounds
      const laneRect = laneNode.querySelector('rect');
      if (!laneRect) return null;
      
      const laneX = parseFloat(laneRect.getAttribute('x') || 0);
      const laneY = parseFloat(laneRect.getAttribute('y') || 0);
      const laneW = parseFloat(laneRect.getAttribute('width') || 0);
      const laneH = parseFloat(laneRect.getAttribute('height') || 0);
      
      // Get child nodes
      const childNodes = Array.from(document.querySelectorAll('g.Node')).filter(node => {
        const text = node.querySelector('text');
        return text && (text.textContent.includes('simple') || 
                       text.textContent.includes('longtext') || 
                       text.textContent.includes('very long'));
      });
      
      const childPositions = childNodes.map(childNode => {
        const rect = childNode.querySelector('rect');
        if (!rect) return null;
        
        const childX = parseFloat(rect.getAttribute('x') || 0);
        const childY = parseFloat(rect.getAttribute('y') || 0);
        const childW = parseFloat(rect.getAttribute('width') || 0);
        const childH = parseFloat(rect.getAttribute('height') || 0);
        
        // Calculate child center relative to lane center
        const childCenterX = childX + childW / 2;
        const childCenterY = childY + childH / 2;
        const laneCenterX = laneX + laneW / 2;
        const laneCenterY = laneY + laneH / 2;
        
        return {
          childCenterX,
          childCenterY,
          laneCenterX,
          laneCenterY,
          horizontalOffset: Math.abs(childCenterX - laneCenterX),
          verticalOffset: Math.abs(childCenterY - laneCenterY)
        };
      }).filter(pos => pos !== null);
      
      return {
        laneBounds: { x: laneX, y: laneY, width: laneW, height: laneH },
        childPositions
      };
    });
    
    if (centeringTest) {
      // Check that children are horizontally centered within the lane
      centeringTest.childPositions.forEach((pos, index) => {
        // Allow for small tolerance in positioning (5px)
        expect(pos.horizontalOffset).toBeLessThan(5);
        console.log(`Child ${index} horizontal offset: ${pos.horizontalOffset}px`);
      });
    }
  });

  test('should have proper CSS classes and styling', async ({ page }) => {
    // Wait for nodes to be rendered
    const nodesFound = await waitForNodes(page);
    expect(nodesFound).toBe(true);
    
    const nodes = page.locator('g.Node');
    await expect(nodes).toHaveCount(1);
    
    const node = nodes.first();
    const rect = node.locator('rect');
    const text = node.locator('text');
    
    // Check CSS classes
    const rectClass = await rect.getAttribute('class');
    const textClass = await text.getAttribute('class');
    
    expect(rectClass).toContain('Node');
    expect(rectClass).toContain('shape');
    expect(textClass).toContain('Node');
    expect(textClass).toContain('label');
    
    // Check that CSS classes are applied correctly
    expect(rectClass).toContain('Node');
    expect(rectClass).toContain('shape');
    expect(textClass).toContain('Node');
    expect(textClass).toContain('label');
    
    // Verify the elements are visible and properly styled
    await expect(rect).toBeVisible();
    await expect(text).toBeVisible();
  });
}); 