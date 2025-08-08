# Flow Dashboard Test Plan

## Overview

This document provides a comprehensive overview of all tests in the Flow Dashboard project. The test suite uses Playwright for end-to-end testing and covers all major components of the dashboard system.

## Test Structure

The test suite is organized into the following categories:

### 1. Node Type Tests
- **Rectangular Nodes** (`rectangular-nodes.spec.js`) - Basic rectangular node functionality
- **Adapter Nodes** (`adapter-nodes.spec.js`) - Complex adapter node with zone system
- **Foundation Nodes** (`foundation-nodes.spec.js`) - Data warehouse foundation nodes
- **General Nodes** (`nodes.spec.js`) - Comprehensive node rendering tests

### 2. Layout and Group Tests
- **Groups** (`groups.spec.js`) - Group layout and nesting functionality
- **Dashboard** (`dashboard.spec.js`) - Main dashboard functionality and zone system

### 3. Edge and Connection Tests
- **Edges** (`edges.spec.js`) - Edge rendering and connection functionality

### 4. Integration and Performance Tests
- **Integration** (`integration.spec.js`) - Complex scenarios and interactions
- **Debug** (`debug.spec.js`) - Debugging and troubleshooting tests

## Detailed Test Descriptions

### Rectangular Node Tests (`rectangular-nodes.spec.js`)

**Test Environment**: `/5_nodes/01_rectNode/01_rectangularNode.html`

#### Core Functionality Tests
1. **Basic Rendering**
   - `should render basic rectangular node with single rectangle`
   - Verifies single rectangle element with proper dimensions
   - Checks default styling (fill: #f8f9fa, stroke: #dee2e6)

2. **Text Labeling**
   - `should render label text centered in the rectangle`
   - Verifies text element is centered (text-anchor: middle, dominant-baseline: middle)
   - Checks text content and positioning

3. **Zone System Validation**
   - `should not have zone system elements for simple rectangular node`
   - Ensures no header zones, container zones, margin zones, or inner container zones
   - Validates simple structure without complex zone system

4. **Status Management**
   - `should handle status changes correctly`
   - Tests status property updates (Unknown → Ready)
   - Verifies status-based styling changes

5. **Dynamic Resizing**
   - `should resize correctly when dimensions change`
   - Tests programmatic resize (200x40)
   - Verifies rectangle and text positioning updates
   - Checks coordinate calculations (-width/2, -height/2)

6. **Text Handling**
   - `should handle long text labels correctly`
   - Tests text content updates with long labels
   - Verifies rectangle width adaptation to text content

7. **Styling and CSS**
   - `should have proper CSS classes and styling`
   - Verifies CSS classes (Node, shape, label)
   - Checks font properties (size: 12px, family: Arial, color: #333333)

8. **Lane Layout with Rectangular Nodes**
   - `should render lane with 3 rectangular nodes correctly`
   - **Test Environment**: `/5_nodes/01_rectNode/03_node_lane.html`
   - Verifies lane container with 3 child rectangular nodes
   - Tests text truncation with ellipses for long text
   - Validates proper centering of child nodes within lane container
   - Checks horizontal centering with tolerance of 5px
   - Ensures child nodes are positioned at the center of the lane, not the left border

### Adapter Node Tests (`adapter-nodes.spec.js`)

**Test Environment**: `/5_nodes/10_adapter/01_single.html`

#### Simple Adapter Tests
1. **Basic Rendering**
   - `should render single adapter node`
   - Verifies adapter node structure with header and main rect
   - Checks for adapter-specific elements (code elements)

2. **Data Attributes**
   - `should render adapter node with proper data attributes`
   - Validates node ID and visibility
   - Ensures proper data structure

3. **Text Content**
   - `should render adapter node with text content`
   - Verifies header text content and visibility
   - Checks text rendering quality

4. **Styling**
   - `should render adapter node with proper styling`
   - Validates visual appearance and styling properties
   - Ensures proper rendering

5. **Positioning**
   - `should render adapter node with correct positioning`
   - Verifies node positioning and bounding box
   - Checks coordinate system

6. **Header Positioning**
   - `should render adapter node header with correct positioning`
   - Validates header zone positioning relative to container
   - Ensures proper zone system implementation

#### Layout Mode Tests
7. **Display Mode Changes**
   - `should switch between full and role display modes`
   - Tests display mode transitions
   - Verifies layout changes

8. **Arrangement Mode Tests**
   - `should render in staging-archive arrangement`
   - `should render in staging-transform arrangement`
   - `should render in transform-archive arrangement`
   - `should render in full arrangement`
   - Tests different arrangement modes and component layouts

9. **Orientation Tests**
   - `should render in horizontal orientation`
   - `should render in vertical orientation`
   - `should render in rotate90 orientation`
   - `should render in rotate270 orientation`
   - Tests different orientation modes

#### Component Visibility Tests
10. **Component Rendering**
    - `should show staging component in role mode`
    - `should show transform component in role mode`
    - `should show archive component in role mode`
    - Tests individual component visibility based on roles

11. **Component Positioning**
    - `should position staging component correctly`
    - `should position transform component correctly`
    - `should position archive component correctly`
    - Validates component positioning within arrangements

### Foundation Node Tests (`foundation-nodes.spec.js`)

**Test Environment**: `/5_nodes/11_foundation/01_single.html`

#### Core Foundation Tests
1. **Basic Rendering**
   - `should render single foundation node`
   - Verifies foundation node structure
   - Checks rect and text elements

2. **Data Attributes**
   - `should render foundation node with proper data attributes`
   - Validates data-type="foundation" attribute
   - Checks node ID and visibility

3. **Text Content**
   - `should render foundation node with text content`
   - Verifies text element visibility and content
   - Ensures proper text rendering

4. **Styling**
   - `should render foundation node with proper styling`
   - Validates fill, stroke, and stroke-width properties
   - Checks visual appearance

5. **Positioning**
   - `should render foundation node with correct positioning`
   - Verifies bounding box and coordinates
   - Ensures proper positioning

6. **Dimensions**
   - `should render foundation node with proper dimensions`
   - Validates width and height attributes
   - Checks dimension calculations

### Dashboard Tests (`dashboard.spec.js`)

**Test Environment**: `/dashboard/flowdash-js.html`

#### Zone System Tests
1. **Header Zone Positioning**
   - `header zone should be positioned at top of container`
   - Validates header zone positioning relative to container
   - Checks zone system implementation

2. **Zoom Button Functionality**
   - `should not have duplicate zoom buttons`
   - `zoom button should work`
   - Tests zoom button rendering and functionality
   - Verifies collapse/expand behavior

3. **Header Movement**
   - `header should move with container`
   - Tests header zone movement during node dragging
   - Validates coordinate system consistency

4. **Debug Tests**
   - `debug - check what elements are rendered`
   - `debug header positioning`
   - Provides debugging information for zone system

### Edge Tests (`edges.spec.js`)

**Test Environment**: `/dashboard/flowdash-js.html`

#### Simple Edge Scenarios
1. **Basic Edge Rendering**
   - `should render simple edge between two nodes`
   - Verifies edge path creation and connection
   - Tests basic edge functionality

2. **Multi-Node Edges**
   - `should render edges with different node types`
   - Tests edges between different node types (adapter, foundation)
   - Validates edge routing

#### Curved Edge Scenarios
3. **Curved Edge Rendering**
   - `should render curved edges correctly`
   - Tests curved edge path generation
   - Validates curve commands in SVG paths

#### Layout-Specific Edge Tests
4. **Column Layout Edges**
   - `should render edges in column layouts`
   - Tests edge routing in column-based layouts
   - Validates edge connections across columns

5. **Complex Layout Edges**
   - `should render edges in mixed column-lane layouts`
   - Tests edge routing in complex layouts
   - Validates mixed layout edge handling

#### Edge Visual Properties
6. **Edge Styling**
   - `should render edges with correct styling`
   - Validates stroke, stroke-width, and visibility
   - Tests edge appearance

7. **Active Edge States**
   - `should render active edges differently`
   - Tests edge state management
   - Validates active/inactive edge styling

#### Edge Interaction Tests
8. **Edge Hover Effects**
   - `should highlight edges on hover`
   - Tests edge hover state management
   - Validates interactive behavior

9. **Edge Connection Maintenance**
   - `should maintain edge connections during node movement`
   - Tests edge persistence during node dragging
   - Validates connection integrity

#### Performance Tests
10. **Edge Performance**
    - `should render many edges efficiently`
    - Tests performance with large numbers of edges
    - Validates rendering efficiency

### Group Tests (`groups.spec.js`)

**Test Environment**: `/dashboard/flowdash-js.html`

#### Simple Group Tests
1. **Basic Group Rendering**
   - `should render simple group with child nodes`
   - Tests basic group structure and child relationships
   - Validates group-container relationships

2. **Nested Groups**
   - `should render nested groups correctly`
   - Tests multi-level group nesting
   - Validates parent-child relationships

#### Lane Layout Tests
3. **Simple Lane Layout**
   - `should render simple lane layout`
   - Tests basic lane structure
   - Validates lane-child relationships

4. **Multiple Adapters in Lane**
   - `should render multiple adapters in lane`
   - Tests lane with multiple child nodes
   - Validates lane capacity

5. **Nested Lanes**
   - `should render nested lanes`
   - Tests lane nesting functionality
   - Validates nested lane structure

6. **Complex Lane Layouts**
   - `should render complex lane layouts`
   - Tests complex lane scenarios
   - Validates advanced lane functionality

#### Column Layout Tests
7. **Simple Column Layout**
   - `should render simple column layout`
   - Tests basic column structure
   - Validates column-child relationships

8. **Adapters in Columns**
   - `should render adapters in columns`
   - Tests column with adapter nodes
   - Validates column-adapter relationships

9. **Nested Columns**
   - `should render nested columns`
   - Tests column nesting functionality
   - Validates nested column structure

10. **Columns with Lanes**
    - `should render columns with lanes`
    - Tests mixed column-lane layouts
    - Validates complex layout combinations

11. **Multiple Lanes in Columns**
    - `should render multiple lanes in columns`
    - Tests complex column-lane combinations
    - Validates advanced layout scenarios

### Integration Tests (`integration.spec.js`)

**Test Environment**: `/dashboard/flowdash-js.html`

#### Complex Layout Scenarios
1. **Complex Data Warehouse Layout**
   - `should render complex data warehouse layout`
   - Tests comprehensive DWH layout with all components
   - Validates complex structure rendering

2. **Mixed Column-Lane Layout**
   - `should render mixed column-lane layout with edges`
   - Tests complex layout with curved edges
   - Validates mixed layout functionality

3. **Nested Groups with Edge Routing**
   - `should render nested groups with complex edge routing`
   - Tests complex group nesting with edge connections
   - Validates advanced edge routing

#### Interactive Scenarios
4. **Edge Connection Maintenance**
   - `should maintain edge connections during complex interactions`
   - Tests edge persistence during multiple node movements
   - Validates connection integrity under stress

5. **Group Expansion/Collapse**
   - `should handle group expansion and collapse`
   - Tests zoom button functionality in groups
   - Validates collapse/expand behavior

6. **Zoom Operations**
   - `should maintain layout during zoom operations`
   - Tests zoom functionality and layout stability
   - Validates zoom behavior

#### Performance and Stress Tests
7. **Large Dataset Handling**
   - `should handle large datasets efficiently`
   - Tests performance with large datasets
   - Validates rendering efficiency and limits

## Test Data Files

The tests use various data files from `dashboard/data/`:

### Main Test Data
- `dwh-1.json` - Simple edge scenarios
- `dwh-2.json` - Different node types
- `dwh-3.json` - Curved edges
- `dwh-4.json` - Column layouts
- `dwh-5.json` - Mixed layouts
- `dwh-6.json` - Performance testing
- `dwh-7.json` - Complex DWH layout
- `dwh-7a.json` - Nested groups
- `dwh-7b.json` - Large datasets
- `dwh-8.json` - Mixed column-lane layouts

### Group Test Data
- `group-simple.json` - Simple groups
- `group-nested.json` - Nested groups
- `lane-simple.json` - Simple lanes
- `lane-adapters.json` - Lanes with adapters
- `lane-nested.json` - Nested lanes
- `lane-complex.json` - Complex lanes
- `columns-simple.json` - Simple columns
- `columns-adapters.json` - Columns with adapters
- `columns-nested.json` - Nested columns
- `columns-lanes.json` - Columns with lanes
- `columns-multiple-lanes.json` - Multiple lanes in columns

### Test Scenarios
- `edge-simple.json` - Simple edge testing
- `node-adapter-single.json` - Single adapter testing

## Test Execution

### Running All Tests
```bash
npm test
```

### Running Specific Test Categories
```bash
# Rectangular nodes only
npx playwright test tests/rectangular-nodes.spec.js

# Adapter nodes only
npx playwright test tests/adapter-nodes.spec.js

# Foundation nodes only
npx playwright test tests/foundation-nodes.spec.js

# Edge tests only
npx playwright test tests/edges.spec.js

# Group tests only
npx playwright test tests/groups.spec.js

# Integration tests only
npx playwright test tests/integration.spec.js
```

### Running Specific Tests
```bash
# Run tests by name pattern
npx playwright test --grep "should render basic rectangular node"

# Run tests with UI mode (interactive)
npx playwright test --ui

# Run tests in headed mode (see browser)
npx playwright test --headed
```

### Test Configuration
- **Timeout**: 30 seconds per test
- **Browsers**: Chromium, WebKit, Firefox
- **Workers**: 6 parallel test workers
- **Retries**: Automatic retry on failure

## Test Coverage Summary

### Node Types Covered
- ✅ Rectangular Nodes (8 tests)
- ✅ Adapter Nodes (25+ tests)
- ✅ Foundation Nodes (6 tests)
- ✅ General Node Rendering (comprehensive)

### Layout Systems Covered
- ✅ Zone System (header zones, container zones)
- ✅ Group Layouts (simple, nested)
- ✅ Lane Layouts (simple, nested, complex)
- ✅ Column Layouts (simple, nested, mixed)

### Edge Systems Covered
- ✅ Simple Edges
- ✅ Curved Edges
- ✅ Layout-Specific Edge Routing
- ✅ Edge Interaction and Hover
- ✅ Edge Performance

### Integration Scenarios Covered
- ✅ Complex Layout Combinations
- ✅ Interactive Behaviors
- ✅ Performance and Stress Testing
- ✅ Zoom and Navigation

### Quality Assurance
- ✅ Visual Rendering
- ✅ Positioning and Layout
- ✅ Styling and CSS
- ✅ Data Attributes
- ✅ Interactive Behaviors
- ✅ Performance Metrics
- ✅ Error Handling

## Recent Fixes and Improvements

### Text Handling Improvements (December 2024)
- **Text Truncation**: Added ellipsis truncation for long text labels
- **Text Width Calculation**: Improved minimum width calculation with proper padding
- **Text Overflow**: Fixed long text going off-screen by ensuring adequate container width

### Lane Node Centering Fix (December 2024)
- **Problem**: Rectangular nodes were positioned at the left border of lane containers
- **Root Cause**: InnerContainerZone coordinate system was not properly centered
- **Fix**: Updated coordinate system calculation to center inner container horizontally
- **Files Modified**: 
  - `dashboard/js/zones/InnerContainerZone.js` - Fixed coordinate system
  - `dashboard/js/nodeLane.js` - Updated layout algorithm
  - `dashboard/js/nodeRect.js` - Added text truncation
- **Test Coverage**: Added comprehensive test for lane centering validation

### Technical Details
- **Coordinate System**: Inner container now positioned at x=0 (center) instead of left edge
- **Text Truncation**: Iterative truncation with ellipsis when text exceeds container width
- **Padding**: Added 20px minimum padding for text containers
- **Tolerance**: 5px tolerance for centering validation in tests

## Test Maintenance

### Adding New Tests
1. Follow the existing test structure and naming conventions
2. Use the `waitForNodes` helper function for consistent node detection
3. Add appropriate error handling and debugging information
4. Update this test plan document with new test descriptions

### Test Data Management
1. Create test data files in `dashboard/data/` for new scenarios
2. Use descriptive file names that indicate the test purpose
3. Keep test data files small and focused on specific test cases
4. Document new test data files in this test plan

### Continuous Integration
- Tests run automatically on code changes
- All tests must pass before merging
- Performance tests ensure rendering efficiency
- Integration tests validate complex scenarios 