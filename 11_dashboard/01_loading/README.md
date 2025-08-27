# Loading Overlay Demo

This demo showcases the loading overlay component in the Flowdash framework.

## What it demonstrates

- **Loading Overlay Component**: Shows the centralized loading overlay with animated dots
- **Toggle Functionality**: Button to show/hide the loading overlay with dynamic caption changes
- **Dashboard Integration**: Uses the DWH-5 dataset to display a small flow diagram
- **Real-world Usage**: Demonstrates how the loading overlay works with actual dashboard content

## Files

- `index.html` - Main demo page
- `dwh-5.json` - Sample data (copied from dashboard/data/dwh-5.json)
- `README.md` - This documentation

## Features

### Loading Overlay
- Positioned as a centered overlay on the dashboard
- Animated dots that cycle through different states
- Themed styling that matches the flowdash design system
- Proper accessibility attributes (role="status", aria-live="polite")

### Controls
- **Hide Loading / Show Loading Button**: Toggles the loading overlay visibility
  - Changes caption based on current state
  - Visual indication when loading is shown vs hidden
- **Reload Dashboard Button**: Simulates a dashboard reload with loading animation

### Visual Elements
- Clean, professional layout matching the flowdash design system
- Descriptive instructions for users
- Responsive design that works on different screen sizes

## Usage

1. Open `index.html` in a browser
2. The loading overlay is shown by default
3. Click "Hide Loading" to see the dashboard underneath
4. Click "Show Loading" to display the overlay again
5. Use "Reload Dashboard" to simulate loading during data refresh

## Technical Details

The demo imports and uses:
- `FlowDashboard` from the main dashboard module
- `showLoading` and `hideLoading` functions from the loading overlay module
- Standard flowdash CSS and theming
- D3.js and related libraries for visualization

The loading overlay automatically:
- Positions itself relative to the `#graph-container`
- Manages timing to ensure minimum visibility duration
- Handles cleanup and state management
- Provides smooth animations

## Integration Notes

This demo shows how to integrate the loading overlay into any flowdash application:

```javascript
import { showLoading, hideLoading } from '../../dashboard/js/loadingOverlay.js';

// Show loading
showLoading('#graph-container');

// Hide loading
hideLoading();
```

The overlay will automatically:
- Find the appropriate container
- Style itself according to the current theme
- Handle all animation and timing logic
