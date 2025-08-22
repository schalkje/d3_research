# Lane Node - Default Mode Demo

## Overview

This demo showcases a Lane node with 3 rectangular child nodes in default mode, demonstrating the vertical stacking and horizontal centering capabilities of the Lane node type.

## Features

- **Lane Container**: Single lane node containing child elements
- **Child Management**: 3 rectangular child nodes
- **Vertical Stacking**: Children arranged vertically with automatic spacing
- **Horizontal Centering**: Children centered horizontally within the lane
- **Default Layout**: Standard layout mode with full display

## Test Coverage

This demo includes automated tests that validate:
- Dashboard initialization
- Lane node rendering
- Child node rendering (3 rectangles)
- Vertical stacking layout
- Horizontal centering
- Data structure integrity

## Node Structure

```
lane1 (Lane Node)
├── rect1 (Step 1)
├── rect2 (Step 2)
└── rect3 (Step 3)
```

## Related Documentation

- [Lane Node Documentation](../../dashboard/documentation/nodes/lane-node.md)
- [Dashboard Documentation](../../dashboard/readme.md)
- [Node System Implementation](../../dashboard/implementation-nodes.md)
