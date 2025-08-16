## Brutalism Theme – Concept and Guidance

### Heart of the Style
- **Loud, opinionated, functional**: Every element exists to communicate hierarchy and flow with zero ambiguity.
- **High contrast**: Pair near-black lines with bright, assertive fills and clear text. Text-to-background contrast should be chosen to feel unmistakable at a glance.
- **Heavy structure**: Borders are thick, edges are crisp, fills are flat. The diagram should look like it was screen‑printed.
- **Minimal rounding**: Corners are square or barely rounded (0–2px). Only soften when it improves legibility of dense clusters.
- **Printed depth**: Prefer **offset, hard shadows** (solid, no blur) over soft glows. They imply layers without pretending to be realistic.
- **Typography**: Bold for labels and headings; introduce monospace for technical accents or IDs.
- **Motion**: Snappy, linear transitions. Avoid easing curves. Feedback should feel immediate and utilitarian.
- **Accessibility**: Maintain strong contrast in all states. Status/badges should remain legible over any background.

### Color Scheme (by Effect, not Names)
- **Base canvas**: Light, slightly warm foundation that keeps the grid visible without competing with nodes.
- **Structural ink**: Almost-black lines for borders, arrows, and dividers—reads like marker on paper.
- **Primary accent**: A strong, saturated primary used sparingly for emphasis and focus, never for large fills.
- **Surface fills**: Bright, assertive flats that stay readable under heavy outlines and offset shadows.
- **Muted text**: A darker neutral for secondary copy that still clears accessibility thresholds on the base.
- **Edge strokes**: Same structural ink as borders to unify the diagram’s “printed” look.
- **Status fills**: Vivid, unmistakable hues for Updated/Warning/Error/etc., chosen for clarity against both the surface fill and the structural ink.

### Element Guidance
- **Nodes (process boxes)**: Flat surface fills with thick outlines, minimal rounding. Use bold labels centered. Apply a hard, offset drop‑shadow to suggest layering.
- **Groups/containers (swimlanes)**: Same construction as nodes but lighter fill, emphasizing containment. Labels read like stamped headings.
- **Edges (links/arrows)**: Thick lines with simple, uncompromising arrowheads. Avoid gradients or rounded joints unless clarity requires it.
- **Labels**: Big, unapologetic. Prefer uppercase for headers. Keep body labels bold but compact to avoid crowding.
- **Toolbar/panels**: Blocks with clear separation lines, zero gloss. Interactions pop via contrast, not animation.
- **Minimap**: Reduced, high-contrast miniature with a visible grid and crisp frame.

### Interaction & States
- **States**: Themes are allowed to explicitly redefine state colors and motion. Use vivid, full‑opacity fills with heavy outlines so the meaning is unmistakable.
- **Updating**: Prefer linear, marching-dash outlines or stepwise ticks over glows. Keep cycles short and mechanical.
- **Hover/Active**: Micro changes—slightly thicker stroke or a stronger offset shadow. No soft glows. Transitions are linear and short.

### Implementation Notes
- Prefer token variables for backgrounds, surfaces, text, borders, edges.
- Avoid `!important` so base state styles can shine through. Theme shapes presentation; states define meaning.
- Use repeating linear gradients for grids; avoid blurry textures.

