# ColumnsNode

## Overview

The `ColumnsNode` class is a specialized container node that arranges child nodes in a horizontal row with vertical centering. It extends `BaseContainerNode` to provide a single-row layout ideal for parallel processes, side-by-side comparisons, and horizontal organization of related elements. The ColumnsNode fully integrates with the zone system for sophisticated layout management and automatic sizing.

## Class Definition

```javascript
export default class ColumnsNode extends BaseContainerNode {
  constructor(nodeData, parentElement, createNode, settings, parentNode = null)
}
```

## Inheritance Hierarchy

- **Parent**: `BaseContainerNode` - Container functionality with zone system
- **Children**: Any node type can be contained
- **Siblings**: Other container node types
  - `LaneNode` - Vertical layout container
  - `GroupNode` - Dynamic positioning container
  - `AdapterNode` - Multi-arrangement specialist
  - `FoundationNode` - Role-based specialist
  - `MartNode` - Role-based specialist

## Key Features

### Layout Strategy
- **Horizontal Row**: Children arranged in single horizontal row
- **Vertical Centering**: Each child centered within container height
- **Automatic Spacing**: Configurable horizontal spacing between children
- **Dynamic Sizing**: Container width adapts to child content

### Container Behavior
- **Zone System**: Fully integrated with zone system for layout management
- **Collapse/Expand**: Support for hiding/showing child content (not implemented yet)
- **Margin Management**: Automatic margin application around content
- **Child Lifecycle**: Complete child management and positioning

## Core Properties

### Columns-Specific Properties
```javascript
// Layout configuration
this.nodeSpacing = {            // Spacing between child nodes
  horizontal: 20,               // Horizontal spacing between children
  vertical: 10                  // Vertical spacing (not used in columns)
};

// Container margins (inherited from BaseContainerNode)
this.containerMargin = {        // Margins around container content
  top: 20,                      // Space from header bottom
  right: 10,                    // Space from right edge
  bottom: 10,                   // Space from bottom edge
  left: 10                      // Space from left edge
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

// Zone system integration
this.zoneManager = null;        // Zone system manager instance
this.innerContainerZone = null; // Inner container zone reference
```

### Layout Algorithm Properties
```javascript
// Positioning calculation properties
this.nestedCorrection_x = this.x - this.data.width / 2 + this.containerMargin.left;
this.nestedCorrection_y = this.y + this.containerMargin.top / 2;

// Container state
this.suspenseDisplayChange = false;  // Layout update suspension flag
```

### Inherited Properties
All properties from [BaseContainerNode](base-container-node.md) are inherited, including:
- Container identification and state
- Zone system management
- Event handling and configuration
- DOM element references

## Core Methods

### Constructor and Initialization

#### `constructor(nodeData, parentElement, createNode, settings, parentNode = null)`
Initializes the columns node with horizontal row configuration.

**Parameters:**
- `nodeData` - Node configuration object
- `parentElement` - Parent SVG container
- `createNode` - Node factory function for creating children
- `settings` - Global settings object
- `parentNode` - Parent node instance (optional)

**Initialization Steps:**
- Sets up default layout configuration for minimum column width and size
- Calls parent constructor to initialize base container functionality
- Inherits zone system integration from BaseContainerNode

```javascript
constructor(nodeData, parentElement, createNode, settings, parentNode = null) {
  nodeData.layout ??= {};
  nodeData.layout.minimumColumnWidth ??= 0;
  nodeData.layout.minimumSize ??= { height: 50, useRootRatio: false };

  super(nodeData, parentElement, createNode, settings, parentNode);
}
```

### Layout Methods

#### `updateChildren()`
Main method for updating child positioning and container sizing using horizontal row algorithm.

**Process:**
1. Suspends display change notifications during layout
2. Calls `layoutColumns()` to perform actual layout
3. Resumes display change notifications
4. Triggers display change handling

```javascript
updateChildren() {
  this.suspenseDisplayChange = true;
  this.layoutColumns();
  this.suspenseDisplayChange = false;
  this.handleDisplayChange();
}
```

#### `updateChildrenWithZoneSystem()`
Zone system specific update method for child positioning.

**Process:**
- Called by zone system when layout update is needed
- Delegates to `layoutColumns()` for actual positioning

#### `layoutColumns()`
Core layout algorithm that handles both zone system and legacy layout modes.

**Algorithm Flow:**
1. Checks if children exist
2. Attempts to use zone system layout if available
3. Falls back to legacy layout if zone system not available
4. Updates container size based on child requirements

**Zone System Layout (Primary):**
```javascript
// Set horizontal row layout algorithm
innerContainerZone.setLayoutAlgorithm((childNodes, coordinateSystem) => {
  const spacing = this.nodeSpacing?.horizontal || 20;
  let currentX = 0;

  // Only position visible children
  const visibleChildNodes = childNodes.filter(childNode => childNode.visible);

  visibleChildNodes.forEach(childNode => {
    const x = currentX;
    // Center vertically within the inner container
    const availableHeight = coordinateSystem.size.height;
    const y = (availableHeight - childNode.data.height) / 2;

    childNode.move(x, y);
    currentX += childNode.data.width + spacing;
  });
});

// Calculate required size for visible children only
const visibleChildren = this.childNodes.filter(node => node.visible);
const totalChildWidth = visibleChildren.reduce((sum, node) => sum + node.data.width, 0);
const totalSpacing = visibleChildren.length > 1 ? (visibleChildren.length - 1) * this.nodeSpacing.horizontal : 0;
const maxChildHeight = visibleChildren.length > 0 
  ? Math.max(...visibleChildren.map(node => node.data.height))
  : 0;
```

**Legacy Layout (Fallback):**
```javascript
// Calculate total width needed for visible children only
const visibleChildren = this.childNodes.filter(node => node.visible);
const totalChildWidth = visibleChildren.reduce((sum, node) => sum + node.data.width, 0);
const totalSpacing = visibleChildren.length > 1 ? (visibleChildren.length - 1) * this.nodeSpacing.horizontal : 0;

// Calculate max height needed for visible children
const maxChildHeight = visibleChildren.length > 0 
  ? Math.max(...visibleChildren.map(node => node.data.height))
  : 0;

// Calculate container size needed
const contentWidth = totalChildWidth + totalSpacing + this.containerMargin.left + this.containerMargin.right;
const contentHeight = maxChildHeight + this.containerMargin.top + this.containerMargin.bottom;

// Resize container to accommodate all children
this.resize({
  width: Math.max(this.data.width, contentWidth),
  height: Math.max(this.data.height, contentHeight)
});
```

#### `layoutColumnsLegacy()`
Legacy layout method for systems without zone system support.

**Process:**
- Calculates total width and maximum height of visible children
- Determines container size requirements
- Positions children manually with margin considerations
- Handles container transformation offsets

#### `arrange()`
Public method to trigger layout arrangement.

**Process:**
- Called by external systems to request layout update
- Simply delegates to `updateChildren()` for actual layout work
- Provides clean API for layout operations

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
│   ├── Top Margin (8px from header)
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

## Demonstration Examples

### Basic Horizontal Layout
The most common use case - three rectangular children in a horizontal row:

```javascript
const basicColumnsData = {
  id: "columns1",
  label: "Process Columns",
  type: "columns",
  code: "C1",
  status: "Ready",
  layout: {
    displayMode: "full",
    arrangement: "default"
  },
  children: [
    {
      id: "rect1",
      label: "Column 1",
      type: "rect",
      code: "C1",
      status: "Ready",
      parentId: "columns1"
    },
    {
      id: "rect2", 
      label: "Column 2",
      type: "rect",
      code: "C2",
      status: "Ready",
      parentId: "columns1"
    },
    {
      id: "rect3",
      label: "Column 3", 
      type: "rect",
      code: "C3",
      status: "Ready",
      parentId: "columns1"
    }
  ]
};
```

### Variable Width Layout
Children with different sizes that adapt automatically:

```javascript
const variableWidthData = {
  id: "variable-columns",
  label: "Variable Width Columns",
  type: "columns",
  code: "VAR1",
  status: "Ready",
  layout: {
    displayMode: "full",
    arrangement: "variable-width",
    minimumColumnWidth: 80
  },
  children: [
    {
      id: "narrow-rect",
      label: "Narrow",
      type: "rect",
      code: "NAR",
      layout: {
        displayMode: "code",
        arrangement: "compact",
        maxWidth: 100
      }
    },
    {
      id: "wide-rect", 
      label: "Wide Content Area",
      type: "rect",
      code: "WIDE",
      layout: {
        displayMode: "full",
        arrangement: "expanded",
        minWidth: 200
      }
    }
  ]
};
```

### Nested Columns Layout
Columns containing other columns for complex hierarchies:

```javascript
const nestedColumnsData = {
  id: "parent-columns",
  label: "Parent Columns",
  type: "columns",
  code: "PC1",
  status: "Ready",
  children: [
    {
      id: "left-section",
      label: "Left Section", 
      type: "columns",
      code: "LS",
      children: [
        { id: "left-1", label: "L1", type: "rect", code: "L1" },
        { id: "left-2", label: "L2", type: "rect", code: "L2" }
      ]
    },
    {
      id: "middle-rect",
      label: "Middle Column",
      type: "rect", 
      code: "MID"
    },
    {
      id: "right-section",
      label: "Right Section",
      type: "columns",
      code: "RS", 
      children: [
        { id: "right-1", label: "R1", type: "rect", code: "R1" },
        { id: "right-2", label: "R2", type: "rect", code: "R2" },
        { id: "right-3", label: "R3", type: "rect", code: "R3" }
      ]
    }
  ]
};
```

### Mixed Child Types
Columns containing different node types:

```javascript
const mixedChildrenData = {
  id: "mixed-columns",
  label: "Mixed Children Columns",
  type: "columns", 
  code: "MIX1",
  children: [
    {
      id: "rect-child",
      label: "Rectangle",
      type: "rect",
      code: "RECT"
    },
    {
      id: "circle-child", 
      label: "Circle",
      type: "circle",
      code: "CIRC"
    },
    {
      id: "lane-child",
      label: "Lane Container",
      type: "lane",
      code: "LANE",
      children: [
        { id: "nested-rect1", label: "Nested 1", type: "rect", code: "N1" },
        { id: "nested-rect2", label: "Nested 2", type: "rect", code: "N2" }
      ]
    },
    {
      id: "adapter-child",
      label: "Adapter", 
      type: "adapter",
      code: "ADPT"
    }
  ]
};
```

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

## Available Demonstrations

The ColumnsNode includes comprehensive demonstration pages showing various features and use cases:

### Basic Demos
- **Basic Layout**: Simple columns with three rectangular children
- **[Demo Location]**: `05_columnsNodes/01_basic/basic.html`

### Simple Tests (`05_columnsNodes/01_simple-tests/`)
- **01_default-mode**: Columns with 3 rectangles in default mode
- **02_auto-size-mode**: Auto-sizing with variable child sizes  
- **03_fixed-size-mode**: Fixed-size children with consistent dimensions
- **04_dynamic-addition**: Dynamic addition of children with responsive layout

### Nested Tests (`05_columnsNodes/02_nested-tests/`)
- **05_nested-columns**: Columns containing other columns for complex layouts
- **06_mixed-children**: Columns containing different types of child nodes
- **07_variable-width**: Variable and constrained child widths

### Demo Features
Each demo includes:
- **Interactive Testing**: Built-in test runners
- **Visual Examples**: Real-time layout demonstration
- **Feature Showcase**: Specific functionality highlighting
- **Debug Information**: Layout calculation visibility

### Running Demos
```bash
# Open any demo HTML file in a browser
open 05_columnsNodes/01_basic/basic.html

# Run tests within demo
# Click "Run Tests" button in demo interface
```

## Testing

### Automated Testing
The ColumnsNode includes comprehensive automated tests covering:

#### Unit Testing
- **Constructor Tests**: Proper initialization with various configurations
- **Layout Tests**: Horizontal row algorithm validation
- **Child Management Tests**: Adding and removing children  
- **Size Calculation Tests**: Container sizing calculations
- **Zone System Tests**: Zone integration and positioning

#### Integration Testing
- **Parent-Child Relationships**: Container-child interactions
- **Zone System**: Zone management and positioning
- **Event Propagation**: Events flowing through hierarchy
- **Performance**: Large numbers of children
- **Cross-Browser**: Multiple browser compatibility

#### Demo Testing
- **Visual Regression**: Layout appearance validation
- **Interactive Features**: User interaction testing
- **Data Structure**: Demo data integrity  
- **Performance Metrics**: Rendering speed validation

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