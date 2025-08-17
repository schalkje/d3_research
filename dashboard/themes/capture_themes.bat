@echo off
echo 🎨 FlowDash Theme Screenshot Capture Tool
echo ==========================================

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python is not installed or not in PATH
    echo Please install Python 3.7+ and try again
    pause
    exit /b 1
)

REM Check if requirements are installed
echo 📦 Checking dependencies...
pip show playwright >nul 2>&1
if errorlevel 1 (
    echo 📥 Installing Playwright...
    pip install -r requirements.txt
    if errorlevel 1 (
        echo ❌ Failed to install dependencies
        pause
        exit /b 1
    )
    echo 🔧 Installing Playwright browsers...
    playwright install chromium
)

REM Run the capture script
echo 🚀 Starting theme capture...
python capture_themes_playwright.py

echo.
echo ✅ Process complete! Check the theme folders for preview images.
pause
