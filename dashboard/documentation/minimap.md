# Minimap

## Overview

The minimap provides a scaled overview of the full diagram and a visible viewport indicator (the “eye”) that mirrors the main view. It improves orientation and enables fast navigation in large graphs.

This iteration embeds the minimap directly inside the dashboard (no separate minimap container on the page). It is responsive, themable, and configurable, with clear controls and an always-visible zoom scale indicator.

See also: [Dashboard Overview](dashboard.md)

Tip: The fullscreen toggle works seamlessly with the minimap; when maximized, the minimap resizes and stays synchronized.

## Requirements (Refined)

- **Embedded in dashboard**: Render the minimap inside the graph container. No external `minimap` container or separate SVG is required. Default placement is bottom‑right; position is configurable.
- **Clear icon controls**: Provide recognizable, consistent icons for actions (Zoom In, Zoom Out, Reset View, Visibility Mode). Prefer a well‑known icon set and consistent metaphors to aid recognition (see design best practices on icon clarity from [Justinmind](https://www.justinmind.com/blog/best-practices-for-designing-your-search-pattern/?utm_source=openai)).
- **Visible zoom scale**: Show a zoom indicator near the minimap. Support either a numeric percentage (e.g., 125%) or a scale bar. It should update in real time and be themeable (see examples of scale indicators in [Maxar UI docs](https://pro-docs.maxar.com/en-us/Interface/Interface_minimap.htm?utm_source=openai)).
- **Visibility modes**:
  - Hidden
  - Always visible
  - Visible on hover
- **Dynamic hover behavior**: In “visible on hover,” adapt based on zoom:
  - When zoom is at fit/fully zoomed‑out: show a compact icon button only
  - When zoomed‑in: show a small preview version of the minimap
  - Smooth fade/slide transitions in/out; configurable hover delay and dismiss delay
 - **User‑collapsed state (always/hover)**: Users can manually hide/collapse the minimap in both `always` and `hover` modes. When collapsed, only a small icon remains visible at the bottom‑right; clicking it expands the minimap again.
- **Responsive**: Size, hit‑targets, and layout adapt to screen size and pixel density (see responsive guidance in [MapLibrary](https://www.maplibrary.org/10067/7-best-practices-for-responsive-map-design/?utm_source=openai)).
- **Consistent design**: Colors, typography, spacing, and iconography match dashboard theming for coherence (see experience design principles in [FasterCapital](https://fastercapital.com/articles/10-Best-practices-for-experience-design-principles-in-mapping.html?utm_source=openai)).
- **User control**: Allow configuring position (corners), size (S/M/L, or px), and opacity to taste. Consider use‑case guidance on placement (e.g., bottom‑right) from [GameVoyages](https://gamevoyages.com/what-is-the-best-position-for-minimap/?utm_source=openai).
- **Performance**: Efficient redraws, throttled updates, and optional simplified rendering for very large graphs.
- **Accessibility**: Keyboard navigable controls, ARIA labels, sufficient contrast, and discernible focus states.

## Defaults (Chosen)

- **Mode**: Desktop defaults to `hover`; small screens default to `hidden` (when `mode` is not explicitly set).
- **Scale indicator**: `percent` readout, visible by default.
- **Icon set**: Reuse existing icon font across all controls.
- **Placement**: `bottom-right` by default.
- **Hover dynamics**: Smooth, subtle fade transitions.
- **Size schema**: Token‑based `s | m | l` (default `m`).
- **Touch behavior (hover mode)**: Single‑tap reveals; auto‑hide after inactivity.
- **Persistence**: Collapsed state persisted via `localStorage` by default.
- **Collapsed icon**: Bottom‑right by default; configurable position.

## Proposed Configuration API

The minimap is enabled and configured via options on dashboard init. No extra DOM node is needed.

```javascript
import { createAndInitDashboard } from "../js/dashboard.js";

const dashboard = createAndInitDashboard(data, "#graph", {
  minimap: {
    enabled: true,
    // If omitted, defaults: desktop → hover, small screens → hidden
    // mode: "hover", // explicit override: "hidden" | "always" | "hover"
    position: "bottom-right", // "bottom-right" | "bottom-left" | "top-right" | "top-left"
    size: "m", // tokens: "s" | "m" | "l" (or { width, height } in px)
    opacity: 1,
    collapsed: false, // if true, show icon-only toggle until expanded
    collapsedIcon: {
      position: "bottom-right" // configurable; defaults bottom-right
    },
    hover: {
      showDelayMs: 120,
      hideDelayMs: 300,
      zoomFitThreshold: 1.0 // <= threshold shows icon only; > threshold shows mini preview
    },
    touch: {
      autoHideAfterMs: 2500 // when revealed in hover mode
    },
    scaleIndicator: {
      visible: true,
      type: "percent",
      decimals: 0
    },
    icons: {
      // Reuse existing icon font names
      zoomIn: "plus",
      zoomOut: "minus",
      resetView: "target",
      mode: "eye", // toggles hidden/always/hover
      collapse: "triangle-down", // minimize
      expand: "minimap" // depict a minimap to expand
    },
    persistence: {
      persistCollapsedState: true, // uses localStorage by default
      storageKey: "flowdash:minimap:collapsed"
    },
    theme: {
      // overrides or tokens; optional
    }
  }
});
```

Backward compatibility: If a legacy `minimapSelector` is provided, we may ignore it and render the embedded minimap; alternatively, we can accept it as a no‑op. This document treats the embedded minimap as the source of truth.

## Interaction Model

- **Viewport “Eye”**: Shows which region of the diagram is currently visible.
- **Drag the Eye**: Dragging the viewport rectangle in the minimap pans the main view.
- **Click/Drag to Center**: Clicking a location in the minimap recenters the main view.
- **Zoom on Minimap**: Wheel/gesture zoom on the minimap adjusts the main view’s zoom and center.
- **Two‑way Sync**: Main view zoom/pan updates the minimap eye, and minimap interactions update the main view.

## UI Composition

- **Container**: Internal to the graph container, positioned via `position` option.
- **Canvas**: Scaled rendering of the full graph.
- **Viewport Eye**: Visible rectangle with outline and translucent outside mask.
- **Controls**: Icon buttons for Zoom In, Zoom Out, Reset View, Mode toggle, and Collapse/Expand; group buttons with adequate spacing and tooltips.
- **Zoom Scale**: Numeric percent or scale bar positioned near the controls or along the minimap bottom edge.
 - **Collapsed Icon**: When collapsed, render a small floating icon at bottom‑right that restores the minimap on click/tap.

## Styling and Theming

Expose CSS variables and hooks for themes to customize appearance. Example hooks:

- `--minimap-bg`
- `--minimap-border`
- `--minimap-eye-stroke`
- `--minimap-eye-fill`
- `--minimap-control-bg`
- `--minimap-control-fg`
- `--minimap-scale-fg`

Theme examples live under `dashboard/themes/*/flowdash.css` and should include minimap rules.

## Behavior and Performance Notes

- Automatically compute a fit scale to display the full graph.
- Batch updates with `requestAnimationFrame` and throttle reflows.
- Offer a simplified node/edge rendering mode for very large graphs.
- Respect reduced‑motion preferences for hover/transition animations.
 - Persist the user‑collapsed state via localStorage so the minimap remains collapsed/expanded across navigation by default.

## Accessibility

- All controls are keyboard focusable with clear focus outlines.
- Provide `aria-label` on icon buttons and descriptive tooltips.
- Maintain sufficient contrast ratios for controls and overlays.
 - Provide accessible names and roles for the Collapse/Expand control and the collapsed icon button; ensure a clear programmatic relationship between the collapsed icon and the minimap region it expands.

## Migration (from legacy setup)

- You no longer need to add a `<svg id="minimap">` or a separate container.
- Remove any `#minimap` DOM/query wiring from app code; configure via `minimap` options instead.

## Final Decisions

- Default mode: `hover` on desktop; `hidden` on small screens.
- Scale indicator: percent readout (visible by default).
- Icon set: reuse existing icon font; use `triangle-down` for minimize and a minimap‑depicting icon for expand.
- Placement: bottom‑right by default.
- Hover dynamics: smooth, subtle animations (no special effects).
- Size: `s | m | l` tokens (default `m`).
- Touch (hover mode): single‑tap to reveal; auto‑hide after inactivity.
- Persistence: collapsed state stored in localStorage by default; collapsed icon location configurable (default bottom‑right).

## Navigation

- Back to docs index: [Documentation Home](README.md)
- Related: [Dashboard Overview](dashboard.md)
