## Flat Theme – Concept and Guidance

### Heart of the Style
- **Bold simplicity**: Crisp shapes, strong color blocks, and confident typography.
- **No depth tricks**: No gradients, no shadows, no glass. Structure comes from layout, color, and stroke.
- **Accessible contrast**: Text and key lines meet or exceed recommended contrast.

### Color Scheme (by Effect, not Names)
- **Base canvas**: Clean, light background that keeps focus on content blocks.
- **Surfaces**: Pure, even fills for nodes and containers.
- **Borders**: Neutral dividers; concise and consistent.
- **Accent**: A clear, modern primary for focus and emphasis.
- **Edges**: Strong, readable link color with simple, consistent weight.
- **States**: Flat, saturated tints for clarity with matching outline hues.

### Element Guidance
- **Nodes/containers**: Simple rectangles with tight radii; use color to convey state and grouping.
- **Headers**: Slightly heavier type; rely on spacing and alignment rather than decoration.
- **Edges**: Single weight with clear arrowheads; avoid glow or blur.
- **Labels**: High-contrast, semi-bold to bold.

### Interaction & States
- **States**: Prefer solid tints with crisp borders. Status differences must be obvious, not subtle.
- **Updating**: Linear marching dash; avoid easing and effects.
- **Hover/Active**: Minor color shift or stroke weight increase; no shadows.

### Implementation Notes
- Avoid `!important` where possible; the theme is designed to be explicit.
- Keep spacing/padding consistent to communicate structure.

