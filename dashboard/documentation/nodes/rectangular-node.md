# RectangularNode

## Overview

`RectangularNode` is a basic node type that renders as a rectangular shape with text content. It's designed for simple data representation and is commonly used as a leaf node in hierarchical structures. The node automatically sizes itself based on text content while maintaining a minimum width.

## Inheritance

- **Parent**: [BaseNode](base-node.md)
- **Children**: None (leaf node)

## Key Features

### Visual Representation
- **Shape**: Rectangular with rounded corners
- **Text**: Centered label text
- **Sizing**: Automatic width calculation based on text content
- **Styling**: Status-based visual styling

### Automatic Sizing
- **Width**: Calculated from text width plus padding
- **Height**: Fixed height with configurable minimum
- **Padding**: Automatic padding around text content
- **Minimum Size**: Enforced minimum dimensions

## Properties

### Rectangular-Specific Properties
```javascript
// Size configuration
this.data.width = 150;          // Default width
this.data.height = 20;          // Default height
this.textPadding = 20;          // Padding around text

// Text properties
this.data.label = "Node Label"; // Display text
this.textWidth = 0;             // Calculated text width

// Visual properties
this.cornerRadius = 4;          // Rounded corner radius
this.fillColor = "#ffffff";     // Background color
this.strokeColor = "#cccccc";   // Border color
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
Initializes the rectangular node with size and text configuration.

**Parameters:**
- `nodeData` - Node configuration object
- `parentElement` - Parent SVG container
- `settings` - Global settings object
- `parentNode` - Parent node instance (optional)

**Initialization Steps:**
- Sets default height and width
- Calculates text width using utility function
- Ensures minimum width (text width + padding)
- Calls parent constructor

#### `init(parentElement = null)`
Creates the visual representation of the rectangular node.

**Process:**
- Calls parent init method
- Creates rectangular shape element
- Adds text label element
- Applies styling and classes
- Sets up visual state

### Rendering Methods

#### `createShape()`
Creates the rectangular SVG shape element.

**Features:**
- Rounded rectangle with configurable corner radius
- Status-based styling (fill, stroke, opacity)
- Responsive to size changes
- Proper positioning relative to node center

#### `createLabel()`
Creates the text label element.

**Features:**
- Centered text positioning
- Text overflow handling
- Status-based text styling
- Proper font configuration

### Size Management

#### `calculateSize()`
Calculates the optimal size based on text content.

**Process:**
- Measures text width using `getTextWidth()` utility
- Adds padding to text width
- Ensures minimum width constraint
- Updates node dimensions

#### `resize(dimensions)`
Updates the node size and recalculates layout.

**Parameters:**
- `dimensions` - Object with width and/or height

**Process:**
- Updates width and height properties
- Recalculates text positioning
- Updates shape dimensions
- Triggers visual updates

## Configuration

### Rectangular Node Settings
```javascript
const rectangularSettings = {
  // Size configuration
  defaultWidth: 150,            // Default width if not specified
  defaultHeight: 20,            // Default height if not specified
  minWidth: 60,                 // Minimum width constraint
  textPadding: 20,              // Padding around text content
  
  // Visual configuration
  cornerRadius: 4,              // Rounded corner radius
  strokeWidth: 1,               // Border stroke width
  
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
const rectangularNodeData = {
  id: "rect-node-1",            // Required unique identifier
  type: "rect",                 // Node type identifier
  label: "Sample Node",         // Display text
  x: 100,                       // X coordinate
  y: 200,                       // Y coordinate
  width: 120,                   // Width (auto-calculated if not provided)
  height: 20,                   // Height
  state: "active",              // Status
  // ... additional properties inherited from BaseNode
};
```

## Visual Styling

### Status-Based Styling
The rectangular node automatically applies different visual styles based on its status:

- **Active**: White background with green border
- **Inactive**: Light gray background with gray border
- **Error**: Light red background with red border
- **Warning**: Light orange background with orange border
- **Success**: Light green background with green border
- **Processing**: Light blue background with blue border

### CSS Classes
```css
.rect {
  /* Base rectangular node styling */
}

.rect.shape {
  /* Rectangle shape styling */
  fill: var(--node-fill, #ffffff);
  stroke: var(--node-stroke, #cccccc);
  stroke-width: 1;
  rx: 4; /* corner radius */
  ry: 4;
}

.rect.label {
  /* Text label styling */
  font-family: Arial, sans-serif;
  font-size: 12px;
  text-anchor: middle;
  dominant-baseline: middle;
  fill: var(--text-color, #333333);
}

/* Status-based styling */
.rect[status="active"] .shape {
  --node-fill: #ffffff;
  --node-stroke: #4CAF50;
}

.rect[status="error"] .shape {
  --node-fill: #ffebee;
  --node-stroke: #f44336;
}

/* ... additional status styles */
```

## Text Handling

### Text Measurement
The node uses the `getTextWidth()` utility function to measure text dimensions:

```javascript
import { getTextWidth } from "./utils.js";

// Calculate text width for sizing
const textWidth = getTextWidth(this.data.label);
const totalWidth = textWidth + this.textPadding;
```

### Text Overflow
For long text labels, the node handles overflow gracefully:
- Text is centered within the available width
- No text truncation (full text is preserved)
- Container width expands to accommodate text

### Text Positioning
- **Horizontal**: Centered within the rectangle
- **Vertical**: Centered within the rectangle
- **Baseline**: Middle baseline for proper vertical alignment

## Performance Considerations

### Text Measurement Optimization
- **Caching**: Text measurements can be cached for repeated strings
- **Lazy Calculation**: Text width calculated only when needed
- **Batch Updates**: Multiple text changes processed together

### Rendering Optimization
- **Minimal DOM**: Only necessary SVG elements created
- **Efficient Updates**: Only changed properties updated
- **Event Delegation**: Efficient event handling

## Use Cases

### Common Applications
- **Data Nodes**: Simple data representation
- **Leaf Nodes**: End points in hierarchical structures
- **Labels**: Text labels for other elements
- **Status Indicators**: Visual status representation

### Typical Scenarios
- **Data Flow Diagrams**: Representing data sources/sinks
- **Process Flow**: Representing process steps
- **Entity Relationships**: Representing entities
- **Status Boards**: Representing status items

## Integration

### Parent Container Integration
Rectangular nodes work well within container nodes:
- **LaneNode**: Vertically stacked in columns
- **ColumnsNode**: Horizontally arranged in rows
- **GroupNode**: Freely positioned within groups
- **AdapterNode**: As component elements

### Edge Integration
Rectangular nodes support edge connections:
- **Connection Points**: Four connection points (top, right, bottom, left)
- **Edge Styling**: Status-based edge coloring
- **Dynamic Updates**: Edge updates when status changes

## Error Handling

### Validation
- **Text Content**: Handles empty or null text gracefully
- **Size Constraints**: Enforces minimum size requirements
- **Status Values**: Validates status against allowed values

### Fallback Behavior
- **Missing Text**: Uses default label if text is missing
- **Invalid Size**: Applies minimum size constraints
- **Rendering Errors**: Graceful degradation of visual elements

## Testing

### Unit Testing
- **Constructor Tests**: Proper initialization with various configurations
- **Rendering Tests**: Visual element creation and styling
- **Size Calculation Tests**: Text-based size calculations
- **Status Tests**: Status-based styling changes

### Integration Testing
- **Container Integration**: Behavior within different container types
- **Edge Integration**: Connection point functionality
- **Event Handling**: Click and interaction behavior
- **Performance**: Large numbers of rectangular nodes

## Navigation

- **[Documentation Overview](../README.md)** - Back to main documentation
- **[BaseNode](base-node.md)** - Parent class documentation
- **[CircleNode](circle-node.md)** - Alternative basic node type
- **[LaneNode](lane-node.md)** - Container that commonly uses rectangular nodes
- **[ColumnsNode](columns-node.md)** - Container that commonly uses rectangular nodes
- **[Implementation Details](../../implementation.md)** - Technical implementation

## Related Classes

### Dependencies
- **BaseNode** - Core node functionality
- **getTextWidth** - Text measurement utility
- **ConfigManager** - Configuration management

### Common Parents
- **LaneNode** - Vertical stacking container
- **ColumnsNode** - Horizontal row container
- **GroupNode** - Dynamic positioning container
- **AdapterNode** - Multi-arrangement container

### Related Utilities
- **Text Measurement** - Width calculation utilities
- **Status Management** - Status-based styling
- **Event Handling** - Interaction management 