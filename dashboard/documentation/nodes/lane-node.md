# LaneNode

## Overview

The `LaneNode` class is a specialized container node that arranges child nodes in a vertical stack with horizontal centering. It extends `BaseContainerNode` to provide a single-column layout ideal for hierarchical data representation, process flows, and vertical organization of related elements. The LaneNode fully integrates with the zone system for sophisticated layout management and automatic sizing.

## Class Definition

```javascript
export default class LaneNode extends BaseContainerNode {
  constructor(nodeData, parentElement, createNode, settings, parentNode = null)
}
```

## Inheritance Hierarchy

- **Parent**: `BaseContainerNode` - Container functionality with zone system
- **Children**: Any node type can be contained
- **Siblings**: Other container node types
  - `ColumnsNode` - Horizontal layout container
  - `GroupNode` - Dynamic positioning container
  - `AdapterNode` - Multi-arrangement specialist
  - `FoundationNode` - Role-based specialist
  - `MartNode` - Role-based specialist

## Key Features

### Layout Strategy
- **Vertical Stacking**: Children arranged in single vertical column
- **Horizontal Centering**: Each child centered within container width
- **Automatic Spacing**: Configurable vertical spacing between children
- **Dynamic Sizing**: Container height adapts to child content

### Container Behavior
- **Zone System**: Fully integrated with zone system for layout management
- **Collapse/Expand**: Support for hiding/showing child content
- **Margin Management**: Automatic margin application around content
- **Child Lifecycle**: Complete child management and positioning

## Core Properties

### Lane-Specific Properties
```javascript
// Layout configuration
this.nodeSpacing = {            // Spacing between child nodes
  horizontal: 20,               // Horizontal spacing (not used in lane)
  vertical: 10                  // Vertical spacing between children
};

// Container margins (inherited from BaseContainerNode)
this.containerMargin = {        // Margins around container content
  top: 4,                       // Space from header bottom
  right: 8,                     // Space from right edge
  bottom: 8,                    // Space from bottom edge
  left: 8                       // Space from left edge
};

// Child management (inherited from BaseContainerNode)
this.childNodes = [];           // Array of child node instances
this.createNode = createNode;   // Node factory function
```

### Inherited Properties
All properties from `BaseContainerNode` are inherited, including:
- Container identification and state management
- Zone system management (`zoneManager`, `zones`)
- Event handling and configuration
- DOM element references
- Collapse/expand functionality

## Constructor

### Signature
```javascript
constructor(nodeData, parentElement, createNode, settings, parentNode = null)
```

### Parameters
- `nodeData` (Object) - Node configuration object
- `parentElement` (SVGElement) - Parent SVG container
- `createNode` (Function) - Node factory function for creating children
- `settings` (Object) - Global settings object
- `parentNode` (BaseContainerNode, optional) - Parent node instance

### Initialization Process
1. Calls parent constructor with all parameters
2. Inherits zone system initialization from BaseContainerNode
3. Sets up vertical stacking layout configuration
4. Initializes child management arrays
5. Configures spacing and margin settings

## Zone System Integration

### Zone Hierarchy
```
Container Zone (outermost)
├── Header Zone (top)
│   ├── Title: "Process Lane"
│   ├── Status indicator
│   └── Zoom/collapse button
├── Margin Zones (surrounding)
│   ├── Top Margin (4px from header)
│   ├── Right Margin (8px)
│   ├── Bottom Margin (8px)
│   └── Left Margin (8px)
└── Inner Container Zone (content area)
    └── Child Nodes (vertically stacked)
```

### Zone Responsibilities

#### Header Zone
**Purpose**: Display lane title and container controls
**Positioning**: Top of container (y=0 relative to container)
**Sizing**: Full width minus left/right margins, configurable height
**Content**: 
- Title text (left-aligned with 4px padding)
- Status indicator (small circle)
- Zoom button (for collapse/expand functionality)
- Minimum height: 10px

#### Margin Zones
**Purpose**: Provide visual separation and breathing room
**Positioning**: Around inner container zone
**Sizing**: Configurable thickness (default: top=4px, sides=8px, bottom=8px)
**Content**: Invisible spacing areas

#### Inner Container Zone
**Purpose**: Position and manage child nodes in vertical stack
**Positioning**: Below header zone with top margin offset
**Sizing**: Dynamic based on child content and spacing
**Content**: Child nodes positioned by vertical stacking algorithm
**Coordinate System**: Top-left origin for child positioning

### Zone Coordinate Systems

#### Container Zone Coordinate System
- **Origin**: Container center point in parent coordinate system
- **Positioning**: Container positioned by its center point
- **Transform**: Applied to center point for movement

#### Header Zone Coordinate System
- **Origin**: Top-left of header zone (relative to container)
- **Positioning**: Positioned at top of container (y=0)
- **Sizing**: Full width minus margins, calculated height

#### Inner Container Zone Coordinate System
- **Origin**: Top-left of inner container zone
- **Positioning**: Below header with top margin offset
- **Sizing**: Available width/height minus margins
- **Child Positioning**: Children positioned relative to this coordinate system

## Layout System

### Vertical Stacking Algorithm

#### Algorithm Overview
The LaneNode implements a sophisticated vertical stacking algorithm that:
1. Centers each child horizontally within the container
2. Stacks children vertically with configurable spacing
3. Automatically calculates container size based on child content
4. Integrates with zone system for precise positioning

#### Layout Process
```javascript
// Set vertical stacking layout algorithm
innerContainerZone.setLayoutAlgorithm((childNodes, coordinateSystem) => {
  if (childNodes.length === 0) return;

  const spacing = this.nodeSpacing?.vertical || 10;
  let currentY = 0;

  childNodes.forEach(childNode => {
    // Center horizontally within the inner container
    const availableWidth = coordinateSystem.size.width;
    const x = (availableWidth - childNode.data.width) / 2;
    const y = currentY;

    childNode.move(x, y);
    currentY += childNode.data.height + spacing;
  });
});
```

#### Positioning Logic
1. **Horizontal Centering**: Each child is centered within available width
   ```javascript
   const x = (availableWidth - childNode.data.width) / 2;
   ```

2. **Vertical Stacking**: Children positioned sequentially with spacing
   ```javascript
   const y = currentY;
   currentY += childNode.data.height + spacing;
   ```

3. **Spacing Management**: Configurable vertical spacing between children
   - Default spacing: 10px
   - No spacing before first child
   - Spacing applied between each pair of children

#### Size Calculation
```javascript
// Calculate required size for children
const totalChildHeight = this.childNodes.reduce((sum, node) => sum + node.data.height, 0);
const totalSpacing = this.childNodes.length > 1 ? (this.childNodes.length - 1) * this.nodeSpacing.vertical : 0;
const maxChildWidth = Math.max(...this.childNodes.map(node => node.data.width));

// Get margin zone for size calculations
const marginZone = this.zoneManager?.marginZone;
const headerZone = this.zoneManager?.headerZone;
const headerHeight = headerZone ? headerZone.getHeaderHeight() : 20;

if (marginZone) {
  const requiredSize = marginZone.calculateContainerSize(
    maxChildWidth,
    totalChildHeight + totalSpacing,
    headerHeight
  );

  // Resize container to accommodate all children
  this.resize({
    width: Math.max(this.data.width, requiredSize.width),
    height: Math.max(this.data.height, requiredSize.height)
  });
}
```

## Methods

### Core Methods

#### `updateChildren()`
Updates child positioning and container sizing using zone-based layout.

**Process:**
1. Calls `layoutLane()` for zone-based layout
2. Integrates with zone system for precise positioning
3. Calculates container size based on child content
4. Updates child positions using zone coordinate system

#### `layoutLane()`
Implements the primary layout algorithm using zone system.

**Features:**
- Uses zone system for layout management
- Falls back to legacy layout if zone system unavailable
- Sets vertical stacking layout algorithm on inner container zone
- Calculates required container size
- Updates child positions using zone system

#### `layoutLaneLegacy()`
Legacy layout algorithm for backward compatibility.

**Features:**
- Manual positioning without zone system
- Simplified vertical stacking
- Basic size calculation
- Direct child positioning

#### `arrange()`
Public method for triggering layout updates.

**Process:**
1. Logs arrangement operation
2. Calls `updateChildren()` for layout update

### Child Management

#### `addChild(childNode)`
Adds a child node to the lane and updates layout.

**Process:**
- Adds child to child nodes array
- Sets up parent-child relationship
- Recalculates vertical stack layout
- Updates container size
- Integrates with zone system

#### `removeChild(childNode)`
Removes a child node from the lane and updates layout.

**Process:**
- Removes child from child nodes array
- Cleans up parent-child relationship
- Recalculates vertical stack layout
- Updates container size
- Removes from zone system

### Child Positioning
Children are positioned within the inner container zone using:
- **Horizontal**: Centered within available width
- **Vertical**: Stacked with configurable spacing
- **Coordinate System**: Top-left origin of inner container zone
- **Transform**: Applied through zone system

## Configuration

### Lane Node Settings
```javascript
const laneSettings = {
  // Layout configuration
  layout: {
    type: "vertical-stack",     // Layout type identifier
    spacing: {
      vertical: 10,             // Vertical spacing between children
      horizontal: 20            // Horizontal spacing (not used)
    },
    alignment: "center",        // Horizontal alignment of children
    minimumSize: {              // Minimum container size
      width: 100,
      height: 60,
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
    maintainOrder: true         // Maintain child order
  }
};
```

### Node Data Structure
```javascript
const laneNodeData = {
  id: "lane-1",                 // Required unique identifier
  type: "lane",                 // Node type identifier
  label: "Process Lane",        // Display text
  x: 100,                       // X coordinate
  y: 200,                       // Y coordinate
  width: 200,                   // Container width
  height: 0,                    // Height (auto-calculated)
  state: "Ready",               // Status
  layout: {                     // Layout configuration
    type: "vertical-stack",
    spacing: { vertical: 10 }
  },
  children: [                   // Child node definitions
    { id: "child-1", type: "rect", label: "Step 1" },
    { id: "child-2", type: "rect", label: "Step 2" },
    { id: "child-3", type: "rect", label: "Step 3" }
  ]
};
```

## Zone System Implementation

### Zone Manager Integration
The LaneNode fully integrates with the zone system through `BaseContainerNode`:

```javascript
// Zone manager provides unified interface
this.zoneManager = new ZoneManager(this);

// Zone references for direct access
this.zones = {
  header: this.zoneManager.getZone('header'),
  margin: this.zoneManager.getZone('margin'),
  inner: this.zoneManager.getZone('innerContainer')
};
```

### Zone-Specific Behaviors

#### Header Zone Features
- **Text Rendering**: Left-aligned text with configurable padding
- **Height Calculation**: Text-based with minimum height constraint (10px)
- **Status Indicators**: Visual status representation
- **Zoom Controls**: Collapse/expand functionality
- **Interaction Handling**: Click, hover, and focus events

#### Margin Zone Features
- **Margin Management**: Configurable spacing around content
- **Size Calculation**: Automatic margin-aware sizing
- **Position Constraints**: Boundary validation for child positioning
- **Coordinate Transformation**: Margin-aware positioning utilities

#### Inner Container Zone Features
- **Child Positioning**: Vertical stacking with horizontal centering
- **Layout Algorithm**: Custom vertical stacking algorithm
- **Size Adaptation**: Dynamic sizing based on child content
- **Coordinate System**: Top-left origin for child positioning
- **Child Lifecycle**: Addition, removal, and update management

### Coordinate System Management

#### Zone Coordinate Relationships
```
Parent Coordinate System
└── Container Zone (center-based)
    ├── Header Zone (top-left origin)
    ├── Margin Zones (layout-only)
    └── Inner Container Zone (top-left origin)
        └── Child Nodes (positioned here)
```

#### Transform Chain
1. **Container Transform**: Applied to container center point
2. **Header Transform**: Positioned at container top
3. **Inner Container Transform**: Positioned below header with margin offset
4. **Child Transform**: Positioned within inner container coordinate system

## Layout Algorithm Details

### Vertical Stacking Algorithm
The lane node uses a sophisticated vertical stacking algorithm:

1. **Space Calculation**:
   - Available width = container width - left margin - right margin
   - Starting Y position = top margin

2. **Child Positioning**:
   - Each child is centered horizontally within available width
   - Vertical position = previous child bottom + spacing
   - X position = (available width - child width) / 2

3. **Container Sizing**:
   - Container height = last child bottom + bottom margin
   - Container width remains fixed (configurable)

4. **Spacing Management**:
   - Vertical spacing applied between each pair of children
   - No spacing before first child
   - No spacing after last child

### Horizontal Centering
Each child is automatically centered within the container:
```javascript
const x = (availableWidth - childNode.data.width) / 2;
```

This ensures:
- **Visual Balance**: Children appear centered regardless of their individual widths
- **Consistent Layout**: Uniform appearance across different child sizes
- **Responsive Design**: Layout adapts to container width changes

## Performance Considerations

### Layout Optimization
- **Zone-Based Layout**: Efficient positioning through zone system
- **Batch Updates**: Multiple child changes processed together
- **Position Caching**: Child positions cached to avoid recalculation
- **Lazy Updates**: Layout only recalculated when needed

### Memory Management
- **Child Cleanup**: Proper cleanup when children are removed
- **Event Delegation**: Efficient event handling for child interactions
- **Reference Management**: Avoiding circular references
- **Zone Cleanup**: Zone system properly destroyed

### Rendering Performance
- **Efficient Algorithms**: Optimized positioning calculations
- **Minimal DOM Updates**: Zone system minimizes DOM manipulation
- **Transform Optimization**: Efficient coordinate transformations
- **Size Calculation**: Cached size calculations where possible

## Error Handling

### Validation
- **Child Constraints**: Validate child positioning within bounds
- **Size Constraints**: Ensure minimum size requirements
- **Zone System**: Validate zone system availability
- **Layout Algorithm**: Validate layout algorithm execution

### Error Recovery
- **Fallback Layout**: Legacy layout if zone system unavailable
- **Graceful Degradation**: Fallback behavior for errors
- **State Recovery**: Automatic state restoration
- **User Feedback**: Clear error messages

## Testing Requirements

### Unit Testing
- **Constructor Tests**: Proper initialization with various parameters
- **Layout Tests**: Vertical stacking algorithm accuracy
- **Zone Integration Tests**: Zone system functionality
- **Child Management Tests**: Child addition/removal behavior
- **Size Calculation Tests**: Container sizing accuracy

### Integration Testing
- **Parent-Child Relationships**: Container-child interactions
- **Zone System Integration**: Complete zone functionality
- **Performance**: Large numbers of children
- **Memory Leaks**: Proper cleanup and garbage collection

### Test Scenarios
1. **Basic Initialization**: Lane creation with minimal data
2. **Child Addition**: Adding children to empty lane
3. **Child Removal**: Removing children from lane
4. **Layout Updates**: Layout recalculation scenarios
5. **Zone System**: Zone-based layout functionality
6. **Performance**: Large numbers of children
7. **Error Conditions**: Invalid data and edge cases
8. **Collapse/Expand**: Container collapse functionality

## Dependencies

### Required Dependencies
- **BaseContainerNode** - Container functionality and zone system
- **ZoneManager** - Zone system management
- **LayoutManager** - Layout algorithm management
- **ConfigManager** - Configuration management

### Zone Dependencies
- **HeaderZone** - Header zone functionality
- **MarginZone** - Margin zone functionality
- **InnerContainerZone** - Inner container zone functionality

## Use Cases

### Common Applications
- **Process Flows**: Sequential process steps
- **Data Pipelines**: Data transformation stages
- **Workflow Diagrams**: Task sequences
- **Hierarchical Data**: Tree-like data structures

### Typical Scenarios
- **Data Processing**: ETL pipeline stages
- **Business Processes**: Process flow steps
- **System Architecture**: Component hierarchies
- **Project Management**: Task sequences

## Integration

### Parent Container Integration
Lane nodes work well within other container nodes:
- **GroupNode**: Multiple lanes for different categories
- **ColumnsNode**: Lanes arranged horizontally
- **AdapterNode**: As component elements
- **FoundationNode**: As foundation components

### Child Node Integration
Lane nodes can contain any node type:
- **RectangularNode**: Most common child type
- **CircleNode**: Alternative child representation
- **Container Nodes**: Nested container structures
- **Custom Nodes**: Any custom node implementation

## Navigation

- **[Documentation Overview](../README.md)** - Back to main documentation
- **[BaseContainerNode](base-container-node.md)** - Parent class documentation
- **[ColumnsNode](columns-node.md)** - Alternative horizontal layout
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
- **ColumnsNode** - Horizontal alternative
- **GroupNode** - Dynamic positioning
- **AdapterNode** - Multi-arrangement
- **FoundationNode** - Role-based layout 