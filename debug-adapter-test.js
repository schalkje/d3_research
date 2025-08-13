const { test, expect } = require('@playwright/test');

test('debug adapter page loading', async ({ page }) => {
  // Navigate to the adapter page
  console.log('Navigating to page...');
  await page.goto('/06_adapterNodes/01_single/01_single.html');
  
  // Wait for basic page load
  console.log('Waiting for page to load...');
  await page.waitForLoadState('domcontentloaded');
  
  // Check if the page has basic HTML structure
  const title = await page.title();
  console.log('Page title:', title);
  
  // Check if SVG exists
  console.log('Checking for SVG...');
  const svg = page.locator('svg');
  const svgExists = await svg.count();
  console.log('SVG count:', svgExists);
  
  if (svgExists > 0) {
    console.log('SVG found, checking content...');
    const svgContent = await svg.innerHTML();
    console.log('SVG content (first 1000 chars):', svgContent.substring(0, 1000));
    
    // Check for adapter elements
    const adapters = page.locator('g.adapter');
    const adapterCount = await adapters.count();
    console.log('Adapter count:', adapterCount);
    
    if (adapterCount === 0) {
      // Check what's actually in the SVG
      const allGroups = page.locator('svg g');
      const groupCount = await allGroups.count();
      console.log('Total groups in SVG:', groupCount);
      
      // Get all group classes
      const groupClasses = await page.evaluate(() => {
        const groups = document.querySelectorAll('svg g');
        return Array.from(groups).map(g => g.className.baseVal || 'no-class').slice(0, 10);
      });
      console.log('Group classes found:', groupClasses);
    }
  }
  
  // Check console errors
  const consoleMessages = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleMessages.push(msg.text());
    }
  });
  
  // Wait a bit for any dynamic content
  await page.waitForTimeout(5000);
  
  console.log('Console errors:', consoleMessages);
  
  // Take a screenshot for debugging
  await page.screenshot({ path: 'debug-adapter-page.png', fullPage: true });
  
  expect(svgExists).toBeGreaterThan(0);
});
