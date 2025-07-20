# MartNode

## Overview

`MartNode` is a specialized container node type designed for representing data mart components. It provides role-based layout with load and report components, supporting multiple orientations and display modes for flexible data mart visualization.

## Inheritance

- **Parent**: [BaseContainerNode](base-container-node.md)
- **Children**: Auto-created based on mart roles

## Key Features

### Role-Based Layout
- **Load/Report Components**: Automatic creation of load and report mart components
- **Multiple Orientations**: 5 different orientation modes for flexible layout
- **Display Modes**: Full and role-only display options
- **Dynamic Sizing**: Container adapts to orientation and component requirements

### Mart-Specific Behavior
- **Component Management**: Automatic load and report component creation
- **Internal Edges**: Automatic edge creation between components
- **Status Propagation**: Status changes propagate through mart components
- **Orientation Support**: Horizontal, vertical, and rotated orientations

## Properties

### Mart-Specific Properties
```javascript
// Display modes
const DisplayMode = {
  FULL: 'full',                 // Show all components
  ROLE: 'role'                  // Show only role components
};

// Orientation modes
const Orientation = {
  HORIZONTAL: 'horizontal',     // Side-by-side horizontal
  HORIZONTAL_LINE: 'horizontal_line', // Horizontal with line separator
  VERTICAL: 'vertical',         // Stacked vertical
  ROTATE_90: 'rotate90',        // Rotated 90 degrees
  ROTATE_270: 'rotate270'       // Rotated 270 degrees
};

// Mart modes
const MartMode = {
  MANUAL: 'manual',             // Manual arrangement
  AUTO: 'auto'                  // Automatic arrangement
};

// Component references
this.loadNode = null;           // Load component node
this.reportNode = null;         // Report component node

// Layout configuration
this.nodeSpacing = {            // Spacing between components
  horizontal: 20,
  vertical: 10
};

// Component sizing
const roleWidth = 80;           // Fixed width for role components
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
Initializes the mart node with role-based configuration.

**Parameters:**
- `nodeData` - Node configuration object
- `parentElement` - Parent SVG container
- `createNode` - Node factory function for creating children
- `settings` - Global settings object
- `parentNode` - Parent node instance (optional)

**Initialization Steps:**
- Sets up mart-specific configuration
- Initializes component references
- Configures display mode, orientation, and mart mode
- Sets up spacing and layout settings
- Calls parent constructor

#### `initializeNodeData(nodeData)`
Initializes mart-specific node data and configuration.

**Process:**
- Sets default display mode (role)
- Sets default orientation (horizontal)
- Sets default mart mode (auto)
- Configures component roles and relationships
- Sets up layout constraints

### Layout Methods

#### `updateLayout()`
Updates the mart layout based on current mode and display settings.

**Process:**
- Determines current display mode and orientation
- Selects appropriate layout algorithm
- Positions components according to orientation
- Updates container size
- Creates internal edges

#### `updateFull()`
Updates layout for full display mode.

**Layout Algorithm:**
```javascript
// Position load node on the left
this.loadNode.move(0, 0);

// Position report node to the right of load node
const reportX = this.loadNode.data.width + this.nodeSpacing.horizontal;
this.reportNode.move(reportX, 0);

// Update container size
const totalWidth = reportX + this.reportNode.data.width;
const totalHeight = Math.max(this.loadNode.data.height, this.reportNode.data.height);
this.resize({ width: totalWidth, height: totalHeight });
```

#### `updateRole()`
Updates layout for role display mode.

**Layout Algorithm:**
```javascript
// Position load node on the left
this.loadNode.move(0, 0);

// Position report node to the right of load node
const reportX = this.loadNode.data.width + this.nodeSpacing.horizontal;
this.reportNode.move(reportX, 0);

// Update container size for role mode
const totalWidth = roleWidth + roleWidth + this.nodeSpacing.horizontal + 16; // 8px margins each side
this.resize({ width: totalWidth, height: this.data.height });
```

### Component Management

#### `createComponents()`
Creates mart components based on roles.

**Components Created:**
- **Load Component**: Data loading and processing component
- **Report Component**: Reporting and analytics component

#### `updateComponentStatus(status)`
Updates status across all mart components.

**Process:**
- Propagates status to load component
- Propagates status to report component
- Updates mart container status

#### `createInternalEdges()`
Creates edges between mart components.

**Edge Creation:**
- Load to Report edge
- Edge styling based on component status

## Configuration

### Mart Node Settings
```javascript
const martSettings = {
  // Display configuration
  displayMode: "role",          // full or role
  orientation: "horizontal",    // horizontal, horizontal_line, vertical, rotate90, rotate270
  martMode: "auto",             // manual or auto
  
  // Layout configuration
  layout: {
    type: "mart",               // Layout type identifier
    orientation: "horizontal",  // Component orientation
    spacing: {
      horizontal: 20,           // Horizontal spacing between components
      vertical: 10              // Vertical spacing between components
    }
  },
  
  // Component configuration
  components: {
    load: {
      type: "rect",
      label: "Load",
      width: 80,
      height: 40
    },
    report: {
      type: "rect",
      label: "Report",
      width: 80,
      height: 40
    }
  },
  
  // Edge configuration
  edges: {
    internal: true,             // Create internal edges
    styling: "status-based",    // Edge styling approach
    markers: true               // Show edge markers
  }
};
```

### Node Data Structure
```javascript
const martNodeData = {
  id: "mart-1",                 // Required unique identifier
  type: "mart",                 // Node type identifier
  label: "Data Mart",           // Display text
  x: 100,                       // X coordinate
  y: 200,                       // Y coordinate
  width: 334,                   // Container width
  height: 44,                   // Container height
  state: "active",              // Status
  layout: {                     // Layout configuration
    displayMode: "role",
    orientation: "horizontal",
    martMode: "auto"
  },
  // Components are auto-created based on roles
};
```

## Orientation Modes

### Horizontal Orientation
Side-by-side horizontal arrangement:
```
[Load] [Report]
```
- **Use Case**: Standard mart layout
- **Components**: Load and Report side by side
- **Flow**: Left to right data flow

### Horizontal Line Orientation
Horizontal arrangement with line separator:
```
[Load] | [Report]
```
- **Use Case**: Mart with visual separation
- **Components**: Load and Report with separator
- **Flow**: Clear component separation

### Vertical Orientation
Stacked vertical arrangement:
```
[Load]
[Report]
```
- **Use Case**: Vertical mart layout
- **Components**: Load above Report
- **Flow**: Top to bottom data flow

### Rotate 90 Orientation
Rotated 90 degrees clockwise:
```
[Load]
[Report]
```
- **Use Case**: Rotated mart layout
- **Components**: Rotated component arrangement
- **Flow**: Rotated data flow

### Rotate 270 Orientation
Rotated 270 degrees clockwise:
```
[Report]
[Load]
```
- **Use Case**: Counter-rotated mart layout
- **Components**: Counter-rotated component arrangement
- **Flow**: Counter-rotated data flow

## Component Roles

### Load Component
- **Purpose**: Data loading and processing
- **Function**: ETL processes and data preparation
- **Status**: Reflects loading process status
- **Connections**: Outgoing to report component

### Report Component
- **Purpose**: Reporting and analytics
- **Function**: Data analysis and reporting
- **Status**: Reflects reporting process status
- **Connections**: Incoming from load component

## Zone System Integration

### Zone Hierarchy
```
Container Zone (outermost)
├── Header Zone (top)
│   ├── Title: "Data Mart"
│   └── Zoom/collapse button
├── Margin Zones (surrounding)
│   ├── Top Margin (4px from header)
│   ├── Right Margin (8px)
│   ├── Bottom Margin (8px)
│   └── Left Margin (8px)
└── Inner Container Zone (content area)
    ├── Load Component
    └── Report Component
```

### Zone Management
- **Header Zone**: Displays mart title and controls
- **Inner Container Zone**: Manages component positioning
- **Margin Zones**: Provide consistent spacing
- **Coordinate System**: Components positioned relative to inner container

## Performance Considerations

### Layout Optimization
- **Orientation-Based Layouts**: Efficient layout selection based on orientation
- **Component Caching**: Component references cached for performance
- **Edge Optimization**: Internal edges created efficiently
- **Status Propagation**: Efficient status updates across components

### Memory Management
- **Component Lifecycle**: Proper component creation and cleanup
- **Edge Management**: Internal edge cleanup
- **Reference Management**: Avoiding circular references
- **Zone Cleanup**: Zone system properly destroyed

## Use Cases

### Common Applications
- **Data Marts**: Business intelligence and analytics
- **Reporting Systems**: Data reporting and analysis
- **Analytics Platforms**: Data analysis and insights
- **Business Intelligence**: BI tool integration

### Typical Scenarios
- **Data Mart Loading**: ETL processes for data marts
- **Report Generation**: Automated report creation
- **Analytics Workflows**: Data analysis processes
- **BI Integration**: Business intelligence tool connections

## Integration

### Parent Container Integration
Mart nodes work well within other container nodes:
- **GroupNode**: Multiple marts for different business domains
- **LaneNode**: Marts arranged vertically in data flows
- **ColumnsNode**: Marts arranged horizontally for comparison
- **AdapterNode**: As adapter components

### Component Integration
Mart components are typically:
- **RectangularNode**: Standard component representation
- **Custom Components**: Specialized component types
- **Status Indicators**: Visual status representation
- **Edge Connections**: Internal and external connections

## Comparison with FoundationNode

### Layout Differences
- **Components**: Load/Report vs. Raw/Base
- **Orientations**: 5 orientations vs. 5 orientations (same)
- **Use Cases**: Data mart vs. Data foundation
- **Complexity**: Similar 2-component structure

### Use Case Differences
- **MartNode**: Better for business intelligence and analytics
- **FoundationNode**: Better for data foundation and storage
- **MartNode**: More suitable for reporting workflows
- **FoundationNode**: More suitable for data architecture

## Error Handling

### Layout Errors
- **Orientation Validation**: Invalid orientation handling
- **Component Creation**: Component creation failure recovery
- **Edge Creation**: Internal edge creation error handling
- **Status Propagation**: Status update error recovery

### Recovery Mechanisms
- **Fallback Layout**: Default layout when orientation fails
- **Component Recovery**: Component recreation on failure
- **Edge Recovery**: Edge recreation on failure
- **Status Recovery**: Status restoration on error

## Testing

### Unit Testing
- **Constructor Tests**: Proper initialization with various orientations
- **Layout Tests**: All 5 orientation mode validations
- **Component Tests**: Component creation and management
- **Edge Tests**: Internal edge creation and management

### Integration Testing
- **Parent-Child Relationships**: Container-component interactions
- **Zone System**: Zone management and positioning
- **Status Propagation**: Status flow through components
- **Performance**: Large numbers of marts

## Navigation

- **[Documentation Overview](../README.md)** - Back to main documentation
- **[BaseContainerNode](base-container-node.md)** - Parent class documentation
- **[AdapterNode](adapter-node.md)** - Alternative role-based container
- **[FoundationNode](foundation-node.md)** - Alternative role-based container
- **[RectangularNode](rectangular-node.md)** - Common component type
- **[Implementation Details](../../implementation.md)** - Technical implementation

## Related Classes

### Dependencies
- **BaseContainerNode** - Container functionality
- **ZoneManager** - Zone system management
- **LayoutManager** - Layout algorithm management
- **ConfigManager** - Configuration management

### Common Components
- **RectangularNode** - Standard component type
- **Custom Components** - Specialized component types
- **Status Indicators** - Visual status representation

### Related Containers
- **AdapterNode** - Alternative role-based layout
- **FoundationNode** - Alternative role-based layout
- **LaneNode** - Vertical arrangement alternative
- **ColumnsNode** - Horizontal arrangement alternative 