import { test, expect } from '@playwright/test';

test.describe('Adapter Debug Tests', () => {
  test('debug adapter initialization', async ({ page }) => {
    // Navigate to debug page
    await page.goto('/test-adapter-debug.html');
    
    // Wait for the page to load completely
    await page.waitForTimeout(5000);
    
    // Check console output
    const consoleOutput = await page.textContent('#console-output');
    console.log('Console output:', consoleOutput);
    
    // Check if SVG has any content
    const svgContent = await page.innerHTML('svg');
    console.log('SVG content length:', svgContent.length);
    console.log('SVG preview:', svgContent.substring(0, 500));
    
    // Verify we have some output
    expect(consoleOutput.length).toBeGreaterThan(0);
  });
});
