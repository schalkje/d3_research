# Node System Implementation

## Overview

The node system implements a hierarchical, inheritance-based architecture for creating different types of visual nodes in the dashboard. Each node type extends base classes to inherit common functionality while providing specialized behavior.

## Class Hierarchy

```
BaseNode (nodeBase.js)
├── BaseContainerNode (nodeBaseContainer.js)
│   ├── AdapterNode (nodeAdapter.js)
│   ├── FoundationNode (nodeFoundation.js)
│   ├── MartNode (nodeMart.js)
│   ├── LaneNode (nodeLane.js)
│   ├── ColumnsNode (nodeColumns.js)
│   └── GroupNode (nodeGroup.js)
├── RectangularNode (nodeRect.js)
├── CircleNode (nodeCircle.js)
└── EdgeDemoNode (nodeEdgeDemo.js)
```

## BaseNode Class

**File:** `nodeBase.js`

The foundation class that all nodes inherit from. Provides core functionality:

### Key Properties

- `data` - Node configuration and data
- `parentElement` - D3 selection of parent SVG element
- `parentNode` - Reference to parent node (for hierarchy)
- `settings` - Dashboard settings object
- `element` - D3 selection of the node's SVG group
- `edges` - Object containing `incoming` and `outgoing` edge arrays
- `_status` - Current node status (Ready, Error, etc.)
- `_visible` - Visibility state
- `_collapsed` - Collapse/expand state
- `_selected` - Selection state

### Key Methods

- `init()` - Initialize the node's SVG elements
- `update()` - Update node visual representation
- `move(x, y)` - Move node to new position
- `resize(size)` - Resize node dimensions
- `handleDisplayChange()` - Propagate display changes up hierarchy
- `getNode(nodeId)` - Find child node by ID
- `getAllNodes()` - Get all descendant nodes
- `getNeighbors()` - Get connected nodes

### Status Management

Nodes support a comprehensive status system with automatic cascading:

```javascript
const NodeStatus = {
  UNDETERMINED: 'Undetermined',
  UNKNOWN: 'Unknown', 
  DISABLED: 'Disabled',
  READY: 'Ready',
  UPDATING: 'Updating',
  UPDATED: 'Updated',
  SKIPPED: 'Skipped',
  DELAYED: 'Delayed',
  WARNING: 'Warning',
  ERROR: 'Error'
};
```

## BaseContainerNode Class

**File:** `nodeBaseContainer.js`

Extends BaseNode to provide container functionality for nodes that can contain other nodes.

### Key Features

- **Child Management** - Creates and manages child nodes
- **Layout Calculation** - Computes container size based on children
- **Edge Management** - Handles edges between child nodes
- **Collapse/Expand** - Shows/hides child nodes
- **Status Cascading** - Determines container status from children

### Key Methods

- `initChildren()` - Initialize child nodes
- `updateChildren()` - Update child node positions
- `resizeContainer()` - Resize container to fit children
- `collapse()` / `expand()` - Hide/show children
- `determineStatusBasedOnChildren()` - Calculate status from children

### Container Margins and Spacing

```javascript
this.containerMargin = { top: 18, right: 8, bottom: 8, left: 8 };
this.nodeSpacing = { horizontal: 20, vertical: 10 };
```

## Node Types

### AdapterNode

**File:** `nodeAdapter.js`

Specialized container for data adapter patterns with staging, transform, and archive components.

**Features:**
- Automatic child node creation based on layout mode
- Multiple layout arrangements (1-5)
- Display modes: Full or Role-based
- Internal edge creation between components

**Layout Modes:**
- `MANUAL` - Manual configuration
- `FULL` - All components (staging, transform, archive)
- `ARCHIVE_ONLY` - Archive component only
- `STAGING_ARCHIVE` - Staging and archive
- `STAGING_TRANSFORM` - Staging and transform

### FoundationNode

**File:** `nodeFoundation.js`

Container for foundation/warehouse nodes with specialized layout.

### MartNode

**File:** `nodeMart.js`

Container for data mart nodes with specialized layout.

### LaneNode

**File:** `nodeLane.js`

Horizontal lane container for organizing nodes in rows.

### ColumnsNode

**File:** `nodeColumns.js`

Vertical column container for organizing nodes in columns.

### GroupNode

**File:** `nodeGroup.js`

Simple group container for basic node grouping.

### RectangularNode

**File:** `nodeRect.js`

Basic rectangular node with text label.

### CircleNode

**File:** `nodeCircle.js`

Basic circular node with text label.

### EdgeDemoNode

**File:** `nodeEdgeDemo.js`

Demo node for testing edge connections.

## Node Factory

**File:** `node.js`

Factory function that creates appropriate node instances based on node type:

```javascript
export function createNode(nodeData, container, settings, parentNode = null) {
  const nodeType = nodeData.type.toLowerCase();
  switch (nodeType) {
    case "group":
      return new GroupNode(nodeData, container, createNode, settings, parentNode);
    case "lane":
      return new LaneNode(nodeData, container, createNode, settings, parentNode);
    case "adapter":
      return new AdapterNode(nodeData, container, createNode, settings, parentNode);
    // ... other cases
  }
}
```

## Node Data Structure

Each node expects data in this format:

```javascript
{
  id: "unique-id",
  label: "Node Label",
  type: "adapter|foundation|mart|lane|columns|group|node|circle|rect|edge-demo",
  state: "Ready|Error|Warning|...",
  width: 100,
  height: 60,
  x: 0,
  y: 0,
  layout: {
    displayMode: "full|role",
    mode: "manual|full|archive-only|staging-archive|staging-transform",
    arrangement: 1, // Layout arrangement number
    minimumSize: { width: 0, height: 0 }
  },
  children: [...] // Child nodes for container types
}
```

## Event System

Nodes communicate through a callback system:

- `onClick` - Click event handler
- `onDblClick` - Double-click event handler  
- `onDisplayChange` - Display change notification

Events bubble up the hierarchy until handled by a parent node or the dashboard.

## Drag and Drop

Nodes support drag and drop through D3's drag behavior:

```javascript
drag_started(event, node) {
  // Handle drag start
}

dragged(event, node) {
  // Handle drag movement
  node.move(event.x, event.y);
}

drag_ended(event, node) {
  // Handle drag end
}
```

## Connection Points

Nodes can display connection points for edge routing:

```javascript
if (this.settings.showConnectionPoints) {
  const connectionPoints = this.computeConnectionPoints(0, 0, this.data.width, this.data.height);
  // Create connection point visual elements
}
```

## Performance Considerations

- **Lazy Initialization** - Child nodes created only when needed
- **Display Change Suspension** - Prevents excessive updates during batch operations
- **Efficient Selection** - Uses D3 selections for DOM manipulation
- **Status Caching** - Status calculations cached to avoid recomputation 