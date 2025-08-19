# Dashboard Overview and Features

## Overview

The Dashboard is the top‑level UI component that orchestrates rendering, layout, zoom/pan, selection, status updates, and (optionally) the minimap. It wraps the node/edge system and presents a cohesive, interactive visualization.

See also: [Minimap](minimap.md)

## Getting Started

1) Add containers to your page:

```html
<div id="graph"></div>
<div id="minimap-container"><svg id="minimap"></svg></div>
```

2) Initialize the dashboard:

```javascript
import { createAndInitDashboard } from "../js/dashboard.js";

// Pass a minimap selector to enable the minimap; omit it to disable
const dashboard = createAndInitDashboard(data, "#graph", "#minimap");
```

If you are using the bundled build, initialize according to your bundling setup (examples in `flowdash-bundle.html`).

## Anatomy

- **Main View**: Primary SVG canvas for nodes and edges; supports zoom/pan and interactions.
- **Minimap (optional)**: Scaled overview synchronized with the main view. See [Minimap](minimap.md).
- **Selection**: Tracks selected nodes/edges and optional selection bounding box.

## Key Features

- **Zoom/Pan**: Smooth zoom via wheel/controls and panning; auto-fit helpers.
- **Zoom Helpers**:
  - `zoomToRoot()` fits the entire diagram
  - `zoomToNode(node)` fits a specific node
  - `zoomToBoundingBox(bbox)` fits an arbitrary region
- **Selection**: Click to select; configurable neighbor selection; optional selection bounding box display.
- **Status Management**: Update status on a node or by dataset id for batch updates.
- **Theme Support**: Works with all themes under `dashboard/themes/*`.
- **Performance**: Minimap updates and heavy operations use `requestAnimationFrame` to stay responsive.

## Zoom and Pan System

The dashboard provides a comprehensive zoom and pan system with consistent behavior across all scenarios.

### Main View Zoom

- **Mouse wheel**: Zoom in/out at cursor position
- **Drag**: Pan the view when not zooming
- **Zoom extent**: Configurable scale limits (default: 0.1x to 40x)
- **Smooth transitions**: All programmatic zoom operations use smooth animations

### Zoom Controls

- `zoomToRoot()` - Fits the entire diagram in view
- `zoomToNode(node)` - Centers and fits a specific node
- `zoomToBoundingBox(bbox)` - Fits an arbitrary rectangular region
- `zoomIn()` / `zoomOut()` - Step zoom at current center
- `zoomReset()` - Returns to default zoom level

### Minimap Integration

The minimap provides synchronized overview and navigation:

- **Real-time sync**: Automatically reflects main view zoom and pan
- **Interactive navigation**: Click or drag in minimap to navigate main view
- **Viewport indicator**: Shows current visible area as overlay rectangle
- **Consistent sizing**: Maintains fixed monitor pixel dimensions regardless of graph size

## Minimap Sizing System

### Monitor Pixel Consistency

The minimap uses a unified sizing system that ensures consistent visual size across different graphs and browser states:

- **Target sizes**: Small (180px), Medium (240px), Large (400px) width
- **Aspect ratio**: Automatically calculated from main graph proportions
- **Scaling compensation**: Accounts for SVG coordinate space vs monitor pixels
- **Resize stability**: Maintains consistent size during browser resize, fullscreen toggle, and zoom operations

### Size Calculation

```javascript
// Unified sizing method ensures consistency
resizeMinimap() {
  // 1. Get target monitor pixel dimensions
  const targetWidthPx = getMinimapTargetWidth(sizeToken);
  const targetHeightPx = Math.round(targetWidthPx / graphAspectRatio);
  
  // 2. Calculate SVG scaling factor
  const svgScale = svgRect.width / this.main.width;
  
  // 3. Convert to SVG coordinate space
  const svgCoordWidth = targetWidthPx / svgScale;
  const svgCoordHeight = targetHeightPx / svgScale;
  
  // 4. Apply dimensions and update content
  this.minimap.svg.attr('width', svgCoordWidth).attr('height', svgCoordHeight);
}
```

### Size Tokens

- `'s'` or `{width: 180}` → 180px width
- `'m'` or `{width: 240}` → 240px width (default)
- `'l'` or `{width: 400}` → 400px width
- Custom: `{width: 200}` → 200px width

## Maximize/Restore (Floating Button)

- A floating button is always visible (top-right of the window) to toggle the dashboard between normal and maximized states.
- **Maximize**: The main SVG fills the entire viewport and automatically resizes on browser resize.
- **Restore**: Returns to the normal layout inside the page.

### Resize Handling

The system handles all resize scenarios consistently:

1. **Browser window resize**: Preserves zoom level and center point while adapting to new dimensions
2. **Fullscreen toggle**: Maintains zoom state while filling/restoring viewport
3. **Minimap resize**: Uses unified sizing method for consistent behavior

How it works:

- A fixed-position button is injected by the Dashboard on initialization.
- Clicking toggles a fullscreen class on the main SVG and updates the internal viewport to match the new size.
- Window `resize` is handled to keep the viewBox and minimap in sync while maximized.
- All resize operations use the unified `resizeMinimap()` method for consistency.

Styling hooks:

- Button element: `.fullscreen-toggle` (fixed at top-right; small, low-opacity icon; on hover it becomes a clear, high-contrast button)
- Fullscreen class: `.flowdash-fullscreen` (applied to the main SVG). If your page uses `#graph`, the legacy `#graph.fullscreen` also applies.


## Basic API (high level)

- `createAndInitDashboard(data, mainDivSelector, minimapDivSelector?)` → Dashboard instance
- `dashboard.initialize(mainDivSelector, minimapDivSelector?)`
- `dashboard.zoomToRoot()` / `dashboard.zoomToNode(node)` / `dashboard.zoomToBoundingBox(bbox)`
- `dashboard.getSelectedNodes()` / `dashboard.deselectAll()`
- `dashboard.updateNodeStatus(nodeId, status)` / `dashboard.updateDatasetStatus(datasetId, status)`

## Configuration Highlights

Common settings in your data/config influence behavior:

- **`settings.zoomToRoot`**: Auto-fit on load
- **`settings.selector`**: Neighbor/adjacency selection strategy
- **`settings.showBoundingBox`**: Show selection bounds overlay

## Usage Tips

- Provide stable sizes for `#graph` and `#minimap` containers to avoid resize thrash.
- Keep minimap enabled for large graphs to improve navigation.
- Style the minimap via theme CSS or custom overrides (see [Minimap](minimap.md)).

## Navigation

- Back to docs index: [Documentation Home](README.md)
- Related: [Minimap](minimap.md)


