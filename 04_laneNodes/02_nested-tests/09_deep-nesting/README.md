# Lane Node - Deep Nesting Demo

## Overview

This demo showcases a Lane node with deep nested structure spanning 3 levels of hierarchy, demonstrating complex hierarchical layout management and deep container relationships.

## Features

- **Level 1 Lane**: Top-level main process lane
- **Level 2 Lanes**: Intermediate sub-process lanes
- **Level 3 Lanes**: Deep detail process lanes
- **Child Elements**: Rectangular elements at the deepest level
- **Deep Hierarchy**: 3-level nested structure
- **Hierarchical Layout**: Proper nesting and layout management across all levels

## Test Coverage

This demo includes automated tests that validate:
- Dashboard initialization
- Deep nested lane structure rendering
- Multi-level hierarchy management
- Layout consistency across deep nesting levels
- Child element positioning within deep nested containers
- Data structure integrity with complex deep hierarchy

## Node Structure

```
level1Lane (Level 1 - Main Process)
├── level2Lane1 (Level 2 - Sub Process A)
│   ├── level3Lane1 (Level 3 - Detail Process A1)
│   │   ├── rectA1_1 (Detail Step A1.1)
│   │   └── rectA1_2 (Detail Step A1.2)
│   └── level3Lane2 (Level 3 - Detail Process A2)
│       └── rectA2_1 (Detail Step A2.1)
└── level2Lane2 (Level 2 - Sub Process B)
    └── level3Lane3 (Level 3 - Detail Process B1)
        ├── rectB1_1 (Detail Step B1.1)
        └── rectB1_2 (Detail Step B1.2)
```

## Deep Nesting Behavior

When lanes are deeply nested:
- Each level maintains its own vertical stacking behavior
- Child elements are centered horizontally within their parent lane
- Proper spacing is maintained between all elements at each level
- The hierarchy is visually clear with appropriate indentation
- Layout calculations respect the deep nested structure

## Deep Hierarchy Management

The deep nested structure demonstrates:
- **Multi-Level Containment**: Proper parent-child relationships across 3 levels
- **Layout Inheritance**: Child lanes inherit layout properties from all parent levels
- **Spacing Consistency**: Uniform spacing across all nesting levels
- **Visual Hierarchy**: Clear visual distinction between all levels
- **Performance Optimization**: Efficient handling of deep nested structures

## Related Documentation

- [Lane Node Documentation](../../dashboard/documentation/nodes/lane-node.md)
- [Dashboard Documentation](../../dashboard/readme.md)
- [Node System Implementation](../../dashboard/implementation-nodes.md)
