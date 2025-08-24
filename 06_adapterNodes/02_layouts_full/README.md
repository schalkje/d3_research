# Multiple Adapter Layouts Test Page

## Overview

This comprehensive test page demonstrates all adapter node layout arrangements and modes. It's designed to support extensive Playwright testing and showcase the full capabilities of the adapter node system with multiple instances and configurations.

## Test Page Details

- **File**: `02_layouts_full.html`
- **Purpose**: Multiple adapter layout testing and validation
- **Node Type**: Adapter Nodes (multiple instances)
- **Test Framework**: Playwright compatible
- **Layouts**: All 5 arrangements with different modes

## Features Tested

### Layout Arrangements
- ✅ **Arrangement 1**: Archive-focused layout (full mode)
- ✅ **Arrangement 2**: Transform-focused layout (full mode)  
- ✅ **Arrangement 3**: Staging-focused layout (full mode)
- ✅ **Arrangement 4**: Two-node horizontal layout (staging-archive & staging-transform modes)
- ✅ **Arrangement 5**: Single node centered layout (archive-only mode)

### Adapter Modes
- ✅ **Full Mode**: Complete adapter with staging, archive, and transform nodes
- ✅ **Staging-Archive Mode**: Two-node adapter with staging and archive
- ✅ **Staging-Transform Mode**: Two-node adapter with staging and transform
- ✅ **Archive-Only Mode**: Single-node adapter with archive only

### Comprehensive Testing
- ✅ Multiple adapter node rendering
- ✅ All child node creation and positioning
- ✅ Text containment within rectangles across all layouts
- ✅ Zone system integration for each adapter
- ✅ Layout variety validation
- ✅ Container positioning and sizing
- ✅ Header and shape element rendering

## Layout Configurations

### Default Configuration (`multipleLayoutsData`)
Displays 6 adapter nodes showcasing all major combinations:

1. **Arrangement 1** - Archive-focused (full mode)
2. **Arrangement 2** - Transform-focused (full mode)
3. **Arrangement 3** - Staging-focused (full mode)
4. **Staging-Archive** - Two-node horizontal (staging-archive mode)
5. **Staging-Transform** - Two-node horizontal (staging-transform mode)
6. **Archive Only** - Single node centered (archive-only mode)

### Layout Variations (`layoutVariations`)

#### All Full Arrangements (`allFullArrangements`)
- Three adapters showing arrangements 1, 2, and 3
- All in full mode for direct comparison
- Horizontal layout for side-by-side evaluation

#### Two-Node Modes (`twoNodeModes`)  
- Staging-archive and staging-transform modes
- Both using arrangement 4
- Demonstrates linear two-node layout

#### Single Node Mode (`singleNodeMode`)
- Multiple archive-only adapters
- All using arrangement 5
- Shows single node centering

#### Mixed Display Modes (`mixedDisplayModes`)
- Same layout with different display modes
- Full vs role display mode comparison
- Width adaptation demonstration

#### Comprehensive Grid (`comprehensiveGrid`)
- 3x2 grid layout of all major combinations
- Systematic arrangement for testing
- Complete coverage of all modes and arrangements

## Data Structure

### Node Configuration Format
```javascript
{
    id: "adapter-id",
    label: "Display Name",
    code: "CODE",
    type: "adapter",
    x: 100,              // X position
    y: 200,              // Y position
    layout: {
        mode: "full",           // full, staging-archive, staging-transform, archive-only
        arrangement: 1,         // 1-5 layout arrangement
        displayMode: "full"     // full, role, code
    },
    status: "active"
}
```

### Layout Arrangement Details

#### Arrangement 1: Archive-Focused
- **Mode**: Full (staging, archive, transform)
- **Layout**: Staging bottom-left, archive top-right, transform bottom-right
- **Use Case**: Archive-centric data pipeline visualization

#### Arrangement 2: Transform-Focused  
- **Mode**: Full (staging, archive, transform)
- **Layout**: Staging/archive top row, transform bottom spanning
- **Use Case**: Transform-centric processing visualization

#### Arrangement 3: Staging-Focused
- **Mode**: Full (staging, archive, transform) 
- **Layout**: Staging left spanning, archive/transform stacked right
- **Use Case**: Staging-centric data preparation visualization

#### Arrangement 4: Two-Node Horizontal
- **Modes**: Staging-archive OR staging-transform
- **Layout**: Linear horizontal arrangement
- **Use Case**: Simplified two-step processes

#### Arrangement 5: Single Node Centered
- **Mode**: Archive-only
- **Layout**: Single archive node centered
- **Use Case**: Simple archive storage representation

## Interactive Features

### Demo Controls
- **Update**: Refresh the current layout
- **Reset**: Return to default configuration  
- **Run Tests**: Execute comprehensive test suite
- **Cycle Layouts**: Switch between layout variations

### Layout Information Panel
- Real-time display of current adapter configurations
- Mode and arrangement details for each adapter
- Layout descriptions and use case information

### Automatic Testing
- Comprehensive test suite runs automatically on load
- Real-time test status reporting
- Detailed console logging for debugging

## Playwright Test Compatibility

### Test URLs
- **Primary**: `/06_adapterNodes/02_layouts_full/02_layouts_full.html`
- **Alternative**: Update test paths from old `/5_nodes/10_adapter/02_layouts_full_.html`

### Test Selectors
```javascript
// Multiple adapter elements
'g.adapter'

// Child nodes across all adapters
'g.adapter g.node'
'g.adapter g.node-container'

// Text and rectangle elements
'g.adapter g.node-container rect'
'g.adapter g.node-container text'

// Zone system elements
'g.adapter rect.zone-innerContainer'
'g.adapter g.zone-innerContainer'
```

### Expected Test Results
1. **Multiple adapters render** (should find > 1 adapter)
2. **All child nodes present** across all adapters
3. **Text containment validated** for each layout
4. **Layout variety confirmed** (different arrangements)
5. **Zone system integration** working for each adapter

## Test Functions

### Core Tests
- `testMultipleAdapterRendering()` - Verifies multiple adapters present
- `testAllChildNodesRendering()` - Validates child node creation
- `testAdapterStructures()` - Checks header/shape elements
- `testChildPositioning()` - Verifies positioning systems
- `testTextContainment()` - Validates text within rectangles
- `testLayoutVariety()` - Confirms different layout patterns
- `testZoneSystemIntegration()` - Checks zone system implementation

### Test Validation
Each test provides:
- ✅ Pass/fail status with detailed logging
- 📊 Comprehensive test summary
- 🎉 Success celebration or ⚠️ failure warnings
- 💥 Error details for troubleshooting

## Usage Instructions

### Manual Testing
1. Open `02_layouts_full.html` in browser
2. Verify 6 different adapter layouts render
3. Check each layout has appropriate child nodes
4. Use "Cycle Layouts" to test different variations
5. Monitor test results in real-time

### Playwright Testing
```bash
# Run multiple layout tests
npm test -- tests/adapter-nodes.spec.js --grep "Multiple Adapter Layout"

# Run all adapter tests
npm test -- tests/adapter-nodes.spec.js
```

### Visual Verification Checklist
- [ ] 6 adapter nodes visible in default layout
- [ ] Each adapter has header with title
- [ ] Child nodes properly positioned within each adapter
- [ ] Text content visible and contained in rectangles
- [ ] Different layout arrangements clearly distinguishable
- [ ] Zone system borders visible (light blue)
- [ ] Layout information panel shows correct details

## Troubleshooting

### Common Issues
- **No adapters visible**: Check data loading and dashboard initialization
- **Missing child nodes**: Verify adapter mode and arrangement configurations
- **Layout not displaying**: Check zone system initialization
- **Test failures**: Review console for detailed error messages

### Debug Features
- Comprehensive console logging for all test functions
- Window-accessible objects: `flowdash`, `multipleLayoutsData`, `layoutVariations`
- Real-time layout information display
- Interactive layout cycling for debugging

### Performance Considerations
- Optimized for multiple adapter rendering
- Efficient zone system management
- Proper cleanup between layout switches
- Memory management for large layouts

## Related Files

- `js/graphData.js` - All layout configurations and variations
- `css/demo.css` - Advanced styling and responsive design
- `../../tests/adapter-nodes.spec.js` - Playwright test suite
- `../../dashboard/js/nodeAdapter.js` - Adapter node implementation
- `../01_single/` - Single adapter test page for comparison

## Layout Metadata

The page includes comprehensive metadata for each arrangement:

```javascript
layoutMetadata: {
    arrangements: { /* Details for arrangements 1-5 */ },
    modes: { /* Details for all adapter modes */ }
}
```

This provides programmatic access to layout information for testing and documentation purposes.
