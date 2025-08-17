#!/usr/bin/env python3
"""
Theme Screenshot Capture Script for FlowDash using Playwright

This script captures screenshots of the FlowDash dashboard with different themes applied.
It uses Playwright to automate the process and save preview images for each theme.
"""

import asyncio
import os
from playwright.async_api import async_playwright

class ThemeScreenshotCapture:
    def __init__(self, dashboard_url="http://localhost:8000/dashboard/flowdash-js.html"):
        self.dashboard_url = dashboard_url
        self.themes = [
            "light", "dark", "brutalism", "cyberpunk", 
            "flat", "glassmorphism", "neumorphism", "retro", "alt"
        ]
        self.output_dir = "."  # Current directory since we're running from themes folder
    
    async def capture_theme_screenshots(self):
        """Capture screenshots for all themes using Playwright"""
        async with async_playwright() as p:
            # Launch browser
            browser = await p.chromium.launch(headless=True)
            page = await browser.new_page()
            
            # Set viewport size
            await page.set_viewport_size({"width": 1200, "height": 800})
            
            print("🚀 Starting theme screenshot capture...")
            print(f"🌐 Navigating to: {self.dashboard_url}")
            
            # Navigate to dashboard
            await page.goto(self.dashboard_url)
            
            # Wait for dashboard to load
            try:
                await page.wait_for_selector("#graph", timeout=30000)
                await page.wait_for_timeout(3000)  # Additional wait for content to render
                print("✅ Dashboard loaded successfully")
            except Exception as e:
                print(f"❌ Dashboard failed to load: {e}")
                await browser.close()
                return False
            
            # Capture screenshots for each theme
            successful_captures = 0
            for theme in self.themes:
                print(f"\n📸 Capturing {theme} theme...")
                
                try:
                    # Apply theme
                    await self.apply_theme(page, theme)
                    
                    # Wait for theme to apply
                    await page.wait_for_timeout(2000)
                    
                    # Capture screenshot
                    screenshot_path = os.path.join(self.output_dir, theme, f"{theme}-preview.png")
                    await page.screenshot(path=screenshot_path, full_page=False)
                    print(f"✅ Screenshot saved: {screenshot_path}")
                    successful_captures += 1
                    
                except Exception as e:
                    print(f"❌ Failed to capture {theme}: {e}")
            
            await browser.close()
            
            print(f"\n🎉 Capture complete! {successful_captures}/{len(self.themes)} themes captured successfully")
            return successful_captures == len(self.themes)
    
    async def apply_theme(self, page, theme_name):
        """Apply a specific theme to the dashboard"""
        try:
            # Try different methods to apply the theme
            theme_script = f"""
            // Method 1: Check if applyTheme function exists
            if (typeof applyTheme === 'function') {{
                applyTheme('{theme_name}');
                return 'function';
            }}
            
            // Method 2: Set data-theme attribute
            if (document.body && document.body.setAttribute) {{
                document.body.setAttribute('data-theme', '{theme_name}');
                return 'attribute';
            }}
            
            // Method 3: Look for theme selector dropdown
            const themeSelect = document.querySelector('select[data-theme], select[name="theme"], .theme-selector select');
            if (themeSelect) {{
                themeSelect.value = '{theme_name}';
                themeSelect.dispatchEvent(new Event('change'));
                return 'dropdown';
            }}
            
            return 'none';
            """
            
            result = await page.evaluate(theme_script)
            print(f"   Applied theme using method: {result}")
            
        except Exception as e:
            print(f"   Warning: Theme application method failed: {e}")

async def main():
    """Main function to run the theme capture process"""
    print("🎨 FlowDash Theme Screenshot Capture Tool (Playwright)")
    print("=" * 55)
    
    # Check if output directories exist
    base_dir = "."  # Current directory since we're running from themes folder
    if not os.path.exists(base_dir):
        print(f"❌ Base directory not found: {base_dir}")
        return
    
    # Create theme directories if they don't exist
    themes = ["light", "dark", "brutalism", "cyberpunk", "flat", "glassmorphism", "neumorphism", "retro", "alt"]
    for theme in themes:
        theme_dir = os.path.join(base_dir, theme)
        if not os.path.exists(theme_dir):
            os.makedirs(theme_dir)
            print(f"📁 Created directory: {theme_dir}")
    
    # Initialize and run capture
    capturer = ThemeScreenshotCapture()
    
    try:
        success = await capturer.capture_theme_screenshots()
        if success:
            print("\n🎊 All theme screenshots captured successfully!")
        else:
            print("\n⚠️  Some themes failed to capture. Check the output above for details.")
    except KeyboardInterrupt:
        print("\n⏹️  Capture interrupted by user")
    except Exception as e:
        print(f"\n💥 Unexpected error: {e}")

if __name__ == "__main__":
    asyncio.run(main())
