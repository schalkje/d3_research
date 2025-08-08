# LaneNode

## Overview

`LaneNode` is a container node type that arranges child nodes in a vertical stack with horizontal centering. It's designed for organizing content in a single column layout, making it ideal for hierarchical data representation, process flows, and vertical organization of related elements.

## Inheritance

- **Parent**: [BaseContainerNode](base-container-node.md)
- **Children**: Any node type can be contained

## Key Features

### Layout Strategy
- **Vertical Stacking**: Children arranged in single vertical column
- **Horizontal Centering**: Each child centered within container width
- **Automatic Spacing**: Configurable vertical spacing between children
- **Dynamic Sizing**: Container height adapts to child content

### Container Behavior
- **Zone System**: Fully integrated with zone system for layout management
- **Collapse/Expand**: Support for hiding/showing child content
- **Margin Management**: Automatic margin application around content
- **Child Lifecycle**: Complete child management and positioning

## Properties

### Lane-Specific Properties
```javascript
// Layout configuration
this.nodeSpacing = {            // Spacing between child nodes
  horizontal: 20,               // Horizontal spacing (not used in lane)
  vertical: 10                  // Vertical spacing between children
};

// Container margins
this.containerMargin = {        // Margins around container content
  top: 4,                       // Space from header bottom
  right: 8,                     // Space from right edge
  bottom: 8,                    // Space from bottom edge
  left: 8                       // Space from left edge
};

// Child management
this.childNodes = [];           // Array of child node instances
this.createNode = createNode;   // Node factory function
```

### Inherited Properties
All properties from [BaseContainerNode](base-container-node.md) are inherited, including:
- Container identification and state
- Zone system management
- Event handling and configuration
- DOM element references

## Methods

### Core Methods

#### `constructor(nodeData, parentElement, createNode, settings, parentNode = null)`
Initializes the lane node with vertical stacking configuration.

**Parameters:**
- `nodeData` - Node configuration object
- `parentElement` - Parent SVG container
- `createNode` - Node factory function for creating children
- `settings` - Global settings object
- `parentNode` - Parent node instance (optional)

**Initialization Steps:**
- Sets up vertical stacking layout configuration
- Initializes child management arrays
- Configures spacing and margin settings
- Calls parent constructor

#### `initChildren()`
Initializes all child nodes and positions them in vertical stack.

**Process:**
- Creates child nodes using factory function
- Adds children to child nodes array
- Initializes each child node
- Positions children in vertical stack
- Integrates with zone system

### Layout Methods

#### `updateChildren()`
Updates child positioning and container sizing using vertical stacking algorithm.

**Layout Algorithm:**
```javascript
// Calculate available space
const availableWidth = this.data.width - this.containerMargin.left - this.containerMargin.right;
const spacing = this.nodeSpacing.vertical;
let currentY = 0;

// Position each child
this.childNodes.forEach(childNode => {
  // Center child horizontally
  const x = (availableWidth - childNode.data.width) / 2;
  const y = currentY;
  
  // Move child to calculated position
  childNode.move(x, y);
  
  // Update Y position for next child
  currentY += childNode.data.height + spacing;
});

// Update container height
const totalHeight = currentY - spacing + this.containerMargin.top + this.containerMargin.bottom;
this.resize({ height: totalHeight });
```

#### `calculateLayout()`
Calculates the optimal layout for all child nodes.

**Process:**
- Determines available width (container width minus margins)
- Calculates vertical positions for each child
- Centers each child horizontally within available width
- Calculates required container height
- Updates child positions and container size

### Child Management

#### `addChild(childNode)`
Adds a child node to the lane and updates layout.

**Process:**
- Adds child to child nodes array
- Sets up parent-child relationship
- Recalculates vertical stack layout
- Updates container size
- Integrates with zone system

#### `removeChild(childNode)`
Removes a child node from the lane and updates layout.

**Process:**
- Removes child from child nodes array
- Cleans up parent-child relationship
- Recalculates vertical stack layout
- Updates container size
- Removes from zone system

## Configuration

### Lane Node Settings
```javascript
const laneSettings = {
  // Layout configuration
  layout: {
    type: "vertical-stack",     // Layout type identifier
    spacing: {
      vertical: 10,             // Vertical spacing between children
      horizontal: 20            // Horizontal spacing (not used)
    },
    alignment: "center",        // Horizontal alignment of children
    minimumSize: {              // Minimum container size
      width: 0,
      height: 50,
      useRootRatio: false
    }
  },
  
  // Container configuration
  containerMargin: {
    top: 4,                     // Space from header bottom
    right: 8,                   // Space from right edge
    bottom: 8,                  // Space from bottom edge
    left: 8                     // Space from left edge
  },
  
  // Child configuration
  childConstraints: {
    allowOverlap: false,        // Prevent child overlap
    respectBounds: true,        // Keep children within bounds
    maintainOrder: true         // Maintain child order
  }
};
```

### Node Data Structure
```javascript
const laneNodeData = {
  id: "lane-1",                 // Required unique identifier
  type: "lane",                 // Node type identifier
  label: "Process Lane",        // Display text
  x: 100,                       // X coordinate
  y: 200,                       // Y coordinate
  width: 200,                   // Container width
  height: 0,                    // Height (auto-calculated)
  state: "active",              // Status
  layout: {                     // Layout configuration
    type: "vertical-stack",
    spacing: { vertical: 10 }
  },
  children: [                   // Child node definitions
    { id: "child-1", type: "rect", label: "Step 1" },
    { id: "child-2", type: "rect", label: "Step 2" },
    { id: "child-3", type: "rect", label: "Step 3" }
  ]
};
```

## Layout Algorithm Details

### Vertical Stacking Algorithm
The lane node uses a sophisticated vertical stacking algorithm:

1. **Space Calculation**:
   - Available width = container width - left margin - right margin
   - Starting Y position = top margin

2. **Child Positioning**:
   - Each child is centered horizontally within available width
   - Vertical position = previous child bottom + spacing
   - X position = (available width - child width) / 2

3. **Container Sizing**:
   - Container height = last child bottom + bottom margin
   - Container width remains fixed (configurable)

4. **Spacing Management**:
   - Vertical spacing applied between each pair of children
   - No spacing before first child
   - No spacing after last child

### Horizontal Centering
Each child is automatically centered within the container:
```javascript
const x = (availableWidth - childNode.data.width) / 2;
```

This ensures:
- **Visual Balance**: Children appear centered regardless of their individual widths
- **Consistent Layout**: Uniform appearance across different child sizes
- **Responsive Design**: Layout adapts to container width changes

## Zone System Integration

### Zone Hierarchy
```
Container Zone (outermost)
├── Header Zone (top)
│   ├── Title: "Process Lane"
│   └── Zoom/collapse button
├── Margin Zones (surrounding)
│   ├── Top Margin (4px from header)
│   ├── Right Margin (8px)
│   ├── Bottom Margin (8px)
│   └── Left Margin (8px)
└── Inner Container Zone (content area)
    └── Child Nodes (vertically stacked)
```

### Zone Management
- **Header Zone**: Displays lane title and collapse/expand controls
- **Inner Container Zone**: Manages child positioning and layout
- **Margin Zones**: Provide consistent spacing around content
- **Coordinate System**: Children positioned relative to inner container

## Performance Considerations

### Layout Optimization
- **Incremental Updates**: Only changed children are repositioned
- **Batch Operations**: Multiple child changes processed together
- **Position Caching**: Child positions cached to avoid recalculation
- **Efficient Algorithms**: Optimized positioning calculations

### Memory Management
- **Child Cleanup**: Proper cleanup when children are removed
- **Event Delegation**: Efficient event handling for child interactions
- **Reference Management**: Avoiding circular references
- **Zone Cleanup**: Zone system properly destroyed

## Use Cases

### Common Applications
- **Process Flows**: Sequential process steps
- **Data Pipelines**: Data transformation stages
- **Workflow Diagrams**: Task sequences
- **Hierarchical Data**: Tree-like data structures

### Typical Scenarios
- **Data Processing**: ETL pipeline stages
- **Business Processes**: Process flow steps
- **System Architecture**: Component hierarchies
- **Project Management**: Task sequences

## Integration

### Parent Container Integration
Lane nodes work well within other container nodes:
- **GroupNode**: Multiple lanes for different categories
- **ColumnsNode**: Lanes arranged horizontally
- **AdapterNode**: As component elements
- **FoundationNode**: As foundation components

### Child Node Integration
Lane nodes can contain any node type:
- **RectangularNode**: Most common child type
- **CircleNode**: Alternative child representation
- **Container Nodes**: Nested container structures
- **Custom Nodes**: Any custom node implementation

## Error Handling

### Layout Errors
- **Overflow Handling**: Children that exceed container width
- **Size Constraints**: Minimum size enforcement
- **Child Validation**: Invalid child node handling
- **Position Errors**: Fallback positioning for layout failures

### Recovery Mechanisms
- **Graceful Degradation**: Fallback to simple layout
- **Constraint Resolution**: Automatic constraint handling
- **Error Logging**: Comprehensive error reporting
- **State Recovery**: Automatic state restoration

## Testing

### Unit Testing
- **Constructor Tests**: Proper initialization with various configurations
- **Layout Tests**: Vertical stacking algorithm validation
- **Child Management Tests**: Adding and removing children
- **Size Calculation Tests**: Container sizing calculations

### Integration Testing
- **Parent-Child Relationships**: Container-child interactions
- **Zone System**: Zone management and positioning
- **Event Propagation**: Events flowing through hierarchy
- **Performance**: Large numbers of children

## Navigation

- **[Documentation Overview](../README.md)** - Back to main documentation
- **[BaseContainerNode](base-container-node.md)** - Parent class documentation
- **[ColumnsNode](columns-node.md)** - Alternative horizontal layout
- **[GroupNode](group-node.md)** - Dynamic layout alternative
- **[RectangularNode](rectangular-node.md)** - Common child node type
- **[Implementation Details](../../implementation.md)** - Technical implementation

## Related Classes

### Dependencies
- **BaseContainerNode** - Container functionality
- **ZoneManager** - Zone system management
- **LayoutManager** - Layout algorithm management
- **ConfigManager** - Configuration management

### Common Children
- **RectangularNode** - Most common child type
- **CircleNode** - Alternative child type
- **Container Nodes** - Nested containers
- **Custom Nodes** - Specialized implementations

### Related Containers
- **ColumnsNode** - Horizontal alternative
- **GroupNode** - Dynamic positioning
- **AdapterNode** - Multi-arrangement
- **FoundationNode** - Role-based layout 