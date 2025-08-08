# Lane Node - Nested Lanes Demo

## Overview

This demo showcases a Lane node with nested lane structure, demonstrating complex hierarchical layout with multiple levels of container nodes and their child elements.

## Features

- **Main Lane Container**: Single top-level lane node containing sub-lanes
- **Nested Sub-Lanes**: 2 sub-lane nodes, each with their own child elements
- **Child Elements**: 3 rectangular child nodes within each sub-lane
- **Hierarchical Layout**: Proper nesting and layout management
- **Vertical Stacking**: All lanes maintain vertical stacking behavior
- **Horizontal Centering**: Child elements centered within their respective lanes

## Test Coverage

This demo includes automated tests that validate:
- Dashboard initialization
- Nested lane structure rendering
- Hierarchy management
- Layout consistency across nesting levels
- Child element positioning within nested containers
- Data structure integrity with complex hierarchy

## Node Structure

```
mainLane (Main Process Lane)
├── subLane1 (Sub Process 1)
│   ├── rect1_1 (Step 1.1)
│   ├── rect1_2 (Step 1.2)
│   └── rect1_3 (Step 1.3)
└── subLane2 (Sub Process 2)
    ├── rect2_1 (Step 2.1)
    ├── rect2_2 (Step 2.2)
    └── rect2_3 (Step 2.3)
```

## Nested Lane Behavior

When lanes are nested:
- Each lane maintains its own vertical stacking behavior
- Child elements are centered horizontally within their parent lane
- Proper spacing is maintained between all elements
- The hierarchy is visually clear and well-structured
- Layout calculations respect the nested structure

## Hierarchy Management

The nested structure demonstrates:
- **Container Relationships**: Proper parent-child relationships
- **Layout Inheritance**: Child lanes inherit layout properties
- **Spacing Consistency**: Uniform spacing across all levels
- **Visual Hierarchy**: Clear visual distinction between levels

## Related Documentation

- [Lane Node Documentation](../../dashboard/documentation/nodes/lane-node.md)
- [Dashboard Documentation](../../dashboard/readme.md)
- [Node System Implementation](../../dashboard/implementation-nodes.md)
