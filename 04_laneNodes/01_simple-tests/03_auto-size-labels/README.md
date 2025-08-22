# Lane Node - Auto-Size Labels Demo

## Overview

This demo showcases a Lane node with 3 auto-size rectangular child nodes that have labels of different lengths, including a toggle button to randomly change these labels, demonstrating dynamic sizing behavior.

## Features

- **Lane Container**: Single lane node containing auto-size child elements
- **Auto-Size Children**: 3 rectangular child nodes with dynamic sizing
- **Dynamic Labels**: Labels of varying lengths that trigger size adjustments
- **Toggle Functionality**: Button to randomly change node labels
- **Responsive Sizing**: Nodes automatically adjust width based on label content
- **Interactive Updates**: Real-time label changes with size recalculation

## Test Coverage

This demo includes automated tests that validate:
- Dashboard initialization
- Auto-size node rendering
- Dynamic label functionality
- Toggle button interaction
- Size adjustment behavior
- Label change responsiveness

## Node Structure

```
lane1 (Lane Node)
├── rect1 (Auto-size with dynamic label)
├── rect2 (Auto-size with dynamic label)
└── rect3 (Auto-size with dynamic label)
```

## Auto-Size Behavior

When auto-size is enabled:
- Node width adjusts automatically based on label length
- Minimum and maximum size constraints are respected
- Layout recalculates when labels change
- Proper spacing is maintained between nodes

## Interactive Features

- **Toggle Labels Button**: Randomly changes all child node labels
- **Dynamic Updates**: Immediate visual feedback when labels change
- **Size Recalculation**: Automatic layout adjustment after label changes

## Related Documentation

- [Lane Node Documentation](../../dashboard/documentation/nodes/lane-node.md)
- [Dashboard Documentation](../../dashboard/readme.md)
- [Node System Implementation](../../dashboard/implementation-nodes.md)
