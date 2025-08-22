# Lane Node - Fixed-Size Labels Demo

## Overview

This demo showcases a Lane node with 3 fixed-size rectangular child nodes that have labels of different lengths, including a toggle button to randomly change these labels, demonstrating consistent sizing behavior.

## Features

- **Lane Container**: Single lane node containing fixed-size child elements
- **Fixed-Size Children**: 3 rectangular child nodes with consistent dimensions
- **Dynamic Labels**: Labels of varying lengths that don't affect node size
- **Toggle Functionality**: Button to randomly change node labels
- **Consistent Sizing**: Nodes maintain fixed width regardless of label content
- **Label Truncation**: Long labels are truncated to fit within fixed bounds

## Test Coverage

This demo includes automated tests that validate:
- Dashboard initialization
- Fixed-size node rendering
- Dynamic label functionality
- Toggle button interaction
- Size consistency behavior
- Label truncation handling

## Node Structure

```
lane1 (Lane Node)
├── rect1 (Fixed-size with dynamic label)
├── rect2 (Fixed-size with dynamic label)
└── rect3 (Fixed-size with dynamic label)
```

## Fixed-Size Behavior

When fixed-size is enabled:
- Node width remains constant regardless of label length
- Long labels are truncated with ellipsis
- Layout spacing remains consistent
- No recalculation needed when labels change

## Interactive Features

- **Toggle Labels Button**: Randomly changes all child node labels
- **Dynamic Updates**: Immediate visual feedback when labels change
- **Size Consistency**: Nodes maintain their dimensions during label changes

## Related Documentation

- [Lane Node Documentation](../../dashboard/documentation/nodes/lane-node.md)
- [Dashboard Documentation](../../dashboard/readme.md)
- [Node System Implementation](../../dashboard/implementation-nodes.md)
