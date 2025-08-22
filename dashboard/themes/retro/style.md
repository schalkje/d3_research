## Retro Theme – Concept and Guidance

### Heart of the Style
- **Green‑on‑black terminal vibe**: Monospace, phosphor glow, simple lines.
- **Electron beam feel**: Subtle scanlines and faint bloom, but keep it readable.
- **Functional austerity**: Minimal adornment; hierarchy via strokes and tints.

### Color Scheme (by Effect, not Names)
- **Base canvas**: Deep black‑green with soft vignettes and scanlines.
- **Surfaces**: Dark green tiles with crisp outlines.
- **Text**: Bright green with faint glow; muted green for secondary.
- **Accent**: Vivid green for selection and confirmations.
- **Edges**: Luminous green‑cyan.
- **States**: Distinct phosphor tints: cyan for ready, lime for updating, bright green for updated, amber/orange for warnings/delays, red for errors, dull green for skipped.

### Element Guidance
- **Nodes/containers**: Flat dark surfaces with neon‑green borders; tight radii.
- **Edges**: Clean lines with a light glow; arrowheads match.
- **Labels**: Monospace; allow a light outer glow but avoid blur halos.
- **Headers**: Slightly brighter panel with strong outline.

### Interaction & States
- **Updating**: Linear scanline dash.
- **Error**: Hot red stroke with subtle bloom.
- **Hover/Active**: Slightly brighter stroke; avoid transforms.

### Implementation Notes
- Keep glow values modest for legibility on dense graphs.
- Do not introduce gradients on shapes; reserve for canvas atmosphere only.

