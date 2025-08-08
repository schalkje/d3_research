# BaseNode

## Overview

`BaseNode` is the abstract foundation class for all node types in the dashboard system. It provides the core functionality that every node must have, including positioning, rendering, event handling, and state management.

## Inheritance

- **Parent**: None (Root class)
- **Children**: All node types extend this class

## Key Responsibilities

### Core Functionality
- **Positioning**: Basic x/y coordinate management
- **Rendering**: SVG element creation and DOM management
- **Event Handling**: Mouse and keyboard interaction setup
- **State Management**: Status, visibility, and selection state
- **Configuration**: Settings management and validation

### Abstract Interface
- **Rendering**: Each subclass must implement its own visual representation
- **Sizing**: Subclasses define their own size calculation logic
- **Interaction**: Subclasses can override default interaction behavior

## Properties

### Essential Properties
```javascript
// Core data
this.data = nodeData;           // Node configuration and data
this.id = nodeData.id;          // Unique identifier
this.parentElement = parentElement; // Parent SVG container
this.parentNode = parentNode;   // Parent node (if any)

// Position and size
this.x = 0;                     // X coordinate (center)
this.y = 0;                     // Y coordinate (center)
this.data.width = 60;           // Node width
this.data.height = 60;          // Node height

// State management
this._selected = false;         // Selection state
this._status = NodeStatus.UNKNOWN; // Node status
this._visible = true;           // Visibility state
this._collapsed = false;        // Collapse state

// DOM elements
this.element = null;            // SVG group element
this.simulation = null;         // Force simulation reference
```

### Edge Management
```javascript
this.edges = {
  incoming: [],  // Edges pointing to this node
  outgoing: []   // Edges pointing from this node
};
```

### Event Callbacks
```javascript
this.onDisplayChange = null;    // Display state change callback
this.onClick = null;            // Click event callback
this.onDblClick = null;         // Double-click event callback
```

## Methods

### Core Methods

#### `constructor(nodeData, parentElement, settings, parentNode = null)`
Initializes the base node with configuration and parent references.

**Parameters:**
- `nodeData` - Node configuration object
- `parentElement` - Parent SVG container
- `settings` - Global settings object
- `parentNode` - Parent node instance (optional)

#### `init(parentElement = null)`
Initializes the node's DOM elements and sets up event handling.

**Features:**
- Creates SVG group element
- Sets up default event handlers
- Initializes zone system (for containers)
- Applies visual state classes
- Shows debug elements (if enabled)

#### `move(x, y)`
Updates the node's position and applies transform.

**Parameters:**
- `x` - New X coordinate
- `y` - New Y coordinate

#### `resize(dimensions)`
Updates the node's size and recalculates layout.

**Parameters:**
- `dimensions` - Object with width and/or height

### State Management

#### `get selected()`
Returns the current selection state.

#### `set selected(value)`
Updates selection state and applies visual feedback.

#### `get status()`
Returns the current node status.

#### `set status(value)`
Updates status and triggers status change events.

#### `get visible()`
Returns the current visibility state.

#### `set visible(value)`
Updates visibility and shows/hides the node.

#### `get collapsed()`
Returns the current collapse state.

#### `set collapsed(value)`
Updates collapse state and applies visual changes.

### Event Handling

#### `setupEvents()`
Sets up default mouse and keyboard event handlers.

**Events Handled:**
- Click and double-click
- Mouse enter/leave
- Drag start/move/end
- Keyboard shortcuts

#### `handleClick(event)`
Default click handler that can be overridden by subclasses.

#### `handleDblClick(event)`
Default double-click handler that can be overridden by subclasses.

### Utility Methods

#### `computeConnectionPoints(x, y, width, height)`
Calculates connection points on the node's boundaries.

**Returns:** Object with top, right, bottom, left connection points

#### `getBoundingBox()`
Calculates the node's bounding box for collision detection.

#### `updateDisplay()`
Updates the node's visual appearance based on current state.

## Configuration

### Default Settings
```javascript
const defaultSettings = {
  showCenterMark: false,        // Show center point marker
  showConnectionPoints: false,  // Show connection point markers
  enableDrag: true,             // Enable drag and drop
  enableSelection: true,        // Enable selection
  enableCollapse: false,        // Enable collapse/expand
  nodeSpacing: {                // Spacing between nodes
    horizontal: 20,
    vertical: 10
  },
  containerMargin: {            // Container margins
    top: 4,
    right: 8,
    bottom: 8,
    left: 8
  }
};
```

### Node Data Structure
```javascript
const nodeData = {
  id: "unique-id",              // Required unique identifier
  type: "node-type",            // Node type for factory creation
  label: "Node Label",          // Display label
  x: 100,                       // X coordinate
  y: 200,                       // Y coordinate
  width: 80,                    // Node width
  height: 60,                   // Node height
  state: "active",              // Initial status
  layout: {},                   // Layout configuration
  children: [],                 // Child nodes (for containers)
  // ... additional type-specific properties
};
```

## Status System

### Available Statuses
```javascript
const NodeStatus = {
  UNKNOWN: "unknown",           // Default/unknown status
  ACTIVE: "active",             // Normal operation
  INACTIVE: "inactive",         // Disabled/inactive
  ERROR: "error",               // Error state
  WARNING: "warning",           // Warning state
  SUCCESS: "success",           // Success state
  PROCESSING: "processing"      // Processing/loading state
};
```

### Status Effects
- **Visual Styling**: Different CSS classes applied
- **Event Handling**: Status-specific interaction behavior
- **Edge Coloring**: Connected edges may change color
- **Tooltip Content**: Status information in tooltips

## Event System

### Built-in Events
- **click**: Node clicked
- **dblclick**: Node double-clicked
- **mouseenter**: Mouse enters node
- **mouseleave**: Mouse leaves node
- **dragstart**: Drag operation started
- **drag**: Drag operation in progress
- **dragend**: Drag operation completed

### Custom Events
- **statusChange**: Node status changed
- **positionChange**: Node position changed
- **sizeChange**: Node size changed
- **selectionChange**: Selection state changed
- **visibilityChange**: Visibility state changed

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

## Performance Considerations

### Optimization Features
- **Lazy Initialization**: DOM elements created only when needed
- **Event Delegation**: Efficient event handling for large datasets
- **Batch Updates**: Multiple changes processed together
- **Caching**: Position and size calculations cached

### Memory Management
- **Event Cleanup**: Event listeners properly removed
- **DOM Cleanup**: Elements removed when node is destroyed
- **Reference Management**: Circular references avoided

## Error Handling

### Validation
- **Required Properties**: ID and type validation
- **Data Types**: Property type checking
- **Bounds Checking**: Position and size validation
- **Parent References**: Parent element validation

### Error Recovery
- **Graceful Degradation**: Fallback behavior for errors
- **Error Logging**: Comprehensive error reporting
- **State Recovery**: Automatic state restoration
- **User Feedback**: Clear error messages

## Testing

### Unit Testing
- **Constructor Tests**: Proper initialization
- **Method Tests**: Individual method functionality
- **Event Tests**: Event handling and propagation
- **State Tests**: State management and transitions

### Integration Testing
- **Parent-Child Relationships**: Container-child interactions
- **Event Propagation**: Event flow through hierarchy
- **Zone System**: Zone management and positioning
- **Performance**: Large dataset handling

## Navigation

- **[Documentation Overview](../README.md)** - Back to main documentation
- **[BaseContainerNode](base-container-node.md)** - Container node base class
- **[RectangularNode](rectangular-node.md)** - Basic rectangular node
- **[CircleNode](circle-node.md)** - Basic circular node
- **[Implementation Details](../../implementation.md)** - Technical implementation

## Related Classes

### Dependencies
- **ConfigManager** - Configuration management
- **EventManager** - Event handling patterns
- **StatusManager** - Status calculation and management
- **ZoneManager** - Zone system management (containers only)

### Subclasses
- **BaseContainerNode** - Container functionality
- **RectangularNode** - Rectangular shape implementation
- **CircleNode** - Circular shape implementation
- **All Container Types** - LaneNode, ColumnsNode, etc. 