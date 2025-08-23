# 🎨 Theme Screenshot Capture Tools

This directory contains tools to automatically capture preview images for all FlowDash themes.

## 🚀 Quick Start (Windows)

1. **Double-click** `capture_themes.bat` to run the automated capture process
2. The script will automatically install dependencies and capture all themes
3. Preview images will be saved in each theme's folder as `{theme}-preview.png`

## 🐍 Manual Setup (All Platforms)

### Prerequisites
- Python 3.7 or higher
- Access to the FlowDash dashboard at `http://localhost:8000/dashboard/flowdash-js.html`

### Installation

1. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Install Playwright browsers:**
   ```bash
   playwright install chromium
   ```

### Usage

1. **Ensure your dashboard is running** at `http://localhost:8000/dashboard/flowdash-js.html`

2. **Run the capture script:**
   ```bash
   python capture_themes_playwright.py
   ```

3. **Alternative Selenium script** (if you prefer):
   ```bash
   python capture_themes.py
   ```

## 📁 Output

The script will create preview images in each theme folder:
- `light/light-preview.png`
- `dark/dark-preview.png`
- `brutalism/brutalism-preview.png`
- `cyberpunk/cyberpunk-preview.png`
- `flat/flat-preview.png`
- `glassmorphism/glassmorphism-preview.png`
- `neumorphism/neumorphism-preview.png`
- `retro/retro-preview.png`

## 🔧 How It Works

1. **Launches a headless browser** (Chromium)
2. **Navigates to your dashboard** at the specified URL
3. **Waits for the dashboard to load** completely
4. **Applies each theme** using multiple methods:
   - JavaScript function calls
   - HTML data attributes
   - Theme selector dropdowns
5. **Captures screenshots** at 1200x800 resolution
6. **Saves images** to the appropriate theme folders

## 🎯 Theme Application Methods

The script tries multiple approaches to apply themes:

1. **Function call**: `applyTheme('theme-name')`
2. **Data attribute**: `document.body.setAttribute('data-theme', 'theme-name')`
3. **Dropdown selection**: Finds and changes theme selector dropdowns

## 🐛 Troubleshooting

### Dashboard Not Loading
- Ensure your dashboard is running at the correct URL
- Check that the `#graph` element exists in your HTML
- Verify the dashboard loads completely in a regular browser

### Themes Not Applying
- Check browser console for JavaScript errors
- Verify theme CSS files are properly loaded
- Ensure theme switching mechanism is working manually

### Screenshots Not Saving
- Check file permissions in theme directories
- Verify Python has write access to the output folders
- Check available disk space

### Dependencies Issues
- Update pip: `pip install --upgrade pip`
- Try installing Playwright manually: `pip install playwright`
- Install browsers: `playwright install chromium`

## 📝 Customization

### Change Dashboard URL
Edit the `dashboard_url` parameter in the script:
```python
capturer = ThemeScreenshotCapture(dashboard_url="http://your-custom-url")
```

### Change Screenshot Size
Modify the viewport size in the script:
```python
await page.set_viewport_size({"width": 1600, "height": 900})
```

### Add Custom Themes
Update the `themes` list in the script:
```python
self.themes = ["light", "dark", "custom-theme"]
```

## 🤝 Contributing

If you encounter issues or want to improve the capture process:
1. Check the console output for detailed error messages
2. Test theme switching manually in your browser
3. Verify your dashboard's theme implementation
4. Submit issues or pull requests with detailed information

## 📄 License

These tools are part of the FlowDash project and follow the same license terms.
