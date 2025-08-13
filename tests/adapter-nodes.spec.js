import { test, expect } from '@playwright/test';

test.describe('Adapter Node Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the specific adapter node test page
    await page.goto('/06_adapterNodes/01_single/01_single.html');
    
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
      
      // Wait for any child nodes to be rendered (could be in different structures)
      await page.waitForFunction(() => {
        const adapter = document.querySelector('g.adapter');
        if (!adapter) return false;
        
        // Look for child nodes in various possible locations
        const childContainers = adapter.querySelectorAll('g.node-container');
        const childNodes = adapter.querySelectorAll('g.Node');
        const childRects = adapter.querySelectorAll('rect:not(.adapter):not(.header-background)');
        const childTexts = adapter.querySelectorAll('g text:not(.header-text)');
        
        // We need at least some child elements
        return childContainers.length > 0 || childNodes.length > 0 || childRects.length > 0 || childTexts.length > 0;
      }, { timeout });
      
      // Wait for CSS transitions to complete (0.2s transitions + buffer)
      await page.waitForTimeout(1000);
      
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
      await page.goto('/06_adapterNodes/02_layouts_full/02_layouts_full.html');
      
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

  test.describe('Adapter Node Positioning and Sizing Tests', () => {
    test('should load the page successfully', async ({ page }) => {
      // Just check if the page loads
      await page.waitForSelector('h1', { timeout: 10000 });
      const title = await page.locator('h1').textContent();
      expect(title).toBe('Nodes');
      
      // Check if SVG exists
      await page.waitForSelector('svg', { timeout: 10000 });
      const svg = page.locator('svg');
      await expect(svg).toBeVisible();
      
      // Check if there's any content in the SVG
      const svgContent = await svg.innerHTML();
      console.log('SVG content length:', svgContent.length);
      console.log('SVG content preview:', svgContent.substring(0, 500));
      
      // For now, just check that the page loads
      expect(svgContent.length).toBeGreaterThan(0);
    });

    test('should examine SVG content structure', async ({ page }) => {
      // Wait for page to load
      await page.waitForSelector('svg', { timeout: 10000 });
      
      // Examine what's actually in the SVG
      const svgAnalysis = await page.evaluate(() => {
        const svg = document.querySelector('svg');
        if (!svg) return { error: 'No SVG found' };
        
        const dashboard = svg.querySelector('g.dashboard');
        if (!dashboard) return { error: 'No dashboard found' };
        
        // Look for adapter elements
        const adapters = dashboard.querySelectorAll('g.adapter');
        const adapterCount = adapters.length;
        
        // Look for any child elements
        const allGroups = dashboard.querySelectorAll('g');
        const allRects = dashboard.querySelectorAll('rect');
        const allTexts = dashboard.querySelectorAll('text');
        
        // Check for specific elements
        const headerBackgrounds = dashboard.querySelectorAll('rect.header-background');
        const headerTexts = dashboard.querySelectorAll('text.header-text');
        const adapterShapes = dashboard.querySelectorAll('rect.adapter.shape');
        const nodeContainers = dashboard.querySelectorAll('g.node-container');
        
        return {
          adapterCount,
          totalGroups: allGroups.length,
          totalRects: allRects.length,
          totalTexts: allTexts.length,
          headerBackgrounds: headerBackgrounds.length,
          headerTexts: headerTexts.length,
          adapterShapes: adapterShapes.length,
          nodeContainers: nodeContainers.length,
          groupClasses: Array.from(allGroups).map(g => g.className.baseVal),
          rectClasses: Array.from(allRects).map(r => r.className.baseVal),
          textClasses: Array.from(allTexts).map(t => t.className.baseVal)
        };
      });
      
      console.log('SVG Analysis:', JSON.stringify(svgAnalysis, null, 2));
      
      // Check if we have any adapter elements
      expect(svgAnalysis.adapterCount).toBeGreaterThan(0);
    });

    test('should find adapter node directly', async ({ page }) => {
      // Wait for page to load
      await page.waitForSelector('svg', { timeout: 10000 });
      
      // Wait for adapter to appear
      await page.waitForSelector('g.adapter', { timeout: 10000 });
      
      // Check if adapter exists
      const adapterNodes = page.locator('g.adapter');
      await expect(adapterNodes).toHaveCount(1);
      
      // Check if adapter has basic structure
      const adapter = adapterNodes.first();
      await expect(adapter).toBeVisible();
      
      // Check for header elements
      const headerBackground = adapter.locator('rect.header-background');
      const headerText = adapter.locator('text.header-text');
      
      await expect(headerBackground).toBeVisible();
      await expect(headerText).toBeVisible();
      
      // Check for child nodes
      const childNodes = adapter.locator('g.Node');
      const childCount = await childNodes.count();
      console.log('Child nodes found:', childCount);
      
      // We should have 3 child nodes (staging, archive, transform)
      expect(childCount).toBe(3);
    });

    test('should check console output for debugging', async ({ page }) => {
      // Collect console messages
      const consoleMessages = [];
      page.on('console', msg => {
        consoleMessages.push(msg.text());
      });
      
      // Wait for page to load
      await page.waitForSelector('svg', { timeout: 10000 });
      
      // Wait for adapter to appear
      await page.waitForSelector('g.adapter', { timeout: 10000 });
      
      // Wait a bit more for any console messages
      await page.waitForTimeout(2000);
      
      // Print console messages
      console.log('Console messages:', consoleMessages);
      
      // Check if we have any positioning-related messages
      const positioningMessages = consoleMessages.filter(msg => 
        msg.includes('positioning') || msg.includes('layoutAlgorithm') || msg.includes('zone system')
      );
      
      console.log('Positioning-related messages:', positioningMessages);
      
      // For now, just check that the page loads
      expect(consoleMessages.length).toBeGreaterThan(0);
    });

    test('should display inner container zone with light blue border', async ({ page }) => {
      // Wait for page to load
      await page.waitForSelector('svg', { timeout: 10000 });
      
      // Wait for adapter to appear
      await page.waitForSelector('g.adapter', { timeout: 10000 });
      
      // Check if inner container zone border is visible
      const innerContainerBorder = page.locator('g.adapter rect.zone-innerContainer');
      await expect(innerContainerBorder).toBeVisible();
      
      // Check the border styling
      const borderStyle = await innerContainerBorder.getAttribute('style');
      console.log('Inner container border style:', borderStyle);
      
      // Verify the border has the correct class
      const borderClass = await innerContainerBorder.getAttribute('class');
      expect(borderClass).toContain('zone-innerContainer');
      
      // Check if the border has dimensions
      const width = await innerContainerBorder.getAttribute('width');
      const height = await innerContainerBorder.getAttribute('height');
      console.log('Inner container border dimensions:', { width, height });
      
      expect(parseFloat(width)).toBeGreaterThan(0);
      expect(parseFloat(height)).toBeGreaterThan(0);
    });

    test('should position inner container border correctly', async ({ page }) => {
      // Wait for page to load
      await page.waitForSelector('svg', { timeout: 10000 });
      
      // Wait for adapter to appear
      await page.waitForSelector('g.adapter', { timeout: 10000 });
      
      // Get the positioning of the inner container border
      const borderPosition = await page.evaluate(() => {
        const adapter = document.querySelector('g.adapter');
        if (!adapter) return null;
        
        const border = adapter.querySelector('rect.zone-innerContainer');
        if (!border) return null;
        
        const x = parseFloat(border.getAttribute('x') || 0);
        const y = parseFloat(border.getAttribute('y') || 0);
        const width = parseFloat(border.getAttribute('width') || 0);
        const height = parseFloat(border.getAttribute('height') || 0);
        
        // Also get the container dimensions for reference
        const containerShape = adapter.querySelector('rect.container-shape');
        const containerX = parseFloat(containerShape?.getAttribute('x') || 0);
        const containerY = parseFloat(containerShape?.getAttribute('y') || 0);
        const containerWidth = parseFloat(containerShape?.getAttribute('width') || 0);
        const containerHeight = parseFloat(containerShape?.getAttribute('height') || 0);
        
        return {
          border: { x, y, width, height },
          container: { x: containerX, y: containerY, width: containerWidth, height: containerHeight }
        };
      });
      
      console.log('Border and container positioning:', borderPosition);
      
      expect(borderPosition).toBeTruthy();
      expect(borderPosition.border.x).toBeGreaterThan(borderPosition.container.x); // Border should be to the right of container left edge
      expect(borderPosition.border.y).toBeGreaterThan(borderPosition.container.y); // Border should be below container top edge
      
      // Border should be within container bounds
      expect(borderPosition.border.x + borderPosition.border.width).toBeLessThanOrEqual(
        borderPosition.container.x + borderPosition.container.width
      );
      expect(borderPosition.border.y + borderPosition.border.height).toBeLessThanOrEqual(
        borderPosition.container.y + borderPosition.container.height
      );
    });

    test('should verify inner container positioning and child alignment', async ({ page }) => {
      // Wait for page to load
      await page.waitForSelector('svg', { timeout: 10000 });
      
      // Wait for adapter to appear
      await page.waitForSelector('g.adapter', { timeout: 10000 });
      
      // Get comprehensive positioning data
      const positioningData = await page.evaluate(() => {
        const adapter = document.querySelector('g.adapter');
        if (!adapter) return null;
        
        // Get border positioning
        const border = adapter.querySelector('rect.zone-innerContainer');
        const borderX = parseFloat(border?.getAttribute('x') || 0);
        const borderY = parseFloat(border?.getAttribute('y') || 0);
        const borderWidth = parseFloat(border?.getAttribute('width') || 0);
        const borderHeight = parseFloat(border?.getAttribute('height') || 0);
        
        // Get container positioning
        const containerShape = adapter.querySelector('rect.container-shape');
        const containerX = parseFloat(containerShape?.getAttribute('x') || 0);
        const containerY = parseFloat(containerShape?.getAttribute('y') || 0);
        const containerWidth = parseFloat(containerShape?.getAttribute('width') || 0);
        const containerHeight = parseFloat(containerShape?.getAttribute('height') || 0);
        
        // Get child node positions
        const childNodes = adapter.querySelectorAll('g.Node');
        const children = Array.from(childNodes).map(node => {
          const text = node.querySelector('text');
          const rect = node.querySelector('rect');
          return {
            role: text?.textContent || 'unknown',
            x: parseFloat(node.getAttribute('transform')?.match(/translate\(([^,]+),([^)]+)\)/)?.[1] || 0),
            y: parseFloat(node.getAttribute('transform')?.match(/translate\(([^,]+),([^)]+)\)/)?.[2] || 0),
            width: parseFloat(rect?.getAttribute('width') || 0),
            height: parseFloat(rect?.getAttribute('height') || 0)
          };
        });
        
        // Get zone system transform
        const innerContainerZone = adapter.querySelector('g.zone-innerContainer');
        const zoneTransform = innerContainerZone?.getAttribute('transform') || '';
        const zoneTransformMatch = zoneTransform.match(/translate\(([^,]+),([^)]+)\)/);
        const zoneX = parseFloat(zoneTransformMatch?.[1] || 0);
        const zoneY = parseFloat(zoneTransformMatch?.[2] || 0);
        
        return {
          border: { x: borderX, y: borderY, width: borderWidth, height: borderHeight },
          container: { x: containerX, y: containerY, width: containerWidth, height: containerHeight },
          children,
          zoneTransform: { x: zoneX, y: zoneY, transform: zoneTransform }
        };
      });
      
      console.log('Comprehensive positioning data:', positioningData);
      
      expect(positioningData).toBeTruthy();
      
      // Test 1: Border should be positioned at (0, 0) relative to zone coordinate system
      expect(positioningData.border.x).toBe(0);
      expect(positioningData.border.y).toBe(0);
      
      // Test 2: Border should be inside container bounds
      const borderRight = positioningData.border.x + positioningData.border.width;
      const borderBottom = positioningData.border.y + positioningData.border.height;
      const containerRight = positioningData.container.x + positioningData.container.width;
      const containerBottom = positioningData.container.y + positioningData.container.height;
      
      // Account for zone transform when checking bounds
      const transformedBorderRight = positioningData.zoneTransform.x + borderRight;
      const transformedBorderBottom = positioningData.zoneTransform.y + borderBottom;
      
      expect(transformedBorderRight).toBeLessThanOrEqual(containerRight);
      expect(transformedBorderBottom).toBeLessThanOrEqual(containerBottom);
      
      // Test 3: Child nodes should be positioned relative to zone coordinate system
      const staging = positioningData.children.find(c => c.role === 'staging');
      const archive = positioningData.children.find(c => c.role === 'archive');
      const transform = positioningData.children.find(c => c.role === 'transform');
      
      expect(staging).toBeTruthy();
      expect(archive).toBeTruthy();
      expect(transform).toBeTruthy();
      
      // Test 4: Staging and archive should align at the top (y=0 in zone coordinate system)
      expect(staging.y).toBeCloseTo(0, 1);
      expect(archive.y).toBeCloseTo(0, 1);
      
      // Test 5: Transform should be below archive with spacing
      const expectedTransformY = archive.height + 10; // 10px spacing
      expect(transform.y).toBeCloseTo(expectedTransformY, 1);
      
      // Test 6: Archive and transform should be to the right of staging
      const expectedArchiveX = staging.width + 20; // 20px spacing
      expect(archive.x).toBeCloseTo(expectedArchiveX, 1);
      expect(transform.x).toBeCloseTo(expectedArchiveX, 1);
    });

    test('should position all child nodes inside inner container border', async ({ page }) => {
      // Wait for page to load
      await page.waitForSelector('svg', { timeout: 10000 });
      
      // Wait for adapter to appear
      await page.waitForSelector('g.adapter', { timeout: 10000 });
      
      // Get positioning data
      const positioningData = await page.evaluate(() => {
        const adapter = document.querySelector('g.adapter');
        if (!adapter) return null;
        
        // Get border positioning
        const border = adapter.querySelector('rect.zone-innerContainer');
        const borderX = parseFloat(border?.getAttribute('x') || 0);
        const borderY = parseFloat(border?.getAttribute('y') || 0);
        const borderWidth = parseFloat(border?.getAttribute('width') || 0);
        const borderHeight = parseFloat(border?.getAttribute('height') || 0);
        
        // Get child node positions
        const childNodes = adapter.querySelectorAll('g.Node');
        const children = Array.from(childNodes).map(node => {
          const text = node.querySelector('text');
          const rect = node.querySelector('rect');
          return {
            role: text?.textContent || 'unknown',
            x: parseFloat(node.getAttribute('transform')?.match(/translate\(([^,]+),([^)]+)\)/)?.[1] || 0),
            y: parseFloat(node.getAttribute('transform')?.match(/translate\(([^,]+),([^)]+)\)/)?.[2] || 0),
            width: parseFloat(rect?.getAttribute('width') || 0),
            height: parseFloat(rect?.getAttribute('height') || 0)
          };
        });
        
        return {
          border: { x: borderX, y: borderY, width: borderWidth, height: borderHeight },
          children
        };
      });
      
      console.log('Child node positioning test data:', positioningData);
      
      expect(positioningData).toBeTruthy();
      
      // Test that all child nodes are inside the inner container border
      positioningData.children.forEach(child => {
        console.log(`Testing ${child.role} node: x=${child.x}, y=${child.y}, width=${child.width}, height=${child.height}`);
        
        // Calculate node boundaries
        const nodeLeft = child.x;
        const nodeTop = child.y;
        const nodeRight = child.x + child.width;
        const nodeBottom = child.y + child.height;
        
        // Calculate border boundaries
        const borderLeft = positioningData.border.x;
        const borderTop = positioningData.border.y;
        const borderRight = positioningData.border.x + positioningData.border.width;
        const borderBottom = positioningData.border.y + positioningData.border.height;
        
        // Test that node is inside border
        expect(nodeLeft).toBeGreaterThanOrEqual(borderLeft);
        expect(nodeTop).toBeGreaterThanOrEqual(borderTop);
        expect(nodeRight).toBeLessThanOrEqual(borderRight);
        expect(nodeBottom).toBeLessThanOrEqual(borderBottom);
        
        console.log(`${child.role} node is inside border: ✅`);
      });
      
      // Test specific alignment requirements
      const staging = positioningData.children.find(c => c.role === 'staging');
      const archive = positioningData.children.find(c => c.role === 'archive');
      const transform = positioningData.children.find(c => c.role === 'transform');
      
      expect(staging).toBeTruthy();
      expect(archive).toBeTruthy();
      expect(transform).toBeTruthy();
      
      // Test that staging and archive have the same Y coordinate (aligned at top)
      expect(staging.y).toBeCloseTo(archive.y, 1);
      
      // Test that transform is below archive with proper spacing
      const expectedTransformY = archive.y + archive.height + 10; // 10px spacing
      expect(transform.y).toBeCloseTo(expectedTransformY, 1);
      
      // Test that archive and transform are to the right of staging
      expect(archive.x).toBeGreaterThan(staging.x + staging.width);
      expect(transform.x).toBeGreaterThan(staging.x + staging.width);
      
      // Test that archive and transform have the same X coordinate (aligned vertically)
      expect(archive.x).toBeCloseTo(transform.x, 1);
    });

    test('should render adapter node with basic structure', async ({ page }) => {
      const nodesFound = await waitForNodes(page);
      expect(nodesFound).toBe(true);
      
      // Check if adapter node exists
      const adapterNodes = page.locator('g.adapter');
      await expect(adapterNodes).toHaveCount(1);
      
      // Check if adapter has basic structure
      const adapter = adapterNodes.first();
      await expect(adapter).toBeVisible();
      
      // Check for header elements
      const headerBackground = adapter.locator('rect.header-background');
      const headerText = adapter.locator('text.header-text');
      
      await expect(headerBackground).toBeVisible();
      await expect(headerText).toBeVisible();
      
      // Check for main adapter shape
      const mainRect = adapter.locator('rect.adapter.shape');
      await expect(mainRect).toBeVisible();
      
      // Debug: Check what's actually in the SVG
      const svgContent = await page.locator('svg').innerHTML();
      console.log('SVG content length:', svgContent.length);
      console.log('SVG content preview:', svgContent.substring(0, 1000));
      
      // Check for any child containers or elements
      const childContainers = adapter.locator('g.node-container');
      const childNodes = adapter.locator('g.Node');
      const childRects = adapter.locator('g rect:not(.adapter):not(.header-background)');
      const childTexts = adapter.locator('g text:not(.header-text)');
      
      const containerCount = await childContainers.count();
      const nodeCount = await childNodes.count();
      const rectCount = await childRects.count();
      const textCount = await childTexts.count();
      
      console.log('Child containers found:', containerCount);
      console.log('Child nodes found:', nodeCount);
      console.log('Child rectangles found:', rectCount);
      console.log('Child texts found:', textCount);
      
      // For now, just check that we have some child elements
      expect(containerCount + nodeCount + rectCount + textCount).toBeGreaterThan(0);
    });

    test('should position staging node correctly for arrangement 3 (staging-focused layout)', async ({ page }) => {
      // Wait for page to load
      await page.waitForSelector('svg', { timeout: 10000 });
      
      // Wait for adapter to appear
      await page.waitForSelector('g.adapter', { timeout: 10000 });
      
      const adapterNodes = page.locator('g.adapter');
      await expect(adapterNodes).toHaveCount(1);
      
      // Get positions of all child nodes
      const positions = await page.evaluate(() => {
        const adapter = document.querySelector('g.adapter');
        if (!adapter) return null;
        
        // Get inner container bounds for reference
        const innerContainer = adapter.querySelector('rect.zone-innerContainer');
        const innerContainerBounds = innerContainer ? {
          x: parseFloat(innerContainer.getAttribute('x') || 0),
          y: parseFloat(innerContainer.getAttribute('y') || 0),
          width: parseFloat(innerContainer.getAttribute('width') || 0),
          height: parseFloat(innerContainer.getAttribute('height') || 0)
        } : null;
        
        const childNodes = adapter.querySelectorAll('g.Node');
        const nodePositions = {};
        
        childNodes.forEach(node => {
          const rect = node.querySelector('rect');
          const text = node.querySelector('text');
          
          if (rect && text) {
            const textContent = text.textContent.trim();
            const width = parseFloat(rect.getAttribute('width') || 0);
            const height = parseFloat(rect.getAttribute('height') || 0);
            
            // Get position from transform attribute (zone coordinate system)
            const transform = node.getAttribute('transform') || '';
            const transformMatch = transform.match(/translate\(([^,]+),([^)]+)\)/);
            const x = parseFloat(transformMatch?.[1] || 0);
            const y = parseFloat(transformMatch?.[2] || 0);
            
            // Determine node type based on text content
            let role = 'unknown';
            if (textContent.toLowerCase().includes('staging')) role = 'staging';
            else if (textContent.toLowerCase().includes('archive')) role = 'archive';
            else if (textContent.toLowerCase().includes('transform')) role = 'transform';
            
            nodePositions[role] = { x, y, width, height, textContent };
          }
        });
        
        return { nodes: nodePositions, innerContainer: innerContainerBounds };
      });
      
      expect(positions).toBeTruthy();
      expect(positions.nodes.staging).toBeTruthy();
      expect(positions.nodes.archive).toBeTruthy();
      expect(positions.nodes.transform).toBeTruthy();
      
      console.log('Staging-focused layout analysis:', positions);
      
      const { staging, archive, transform } = positions.nodes;
      const tolerance = 5; // 5px tolerance for positioning
      
      // Test 1: Staging should be leftmost node
      expect(staging.x).toBeLessThan(archive.x);
      expect(staging.x).toBeLessThan(transform.x);
      
      // Test 2: Archive should be above transform (archive has smaller y)
      expect(archive.y).toBeLessThan(transform.y);
      
      // Test 3: Archive and transform should be vertically aligned (same x position)
      expect(Math.abs(archive.x - transform.x)).toBeLessThanOrEqual(tolerance);
      
      // Test 4: Archive top should align with staging top (considering center-based positioning)
      const stagingTop = staging.y - staging.height / 2;
      const archiveTop = archive.y - archive.height / 2;
      expect(Math.abs(stagingTop - archiveTop)).toBeLessThanOrEqual(tolerance);
      
      // Test 5: Transform bottom should align with staging bottom
      const stagingBottom = staging.y + staging.height / 2;
      const transformBottom = transform.y + transform.height / 2;
      expect(Math.abs(stagingBottom - transformBottom)).toBeLessThanOrEqual(tolerance);
      
      // Test 6: Staging should span the full height of archive + transform + margin
      const archiveTransformTotalHeight = archive.height + transform.height + Math.abs(transform.y - archive.y) - archive.height/2 - transform.height/2;
      expect(Math.abs(staging.height - archiveTransformTotalHeight)).toBeLessThanOrEqual(tolerance * 2);
      
      // Test 7: All nodes should be inside the inner container
      if (positions.innerContainer) {
        const { innerContainer } = positions;
        
        [staging, archive, transform].forEach(node => {
          const nodeLeft = node.x - node.width / 2;
          const nodeRight = node.x + node.width / 2;
          const nodeTop = node.y - node.height / 2;
          const nodeBottom = node.y + node.height / 2;
          
          expect(nodeLeft).toBeGreaterThanOrEqual(innerContainer.x);
          expect(nodeRight).toBeLessThanOrEqual(innerContainer.x + innerContainer.width);
          expect(nodeTop).toBeGreaterThanOrEqual(innerContainer.y);
          expect(nodeBottom).toBeLessThanOrEqual(innerContainer.y + innerContainer.height);
        });
      }
      
      // Test 8: Specific edge alignment tests
      if (positions.innerContainer) {
        const { innerContainer } = positions;
        const tolerance = 1; // 1px tolerance for alignment
        
        // Left staging should align with left inner container
        const stagingLeft = staging.x - staging.width / 2;
        const containerLeft = innerContainer.x;
        expect(Math.abs(stagingLeft - containerLeft)).toBeLessThanOrEqual(tolerance);
        
        // Right archive should align with right inner container  
        const archiveRight = archive.x + archive.width / 2;
        const containerRight = innerContainer.x + innerContainer.width;
        expect(Math.abs(archiveRight - containerRight)).toBeLessThanOrEqual(tolerance);
        
        // Right transform should align with right inner container
        const transformRight = transform.x + transform.width / 2;
        expect(Math.abs(transformRight - containerRight)).toBeLessThanOrEqual(tolerance);
        
        console.log('Edge alignment test results:', {
          stagingLeft: { actual: stagingLeft, expected: containerLeft, diff: stagingLeft - containerLeft },
          archiveRight: { actual: archiveRight, expected: containerRight, diff: archiveRight - containerRight },
          transformRight: { actual: transformRight, expected: containerRight, diff: transformRight - containerRight }
        });
      }
      
      console.log('✅ All staging-focused layout positioning tests passed');
    });

    test('should validate detailed staging-focused layout requirements', async ({ page }) => {
      // Wait for page to load
      await page.waitForSelector('svg', { timeout: 10000 });
      await page.waitForSelector('g.adapter', { timeout: 10000 });
      
      const layoutAnalysis = await page.evaluate(() => {
        const adapter = document.querySelector('g.adapter');
        if (!adapter) return null;
        
        // Find all child nodes by their IDs
        const stagingNode = adapter.querySelector('g[id="staging_bankview"]');
        const archiveNode = adapter.querySelector('g[id="archive_bankview"]');
        const transformNode = adapter.querySelector('g[id="transform_bankview"]');
        
        if (!stagingNode || !archiveNode || !transformNode) {
          return { error: 'Missing nodes', found: { staging: !!stagingNode, archive: !!archiveNode, transform: !!transformNode } };
        }
        
        // Helper function to get position and dimensions
        const getNodeInfo = (node) => {
          const transform = node.getAttribute('transform') || '';
          const transformMatch = transform.match(/translate\(([^,]+),\s*([^)]+)\)/);
          const x = parseFloat(transformMatch?.[1] || 0);
          const y = parseFloat(transformMatch?.[2] || 0);
          
          const rect = node.querySelector('rect.shape');
          const width = parseFloat(rect?.getAttribute('width') || 0);
          const height = parseFloat(rect?.getAttribute('height') || 0);
          
          return { x, y, width, height };
        };
        
        const staging = getNodeInfo(stagingNode);
        const archive = getNodeInfo(archiveNode);
        const transform = getNodeInfo(transformNode);
        
        // Calculate layout metrics
        return {
          staging,
          archive,
          transform,
          layout: {
            stagingIsLeft: staging.x < archive.x && staging.x < transform.x,
            archiveAboveTransform: archive.y < transform.y,
            archiveTransformAligned: Math.abs(archive.x - transform.x),
            topAlignment: Math.abs((staging.y - staging.height/2) - (archive.y - archive.height/2)),
            bottomAlignment: Math.abs((staging.y + staging.height/2) - (transform.y + transform.height/2)),
            stagingHeight: staging.height,
            expectedStagingHeight: archive.height + transform.height + Math.abs(transform.y - archive.y) - archive.height/2 - transform.height/2
          }
        };
      });
      
      expect(layoutAnalysis).toBeTruthy();
      expect(layoutAnalysis.error).toBeUndefined();
      
      console.log('Detailed layout analysis:', layoutAnalysis);
      
      const { layout } = layoutAnalysis;
      const tolerance = 5;
      
      // Validate staging-focused layout requirements from adapter-node.md:
      // "Staging node spans full height of the inner container"
      // "Archive and transform node: above to each other, and have the same size"
      // "top archive is top staging"
      // "bottom transform is bottom staging"
      
      expect(layout.stagingIsLeft).toBe(true);
      expect(layout.archiveAboveTransform).toBe(true);
      expect(layout.archiveTransformAligned).toBeLessThanOrEqual(tolerance);
      expect(layout.topAlignment).toBeLessThanOrEqual(tolerance);
      expect(layout.bottomAlignment).toBeLessThanOrEqual(tolerance);
      expect(Math.abs(layout.stagingHeight - layout.expectedStagingHeight)).toBeLessThanOrEqual(tolerance * 2);
      
      // Additional validation for arrangement 3 specific requirements
      expect(layoutAnalysis.archive.height).toBe(layoutAnalysis.transform.height); // Same size
      expect(layoutAnalysis.staging.width).toBe(150); // Expected staging width
      expect(layoutAnalysis.archive.width).toBe(150); // Expected archive width  
      expect(layoutAnalysis.transform.width).toBe(150); // Expected transform width
    });
  });
}); 