# Minimap

## Overview

The minimap provides a scaled overview of the full diagram and a visible viewport indicator (the “eye”) that mirrors the main view. It improves orientation and enables fast navigation in large graphs.

See also: [Dashboard Overview](dashboard.md)

## Enabling the Minimap

Add a dedicated SVG and pass its selector when initializing the dashboard:

```html
<div id="graph"></div>
<div id="minimap-container"><svg id="minimap"></svg></div>
```

```javascript
import { createAndInitDashboard } from "../js/dashboard.js";

// Enable minimap by providing the minimap selector
const dashboard = createAndInitDashboard(data, "#graph", "#minimap");
```

Omit the minimap selector to disable it.

## Interaction Model

- **Viewport “Eye”**: Shows which region of the diagram is currently visible.
- **Drag the Eye**: Dragging the viewport rectangle in the minimap pans the main view.
- **Zoom on Minimap**: Wheel/gesture zoom on the minimap adjusts the main view’s zoom and center.
- **Two‑way Sync**: Main view zoom/pan updates the minimap eye, and minimap interactions update the main view.

## Styling Hooks

You can theme the minimap via global CSS or theme overrides. Common selectors:

- `#minimap` — the minimap SVG element
- `#minimap rect.background` — scaled background of the full canvas
- `#minimap .eye` — masked layer that dims outside the viewport
- `#minimap .iris` — the viewport rectangle outline/fill
- `.minimap-eyeball` / `.minimap-pupil` — mask elements used for the fading effect

Theme examples live under `dashboard/themes/*/flowdash.css` and include minimap rules.

## Behavior Notes

- The minimap activates only when a valid minimap container is provided.
- It automatically computes a scale relative to the main view to fit the full diagram.
- Updates are batched with `requestAnimationFrame` to avoid layout thrash.

## Troubleshooting

- Ensure the minimap SVG has a non‑zero size (width/height) via CSS or layout.
- If the eye does not appear, verify the mask elements exist and your theme does not hide them.
- For extremely large diagrams, consider reducing visual detail or throttling updates.

## Navigation

- Back to docs index: [Documentation Home](README.md)
- Related: [Dashboard Overview](dashboard.md)


