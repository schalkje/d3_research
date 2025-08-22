## Dark Theme – Concept and Guidance

### Heart of the Style
- **Low‑glare, high‑contrast**: Deep backgrounds with clear, legible text. Accents are cool and crisp, used sparingly.
- **Clarity over spectacle**: Avoid heavy fills for states; use luminous strokes and subtle tints to maintain readability on dark.
- **Calm depth**: Small, soft shadows; edges are clean. Surfaces feel matte, not glossy.
- **Typography**: Neutral sans-serif, steady weights. Prioritize contrast and spacing.
- **Motion**: Minimal and purposeful. Linear for activity, gentle ease for hover/selection.
- **Accessibility**: Maintain strong text contrast and sufficient color separation between statuses.

### Color Scheme (by Effect, not Names)
- **Base canvas**: Very dark neutral that reduces eye strain and haloing.
- **Surface**: Slightly lighter neutral for panels and nodes; matte finish.
- **Text**: High-contrast, slightly cool light tone for copy; softer tone for muted.
- **Accent**: Cool, modern primary reserved for focus, selection, and important strokes.
- **Edges**: Muted mid‑tone that reads clearly on the base without dominating.
- **States**: Differentiate primarily via vivid strokes and restrained, near‑black fills to prevent glare.

### Element Guidance
- **Nodes/containers**: Low‑contrast fill tints with crisp, cool borders. Selection increases stroke and accent color.
- **Edges**: Clean single‑weight lines; arrowheads match stroke color.
- **Labels**: Light on dark, avoid pure white. Ensure 7:1 contrast when possible.
- **Minimap**: Dark translucent base; thin borders.

### Interaction & States
- **States**: Re‑tint fills toward near‑black variants and use saturated strokes for clear meaning.
- **Updating**: Linear, marching dash in a warm accent to draw attention without glare.
- **Error**: Strong warm stroke with a faint glow for visibility; darker fill to reduce noise.
- **Hover/Active**: Slight stroke weight increase or accent on selection; restrained shadows.

### Implementation Notes
- Keep backgrounds very dark; avoid pure black to reduce contrast spikes.
- Favor stroke changes over fill changes for state communication.
- Use minimal `!important`; let base tokens drive the look.

