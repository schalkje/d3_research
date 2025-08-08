# Dashboard Node System Documentation

## Overview

The Dashboard Node System is a comprehensive, hierarchical architecture for creating interactive data visualizations. It provides a flexible framework for building complex node-based diagrams with support for various node types, layouts, and interactions.

## Architecture

The system is built on a foundation of inheritance-based node classes, each extending base functionality while providing specialized behavior. The architecture includes:

- **Base Classes**: Abstract foundations for all node types
- **Specialized Node Types**: Concrete implementations for specific use cases
- **Zone System**: Hierarchical layout management with automatic positioning
- **Event System**: Comprehensive interaction handling
- **Configuration Management**: Centralized settings and customization

## Node Type Hierarchy

```
BaseNode (Abstract)
├── BaseContainerNode (Abstract)
│   ├── LaneNode (Vertical Stacking)
│   ├── ColumnsNode (Horizontal Row)
│   ├── AdapterNode (Multi-arrangement)
│   ├── FoundationNode (Role-based)
│   ├── MartNode (Role-based)
│   ├── GroupNode (Dynamic)
│   └── EdgeDemoNode (Testing)
├── RectangularNode (Basic)
├── CircleNode (Basic)
└── EdgeDemoNode (Testing)
```

## Node Categories

### 🔷 Base Classes
- **[BaseNode](nodes/base-node.md)** - Abstract foundation for all nodes
- **[BaseContainerNode](nodes/base-container-node.md)** - Abstract container with child management

### 🔶 Basic Node Types
- **[RectangularNode](nodes/rectangular-node.md)** - Simple rectangular data nodes
- **[CircleNode](nodes/circle-node.md)** - Circular data nodes
- **[EdgeDemoNode](nodes/edge-demo-node.md)** - Testing and demonstration nodes

### 🔷 Container Node Types
- **[LaneNode](nodes/lane-node.md)** - Vertical stacking layout
- **[ColumnsNode](nodes/columns-node.md)** - Horizontal row layout
- **[GroupNode](nodes/group-node.md)** - Dynamic bounding box layout

### 🔶 Specialist Node Types
- **[AdapterNode](nodes/adapter-node.md)** - Multi-arrangement data adapter patterns
- **[FoundationNode](nodes/foundation-node.md)** - Data warehouse foundation components
- **[MartNode](nodes/mart-node.md)** - Data mart load/report components

## Zone System

The Zone System provides a hierarchical layout architecture that automatically manages positioning, sizing, and visual organization of node content.

### Zone Hierarchy
```
Container Zone (outermost)
├── Header Zone (top)
├── Margin Zones (surrounding)
│   ├── Top Margin (from header bottom)
│   ├── Right Margin
│   ├── Bottom Margin
│   └── Left Margin
└── Inner Container Zone (content area)
    └── Child Nodes (positioned here)
```

### Key Features
- **Automatic Positioning**: Children are positioned according to layout algorithms
- **Dynamic Sizing**: Container size adapts to content requirements
- **Margin Management**: Consistent spacing and visual separation
- **Coordinate Systems**: Each zone has its own coordinate system
- **Collapse/Expand**: Integrated support for hiding/showing content

## Layout Strategies

### Vertical Stacking (LaneNode)
- Children arranged in single vertical column
- Horizontal centering within container
- Configurable vertical spacing

### Horizontal Row (ColumnsNode)
- Children arranged in single horizontal row
- Vertical centering within container
- Configurable horizontal spacing

### Multi-arrangement (AdapterNode)
- 5 different layout arrangements
- Role-based component positioning
- Flexible arrangement modes

### Role-based (FoundationNode, MartNode)
- Predefined component roles
- Side-by-side horizontal arrangement
- Fixed component relationships

### Dynamic (GroupNode)
- Force-directed simulation
- Bounding box calculation
- Real-time position updates

## Configuration System

The system uses a centralized configuration management approach:

- **Default Settings**: Predefined values for common scenarios
- **Customization**: Per-node type configuration options
- **Inheritance**: Settings cascade from parent to child nodes
- **Validation**: Automatic validation of configuration values

## Event System

Comprehensive event handling for all node interactions:

- **Mouse Events**: Click, double-click, hover, drag
- **Keyboard Events**: Selection, navigation, shortcuts
- **Custom Events**: Status changes, layout updates
- **Event Delegation**: Efficient event handling for large datasets

## Performance Features

- **Lazy Loading**: Nodes initialized only when needed
- **Batch Updates**: Multiple changes processed efficiently
- **Caching**: Position and size calculations cached
- **Optimized Rendering**: Minimal DOM manipulation

## Getting Started

1. **Choose Node Type**: Select the appropriate node type for your use case
2. **Configure Layout**: Set up layout parameters and spacing
3. **Add Children**: Populate with child nodes as needed
4. **Customize Appearance**: Apply styling and visual customization
5. **Handle Events**: Implement interaction handlers

## Navigation

- **[Main Dashboard Documentation](../README.md)** - Back to main dashboard docs
- **[Implementation Details](../implementation.md)** - Technical implementation guide
- **[Zone System Details](zone-system.md)** - Detailed zone system documentation
- **[Node Type Details](nodes/)** - Individual node type documentation

---

## Quick Reference

| Node Type | Use Case | Layout | Children | Auto-Sizing |
|-----------|----------|--------|----------|-------------|
| **RectangularNode** | Basic data nodes | Fixed | No | Text-based |
| **CircleNode** | Basic data nodes | Fixed | No | Radius-based |
| **LaneNode** | Vertical organization | Vertical stack | Yes | Yes |
| **ColumnsNode** | Horizontal organization | Horizontal row | Yes | Yes |
| **AdapterNode** | Data adapter patterns | Multi-arrangement | Yes | Yes |
| **FoundationNode** | Data warehouse foundations | Role-based | Yes | Yes |
| **MartNode** | Data marts | Role-based | Yes | Yes |
| **GroupNode** | Dynamic grouping | Bounding box | Yes | Yes | 