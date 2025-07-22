# AdapterNode

## Overview

`AdapterNode` is a specialized container node type that provides multiple layout arrangements for data adapter patterns. It's designed for representing data transformation and integration scenarios with different layout modes, each optimized for specific adapter configurations and use cases.

## Inheritance

- **Parent**: [BaseContainerNode](base-container-node.md)
- **Children**: Auto-created based on adapter roles

## Key Features

### Multi-Arrangement Layout
- **5 Layout Arrangements**: Different arrangements for various adapter scenarios
- **Role-Based Components**: Automatic child creation based on adapter roles
- **Flexible Display Modes**: Full and role-only display options
- **Dynamic Sizing**: Container adapts to arrangement requirements

### Adapter-Specific Behavior
- **Component Management**: Automatic staging, transform, and archive component creation
- **Internal Edges**: Automatic edge creation between components
- **Status Propagation**: Status changes propagate through adapter components
- **Collapse/Expand**: Integrated support for hiding/showing components

## Data Flow

The adapter follows a specific data flow pattern:
- **Staging → Transform**: Data flows from staging to transform component
- **Staging → Archive**: Data flows from staging to archive component

This means staging is the source component that feeds data to both transform and archive components, rather than a linear flow through all three components.

<svg width="400" height="160" xmlns="http://www.w3.org/2000/svg">
  <!-- Staging Component -->
  <rect x="20" y="40" width="80" height="40" fill="#e1f5fe" stroke="#2196f3" stroke-width="2" rx="4"/>
  <text x="60" y="65" text-anchor="middle" font-family="Arial" font-size="12" fill="#1565c0">Staging</text>
  <rect x="200" y="40" width="80" height="40" fill="#f3e5f5" stroke="#9c27b0" stroke-width="2" rx="4"/>
  <text x="240" y="65" text-anchor="middle" font-family="Arial" font-size="12" fill="#7b1fa2">Transform</text>
  <rect x="200" y="100" width="80" height="40" fill="#e8f5e8" stroke="#4caf50" stroke-width="2" rx="4"/>
  <text x="240" y="125" text-anchor="middle" font-family="Arial" font-size="12" fill="#388e3c">Archive</text>
  <path d="M 100 60 L 190 60" stroke="#666" stroke-width="2" marker-end="url(#arrowhead)"/>
  <path d="M 100 60 L 190 120" stroke="#666" stroke-width="2" marker-end="url(#arrowhead)"/>
  <defs>
    <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
      <polygon points="0 0, 10 3.5, 0 7" fill="#666"/>
    </marker>
  </defs>
</svg>

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

## Adapter Mode and Layout Arrangement Mapping

| Adapter Mode | Layout Arrangement | Components | Description | Data Flow |
|--------------|-------------------|------------|-------------|-----------|
| **full** | 1 | Staging, Transform, Archive | Full adapter with archive layout | Staging → Transform, Staging → Archive |
| **full** | 2 | Staging, Transform, Archive | Full adapter with transform layout | Staging → Transform, Staging → Archive |
| **full** | 3 | Staging, Transform, Archive | Full adapter with staging layout | Staging → Transform, Staging → Archive |
| **archive-only** | 5 | Archive only | Archive component only | No internal flow |
| **staging-archive** | 4 | Staging, Archive | Staging and archive components | Staging → Archive |
| **staging-transform** | 4 | Staging, Transform | Staging and transform components | Staging → Transform |

### Default Arrangements
- **full mode**: Defaults to arrangement 1 if not specified
- **staging-archive mode**: Automatically uses arrangement 4
- **staging-transform mode**: Automatically uses arrangement 4
- **archive-only mode**: Automatically uses arrangement 5

### Adapter Modes Overview

<svg width="600" height="400" xmlns="http://www.w3.org/2000/svg">
  <!-- Adapter Modes Section -->
  <rect x="20" y="20" width="250" height="160" fill="#f5f5f5" stroke="#ccc" stroke-width="2" rx="6"/>
  <text x="145" y="40" text-anchor="middle" font-family="Arial" font-size="16" font-weight="bold" fill="#333">Adapter Modes</text>
  
  <!-- Full Mode -->
  <rect x="40" y="60" width="80" height="40" fill="#e3f2fd" stroke="#2196f3" stroke-width="2" rx="4"/>
  <text x="80" y="85" text-anchor="middle" font-family="Arial" font-size="10" fill="#1565c0">Full Mode</text>
  <text x="80" y="95" text-anchor="middle" font-family="Arial" font-size="8" fill="#1565c0">All 3 Components</text>
  
  <!-- Staging-Archive Mode -->
  <rect x="140" y="60" width="80" height="40" fill="#f3e5f5" stroke="#9c27b0" stroke-width="2" rx="4"/>
  <text x="180" y="85" text-anchor="middle" font-family="Arial" font-size="10" fill="#7b1fa2">Staging-Archive</text>
  <text x="180" y="95" text-anchor="middle" font-family="Arial" font-size="8" fill="#7b1fa2">2 Components</text>
  
  <!-- Staging-Transform Mode -->
  <rect x="40" y="120" width="80" height="40" fill="#f3e5f5" stroke="#9c27b0" stroke-width="2" rx="4"/>
  <text x="80" y="145" text-anchor="middle" font-family="Arial" font-size="10" fill="#7b1fa2">Staging-Transform</text>
  <text x="80" y="155" text-anchor="middle" font-family="Arial" font-size="8" fill="#7b1fa2">2 Components</text>
  
  <!-- Archive-Only Mode -->
  <rect x="140" y="120" width="80" height="40" fill="#e8f5e8" stroke="#4caf50" stroke-width="2" rx="4"/>
  <text x="180" y="145" text-anchor="middle" font-family="Arial" font-size="10" fill="#388e3c">Archive-Only</text>
  <text x="180" y="155" text-anchor="middle" font-family="Arial" font-size="8" fill="#388e3c">1 Component</text>
  
  <!-- Layout Arrangements Section -->
  <rect x="330" y="20" width="250" height="160" fill="#f5f5f5" stroke="#ccc" stroke-width="2" rx="6"/>
  <text x="455" y="40" text-anchor="middle" font-family="Arial" font-size="16" font-weight="bold" fill="#333">Layout Arrangements</text>
  
  <!-- Arrangement 1 -->
  <rect x="350" y="60" width="80" height="40" fill="#fff3e0" stroke="#ff9800" stroke-width="2" rx="4"/>
  <text x="390" y="85" text-anchor="middle" font-family="Arial" font-size="10" fill="#e65100">Arrangement 1</text>
  <text x="390" y="95" text-anchor="middle" font-family="Arial" font-size="8" fill="#e65100">Archive Layout</text>
  
  <!-- Arrangement 2 -->
  <rect x="450" y="60" width="80" height="40" fill="#fff3e0" stroke="#ff9800" stroke-width="2" rx="4"/>
  <text x="490" y="85" text-anchor="middle" font-family="Arial" font-size="10" fill="#e65100">Arrangement 2</text>
  <text x="490" y="95" text-anchor="middle" font-family="Arial" font-size="8" fill="#e65100">Transform Layout</text>
  
  <!-- Arrangement 3 -->
  <rect x="350" y="120" width="80" height="40" fill="#fff3e0" stroke="#ff9800" stroke-width="2" rx="4"/>
  <text x="390" y="145" text-anchor="middle" font-family="Arial" font-size="10" fill="#e65100">Arrangement 3</text>
  <text x="390" y="155" text-anchor="middle" font-family="Arial" font-size="8" fill="#e65100">Staging Layout</text>
  
  <!-- Arrangement 4 -->
  <rect x="450" y="120" width="80" height="40" fill="#f1f8e9" stroke="#4caf50" stroke-width="2" rx="4"/>
  <text x="490" y="145" text-anchor="middle" font-family="Arial" font-size="10" fill="#2e7d32">Arrangement 4</text>
  <text x="490" y="155" text-anchor="middle" font-family="Arial" font-size="8" fill="#2e7d32">Line Layout</text>
  
  <!-- Arrangement 5 -->
  <rect x="400" y="180" width="80" height="40" fill="#fce4ec" stroke="#e91e63" stroke-width="2" rx="4"/>
  <text x="440" y="205" text-anchor="middle" font-family="Arial" font-size="10" fill="#c2185b">Arrangement 5</text>
  <text x="440" y="215" text-anchor="middle" font-family="Arial" font-size="8" fill="#c2185b">Single Component</text>
  
  <!-- Connection Lines -->
  <path d="M 270 80 L 330 80" stroke="#666" stroke-width="2" marker-end="url(#arrowhead)"/>
  <path d="M 270 80 L 330 100" stroke="#666" stroke-width="2" marker-end="url(#arrowhead)"/>
  <path d="M 270 80 L 330 140" stroke="#666" stroke-width="2" marker-end="url(#arrowhead)"/>
  <path d="M 270 140 L 330 140" stroke="#666" stroke-width="2" marker-end="url(#arrowhead)"/>
  <path d="M 270 140 L 330 140" stroke="#666" stroke-width="2" marker-end="url(#arrowhead)"/>
  <path d="M 270 160 L 330 200" stroke="#666" stroke-width="2" marker-end="url(#arrowhead)"/>
  
  <!-- Arrow marker definition -->
  <defs>
    <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
      <polygon points="0 0, 10 3.5, 0 7" fill="#666"/>
    </marker>
  </defs>
</svg>

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
- Maps adapter modes to default arrangements

### Layout Methods

#### `updateLayout()`
Updates the adapter layout based on current mode and display settings.

**Process:**
- Determines current adapter mode
- Selects appropriate layout algorithm
- Positions components according to arrangement
- Updates container size
- Creates internal edges

#### `layoutAlgorithm1_full_archive()`
Layout for full adapter with archive component.

**Arrangement:**

<svg width="400" height="200" xmlns="http://www.w3.org/2000/svg">
  <!-- Container -->
  <rect x="10" y="10" width="380" height="180" fill="#f9f9f9" stroke="#ccc" stroke-width="2" rx="6"/>
  <text x="200" y="30" text-anchor="middle" font-family="Arial" font-size="14" font-weight="bold" fill="#333">Adapter Container</text>
  
  <!-- Staging Component (left side) -->
  <rect x="30" y="50" width="80" height="40" fill="#e1f5fe" stroke="#2196f3" stroke-width="2" rx="4" />
  <text x="70" y="75" text-anchor="middle" font-family="Arial" font-size="11" fill="#1565c0">Staging</text>
  
  <!-- Archive Component (right side) -->
  <rect x="290" y="50" width="80" height="40" fill="#e8f5e8" stroke="#4caf50" stroke-width="2" rx="4"/>
  <text x="330" y="75" text-anchor="middle" font-family="Arial" font-size="11" fill="#388e3c">Archive</text>
  
  <!-- Transform Component (below, spanning both) -->
  <rect x="150" y="120" width="100" height="40" fill="#f3e5f5" stroke="#9c27b0" stroke-width="2" rx="4"/>
  <text x="200" y="145" text-anchor="middle" font-family="Arial" font-size="11" fill="#7b1fa2">Transform</text>
  
  <!-- Data Flow Arrows -->
  <path d="M 110 70 L 190 140" stroke="#666" stroke-width="2" marker-end="url(#arrowhead)"/>
  <path d="M 110 70 L 290 70" stroke="#666" stroke-width="2" marker-end="url(#arrowhead)"/>
  <path d="M 290 70 L 200 140" stroke="#666" stroke-width="2" marker-end="url(#arrowhead)"/>
  
  <!-- Arrow marker definition -->
  <defs>
    <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
      <polygon points="0 0, 10 3.5, 0 7" fill="#666"/>
    </marker>
  </defs>
</svg>

**Layout Description:**
- **Staging Component**: Positioned at top-left (30,50), 80x40px, light blue
- **Archive Component**: Positioned at top-right (290,50), 80x40px, light green  
- **Transform Component**: Positioned below (150,120), 100x40px, spans both components above, light purple
- **Data Flow**: Staging feeds both Transform and Archive, Archive also feeds Transform
- **Container**: 380x180px with 8px margins, components positioned with calculated spacing

#### `layoutAlgorithm2_full_transform()`
Layout for full adapter with transform component.

**Arrangement:**

<svg width="400" height="200" xmlns="http://www.w3.org/2000/svg">
  <!-- Container -->
  <rect x="10" y="10" width="380" height="180" fill="#f9f9f9" stroke="#ccc" stroke-width="2" rx="6"/>
  <text x="200" y="30" text-anchor="middle" font-family="Arial" font-size="14" font-weight="bold" fill="#333">Adapter Container</text>
  
  <!-- Archive Component (top) -->
  <rect x="150" y="50" width="80" height="40" fill="#e8f5e8" stroke="#4caf50" stroke-width="2" rx="4"/>
  <text x="190" y="75" text-anchor="middle" font-family="Arial" font-size="11" fill="#388e3c">Archive</text>
  
  <!-- Staging Component (bottom left) -->
  <rect x="30" y="120" width="80" height="40" fill="#e1f5fe" stroke="#2196f3" stroke-width="2" rx="4"/>
  <text x="70" y="145" text-anchor="middle" font-family="Arial" font-size="11" fill="#1565c0">Staging</text>
  
  <!-- Transform Component (bottom right) -->
  <rect x="290" y="120" width="80" height="40" fill="#f3e5f5" stroke="#9c27b0" stroke-width="2" rx="4"/>
  <text x="330" y="145" text-anchor="middle" font-family="Arial" font-size="11" fill="#7b1fa2">Transform</text>
  
  <!-- Data Flow Arrows -->
  <path d="M 110 140 L 290 140" stroke="#666" stroke-width="2" marker-end="url(#arrowhead)"/>
  
  <!-- Arrow marker definition -->
  <defs>
    <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
      <polygon points="0 0, 10 3.5, 0 7" fill="#666"/>
    </marker>
  </defs>
</svg>

**Layout Description:**
- **Archive Component**: Positioned at top-center (150,50), 80x40px, light green
- **Staging Component**: Positioned at bottom-left (30,120), 80x40px, light blue
- **Transform Component**: Positioned at bottom-right (290,120), 80x40px, light purple
- **Data Flow**: Staging feeds Transform horizontally, Archive is positioned above
- **Container**: 380x180px with 8px margins, vertical spacing between top and bottom rows

#### `layoutAlgorithm3_full_staging()`
Layout for full adapter with staging layout.

**Arrangement:**

<svg width="400" height="200" xmlns="http://www.w3.org/2000/svg">
  <!-- Container -->
  <rect x="10" y="10" width="380" height="180" fill="#f9f9f9" stroke="#ccc" stroke-width="2" rx="6"/>
  <text x="200" y="30" text-anchor="middle" font-family="Arial" font-size="14" font-weight="bold" fill="#333">Adapter Container</text>
  
  <!-- Staging Component (left side, tall) -->
  <rect x="30" y="50" width="80" height="120" fill="#e1f5fe" stroke="#2196f3" stroke-width="2" rx="4"/>
  <text x="70" y="110" text-anchor="middle" font-family="Arial" font-size="11" fill="#1565c0">Staging</text>
  
  <!-- Archive Component (top right) -->
  <rect x="290" y="50" width="80" height="40" fill="#e8f5e8" stroke="#4caf50" stroke-width="2" rx="4"/>
  <text x="330" y="75" text-anchor="middle" font-family="Arial" font-size="11" fill="#388e3c">Archive</text>
  
  <!-- Transform Component (bottom right) -->
  <rect x="290" y="130" width="80" height="40" fill="#f3e5f5" stroke="#9c27b0" stroke-width="2" rx="4"/>
  <text x="330" y="155" text-anchor="middle" font-family="Arial" font-size="11" fill="#7b1fa2">Transform</text>
  
  <!-- Data Flow Arrows -->
  <path d="M 110 110 L 290 70" stroke="#666" stroke-width="2" marker-end="url(#arrowhead)"/>
  <path d="M 110 110 L 290 150" stroke="#666" stroke-width="2" marker-end="url(#arrowhead)"/>
  
  <!-- Arrow marker definition -->
  <defs>
    <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
      <polygon points="0 0, 10 3.5, 0 7" fill="#666"/>
    </marker>
  </defs>
</svg>


**Layout Description:**
- **Staging Component**: Positioned at left (30,50), 80x120px (tall), light blue, spans full height
- **Archive Component**: Positioned at top-right (290,50), 80x40px, light green
- **Transform Component**: Positioned at bottom-right (290,130), 80x40px, light purple
- **Data Flow**: Staging feeds both Archive and Transform horizontally
- **Container**: 380x180px with 8px margins, staging component sized to match archive+transform height

#### `layoutAlgorithm4_line()`
Linear arrangement for staging-archive and staging-transform modes.

**Arrangement:**

<svg width="400" height="120" xmlns="http://www.w3.org/2000/svg">
  <!-- Container -->
  <rect x="10" y="10" width="380" height="100" fill="#f9f9f9" stroke="#ccc" stroke-width="2" rx="6"/>
  <text x="200" y="30" text-anchor="middle" font-family="Arial" font-size="14" font-weight="bold" fill="#333">Adapter Container</text>
  
  <!-- Staging Component (left) -->
  <rect x="30" y="50" width="80" height="40" fill="#e1f5fe" stroke="#2196f3" stroke-width="2" rx="4"/>
  <text x="70" y="75" text-anchor="middle" font-family="Arial" font-size="11" fill="#1565c0">Staging</text>
  
  <!-- Archive Component (right) -->
  <rect x="290" y="50" width="80" height="40" fill="#e8f5e8" stroke="#4caf50" stroke-width="2" rx="4"/>
  <text x="330" y="75" text-anchor="middle" font-family="Arial" font-size="11" fill="#388e3c">Archive</text>
  
  <!-- Data Flow Arrow -->
  <path d="M 110 70 L 290 70" stroke="#666" stroke-width="2" marker-end="url(#arrowhead)"/>
  
  <!-- Arrow marker definition -->
  <defs>
    <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
      <polygon points="0 0, 10 3.5, 0 7" fill="#666"/>
    </marker>
  </defs>
</svg>

**Layout Description:**
- **Staging Component**: Positioned at left (30,50), 80x40px, light blue
- **Archive Component**: Positioned at right (290,50), 80x40px, light green
- **Data Flow**: Simple horizontal flow from Staging to Archive
- **Container**: 380x100px with 8px margins, components positioned with horizontal spacing
- **Note**: For staging-transform mode, Archive is replaced with Transform component

#### `layoutAlgorithm5()`
Single component layout for archive-only mode.

**Arrangement:**

<svg width="400" height="120" xmlns="http://www.w3.org/2000/svg">
  <!-- Container -->
  <rect x="10" y="10" width="380" height="100" fill="#f9f9f9" stroke="#ccc" stroke-width="2" rx="6"/>
  <text x="200" y="30" text-anchor="middle" font-family="Arial" font-size="14" font-weight="bold" fill="#333">Adapter Container</text>
  
  <!-- Archive Component (centered) -->
  <rect x="160" y="50" width="80" height="40" fill="#e8f5e8" stroke="#4caf50" stroke-width="2" rx="4"/>
  <text x="200" y="75" text-anchor="middle" font-family="Arial" font-size="11" fill="#388e3c">Archive</text>
</svg>

**Layout Description:**
- **Archive Component**: Positioned at center (160,50), 80x40px, light green
- **Data Flow**: No internal flow (single component)
- **Container**: 380x100px with 8px margins, component centered horizontally and vertically

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
Creates edges between adapter components based on mode.

**Edge Creation Logic:**
- **staging-transform mode**: Creates edge from staging to transform
- **staging-archive mode**: Creates edge from staging to archive
- **full mode**: Creates both edges (staging to transform AND staging to archive)

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
    mode: "full",               // Adapter mode
    arrangement: 1,             // Layout arrangement (1-5)
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
  height: 74,                   // Container height
  state: "active",              // Status
  layout: {                     // Layout configuration
    displayMode: "role",
    mode: "full",               // Adapter mode
    arrangement: 1              // Layout arrangement
  },
  // Components are auto-created based on mode
};
```

## Layout Arrangements

### Arrangement 1: Full Archive Layout
Complete adapter with all three components in archive-focused layout:

<svg width="400" height="200" xmlns="http://www.w3.org/2000/svg">
  <!-- Container -->
  <rect x="10" y="10" width="380" height="180" fill="#f9f9f9" stroke="#ccc" stroke-width="2" rx="6"/>
  <text x="200" y="30" text-anchor="middle" font-family="Arial" font-size="14" font-weight="bold" fill="#333">Adapter Container</text>
  
  <!-- Staging Component (left side) -->
  <rect x="30" y="50" width="80" height="40" fill="#e1f5fe" stroke="#2196f3" stroke-width="2" rx="4"/>
  <text x="70" y="75" text-anchor="middle" font-family="Arial" font-size="11" fill="#1565c0">Staging</text>
  
  <!-- Archive Component (right side) -->
  <rect x="290" y="50" width="80" height="40" fill="#e8f5e8" stroke="#4caf50" stroke-width="2" rx="4"/>
  <text x="330" y="75" text-anchor="middle" font-family="Arial" font-size="11" fill="#388e3c">Archive</text>
  
  <!-- Transform Component (below, spanning both) -->
  <rect x="150" y="120" width="100" height="40" fill="#f3e5f5" stroke="#9c27b0" stroke-width="2" rx="4"/>
  <text x="200" y="145" text-anchor="middle" font-family="Arial" font-size="11" fill="#7b1fa2">Transform</text>
  
  <!-- Data Flow Arrows -->
  <path d="M 110 70 L 190 140" stroke="#666" stroke-width="2" marker-end="url(#arrowhead)"/>
  <path d="M 110 70 L 290 70" stroke="#666" stroke-width="2" marker-end="url(#arrowhead)"/>
  <path d="M 290 70 L 200 140" stroke="#666" stroke-width="2" marker-end="url(#arrowhead)"/>
  
  <!-- Arrow marker definition -->
  <defs>
    <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
      <polygon points="0 0, 10 3.5, 0 7" fill="#666"/>
    </marker>
  </defs>
</svg>

**Layout Details:**
- **Staging Component**: Top-left (30,50), 80x40px, light blue
- **Archive Component**: Top-right (290,50), 80x40px, light green
- **Transform Component**: Below (150,120), 100x40px, spans both components above, light purple
- **Data Flow**: Staging feeds both Transform and Archive, Archive also feeds Transform
- **Container**: 380x180px with 8px margins, calculated spacing between components

- **Use Case**: Complete data pipeline with archive emphasis
- **Components**: Staging, Transform, Archive
- **Flow**: Staging feeds both transform and archive

### Arrangement 2: Full Transform Layout
Complete adapter with all three components in transform-focused layout:

<svg width="400" height="200" xmlns="http://www.w3.org/2000/svg">
  <!-- Container -->
  <rect x="10" y="10" width="380" height="180" fill="#f9f9f9" stroke="#ccc" stroke-width="2" rx="6"/>
  <text x="200" y="30" text-anchor="middle" font-family="Arial" font-size="14" font-weight="bold" fill="#333">Adapter Container</text>
  
  <!-- Archive Component (top) -->
  <rect x="150" y="50" width="80" height="40" fill="#e8f5e8" stroke="#4caf50" stroke-width="2" rx="4"/>
  <text x="190" y="75" text-anchor="middle" font-family="Arial" font-size="11" fill="#388e3c">Archive</text>
  
  <!-- Staging Component (bottom left) -->
  <rect x="30" y="120" width="80" height="40" fill="#e1f5fe" stroke="#2196f3" stroke-width="2" rx="4"/>
  <text x="70" y="145" text-anchor="middle" font-family="Arial" font-size="11" fill="#1565c0">Staging</text>
  
  <!-- Transform Component (bottom right) -->
  <rect x="290" y="120" width="80" height="40" fill="#f3e5f5" stroke="#9c27b0" stroke-width="2" rx="4"/>
  <text x="330" y="145" text-anchor="middle" font-family="Arial" font-size="11" fill="#7b1fa2">Transform</text>
  
  <!-- Data Flow Arrow -->
  <path d="M 110 140 L 290 140" stroke="#666" stroke-width="2" marker-end="url(#arrowhead)"/>
  
  <!-- Arrow marker definition -->
  <defs>
    <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
      <polygon points="0 0, 10 3.5, 0 7" fill="#666"/>
    </marker>
  </defs>
</svg>

**Layout Details:**
- **Archive Component**: Top-center (150,50), 80x40px, light green
- **Staging Component**: Bottom-left (30,120), 80x40px, light blue
- **Transform Component**: Bottom-right (290,120), 80x40px, light purple
- **Data Flow**: Staging feeds Transform horizontally, Archive positioned above
- **Container**: 380x180px with 8px margins, vertical spacing between top and bottom rows

- **Use Case**: Complete data pipeline with transform emphasis
- **Components**: Staging, Transform, Archive
- **Flow**: Staging feeds both transform and archive

### Arrangement 3: Full Staging Layout
Complete adapter with all three components in staging-focused layout:

<svg width="400" height="200" xmlns="http://www.w3.org/2000/svg">
  <!-- Container -->
  <rect x="10" y="10" width="380" height="180" fill="#f9f9f9" stroke="#ccc" stroke-width="2" rx="6"/>
  <text x="200" y="30" text-anchor="middle" font-family="Arial" font-size="14" font-weight="bold" fill="#333">Adapter Container</text>
  
  <!-- Staging Component (left side, tall) -->
  <rect x="30" y="50" width="80" height="120" fill="#e1f5fe" stroke="#2196f3" stroke-width="2" rx="4"/>
  <text x="70" y="110" text-anchor="middle" font-family="Arial" font-size="11" fill="#1565c0">Staging</text>
  
  <!-- Archive Component (top right) -->
  <rect x="290" y="50" width="80" height="40" fill="#e8f5e8" stroke="#4caf50" stroke-width="2" rx="4"/>
  <text x="330" y="75" text-anchor="middle" font-family="Arial" font-size="11" fill="#388e3c">Archive</text>
  
  <!-- Transform Component (bottom right) -->
  <rect x="290" y="130" width="80" height="40" fill="#f3e5f5" stroke="#9c27b0" stroke-width="2" rx="4"/>
  <text x="330" y="155" text-anchor="middle" font-family="Arial" font-size="11" fill="#7b1fa2">Transform</text>
  
  <!-- Data Flow Arrows -->
  <path d="M 110 110 L 290 70" stroke="#666" stroke-width="2" marker-end="url(#arrowhead)"/>
  <path d="M 110 110 L 290 150" stroke="#666" stroke-width="2" marker-end="url(#arrowhead)"/>
  
  <!-- Arrow marker definition -->
  <defs>
    <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
      <polygon points="0 0, 10 3.5, 0 7" fill="#666"/>
    </marker>
  </defs>
</svg>

**Layout Details:**
- **Staging Component**: Left side (30,50), 80x120px (tall), light blue, spans full height
- **Archive Component**: Top-right (290,50), 80x40px, light green
- **Transform Component**: Bottom-right (290,130), 80x40px, light purple
- **Data Flow**: Staging feeds both Archive and Transform horizontally
- **Container**: 380x180px with 8px margins, staging component sized to match archive+transform height

- **Use Case**: Complete data pipeline with staging emphasis
- **Components**: Staging, Transform, Archive
- **Flow**: Staging feeds both transform and archive

### Arrangement 4: Line Layout
Linear arrangement for two-component modes:

<svg width="400" height="120" xmlns="http://www.w3.org/2000/svg">
  <!-- Container -->
  <rect x="10" y="10" width="380" height="100" fill="#f9f9f9" stroke="#ccc" stroke-width="2" rx="6"/>
  <text x="200" y="30" text-anchor="middle" font-family="Arial" font-size="14" font-weight="bold" fill="#333">Adapter Container</text>
  
  <!-- Staging Component (left) -->
  <rect x="30" y="50" width="80" height="40" fill="#e1f5fe" stroke="#2196f3" stroke-width="2" rx="4"/>
  <text x="70" y="75" text-anchor="middle" font-family="Arial" font-size="11" fill="#1565c0">Staging</text>
  
  <!-- Archive Component (right) -->
  <rect x="290" y="50" width="80" height="40" fill="#e8f5e8" stroke="#4caf50" stroke-width="2" rx="4"/>
  <text x="330" y="75" text-anchor="middle" font-family="Arial" font-size="11" fill="#388e3c">Archive</text>
  
  <!-- Data Flow Arrow -->
  <path d="M 110 70 L 290 70" stroke="#666" stroke-width="2" marker-end="url(#arrowhead)"/>
  
  <!-- Arrow marker definition -->
  <defs>
    <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
      <polygon points="0 0, 10 3.5, 0 7" fill="#666"/>
    </marker>
  </defs>
</svg>

**Layout Details:**
- **Staging Component**: Left side (30,50), 80x40px, light blue
- **Archive Component**: Right side (290,50), 80x40px, light green
- **Data Flow**: Simple horizontal flow from Staging to Archive
- **Container**: 380x100px with 8px margins, components positioned with horizontal spacing
- **Note**: For staging-transform mode, Archive is replaced with Transform component

- **Use Case**: Simple two-component data flows
- **Components**: Two components based on mode
- **Flow**: Direct flow from staging to target component

### Arrangement 5: Single Component Layout
Single component layout for archive-only mode:

<svg width="400" height="120" xmlns="http://www.w3.org/2000/svg">
  <!-- Container -->
  <rect x="10" y="10" width="380" height="100" fill="#f9f9f9" stroke="#ccc" stroke-width="2" rx="6"/>
  <text x="200" y="30" text-anchor="middle" font-family="Arial" font-size="14" font-weight="bold" fill="#333">Adapter Container</text>
  
  <!-- Archive Component (centered) -->
  <rect x="160" y="50" width="80" height="40" fill="#e8f5e8" stroke="#4caf50" stroke-width="2" rx="4"/>
  <text x="200" y="75" text-anchor="middle" font-family="Arial" font-size="11" fill="#388e3c">Archive</text>
</svg>

**Layout Details:**
- **Archive Component**: Centered (160,50), 80x40px, light green
- **Data Flow**: No internal flow (single component)
- **Container**: 380x100px with 8px margins, component centered horizontally and vertically

- **Use Case**: Archive-only operations
- **Components**: Archive only
- **Flow**: No internal flow

## Component Roles

### Staging Component
- **Purpose**: Data staging and preparation
- **Function**: Initial data loading and validation
- **Status**: Reflects staging process status
- **Connections**: Outgoing to transform and archive components

### Transform Component
- **Purpose**: Data transformation and processing
- **Function**: Data conversion and enrichment
- **Status**: Reflects transformation process status
- **Connections**: Incoming from staging component

### Archive Component
- **Purpose**: Data archiving and storage
- **Function**: Final data storage and retention
- **Status**: Reflects archiving process status
- **Connections**: Incoming from staging component

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