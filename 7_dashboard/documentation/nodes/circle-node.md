# CircleNode

## Overview

`CircleNode` is a basic node type that renders as a circular shape with text content. It's designed for simple data representation and provides an alternative to rectangular nodes with a more compact, visually distinct appearance. The node automatically calculates its radius based on the maximum of width and height dimensions.

## Inheritance

- **Parent**: [BaseNode](base-node.md)
- **Children**: None (leaf node)

## Key Features

### Visual Representation
- **Shape**: Perfect circle with configurable radius
- **Text**: Centered label text
- **Sizing**: Radius-based sizing from width/height dimensions
- **Styling**: Status-based visual styling

### Automatic Sizing
- **Radius**: Calculated as half of the maximum width/height
- **Diameter**: Equal to the maximum of width and height
- **Bounding Box**: Square bounding box for consistent layout
- **Text Fitting**: Text positioned within circular bounds

## Properties

### Circle-Specific Properties
```javascript
// Size configuration
this.data.width = 60;           // Default width
this.data.height = 60;          // Default height
this.data.radius = 30;          // Calculated radius

// Text properties
this.data.label = "Node Label"; // Display text
this.textOffset = 0;            // Text vertical offset

// Visual properties
this.fillColor = "#ffffff";     // Background color
this.strokeColor = "#cccccc";   // Border color
this.strokeWidth = 1;           // Border width
```

### Inherited Properties
All properties from [BaseNode](base-node.md) are inherited, including:
- Position coordinates (x, y)
- Status and visibility state
- Event handling properties
- DOM element references

## Methods

### Core Methods

#### `constructor(nodeData, parentElement, settings, parentNode = null)`
Initializes the circle node with radius calculation and sizing.

**Parameters:**
- `nodeData` - Node configuration object
- `parentElement` - Parent SVG container
- `settings` - Global settings object
- `parentNode` - Parent node instance (optional)

**Initialization Steps:**
- Sets default width and height
- Calculates radius as half of maximum dimension
- Ensures width and height are equal (square bounding box)
- Calls parent constructor

#### `init(parentElement = null)`
Creates the visual representation of the circle node.

**Process:**
- Calls parent init method
- Creates circular shape element
- Adds text label element
- Applies styling and classes
- Sets up visual state

### Rendering Methods

#### `createShape()`
Creates the circular SVG shape element.

**Features:**
- Perfect circle with calculated radius
- Status-based styling (fill, stroke, opacity)
- Responsive to size changes
- Proper positioning relative to node center

#### `createLabel()`
Creates the text label element.

**Features:**
- Centered text positioning within circle
- Text overflow handling
- Status-based text styling
- Proper font configuration

### Size Management

#### `calculateRadius()`
Calculates the radius based on width and height dimensions.

**Process:**
- Takes the maximum of width and height
- Divides by 2 to get radius
- Updates radius property
- Ensures consistent circular shape

#### `resize(dimensions)`
Updates the node size and recalculates radius.

**Parameters:**
- `dimensions` - Object with width and/or height

**Process:**
- Updates width and height properties
- Recalculates radius
- Updates shape dimensions
- Triggers visual updates

## Configuration

### Circle Node Settings
```javascript
const circleSettings = {
  // Size configuration
  defaultWidth: 60,             // Default width if not specified
  defaultHeight: 60,            // Default height if not specified
  minRadius: 15,                // Minimum radius constraint
  maxRadius: 100,               // Maximum radius constraint
  
  // Visual configuration
  strokeWidth: 1,               // Border stroke width
  textOffset: 0,                // Text vertical offset from center
  
  // Text configuration
  fontSize: 12,                 // Text font size
  fontFamily: "Arial, sans-serif", // Text font family
  textColor: "#333333",         // Text color
  
  // Status-based styling
  statusColors: {
    active: { fill: "#ffffff", stroke: "#4CAF50" },
    inactive: { fill: "#f5f5f5", stroke: "#cccccc" },
    error: { fill: "#ffebee", stroke: "#f44336" },
    warning: { fill: "#fff3e0", stroke: "#ff9800" },
    success: { fill: "#e8f5e8", stroke: "#4CAF50" },
    processing: { fill: "#e3f2fd", stroke: "#2196F3" }
  }
};
```

### Node Data Structure
```javascript
const circleNodeData = {
  id: "circle-node-1",          // Required unique identifier
  type: "circle",               // Node type identifier
  label: "Sample Node",         // Display text
  x: 100,                       // X coordinate
  y: 200,                       // Y coordinate
  width: 60,                    // Width (affects radius calculation)
  height: 60,                   // Height (affects radius calculation)
  radius: 30,                   // Radius (auto-calculated)
  state: "active",              // Status
  // ... additional properties inherited from BaseNode
};
```

## Visual Styling

### Status-Based Styling
The circle node automatically applies different visual styles based on its status:

- **Active**: White background with green border
- **Inactive**: Light gray background with gray border
- **Error**: Light red background with red border
- **Warning**: Light orange background with orange border
- **Success**: Light green background with green border
- **Processing**: Light blue background with blue border

### CSS Classes
```css
.circle {
  /* Base circle node styling */
}

.circle.shape {
  /* Circle shape styling */
  fill: var(--node-fill, #ffffff);
  stroke: var(--node-stroke, #cccccc);
  stroke-width: 1;
}

.circle.label {
  /* Text label styling */
  font-family: Arial, sans-serif;
  font-size: 12px;
  text-anchor: middle;
  dominant-baseline: middle;
  fill: var(--text-color, #333333);
}

/* Status-based styling */
.circle[status="active"] .shape {
  --node-fill: #ffffff;
  --node-stroke: #4CAF50;
}

.circle[status="error"] .shape {
  --node-fill: #ffebee;
  --node-stroke: #f44336;
}

/* ... additional status styles */
```

## Text Handling

### Text Positioning
Text is positioned within the circular bounds:
- **Horizontal**: Centered within the circle
- **Vertical**: Centered within the circle
- **Baseline**: Middle baseline for proper vertical alignment
- **Overflow**: Text may extend beyond circle bounds (no clipping)

### Text Sizing
- **Font Size**: Configurable font size
- **Text Length**: No automatic text truncation
- **Text Fitting**: Text positioned regardless of length
- **Visual Balance**: Text centered for visual appeal

## Performance Considerations

### Rendering Optimization
- **Minimal DOM**: Only necessary SVG elements created
- **Efficient Updates**: Only changed properties updated
- **Event Delegation**: Efficient event handling
- **Shape Caching**: Circle dimensions cached when possible

### Size Calculation
- **Radius Calculation**: Simple mathematical operation
- **Bounding Box**: Square bounding box for consistent layout
- **Coordinate System**: Center-based positioning

## Use Cases

### Common Applications
- **Data Nodes**: Simple data representation
- **Process Steps**: Circular process flow elements
- **Status Indicators**: Visual status representation
- **Connection Points**: Network connection nodes

### Typical Scenarios
- **Flow Diagrams**: Representing process steps
- **Network Diagrams**: Representing connection points
- **Status Boards**: Representing status items
- **Data Flow**: Representing data sources/sinks

## Integration

### Parent Container Integration
Circle nodes work well within container nodes:
- **LaneNode**: Vertically stacked in columns
- **ColumnsNode**: Horizontally arranged in rows
- **GroupNode**: Freely positioned within groups
- **AdapterNode**: As component elements

### Edge Integration
Circle nodes support edge connections:
- **Connection Points**: Four connection points (top, right, bottom, left)
- **Edge Styling**: Status-based edge coloring
- **Dynamic Updates**: Edge updates when status changes

## Comparison with RectangularNode

### Visual Differences
- **Shape**: Circle vs. Rectangle
- **Space Usage**: More compact vs. text-based width
- **Visual Impact**: Distinctive vs. traditional
- **Layout**: Square bounding box vs. variable width

### Use Case Differences
- **CircleNode**: Better for compact, distinctive representation
- **RectangularNode**: Better for text-heavy content
- **CircleNode**: More suitable for process flows
- **RectangularNode**: More suitable for data labels

## Error Handling

### Validation
- **Size Constraints**: Enforces minimum and maximum radius
- **Dimension Validation**: Ensures width and height are positive
- **Status Values**: Validates status against allowed values

### Fallback Behavior
- **Missing Dimensions**: Uses default size if dimensions missing
- **Invalid Radius**: Applies minimum radius constraint
- **Rendering Errors**: Graceful degradation of visual elements

## Testing

### Unit Testing
- **Constructor Tests**: Proper initialization with various configurations
- **Rendering Tests**: Visual element creation and styling
- **Radius Calculation Tests**: Size-based radius calculations
- **Status Tests**: Status-based styling changes

### Integration Testing
- **Container Integration**: Behavior within different container types
- **Edge Integration**: Connection point functionality
- **Event Handling**: Click and interaction behavior
- **Performance**: Large numbers of circle nodes

## Navigation

- **[Documentation Overview](../README.md)** - Back to main documentation
- **[BaseNode](base-node.md)** - Parent class documentation
- **[RectangularNode](rectangular-node.md)** - Alternative basic node type
- **[LaneNode](lane-node.md)** - Container that commonly uses circle nodes
- **[ColumnsNode](columns-node.md)** - Container that commonly uses circle nodes
- **[Implementation Details](../../implementation.md)** - Technical implementation

## Related Classes

### Dependencies
- **BaseNode** - Core node functionality
- **ConfigManager** - Configuration management

### Common Parents
- **LaneNode** - Vertical stacking container
- **ColumnsNode** - Horizontal row container
- **GroupNode** - Dynamic positioning container
- **AdapterNode** - Multi-arrangement container

### Related Utilities
- **Status Management** - Status-based styling
- **Event Handling** - Interaction management
- **Geometry Calculations** - Size and position calculations 