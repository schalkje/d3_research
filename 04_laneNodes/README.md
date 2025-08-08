# Lane Node Tests and Demos

This directory contains comprehensive tests and demos for the LaneNode class, which provides vertical stacking layout for child nodes with horizontal centering.

## Test Structure

### 1. Basic Lane Tests (`01_basic/`)
- **Purpose**: Basic lane node rendering and functionality
- **Features**: Single lane node with no children
- **Tests**: Basic rendering, data structure validation

### 2. Simple Tests (`01_simple-tests/`)

#### 2.1 Default Mode Tests (`01_default-mode/`)
- **Purpose**: Lane with 3 rectangles in default mode
- **Features**: 
  - 3 child rectangle nodes
  - Default layout mode
  - Horizontal centering
  - Vertical stacking with proper spacing
- **Tests**:
  - Render lane with 3 rectangles
  - Center child rectangles horizontally
  - Stack child rectangles vertically with proper spacing

#### 2.2 Collapsed Mode Tests (`02_collapsed-mode/`)
- **Purpose**: Lane with 3 rectangles in collapsed mode
- **Features**:
  - 3 child rectangle nodes (hidden)
  - Collapsed state
  - Expand/collapse functionality
- **Tests**:
  - Render collapsed lane with hidden children
  - Show collapsed indicator
  - Expand lane when clicked

#### 2.3 Auto-Size Labels Tests (`03_auto-size-labels/`)
- **Purpose**: Lane with auto-size labels and dynamic changes
- **Features**:
  - 3 child nodes with different label lengths
  - Auto-sizing behavior
  - Toggle button for label changes
  - Dynamic label updates
- **Tests**:
  - Render lane with auto-size labels of different lengths
  - Toggle button functionality
  - Change labels when button is clicked
  - Maintain auto-sizing when labels change

#### 2.4 Fixed-Size Labels Tests (`04_fixed-size-labels/`)
- **Purpose**: Lane with fixed-size labels and dynamic changes
- **Features**:
  - 3 child nodes with fixed sizes
  - Fixed-size behavior
  - Toggle button for label changes
  - Dynamic label updates
- **Tests**:
  - Render lane with fixed-size labels of different lengths
  - Toggle button functionality
  - Change labels when button is clicked
  - Maintain fixed sizes when labels change

#### 2.5 Dynamic Addition Tests (`05_dynamic-addition/`)
- **Purpose**: Lane with dynamic node addition functionality
- **Features**:
  - 1 initial rectangle node
  - Add button functionality
  - Dynamic node addition
  - Proper layout updates
- **Tests**:
  - Render initial lane with one rectangle
  - Add button functionality
  - Add new nodes when button is clicked
  - Maintain proper vertical stacking when nodes are added
  - Center all nodes horizontally within lane

### 3. Nested Tests (`02_nested-tests/`)

#### 3.1 Nested Lane Tests (`07_nested-lanes/`)
- **Purpose**: Lane with 2 nested lanes, each containing 3 elements
- **Features**: 
  - Main lane container with 2 sub-lanes
  - Each sub-lane contains 3 rectangular child elements
  - Proper hierarchical layout management
  - Vertical stacking and horizontal centering
- **Tests**:
  - Render nested lane structure correctly
  - Verify proper hierarchy and parent-child relationships
  - Test layout consistency across nesting levels

#### 3.2 Nested Collapsed Lane Tests (`08_nested-collapsed/`)
- **Purpose**: Lane with 2 nested lanes, one collapsed with hidden children
- **Features**:
  - Main lane container with 2 sub-lanes
  - One expanded sub-lane with visible children
  - One collapsed sub-lane with hidden children
  - Mixed state management
- **Tests**:
  - Render nested structure with mixed expanded/collapsed states
  - Verify collapsed state management in nested hierarchy
  - Test layout consistency with mixed states

#### 3.3 Deep Nesting Tests (`09_deep-nesting/`)
- **Purpose**: Lane with 3 levels of nesting, demonstrating deep hierarchical layout
- **Features**:
  - 3-level nested structure (Level 1 → Level 2 → Level 3)
  - Multiple sub-lanes at each level
  - Child elements at the deepest level
  - Complex hierarchical layout management
- **Tests**:
  - Render deep nested structure correctly
  - Verify proper hierarchy across 3 levels
  - Test layout consistency in deep nesting
  - Validate performance with complex hierarchy

## Test Coverage

### Core Functionality Tests
1. **Basic Rendering**: Verify lane nodes render correctly
2. **Child Management**: Test child node addition, removal, and positioning
3. **Layout Algorithm**: Test vertical stacking and horizontal centering
4. **Size Calculation**: Test container sizing based on child content
5. **Collapse/Expand**: Test container collapse and expansion functionality

### Interactive Tests
1. **Label Changes**: Test dynamic label updates with toggle buttons
2. **Node Addition**: Test dynamic node addition with buttons
3. **Layout Updates**: Test layout recalculation after changes
4. **Size Mode Changes**: Test different size modes (auto-size vs fixed-size)

### Nested Structure Tests
1. **Basic Nesting**: 2-level nested lane structure
2. **Mixed States**: Nested lanes with expanded/collapsed combinations
3. **Deep Nesting**: 3-level complex hierarchical structure

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
    nodeType: "lane",
    features: ["feature1", "feature2"],
    description: "Demo description",
    testStatus: "Not Tested"
  },
  settings: {
    // Dashboard configuration
  },
  nodes: [
    {
      id: "lane1",
      type: "lane",
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
npm test tests/lane-nodes.spec.js
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
- Visual indicators (collapse/expand)

#### Functional Tests
- Child node management
- Layout algorithm accuracy
- Dynamic updates and changes
- Interactive controls

#### Performance Tests
- Large numbers of child nodes
- Frequent layout updates
- Memory usage and cleanup

## Expected Behaviors

### Lane Layout Algorithm
1. **Vertical Stacking**: Children arranged in single vertical column
2. **Horizontal Centering**: Each child centered within container width
3. **Automatic Spacing**: Configurable vertical spacing between children
4. **Dynamic Sizing**: Container height adapts to child content

### Size Modes
1. **Auto-Size**: Node size adapts to content
2. **Fixed-Size**: Node size remains constant regardless of content

### Interactive Features
1. **Label Changes**: Dynamic label updates with size adaptation
2. **Node Addition**: Dynamic child node addition with layout updates
3. **Collapse/Expand**: Container state management with child visibility

## File Structure

```
04_laneNodes/
├── 01_basic/
│   ├── basic.html
│   ├── js/graphData.js
│   └── README.md
├── 02_default-mode/
│   ├── default-mode.html
│   └── js/graphData.js
├── 03_collapsed-mode/
│   ├── collapsed-mode.html
│   └── js/graphData.js
├── 04_auto-size-labels/
│   ├── auto-size-labels.html
│   └── js/graphData.js
├── 05_fixed-size-labels/
│   ├── fixed-size-labels.html
│   └── js/graphData.js
├── 06_dynamic-addition/
│   ├── dynamic-addition.html
│   └── js/graphData.js
├── 07_layout-modes/
│   ├── default-layout.html
│   ├── auto-size-small.html
│   ├── auto-size-large.html
│   ├── fixed-size-small.html
│   ├── fixed-size-large.html
│   └── js/
│       ├── graphData.js
│       ├── graphData-auto-size-small.js
│       ├── graphData-auto-size-large.js
│       ├── graphData-fixed-size-small.js
│       └── graphData-fixed-size-large.js
└── README.md
```

## Integration with Test Suite

The lane tests are integrated into the main test suite:
- **Test File**: `tests/lane-nodes.spec.js`
- **Coverage**: All lane functionality and layout modes
- **Automation**: Playwright-based automated testing
- **Validation**: Visual and functional test validation

## Dependencies

- **Dashboard Framework**: `../../dashboard/js/index.js`
- **D3.js**: For SVG manipulation and layout
- **Playwright**: For automated testing
- **CSS Framework**: `../../dashboard/flowdash.css`

## Future Enhancements

1. **Additional Layout Modes**: More specialized layout algorithms
2. **Advanced Interactions**: Drag-and-drop, resizing, etc.
3. **Performance Optimization**: Large-scale layout testing
4. **Accessibility Testing**: Screen reader and keyboard navigation
5. **Mobile Responsiveness**: Touch interactions and mobile layouts
