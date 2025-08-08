# Lane Node - Nested Collapsed Lanes Demo

## Overview

This demo showcases a Lane node with nested lane structure where one sub-lane is collapsed, demonstrating complex hierarchical layout with mixed expanded and collapsed states.

## Features

- **Main Lane Container**: Single top-level lane node containing sub-lanes
- **Expanded Sub-Lane**: One sub-lane with visible child elements
- **Collapsed Sub-Lane**: One sub-lane with hidden child elements
- **Mixed State Management**: Proper handling of expanded and collapsed states
- **Hierarchical Layout**: Proper nesting and layout management
- **State Persistence**: Collapsed state maintained across layout updates

## Test Coverage

This demo includes automated tests that validate:
- Dashboard initialization
- Nested lane structure rendering with mixed states
- Collapsed state management in nested hierarchy
- Layout consistency with mixed expanded/collapsed states
- Child element visibility management
- Data structure integrity with complex state management

## Node Structure

```
mainLane (Main Process Lane)
├── subLane1 (Sub Process 1 - Expanded)
│   ├── rect1_1 (Step 1.1) [Visible]
│   ├── rect1_2 (Step 1.2) [Visible]
│   └── rect1_3 (Step 1.3) [Visible]
└── subLane2 (Sub Process 2 - Collapsed)
    ├── rect2_1 (Step 2.1) [Hidden]
    ├── rect2_2 (Step 2.2) [Hidden]
    └── rect2_3 (Step 2.3) [Hidden]
```

## Mixed State Behavior

When lanes have mixed expanded/collapsed states:
- **Expanded Sub-Lane**: Shows all child elements with proper layout
- **Collapsed Sub-Lane**: Hides child elements but maintains structure
- **Layout Consistency**: Proper spacing and alignment maintained
- **State Independence**: Each sub-lane maintains its own state
- **Visual Hierarchy**: Clear distinction between expanded and collapsed states

## State Management

The nested structure with mixed states demonstrates:
- **Independent State Control**: Each sub-lane can have different states
- **Child Visibility**: Proper hiding/showing of child elements
- **Layout Adaptation**: Layout adjusts to accommodate mixed states
- **State Persistence**: States maintained during layout updates
- **Visual Feedback**: Clear visual indication of collapsed state

## Related Documentation

- [Lane Node Documentation](../../dashboard/documentation/nodes/lane-node.md)
- [Dashboard Documentation](../../dashboard/readme.md)
- [Node System Implementation](../../dashboard/implementation-nodes.md)
