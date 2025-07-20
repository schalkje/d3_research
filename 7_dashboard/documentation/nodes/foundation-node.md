# FoundationNode

## Overview

`FoundationNode` is a specialized container node type designed for representing data warehouse foundation components. It provides role-based layout with raw and base components, supporting multiple orientations and display modes for flexible data warehouse foundation visualization.

## Inheritance

- **Parent**: [BaseContainerNode](base-container-node.md)
- **Children**: Auto-created based on foundation roles

## Key Features

### Role-Based Layout
- **Raw/Base Components**: Automatic creation of raw and base foundation components
- **Multiple Orientations**: 5 different orientation modes for flexible layout
- **Display Modes**: Full and role-only display options
- **Dynamic Sizing**: Container adapts to orientation and component requirements

### Foundation-Specific Behavior
- **Component Management**: Automatic raw and base component creation
- **Internal Edges**: Automatic edge creation between components
- **Status Propagation**: Status changes propagate through foundation components
- **Orientation Support**: Horizontal, vertical, and rotated orientations

## Properties

### Foundation-Specific Properties
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

// Foundation modes
const FoundationMode = {
  MANUAL: 'manual',             // Manual arrangement
  AUTO: 'auto'                  // Automatic arrangement
};

// Component references
this.rawNode = null;            // Raw component node
this.baseNode = null;           // Base component node

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
Initializes the foundation node with role-based configuration.

**Parameters:**
- `nodeData` - Node configuration object
- `parentElement` - Parent SVG container
- `createNode` - Node factory function for creating children
- `settings` - Global settings object
- `parentNode` - Parent node instance (optional)

**Initialization Steps:**
- Sets up foundation-specific configuration
- Initializes component references
- Configures display mode, orientation, and foundation mode
- Sets up spacing and layout settings
- Calls parent constructor

#### `initializeNodeData(nodeData)`
Initializes foundation-specific node data and configuration.

**Process:**
- Sets default display mode (role)
- Sets default orientation (horizontal)
- Sets default foundation mode (auto)
- Configures component roles and relationships
- Sets up layout constraints

### Layout Methods

#### `updateLayout()`
Updates the foundation layout based on current mode and display settings.

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
// Position raw node on the left
this.rawNode.move(0, 0);

// Position base node to the right of raw node
const baseX = this.rawNode.data.width + this.nodeSpacing.horizontal;
this.baseNode.move(baseX, 0);

// Update container size
const totalWidth = baseX + this.baseNode.data.width;
const totalHeight = Math.max(this.rawNode.data.height, this.baseNode.data.height);
this.resize({ width: totalWidth, height: totalHeight });
```

#### `updateRole()`
Updates layout for role display mode.

**Layout Algorithm:**
```javascript
// Position raw node on the left
this.rawNode.move(0, 0);

// Position base node to the right of raw node
const baseX = this.rawNode.data.width + this.nodeSpacing.horizontal;
this.baseNode.move(baseX, 0);

// Update container size for role mode
const totalWidth = roleWidth + roleWidth + this.nodeSpacing.horizontal + 16; // 8px margins each side
this.resize({ width: totalWidth, height: this.data.height });
```

### Component Management

#### `createComponents()`
Creates foundation components based on roles.

**Components Created:**
- **Raw Component**: Raw data foundation component
- **Base Component**: Base data foundation component

#### `updateComponentStatus(status)`
Updates status across all foundation components.

**Process:**
- Propagates status to raw component
- Propagates status to base component
- Updates foundation container status

#### `createInternalEdges()`
Creates edges between foundation components.

**Edge Creation:**
- Raw to Base edge
- Edge styling based on component status

## Configuration

### Foundation Node Settings
```javascript
const foundationSettings = {
  // Display configuration
  displayMode: "role",          // full or role
  orientation: "horizontal",    // horizontal, horizontal_line, vertical, rotate90, rotate270
  foundationMode: "auto",       // manual or auto
  
  // Layout configuration
  layout: {
    type: "foundation",         // Layout type identifier
    orientation: "horizontal",  // Component orientation
    spacing: {
      horizontal: 20,           // Horizontal spacing between components
      vertical: 10              // Vertical spacing between components
    }
  },
  
  // Component configuration
  components: {
    raw: {
      type: "rect",
      label: "Raw",
      width: 80,
      height: 40
    },
    base: {
      type: "rect",
      label: "Base",
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
const foundationNodeData = {
  id: "foundation-1",           // Required unique identifier
  type: "foundation",           // Node type identifier
  label: "Data Foundation",     // Display text
  x: 100,                       // X coordinate
  y: 200,                       // Y coordinate
  width: 334,                   // Container width
  height: 44,                   // Container height
  state: "active",              // Status
  layout: {                     // Layout configuration
    displayMode: "role",
    orientation: "horizontal",
    foundationMode: "auto"
  },
  // Components are auto-created based on roles
};
```

## Orientation Modes

### Horizontal Orientation
Side-by-side horizontal arrangement:
```
[Raw] [Base]
```
- **Use Case**: Standard foundation layout
- **Components**: Raw and Base side by side
- **Flow**: Left to right data flow

### Horizontal Line Orientation
Horizontal arrangement with line separator:
```
[Raw] | [Base]
```
- **Use Case**: Foundation with visual separation
- **Components**: Raw and Base with separator
- **Flow**: Clear component separation

### Vertical Orientation
Stacked vertical arrangement:
```
[Raw]
[Base]
```
- **Use Case**: Vertical foundation layout
- **Components**: Raw above Base
- **Flow**: Top to bottom data flow

### Rotate 90 Orientation
Rotated 90 degrees clockwise:
```
[Raw]
[Base]
```
- **Use Case**: Rotated foundation layout
- **Components**: Rotated component arrangement
- **Flow**: Rotated data flow

### Rotate 270 Orientation
Rotated 270 degrees clockwise:
```
[Base]
[Raw]
```
- **Use Case**: Counter-rotated foundation layout
- **Components**: Counter-rotated component arrangement
- **Flow**: Counter-rotated data flow

## Component Roles

### Raw Component
- **Purpose**: Raw data foundation
- **Function**: Initial data storage and preparation
- **Status**: Reflects raw data processing status
- **Connections**: Outgoing to base component

### Base Component
- **Purpose**: Base data foundation
- **Function**: Processed and structured data storage
- **Status**: Reflects base data processing status
- **Connections**: Incoming from raw component

## Zone System Integration

### Zone Hierarchy
```
Container Zone (outermost)
├── Header Zone (top)
│   ├── Title: "Data Foundation"
│   └── Zoom/collapse button
├── Margin Zones (surrounding)
│   ├── Top Margin (4px from header)
│   ├── Right Margin (8px)
│   ├── Bottom Margin (8px)
│   └── Left Margin (8px)
└── Inner Container Zone (content area)
    ├── Raw Component
    └── Base Component
```

### Zone Management
- **Header Zone**: Displays foundation title and controls
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
- **Data Warehousing**: Foundation layer visualization
- **Data Architecture**: Data foundation patterns
- **ETL Processes**: Foundation data processing
- **Data Governance**: Foundation data management

### Typical Scenarios
- **Data Lake Foundations**: Raw and processed data layers
- **Data Warehouse Layers**: Foundation and staging layers
- **Data Pipeline Foundations**: Source and processed data
- **Data Architecture Patterns**: Foundation component relationships

## Integration

### Parent Container Integration
Foundation nodes work well within other container nodes:
- **GroupNode**: Multiple foundations for different data domains
- **LaneNode**: Foundations arranged vertically in data flows
- **ColumnsNode**: Foundations arranged horizontally for comparison
- **AdapterNode**: As adapter components

### Component Integration
Foundation components are typically:
- **RectangularNode**: Standard component representation
- **Custom Components**: Specialized component types
- **Status Indicators**: Visual status representation
- **Edge Connections**: Internal and external connections

## Comparison with AdapterNode

### Layout Differences
- **Components**: Raw/Base vs. Staging/Transform/Archive
- **Orientations**: 5 orientations vs. 5 arrangements
- **Use Cases**: Data foundation vs. Data transformation
- **Complexity**: Simpler 2-component vs. Complex 3-component

### Use Case Differences
- **FoundationNode**: Better for data foundation and storage patterns
- **AdapterNode**: Better for data transformation and integration patterns
- **FoundationNode**: More suitable for data architecture
- **AdapterNode**: More suitable for data processing

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
- **Performance**: Large numbers of foundations

## Navigation

- **[Documentation Overview](../README.md)** - Back to main documentation
- **[BaseContainerNode](base-container-node.md)** - Parent class documentation
- **[AdapterNode](adapter-node.md)** - Alternative role-based container
- **[MartNode](mart-node.md)** - Alternative role-based container
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
- **MartNode** - Alternative role-based layout
- **LaneNode** - Vertical arrangement alternative
- **ColumnsNode** - Horizontal arrangement alternative 