# Dashboard Overview and Features

## Overview

The Dashboard is the top‑level UI component that orchestrates rendering, layout, zoom/pan, selection, status updates, and (optionally) the minimap. It wraps the node/edge system and presents a cohesive, interactive visualization.

See also: [Minimap](minimap.md)

## Getting Started

1) Add container to your page:

```html
<div id="graph"></div>
```

2) Initialize the dashboard:

```javascript
import { createAndInitDashboard } from "../js/dashboard.js";

// Simple initialization with just the main graph container
const dashboard = createAndInitDashboard(data, "#graph");
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

1. **Browser window resize**: Preserves zoom level and center point while adapting to new dimensions; the 100% is recomputed with the new size
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

- `createAndInitDashboard(data, mainDivSelector)` → Dashboard instance
- `dashboard.initialize(mainDivSelector)`
- `dashboard.zoomToRoot()` / `dashboard.zoomToNode(node)` / `dashboard.zoomToBoundingBox(bbox)`
- `dashboard.getSelectedNodes()` / `dashboard.deselectAll()`
- `dashboard.updateNodeStatus(nodeId, status)` / `dashboard.updateDatasetStatus(datasetId, status)`

## Configuration Highlights

Common settings in your data/config influence behavior:

- **`settings.zoomToRoot`**: Auto-fit on load
- **`settings.selector`**: Neighbor/adjacency selection strategy
- **`settings.showBoundingBox`**: Show selection bounds overlay

## Graph Container Sizing

### Initial Sizing

When the dashboard initializes, it automatically sizes itself based on the `#graph` container:

1. **Container Detection**: The dashboard uses `getBoundingClientRect()` to detect the current size of the `#graph` div
2. **SVG Creation**: Creates an SVG element that fills the container completely
3. **Coordinate System**: Sets up a centered coordinate system using `viewBox` with origin at `[-width/2, -height/2, width, height]`
4. **Aspect Ratio**: Calculates and stores the container's aspect ratio for consistent scaling

```javascript
// The dashboard automatically detects container size on initialization
const { width, height } = svg.node().getBoundingClientRect();
svg.attr("viewBox", [-width / 2, -height / 2, width, height]);
```

### Resize Behavior

The dashboard handles container resizing in two modes:

#### Normal Mode (Default)
- **Window Resize**: Listens to browser window resize events
- **Zoom Preservation**: Maintains current zoom level and center point when container size changes
- **Content Stability**: The same dashboard content remains visible during resize operations
- **Aspect Ratio Handling**: When container aspect ratio changes, one dimension maintains the same visible area while the other adjusts
- **Smooth Transitions**: All resize operations preserve user's current view state

#### Fullscreen Mode
- **Viewport Filling**: The SVG expands to fill the entire browser viewport
- **Dynamic Resizing**: Automatically adapts to viewport changes (browser resize, fullscreen toggle)
- **State Preservation**: Maintains zoom and pan state when entering/exiting fullscreen

### Scaling System Requirements

The dashboard implements a dual-coordinate scaling system to maintain visual consistency across different container sizes and browser states.

#### Core Requirements

1. **Visual Consistency**: From the user's perspective, the dashboard content should appear identical when resizing - only becoming proportionally larger or smaller
2. **Scale Preservation**: The relationship between SVG coordinate units and screen pixels must be maintained during resize operations
3. **View Stability**: The user's current view (zoom level, center point) must remain unchanged during resize
4. **Minimap Behavior**: The minimap maintains constant screen pixel dimensions regardless of container size changes

#### Initial Scale Computation

When the dashboard initializes, it establishes the base scaling relationship:

```javascript
// 1. Detect container dimensions in screen pixels
const { width, height } = containerDiv.getBoundingClientRect();

// 2. Establish SVG coordinate system (centered origin)
svg.attr('viewBox', [-width/2, -height/2, width, height]);

// 3. Base scale: 1 SVG unit = 1 screen pixel (at 100% zoom)
const baseScale = 1.0;
this.main.pixelToSvgRatio = baseScale;
```

#### Resize Scale Adjustment

During resize operations, the scale relationship is recalculated:

```javascript
applyResizePreserveZoom() {
  // 1. Get new container dimensions
  const newRect = this.main.svg.node().getBoundingClientRect();
  const newWidth = newRect.width;
  const newHeight = newRect.height;
  
  // 2. Calculate scale adjustment factor
  const widthRatio = newWidth / this.main.width;
  const heightRatio = newHeight / this.main.height;
  
  // 3. Update SVG coordinate system
  this.main.svg.attr('viewBox', [-newWidth/2, -newHeight/2, newWidth, newHeight]);
  
  // 4. Preserve user's zoom level by adjusting transform
  const newK = this.main.transform.k; // Keep same zoom level
  const newTransform = d3.zoomIdentity
    .translate(this.main.transform.x * widthRatio, this.main.transform.y * heightRatio)
    .scale(newK);
    
  // 5. Apply the preserved transform
  this.main.svg.call(this.main.zoom.transform, newTransform);
  
  // 6. Update stored dimensions
  this.main.width = newWidth;
  this.main.height = newHeight;
}
```

#### Feature Specifications

**Main Dashboard Scaling:**
- **Content Stability**: The same dashboard area remains visible during pure size changes (no aspect ratio change)
- **Aspect Ratio Adaptation**: When container aspect ratio changes:
  - If container becomes wider: horizontal view expands, vertical view stays the same
  - If container becomes taller: vertical view expands, horizontal view stays the same
  - If container becomes narrower: horizontal view contracts, vertical view stays the same
  - If container becomes shorter: vertical view contracts, horizontal view stays the same
- **Zoom Preservation**: User's zoom level (k-factor) remains constant
- **Center Preservation**: The center point of the user's view stays fixed
- **Content Relationship**: The visual relationship between nodes, edges, and spacing is maintained

**Minimap Scaling Behavior:**
- **Fixed Screen Size**: Minimap maintains exact pixel dimensions (e.g., 240px × 180px) regardless of main container size
- **Position Stability**: Remains anchored to chosen corner (default: bottom-right)
- **Scale Independence**: Minimap size is independent of main dashboard scaling
- **Content Synchronization**: Minimap content scales to show the same world view as the main dashboard

#### User Experience Goals

1. **Seamless Resizing**: Users should not notice jarring changes during resize operations
2. **Content Preservation**: The same part of the dashboard stays visible during resize - no more, no less content is shown
3. **Aspect Ratio Impact**: When container aspect ratio changes, one dimension (horizontal or vertical) stays the same while the other adjusts to show more/less content
4. **Context Preservation**: Current focus area and zoom level are maintained across all resize scenarios
5. **Consistent Navigation**: Minimap provides consistent navigation regardless of main container size

#### Technical Implementation

```javascript
// Scale factor calculation for consistent visual appearance
const calculateScaleFactor = (oldDimensions, newDimensions) => {
  return {
    x: newDimensions.width / oldDimensions.width,
    y: newDimensions.height / oldDimensions.height
  };
};

// Transform adjustment to preserve user view
const preserveUserView = (oldTransform, scaleFactor) => {
  return d3.zoomIdentity
    .translate(
      oldTransform.x * scaleFactor.x,
      oldTransform.y * scaleFactor.y
    )
    .scale(oldTransform.k); // Zoom level stays constant
};
```

## Usage Tips

- **Container Sizing**: Provide stable sizes for the `#graph` container to avoid resize thrash
- **CSS Dimensions**: Set explicit width/height on the `#graph` container via CSS for predictable behavior  
- **Responsive Design**: The dashboard adapts to container size changes, making it suitable for responsive layouts
- **Minimap Integration**: The minimap automatically adapts to container size changes and maintains consistent visual size
- **Performance**: Resize operations are optimized to preserve user context and avoid jarring transitions
- **Theme Support**: All styling is handled through the theme system under `dashboard/themes/*`

## Navigation

- Back to docs index: [Documentation Home](README.md)
- Related: [Minimap](minimap.md)


