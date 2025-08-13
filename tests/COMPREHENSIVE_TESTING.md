# Comprehensive Testing Suite for LaneNodes and ColumnsNodes

This document describes the comprehensive testing suite designed to thoroughly test the positioning, sizing, collapsing, and expanding functionality of both LaneNodes and ColumnsNodes.

## Overview

The comprehensive testing suite consists of three main components:

1. **LaneNode Tests** (`lane-nodes-comprehensive.spec.js`) - Tests vertical stacking containers
2. **ColumnsNode Tests** (`columns-nodes-comprehensive.spec.js`) - Tests horizontal row containers  
3. **Test Runner** (`run-comprehensive-tests.js`) - Orchestrates and runs all tests

## Test Coverage

### LaneNode Testing Areas

#### Basic Functionality
- ✅ **Rendering**: Basic node rendering with correct dimensions
- ✅ **Positioning**: Child nodes arranged in vertical stack
- ✅ **Spacing**: Consistent spacing between child nodes (10px default)
- ✅ **Sizing**: Container height calculation based on child content

#### Collapse/Expand Functionality
- ✅ **Collapse**: Container collapses and hides children
- ✅ **Expand**: Container expands and shows children
- ✅ **State Persistence**: Child positions maintained after collapse/expand cycle
- ✅ **Dimension Changes**: Height changes appropriately during collapse/expand

#### Advanced Features
- ✅ **Nested Containers**: Proper handling of nested lane structures
- ✅ **Dynamic Children**: Adding/removing children with layout recalculation
- ✅ **Mixed Content**: Handling different child node types
- ✅ **Performance**: Rapid collapse/expand operations

#### Edge Cases
- ✅ **Single Child**: Proper centering and positioning
- ✅ **Empty Containers**: Graceful handling of edge cases
- ✅ **Minimum Sizing**: Maintaining reasonable minimum dimensions

### ColumnsNode Testing Areas

#### Basic Functionality
- ✅ **Rendering**: Basic node rendering with correct dimensions
- ✅ **Positioning**: Child nodes arranged in horizontal row
- ✅ **Spacing**: Consistent spacing between child nodes (20px default)
- ✅ **Sizing**: Container width calculation based on child content

#### Collapse/Expand Functionality
- ✅ **Collapse**: Container collapses and hides children
- ✅ **Expand**: Container expands and shows children
- ✅ **State Persistence**: Child positions maintained after collapse/expand cycle
- ✅ **Dimension Changes**: Height changes appropriately during collapse/expand

#### Advanced Features
- ✅ **Nested Containers**: Proper handling of nested column structures
- ✅ **Dynamic Children**: Adding/removing children with layout recalculation
- ✅ **Mixed Content**: Handling different child node types (columns, rect, etc.)
- ✅ **Performance**: Rapid collapse/expand operations

#### Layout Modes
- ✅ **Default Mode**: Standard horizontal row layout
- ✅ **Auto-Size Mode**: Dynamic sizing based on content
- ✅ **Fixed-Size Mode**: Maintaining fixed dimensions

#### Edge Cases
- ✅ **Single Child**: Proper centering and positioning
- ✅ **Empty Containers**: Graceful handling of edge cases
- ✅ **Minimum Sizing**: Maintaining reasonable minimum dimensions

## Running the Tests

### Prerequisites

1. **Node.js**: Version 16 or higher
2. **Playwright**: Installed and browsers downloaded
3. **HTTP Server**: Running on localhost:8000 for demo pages

### Quick Start

```bash
# Start the HTTP server
cd dashboard
python -m http.server 8000

# In another terminal, run comprehensive tests
npm run test:comprehensive
```

### Individual Test Suites

```bash
# Run only LaneNode tests
npm run test:lane

# Run only ColumnsNode tests
npm run test:columns

# Run all existing tests
npm test
```

### Individual tests
```PowerShell
npx playwright test tests/columns-nodes-comprehensive.spec.js -g "should handle mixed children types correctly" --headed
```

### Test Runner Options

```bash
# Show help
node tests/run-comprehensive-tests.js --help

# Quick mode (reduced timeouts)
node tests/run-comprehensive-tests.js --quick

# Debug mode (additional logging)
node tests/run-comprehensive-tests.js --debug

# Verbose output
node tests/run-comprehensive-tests.js --verbose
```

### Direct Playwright Execution

```bash
# Run with Playwright directly
npx playwright test tests/lane-nodes-comprehensive.spec.js
npx playwright test tests/columns-nodes-comprehensive.spec.js

# Run with UI
npx playwright test tests/lane-nodes-comprehensive.spec.js --ui

# Run headed (visible browser)
npx playwright test tests/lane-nodes-comprehensive.spec.js --headed
```

## Test Structure

### Test Organization

Each test suite is organized into logical groups:

```
test.describe('Basic Tests')
├── Rendering and positioning
├── Child arrangement
└── Initial dimensions

test.describe('Collapse/Expand Tests')
├── Collapse functionality
├── Expand functionality
└── State persistence

test.describe('Advanced Tests')
├── Nested containers
├── Dynamic children
└── Mixed content types

test.describe('Edge Cases')
├── Single children
├── Empty containers
└── Performance scenarios
```

### Helper Functions

The test suites include several helper functions:

- **`waitForNodes()`**: Waits for nodes to be rendered
- **`getNodeDimensions()`**: Extracts node dimensions and position
- **`getChildPositions()`**: Gets positions of all child nodes
- **`clickZoomButton()`**: Clicks collapse/expand buttons

### Test Data

Tests use the existing demo pages:

- **LaneNodes**: `/04_laneNodes/` demo pages
- **ColumnsNodes**: `/05_columnsNodes/` demo pages

Each demo page includes:
- Sample data structures
- Interactive controls
- Built-in test runners

## Expected Results

### Successful Test Execution

When all tests pass, you should see:

```
================================================================================
  Comprehensive Node Testing Suite
================================================================================
Testing LaneNodes and ColumnsNodes for positioning, sizing, collapsing, and expanding functionality.

Running LaneNode Comprehensive Tests
Testing Vertical stacking container tests
  ✓ LaneNode Tests: PASS
    15/15 tests passed

Running ColumnsNode Comprehensive Tests
Testing Horizontal row container tests
  ✓ ColumnsNode Tests: PASS
    18/18 tests passed

Test Summary
Total Tests: 33
Passed: 33
Failed: 0
Skipped: 0
Duration: 45.23s

Overall Status: SUCCESS

🎉 All tests passed! The LaneNodes and ColumnsNodes are working correctly.
```

### Test Failures

If tests fail, the output will show:

- **Specific test names** that failed
- **Error details** and stack traces
- **Screenshot captures** (if enabled)
- **Video recordings** (if enabled)

## Debugging Failed Tests

### Common Issues

1. **Timing Issues**: Tests may fail due to slow rendering
   - Solution: Increase timeouts or add more wait conditions

2. **Selector Issues**: DOM structure changes may break selectors
   - Solution: Update selectors to match current structure

3. **Data Issues**: Demo data may not match test expectations
   - Solution: Verify demo data structure and update tests

### Debug Mode

Enable debug mode for additional information:

```bash
node tests/run-comprehensive-tests.js --debug
```

This will:
- Enable Playwright debug logging
- Show detailed test execution
- Provide more context for failures

### Manual Verification

If tests fail, manually verify the functionality:

1. **Open demo pages** in browser
2. **Test collapse/expand** manually
3. **Check console** for errors
4. **Verify DOM structure** matches test expectations

## Extending the Tests

### Adding New Test Cases

1. **Identify functionality** to test
2. **Add test** to appropriate test suite
3. **Use existing helpers** for consistency
4. **Update test counts** in configuration

### Example: Adding a New Test

```javascript
test('should handle custom spacing configuration', async ({ page }) => {
  // Test implementation
  const nodesFound = await waitForColumnsNodes(page);
  expect(nodesFound).toBe(true);
  
  // Test specific functionality
  // ...
});
```

### Adding New Test Suites

1. **Create new spec file** following naming convention
2. **Add to test runner** configuration
3. **Update package.json** scripts
4. **Document** new test coverage

## Performance Considerations

### Test Execution Time

- **Full Suite**: ~45-60 seconds
- **Individual Suites**: ~20-30 seconds each
- **Quick Mode**: ~30-40 seconds (reduced timeouts)

### Optimization Tips

1. **Use `--quick`** for faster execution during development
2. **Run individual suites** for focused testing
3. **Enable parallel execution** for CI/CD (not recommended for stability)

## Continuous Integration

### CI/CD Integration

The tests are designed for CI/CD environments:

- **Headless execution** by default
- **Exit codes** for success/failure
- **Structured output** for parsing
- **Screenshot capture** on failure

### GitHub Actions Example

```yaml
- name: Run Comprehensive Tests
  run: npm run test:comprehensive
  env:
    CI: true
```

## Troubleshooting

### Common Problems

1. **HTTP Server Not Running**
   - Ensure server is running on localhost:8000
   - Check firewall/port settings

2. **Playwright Browsers Not Installed**
   - Run `npx playwright install`
   - Verify browser downloads

3. **Test Timeouts**
   - Increase timeout values
   - Check system performance
   - Use `--quick` mode for development

4. **Selector Failures**
   - Verify demo page structure
   - Check for recent changes
   - Update selectors as needed

### Getting Help

1. **Check console output** for error details
2. **Review test logs** for specific failure points
3. **Verify demo functionality** manually
4. **Check recent changes** that might affect tests

## Conclusion

The comprehensive testing suite provides thorough coverage of LaneNode and ColumnsNode functionality, ensuring that:

- **Positioning** works correctly in all scenarios
- **Sizing** calculations are accurate
- **Collapse/expand** functionality is reliable
- **Edge cases** are handled gracefully
- **Performance** meets expectations

Regular execution of these tests helps maintain code quality and catch regressions early in the development cycle.
