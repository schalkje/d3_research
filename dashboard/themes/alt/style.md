## Alt Theme – Concept and Guidance

### Heart of the Style
- **Neutral and minimal**: Calm grayscale base with restrained color accents.
- **Clarity first**: High legibility, low visual noise, consistent spacing.
- **Versatile**: Designed to sit comfortably in both light and dim UIs.

### Color System (via CSS variables)
- `--fd-bg`: Page background (very light gray or near‑white)
- `--fd-surface`: Canvas/surface blocks (subtle contrast from bg)
- `--fd-text`: Primary text (near‑black on light background)
- `--fd-muted`: Secondary text/icons
- `--fd-accent`: Focus/selection color (cool blue by default)
- `--fd-border`: Structural separators and outlines
- `--fd-edge`: Default edge color (muted gray‑blue)

Keep the palette soft. Use saturation sparingly: states and focus should stand out without overpowering.

### Element Guidance
- **Nodes/containers**: Flat surfaces with thin borders; minimal shadows.
- **Edges**: Clean, medium‑contrast strokes; reserve strong color for state emphasis.
- **Labels**: System UI font stack; avoid glow/blur; favor crisp text.
- **Headers**: Slight contrast lift vs. surfaces; clear separation via border.
- **Fullscreen/minimap**: Respect surfaces and borders; avoid heavy backgrounds.

### Interaction & States
- **Updating**: Subtle dashed stroke animation; avoid large glows.
- **Error/Warning**: Use red/amber strokes; keep fills conservative for readability.
- **Selection**: Increase stroke width and shift to `--fd-accent`.

### Implementation Notes
- Ensure adequate contrast for accessibility (WCAG AA+ where feasible).
- Prefer consistent radii and spacing; avoid per‑node ornamentation.
- Minimap should remain understated; viewport eye/iris must be visible on all backgrounds.

### Quick CSS Skeleton (reference)
```css
:root, [data-theme="alt"] {
  --fd-bg: #fafafa;
  --fd-surface: #ffffff;
  --fd-text: #1b1f24;
  --fd-muted: #6b7280;
  --fd-accent: #3b82f6; /* blue-500 */
  --fd-border: #e5e7eb;
  --fd-edge: #9aa3b2;
}

body { background: var(--fd-bg); color: var(--fd-text); }
#graph { background-color: var(--fd-surface); border-color: var(--fd-border); }
.minimap-svg { background-color: rgba(255,255,255,0.7); border-color: var(--fd-border); }
.shape, .container-shape, .rect.shape { fill: var(--fd-surface); stroke: var(--fd-border); }
text, .label, .rect.label { fill: var(--fd-text); }
.edge .path { stroke: var(--fd-edge); }
.selected .shape { stroke: var(--fd-accent); stroke-width: 2.5px; }
```

### Notes for Consumers
- If your app already styles the page background, you can omit `body` overrides and set only the canvas colors (`#graph`, `.minimap-svg`).
- The floating maximize/restore button should remain visible; it inherits readable contrast from the base UI. Adjust only if your background is highly custom.


