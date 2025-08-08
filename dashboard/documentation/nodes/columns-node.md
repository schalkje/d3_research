# ColumnsNode

## Overview

`ColumnsNode` is a container node type that arranges child nodes in a horizontal row with vertical centering. It's designed for organizing content in a single row layout, making it ideal for parallel processes, side-by-side comparisons, and horizontal organization of related elements.

## Inheritance

- **Parent**: [BaseContainerNode](base-container-node.md)
- **Children**: Any node type can be contained

## Key Features

### Layout Strategy
- **Horizontal Row**: Children arranged in single horizontal row
- **Vertical Centering**: Each child centered within container height
- **Automatic Spacing**: Configurable horizontal spacing between children
- **Dynamic Sizing**: Container width adapts to child content

### Container Behavior
- **Zone System**: Fully integrated with zone system for layout management
- **Collapse/Expand**: Support for hiding/showing child content
- **Margin Management**: Automatic margin application around content
- **Child Lifecycle**: Complete child management and positioning

## Properties

### Columns-Specific Properties
```javascript
// Layout configuration
this.nodeSpacing = {            // Spacing between child nodes
  horizontal: 20,               // Horizontal spacing between children
  vertical: 10                  // Vertical spacing (not used in columns)
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

// Layout constraints
this.data.layout = {
  minimumColumnWidth: 0,        // Minimum width for individual columns
  minimumSize: {                // Minimum container size
    height: 50,
    useRootRatio: false
  }
};
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
Initializes the columns node with horizontal row configuration.

**Parameters:**
- `nodeData` - Node configuration object
- `parentElement` - Parent SVG container
- `createNode` - Node factory function for creating children
- `settings` - Global settings object
- `parentNode` - Parent node instance (optional)

**Initialization Steps:**
- Sets up horizontal row layout configuration
- Initializes child management arrays
- Configures spacing and margin settings
- Sets up layout constraints
- Calls parent constructor

#### `initChildren()`
Initializes all child nodes and positions them in horizontal row.

**Process:**
- Creates child nodes using factory function
- Adds children to child nodes array
- Initializes each child node
- Positions children in horizontal row
- Integrates with zone system

### Layout Methods

#### `updateChildren()`
Updates child positioning and container sizing using horizontal row algorithm.

**Layout Algorithm:**
```javascript
// Calculate available space
const availableHeight = this.data.height - this.containerMargin.top - this.containerMargin.bottom;
const spacing = this.nodeSpacing.horizontal;
let currentX = 0;

// Position each child
this.childNodes.forEach(childNode => {
  // Center child vertically
  const x = currentX;
  const y = (availableHeight - childNode.data.height) / 2;
  
  // Move child to calculated position
  childNode.move(x, y);
  
  // Update X position for next child
  currentX += childNode.data.width + spacing;
});

// Update container width
const totalWidth = currentX - spacing + this.containerMargin.left + this.containerMargin.right;
this.resize({ width: totalWidth });
```

#### `calculateLayout()`
Calculates the optimal layout for all child nodes.

**Process:**
- Determines available height (container height minus margins)
- Calculates horizontal positions for each child
- Centers each child vertically within available height
- Calculates required container width
- Updates child positions and container size

### Child Management

#### `addChild(childNode)`
Adds a child node to the columns and updates layout.

**Process:**
- Adds child to child nodes array
- Sets up parent-child relationship
- Recalculates horizontal row layout
- Updates container size
- Integrates with zone system

#### `removeChild(childNode)`
Removes a child node from the columns and updates layout.

**Process:**
- Removes child from child nodes array
- Cleans up parent-child relationship
- Recalculates horizontal row layout
- Updates container size
- Removes from zone system

## Configuration

### Columns Node Settings
```javascript
const columnsSettings = {
  // Layout configuration
  layout: {
    type: "horizontal-row",     // Layout type identifier
    spacing: {
      horizontal: 20,           // Horizontal spacing between children
      vertical: 10              // Vertical spacing (not used)
    },
    alignment: "center",        // Vertical alignment of children
    minimumColumnWidth: 0,      // Minimum width for individual columns
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
    maintainOrder: true,        // Maintain child order
    minimumWidth: 0             // Minimum child width
  }
};
```

### Node Data Structure
```javascript
const columnsNodeData = {
  id: "columns-1",              // Required unique identifier
  type: "columns",              // Node type identifier
  label: "Parallel Processes",  // Display text
  x: 100,                       // X coordinate
  y: 200,                       // Y coordinate
  width: 0,                     // Width (auto-calculated)
  height: 100,                  // Container height
  state: "active",              // Status
  layout: {                     // Layout configuration
    type: "horizontal-row",
    spacing: { horizontal: 20 },
    minimumColumnWidth: 0
  },
  children: [                   // Child node definitions
    { id: "child-1", type: "rect", label: "Process A" },
    { id: "child-2", type: "rect", label: "Process B" },
    { id: "child-3", type: "rect", label: "Process C" }
  ]
};
```

## Layout Algorithm Details

### Horizontal Row Algorithm
The columns node uses a sophisticated horizontal row algorithm:

1. **Space Calculation**:
   - Available height = container height - top margin - bottom margin
   - Starting X position = left margin

2. **Child Positioning**:
   - Each child is centered vertically within available height
   - Horizontal position = previous child right + spacing
   - Y position = (available height - child height) / 2

3. **Container Sizing**:
   - Container width = last child right + right margin
   - Container height remains fixed (configurable)

4. **Spacing Management**:
   - Horizontal spacing applied between each pair of children
   - No spacing before first child
   - No spacing after last child

### Vertical Centering
Each child is automatically centered within the container:
```javascript
const y = (availableHeight - childNode.data.height) / 2;
```

This ensures:
- **Visual Balance**: Children appear centered regardless of their individual heights
- **Consistent Layout**: Uniform appearance across different child sizes
- **Responsive Design**: Layout adapts to container height changes

## Zone System Integration

### Zone Hierarchy
```
Container Zone (outermost)
├── Header Zone (top)
│   ├── Title: "Parallel Processes"
│   └── Zoom/collapse button
├── Margin Zones (surrounding)
│   ├── Top Margin (4px from header)
│   ├── Right Margin (8px)
│   ├── Bottom Margin (8px)
│   └── Left Margin (8px)
└── Inner Container Zone (content area)
    └── Child Nodes (horizontally arranged)
```

### Zone Management
- **Header Zone**: Displays columns title and collapse/expand controls
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
- **Parallel Processes**: Side-by-side process execution
- **Data Comparisons**: Comparing multiple data sources
- **Component Layouts**: Horizontal component arrangements
- **Dashboard Widgets**: Horizontal widget layouts

### Typical Scenarios
- **Data Processing**: Parallel ETL processes
- **System Monitoring**: Multiple system components
- **Data Analysis**: Side-by-side data comparisons
- **User Interfaces**: Horizontal control layouts

## Integration

### Parent Container Integration
Columns nodes work well within other container nodes:
- **GroupNode**: Multiple columns for different categories
- **LaneNode**: Columns arranged vertically
- **AdapterNode**: As component elements
- **FoundationNode**: As foundation components

### Child Node Integration
Columns nodes can contain any node type:
- **RectangularNode**: Most common child type
- **CircleNode**: Alternative child representation
- **Container Nodes**: Nested container structures
- **Custom Nodes**: Any custom node implementation

## Comparison with LaneNode

### Layout Differences
- **Orientation**: Horizontal row vs. Vertical stack
- **Centering**: Vertical centering vs. Horizontal centering
- **Sizing**: Width adapts vs. Height adapts
- **Spacing**: Horizontal spacing vs. Vertical spacing

### Use Case Differences
- **ColumnsNode**: Better for parallel, side-by-side content
- **LaneNode**: Better for sequential, top-to-bottom content
- **ColumnsNode**: More suitable for comparisons
- **LaneNode**: More suitable for processes

## Error Handling

### Layout Errors
- **Overflow Handling**: Children that exceed container height
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
- **Layout Tests**: Horizontal row algorithm validation
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
- **[LaneNode](lane-node.md)** - Alternative vertical layout
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
- **LaneNode** - Vertical alternative
- **GroupNode** - Dynamic positioning
- **AdapterNode** - Multi-arrangement
- **FoundationNode** - Role-based layout 