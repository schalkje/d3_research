# Lane Node - Collapsed Mode Demo

## Overview

This demo showcases a Lane node in collapsed state, where the lane container is visible but child nodes are hidden, demonstrating the collapse/expand functionality of container nodes.

## Features

- **Lane Container**: Single lane node in collapsed state
- **Hidden Children**: 3 rectangular child nodes that are not visible
- **Collapse State**: Lane maintains its structure while hiding child content
- **Container Behavior**: Demonstrates container node collapse functionality
- **State Management**: Proper handling of collapsed state

## Test Coverage

This demo includes automated tests that validate:
- Dashboard initialization
- Lane node rendering in collapsed state
- Child node hiding functionality
- Collapse state management
- Data structure integrity with collapsed state

## Node Structure

```
lane1 (Lane Node - Collapsed)
├── rect1 (Step 1) [Hidden]
├── rect2 (Step 2) [Hidden]
└── rect3 (Step 3) [Hidden]
```

## Collapse Behavior

When a lane node is collapsed:
- The lane container remains visible
- Child nodes are hidden from view
- The lane maintains its position and size
- Child nodes are still part of the data structure but not rendered

## Related Documentation

- [Lane Node Documentation](../../dashboard/documentation/nodes/lane-node.md)
- [Dashboard Documentation](../../dashboard/readme.md)
- [Node System Implementation](../../dashboard/implementation-nodes.md)
