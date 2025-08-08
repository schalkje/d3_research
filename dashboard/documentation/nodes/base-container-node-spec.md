# BaseContainerNode Specification

## Overview

The `BaseContainerNode` class extends `BaseNode` to provide container functionality with a sophisticated zone system for managing child nodes. It implements layout algorithms, zone management, and container-specific features like dynamic sizing and child positioning.

## Class Definition

```javascript
export default class BaseContainerNode extends BaseNode {
  constructor(nodeData, parentElement, settings, parentNode = null)
}
```

## Inheritance Hierarchy

- **Parent**: `BaseNode` - Foundation node class
- **Children**: Container node types extend this class
  - `LaneNode` - Vertical stacking container
  - `ColumnsNode` - Horizontal layout container
  - `GroupNode` - Group container node
  - `AdapterNode` - Specialist multi-arrangement node
  - `FoundationNode` - Role-based specialist node
  - `MartNode` - Role-based specialist node

## Core Properties

### Container-Specific Properties
```javascript
// Container identification
this.isContainer = true;         // Identifies as container node

// Zone system
this.zoneManager = null;         // Zone system manager
this.zones = {                   // Zone references
  header: null,                  // Header zone
  margin: null,                  // Margin zones
  inner: null                    // Inner container zone
};

// Child management
this.children = [];              // Child node instances
this.childLayouts = new Map();   // Child layout cache
this.layoutAlgorithm = null;     // Active layout algorithm

// Container sizing
this.minWidth = 100;             // Minimum container width
this.minHeight = 60;             // Minimum container height
this.autoSize = true;            // Auto-size based on content
this.expandToFit = true;         // Expand to fit children

// Layout state
this.layoutDirty = false;        // Layout needs recalculation
this.lastLayoutBounds = null;    // Previous layout bounds
this.layoutConstraints = {};     // Layout constraints
```

### Zone System Properties
```javascript
// Zone configuration
this.zoneConfig = {
  headerHeight: 30,              // Header zone height
  marginSize: 8,                 // Margin zone size
  innerPadding: 4,               // Inner container padding
  showHeader: true,              // Show header zone
  showMargins: true,             // Show margin zones
  showInner: true                // Show inner container zone
};

// Zone positioning
this.zonePositions = {
  header: { x: 0, y: 0, width: 0, height: 0 },
  marginTop: { x: 0, y: 0, width: 0, height: 0 },
  marginRight: { x: 0, y: 0, width: 0, height: 0 },
  marginBottom: { x: 0, y: 0, width: 0, height: 0 },
  marginLeft: { x: 0, y: 0, width: 0, height: 0 },
  inner: { x: 0, y: 0, width: 0, height: 0 }
};
```

## Constructor

### Signature
```javascript
constructor(nodeData, parentElement, settings, parentNode = null)
```

### Parameters
- `nodeData` (Object) - Node configuration object
- `parentElement` (SVGElement) - Parent SVG container
- `settings` (Object) - Global settings object
- `parentNode` (BaseNode, optional) - Parent node instance

### Initialization Process
1. Calls parent constructor (BaseNode)
2. Sets container-specific properties
3. Initializes zone system
4. Sets up child management
5. Configures layout algorithms
6. Applies container defaults

## Core Methods

### Zone System Management

#### `initZoneSystem()`
Initializes the zone system and creates zone managers.

**Features:**
- Creates ZoneManager instance
- Sets up header, margin, and inner zones
- Configures zone positioning
- Establishes zone hierarchy

#### `updateZonePositions()`
Updates zone positions based on container size and layout.

**Features:**
- Calculates zone boundaries
- Updates zone coordinates
- Adjusts zone sizes
- Triggers zone update events

#### `getZone(zoneName)`
Retrieves a specific zone by name.

**Parameters:**
- `zoneName` (String) - Zone identifier (header, margin, inner)

**Returns:** Zone instance or null

### Child Management

#### `addChild(childNode)`
Adds a child node to the container.

**Parameters:**
- `childNode` (BaseNode) - Child node instance

**Features:**
- Adds to children array
- Sets up parent-child relationship
- Triggers layout recalculation
- Updates container bounds

#### `removeChild(childNode)`
Removes a child node from the container.

**Parameters:**
- `childNode` (BaseNode) - Child node instance

**Features:**
- Removes from children array
- Cleans up parent-child relationship
- Triggers layout recalculation
- Updates container bounds

#### `getChildById(childId)`
Retrieves a child node by ID.

**Parameters:**
- `childId` (String) - Child node identifier

**Returns:** BaseNode instance or null

#### `getChildren()`
Returns all child nodes.

**Returns:** Array of BaseNode instances

### Layout Management

#### `calculateContainerLayout()`
Calculates the container's layout including zones and children.

**Features:**
- Determines container dimensions
- Calculates zone positions
- Positions child nodes
- Updates layout bounds

#### `updateChildLayouts()`
Updates the layout of all child nodes.

**Features:**
- Recalculates child positions
- Updates child sizes
- Adjusts container bounds
- Triggers child layout events

#### `getLayoutBounds()`
Returns the current layout bounds including all children.

**Returns:** Object with x, y, width, height

#### `fitToContent()`
Adjusts container size to fit all content.

**Features:**
- Calculates content bounds
- Adjusts container size
- Updates zone positions
- Triggers layout events

### Container-Specific Methods

#### `collapse()`
Collapses the container to show only header.

**Features:**
- Hides inner container zone
- Adjusts container height
- Updates child visibility
- Triggers collapse events

#### `expand()`
Expands the container to show all content.

**Features:**
- Shows inner container zone
- Restores container height
- Updates child visibility
- Triggers expand events

#### `toggleCollapse()`
Toggles between collapsed and expanded states.

#### `isCollapsed()`
Returns the current collapse state.

**Returns:** Boolean

## Layout System

### Zone-Based Layout Architecture

#### Zone Hierarchy
```
Container Node
├── Header Zone (optional)
│   ├── Title
│   ├── Controls
│   └── Status indicators
├── Margin Zones (optional)
│   ├── Top margin
│   ├── Right margin
│   ├── Bottom margin
│   └── Left margin
└── Inner Container Zone
    ├── Child Node 1
    ├── Child Node 2
    └── Child Node N
```

#### Zone Responsibilities

**Header Zone:**
- **Purpose**: Display container title and controls
- **Positioning**: Top of container
- **Sizing**: Full width, configurable height
- **Content**: Title text, status indicators, control buttons

**Margin Zones:**
- **Purpose**: Provide spacing and visual separation
- **Positioning**: Around inner container
- **Sizing**: Configurable thickness
- **Content**: Background, borders, spacing

**Inner Container Zone:**
- **Purpose**: Position and manage child nodes
- **Positioning**: Center of container (minus margins)
- **Sizing**: Dynamic based on children
- **Content**: Child nodes positioned by layout algorithm

### Layout Algorithms

#### Vertical Stacking (Lane Layout)
```javascript
const laneLayout = {
  orientation: 'vertical',
  direction: 'top-to-bottom',
  spacing: 10,
  alignment: 'center',
  distribution: 'start'
};
```

#### Horizontal Arrangement (Columns Layout)
```javascript
const columnsLayout = {
  orientation: 'horizontal',
  direction: 'left-to-right',
  spacing: 20,
  alignment: 'center',
  distribution: 'space-between'
};
```

#### Grid Layout
```javascript
const gridLayout = {
  orientation: 'grid',
  columns: 3,
  rows: 'auto',
  spacing: { horizontal: 10, vertical: 10 },
  alignment: 'center'
};
```

### Layout Properties

#### Orientation and Direction
- **Vertical**: Children stacked top-to-bottom
- **Horizontal**: Children arranged left-to-right
- **Grid**: Children arranged in rows and columns
- **Custom**: Specialized arrangement patterns

#### Spacing and Margins
```javascript
const layoutSpacing = {
  containerMargin: {
    top: 4,
    right: 8,
    bottom: 8,
    left: 8
  },
  childSpacing: {
    horizontal: 20,
    vertical: 10
  },
  zoneSpacing: {
    header: 4,
    margins: 8,
    inner: 4
  }
};
```

#### Centering and Alignment
- **Center Alignment**: Children centered within container
- **Start Alignment**: Children aligned to start edge
- **End Alignment**: Children aligned to end edge
- **Stretch Alignment**: Children stretched to fill container

### Layout Methods

#### `calculateChildPositions()`
Calculates positions for all child nodes.

**Features:**
- Applies layout algorithm
- Considers spacing and margins
- Handles alignment and distribution
- Updates child coordinates

#### `updateContainerSize()`
Updates container size based on content.

**Features:**
- Calculates content bounds
- Applies minimum size constraints
- Updates zone positions
- Triggers size change events

#### `validateLayout()`
Validates the current layout for errors.

**Features:**
- Checks for overlapping children
- Validates zone boundaries
- Ensures proper spacing
- Reports layout issues

## Configuration

### Container Settings
```javascript
const containerSettings = {
  // Zone configuration
  showHeader: true,              // Show header zone
  showMargins: true,             // Show margin zones
  headerHeight: 30,              // Header zone height
  marginSize: 8,                 // Margin zone size
  innerPadding: 4,               // Inner container padding
  
  // Layout configuration
  layoutType: 'vertical',         // Layout algorithm type
  autoSize: true,                // Auto-size container
  expandToFit: true,             // Expand to fit children
  minWidth: 100,                 // Minimum container width
  minHeight: 60,                 // Minimum container height
  
  // Child management
  childSpacing: {                // Spacing between children
    horizontal: 20,
    vertical: 10
  },
  childAlignment: 'center',      // Child alignment
  childDistribution: 'start',    // Child distribution
  
  // Container behavior
  enableCollapse: true,          // Enable collapse/expand
  enableDrag: true,              // Enable drag and drop
  enableResize: true,            // Enable resize
  enableSelection: true          // Enable selection
};
```

### Container Data Structure
```javascript
const containerData = {
  // Required properties (inherited from BaseNode)
  id: "container-id",
  type: "container-type",
  label: "Container Label",
  
  // Container-specific properties
  isContainer: true,
  layoutType: "vertical",        // Layout algorithm
  autoSize: true,                // Auto-size behavior
  expandToFit: true,             // Expand to fit children
  
  // Zone configuration
  zones: {
    header: {
      visible: true,
      height: 30,
      content: "Header Content"
    },
    margins: {
      visible: true,
      size: 8
    },
    inner: {
      visible: true,
      padding: 4
    }
  },
  
  // Child nodes
  children: [
    {
      id: "child1",
      type: "node",
      label: "Child Node 1",
      // ... child properties
    }
  ],
  
  // Layout constraints
  constraints: {
    minWidth: 100,
    minHeight: 60,
    maxWidth: null,
    maxHeight: null
  }
};
```

## Zone System Integration

### Zone Manager
Container nodes automatically initialize a `ZoneManager` that provides:
- **Header Zone**: Title and control area
- **Margin Zones**: Spacing around content
- **Inner Container Zone**: Child node positioning area

### Zone Features
- **Automatic Positioning**: Children positioned by layout algorithms
- **Dynamic Sizing**: Container adapts to content size
- **Collapse/Expand**: Integrated support for hiding content
- **Coordinate Systems**: Each zone has its own coordinate system
- **Event Handling**: Zone-specific event management
- **Visual Styling**: Zone-specific CSS classes

### Zone Event System
- **zoneCreated**: Zone created and initialized
- **zoneResized**: Zone size changed
- **zoneMoved**: Zone position changed
- **zoneVisibilityChanged**: Zone visibility changed
- **childAddedToZone**: Child added to zone
- **childRemovedFromZone**: Child removed from zone

## Performance Considerations

### Container-Specific Optimizations
- **Lazy Zone Creation**: Zones created only when needed
- **Layout Caching**: Child positions cached for performance
- **Batch Child Updates**: Multiple child changes processed together
- **Zone Update Batching**: Zone updates batched for efficiency
- **Layout Validation**: Layout validation only when necessary

### Memory Management
- **Child Reference Cleanup**: Proper cleanup of child references
- **Zone Cleanup**: Zone elements properly removed
- **Layout Cache Management**: Layout cache size management
- **Event Listener Cleanup**: Zone event listeners properly removed

## Error Handling

### Container-Specific Validation
- **Child Validation**: Validates child node structure
- **Zone Validation**: Validates zone configuration
- **Layout Validation**: Validates layout algorithm
- **Size Validation**: Validates container size constraints

### Error Recovery
- **Layout Recovery**: Automatic layout recalculation on errors
- **Zone Recovery**: Zone system recovery mechanisms
- **Child Recovery**: Child node recovery and repositioning
- **Size Recovery**: Container size recovery strategies

## Testing Requirements

### Container-Specific Testing
- **Zone System Tests**: Zone creation, positioning, and management
- **Child Management Tests**: Child addition, removal, and positioning
- **Layout Algorithm Tests**: Layout calculation and application
- **Collapse/Expand Tests**: Container collapse and expand functionality
- **Size Management Tests**: Container sizing and auto-sizing

### Integration Testing
- **Parent-Child Relationships**: Container-child interactions
- **Zone-Child Interactions**: Zone and child node interactions
- **Layout Performance**: Large numbers of children
- **Memory Management**: Proper cleanup of container resources

### Test Scenarios
1. **Basic Container**: Container with single child
2. **Complex Container**: Container with multiple children
3. **Zone Management**: All zones visible and functional
4. **Layout Algorithms**: Different layout types
5. **Collapse/Expand**: Container state changes
6. **Performance**: Large numbers of children
7. **Error Conditions**: Invalid child data and zone configurations

## Dependencies

### Required Dependencies
- **BaseNode** - Parent class functionality
- **ZoneManager** - Zone system management
- **LayoutManager** - Layout algorithm management
- **ConfigManager** - Configuration management

### Optional Dependencies
- **Force Simulation** - Physics-based child positioning
- **D3.js** - DOM manipulation and SVG handling

## Migration Notes

### From Previous Documentation
This specification replaces the existing `base-container-node.md` documentation with a comprehensive technical specification that includes:
- Complete zone system documentation
- Layout algorithm specifications
- Child management details
- Performance considerations
- Error handling strategies

### Breaking Changes
- None - this is a specification document that describes existing functionality
- All existing implementations should continue to work as documented

## Related Documentation

- **[BaseNode Specification](base-node-spec.md)** - Parent class specification
- **[LaneNode Specification](lane-node-spec.md)** - Vertical stacking container
- **[ColumnsNode Specification](columns-node-spec.md)** - Horizontal layout container
- **[Zone System Documentation](../../zones/README.md)** - Zone system implementation
- **[Implementation Details](../../implementation.md)** - Technical implementation
