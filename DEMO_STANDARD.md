# Demo Standard for D3 Research Project

## Overview

This document defines the standard structure and requirements for all demonstration pages in the project. This ensures consistency, testability, and extensibility across all node types and features.

## Demo Folder Structure

```
{category_number}_{category_name}/
├── {demo_number}_{demo_name}.html
├── js/
│   └── graphData.js
├── css/
│   └── demo.css (optional)
├── README.md
└── test-data.json (for automated testing)
```

### Folder Naming Convention

- **Category folders**: `{number}_{name}` (e.g., `01_baseNodes`, `02_containerNodes`)
- **Demo folders**: `{number}_{name}` (e.g., `01_simple`, `02_withChildren`)

### Template generator
**Use template generator** `generate-demo-template.js` for creating new demos. This generated the base setup.
Then **Update index.html** to include the new demo.

## HTML File Standard

### Required Structure

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{Demo Title} - {Node Type} Demo</title>
    
    <!-- Standard CSS -->
    <link rel="stylesheet" href="../../dashboard/flowdash.css">
    
    <!-- Optional demo-specific CSS -->
    <link rel="stylesheet" href="css/demo.css" if-exists>
    
    <!-- Required Libraries -->
    <script src="../../dashboard/libs/d3.min.js"></script>
<script src="../../dashboard/libs/d3-shape.min.js"></script>
<script src="../../dashboard/libs/d3-dag.iife.min.js"></script>
</head>
<body>
    <!-- Demo Header -->
    <header class="demo-header">
        <h1>{Node Type} Demos</h1>
        <h2>{Demo Name}</h2>
        <p class="demo-description">{Description of what this demo shows}</p>
        
        <!-- Demo Controls -->
        <div class="demo-controls">
            <button id="updateBtn" onclick="updateDemo()">Update</button>
            <button id="resetBtn" onclick="resetDemo()">Reset</button>
            <button id="testBtn" onclick="runTests()">Run Tests</button>
        </div>
    </header>

    <!-- Demo Container -->
    <div class="demo-container">
        <svg id="graph" class="canvas"></svg>
    </div>

    <!-- Demo Information -->
    <footer class="demo-info">
        <div class="demo-metadata">
            <p><strong>Node Type:</strong> {nodeType}</p>
            <p><strong>Features:</strong> {comma-separated features}</p>
            <p><strong>Test Status:</strong> <span id="testStatus">Not Tested</span></p>
        </div>
    </footer>

    <script type="module">
        // Import demo data
        import { demoData } from './js/graphData.js';
        import flowDashboard from '../../dashboard/js/index.js';

        // Initialize dashboard
        const flowdash = new flowDashboard.Dashboard(demoData);
        flowdash.initialize('#graph');
        
        // Attach to window for testing and debugging
        window.flowdash = flowdash;
        window.demoData = demoData;
        
        // Demo functions
        window.updateDemo = function() {
            // Implementation for update functionality
            console.log('Update demo called');
        };
        
        window.resetDemo = function() {
            // Implementation for reset functionality
            flowdash.reset();
        };
        
        window.runTests = function() {
            // Implementation for running tests
            runDemoTests();
        };
        
        // Test runner
        function runDemoTests() {
            const testStatus = document.getElementById('testStatus');
            testStatus.textContent = 'Running...';
            
            // Basic validation tests
            const tests = [
                testDashboardInitialization,
                testNodeRendering,
                testDataStructure
            ];
            
            let passed = 0;
            let total = tests.length;
            
            tests.forEach(test => {
                try {
                    if (test()) passed++;
                } catch (e) {
                    console.error('Test failed:', e);
                }
            });
            
            testStatus.textContent = `${passed}/${total} tests passed`;
            testStatus.className = passed === total ? 'test-pass' : 'test-fail';
        }
        
        // Test functions
        function testDashboardInitialization() {
            return flowdash && typeof flowdash.initialize === 'function';
        }
        
        function testNodeRendering() {
            const nodes = document.querySelectorAll('.node');
            return nodes.length > 0;
        }
        
        function testDataStructure() {
            return demoData && demoData.nodes && Array.isArray(demoData.nodes);
        }
    </script>
</body>
</html>
```

## JavaScript Data File Standard

### Required Structure (graphData.js)

```javascript
//////////////////////////////////////////////////////////////
//
// Demo: {Demo Name}
// Node Type: {Node Type}
// Features: {Feature List}
// Test Status: {Pass/Fail/Not Tested}
//

export const demoData = {
    // Demo metadata
    metadata: {
        name: "{Demo Name}",
        nodeType: "{Node Type}",
        features: ["feature1", "feature2"],
        description: "{Description}",
        testStatus: "Not Tested",
        version: "1.0.0"
    },
    
    // Dashboard settings
    settings: {
        // Display settings
        showCenterMark: false,
        showGrid: true,
        showGroupLabels: true,
        showGroupTitles: true,
        
        // Edge settings
        showGhostlines: false,
        curved: false,
        
        // Node settings
        showConnectionPoints: false,
        
        // Demo-specific settings
        demoMode: true,
        enableTesting: true
    },
    
    // Node definitions
    nodes: [
        {
            id: "node1",
            label: "Node Label",
            type: "{nodeType}",
            // Node-specific properties
            code: "N1",
            status: "Ready",
            // Layout properties
            layout: {
                displayMode: "full", // or "role", "code"
                arrangement: "default" // varies by node type
            },
            // Child nodes (for container nodes)
            children: [],
            // Parent reference
            parentId: null
        }
    ],
    
    // Edge definitions
    edges: [
        {
            id: "edge1",
            source: "node1",
            target: "node2",
            type: "SSIS",
            state: "Ready",
            isActive: true
        }
    ]
};

// Additional demo data exports for different scenarios
export const demoDataWithChildren = {
    // ... similar structure with children
};

export const demoDataComplex = {
    // ... complex scenario
};
```

## CSS Standard

### Required Demo CSS (demo.css)

```css
/* Demo-specific styles */
.demo-header {
    background: #f5f5f5;
    padding: 20px;
    border-bottom: 1px solid #ddd;
}

.demo-header h1 {
    margin: 0 0 10px 0;
    color: #333;
}

.demo-header h2 {
    margin: 0 0 10px 0;
    color: #666;
}

.demo-description {
    margin: 0 0 20px 0;
    color: #777;
    font-style: italic;
}

.demo-controls {
    margin: 20px 0;
}

.demo-controls button {
    margin-right: 10px;
    padding: 8px 16px;
    border: 1px solid #ccc;
    background: #fff;
    cursor: pointer;
}

.demo-controls button:hover {
    background: #f0f0f0;
}

.demo-container {
    padding: 20px;
    text-align: center;
}

.demo-info {
    background: #f9f9f9;
    padding: 20px;
    border-top: 1px solid #ddd;
}

.demo-metadata {
    font-size: 14px;
    color: #666;
}

.demo-metadata p {
    margin: 5px 0;
}

.test-pass {
    color: green;
    font-weight: bold;
}

.test-fail {
    color: red;
    font-weight: bold;
}

/* Canvas styling */
.canvas {
    background-color: #e6e3e3;
    border: 2px solid #d3d3d3;
    box-shadow: 4px 3px 8px 1px #969696;
    margin: 0 auto;
}
```

## README Standard

### Required README Structure

```markdown
# {Node Type} Demos

## Overview

This folder contains demonstrations for {Node Type} functionality, showcasing various features and use cases.

## Demos

### 01_simple
- **Purpose**: Basic {Node Type} rendering
- **Features**: Basic node display, minimal configuration
- **Test Status**: ✅ Passed

### 02_withChildren
- **Purpose**: {Node Type} with child nodes
- **Features**: Child management, layout algorithms
- **Test Status**: ⏳ Not Tested

## Node Type Features

- **Feature 1**: Description
- **Feature 2**: Description
- **Feature 3**: Description

## Testing

Each demo includes automated tests that validate:
- Dashboard initialization
- Node rendering
- Data structure integrity
- Feature-specific functionality

Run tests by clicking the "Run Tests" button in each demo.

## Related Documentation

- [Node System Implementation](../dashboard/implementation-nodes.md)
- [Dashboard Documentation](../dashboard/readme.md)
```

## Test Data Standard

### Required Test Data Structure (test-data.json)

```json
{
    "demoName": "01_simple",
    "nodeType": "BaseNode",
    "testCases": [
        {
            "name": "Basic Rendering",
            "description": "Test that node renders correctly",
            "type": "visual",
            "expected": {
                "nodeCount": 1,
                "nodeTypes": ["BaseNode"],
                "visible": true
            }
        },
        {
            "name": "Data Structure",
            "description": "Test data structure integrity",
            "type": "structural",
            "expected": {
                "hasMetadata": true,
                "hasSettings": true,
                "hasNodes": true
            }
        }
    ],
    "performance": {
        "maxRenderTime": 1000,
        "maxMemoryUsage": 50
    }
}
```

## Demo Categories and Naming

### Node Type Categories

1. **01_baseNodes** - Base node types (BaseNode, RectangularNode)
2. **02_containerNodes** - Container node types (BaseContainerNode, LaneNode, ColumnsNode)
3. **03_specialistNodes** - Specialist node types (AdapterNode, FoundationNode, MartNode)
4. **04_edgeDemos** - Edge and connection demonstrations
5. **05_groupDemos** - Group and layout demonstrations

### Demo Naming Convention

- **01_simple** - Basic functionality
- **02_withChildren** - Child node management
- **03_complex** - Complex scenarios
- **04_performance** - Performance testing
- **05_edgeCases** - Edge case handling

## Implementation Checklist

For each new demo:

- [ ] Create folder with proper naming
- [ ] Create HTML file following standard structure
- [ ] Create graphData.js with proper metadata
- [ ] Add optional demo.css if needed
- [ ] Create README.md with documentation
- [ ] Create test-data.json for automated testing
- [ ] Update index.html to include new demo
- [ ] Run tests to validate functionality
- [ ] Update documentation

## Testing Integration

### Automated Test Hooks

Each demo should expose these functions for automated testing:

```javascript
// Available on window object
window.flowdash          // Dashboard instance
window.demoData          // Demo data
window.runDemoTests()    // Test runner
window.updateDemo()      // Update function
window.resetDemo()       // Reset function
```

### Test Validation

Tests should validate:
- Dashboard initialization
- Node rendering
- Data structure integrity
- Feature-specific functionality
- Performance metrics
- Visual consistency

## Extension Guidelines

### Adding New Node Types

1. Create new category folder
2. Follow naming conventions
3. Include all required files
4. Add comprehensive tests
5. Update documentation

### Adding New Features

1. Update demo structure to include new features
2. Add feature-specific tests
3. Update documentation
4. Validate with existing demos

This standard ensures consistency, testability, and maintainability across all demonstration pages in the project.
