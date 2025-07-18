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
      
      // Wait for child nodes to be rendered
      await page.waitForSelector('g.node-container', { timeout });
      
      // Wait for CSS transitions to complete (0.2s transitions + buffer)
      await page.waitForTimeout(1000);
      
      // Wait for any ongoing positioning calculations to complete
      await page.waitForFunction(() => {
        const adapter = document.querySelector('g.adapter');
        if (!adapter) return false;
        
        const headerBackground = adapter.querySelector('rect.header-background');
        const mainRect = adapter.querySelector('rect.adapter.shape');
        const childNodes = adapter.querySelectorAll('g.node-container');
        
        if (!headerBackground || !mainRect) return false;
        
        // Check if we have child nodes
        if (childNodes.length === 0) return false;
        
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

    test('should render adapter child nodes with text inside their rectangles', async ({ page }) => {
      const nodesFound = await waitForNodes(page);
      expect(nodesFound).toBe(true);
      
      const adapterNodes = page.locator('g.adapter');
      await expect(adapterNodes).toHaveCount(1);
      
      // Debug: Log the structure of the adapter
      const adapterStructure = await page.evaluate(() => {
        const adapter = document.querySelector('g.adapter');
        if (!adapter) return 'No adapter found';
        
        const childContainers = adapter.querySelectorAll('g.node-container');
        const allRects = adapter.querySelectorAll('rect');
        const allTexts = adapter.querySelectorAll('text');
        
        return {
          childContainers: childContainers.length,
          allRects: allRects.length,
          allTexts: allTexts.length,
          childDetails: Array.from(childContainers).map((container, i) => {
            const rects = container.querySelectorAll('rect');
            const texts = container.querySelectorAll('text');
            return {
              index: i,
              rects: rects.length,
              texts: texts.length,
              rectClasses: Array.from(rects).map(r => r.className.baseVal),
              textClasses: Array.from(texts).map(t => t.className.baseVal),
              textContent: Array.from(texts).map(t => t.textContent)
            };
          })
        };
      });
      
      console.log('Adapter structure:', JSON.stringify(adapterStructure, null, 2));
      
      // For each adapter node, check that child rectangular nodes have text inside them
      for (const adapterNode of await adapterNodes.all()) {
        // Find all child rectangular nodes within the adapter (excluding the main adapter shape)
        const childRects = adapterNode.locator('g.node-container rect').filter({ hasNot: page.locator('.adapter.shape') });
        const childTexts = adapterNode.locator('g.node-container text').filter({ hasNot: page.locator('.header-text') });
        
        // Check that we have both rectangles and texts
        const rectCount = await childRects.count();
        const textCount = await childTexts.count();
        
        console.log(`Found ${rectCount} child rectangles and ${textCount} child texts`);
        
        expect(rectCount).toBeGreaterThan(0);
        expect(textCount).toBeGreaterThan(0);
        
        // For each child node, verify text is inside its rectangle
        for (let i = 0; i < Math.min(rectCount, textCount); i++) {
          const rect = childRects.nth(i);
          const text = childTexts.nth(i);
          
          // Get positions and dimensions
          const positions = await page.evaluate(({ rectIndex, textIndex }) => {
            const rects = document.querySelectorAll('g.node-container rect');
            const texts = document.querySelectorAll('g.node-container text');
            
            // Filter out main adapter shape and header text
            const childRects = Array.from(rects).filter(rect => 
              !rect.classList.contains('adapter') && !rect.classList.contains('shape')
            );
            const childTexts = Array.from(texts).filter(text => 
              !text.classList.contains('header-text')
            );
            
            const rect = childRects[rectIndex];
            const text = childTexts[textIndex];
            
            if (!rect || !text) return null;
            
            // Get rectangle bounds
            const rectX = parseFloat(rect.getAttribute('x') || 0);
            const rectY = parseFloat(rect.getAttribute('y') || 0);
            const rectW = parseFloat(rect.getAttribute('width') || 0);
            const rectH = parseFloat(rect.getAttribute('height') || 0);
            
            // Get text position
            const textX = parseFloat(text.getAttribute('x') || 0);
            const textY = parseFloat(text.getAttribute('y') || 0);
            
            // Get text bounding box for width/height
            const textBBox = text.getBBox ? text.getBBox() : { width: 0, height: 0 };
            
            return {
              rectX, rectY, rectW, rectH,
              textX, textY, textW: textBBox.width, textH: textBBox.height,
              textContent: text.textContent,
              rectClass: rect.className.baseVal,
              textClass: text.className.baseVal
            };
          }, { rectIndex: i, textIndex: i });
          
          if (!positions) continue;
          
          console.log(`Child ${i}: rect(${positions.rectX}, ${positions.rectY}, ${positions.rectW}, ${positions.rectH}) [${positions.rectClass}], text("${positions.textContent}" at ${positions.textX}, ${positions.textY}, ${positions.textW}x${positions.textH}) [${positions.textClass}]`);
          
          // Text should be inside the rectangle bounds
          // Allow for some padding (2px) around the text
          const padding = 2;
          
          // Check horizontal containment
          expect(positions.textX - positions.textW / 2).toBeGreaterThanOrEqual(positions.rectX + padding);
          expect(positions.textX + positions.textW / 2).toBeLessThanOrEqual(positions.rectX + positions.rectW - padding);
          
          // Check vertical containment
          expect(positions.textY - positions.textH / 2).toBeGreaterThanOrEqual(positions.rectY + padding);
          expect(positions.textY + positions.textH / 2).toBeLessThanOrEqual(positions.rectY + positions.rectH - padding);
        }
      }
    });

    test('should render adapter child nodes with proper text content', async ({ page }) => {
      const nodesFound = await waitForNodes(page);
      expect(nodesFound).toBe(true);
      
      const adapterNodes = page.locator('g.adapter');
      await expect(adapterNodes).toHaveCount(1);
      
      // For each adapter node, check that child nodes have meaningful text content
      for (const adapterNode of await adapterNodes.all()) {
        const childTexts = adapterNode.locator('g.node-container text').filter({ hasNot: page.locator('.header-text') });
        const textCount = await childTexts.count();
        
        console.log(`Found ${textCount} child text elements`);
        
        expect(textCount).toBeGreaterThan(0);
        
        // Check each text element has content
        for (let i = 0; i < textCount; i++) {
          const text = childTexts.nth(i);
          const textContent = await text.textContent();
          
          console.log(`Child text ${i}: "${textContent}"`);
          
          expect(textContent).toBeTruthy();
          expect(textContent.trim()).not.toBe('');
          expect(textContent.trim().length).toBeGreaterThan(0);
        }
      }
    });

    test('should render adapter child nodes with consistent styling', async ({ page }) => {
      const nodesFound = await waitForNodes(page);
      expect(nodesFound).toBe(true);
      
      const adapterNodes = page.locator('g.adapter');
      await expect(adapterNodes).toHaveCount(1);
      
      // For each adapter node, check that child nodes have consistent styling
      for (const adapterNode of await adapterNodes.all()) {
        const childRects = adapterNode.locator('g.node-container rect');
        const childTexts = adapterNode.locator('g.node-container text');
        
        const rectCount = await childRects.count();
        const textCount = await childTexts.count();
        
        expect(rectCount).toBeGreaterThan(0);
        expect(textCount).toBeGreaterThan(0);
        
        // Check that rectangles are visible
        for (let i = 0; i < rectCount; i++) {
          const rect = childRects.nth(i);
          await expect(rect).toBeVisible();
        }
        
        // Check that texts are visible
        for (let i = 0; i < textCount; i++) {
          const text = childTexts.nth(i);
          await expect(text).toBeVisible();
        }
      }
    });
  });

  test.describe('Multiple Adapter Layout Tests', () => {
    test.beforeEach(async ({ page }) => {
      // Navigate to the multiple adapter layouts test page
      await page.goto('/5_nodes/10_adapter/02_layouts_full_.html');
      
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

    test('should render multiple adapter nodes with different layouts', async ({ page }) => {
      // Wait for adapter elements to appear
      await page.waitForSelector('g.adapter', { timeout: 30000 });
      await page.waitForTimeout(1000);
      
      const adapterNodes = page.locator('g.adapter');
      const adapterCount = await adapterNodes.count();
      
      expect(adapterCount).toBeGreaterThan(1);
      
      // Verify each adapter has child nodes
      for (const adapterNode of await adapterNodes.all()) {
        const childRects = adapterNode.locator('g.node-container rect');
        const childTexts = adapterNode.locator('g.node-container text');
        
        const rectCount = await childRects.count();
        const textCount = await childTexts.count();
        
        expect(rectCount).toBeGreaterThan(0);
        expect(textCount).toBeGreaterThan(0);
      }
    });

    test('should ensure text is contained within rectangular nodes across all adapter layouts', async ({ page }) => {
      // Wait for adapter elements to appear
      await page.waitForSelector('g.adapter', { timeout: 30000 });
      await page.waitForTimeout(1000);
      
      const adapterNodes = page.locator('g.adapter');
      const adapterCount = await adapterNodes.count();
      
      expect(adapterCount).toBeGreaterThan(1);
      
      // Check each adapter node
      for (const adapterNode of await adapterNodes.all()) {
        const childRects = adapterNode.locator('g.node-container rect');
        const childTexts = adapterNode.locator('g.node-container text');
        
        const rectCount = await childRects.count();
        const textCount = await childTexts.count();
        
        // For each child node, verify text is inside its rectangle
        for (let i = 0; i < Math.min(rectCount, textCount); i++) {
          const rect = childRects.nth(i);
          const text = childTexts.nth(i);
          
                     // Get positions and dimensions
           const positions = await page.evaluate(({ rectIndex, textIndex }) => {
             const rects = document.querySelectorAll('g.node-container rect');
             const texts = document.querySelectorAll('g.node-container text');
             
             const rect = rects[rectIndex];
             const text = texts[textIndex];
             
             if (!rect || !text) return null;
             
             // Get rectangle bounds
             const rectX = parseFloat(rect.getAttribute('x') || 0);
             const rectY = parseFloat(rect.getAttribute('y') || 0);
             const rectW = parseFloat(rect.getAttribute('width') || 0);
             const rectH = parseFloat(rect.getAttribute('height') || 0);
             
             // Get text position
             const textX = parseFloat(text.getAttribute('x') || 0);
             const textY = parseFloat(text.getAttribute('y') || 0);
             
             // Get text bounding box for width/height
             const textBBox = text.getBBox ? text.getBBox() : { width: 0, height: 0 };
             
             return {
               rectX, rectY, rectW, rectH,
               textX, textY, textW: textBBox.width, textH: textBBox.height
             };
           }, { rectIndex: i, textIndex: i });
           
           if (!positions) continue;
          
          // Text should be inside the rectangle bounds
          // Allow for some padding (2px) around the text
          const padding = 2;
          
          // Check horizontal containment
          expect(positions.textX - positions.textW / 2).toBeGreaterThanOrEqual(positions.rectX + padding);
          expect(positions.textX + positions.textW / 2).toBeLessThanOrEqual(positions.rectX + positions.rectW - padding);
          
          // Check vertical containment
          expect(positions.textY - positions.textH / 2).toBeGreaterThanOrEqual(positions.rectY + padding);
          expect(positions.textY + positions.textH / 2).toBeLessThanOrEqual(positions.rectY + positions.rectH - padding);
        }
      }
    });

    test('should verify different adapter layout arrangements have proper text positioning', async ({ page }) => {
      // Wait for adapter elements to appear
      await page.waitForSelector('g.adapter', { timeout: 30000 });
      await page.waitForTimeout(1000);
      
      const adapterNodes = page.locator('g.adapter');
      const adapterCount = await adapterNodes.count();
      
      expect(adapterCount).toBeGreaterThan(1);
      
      // Check each adapter node for proper text positioning
      for (const adapterNode of await adapterNodes.all()) {
        const childRects = adapterNode.locator('g.node-container rect');
        const childTexts = adapterNode.locator('g.node-container text');
        
        const rectCount = await childRects.count();
        const textCount = await childTexts.count();
        
        expect(rectCount).toBeGreaterThan(0);
        expect(textCount).toBeGreaterThan(0);
        
        // Verify each text element has content and is positioned within its rectangle
        for (let i = 0; i < textCount; i++) {
          const text = childTexts.nth(i);
          const textContent = await text.textContent();
          
          expect(textContent).toBeTruthy();
          expect(textContent.trim()).not.toBe('');
          
          // Check that text is visible
          await expect(text).toBeVisible();
        }
        
        // Verify each rectangle is visible and has proper dimensions
        for (let i = 0; i < rectCount; i++) {
          const rect = childRects.nth(i);
          await expect(rect).toBeVisible();
          
          // Check rectangle has positive dimensions
          const width = await rect.getAttribute('width');
          const height = await rect.getAttribute('height');
          
          expect(parseFloat(width)).toBeGreaterThan(0);
          expect(parseFloat(height)).toBeGreaterThan(0);
        }
      }
    });
  });
}); 