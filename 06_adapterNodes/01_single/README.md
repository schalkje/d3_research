# Single Adapter Node Test Page

## Overview

This test page provides comprehensive testing for single adapter nodes with all configuration options and layout arrangements. It's specifically designed to support the Playwright test suite and demonstrate all adapter node capabilities.

## Test Page Details

- **File**: `01_single.html`
- **Purpose**: Single adapter node testing and validation
- **Node Type**: Adapter Node (single instance)
- **Test Framework**: Playwright compatible
- **Layout**: Arrangement 3 (staging-focused) by default

## Features Tested

### Core Adapter Functionality
- ✅ Single adapter node rendering
- ✅ Header background and text rendering
- ✅ Main adapter shape rendering
- ✅ Zone system integration
- ✅ Container positioning and sizing

### Child Node Management
- ✅ Automatic child node creation (staging, archive, transform)
- ✅ Child node positioning within inner container
- ✅ Text positioning within rectangular child nodes
- ✅ Proper text content validation
- ✅ Consistent styling across child nodes

### Layout Arrangements
- ✅ Arrangement 3 (staging-focused) - default
- ✅ Support for all 5 arrangements via data variations
- ✅ Zone-based coordinate system
- ✅ Inner container border visualization

### Positioning and Alignment
- ✅ Header positioning relative to main container
- ✅ Text centering within header
- ✅ Child nodes positioned within inner container bounds
- ✅ Staging height spanning archive + transform + spacing
- ✅ Archive and transform alignment and positioning

## Data Variations

The test page includes multiple data configurations:

### Main Configuration (`singleAdapterData`)
- **Mode**: Full (staging, archive, transform)
- **Arrangement**: 3 (staging-focused)
- **Layout**: Staging spans full height, archive/transform stacked right

### Additional Variations (`allSingleAdapterVariations`)
- **Arrangement 1**: Archive-focused layout
- **Arrangement 2**: Transform-focused layout  
- **Staging-Archive**: Two-node horizontal layout
- **Staging-Transform**: Two-node horizontal layout
- **Archive-Only**: Single node centered layout

## Test Structure

### HTML Structure
```html
<!DOCTYPE html>
<html>
  <head>
    <!-- Standard dashboard CSS and JS libraries -->
  </head>
  <body>
    <header class="demo-header">
      <!-- Test page title and controls -->
    </header>
    <div class="demo-container">
      <svg id="graph" class="canvas"></svg>
    </div>
    <footer class="demo-info">
      <!-- Test metadata and status -->
    </footer>
  </body>
</html>
```

### JavaScript Integration
- Dashboard initialization with adapter data
- Automatic test runner with validation functions
- Window-accessible objects for Playwright testing
- Real-time test status reporting

## Playwright Test Compatibility

### Test URLs
- **Primary**: `/06_adapterNodes/01_single/01_single.html`
- **Alternative paths** supported for backward compatibility

### Test Selectors
```javascript
// Main adapter element
'g.adapter'

// Header elements
'g.adapter rect.header-background'
'g.adapter text.header-text'

// Main shape
'g.adapter rect.adapter.shape'

// Child nodes
'g.adapter g.Node'
'g.adapter g.node-container'

// Inner container border
'g.adapter rect.zone-innerContainer'
```

### Expected Behavior
1. **Single adapter renders** with proper structure
2. **Three child nodes** created (staging, archive, transform)
3. **Header positioned** correctly relative to container
4. **Text content** visible and properly positioned
5. **Child nodes** contained within inner container bounds
6. **Zone system** properly implemented with coordinate transforms

## Testing Instructions

### Manual Testing
1. Open `01_single.html` in browser
2. Verify adapter node renders correctly
3. Check child node positioning and text
4. Use "Run Tests" button for automated validation
5. Inspect console for detailed test results

### Playwright Testing
```bash
# Run adapter node tests
npm test -- tests/adapter-nodes.spec.js

# Run specific test
npx playwright test --grep "should render single adapter node"
```

### Visual Verification
- Adapter container with header and main shape
- Three child nodes: staging (left), archive (top-right), transform (bottom-right)
- Staging height should equal archive height + transform height + spacing
- All text should be contained within respective rectangles
- Inner container border should be visible (light blue)

## Configuration Options

### Layout Modes
```javascript
layout: {
  mode: "full",                // full, staging-archive, staging-transform, archive-only
  arrangement: 3,              // 1-5 different layout arrangements
  displayMode: "full"          // full, role, code
}
```

### Node Spacing
```javascript
nodeSpacing: {
  horizontal: 20,              // Space between horizontally adjacent nodes
  vertical: 10                 // Space between vertically adjacent nodes
}
```

### Container Margins
```javascript
containerMargin: {
  top: 4,                      // Space from header bottom
  right: 8,                    // Space from right edge
  bottom: 8,                   // Space from bottom edge
  left: 8                      // Space from left edge
}
```

## Known Test Requirements

Based on the Playwright test suite, this page must support:

1. **Basic Rendering Tests**
   - Adapter node visibility and structure
   - Header background and text elements
   - Main adapter shape presence

2. **Child Node Tests**  
   - Three child nodes present (staging, archive, transform)
   - Text content validation for each child
   - Rectangle containment for all text elements

3. **Positioning Tests**
   - Header positioned above main rectangle
   - Text vertically centered in header
   - Child nodes within inner container bounds
   - Staging alignment with archive/transform positioning

4. **Zone System Tests**
   - Inner container border at (0,0) relative to zone
   - Zone transform positioning
   - Child nodes positioned in zone coordinate system

## Troubleshooting

### Common Issues
- **No adapter visible**: Check data structure and node type
- **Missing child nodes**: Verify adapter mode and arrangement
- **Positioning errors**: Check zone system initialization
- **Text overflow**: Verify rectangle dimensions and text sizing

### Debug Features
- Console logging for test results
- Window-accessible dashboard object
- Real-time test status display
- Comprehensive error reporting

## Related Files

- `js/graphData.js` - Test data configurations
- `css/demo.css` - Page styling and layout
- `../../tests/adapter-nodes.spec.js` - Playwright test suite
- `../../dashboard/js/nodeAdapter.js` - Adapter node implementation
