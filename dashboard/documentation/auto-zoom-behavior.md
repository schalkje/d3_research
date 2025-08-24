### Automatic Zoom and Minimap Behavior

This document specifies how Flowdash should adjust zoom and update the minimap when nodes are collapsed/expanded or when state updates change collapse state. The goals are:
- Maintain a stable user experience (preserve perceived zoom when possible).
- Recompute fit baselines when layout changes so scale indicators and reset behave correctly.
- Keep the minimap synchronized with the main viewport at all times.

### Definitions
- **Transform (k, x, y)**: Current main zoom scale `k` and translation `(x, y)` applied to `dashboard.main.container` via the zoom behavior.
- **Baseline fit (fitK, fitTransform)**: Scale and transform to fit all current content bounds, used by the minimap scale indicator and zoom reset.
- **Content bounds**: Bounding box of all visible nodes in the main container.
- **Sane node bbox**: Node bbox enlarged to a minimum on-screen size to avoid over-zooming extreme small targets.

### General Rules
- **R1. Preserve current scale on layout-only changes**: When layout changes (collapse/expand, status-driven changes, window resize), keep `transform.k` constant where feasible and re-center translation so the visible world region remains stable.
- **R2. Recompute baseline fit after content changes**: After any change that affects content bounds (collapse/expand, status cascade, node additions/removals, resize), recompute `fitK`/`fitTransform` from current content bounds so the minimap scale indicator and Zoom Reset reflect the new baseline.
- **R3. Minimap stays in lockstep**: Any change to main transform or content bounds must schedule a minimap update: refresh content, update viewBox/masks, update eye viewport, update scale indicator, and re-position cockpit.
- **R4. Avoid recursive updates**: Sync flags prevent main↔minimap feedback loops; minimap uses debounced viewport updates.
- **R5. Do not auto-change user zoom intent**: Never change `k` due to a collapse/expand unless the user explicitly invoked a zoom action (Zoom In/Out/Reset/Zoom to Node/Bounding Box).
- **R6. Fit-to-target actions animate via zoom behavior**: Actions that intentionally change zoom (zoom reset, zoom to node, zoom to bbox) must call the zoom behavior so the main and minimap remain synchronized.

### User Actions

- **A1. Collapse a container (click)**
  - Dashboard:
    - Apply collapse, recompute container size/visibility.
    - Keep `k` unchanged (R1). Adjust `(x,y)` to maintain the same world center in screen space; avoid sudden jump.
    - Recompute `fitK`/`fitTransform` based on new content bounds (R2).
  - Minimap:
    - Regenerate content (simplified or clone), update viewBox/masks to new content bbox, update eye from current main transform (R3).
    - Update scale indicator based on `transform.k / fitK`.

- **A2. Expand a container (click)**
  - Dashboard: Same as A1; expand, layout children, keep `k`, recenter `(x,y)` if necessary; recompute baseline fit.
  - Minimap: Same as A1.

- **A3. Double-click zoom to node or neighborhood**
  - Dashboard:
    - Compute bbox (use sane bbox when only self selected) and animate to that bbox via zoom behavior (R6).
    - Update `transform`, then recompute baseline fit (R2) if content bounds changed due to reveal.
  - Minimap:
    - Update viewport eye to match new transform; update scale indicator.

- **A4. Zoom In/Out buttons or wheel/pinch**
  - Dashboard: Update `transform` via zoom behavior; no change to baseline fit unless content bounds change.
  - Minimap: Debounced viewport update; update scale indicator.

- **A5. Zoom Reset**
  - Dashboard: Animate to `fitTransform` (current baseline) via zoom behavior; preserves up-to-date baseline since R2.
  - Minimap: Update viewport eye and scale indicator accordingly.

- **A6. Window resize / fullscreen toggle**
  - Dashboard: Preserve `k` (R1), recompute `(x,y)` to keep world center stable; recompute baseline fit (R2).
  - Minimap: Resize to target pixel size, recompute content scale and eye; update scale indicator and cockpit position.

### State-Driven Changes

- **S1. Status update collapses/expands nodes (toggleCollapseOnStatusChange=true)**
  - Dashboard:
    - Apply status, possibly toggling `collapsed` on affected containers. Avoid zoom changes (R5). Keep `k`, adjust `(x,y)` to keep view stable (R1).
    - When any node visibility/size changes affect bounds, recompute baseline fit (R2).
  - Minimap: Full content update and viewport sync (R3).

- **S2. Bulk status changes (dataset-wide)**
  - Dashboard: Same as S1; process all nodes, then recompute baseline fit once.
  - Minimap: Single aggregated update after layout settles.

### Selection and Neighborhood

- **N1. Single-click select**: No zoom change. Render selection bbox; minimap unchanged except content refresh if needed.
- **N2. Double-click inside active neighborhood bbox**: Zoom to that bbox (R6). Minimap updates eye and indicator.

### Minimap Visibility
- **M1. Hover mode auto-hide**: When not pinned, collapse cockpit when zoomed out to fit-or-below threshold; show cockpit when zoomed in. Keep visible while interacting/hovering.
- **M2. Pinned mode**: Always visible; still updates scale indicator and viewport.

### Edge Cases
- **E1. Collapsed nodes without DOM bbox**: Fall back to node data width/height for minimap rectangles and content bounds calculations.
- **E2. Extremely small targets**: Use sane node bbox for zoom-to-node to avoid over-zooming.
- **E3. Duplicate cockpit elements**: Detect and remove duplicates; re-initialize minimap safely on data reloads.

### Implementation Hooks
- After any expand/collapse or status-induced visibility change, call:
  - `dashboard.recomputeBaselineFit()`
  - `dashboard.onMainDisplayChange()` (schedules minimap update) or ensure equivalent update path is invoked.
- For user-initiated zoom actions, use:
  - `zoomIn()`, `zoomOut()`, `zoomReset()`
  - `zoomToNode(node)` / `zoomToBoundingBox(bbox)`

### Expected UX Outcomes
- Collapsing or expanding does not zoom the user in/out; the perceived scale remains constant.
- Zoom Reset always returns to a fit that reflects the current content after structural changes.
- The minimap consistently mirrors the main view and indicates scale relative to the current baseline.
