# BaseNode Specification

## Overview

The `BaseNode` class is the foundational abstract class for all node types in the Flow Dashboard system. It provides core functionality including positioning, rendering, event handling, state management, and configuration that every node must implement.

## Class Definition

```javascript
export default class BaseNode {
  constructor(nodeData, parentElement, settings, parentNode = null)
}
```

## Inheritance Hierarchy

- **Parent**: None (Root class)
- **Children**: All node types extend this class
  - `BaseContainerNode` - Container functionality
  - `RectangularNode` - Rectangular shape implementation
  - `CircleNode` - Circular shape implementation
  - `LaneNode` - Vertical stacking container
  - `ColumnsNode` - Horizontal layout container
  - `AdapterNode` - Specialist multi-arrangement node
  - `FoundationNode` - Role-based specialist node
  - `MartNode` - Role-based specialist node
  - `GroupNode` - Group container node
  - `EdgeDemoNode` - Edge demonstration node

## Core Properties

### Essential Properties
```javascript
// Core data
this.data = nodeData;           // Node configuration and data
this.id = nodeData.id;          // Unique identifier
this.parentElement = parentElement; // Parent SVG container
this.parentNode = parentNode;   // Parent node (if any)
this.settings = ConfigManager.mergeWithDefaults(settings); // Global settings

// Position and size
this.x = 0;                     // X coordinate (center)
this.y = 0;                     // Y coordinate (center)
this.data.width = 60;           // Node width (default)
this.data.height = 60;          // Node height (default)

// State management
this._selected = false;         // Selection state
this._status = NodeStatus.UNKNOWN; // Node status
this._visible = true;           // Visibility state
this._collapsed = false;        // Collapse state
this.suspenseDisplayChange = false; // Display change suspension

// DOM elements
this.element = null;            // SVG group element
this.simulation = null;         // Force simulation reference
this.zoneManager = null;        // Zone system manager (containers only)
this.layoutDebug = true;        // Debug layout information

// Edge management
this.edges = {
  incoming: [],  // Edges pointing to this node
  outgoing: []   // Edges pointing from this node
};

// Event callbacks
this.onDisplayChange = null;    // Display state change callback
this.onClick = null;            // Click event callback
this.onDblClick = null;         // Double-click event callback

// Utility functions
this.computeConnectionPoints = computeConnectionPoints; // Connection point calculation
```

### Node Status Enum
```javascript
export const NodeStatus = Object.freeze({
  UNDETERMINED: 'Undetermined', // Used in status determination logic
  UNKNOWN: 'Unknown',           // Default/unknown status
  DISABLED: 'Disabled',         // Disabled/inactive
  // Process states
  READY: 'Ready',               // Normal operation
  UPDATING: 'Updating',         // Processing/loading state
  UPDATED: 'Updated',           // Success state
  SKIPPED: 'Skipped',          // Skipped state
  // Error states
  DELAYED: 'Delayed',          // Delayed state
  WARNING: 'Warning',           // Warning state
  ERROR: 'Error'                // Error state
});
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
1. Sets core properties and default values
2. Initializes state management properties
3. Sets up edge management structure
4. Configures event callbacks
5. Applies default dimensions (60x60)
6. Sets up utility functions

## Core Methods

### Initialization

#### `init(parentElement = null)`
Initializes the node's DOM elements and sets up event handling.

**Parameters:**
- `parentElement` (SVGElement, optional) - Parent container

**Features:**
- Creates SVG group element
- Sets up default event handlers
- Initializes zone system (for containers)
- Applies visual state classes
- Shows debug elements (if enabled)

#### `update()`
Updates the node's visual appearance and triggers display change events.

**Features:**
- Updates visual state
- Triggers display change callbacks
- Handles suspended display changes

### Positioning and Movement

#### `move(x, y)`
Updates the node's position and applies transform.

**Parameters:**
- `x` (Number) - New X coordinate
- `y` (Number) - New Y coordinate

**Features:**
- Updates internal coordinates
- Applies SVG transform
- Triggers position change events

#### `resize(size, forced = false)`
Updates the node's size and recalculates layout.

**Parameters:**
- `size` (Object) - Object with width and/or height
- `forced` (Boolean) - Force resize even if dimensions haven't changed

**Features:**
- Updates width and height
- Recalculates layout
- Triggers size change events

### State Management

#### `get selected()` / `set selected(value)`
Manages selection state with visual feedback.

**Features:**
- Updates selection state
- Applies visual selection styling
- Triggers selection change events

#### `get status()` / `set status(value)`
Manages node status with automatic collapse handling.

**Features:**
- Updates status state
- Applies status-based styling
- Handles automatic collapse based on status
- Triggers status change events

#### `get visible()` / `set visible(value)`
Manages visibility state with DOM manipulation.

**Features:**
- Updates visibility state
- Shows/hides DOM element
- Triggers visibility change events

#### `get collapsed()` / `set collapsed(value)`
Manages collapse state with visual feedback.

**Features:**
- Updates collapse state
- Applies collapse/expand styling
- Triggers collapse change events

### Event Handling

#### `setupEvents()`
Sets up default mouse and keyboard event handlers.

**Events Handled:**
- Click and double-click
- Mouse enter/leave
- Drag start/move/end
- Keyboard shortcuts

#### `handleClicked(event, node = this)`
Default click handler that can be overridden by subclasses.

**Parameters:**
- `event` (Event) - Click event
- `node` (BaseNode) - Node instance (defaults to this)

#### `handleDblClicked(event, node = this)`
Default double-click handler that can be overridden by subclasses.

**Parameters:**
- `event` (Event) - Double-click event
- `node` (BaseNode) - Node instance (defaults to this)

#### `drag_started(event, node)`
Handles drag start events.

#### `dragged(event, node)`
Handles drag move events.

#### `drag_ended(event, node)`
Handles drag end events.

### Node Hierarchy Management

#### `getNode(nodeId)`
Retrieves a child node by ID.

**Parameters:**
- `nodeId` (String) - Node identifier

**Returns:** BaseNode instance or null

#### `getNodesByDatasetId(datasetId)`
Retrieves all nodes with a specific dataset ID.

**Parameters:**
- `datasetId` (String) - Dataset identifier

**Returns:** Array of BaseNode instances

#### `getAllNodes(onlySelected = false, onlyEndNodes = false)`
Retrieves all descendant nodes with optional filtering.

**Parameters:**
- `onlySelected` (Boolean) - Filter for selected nodes only
- `onlyEndNodes` (Boolean) - Filter for end nodes only

**Returns:** Array of BaseNode instances

#### `getAllEdges(onlySelected = false, allEdges = [])`
Retrieves all edges connected to this node and its descendants.

**Parameters:**
- `onlySelected` (Boolean) - Filter for selected edges only
- `allEdges` (Array) - Accumulated edges array

**Returns:** Array of edge objects

#### `isDescendantOf(node)`
Checks if this node is a descendant of the specified node.

**Parameters:**
- `node` (BaseNode) - Potential ancestor node

**Returns:** Boolean

#### `getNeighbors(selector = { incomming: 1, outgoing: 1 })`
Retrieves neighboring nodes based on edge connections.

**Parameters:**
- `selector` (Object) - Selection criteria for incoming/outgoing edges

**Returns:** Array of neighboring BaseNode instances

#### `getParents()`
Retrieves all parent nodes in the hierarchy.

**Returns:** Array of parent BaseNode instances

### Cascade Operations

#### `cascadeUpdate()`
Triggers update operations on all descendant nodes.

#### `cascadeStatusChange()`
Propagates status changes to all descendant nodes.

#### `cascadeRestartSimulation()`
Restarts force simulation for all descendant nodes.

#### `cascadeStopSimulation()`
Stops force simulation for all descendant nodes.

### Utility Methods

#### `getBoundingBox()`
Calculates the node's bounding box for collision detection.

**Returns:** Object with x, y, width, height

#### `handleDisplayChange()`
Handles display state changes and triggers callbacks.

## Configuration

### Default Settings
```javascript
const defaultSettings = {
  // Display settings
  showCenterMark: false,        // Show center point marker
  showGrid: true,               // Show background grid
  showGroupLabels: true,        // Show group labels
  showGroupTitles: true,        // Show group titles
  showConnectionPoints: false,  // Show connection point markers
  showGhostlines: false,        // Show ghost lines
  
  // Interaction settings
  enableDrag: true,             // Enable drag and drop
  enableSelection: true,        // Enable selection
  enableCollapse: false,        // Enable collapse/expand
  
  // Layout settings
  curved: false,                // Use curved edges
  nodeSpacing: {                // Spacing between nodes
    horizontal: 20,
    vertical: 10
  },
  containerMargin: {            // Container margins
    top: 4,
    right: 8,
    bottom: 8,
    left: 8
  },
  
  // Demo settings
  demoMode: true,               // Enable demo mode features
  enableTesting: true           // Enable testing features
};
```

### Node Data Structure
```javascript
const nodeData = {
  // Required properties
  id: "unique-id",              // Unique identifier
  type: "node-type",            // Node type for factory creation
  label: "Node Label",          // Display label
  
  // Position and size
  x: 100,                       // X coordinate
  y: 200,                       // Y coordinate
  width: 80,                    // Node width
  height: 60,                   // Node height
  
  // State and status
  state: "Ready",               // Initial status
  code: "N1",                   // Node code
  
  // Layout configuration
  layout: {
    displayMode: "full",        // Display mode (full, role, code)
    arrangement: "default"      // Arrangement type
  },
  
  // Hierarchy
  children: [],                 // Child nodes (for containers)
  parentId: null,               // Parent node ID
  
  // Additional type-specific properties
  // ... varies by node type
};
```

## Status System

### Status Effects
- **Visual Styling**: Different CSS classes applied based on status
- **Event Handling**: Status-specific interaction behavior
- **Edge Coloring**: Connected edges may change color based on status
- **Tooltip Content**: Status information displayed in tooltips
- **Automatic Collapse**: Certain statuses trigger automatic collapse

### Status Transitions
- **Unknown → Ready**: Normal initialization
- **Ready → Updating**: Processing started
- **Updating → Updated**: Processing completed successfully
- **Updating → Error**: Processing failed
- **Any → Disabled**: Node disabled

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
- **collapseChange**: Collapse state changed

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
- **Display Change Suspension**: Prevents excessive updates during batch operations

### Memory Management
- **Event Cleanup**: Event listeners properly removed
- **DOM Cleanup**: Elements removed when node is destroyed
- **Reference Management**: Circular references avoided
- **Garbage Collection**: Proper cleanup of references

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

## Testing Requirements

### Unit Testing
- **Constructor Tests**: Proper initialization with various parameters
- **Method Tests**: Individual method functionality and edge cases
- **Event Tests**: Event handling and propagation
- **State Tests**: State management and transitions
- **Property Tests**: Getter/setter functionality

### Integration Testing
- **Parent-Child Relationships**: Container-child interactions
- **Event Propagation**: Event flow through hierarchy
- **Zone System**: Zone management and positioning
- **Performance**: Large dataset handling
- **Memory Leaks**: Proper cleanup and garbage collection

### Test Scenarios
1. **Basic Initialization**: Node creation with minimal data
2. **Full Configuration**: Node creation with complete data
3. **State Transitions**: All status and visibility changes
4. **Event Handling**: All mouse and keyboard interactions
5. **Hierarchy Management**: Parent-child relationships
6. **Performance**: Large numbers of nodes
7. **Error Conditions**: Invalid data and edge cases

## Dependencies

### Required Dependencies
- **ConfigManager** - Configuration management and defaults
- **EventManager** - Event handling patterns
- **StatusManager** - Status calculation and management
- **ZoneManager** - Zone system management (containers only)
- **computeConnectionPoints** - Connection point calculation utility

### Optional Dependencies
- **Force Simulation** - Physics-based positioning
- **D3.js** - DOM manipulation and SVG handling

## Migration Notes

### From Previous Documentation
This specification replaces the existing `base-node.md` documentation with a more comprehensive technical specification that includes:
- Complete method signatures and parameters
- Detailed property descriptions
- Comprehensive testing requirements
- Performance considerations
- Error handling strategies

### Breaking Changes
- None - this is a specification document that describes existing functionality
- All existing implementations should continue to work as documented

## Related Documentation

- **[BaseContainerNode Specification](base-container-node-spec.md)** - Container node base class
- **[RectangularNode Specification](rectangular-node-spec.md)** - Basic rectangular node
- **[CircleNode Specification](circle-node-spec.md)** - Basic circular node
- **[Implementation Details](../../implementation.md)** - Technical implementation
- **[Testing Strategy](../../../TESTING_STRATEGY.md)** - Testing approach and methodology
