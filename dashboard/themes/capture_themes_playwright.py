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
                    # Apply theme using the theme manager
                    await self.apply_theme(page, theme)
                    
                    # Wait for theme to apply and CSS to load
                    await page.wait_for_timeout(3000)
                    
                    # Capture screenshot of just the dashboard area
                    screenshot_path = os.path.join(self.output_dir, theme, f"{theme}-preview.png")
                    
                    # Try to capture just the graph container area with margin
                    try:
                        # Wait for the demo container to be visible
                        await page.wait_for_selector(".demo-container", timeout=5000)
                        
                        # Hide the theme selector UI to keep it out of captures
                        await page.evaluate("""
                            const themeUI = document.querySelector('[data-flowdash-theme-ui="root"]');
                            if (themeUI) themeUI.style.display = 'none';
                        """)
                        
                        # Zoom out by 1 click to get a slightly smaller view
                        await page.evaluate("""
                            // Try to zoom out using the dashboard's zoom controls
                            const zoomOutBtn = document.getElementById('zoom-out');
                            if (zoomOutBtn) {
                                // Click zoom out once
                                zoomOutBtn.click();
                            }
                        """)
                        
                        # Wait for zoom to settle and content to reposition
                        await page.wait_for_timeout(2000)
                        
                        # Compute bounding rect from demo container after zoom
                        demo_rect = await page.evaluate("""
                            (selector) => {
                                const el = document.querySelector(selector);
                                if (!el) return null;
                                const r = el.getBoundingClientRect();
                                return { x: r.left + window.scrollX, y: r.top + window.scrollY, width: r.width, height: r.height };
                            }
                        """, ".demo-container")
                        if demo_rect and demo_rect.get('width') and demo_rect.get('height'):
                            margin = 12
                            clip_x = max(0, demo_rect['x'] - margin)
                            clip_y = max(0, demo_rect['y'] - margin)
                            clip_width = demo_rect['width'] + (margin * 2)
                            clip_height = demo_rect['height'] + (margin * 2)

                            # Ensure viewport is large enough
                            required_height = int(clip_y + clip_height)
                            required_width = int(clip_x + clip_width)
                            current_viewport = { 'width': 1200, 'height': 800 }
                            new_viewport = {
                                'width': max(current_viewport['width'], required_width),
                                'height': max(current_viewport['height'], required_height)
                            }
                            await page.set_viewport_size(new_viewport)
                            await page.evaluate("window.scrollTo(0, 0)")

                            clip_area = {
                                'x': clip_x,
                                'y': clip_y,
                                'width': clip_width,
                                'height': clip_height
                            }
                            await page.screenshot(path=screenshot_path, clip=clip_area)
                            print(f"✅ Screenshot saved (demo-container + 12px margins): {screenshot_path}")
                        else:
                            # Fallback to full page screenshot
                            await page.screenshot(path=screenshot_path, full_page=False)
                            print(f"✅ Screenshot saved (full page): {screenshot_path}")
                    except Exception as e:
                        print(f"   Warning: Could not capture graph container, using full page: {e}")
                        await page.screenshot(path=screenshot_path, full_page=False)
                        print(f"✅ Screenshot saved (fallback): {screenshot_path}")
                    
                    successful_captures += 1
                    
                except Exception as e:
                    print(f"❌ Failed to capture {theme}: {e}")
            
            await browser.close()
            
            print(f"\n🎉 Capture complete! {successful_captures}/{len(self.themes)} themes captured successfully")
            return successful_captures == len(self.themes)
    
    async def apply_theme(self, page, theme_name):
        """Apply a specific theme to the dashboard using the theme manager"""
        try:
            # Use the theme manager's setTheme function
            theme_script = f"""
            let result = 'none';
            
            // Check if the theme manager is available through window.flowdashTheme
            if (window.flowdashTheme && typeof window.flowdashTheme.set === 'function') {{
                window.flowdashTheme.set('{theme_name}');
                result = 'theme-manager';
            }}
            // Fallback: Manually enable/disable CSS links
            else {{
                const links = document.head.querySelectorAll('link[data-flowdash-theme]');
                links.forEach(link => {{
                    const themeName = link.getAttribute('data-flowdash-theme');
                    link.disabled = themeName !== '{theme_name}';
                }});
                document.documentElement.setAttribute('data-theme', '{theme_name}');
                result = 'manual-css';
            }}
            
            result;
            """
            
            result = await page.evaluate(theme_script)
            print(f"   Applied theme using method: {result}")
            
            # Additional wait to ensure CSS is loaded
            if result == 'theme-manager':
                # Wait for theme change event
                try:
                    await page.wait_for_function(
                        'document.documentElement.getAttribute("data-theme") === "' + theme_name + '"',
                        timeout=5000
                    )
                    print(f"   Theme change confirmed: {theme_name}")
                except:
                    print(f"   Warning: Theme change confirmation timeout")
            
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
