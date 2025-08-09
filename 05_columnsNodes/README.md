# Columns Node Tests and Demos

This directory contains comprehensive tests and demos for the ColumnsNode class, which provides horizontal row layout for child nodes with vertical centering.

## Test Structure

### 1. Basic Columns Tests (`01_basic/`)
- **Purpose**: Basic columns node rendering and functionality
- **Features**: Single columns node with 3 rectangular children in horizontal row
- **Tests**: Basic rendering, data structure validation, horizontal alignment

### 2. Simple Tests (`01_simple-tests/`)

#### 2.1 Default Mode Tests (`01_default-mode/`)
- **Purpose**: Columns with 3 rectangles in default mode
- **Features**: 
  - 3 child rectangle nodes
  - Default layout mode
  - Vertical centering
  - Horizontal stacking with proper spacing
- **Tests**:
  - Render columns with 3 rectangles
  - Center child rectangles vertically
  - Stack child rectangles horizontally with proper spacing

#### 2.2 Auto-Size Mode Tests (`02_auto-size-mode/`)
- **Purpose**: Columns with auto-sizing and different child sizes
- **Features**:
  - 4 child nodes with variable widths
  - Auto-sizing behavior
  - Adaptive width calculations
  - Different display modes (code, full, expanded)
- **Tests**:
  - Render columns with variable child sizes
  - Verify adaptive width calculations
  - Test different display modes
  - Maintain proper horizontal alignment

#### 2.3 Fixed-Size Mode Tests (`03_fixed-size-mode/`)
- **Purpose**: Columns with fixed-size children and consistent dimensions
- **Features**:
  - 4 child nodes with uniform sizes
  - Fixed-size behavior
  - Consistent width constraints
  - Minimum column width configuration
- **Tests**:
  - Render columns with uniform child sizes
  - Verify fixed-size behavior
  - Test minimum width constraints
  - Maintain consistent layout

#### 2.4 Dynamic Addition Tests (`04_dynamic-addition/`)
- **Purpose**: Columns with dynamic node addition functionality
- **Features**:
  - 2 initial rectangle nodes
  - Runtime addition capability
  - Responsive layout updates
  - Dynamic sizing adjustments
- **Tests**:
  - Render initial columns with two rectangles
  - Test dynamic addition functionality
  - Verify layout updates when nodes are added
  - Maintain proper horizontal alignment with new nodes

### 3. Nested Tests (`02_nested-tests/`)

#### 3.1 Nested Columns Tests (`05_nested-columns/`)
- **Purpose**: Columns containing other columns for complex layouts
- **Features**: 
  - Parent columns container with child columns
  - Left section with 2 nested elements
  - Middle standalone rectangle
  - Right section with 3 nested elements
  - Multi-level horizontal layout management
- **Tests**:
  - Render nested columns structure correctly
  - Verify proper hierarchy and parent-child relationships
  - Test layout consistency across nesting levels

#### 3.2 Mixed Children Tests (`06_mixed-children/`)
- **Purpose**: Columns containing different types of child nodes
- **Features**:
  - Rectangle child node
  - Circle child node
  - Lane container child with nested elements
  - Adapter node child
  - Heterogeneous child type management
- **Tests**:
  - Render mixed child types correctly
  - Verify different node types integrate properly
  - Test layout consistency with diverse children

#### 3.3 Variable Width Tests (`07_variable-width/`)
- **Purpose**: Columns with variable and constrained child widths
- **Features**:
  - Narrow child with width constraints
  - Wide child with minimum width requirements
  - Flexible child that adapts
  - Constrained child with min/max bounds
  - Minimum column width configuration
- **Tests**:
  - Render variable width children correctly
  - Verify width constraint handling
  - Test flexible sizing behavior
  - Validate constraint boundaries

## Test Coverage

### Core Functionality Tests
1. **Basic Rendering**: Verify columns nodes render correctly
2. **Child Management**: Test child node addition, removal, and positioning
3. **Layout Algorithm**: Test horizontal stacking and vertical centering
4. **Size Calculation**: Test container sizing based on child content
5. **Width Adaptation**: Test container width adaptation to child requirements

### Layout Mode Tests
1. **Default Layout**: Standard horizontal row arrangement
2. **Auto-Size Layout**: Dynamic width adjustment based on content
3. **Fixed-Size Layout**: Consistent sizing with defined constraints
4. **Variable Width**: Mixed sizing with different width requirements

### Nested Structure Tests
1. **Basic Nesting**: Columns containing other columns
2. **Mixed Children**: Columns with different child node types
3. **Complex Hierarchies**: Multi-level nested column structures

## Test Data Structure

Each demo includes:
- **HTML Demo File**: Interactive demonstration with controls
- **JavaScript Data File**: Node definitions and configuration
- **Test Configuration**: Test metadata and expected behaviors

### Demo Data Structure
```javascript
{
  metadata: {
    name: "demo-name",
    nodeType: "columns",
    features: ["feature1", "feature2"],
    description: "Demo description",
    testStatus: "Not Tested"
  },
  settings: {
    // Dashboard configuration
    showGrid: true,
    demoMode: true,
    enableTesting: true
  },
  nodes: [
    {
      id: "columns1",
      type: "columns",
      label: "Process Columns",
      layout: {
        displayMode: "full",
        arrangement: "default"
      },
      children: [
        // Child node definitions
      ]
    }
  ],
  edges: []
}
```

## Running Tests

### Automated Tests
Run the comprehensive test suite:
```bash
npm test tests/columns-nodes.spec.js
```

### Manual Testing
1. Open each demo HTML file in a browser
2. Use the demo controls to test functionality
3. Verify visual behavior matches expected results
4. Check console for any errors or warnings

### Test Categories

#### Visual Tests
- Node rendering and visibility
- Layout positioning and spacing
- Size calculations and constraints
- Horizontal alignment and vertical centering

#### Functional Tests
- Child node management
- Layout algorithm accuracy
- Dynamic updates and changes
- Width constraint handling

#### Performance Tests
- Large numbers of child nodes
- Frequent layout updates
- Memory usage and cleanup

## Expected Behaviors

### Columns Layout Algorithm
1. **Horizontal Stacking**: Children arranged in single horizontal row
2. **Vertical Centering**: Each child centered within container height
3. **Automatic Spacing**: Configurable horizontal spacing between children
4. **Dynamic Sizing**: Container width adapts to child content

### Size Modes
1. **Auto-Size**: Node width adapts to content
2. **Fixed-Size**: Node width uses consistent dimensions
3. **Variable Width**: Mixed sizing with constraints

### Width Constraints
1. **Minimum Column Width**: Enforced minimum width for individual columns
2. **Container Adaptation**: Container width grows to accommodate children
3. **Spacing Management**: Consistent spacing between all children

## File Structure

```
05_columnsNodes/
├── 01_basic/
│   ├── basic.html
│   ├── js/graphData.js
│   ├── css/demo.css
│   ├── README.md
│   └── test-data.json
├── 01_simple-tests/
│   ├── 01_default-mode/
│   │   ├── default-mode.html
│   │   ├── js/graphData.js
│   │   ├── css/demo.css
│   │   ├── README.md
│   │   └── test-data.json
│   ├── 02_auto-size-mode/
│   │   ├── auto-size-mode.html
│   │   ├── js/graphData.js
│   │   ├── css/demo.css
│   │   ├── README.md
│   │   └── test-data.json
│   ├── 03_fixed-size-mode/
│   │   ├── fixed-size-mode.html
│   │   ├── js/graphData.js
│   │   ├── css/demo.css
│   │   ├── README.md
│   │   └── test-data.json
│   ├── 04_dynamic-addition/
│   │   ├── dynamic-addition.html
│   │   ├── js/graphData.js
│   │   ├── css/demo.css
│   │   ├── README.md
│   │   └── test-data.json
│   ├── css/demo.css
│   ├── js/graphData.js
│   ├── README.md
│   └── test-data.json
├── 02_nested-tests/
│   ├── 05_nested-columns/
│   │   ├── nested-columns.html
│   │   ├── js/graphData.js
│   │   ├── css/demo.css
│   │   ├── README.md
│   │   └── test-data.json
│   ├── 06_mixed-children/
│   │   ├── mixed-children.html
│   │   ├── js/graphData.js
│   │   ├── css/demo.css
│   │   ├── README.md
│   │   └── test-data.json
│   └── 07_variable-width/
│       ├── variable-width.html
│       ├── js/graphData.js
│       ├── css/demo.css
│       ├── README.md
│       └── test-data.json
└── README.md
```

## Integration with Test Suite

The columns tests are integrated into the main test suite:
- **Test File**: `tests/columns-nodes.spec.js`
- **Coverage**: All columns functionality and layout modes
- **Automation**: Playwright-based automated testing
- **Validation**: Visual and functional test validation

## Comparison with Lane Node

### Layout Differences
- **Orientation**: Horizontal row vs. Vertical stack (lane)
- **Centering**: Vertical centering vs. Horizontal centering (lane)
- **Sizing**: Width adapts vs. Height adapts (lane)
- **Spacing**: Horizontal spacing vs. Vertical spacing (lane)

### Use Case Differences
- **Columns**: Better for parallel, side-by-side content
- **Lane**: Better for sequential, top-to-bottom content
- **Columns**: More suitable for comparisons and parallel processes
- **Lane**: More suitable for workflows and sequential processes

## Dependencies

- **Dashboard Framework**: `../../dashboard/js/index.js`
- **D3.js**: For SVG manipulation and layout
- **Playwright**: For automated testing
- **CSS Framework**: `../../dashboard/flowdash.css`

## Zone System Integration

The ColumnsNode fully integrates with the zone system:
- **Header Zone**: Container title and controls
- **Inner Container Zone**: Child positioning and layout
- **Margin Zones**: Consistent spacing around content
- **Coordinate System**: Children positioned relative to inner container

## Future Enhancements

1. **Additional Layout Modes**: More specialized horizontal layout algorithms
2. **Advanced Width Constraints**: Proportional sizing and flex-like behavior
3. **Performance Optimization**: Large-scale layout testing
4. **Accessibility Testing**: Screen reader and keyboard navigation
5. **Mobile Responsiveness**: Touch interactions and mobile layouts
6. **Collapse/Expand**: Container state management (not yet implemented)
