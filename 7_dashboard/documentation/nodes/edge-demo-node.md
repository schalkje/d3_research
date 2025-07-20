# EdgeDemoNode

## Overview

`EdgeDemoNode` is a specialized container node type designed for testing and demonstrating edge connection patterns. It provides multiple demo layouts for showcasing different edge connection scenarios and testing edge rendering functionality.

## Inheritance

- **Parent**: [BaseContainerNode](base-container-node.md)
- **Children**: Auto-created demo components

## Key Features

### Demo Layouts
- **6 Demo Modes**: Different arrangements for testing edge connections
- **Edge Testing**: Comprehensive edge connection testing
- **Visual Patterns**: Various visual patterns for demonstration
- **Dynamic Sizing**: Container adapts to demo layout requirements

### Demo-Specific Behavior
- **Component Management**: Automatic demo component creation
- **Edge Patterns**: Different edge connection patterns
- **Layout Testing**: Testing various layout algorithms
- **Visual Demonstration**: Clear visual demonstration of capabilities

## Properties

### EdgeDemo-Specific Properties
```javascript
// Demo modes
const DemoMode = {
  GRID: "grid",                 // Grid arrangement
  HSHIFTED: "h-shifted",        // Horizontally shifted
  VSHIFTED: "v-shifted",        // Vertically shifted
  VSHIFTED2: "v-shifted2",      // Alternative vertical shift
  STAIR_UP: "stair-up",         // Staircase upward
  STAIR_DOWN: "stair-down"      // Staircase downward
};

// Layout configuration
this.layout = DemoMode.GRID;    // Current demo layout mode
this.shiftRatio = 0.6;          // Shift ratio for shifted layouts
this.shift2Ratio = 0.8;         // Alternative shift ratio

// Component management
this.childNodes = [];           // Array of demo component instances
this.createNode = createNode;   // Node factory function

// Spacing configuration
this.nodeSpacing = {            // Spacing between demo components
  horizontal: 30,
  vertical: 20
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
Initializes the edge demo node with demo layout configuration.

**Parameters:**
- `nodeData` - Node configuration object
- `parentElement` - Parent SVG container
- `createNode` - Node factory function for creating children
- `settings` - Global settings object
- `parentNode` - Parent node instance (optional)

**Initialization Steps:**
- Sets up demo-specific configuration
- Initializes demo layout mode
- Configures shift ratios and spacing
- Sets up layout settings
- Calls parent constructor

#### `initChildren()`
Initializes demo components and positions them according to demo layout.

**Process:**
- Creates demo components using factory function
- Adds components to child nodes array
- Initializes each component
- Positions components according to demo layout
- Integrates with zone system

### Layout Methods

#### `updateChildren()`
Updates component positioning based on current demo layout mode.

**Layout Algorithm:**
```javascript
// Select layout method based on demo mode
switch (this.layout) {
  case DemoMode.GRID:
    this.updateGridLayout();
    break;
  case DemoMode.HSHIFTED:
    this.updateHShiftedLayout();
    break;
  case DemoMode.VSHIFTED:
    this.updateVShiftedLayout();
    break;
  case DemoMode.VSHIFTED2:
    this.updateVShifted2Layout();
    break;
  case DemoMode.STAIR_UP:
    this.updateStairUpLayout();
    break;
  case DemoMode.STAIR_DOWN:
    this.updateStairDownLayout();
    break;
}
```

#### `updateGridLayout()`
Creates a grid arrangement of demo components.

**Layout:**
```
[1] [2] [3]
[4] [5] [6]
[7] [8] [9]
```

#### `updateHShiftedLayout()`
Creates a horizontally shifted arrangement.

**Layout:**
```
[1] [2] [3]
  [4] [5] [6]
[7] [8] [9]
```

#### `updateVShiftedLayout()`
Creates a vertically shifted arrangement.

**Layout:**
```
[1] [2] [3]
[4] [5] [6]
  [7] [8] [9]
```

#### `updateVShifted2Layout()`
Creates an alternative vertical shifted arrangement.

**Layout:**
```
[1] [2] [3]
  [4] [5] [6]
    [7] [8] [9]
```

#### `updateStairUpLayout()`
Creates an upward staircase arrangement.

**Layout:**
```
      [1]
    [2] [3]
  [4] [5] [6]
[7] [8] [9]
```

#### `updateStairDownLayout()`
Creates a downward staircase arrangement.

**Layout:**
```
[1] [2] [3] [4]
  [5] [6] [7]
    [8] [9]
```

### Demo Management

#### `createDemoComponents()`
Creates demo components for testing.

**Components Created:**
- **Grid Components**: 9 components arranged in 3x3 grid
- **Demo Labels**: Numbered components for easy identification
- **Edge Connections**: Various edge patterns between components

#### `updateDemoLayout()`
Updates the demo layout based on current mode.

**Process:**
- Determines current demo mode
- Selects appropriate layout algorithm
- Positions components according to layout
- Updates container size
- Creates edge connections

## Configuration

### EdgeDemo Node Settings
```javascript
const edgeDemoSettings = {
  // Demo configuration
  demoMode: "grid",             // grid, h-shifted, v-shifted, v-shifted2, stair-up, stair-down
  shiftRatio: 0.6,              // Shift ratio for shifted layouts
  shift2Ratio: 0.8,             // Alternative shift ratio
  
  // Layout configuration
  layout: {
    type: "edge-demo",          // Layout type identifier
    demoMode: "grid",           // Demo layout mode
    spacing: {
      horizontal: 30,           // Horizontal spacing between components
      vertical: 20              // Vertical spacing between components
    }
  },
  
  // Component configuration
  components: {
    count: 9,                   // Number of demo components
    type: "rect",               // Component type
    size: { width: 60, height: 40 } // Component size
  },
  
  // Edge configuration
  edges: {
    patterns: ["grid", "diagonal", "random"], // Edge connection patterns
    styling: "demo",            // Demo edge styling
    markers: true               // Show edge markers
  }
};
```

### Node Data Structure
```javascript
const edgeDemoNodeData = {
  id: "edge-demo-1",            // Required unique identifier
  type: "edge-demo",            // Node type identifier
  label: "Edge Demo",           // Display text
  x: 100,                       // X coordinate
  y: 200,                       // Y coordinate
  width: 334,                   // Container width
  height: 74,                   // Container height
  state: "active",              // Status
  layout: {                     // Layout configuration
    type: "edge-demo",
    demoMode: "grid"
  },
  // Demo components are auto-created
};
```

## Demo Layout Modes

### Grid Mode
Standard 3x3 grid arrangement:
```
[1] [2] [3]
[4] [5] [6]
[7] [8] [9]
```
- **Use Case**: Basic edge connection testing
- **Edge Patterns**: Horizontal and vertical connections
- **Testing**: Standard grid edge patterns

### H-Shifted Mode
Horizontally shifted grid:
```
[1] [2] [3]
  [4] [5] [6]
[7] [8] [9]
```
- **Use Case**: Diagonal edge testing
- **Edge Patterns**: Diagonal connections
- **Testing**: Shifted edge patterns

### V-Shifted Mode
Vertically shifted grid:
```
[1] [2] [3]
[4] [5] [6]
  [7] [8] [9]
```
- **Use Case**: Alternative diagonal testing
- **Edge Patterns**: Alternative diagonal connections
- **Testing**: Different shift patterns

### V-Shifted2 Mode
Alternative vertical shift:
```
[1] [2] [3]
  [4] [5] [6]
    [7] [8] [9]
```
- **Use Case**: Cascading edge testing
- **Edge Patterns**: Cascading connections
- **Testing**: Progressive shift patterns

### Stair-Up Mode
Upward staircase:
```
      [1]
    [2] [3]
  [4] [5] [6]
[7] [8] [9]
```
- **Use Case**: Complex edge pattern testing
- **Edge Patterns**: Multi-directional connections
- **Testing**: Complex edge scenarios

### Stair-Down Mode
Downward staircase:
```
[1] [2] [3] [4]
  [5] [6] [7]
    [8] [9]
```
- **Use Case**: Alternative complex pattern testing
- **Edge Patterns**: Alternative multi-directional connections
- **Testing**: Alternative complex scenarios

## Zone System Integration

### Zone Hierarchy
```
Container Zone (outermost)
├── Header Zone (top)
│   ├── Title: "Edge Demo"
│   └── Zoom/collapse button
├── Margin Zones (surrounding)
│   ├── Top Margin (4px from header)
│   ├── Right Margin (8px)
│   ├── Bottom Margin (8px)
│   └── Left Margin (8px)
└── Inner Container Zone (content area)
    └── Demo Components (arranged by demo mode)
```

### Zone Management
- **Header Zone**: Displays demo title and controls
- **Inner Container Zone**: Manages component positioning
- **Margin Zones**: Provide consistent spacing
- **Coordinate System**: Components positioned relative to inner container

## Performance Considerations

### Layout Optimization
- **Mode-Based Layouts**: Efficient layout selection based on demo mode
- **Component Caching**: Component references cached for performance
- **Edge Optimization**: Edge creation optimized for demo patterns
- **Position Caching**: Component positions cached when possible

### Memory Management
- **Component Lifecycle**: Proper component creation and cleanup
- **Edge Management**: Demo edge cleanup
- **Reference Management**: Avoiding circular references
- **Zone Cleanup**: Zone system properly destroyed

## Use Cases

### Common Applications
- **Edge Testing**: Testing edge connection functionality
- **Layout Testing**: Testing various layout algorithms
- **Visual Demonstration**: Demonstrating edge capabilities
- **Development Testing**: Development and debugging

### Typical Scenarios
- **Edge Rendering**: Testing edge rendering performance
- **Layout Algorithms**: Testing layout algorithm behavior
- **Visual Patterns**: Demonstrating visual patterns
- **Integration Testing**: Testing edge integration

## Integration

### Parent Container Integration
Edge demo nodes work well within other container nodes:
- **GroupNode**: Demo groups for different test scenarios
- **LaneNode**: Demo arranged vertically for testing
- **ColumnsNode**: Demo arranged horizontally for comparison
- **AdapterNode**: As adapter components

### Component Integration
Edge demo components are typically:
- **RectangularNode**: Standard demo component representation
- **Numbered Labels**: Easy identification of components
- **Edge Connections**: Various edge patterns
- **Visual Indicators**: Clear visual demonstration

## Testing

### Unit Testing
- **Constructor Tests**: Proper initialization with various demo modes
- **Layout Tests**: All 6 demo mode validations
- **Component Tests**: Demo component creation and management
- **Edge Tests**: Edge pattern creation and management

### Integration Testing
- **Parent-Child Relationships**: Container-component interactions
- **Zone System**: Zone management and positioning
- **Edge Integration**: Edge system integration
- **Performance**: Large numbers of demo components

## Navigation

- **[Documentation Overview](../README.md)** - Back to main documentation
- **[BaseContainerNode](base-container-node.md)** - Parent class documentation
- **[GroupNode](group-node.md)** - Alternative dynamic container
- **[RectangularNode](rectangular-node.md)** - Common demo component type
- **[Implementation Details](../../implementation.md)** - Technical implementation

## Related Classes

### Dependencies
- **BaseContainerNode** - Container functionality
- **ZoneManager** - Zone system management
- **LayoutManager** - Layout algorithm management
- **ConfigManager** - Configuration management

### Common Components
- **RectangularNode** - Standard demo component type
- **Numbered Components** - Easy identification components
- **Edge Patterns** - Various edge connection patterns

### Related Containers
- **GroupNode** - Alternative dynamic layout
- **LaneNode** - Structured layout alternative
- **ColumnsNode** - Structured layout alternative
- **AdapterNode** - Component-based alternative 