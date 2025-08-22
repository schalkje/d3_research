#!/usr/bin/env python3
"""
Theme Screenshot Capture Script for FlowDash

This script captures screenshots of the FlowDash dashboard with different themes applied.
It uses Selenium WebDriver to automate the process and save preview images for each theme.
"""

import os
import time
import json
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import Select

class ThemeScreenshotCapture:
    def __init__(self, dashboard_url="http://localhost:8000/dashboard/flowdash-js.html"):
        self.dashboard_url = dashboard_url
        self.themes = [
            "light", "dark", "brutalism", "cyberpunk", 
            "flat", "glassmorphism", "neumorphism", "retro"
        ]
        self.output_dir = "dashboard/themes"
        self.setup_driver()
    
    def setup_driver(self):
        """Setup Chrome WebDriver with appropriate options"""
        chrome_options = Options()
        chrome_options.add_argument("--headless")  # Run in headless mode
        chrome_options.add_argument("--no-sandbox")
        chrome_options.add_argument("--disable-dev-shm-usage")
        chrome_options.add_argument("--window-size=1200,800")
        chrome_options.add_argument("--disable-gpu")
        
        try:
            self.driver = webdriver.Chrome(options=chrome_options)
            print("✅ Chrome WebDriver initialized successfully")
        except Exception as e:
            print(f"❌ Failed to initialize Chrome WebDriver: {e}")
            print("Please ensure Chrome and ChromeDriver are installed")
            exit(1)
    
    def wait_for_dashboard_load(self):
        """Wait for the dashboard to fully load"""
        try:
            # Wait for the main graph element to be present
            WebDriverWait(self.driver, 30).until(
                EC.presence_of_element_located((By.ID, "graph"))
            )
            # Additional wait for content to render
            time.sleep(3)
            print("✅ Dashboard loaded successfully")
            return True
        except Exception as e:
            print(f"❌ Dashboard failed to load: {e}")
            return False
    
    def apply_theme(self, theme_name):
        """Apply a specific theme to the dashboard"""
        try:
            # Look for theme selector or apply theme via JavaScript
            # This might need to be adjusted based on how themes are applied in your dashboard
            theme_script = f"""
            if (typeof applyTheme === 'function') {{
                applyTheme('{theme_name}');
            }} else if (document.body.setAttribute) {{
                document.body.setAttribute('data-theme', '{theme_name}');
            }}
            """
            self.driver.execute_script(theme_script)
            
            # Wait for theme to apply
            time.sleep(2)
            print(f"✅ Applied theme: {theme_name}")
            return True
        except Exception as e:
            print(f"❌ Failed to apply theme {theme_name}: {e}")
            return False
    
    def capture_screenshot(self, theme_name):
        """Capture a screenshot for a specific theme"""
        try:
            # Ensure the theme is applied
            if not self.apply_theme(theme_name):
                return False
            
            # Wait a bit more for any animations to complete
            time.sleep(1)
            
            # Capture screenshot
            screenshot_path = os.path.join(self.output_dir, theme_name, f"{theme_name}-preview.png")
            self.driver.save_screenshot(screenshot_path)
            print(f"✅ Screenshot saved: {screenshot_path}")
            return True
        except Exception as e:
            print(f"❌ Failed to capture screenshot for {theme_name}: {e}")
            return False
    
    def capture_all_themes(self):
        """Capture screenshots for all themes"""
        print("🚀 Starting theme screenshot capture...")
        
        # Navigate to dashboard
        print(f"🌐 Navigating to: {self.dashboard_url}")
        self.driver.get(self.dashboard_url)
        
        # Wait for dashboard to load
        if not self.wait_for_dashboard_load():
            return False
        
        # Capture screenshots for each theme
        successful_captures = 0
        for theme in self.themes:
            print(f"\n📸 Capturing {theme} theme...")
            if self.capture_screenshot(theme):
                successful_captures += 1
        
        print(f"\n🎉 Capture complete! {successful_captures}/{len(self.themes)} themes captured successfully")
        return successful_captures == len(self.themes)
    
    def cleanup(self):
        """Clean up resources"""
        if hasattr(self, 'driver'):
            self.driver.quit()
            print("🧹 WebDriver cleaned up")

def main():
    """Main function to run the theme capture process"""
    print("🎨 FlowDash Theme Screenshot Capture Tool")
    print("=" * 50)
    
    # Check if output directories exist
    base_dir = "dashboard/themes"
    if not os.path.exists(base_dir):
        print(f"❌ Base directory not found: {base_dir}")
        return
    
    # Create theme directories if they don't exist
    themes = ["light", "dark", "brutalism", "cyberpunk", "flat", "glassmorphism", "neumorphism", "retro"]
    for theme in themes:
        theme_dir = os.path.join(base_dir, theme)
        if not os.path.exists(theme_dir):
            os.makedirs(theme_dir)
            print(f"📁 Created directory: {theme_dir}")
    
    # Initialize and run capture
    capturer = ThemeScreenshotCapture()
    
    try:
        success = capturer.capture_all_themes()
        if success:
            print("\n🎊 All theme screenshots captured successfully!")
        else:
            print("\n⚠️  Some themes failed to capture. Check the output above for details.")
    except KeyboardInterrupt:
        print("\n⏹️  Capture interrupted by user")
    except Exception as e:
        print(f"\n💥 Unexpected error: {e}")
    finally:
        capturer.cleanup()

if __name__ == "__main__":
    main()
