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
                        # Wait for the graph container to be visible
                        await page.wait_for_selector("#graph-container", timeout=5000)
                        
                        # Hide the theme selector UI to keep it out of captures
                        await page.evaluate("""
                            const themeUI = document.querySelector('[data-flowdash-theme-ui="root"]');
                            if (themeUI) themeUI.style.display = 'none';
                        """)
                        
                        # Zoom out to 95% to get a better overview and ensure full dashboard is visible
                        await page.evaluate("""
                            // Try to zoom out using the dashboard's zoom controls
                            const zoomOutBtn = document.getElementById('zoom-out');
                            if (zoomOutBtn) {
                                // Click zoom out a few times to get to ~95%
                                for (let i = 0; i < 3; i++) {
                                    zoomOutBtn.click();
                                }
                            }
                        """)
                        
                        # Wait for zoom to settle and content to reposition
                        await page.wait_for_timeout(2000)
                        
                        # Get the graph container element AFTER zooming
                        graph_container = await page.query_selector("#graph-container")
                        if graph_container:
                            # Get the bounding box of the graph container (now with zoom applied)
                            bbox = await graph_container.bounding_box()
                            if bbox:
                                # Get the body element to calculate the full dashboard height
                                body_element = await page.query_selector("body")
                                if body_element:
                                    body_bbox = await body_element.bounding_box()
                                    if body_bbox:
                                        # Calculate the full height needed based on body dimensions
                                        # Add 12px margin on all sides
                                        margin = 12
                                        clip_area = {
                                            'x': bbox['x'] - margin,
                                            'y': bbox['y'] - margin,
                                            'width': bbox['width'] + (margin * 2),
                                            'height': body_bbox['height'] - bbox['y'] + margin
                                        }
                                        
                                        # Capture the area with proper body height and 12px margins
                                        await page.screenshot(
                                            path=screenshot_path,
                                            clip=clip_area
                                        )
                                        print(f"✅ Screenshot saved (full body height + 12px margin): {screenshot_path}")
                                    else:
                                        # Fallback: use container height with margin
                                        margin = 12
                                        clip_area = {
                                            'x': bbox['x'] - margin,
                                            'y': bbox['y'] - margin,
                                            'width': bbox['width'] + (margin * 2),
                                            'height': bbox['height'] + (margin * 2)
                                        }
                                        await page.screenshot(path=screenshot_path, clip=clip_area)
                                        print(f"✅ Screenshot saved (container height + 12px margin): {screenshot_path}")
                                else:
                                    # Fallback: use container height with margin
                                    margin = 12
                                    clip_area = {
                                        'x': bbox['x'] - margin,
                                        'y': bbox['y'] - margin,
                                        'width': bbox['width'] + (margin * 2),
                                        'height': bbox['height'] + (margin * 2)
                                    }
                                    await page.screenshot(path=screenshot_path, clip=clip_area)
                                    print(f"✅ Screenshot saved (container height + 12px margin): {screenshot_path}")
                            else:
                                # Fallback: capture just the graph container
                                await graph_container.screenshot(path=screenshot_path)
                                print(f"✅ Screenshot saved (graph container): {screenshot_path}")
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
