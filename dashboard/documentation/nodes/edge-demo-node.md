# EdgeDemoNode

## Overview

`EdgeDemoNode` is a specialized container node type designed for testing and demonstrating edge connection patterns. It auto-creates a small set of rectangular child nodes in different arrangements and draws internal edges using the edge system.

## Inheritance

- Parent: `BaseContainerNode`
- Children: Auto-created `RectangularNode` instances

## Demo Layouts

There are six layout modes used to place children relative to a center node:

- `grid`
- `h-shifted`
- `v-shifted`
- `v-shifted2`
- `stair-up`
- `stair-down`

## Properties

```javascript
// Modes
const DemoMode = Object.freeze({
  GRID: 'grid',
  HSHIFTED: 'h-shifted',
  VSHIFTED: 'v-shifted',
  VSHIFTED2: 'v-shifted2',
  STAIR_UP: 'stair-up',
  STAIR_DOWN: 'stair-down',
});

// Selected from nodeData.layout.type (defaults to grid)
this.layout = this.data.layout?.type || DemoMode.GRID;

// Shift ratios
this.shiftRatio = this.data.shiftRatio || 0.6;
this.shift2Ratio = this.data.shift2Ratio || 0.8;

// Spacing between child nodes
this.nodeSpacing = this.data.nodeSpacing || { horizontal: 30, vertical: 20 };
```

All container functionality (zones, margins, size management, events) is inherited from `BaseContainerNode`.

## Methods

### `constructor(nodeData, parentElement, createNode, settings, parentNode = null)`
Sets width/height defaults, calls super, normalizes `layout` into an object, and initializes demo configuration.

### `renderChildren()`
Creates the center child node and calls one of the layout methods below to add surrounding children. After children are created and positioned, the container is resized and internal edges are initialized.

### Layout Methods

- `gridLayout()`
- `hshiftedLayout()`
- `vshiftedLayout()`
- `vshifted2Layout()`
- `stairUpLayout()`
- `stairDownLayout()`

Each method positions one or more children around the center and calls `createChild(...)` which internally uses `createInternalEdge(...)` to connect the center to the newly created child.

### `createChild(sourceNode, id, x, y)`
Adds a child definition, instantiates a `RectangularNode`, moves it into position, and (if `sourceNode` is provided) creates an internal edge connecting `sourceNode -> child` using the edge system.

### `resizeToFitChildren()`
Expands the container to fit the created child nodes taking container margins into account.

## Data and Configuration

### Node Data Structure

```javascript
const edgeDemoNodeData = {
  id: 'edge-demo-1',
  type: 'edge-demo',
  label: 'Edge Demo',
  x: 100,
  y: 200,
  width: 334,
  height: 74,
  state: 'active',
  layout: { type: 'grid' }, // one of DemoMode values
  // children are auto-created
};
```

### Settings Interactions

The dashboard settings influence edge rendering:

- `showGhostlines` – draws faint midlines between node centers
- `curved` – uses a curved line generator for edge paths
- `curveMargin` – influences waypoint placement for curved paths

## Layout Sketches

```
Grid:
[top-left]   [top]   [top-right]
   [left]   [center]   [right]
[bottom-left] [bottom] [bottom-right]

H-Shifted: symmetric vertical shifts on left/right
V-Shifted: symmetric horizontal shifts on top/bottom
V-Shifted2: stronger shift ratios than V-Shifted
Stair-Up / Stair-Down: two diagonally opposed children
```

## Zone System Integration

Positions are applied within the container’s inner zone coordinate system provided by `BaseContainerNode`. The edge system accounts for inner zone translations when computing global coordinates, ensuring edges align correctly with child nodes.

## Use Cases

- Visual validation of edge routing and connection point selection
- Regression tests for edge rendering with different layouts
- Demonstration of the `curved` and `ghostline` settings

## See Also

- `BaseContainerNode`
- `RectangularNode`
- `edge.js` (factory)
- `edgeBase.js` (rendering)
- `utilPath.js` (path generation)