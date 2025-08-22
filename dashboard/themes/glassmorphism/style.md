## Glassmorphism Theme – Concept and Guidance

### Heart of the Style
- **Frosted clarity**: Translucent surfaces with soft blur and subtle inner radiance. Depth comes from light and glass, not heavy borders.
- **Readable by design**: Increase opacity and contrast just enough so content stays legible against dark gradients.
- **Soft geometry**: Medium radii, gentle shadows, and fine strokes.
- **Motion**: Gentle pulses and shimmers that feel like light shifting through glass.
- **Accessibility**: Ensure text and status strokes have sufficient contrast against frosted backgrounds.

### Color Scheme (by Effect, not Names)
- **Base canvas**: Dark gradient that lets frosted panels pop without glare.
- **Surfaces**: Semi‑translucent light panels (higher alpha than usual) for clear separation.
- **Borders**: Light, translucent strokes that remain visible on dark and light tints.
- **Accent**: Cool, crisp primary for focus rings and active strokes.
- **Edges**: Slightly brighter than borders with a faint glow for clarity.
- **States**: Brighter, fully readable glass tints with strong strokes; avoid over‑transparency.

### Element Guidance
- **Nodes/containers**: Frosted panels with medium radii, subtle drop‑shadows. Prefer increasing opacity over adding thick borders.
- **Headers**: Slightly denser glass than bodies so labels read clearly.
- **Edges**: Bright enough to stand off dark canvas; add a light glow.
- **Labels**: High-contrast text with a faint shadow for readability on glass.
- **Minimap**: Higher blur with slightly lower opacity to avoid visual dominance.

### Interaction & States
- **States**: Use distinct, legible tints per state with strong translucent strokes.
- **Updating**: Soft pulse that modulates stroke width and elevation, not hue.
- **Error**: Highest stroke contrast and a small shadow to anchor against blur.

### Implementation Notes
- Raise surface opacity (alpha) compared to typical glassmorphism to avoid unreadable content over complex canvases.
- Use backdrop-filter sparingly to keep performance acceptable; prefer moderate blur and slight saturation.
- Keep `!important` only where needed to assert theme over base.

