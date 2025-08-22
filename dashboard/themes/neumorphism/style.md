## Neumorphism Theme – Concept and Guidance

### Heart of the Style
- **Soft, tactile, calm**: Surfaces feel pressed or lifted from a smooth base. Nothing is harsh.
- **Dual shadows**: Combine a gentle dark shadow and a bright highlight to suggest depth without realism.
- **Rounded geometry**: Generous radii and softened edges for containers and nodes.
- **Subtle contrast**: Prefer low-contrast tints and careful delineation via shadows over strong borders.
- **Typography**: Clean, modern sans-serif; medium weight for labels; avoid extremes in size and weight.
- **Motion**: Smooth, easing transitions. Feedback feels cushioned, not snappy.
- **Accessibility**: Ensure text-to-surface contrast remains above recommended thresholds even with light tints.

### Color Scheme (by Effect, not Names)
- **Base canvas**: A cool, pale surface that supports soft shadows and highlights.
- **Surface fill**: Slightly brighter than the base to appear lifted. Works well with both inner and outer shadows.
- **Structural lines**: Muted, cool strokes that divide without distracting.
- **Accent**: A calm, modern primary used for focus rings and active strokes rather than large fills.
- **Status tints**: Gentle, desaturated tints for states—recognizable but never loud. Borders shift hue lightly to reinforce meaning.

### Element Guidance
- **Nodes & groups**: Raised tiles with large radii, dual drop-shadows. On hover/active, increase elevation, not saturation.
- **Edges**: Slightly thicker than hairline; muted tone to avoid overpowering nodes.
- **Labels**: Medium weight, high legibility. Let contrast come from tone rather than thick strokes.
- **Toolbar/panels**: Floating cards with inset shadows for inputs; avoid harsh borders.
- **Minimap**: Soft inset panel with subtle grid if needed.

### Interaction & States
- **States**: Themes may redefine status colors and animations. Use calm tints at full opacity, but spread hues further apart so states are distinguishable at a glance.
- **Updating**: Warm-tinted pulse with slight elevation and stroke-width modulation; stays soft and readable.
- **Error**: Stronger tint and slightly thicker stroke to read clearly without breaking the soft look.
- **Hover/Active**: Elevate via shadow depth and a small scale transform; keep durations in the 120–200ms range with ease-in-out.

### Implementation Notes
- Rely on outer + inner drop-shadows to indicate depth; keep borders thin and cool.
- Avoid `!important` unless necessary for integration; let base structure be themed through tokens.
- Keep animations composited (transform/filter) where possible for smoother performance.

