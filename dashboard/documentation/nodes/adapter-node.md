# AdapterNode

## Overview

`AdapterNode` is a specialized container node type that provides multiple layout arrangements for data adapter patterns. It's designed for representing data transformation and integration scenarios with different layout modes, each optimized for specific adapter configurations and use cases.

## Inheritance

- **Parent**: [BaseContainerNode](base-container-node.md)
- **Children**: Auto-created based on adapter roles

## Key Features

### Multi-Arrangement Layout
- **5 Layout Arrangements**: Different arrangements for various adapter scenarios
- **Role-Based Nodes**: Automatic child node creation based on adapter roles
- **Flexible Display Modes**: _Display mode is obsolete and not used._
- **Dynamic Sizing**: Container adapts to arrangement requirements

### Adapter-Specific Behavior
- **Node Management**: Automatic staging, transform, and archive node creation
- **Internal Edges**: Automatic edge creation between nodes
- **Status Propagation**: Status changes propagate through adapter nodes
- **Collapse/Expand**: Integrated support for hiding/showing nodes

## Data Flow

The adapter follows a specific data flow pattern:
- **Staging → Transform**: Data flows from staging to transform node
- **Staging → Archive**: Data flows from staging to archive node

This means staging is the source node that feeds data to both transform and archive nodes, rather than a linear flow through all three nodes.

## Properties

### Adapter-Specific Properties
```javascript
// Adapter modes
const AdapterMode = {
  MANUAL: "manual",             // Manual arrangement
  FULL: "full",                 // Full adapter with all nodes
  ARCHIVE_ONLY: "archive-only", // Archive node only
  STAGING_ARCHIVE: "staging-archive", // Staging and archive
  STAGING_TRANSFORM: "staging-transform" // Staging and transform
};

// Node references
this.stagingNode = null;        // Staging node
this.transformNode = null;      // Transform node
this.archiveNode = null;        // Archive node

// Layout configuration
this.nodeSpacing = {            // Spacing between nodes
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

## Adapter Mode and Layout Arrangement Mapping

| Adapter Mode | Layout Arrangement | Nodes | Description | Data Flow |
|--------------|-------------------|------------|-------------|-----------|
| **full** | 1 | Staging, Transform, Archive | Full adapter with archive layout | Staging → Transform, Staging → Archive |
| **full** | 2 | Staging, Transform, Archive | Full adapter with transform layout | Staging → Transform, Staging → Archive |
| **full** | 3 | Staging, Transform, Archive | Full adapter with staging layout | Staging → Transform, Staging → Archive |
| **archive-only** | 5 | Archive only | Archive node only | No internal flow |
| **staging-archive** | 4 | Staging, Archive | Staging and archive nodes | Staging → Archive |
| **staging-transform** | 4 | Staging, Transform | Staging and transform nodes | Staging → Transform |

### Default Arrangements and Fallbacks
- **full mode**: Defaults to arrangement 1 if not specified
- **staging-archive mode**: Automatically uses arrangement 4
- **staging-transform mode**: Automatically uses arrangement 4
- **archive-only mode**: Automatically uses arrangement 5
- **Fallback**: If an invalid mode or arrangement is provided, the adapter node will use the default arrangement for the mode, or arrangement 1 if mode is also invalid.
- **Error**: If a required node (e.g., "staging") is missing from the configuration, an error will be thrown and the node will not render.

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
- Initializes node references
- Configures adapter modes
- Sets up spacing and layout settings
- Calls parent constructor

#### `initializeNodeData(nodeData)`
Initializes adapter-specific node data and configuration.

**Process:**
- Sets default adapter mode (full)
- Configures node roles and relationships
- Sets up layout constraints
- Maps adapter modes to default arrangements

### Node Management

#### `createNodes()`
Creates adapter nodes based on roles and mode.

**Nodes Created:**
- **Staging Node**: Data staging and preparation
- **Transform Node**: Data transformation and processing
- **Archive Node**: Data archiving and storage

#### `updateNodeStatus(status)`
Updates status across all adapter nodes.

**Process:**
- Propagates status to staging node
- Propagates status to transform node
- Propagates status to archive node
- Updates adapter container status

#### `createInternalEdges()`
Creates edges between adapter nodes based on mode.

**Edge Creation Logic:**
- **staging-transform mode**: Creates edge from staging to transform
- **staging-archive mode**: Creates edge from staging to archive
- **full mode**: Creates both edges (staging to transform AND staging to archive)

## Configuration

### Adapter Node Settings
```javascript
const adapterSettings = {
  // Adapter mode configuration
  adapterMode: "full",          // manual, full, archive-only, staging-archive, staging-transform
  
  // Layout configuration
  layout: {
    type: "adapter",            // Layout type identifier
    mode: "full",               // Adapter mode
    arrangement: 1,              // Layout arrangement (1-5)
    spacing: {
      horizontal: 20,           // Horizontal spacing between nodes
      vertical: 10              // Vertical spacing between nodes
    }
  },
  
  // Node configuration
  nodes: {
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
  height: 74,                   // Container height
  state: "active",              // Status
  layout: {                     // Layout configuration
    mode: "full",               // Adapter mode
    arrangement: 1              // Layout arrangement
  },
  // Nodes are auto-created based on mode
};
```

## Layout Arrangements

### Arrangement 1: Full Archive Layout
Complete adapter with all three nodes in **archive-focused** layout:

<svg width="400" height="200" xmlns="http://www.w3.org/2000/svg">
  <rect x="10" y="10" width="220" height="150" fill="#f9f9f9" stroke="#ccc" stroke-width="2" rx="6"/>
  <text x="110" y="30" text-anchor="middle" font-family="Arial" font-size="14" font-weight="bold" fill="#333">Arrangement 1</text>
  <rect x="30" y="100" width="80" height="40" fill="#e1f5fe" stroke="#2196f3" stroke-width="2" rx="4"/>
  <text x="70" y="125" text-anchor="middle" font-family="Arial" font-size="11" fill="#1565c0">Staging</text>
  <rect x="80" y="50" width="120" height="40" fill="#e8f5e8" stroke="#4caf50" stroke-width="2" rx="4"/>
  <text x="140" y="75" text-anchor="middle" font-family="Arial" font-size="11" fill="#388e3c">Archive</text>
  <rect x="120" y="100" width="80" height="40" fill="#f3e5f5" stroke="#9c27b0" stroke-width="2" rx="4"/>
  <text x="160" y="125" text-anchor="middle" font-family="Arial" font-size="11" fill="#7b1fa2">Transform</text>
  <path d="M 110 120 L 120 120" stroke="#666" stroke-width="2" marker-end="url(#arrowhead)"/>
  <polyline points="70,100 70,70 80,70" fill="none" stroke="#666" stroke-width="2" marker-end="url(#arrowhead)"/>
  <defs>
    <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
      <polygon points="0 0, 10 3.5, 0 7" fill="#666"/>
    </marker>
  </defs>
</svg>

**Layout Details:**
- **Staging Node**: Bottom left
- **Archive Node**: Top right, left side start at 2/3 the width of staging, right side ends at same side as right side of archive
- **Transform Node**: Bottom right, in line with staging, with a small space between,  same height as staging
- **Data Flow**: 
  - Staging feeds archive horizontally
  - Staging feeds transform, from bottom-middle of staging, to left-middle of transform, with a straight corner line
- **Container**: margin between top and bottom rows

### Arrangement 2: Full Transform Layout
Complete adapter with all three nodes in **transform-focused** layout

<svg width="240" height="170" xmlns="http://www.w3.org/2000/svg">
  <rect x="10" y="10" width="220" height="150" fill="#f9f9f9" stroke="#ccc" stroke-width="2" rx="6"/>
  <text x="120" y="30" text-anchor="middle" font-family="Arial" font-size="14" font-weight="bold" fill="#333">Arrangement 2</text>
  <rect x="30" y="50" width="80" height="40" fill="#e1f5fe" stroke="#2196f3" stroke-width="2" rx="4"/>
  <text x="70" y="75" text-anchor="middle" font-family="Arial" font-size="11" fill="#1565c0">Staging</text>
  <rect x="120" y="50" width="80" height="40" fill="#e8f5e8" stroke="#4caf50" stroke-width="2" rx="4"/>
  <text x="160" y="75" text-anchor="middle" font-family="Arial" font-size="11" fill="#388e3c">Archive</text>
  <rect x="83" y="100" width="117" height="40" fill="#f3e5f5" stroke="#9c27b0" stroke-width="2" rx="4"/>
  <text x="141.5" y="125" text-anchor="middle" font-family="Arial" font-size="11" fill="#7b1fa2">Transform</text>
  <path d="M 110 70 L 120 70" stroke="#666" stroke-width="2" marker-end="url(#arrowhead)"/>
  <polyline points="70,90 70,120 83,120" fill="none" stroke="#666" stroke-width="2" marker-end="url(#arrowhead)"/>
  <defs>
    <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
      <polygon points="0 0, 10 3.5, 0 7" fill="#666"/>
    </marker>
  </defs>
</svg>

**Layout Details:**
- **Staging Node**: Top left, same height as transform
- **Archive Node**: Top right, in line with staging, same height as staging
- **Transform Node**: Bottom, left at 2/3 of staging, right at end of archive
- **Data Flow**: 
  - Staging feeds archive horizontally
  - Staging feeds transform, from bottom-middle of staging, to left-middle of transform, with a cornered line
- **Container**: margin between top and bottom rows

### Arrangement 3: Full Staging Layout
Complete adapter with all three nodes in **staging-focused** layout:
**Use Case**: Complete data pipeline with staging emphasis

<svg width="400" height="200" xmlns="http://www.w3.org/2000/svg">
  <rect x="10" y="10" width="220" height="150" fill="#f9f9f9" stroke="#ccc" stroke-width="2" rx="6"/>
  <text x="120" y="30" text-anchor="middle" font-family="Arial" font-size="14" font-weight="bold" fill="#333">Arrangement 3</text>
  <rect x="30" y="50" width="80" height="90" fill="#e1f5fe" stroke="#2196f3" stroke-width="2" rx="4"/>
  <text x="70" y="100" text-anchor="middle" font-family="Arial" font-size="11" fill="#1565c0">Staging</text>
  <rect x="130" y="50" width="80" height="40" fill="#e8f5e8" stroke="#4caf50" stroke-width="2" rx="4"/>
  <text x="170" y="75" text-anchor="middle" font-family="Arial" font-size="11" fill="#388e3c">Archive</text>
  <rect x="130" y="100" width="80" height="40" fill="#f3e5f5" stroke="#9c27b0" stroke-width="2" rx="4"/>
  <text x="170" y="125" text-anchor="middle" font-family="Arial" font-size="11" fill="#7b1fa2">Transform</text>
  <path d="M 110 70 L 130 70" stroke="#666" stroke-width="2" marker-end="url(#arrowhead)"/>
  <path d="M 110 120 L 130 120" stroke="#666" stroke-width="2" marker-end="url(#arrowhead)"/>
  <defs>
    <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
      <polygon points="0 0, 10 3.5, 0 7" fill="#666"/>
    </marker>
  </defs>
</svg>

**Layout Details:**
- **Staging node** spans full height of the inner container
- **Archive and transform node**: above to each other, and have the same size
  - top archive is top staging
  - bottom transform is bottom staging
- **Container**: height of the inner container is determined by height of archive + height transform + margin in between
- **Data Flow**: Staging feeds both Archive and Transform horizontally

### Arrangement 4: Line Layout
Linear arrangement for two-node modes:

<svg width="500" height="120" xmlns="http://www.w3.org/2000/svg">
  <!-- Container -->
  <rect x="10" y="10" width="220" height="100" fill="#f9f9f9" stroke="#ccc" stroke-width="2" rx="6"/>
  <text x="120" y="30" text-anchor="middle" font-family="Arial" font-size="12" font-weight="bold" fill="#333">Arrangement 4 (Staging-Archive)</text>
  <!-- Staging Node (left) -->
  <rect x="30" y="50" width="80" height="40" fill="#e1f5fe" stroke="#2196f3" stroke-width="2" rx="4"/>
  <text x="70" y="75" text-anchor="middle" font-family="Arial" font-size="11" fill="#1565c0">Staging</text>
  <!-- Archive Node (right) -->
  <rect x="120" y="50" width="80" height="40" fill="#e8f5e8" stroke="#4caf50" stroke-width="2" rx="4"/>
  <text x="160" y="75" text-anchor="middle" font-family="Arial" font-size="11" fill="#388e3c">Archive</text>
  <!-- Data Flow Arrow -->
  <path d="M 110 70 L 120 70" stroke="#666" stroke-width="2" marker-end="url(#arrowhead)"/>
  <!-- Container -->
  <rect x="250" y="10" width="220" height="100" fill="#f9f9f9" stroke="#ccc" stroke-width="2" rx="6"/>
  <text x="360" y="30" text-anchor="middle" font-family="Arial" font-size="12" font-weight="bold" fill="#333">Arrangement 4 (Staging-Transform)</text>
  <!-- Staging Node (left) -->
  <rect x="270" y="50" width="80" height="40" fill="#e1f5fe" stroke="#2196f3" stroke-width="2" rx="4"/>
  <text x="310" y="75" text-anchor="middle" font-family="Arial" font-size="11" fill="#1565c0">Staging</text>
  <!-- Transform Node (right) -->
  <rect x="360" y="50" width="80" height="40" fill="#f3e5f5" stroke="#9c27b0" stroke-width="2" rx="4"/>
  <text x="400" y="75" text-anchor="middle" font-family="Arial" font-size="11" fill="#7b1fa2">Transform</text>
  <!-- Data Flow Arrow -->
  <path d="M 350 70 L 360 70" stroke="#666" stroke-width="2" marker-end="url(#arrowhead)"/>
  <!-- Arrow marker definition -->
  <defs>
    <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
      <polygon points="0 0, 10 3.5, 0 7" fill="#666"/>
    </marker>
  </defs>
</svg>

**Layout Details:**
- **Staging Node**: Left side 

Depending on the mode:
- staging-archive
  - **Archive Node**: Right side
  - **Data Flow**: Simple horizontal flow from Staging to Archive
- staging-transform
  - **Transform Node**: Right side
  - **Data Flow**: Simple horizontal flow from Staging to Transform

### Arrangement 5: Single Node Layout
Single node layout for archive-only mode:

<svg width="400" height="120" xmlns="http://www.w3.org/2000/svg">
  <!-- Container -->
  <rect x="10" y="10" width="220" height="100" fill="#f9f9f9" stroke="#ccc" stroke-width="2" rx="6"/>
  <text x="120" y="30" text-anchor="middle" font-family="Arial" font-size="14" font-weight="bold" fill="#333">Arrangement 5</text>
  <!-- Archive Node (centered) -->
  <rect x="30" y="50" width="180" height="40" fill="#e8f5e8" stroke="#4caf50" stroke-width="2" rx="4"/>
  <text x="120" y="75" text-anchor="middle" font-family="Arial" font-size="11" fill="#388e3c">Archive</text>
</svg>

**Layout Details:**
- **Archive Node**: Centered
- **Data Flow**: No internal flow (single node)
- **Container**: with margins

## Node Roles and Management

### Staging Node
- **Purpose**: Data staging and preparation
- **Function**: Initial data loading and validation
- **Status**: Reflects staging process status
- **Connections**: Outgoing to transform and archive nodes

### Transform Node
- **Purpose**: Data transformation and processing
- **Function**: Data conversion and enrichment
- **Status**: Reflects transformation process status
- **Connections**: Incoming from staging node

### Archive Node
- **Purpose**: Data archiving and storage
- **Function**: Final data storage and retention
- **Status**: Reflects archiving process status
- **Connections**: Incoming from staging node

## Zone System Integration

### Zone Hierarchy
```
Container Zone (outermost)
├── Header Zone (top)
│   ├── Title: "Data Adapter"
│   └── Zoom/collapse button
├── Margin Zones (surrounding)
│   ├── Top Margin (8px from header)
│   ├── Right Margin (8px)
│   ├── Bottom Margin (8px)
│   └── Left Margin (8px)
└── Inner Container Zone (content area)
    ├── Staging Node
    ├── Transform Node
    └── Archive Node
```

### Zone Management
- **Header Zone**: Displays adapter title and controls
- **Inner Container Zone**: Manages node positioning
- **Margin Zones**: Provide consistent spacing
- **Coordinate System**: Nodes are positioned relative to the inner container's origin at (0,0).

## Performance Considerations

### Layout Optimization
- **Mode-Based Layouts**: Efficient layout selection based on mode
- **Node Caching**: Node references cached for performance
- **Edge Optimization**: Internal edges created efficiently
- **Status Propagation**: Efficient status updates across nodes

### Memory Management
- **Node Lifecycle**: Proper node creation and cleanup
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
- **FoundationNode**: As foundation nodes

### Node Integration
Adapter nodes are typically:
- **RectangularNode**: Standard node representation
- **Custom Nodes**: Specialized node types
- **Status Indicators**: Visual status representation
- **Edge Connections**: Internal and external connections

## Error Handling

### Layout Errors
- **Mode Validation**: Invalid adapter mode handling (fallback to default arrangement)
- **Node Creation**: Required node missing results in error and node will not render
- **Edge Creation**: Internal edge creation error handling
- **Status Propagation**: Status update error recovery

### Recovery Mechanisms
- **Fallback Layout**: Default layout when mode fails
- **Node Recovery**: Node recreation on failure
- **Edge Recovery**: Edge recreation on failure
- **Status Recovery**: Status restoration on error

## Testing

### Unit Testing
- **Constructor Tests**: Proper initialization with various modes
- **Layout Tests**: All 5 layout arrangement validations
- **Node Tests**: Node creation and management
- **Edge Tests**: Internal edge creation and management

### Integration Testing
- **Parent-Child Relationships**: Container-node interactions
- **Zone System**: Zone management and positioning
- **Status Propagation**: Status flow through nodes
- **Performance**: Large numbers of adapters

## Navigation

- **[Documentation Overview](../README.md)** - Back to main documentation
- **[BaseContainerNode](base-container-node.md)** - Parent class documentation
- **[FoundationNode](foundation-node.md)** - Alternative role-based container
- **[MartNode](mart-node.md)** - Alternative role-based container
- **[RectangularNode](rectangular-node.md)** - Common node type
- **[Implementation Details](../../implementation.md)** - Technical implementation

## Related Classes

### Dependencies
- **BaseContainerNode** - Container functionality
- **ZoneManager** - Zone system management
- **LayoutManager** - Layout algorithm management
- **ConfigManager** - Configuration management

### Common Nodes
- **RectangularNode** - Standard node type
- **Custom Nodes** - Specialized node types
- **Status Indicators** - Visual status representation

### Related Containers
- **FoundationNode** - Alternative role-based layout
- **MartNode** - Alternative role-based layout
- **LaneNode** - Vertical arrangement alternative
- **ColumnsNode** - Horizontal arrangement alternative 