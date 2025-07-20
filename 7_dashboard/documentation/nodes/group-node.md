# GroupNode

## Overview

`GroupNode` is a specialized container node type that provides dynamic positioning and bounding box layout for child nodes. It's designed for flexible grouping of related elements with support for force-directed simulation and dynamic sizing based on child content.

## Inheritance

- **Parent**: [BaseContainerNode](base-container-node.md)
- **Children**: Any node type can be contained

## Key Features

### Dynamic Layout
- **Bounding Box**: Container size calculated from child positions and sizes
- **Force-Directed Simulation**: Optional force simulation for child positioning
- **Dynamic Sizing**: Container adapts to child content automatically
- **Flexible Positioning**: Children can be positioned freely within container

### Group-Specific Behavior
- **Child Management**: Manual child addition and removal
- **Simulation Integration**: Force-directed layout simulation
- **Bounding Box Calculation**: Automatic container sizing
- **Collapse/Expand**: Integrated support for hiding/showing children

## Properties

### Group-Specific Properties
```javascript
// Simulation configuration
this.simulation = null;         // Force simulation instance

// Layout configuration
this.boundingBox = {            // Calculated bounding box
  x: 0,
  y: 0,
  width: 0,
  height: 0
};

// Child management
this.childNodes = [];           // Array of child node instances
this.createNode = createNode;   // Node factory function

// Layout settings
this.containerMargin = {        // Margins around container content
  top: 4,
  right: 8,
  bottom: 8,
  left: 8
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
Initializes the group node with dynamic layout configuration.

**Parameters:**
- `nodeData` - Node configuration object
- `parentElement` - Parent SVG container
- `createNode` - Node factory function for creating children
- `settings` - Global settings object
- `parentNode` - Parent node instance (optional)

**Initialization Steps:**
- Sets up group-specific configuration
- Initializes child management arrays
- Configures simulation settings
- Sets up margin and layout settings
- Calls parent constructor

#### `initChildren()`
Initializes all child nodes and sets up dynamic positioning.

**Process:**
- Creates child nodes using factory function
- Adds children to child nodes array
- Initializes each child node
- Sets up dynamic positioning
- Integrates with zone system

### Layout Methods

#### `updateChildren()`
Updates child positioning and container sizing using bounding box calculation.

**Layout Algorithm:**
```javascript
// Calculate bounding box from all children
const boundingBox = this.calculateBoundingBox();

// Update container size to fit bounding box
const containerWidth = boundingBox.width + this.containerMargin.left + this.containerMargin.right;
const containerHeight = boundingBox.height + this.containerMargin.top + this.containerMargin.bottom;

this.resize({ width: containerWidth, height: containerHeight });

// Update child positions relative to new container center
this.childNodes.forEach(childNode => {
  const relativeX = childNode.x - boundingBox.x;
  const relativeY = childNode.y - boundingBox.y;
  childNode.move(relativeX, relativeY);
});
```

#### `calculateBoundingBox()`
Calculates the bounding box that encompasses all child nodes.

**Process:**
- Finds minimum and maximum x, y coordinates of all children
- Calculates width and height from coordinate extremes
- Returns bounding box with x, y, width, height properties

#### `updateLayout()`
Updates the group layout after changes to children or container.

**Process:**
- Recalculates bounding box from child positions
- Updates container size to accommodate children
- Repositions children relative to new container center
- Triggers visual updates

### Simulation Methods

#### `initSimulation()`
Initializes force-directed simulation for child positioning.

**Features:**
- Force simulation for automatic child positioning
- Collision detection between children
- Boundary forces to keep children within container
- Real-time position updates

#### `updateSimulation()`
Updates simulation forces and positions.

**Process:**
- Updates force parameters based on container size
- Applies forces to child nodes
- Updates child positions based on simulation
- Triggers layout updates

### Child Management

#### `addChild(childNode)`
Adds a child node to the group and updates layout.

**Process:**
- Adds child to child nodes array
- Sets up parent-child relationship
- Recalculates bounding box layout
- Updates container size
- Integrates with zone system

#### `removeChild(childNode)`
Removes a child node from the group and updates layout.

**Process:**
- Removes child from child nodes array
- Cleans up parent-child relationship
- Recalculates bounding box layout
- Updates container size
- Removes from zone system

## Configuration

### Group Node Settings
```javascript
const groupSettings = {
  // Layout configuration
  layout: {
    type: "group",              // Layout type identifier
    boundingBox: {
      padding: 10,              // Padding around bounding box
      includeMargins: true      // Include margins in bounding box
    },
    simulation: {
      enabled: false,           // Enable force simulation
      forces: {
        collision: true,        // Collision detection
        boundary: true,         // Boundary forces
        center: false           // Center attraction
      }
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
    maintainOrder: false        // Don't maintain child order
  }
};
```

### Node Data Structure
```javascript
const groupNodeData = {
  id: "group-1",                // Required unique identifier
  type: "group",                // Node type identifier
  label: "Process Group",       // Display text
  x: 100,                       // X coordinate
  y: 200,                       // Y coordinate
  width: 0,                     // Width (auto-calculated)
  height: 0,                    // Height (auto-calculated)
  state: "active",              // Status
  layout: {                     // Layout configuration
    type: "group",
    boundingBox: { padding: 10 }
  },
  children: [                   // Child node definitions
    { id: "child-1", type: "rect", label: "Process A", x: 10, y: 10 },
    { id: "child-2", type: "rect", label: "Process B", x: 120, y: 10 },
    { id: "child-3", type: "rect", label: "Process C", x: 10, y: 80 }
  ]
};
```

## Bounding Box Algorithm

### Bounding Box Calculation
The group node uses a sophisticated bounding box algorithm:

1. **Child Position Analysis**:
   - Finds minimum x, y coordinates of all children
   - Finds maximum x, y coordinates of all children
   - Calculates width and height from coordinate extremes

2. **Container Sizing**:
   - Container width = bounding box width + left margin + right margin
   - Container height = bounding box height + top margin + bottom margin

3. **Child Repositioning**:
   - Children repositioned relative to new container center
   - Original child-to-child relationships preserved
   - Relative positions maintained

### Dynamic Updates
- **Child Addition**: Bounding box recalculated when children added
- **Child Removal**: Bounding box recalculated when children removed
- **Child Movement**: Bounding box recalculated when child positions change
- **Container Resize**: Children repositioned when container size changes

## Zone System Integration

### Zone Hierarchy
```
Container Zone (outermost)
├── Header Zone (top)
│   ├── Title: "Process Group"
│   └── Zoom/collapse button
├── Margin Zones (surrounding)
│   ├── Top Margin (4px from header)
│   ├── Right Margin (8px)
│   ├── Bottom Margin (8px)
│   └── Left Margin (8px)
└── Inner Container Zone (content area)
    └── Child Nodes (dynamically positioned)
```

### Zone Management
- **Header Zone**: Displays group title and controls
- **Inner Container Zone**: Manages child positioning
- **Margin Zones**: Provide consistent spacing
- **Coordinate System**: Children positioned relative to inner container

## Performance Considerations

### Layout Optimization
- **Bounding Box Caching**: Bounding box calculations cached when possible
- **Incremental Updates**: Only changed children trigger recalculation
- **Batch Operations**: Multiple child changes processed together
- **Efficient Algorithms**: Optimized bounding box calculations

### Simulation Optimization
- **Lazy Simulation**: Simulation only active when needed
- **Force Optimization**: Efficient force calculations
- **Position Caching**: Child positions cached during simulation
- **Render Batching**: Visual updates batched for performance

### Memory Management
- **Child Cleanup**: Proper cleanup when children are removed
- **Simulation Cleanup**: Simulation properly destroyed
- **Reference Management**: Avoiding circular references
- **Zone Cleanup**: Zone system properly destroyed

## Use Cases

### Common Applications
- **Process Groups**: Grouping related processes
- **System Components**: Grouping system elements
- **Data Clusters**: Grouping related data elements
- **Workflow Groups**: Grouping workflow steps

### Typical Scenarios
- **Process Orchestration**: Grouping related processes
- **System Architecture**: Grouping system components
- **Data Analysis**: Grouping related data elements
- **Project Management**: Grouping project tasks

## Integration

### Parent Container Integration
Group nodes work well within other container nodes:
- **LaneNode**: Groups arranged vertically in process flows
- **ColumnsNode**: Groups arranged horizontally for comparison
- **AdapterNode**: As adapter components
- **FoundationNode**: As foundation components

### Child Node Integration
Group nodes can contain any node type:
- **RectangularNode**: Most common child type
- **CircleNode**: Alternative child representation
- **Container Nodes**: Nested container structures
- **Custom Nodes**: Any custom node implementation

## Comparison with Other Containers

### Layout Differences
- **GroupNode**: Dynamic bounding box vs. Fixed layout algorithms
- **LaneNode**: Free positioning vs. Vertical stacking
- **ColumnsNode**: Dynamic sizing vs. Horizontal row
- **AdapterNode**: Manual children vs. Auto-created components

### Use Case Differences
- **GroupNode**: Better for flexible, dynamic grouping
- **LaneNode**: Better for sequential, structured layouts
- **ColumnsNode**: Better for parallel, structured layouts
- **AdapterNode**: Better for predefined component patterns

## Error Handling

### Layout Errors
- **Bounding Box Calculation**: Invalid coordinate handling
- **Child Validation**: Invalid child node handling
- **Simulation Errors**: Force simulation error recovery
- **Position Errors**: Fallback positioning for layout failures

### Recovery Mechanisms
- **Fallback Layout**: Default layout when bounding box fails
- **Child Recovery**: Child recreation on failure
- **Simulation Recovery**: Simulation restart on failure
- **Position Recovery**: Position restoration on error

## Testing

### Unit Testing
- **Constructor Tests**: Proper initialization with various configurations
- **Bounding Box Tests**: Bounding box calculation validations
- **Child Management Tests**: Adding and removing children
- **Simulation Tests**: Force simulation functionality

### Integration Testing
- **Parent-Child Relationships**: Container-child interactions
- **Zone System**: Zone management and positioning
- **Simulation Integration**: Force simulation with layout
- **Performance**: Large numbers of children

## Navigation

- **[Documentation Overview](../README.md)** - Back to main documentation
- **[BaseContainerNode](base-container-node.md)** - Parent class documentation
- **[LaneNode](lane-node.md)** - Alternative structured layout
- **[ColumnsNode](columns-node.md)** - Alternative structured layout
- **[RectangularNode](rectangular-node.md)** - Common child node type
- **[Implementation Details](../../implementation.md)** - Technical implementation

## Related Classes

### Dependencies
- **BaseContainerNode** - Container functionality
- **ZoneManager** - Zone system management
- **Simulation** - Force simulation management
- **ConfigManager** - Configuration management

### Common Children
- **RectangularNode** - Most common child type
- **CircleNode** - Alternative child type
- **Container Nodes** - Nested containers
- **Custom Nodes** - Specialized implementations

### Related Containers
- **LaneNode** - Vertical structured alternative
- **ColumnsNode** - Horizontal structured alternative
- **AdapterNode** - Component-based alternative
- **FoundationNode** - Role-based alternative 