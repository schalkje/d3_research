# AdapterNode

## Overview

`AdapterNode` is a specialized container node type that provides multiple layout arrangements for data adapter patterns. It's designed for representing data transformation and integration scenarios with 5 different layout modes, each optimized for specific adapter configurations and use cases.

## Inheritance

- **Parent**: [BaseContainerNode](base-container-node.md)
- **Children**: Auto-created based on adapter roles

## Key Features

### Multi-Arrangement Layout
- **5 Layout Modes**: Different arrangements for various adapter scenarios
- **Role-Based Components**: Automatic child creation based on adapter roles
- **Flexible Display Modes**: Full and role-only display options
- **Dynamic Sizing**: Container adapts to arrangement requirements

### Adapter-Specific Behavior
- **Component Management**: Automatic staging, transform, and archive component creation
- **Internal Edges**: Automatic edge creation between components
- **Status Propagation**: Status changes propagate through adapter components
- **Collapse/Expand**: Integrated support for hiding/showing components

## Properties

### Adapter-Specific Properties
```javascript
// Display modes
const DisplayMode = {
  FULL: "full",                 // Show all components
  ROLE: "role"                  // Show only role components
};

// Adapter modes
const AdapterMode = {
  MANUAL: "manual",             // Manual arrangement
  FULL: "full",                 // Full adapter with all components
  ARCHIVE_ONLY: "archive-only", // Archive component only
  STAGING_ARCHIVE: "staging-archive", // Staging and archive
  STAGING_TRANSFORM: "staging-transform" // Staging and transform
};

// Component references
this.stagingNode = null;        // Staging component node
this.transformNode = null;      // Transform component node
this.archiveNode = null;        // Archive component node

// Layout configuration
this.nodeSpacing = {            // Spacing between components
  horizontal: 20,
  vertical: 10
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
Initializes the adapter node with multi-arrangement configuration.

**Parameters:**
- `nodeData` - Node configuration object
- `parentElement` - Parent SVG container
- `createNode` - Node factory function for creating children
- `settings` - Global settings object
- `parentNode` - Parent node instance (optional)

**Initialization Steps:**
- Sets up adapter-specific configuration
- Initializes component references
- Configures display and adapter modes
- Sets up spacing and layout settings
- Calls parent constructor

#### `initializeNodeData(nodeData)`
Initializes adapter-specific node data and configuration.

**Process:**
- Sets default display mode (role)
- Sets default adapter mode (full)
- Configures component roles and relationships
- Sets up layout constraints

### Layout Methods

#### `updateLayout()`
Updates the adapter layout based on current mode and display settings.

**Process:**
- Determines current adapter mode
- Selects appropriate layout algorithm
- Positions components according to arrangement
- Updates container size
- Creates internal edges

#### `updateLayout1_full_archive()`
Layout for full adapter with archive component.

**Arrangement:**
```
[Staging] -> [Transform] -> [Archive]
```

#### `updateLayout2_full_transform()`
Layout for full adapter with transform component.

**Arrangement:**
```
[Staging] -> [Transform]
```

#### `updateLayout3_full_staging()`
Layout for full adapter with staging component.

**Arrangement:**
```
[Staging]
```

#### `updateLayout4_line()`
Linear arrangement of components.

**Arrangement:**
```
[Staging] - [Transform] - [Archive]
```

#### `updateLayout5()`
Custom arrangement based on adapter configuration.

**Arrangement:** Configurable based on adapter requirements

### Component Management

#### `createComponents()`
Creates adapter components based on roles and mode.

**Components Created:**
- **Staging Component**: Data staging and preparation
- **Transform Component**: Data transformation and processing
- **Archive Component**: Data archiving and storage

#### `updateComponentStatus(status)`
Updates status across all adapter components.

**Process:**
- Propagates status to staging component
- Propagates status to transform component
- Propagates status to archive component
- Updates adapter container status

#### `createInternalEdges()`
Creates edges between adapter components.

**Edge Creation:**
- Staging to Transform edge
- Transform to Archive edge
- Edge styling based on component status

## Configuration

### Adapter Node Settings
```javascript
const adapterSettings = {
  // Display configuration
  displayMode: "role",          // full or role
  adapterMode: "full",          // manual, full, archive-only, staging-archive, staging-transform
  
  // Layout configuration
  layout: {
    type: "adapter",            // Layout type identifier
    arrangement: "full",        // Component arrangement
    spacing: {
      horizontal: 20,           // Horizontal spacing between components
      vertical: 10              // Vertical spacing between components
    }
  },
  
  // Component configuration
  components: {
    staging: {
      type: "rect",
      label: "Staging",
      width: 80,
      height: 40
    },
    transform: {
      type: "rect",
      label: "Transform",
      width: 80,
      height: 40
    },
    archive: {
      type: "rect",
      label: "Archive",
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
const adapterNodeData = {
  id: "adapter-1",              // Required unique identifier
  type: "adapter",              // Node type identifier
  label: "Data Adapter",        // Display text
  x: 100,                       // X coordinate
  y: 200,                       // Y coordinate
  width: 334,                   // Container width
  height: 44,                   // Container height
  state: "active",              // Status
  layout: {                     // Layout configuration
    displayMode: "role",
    adapterMode: "full",
    arrangement: "full"
  },
  // Components are auto-created based on mode
};
```

## Layout Arrangements

### Arrangement 1: Full Archive
Complete adapter with all three components:
```
[Staging] -> [Transform] -> [Archive]
```
- **Use Case**: Complete data pipeline
- **Components**: Staging, Transform, Archive
- **Flow**: Linear data flow through all stages

### Arrangement 2: Full Transform
Adapter with staging and transform components:
```
[Staging] -> [Transform]
```
- **Use Case**: Data transformation without archiving
- **Components**: Staging, Transform
- **Flow**: Data preparation and transformation

### Arrangement 3: Full Staging
Adapter with staging component only:
```
[Staging]
```
- **Use Case**: Data staging and preparation
- **Components**: Staging only
- **Flow**: Data preparation only

### Arrangement 4: Line
Linear arrangement of components:
```
[Staging] - [Transform] - [Archive]
```
- **Use Case**: Parallel component layout
- **Components**: All components in line
- **Flow**: Visual separation of components

### Arrangement 5: Custom
Configurable arrangement based on requirements:
- **Use Case**: Specialized adapter configurations
- **Components**: Configurable based on needs
- **Flow**: Custom component relationships

## Component Roles

### Staging Component
- **Purpose**: Data staging and preparation
- **Function**: Initial data loading and validation
- **Status**: Reflects staging process status
- **Connections**: Outgoing to transform component

### Transform Component
- **Purpose**: Data transformation and processing
- **Function**: Data conversion and enrichment
- **Status**: Reflects transformation process status
- **Connections**: Incoming from staging, outgoing to archive

### Archive Component
- **Purpose**: Data archiving and storage
- **Function**: Final data storage and retention
- **Status**: Reflects archiving process status
- **Connections**: Incoming from transform component

## Zone System Integration

### Zone Hierarchy
```
Container Zone (outermost)
├── Header Zone (top)
│   ├── Title: "Data Adapter"
│   └── Zoom/collapse button
├── Margin Zones (surrounding)
│   ├── Top Margin (4px from header)
│   ├── Right Margin (8px)
│   ├── Bottom Margin (8px)
│   └── Left Margin (8px)
└── Inner Container Zone (content area)
    ├── Staging Component
    ├── Transform Component
    └── Archive Component
```

### Zone Management
- **Header Zone**: Displays adapter title and controls
- **Inner Container Zone**: Manages component positioning
- **Margin Zones**: Provide consistent spacing
- **Coordinate System**: Components positioned relative to inner container

## Performance Considerations

### Layout Optimization
- **Mode-Based Layouts**: Efficient layout selection based on mode
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
- **Data Integration**: ETL and data pipeline visualization
- **System Integration**: API and service integration patterns
- **Data Transformation**: Data conversion and enrichment workflows
- **Data Archiving**: Data storage and retention processes

### Typical Scenarios
- **ETL Pipelines**: Extract, Transform, Load processes
- **Data Migration**: Data transfer between systems
- **API Integration**: Service-to-service data exchange
- **Data Warehousing**: Data staging and storage workflows

## Integration

### Parent Container Integration
Adapter nodes work well within other container nodes:
- **GroupNode**: Multiple adapters for different data flows
- **LaneNode**: Adapters arranged vertically in process flows
- **ColumnsNode**: Adapters arranged horizontally for comparison
- **FoundationNode**: As foundation components

### Component Integration
Adapter components are typically:
- **RectangularNode**: Standard component representation
- **Custom Components**: Specialized component types
- **Status Indicators**: Visual status representation
- **Edge Connections**: Internal and external connections

## Error Handling

### Layout Errors
- **Mode Validation**: Invalid adapter mode handling
- **Component Creation**: Component creation failure recovery
- **Edge Creation**: Internal edge creation error handling
- **Status Propagation**: Status update error recovery

### Recovery Mechanisms
- **Fallback Layout**: Default layout when mode fails
- **Component Recovery**: Component recreation on failure
- **Edge Recovery**: Edge recreation on failure
- **Status Recovery**: Status restoration on error

## Testing

### Unit Testing
- **Constructor Tests**: Proper initialization with various modes
- **Layout Tests**: All 5 layout arrangement validations
- **Component Tests**: Component creation and management
- **Edge Tests**: Internal edge creation and management

### Integration Testing
- **Parent-Child Relationships**: Container-component interactions
- **Zone System**: Zone management and positioning
- **Status Propagation**: Status flow through components
- **Performance**: Large numbers of adapters

## Navigation

- **[Documentation Overview](../README.md)** - Back to main documentation
- **[BaseContainerNode](base-container-node.md)** - Parent class documentation
- **[FoundationNode](foundation-node.md)** - Alternative role-based container
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
- **FoundationNode** - Alternative role-based layout
- **MartNode** - Alternative role-based layout
- **LaneNode** - Vertical arrangement alternative
- **ColumnsNode** - Horizontal arrangement alternative 