## Cyberpunk Theme – Concept and Guidance

### Heart of the Style
- **Neon on noir**: Dark techno base with saturated neon accents that glow. UI feels energetic and electric.
- **High contrast, luminous edges**: Shapes use dark fills with bright strokes and soft glows to define structure.
- **Holographic motion**: Activity reads as scanning lines and pulsing light, not bouncy easing.
- **Typography**: Crisp sans-serif with optional subtle glow for headers; keep body text clear and unglossy.
- **Accessibility**: Ensure legibility against glow; never rely on glow alone for contrast.

### Color Scheme (by Effect, not Names)
- **Base canvas**: Deep night gradient that supports neon glows without haloing.
- **Surface**: Slightly lighter, cool-leaning panels for nodes and groups.
- **Accent**: Dual‑tone neon system (magenta/cyan) for focus, with green/yellow/orange/red for states.
- **Edges**: Electric cyan stroke with a soft outer glow.
- **States**: Dark, near‑black fills with bright, saturated neon strokes and distinct glows.

### Element Guidance
- **Nodes/containers**: Dark fills, medium radii. Strokes are neon; selection adds outer glow.
- **Edges**: Clean, bright strokes that glow softly; arrowheads match.
- **Labels**: Light text; headers can use minimal text‑glow. Avoid overglow on body copy.
- **Minimap**: Translucent panel with reduced glow intensity; keep borders visible.

### Interaction & States
- **States**: Each state owns a unique neon stroke/glow. Fills stay dark to minimize glare.
- **Updating**: Marching dash (scan) plus alternating glow pulse communicates activity without jitter.
- **Error**: Hot neon with stronger, tighter glow and thicker stroke.
- **Hover/Active**: Slight increase in glow and stroke weight; minimal scale changes.

### Implementation Notes
- Keep glows via filter drop-shadows for performance; avoid excessive blur radii.
- Reserve dual‑tone pulses for active/transient states to reduce visual noise.
- Avoid `!important` unless needed to maintain theme integrity over base CSS.

