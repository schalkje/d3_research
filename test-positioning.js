import { chromium } from 'playwright';

async function testPositioning() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  try {
    // Navigate to the test page (using relative path like Playwright tests)
    await page.goto('/5_nodes/10_adapter/01_single.html');
    
    // Wait for basic elements
    await page.waitForSelector('svg', { timeout: 10000 });
    await page.waitForSelector('g.adapter', { timeout: 10000 });
    await page.waitForSelector('g.adapter rect.header-background', { timeout: 10000 });
    await page.waitForSelector('g.adapter text.header-text', { timeout: 10000 });
    
    // Wait for CSS transitions
    await page.waitForTimeout(500);
    
    // Wait for positioning to be stable
    await page.waitForFunction(() => {
      const adapter = document.querySelector('g.adapter');
      if (!adapter) return false;
      
      const headerBackground = adapter.querySelector('rect.header-background');
      const mainRect = adapter.querySelector('rect.adapter.shape');
      const headerText = adapter.querySelector('text.header-text');
      
      if (!headerBackground || !mainRect || !headerText) return false;
      
      const headerBox = headerBackground.getBoundingClientRect();
      const mainBox = mainRect.getBoundingClientRect();
      const textBox = headerText.getBoundingClientRect();
      
      const headerTop = headerBox.y;
      const containerTop = mainBox.y;
      const positionDifference = Math.abs(headerTop - containerTop);
      
      const headerWidth = headerBox.width;
      const containerWidth = mainBox.width;
      const widthDifference = Math.abs(headerWidth - containerWidth);
      
      const textLeft = textBox.x;
      const headerLeft = headerBox.x;
      const textHasPadding = textLeft > headerLeft;
      
      console.log('Position difference:', positionDifference);
      console.log('Width difference:', widthDifference);
      console.log('Text has padding:', textHasPadding);
      
      return positionDifference < 1 && 
             widthDifference < 1 && 
             textHasPadding &&
             headerBox.width > 0 && 
             headerBox.height > 0;
    }, { timeout: 20000 });
    
    // Final wait
    await page.waitForTimeout(2000);
    
    // Get final positions
    const positions = await page.evaluate(() => {
      const adapter = document.querySelector('g.adapter');
      const headerBackground = adapter.querySelector('rect.header-background');
      const mainRect = adapter.querySelector('rect.adapter.shape');
      
      const headerBox = headerBackground.getBoundingClientRect();
      const mainBox = mainRect.getBoundingClientRect();
      
      return {
        headerTop: headerBox.y,
        containerTop: mainBox.y,
        headerWidth: headerBox.width,
        containerWidth: mainBox.width,
        positionDifference: Math.abs(headerBox.y - mainBox.y),
        widthDifference: Math.abs(headerBox.width - mainBox.width)
      };
    });
    
    console.log('Final positions:', positions);
    
    // Check if positioning is correct
    if (positions.positionDifference < 1 && positions.widthDifference < 1) {
      console.log('✅ Positioning is correct!');
    } else {
      console.log('❌ Positioning is still incorrect');
      console.log('Position difference:', positions.positionDifference);
      console.log('Width difference:', positions.widthDifference);
    }
    
    // Keep browser open for inspection
    await new Promise(resolve => setTimeout(resolve, 10000));
    
  } catch (error) {
    console.error('Test failed:', error);
  } finally {
    await browser.close();
  }
}

testPositioning(); 