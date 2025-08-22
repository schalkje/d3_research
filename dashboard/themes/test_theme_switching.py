#!/usr/bin/env python3
"""
Test script to verify theme switching in the FlowDash dashboard
"""

import asyncio
from playwright.async_api import async_playwright

async def test_theme_switching():
    """Test if theme switching is working"""
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=False)  # Use visible browser for debugging
        page = await browser.new_page()
        
        print("🌐 Navigating to dashboard...")
        await page.goto("http://localhost:8000/dashboard/flowdash-js.html")
        
        # Wait for dashboard to load
        await page.wait_for_selector("#graph", timeout=30000)
        await page.wait_for_timeout(3000)
        
        print("✅ Dashboard loaded")
        
        # Check what theme functions are available
        print("\n🔍 Checking available theme functions...")
        theme_functions = await page.evaluate("""
            const functions = [];
            if (typeof setTheme === 'function') functions.push('setTheme');
            if (typeof applyTheme === 'function') functions.push('applyTheme');
            if (typeof window.setTheme === 'function') functions.push('window.setTheme');
            if (typeof window.applyTheme === 'function') functions.push('window.applyTheme');
            functions;
        """)
        print(f"Available theme functions: {theme_functions}")
        
        # Check current theme
        print("\n🎨 Checking current theme...")
        current_theme = await page.evaluate("""
            document.documentElement.getAttribute('data-theme') || 
            document.body.getAttribute('data-theme') || 
            'none'
        """)
        print(f"Current theme: {current_theme}")
        
        # Check if theme manager script is loaded
        print("\n📜 Checking theme manager...")
        theme_manager_loaded = await page.evaluate("""
            !!document.querySelector('script[src*="themeManager.js"]')
        """)
        print(f"Theme manager script loaded: {theme_manager_loaded}")
        
        # Try to switch to dark theme
        print("\n🌙 Trying to switch to dark theme...")
        try:
            # Method 1: Try setTheme function
            if 'setTheme' in theme_functions:
                await page.evaluate("setTheme('dark', { persist: false, broadcast: true })")
                print("   Used setTheme function")
            else:
                # Method 2: Set data-theme attribute
                await page.evaluate("document.documentElement.setAttribute('data-theme', 'dark')")
                print("   Used data-theme attribute")
            
            # Wait a bit
            await page.wait_for_timeout(2000)
            
            # Check new theme
            new_theme = await page.evaluate("""
                document.documentElement.getAttribute('data-theme') || 
                document.body.getAttribute('data-theme') || 
                'none'
            """)
            print(f"   New theme: {new_theme}")
            
            # Check if CSS files are loaded
            css_links = await page.evaluate("""
                Array.from(document.querySelectorAll('link[data-flowdash-theme]'))
                    .map(link => ({ theme: link.getAttribute('data-flowdash-theme'), disabled: link.disabled }))
            """)
            print(f"   CSS links: {css_links}")
            
        except Exception as e:
            print(f"   Error switching theme: {e}")
        
        # Take a screenshot to see the result
        await page.screenshot(path="theme_test_result.png")
        print("\n📸 Screenshot saved as 'theme_test_result.png'")
        
        await browser.close()

if __name__ == "__main__":
    asyncio.run(test_theme_switching())
