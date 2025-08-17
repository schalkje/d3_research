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

## Maximize/Restore (Floating Button)

- A floating button is always visible (top-right of the window) to toggle the dashboard between normal and maximized states.
- **Maximize**: The main SVG fills the entire viewport and automatically resizes on browser resize.
- **Restore**: Returns to the normal layout inside the page.

How it works:

- A fixed-position button is injected by the Dashboard on initialization.
- Clicking toggles a fullscreen class on the main SVG and updates the internal viewport to match the new size.
- Window `resize` is handled to keep the viewBox and minimap in sync while maximized.

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


