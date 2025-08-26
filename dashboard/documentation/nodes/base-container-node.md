# BaseContainerNode

## Overview

`BaseContainerNode` is the abstract base class for all container node types that can contain and manage child nodes. It extends `BaseNode` with container-specific functionality including child management, layout algorithms, and the zone system integration.

## Inheritance

- **Parent**: [BaseNode](base-node.md)
- **Children**: All container node types extend this class

## Key Responsibilities

### Container Functionality
- **Child Management**: Adding, removing, and positioning child nodes
- **Layout Algorithms**: Automatic positioning of children according to layout rules
- **Size Calculation**: Dynamic sizing based on child content
- **Collapse/Expand**: Hiding and showing child content
- **Zone System**: Integration with hierarchical layout zones

### Container-Specific Features
- **Margin Management**: Automatic margin application around content
- **Child Lifecycle**: Managing child node creation and destruction
- **Edge Management**: Handling edges between child nodes
- **Layout Updates**: Responding to child changes and layout modifications

## Properties

### Container-Specific Properties
```javascript
// Container identification
this.isContainer = true;        // Identifies as container node
this.data.type = "container";   // Container type identifier

// Child management
this.childNodes = [];           // Array of child node instances
this.childEdges = [];           // Edges between child nodes
this.createNode = createNode;   // Node factory function

// Layout and spacing
this.containerMargin = {        // Margins around container content
  top: 4,
  right: 8,
  bottom: 8,
  left: 8
};
this.nodeSpacing = {            // Spacing between child nodes
  horizontal: 20,
  vertical: 10
};

// Zone system
this.zoneManager = null;        // Zone management system
this.edgesContainer = null;     // Container for edge elements

// Layout configuration
this.data.expandedSize = {      // Size when expanded
  width: 0,
  height: 0
};
this.data.layout = {            // Layout configuration
  minimumSize: {                // Minimum container size
    width: 0,
    height: 0,
    useRootRatio: false
  }
};
```

### Inherited Properties
All properties from [BaseNode](base-node.md) are inherited, including:
- Position and size properties
- State management properties
- Event handling properties
- DOM element references

## Methods

### Core Container Methods

#### `constructor(nodeData, parentElement, createNode, settings, parentNode = null)`
Initializes the container node with child management capabilities.

**Parameters:**
- `nodeData` - Node configuration object
- `parentElement` - Parent SVG container
- `createNode` - Node factory function for creating children
- `settings` - Global settings object
- `parentNode` - Parent node instance (optional)

**Initialization Steps:**
- Sets container-specific defaults
- Initializes child arrays and containers
- Sets up margin and spacing configurations
- Prepares layout configuration

#### `initChildren()`
Initializes all child nodes defined in the node data.

**Process:**
- Creates child nodes using the factory function
- Adds children to the child nodes array
- Initializes each child node
- Sets up child positioning and layout
- Integrates with zone system if available

#### `updateChildren()`
Updates child positioning and container sizing.

**Features:**
- Recalculates child positions based on layout algorithm
- Updates container size to accommodate children
- Applies margin and spacing calculations
- Triggers visual updates

### Status Aggregation and Propagation

- Parent containers compute their status from descendant leaf nodes.
- On any child status change, the parent calls `determineStatusBasedOnChildren()`, which uses `StatusManager.calculateContainerStatus(childNodes, settings)`.
- Aggregation priority: Error > Warning > Delayed > Unknown > Updating > Updated > Skipped > Ready.
- With `settings.toggleCollapseOnStatusChange` enabled, containers auto-collapse on non-problem states (Ready, Disabled, Updated, Skipped) and expand otherwise; ancestors may auto-expand to reveal affected nodes.

### Child Management

#### `addChild(childNode)`
Adds a child node to the container.

**Parameters:**
- `childNode` - Node instance to add

**Process:**
- Adds to child nodes array
- Sets up parent-child relationship
- Updates layout and positioning
- Integrates with zone system

#### `removeChild(childNode)`
Removes a child node from the container.

**Parameters:**
- `childNode` - Node instance to remove

**Process:**
- Removes from child nodes array
- Cleans up parent-child relationship
- Updates layout and positioning
- Removes from zone system

#### `getChild(id)`
Retrieves a child node by ID.

**Parameters:**
- `id` - Child node identifier

**Returns:** Child node instance or null if not found

#### `getChildren()`
Returns all child nodes.

**Returns:** Array of child node instances

### Layout Management

#### `calculateLayout()`
Calculates the layout for all child nodes.

**Process:**
- Determines available space (container size minus margins)
- Applies layout algorithm to position children
- Calculates required container size
- Updates child positions

#### `updateLayout()`
Updates the layout after changes to children or container.

**Triggers:**
- Child addition or removal
- Container size changes
- Layout configuration changes
- Margin or spacing changes

### Collapse/Expand System

#### `collapse()`
Collapses the container, hiding child nodes.

**Effects:**
- Child nodes become invisible
- Container size reduces to minimum
- Child edges are hidden
- Visual state changes (zoom button shows plus)
- Expanded size is stored for restoration

#### `expand()`
Expands the container, showing child nodes.

**Effects:**
- Child nodes become visible
- Container size restores to expanded size
- Child edges become visible
- Visual state changes (zoom button shows minus)
- Layout is recalculated

#### `toggleCollapse()`
Toggles between collapsed and expanded states.

### Zone System Integration

#### `initZoneSystem()`
Initializes the zone system for the container.

**Zones Created:**
- **Container Zone**: Outermost boundary
- **Header Zone**: Title and control area
- **Margin Zones**: Spacing around content
- **Inner Container Zone**: Child positioning area

#### `updateZoneLayout()`
Updates zone layout after container changes.

**Process:**
- Resizes zones to match container dimensions
- Updates zone positioning
- Recalculates child positioning within zones
- Applies layout algorithms

## Layout Algorithms

### Default Layout
The base container provides a default layout algorithm that:
- Centers children within available space
- Applies spacing between children
- Calculates required container size
- Handles margin boundaries

### Custom Layouts
Subclasses can override layout algorithms to provide:
- **Vertical Stacking**: Children arranged in single column
- **Horizontal Row**: Children arranged in single row
- **Grid Layout**: Children arranged in multiple rows/columns
- **Role-based Layout**: Children positioned by predefined roles
- **Dynamic Layout**: Children positioned by external algorithms

## Configuration

### Container-Specific Settings
```javascript
const containerSettings = {
  // Margin configuration
  containerMargin: {
    top: 4,      // Space from header bottom
    right: 8,    // Space from right edge
    bottom: 8,   // Space from bottom edge
    left: 8      // Space from left edge
  },
  
  // Spacing configuration
  nodeSpacing: {
    horizontal: 20,  // Space between children horizontally
    vertical: 10     // Space between children vertically
  },
  
  // Layout configuration
  layout: {
    minimumSize: {
      width: 0,           // Minimum container width
      height: 0,          // Minimum container height
      useRootRatio: false // Use root ratio for minimum size
    }
  },
  
  // Collapse configuration
  enableCollapse: true,   // Enable collapse/expand functionality
  collapseAnimation: true, // Animate collapse/expand transitions
  rememberExpandedSize: true // Remember expanded size when collapsing
};
```

### Child Node Configuration
```javascript
const childConfig = {
  // Child creation
  autoCreateChildren: true,    // Automatically create children from data
  childTypes: [],              // Allowed child node types
  maxChildren: null,           // Maximum number of children (null = unlimited)
  
  // Child positioning
  childPositioning: "automatic", // automatic, manual, or hybrid
  childConstraints: {           // Positioning constraints
    allowOverlap: false,
    respectBounds: true,
    maintainOrder: false
  },
  
  // Child sizing
  childSizing: "preserve",      // preserve, fit, or scale
  childMinSize: { width: 0, height: 0 },
  childMaxSize: { width: null, height: null }
};
```

## Zone System Details

### Zone Hierarchy
```
Container Zone (outermost)
├── Header Zone (top)
│   ├── Title text
│   ├── Status indicators
│   └── Zoom/collapse button
├── Margin Zones (surrounding)
│   ├── Top Margin (from header bottom)
│   ├── Right Margin
│   ├── Bottom Margin
│   └── Left Margin
└── Inner Container Zone (content area)
    └── Child Nodes (positioned here)
```

### Zone Coordinate Systems
- **Container Zone**: Positioned by center point in parent coordinate system
- **Header Zone**: Positioned at top of container (y=0)
- **Inner Container Zone**: Positioned below header with top margin offset
- **Child Nodes**: Positioned within inner container using top-left origin

### Zone Management
The `ZoneManager` provides:
- **Zone Creation**: Automatic zone initialization
- **Zone Positioning**: Coordinate system management
- **Zone Sizing**: Dynamic size calculation
- **Child Integration**: Child positioning within zones
- **Layout Algorithms**: Zone-specific layout methods

## Performance Considerations

### Child Management Optimization
- **Lazy Initialization**: Children created only when needed
- **Batch Updates**: Multiple child changes processed together
- **Position Caching**: Child positions cached to avoid recalculation
- **Event Delegation**: Efficient event handling for child interactions

### Layout Optimization
- **Incremental Updates**: Only changed children are repositioned
- **Layout Caching**: Layout calculations cached when possible
- **Spatial Indexing**: Efficient child lookup for large datasets
- **Render Batching**: Visual updates batched for performance

### Memory Management
- **Child Cleanup**: Proper cleanup when children are removed
- **Event Cleanup**: Event listeners removed from destroyed children
- **Reference Management**: Avoiding circular references
- **Zone Cleanup**: Zone system properly destroyed

## Error Handling

### Child Management Errors
- **Invalid Children**: Validation of child node data
- **Creation Failures**: Graceful handling of child creation errors
- **Positioning Errors**: Fallback positioning for layout failures
- **Size Calculation Errors**: Default sizing when calculations fail

### Layout Errors
- **Algorithm Failures**: Fallback to default layout
- **Constraint Violations**: Automatic constraint resolution
- **Overflow Handling**: Handling when children don't fit
- **Coordinate Errors**: Validation and correction of positions

## Testing

### Container Testing
- **Child Management**: Adding, removing, and updating children
- **Layout Algorithms**: Positioning and sizing calculations
- **Collapse/Expand**: State transitions and visual changes
- **Zone Integration**: Zone system functionality

### Integration Testing
- **Parent-Child Relationships**: Container-child interactions
- **Event Propagation**: Events flowing through hierarchy
- **Layout Updates**: Response to child and container changes
- **Performance**: Large numbers of children

## Navigation

- **[Documentation Overview](../README.md)** - Back to main documentation
- **[BaseNode](base-node.md)** - Parent class documentation
- **[LaneNode](lane-node.md)** - Vertical stacking container
- **[ColumnsNode](columns-node.md)** - Horizontal row container
- **[AdapterNode](adapter-node.md)** - Multi-arrangement container
- **[Implementation Details](../../implementation.md)** - Technical implementation

## Related Classes

### Dependencies
- **BaseNode** - Core node functionality
- **ZoneManager** - Zone system management
- **LayoutManager** - Layout algorithm management
- **ConfigManager** - Configuration management

### Subclasses
- **LaneNode** - Vertical stacking layout
- **ColumnsNode** - Horizontal row layout
- **AdapterNode** - Multi-arrangement layout
- **FoundationNode** - Role-based layout
- **MartNode** - Role-based layout
- **GroupNode** - Dynamic layout
- **EdgeDemoNode** - Testing layout 