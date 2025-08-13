# Test Documentation

This directory contains Playwright tests for the D3 dashboard project.

## Test Files

- `adapter-nodes.spec.js` - Tests for adapter node rendering (uses `/06_adapterNodes/01_single/01_single.html`)
- `foundation-nodes.spec.js` - Tests for foundation node rendering (uses `/5_nodes/11_foundation/01_single.html`)
- `nodes.spec.js` - Original comprehensive node tests
- `edges.spec.js` - Edge rendering tests
- `groups.spec.js` - Group and layout tests
- `dashboard.spec.js` - Main dashboard functionality tests
- `integration.spec.js` - Complex integration scenarios

## Running Tests

### Run All Tests
```bash
npm test
```

### Run Specific Node Type Tests
```bash
# Adapter nodes only  
npm run test:adapter

# Foundation nodes only
npm run test:foundation
```

### Run Individual Tests
```bash
# Run a specific test by name
npx playwright test --grep "should render single rectangle node"

# Run tests with UI mode (interactive)
npm run test:ui

# Run tests in headed mode (see browser)
npm run test:headed
```

### Run Tests for Specific File
```bash
# Run tests for the specific HTML file you mentioned
npx playwright test tests/adapter-nodes.spec.js --project=chromium
```

## Test Data

Tests use data files from `dashboard/data/`:
- `dwh-3.json` - Adapter nodes  
- `foundation-lane.json` - Foundation nodes
- `test-scenarios/` - Simple test scenarios

Standalone page tests:
- Adapter node tests use `/06_adapterNodes/01_single/01_single.html`
- Foundation node tests use `/5_nodes/11_foundation/01_single.html`

## Test Structure

Each test file follows this pattern:
1. **Setup** - Navigate to dashboard and wait for initialization
2. **Load Data** - Select appropriate test data file
3. **Wait for Rendering** - Wait for nodes to be rendered
4. **Assertions** - Verify node properties, styling, positioning

## Debugging Tests

If tests fail, you can:
1. Run with `--headed` flag to see the browser
2. Use `--ui` flag for interactive debugging
3. Check console output for error messages
4. Verify test data files exist and are valid JSON

## Adding New Tests

To add tests for a new node type:
1. Create a new `.spec.js` file
2. Follow the existing pattern with `beforeEach` setup
3. Use the `waitForNodes` helper function
4. Add appropriate assertions for the node type
5. Update this README with new test commands 