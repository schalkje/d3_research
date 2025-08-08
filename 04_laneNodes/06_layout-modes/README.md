# Lane Node - Layout Modes Demo

## Overview

This demo showcases Lane nodes with different layout modes and sizing strategies, demonstrating the various configuration options available for lane layout management.

## Layout Modes

### Default Layout
- **File**: `default-layout.html`
- **Features**: Standard layout with default sizing
- **Behavior**: Balanced sizing with moderate dimensions

### Auto-Size Small
- **File**: `auto-size-small.html`
- **Features**: Auto-sizing with small size mode
- **Behavior**: Dynamic sizing with compact dimensions

### Auto-Size Large
- **File**: `auto-size-large.html`
- **Features**: Auto-sizing with large size mode
- **Behavior**: Dynamic sizing with expanded dimensions

### Fixed-Size Small
- **File**: `fixed-size-small.html`
- **Features**: Fixed sizing with small size mode
- **Behavior**: Consistent compact dimensions

### Fixed-Size Large
- **File**: `fixed-size-large.html`
- **Features**: Fixed sizing with large size mode
- **Behavior**: Consistent expanded dimensions

## Test Coverage

This demo includes automated tests that validate:
- Dashboard initialization for each layout mode
- Proper sizing behavior for each mode
- Layout consistency within each mode
- Size mode configuration
- Visual rendering differences

## Layout Mode Comparison

| Mode | Sizing Strategy | Size Mode | Behavior |
|------|----------------|-----------|----------|
| Default | Standard | Default | Balanced dimensions |
| Auto-Size Small | Dynamic | Small | Compact auto-sizing |
| Auto-Size Large | Dynamic | Large | Expanded auto-sizing |
| Fixed-Size Small | Fixed | Small | Compact fixed size |
| Fixed-Size Large | Fixed | Large | Expanded fixed size |

## Node Structure

Each layout mode uses the same basic structure:
```
lane1 (Lane Node)
├── rect1 (Child with mode-specific sizing)
├── rect2 (Child with mode-specific sizing)
└── rect3 (Child with mode-specific sizing)
```

## Related Documentation

- [Lane Node Documentation](../../dashboard/documentation/nodes/lane-node.md)
- [Dashboard Documentation](../../dashboard/readme.md)
- [Node System Implementation](../../dashboard/implementation-nodes.md)
