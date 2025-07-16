# Edge System Implementation

## Overview

The edge system manages connections between nodes in the dashboard. It handles edge creation, routing, and visual representation with support for different edge types and routing algorithms.

## Architecture

### Edge Creation Flow

1. **Edge Factory** (`edge.js`) - Creates edge instances
2. **Parent Resolution** - Determines common parent container
3. **Edge Instance** (`edgeBase.js`) - Manages edge visualization
4. **Path Calculation** (`utilPath.js`) - Computes routing paths
5. **Markers** (`markers.js`) - Defines arrow heads and symbols

## Edge Factory

**File:** `edge.js`

The factory handles edge creation and parent resolution:

### Key Functions

#### `createEdges(rootNode, edges, settings)`
Main entry point for creating multiple edges:

```javascript
export function createEdges(rootNode, edges, settings) {
  edges.forEach((edgeData) => {
    createEdge(rootNode, edgeData, settings);
  });
  rootNode.initEdges(true);
}
```

#### `createEdge(rootNode, edgeData, settings)`
Creates a single edge by finding source and target nodes:

```javascript
export function createEdge(rootNode, edgeData, settings) {
  const source = rootNode.getNode(edgeData.source);
  const target = rootNode.getNode(edgeData.target);
  createInternalEdge(edgeData, source, target, settings);
}
```

#### `createInternalEdge(edgeData, source, target, settings)`
Creates the actual edge instance:

```javascript
export function createInternalEdge(edgeData, source, target, settings) {
  const parents = buildEdgeParents(source, target);
  const parent = parents.container;
  
  // Check for existing edge
  if (source.edges.outgoing.find((edge) => edge.target === target)) {
    return;
  }
  
  const edge = new BaseEdge(edgeData, parents, settings);
  
  // Add to source and target
  source.edges.outgoing.push(edge);
  target.edges.incoming.push(edge);
  
  // Add to parent container
  parent.childEdges.push(edge);
}
```

### Parent Resolution

#### `buildEdgeParents(sourceNode, targetNode)`
Determines the common parent container and builds parent hierarchies:

```javascript
export function buildEdgeParents(sourceNode, targetNode) {
  const sourceParents = [sourceNode, ...sourceNode.getParents()];
  const targetParents = [targetNode, ...targetNode.getParents()];
  
  let container = null;
  const targetParentSet = new Set(targetParents);
  
  // Find common parent
  for (let i = 0; i < sourceParents.length; i++) {
    if (targetParentSet.has(sourceParents[i])) {
      container = sourceParents[i];
      break;
    }
  }
  
  // Prune parent arrays up to container
  const prunedSourceParents = sourceParents.slice(0, sourceParents.indexOf(container));
  const prunedTargetParents = targetParents.slice(0, targetParents.indexOf(container));
  
  return {
    source: prunedSourceParents,
    target: prunedTargetParents,
    container: container
  };
}
```

## BaseEdge Class

**File:** `edgeBase.js`

The base class for all edge implementations:

### Key Properties

- `data` - Edge configuration data
- `parents` - Parent hierarchy information
- `settings` - Dashboard settings
- `source` - Source node reference
- `target` - Target node reference
- `element` - D3 selection of edge SVG element
- `path` - D3 selection of path element
- `markers` - Arrow head markers

### Key Methods

#### `init(parentElement)`
Initializes the edge's SVG elements:

```javascript
init(parentElement = null) {
  if (parentElement) this.parentElement = parentElement;
  
  this.element = this.parentElement
    .append("g")
    .attr("class", "edge")
    .attr("id", this.id);
    
  this.path = this.element.append("path")
    .attr("class", "edge-path")
    .attr("marker-end", "url(#arrowhead)");
}
```

#### `update()`
Updates edge path and position:

```javascript
update() {
  const connectionPoints = this.getConnectionPoints();
  const pathData = this.calculatePath(connectionPoints);
  
  this.path.attr("d", pathData);
  this.updateMarkers(connectionPoints);
}
```

#### `getConnectionPoints()`
Gets connection points from source and target nodes:

```javascript
getConnectionPoints() {
  const sourcePoints = this.source.computeConnectionPoints(
    this.source.x, this.source.y, 
    this.source.data.width, this.source.data.height
  );
  
  const targetPoints = this.target.computeConnectionPoints(
    this.target.x, this.target.y,
    this.target.data.width, this.target.data.height
  );
  
  return { source: sourcePoints, target: targetPoints };
}
```

## Path Calculation

**File:** `utilPath.js`

Handles complex path routing between nodes:

### Key Functions

#### `computeConnectionPoints(x, y, width, height)`
Calculates connection points on node boundaries:

```javascript
export function computeConnectionPoints(x, y, width, height) {
  return {
    top: { x: x, y: y - height/2, side: 'top' },
    right: { x: x + width/2, y: y, side: 'right' },
    bottom: { x: x, y: y + height/2, side: 'bottom' },
    left: { x: x - width/2, y: y, side: 'left' }
  };
}
```

#### `calculatePath(connectionPoints)`
Computes the actual path between connection points:

```javascript
export function calculatePath(sourcePoint, targetPoint, edgeType = 'straight') {
  switch (edgeType) {
    case 'straight':
      return `M ${sourcePoint.x} ${sourcePoint.y} L ${targetPoint.x} ${targetPoint.y}`;
    case 'curved':
      return calculateCurvedPath(sourcePoint, targetPoint);
    case 'orthogonal':
      return calculateOrthogonalPath(sourcePoint, targetPoint);
  }
}
```

### Path Types

1. **Straight** - Direct line between points
2. **Curved** - Bezier curve with automatic control points
3. **Orthogonal** - Right-angled path with horizontal/vertical segments

## Markers

**File:** `markers.js`

Defines SVG markers for arrow heads and other symbols:

### Key Functions

#### `createMarkers(svg)`
Creates marker definitions in SVG:

```javascript
export function createMarkers(svg) {
  const defs = svg.append("defs");
  
  // Arrow head marker
  defs.append("marker")
    .attr("id", "arrowhead")
    .attr("viewBox", "0 -5 10 10")
    .attr("refX", 8)
    .attr("refY", 0)
    .attr("markerWidth", 6)
    .attr("markerHeight", 6)
    .attr("orient", "auto")
    .append("path")
    .attr("d", "M0,-5L10,0L0,5")
    .attr("fill", "#999");
}
```

## Edge Data Structure

Edges expect data in this format:

```javascript
{
  source: "source-node-id" | { id: "source-node-id" },
  target: "target-node-id" | { id: "target-node-id" },
  type: "SSIS|DataFlow|...",
  state: "Ready|Error|Warning|...",
  isActive: true,
  properties: {
    // Edge-specific properties
  }
}
```

## Edge Types

### Internal Edges
Edges between nodes within the same container, created automatically by container nodes (e.g., AdapterNode creates edges between staging, transform, and archive components).

### External Edges
Edges between nodes in different containers, created explicitly in the data.

## Performance Considerations

- **Lazy Updates** - Edges only update when nodes move
- **Path Caching** - Connection points cached to avoid recalculation
- **Batch Operations** - Multiple edge updates batched together
- **Efficient Selection** - Uses D3 selections for DOM manipulation

## Edge Routing Strategies

### 1. Direct Routing
Straight line between connection points.

### 2. Smart Routing
Automatically chooses best connection points based on relative positions.

### 3. Orthogonal Routing
Right-angled paths for cleaner visual appearance.

### 4. Curved Routing
Bezier curves for smooth, organic appearance.

## Edge Styling

Edges support various styling options:

- **Line Style** - Solid, dashed, dotted
- **Line Width** - Thickness of the edge
- **Color** - Based on edge type or status
- **Opacity** - For visual hierarchy
- **Markers** - Arrow heads, symbols, etc.

## Event Handling

Edges can respond to events:

```javascript
this.path.on("click", (event) => {
  event.stopPropagation();
  this.handleEdgeClick(event);
});
```

## Integration with Node System

Edges integrate closely with the node system:

- **Connection Points** - Nodes provide connection points for edge routing
- **Status Propagation** - Edge appearance changes with node status
- **Visibility** - Edges hidden when source or target nodes are hidden
- **Selection** - Edges can be selected along with nodes 