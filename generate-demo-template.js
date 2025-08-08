#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Demo Template Generator
 * 
 * This script generates demo pages following the established standard.
 * Usage: node generate-demo-template.js <nodeType> <demoName> [options]
 */

// Template configurations
const templates = {
    html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{demoName}} - {{nodeType}} Demo</title>
    
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
        <h1>{{nodeType}} Demos</h1>
        <h2>{{demoName}}</h2>
        <p class="demo-description">{{description}}</p>
        
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
            <p><strong>Node Type:</strong> {{nodeType}}</p>
            <p><strong>Features:</strong> {{features}}</p>
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
            
            testStatus.textContent = \`\${passed}/\${total} tests passed\`;
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
</html>`,

    js: `//////////////////////////////////////////////////////////////
//
// Demo: {{demoName}}
// Node Type: {{nodeType}}
// Features: {{features}}
// Test Status: Not Tested
//

export const demoData = {
    // Demo metadata
    metadata: {
        name: "{{demoName}}",
        nodeType: "{{nodeType}}",
        features: [{{featureArray}}],
        description: "{{description}}",
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
            label: "{{nodeType}} Node",
            type: "{{nodeType}}",
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
    edges: []
};

// Additional demo data exports for different scenarios
export const demoDataWithChildren = {
    // ... similar structure with children
};

export const demoDataComplex = {
    // ... complex scenario
};`,

    css: `/* Demo-specific styles */
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
}`,

    readme: `# {{nodeType}} Demos

## Description

This folder contains demonstrations for {{nodeType}} functionality, showcasing various features and use cases.

## Features

{{features}}

## Usage

### {{demoName}}
- **Purpose**: {{description}}
- **Features**: {{features}}
- **Test Status**: ⏳ Not Tested

## {{nodeType}} Features

- **Basic Rendering**: Standard node display
- **Layout Management**: Automatic sizing and positioning
- **Child Support**: {{childSupport}}
- **Interactive Features**: Click, hover, and drag support

## Testing

Each demo includes automated tests that validate:
- Dashboard initialization
- Node rendering
- Data structure integrity
- Feature-specific functionality

Run tests by clicking the "Run Tests" button in each demo.

## Related Documentation

- [Node System Implementation](../dashboard/implementation-nodes.md)
- [Dashboard Documentation](../dashboard/readme.md)`,

    testData: `{
    "demoName": "{{demoName}}",
    "nodeType": "{{nodeType}}",
    "testCases": [
        {
            "name": "Basic Rendering",
            "description": "Test that {{nodeType}} renders correctly",
            "type": "visual",
            "expected": {
                "nodeCount": 1,
                "nodeTypes": ["{{nodeType}}"],
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
}`
};

// Node type configurations
const nodeTypeConfigs = {
    node: {
        category: "01_basicNodes",
        features: ["Basic rendering", "Text display", "Positioning"],
        childSupport: "No",
        description: "Basic rectangular node with text display"
    },
    rect: {
        category: "02_rectangularNodes", 
        features: ["Rectangular shape", "Text display", "Auto-sizing"],
        childSupport: "No",
        description: "Rectangular node with automatic text-based sizing"
    },
    circle: {
        category: "03_circleNodes",
        features: ["Circular shape", "Radius-based sizing"],
        childSupport: "No",
        description: "Circular node with radius-based sizing"
    },
    lane: {
        category: "04_laneNodes",
        features: ["Vertical stacking", "Child centering", "Auto-sizing"],
        childSupport: "Yes", 
        description: "Vertical lane layout with child stacking"
    },
    columns: {
        category: "05_columnsNodes",
        features: ["Horizontal layout", "Child alignment", "Auto-sizing"],
        childSupport: "Yes",
        description: "Horizontal columns layout with child alignment"
    },
    adapter: {
        category: "06_adapterNodes",
        features: ["Multi-arrangement", "Role modes", "Component layout"],
        childSupport: "Yes",
        description: "Specialist adapter node with multiple layout arrangements"
    },
    foundation: {
        category: "07_foundationNodes",
        features: ["Role-based layout", "Component positioning", "Auto-sizing"],
        childSupport: "Yes",
        description: "Foundation node with role-based component layout"
    },
    mart: {
        category: "08_martNodes", 
        features: ["Role-based layout", "Component positioning", "Auto-sizing"],
        childSupport: "Yes",
        description: "Mart node with role-based component layout"
    },
    group: {
        category: "09_groupNodes",
        features: ["Dynamic grouping", "Force-directed layout"],
        childSupport: "Yes",
        description: "Dynamic group node with force-directed layout"
    },
    "edge-demo": {
        category: "10_edgeDemoNodes",
        features: ["Edge connection testing", "Demo purposes"],
        childSupport: "No",
        description: "Edge demo node for testing connections"
    }
};

function replaceTemplate(template, variables) {
    return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
        return variables[key] || match;
    });
}

function createDirectoryIfNotExists(dirPath) {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
        console.log(`Created directory: ${dirPath}`);
    }
}

function generateDemo(nodeType, demoName, options = {}) {
    const config = nodeTypeConfigs[nodeType];
    if (!config) {
        console.error(`Unknown node type: ${nodeType}`);
        console.log('Available node types:', Object.keys(nodeTypeConfigs));
        return;
    }

    const demoNumber = options.demoNumber || '01';
    const category = config.category;
    const demoFolder = `${demoNumber}_${demoName}`;
    const demoPath = path.join(category, demoFolder);
    
    // Create directory structure
    createDirectoryIfNotExists(demoPath);
    createDirectoryIfNotExists(path.join(demoPath, 'js'));
    createDirectoryIfNotExists(path.join(demoPath, 'css'));

    // Prepare variables
    const variables = {
        nodeType: nodeType,
        demoName: demoName,
        description: options.description || config.description,
        features: options.features || config.features.join(', '),
        featureArray: config.features.map(f => `"${f}"`).join(', '),
        childSupport: config.childSupport
    };

    // Generate files
    const files = [
        {
            path: path.join(demoPath, `${demoName}.html`),
            content: replaceTemplate(templates.html, variables)
        },
        {
            path: path.join(demoPath, 'js', 'graphData.js'),
            content: replaceTemplate(templates.js, variables)
        },
        {
            path: path.join(demoPath, 'css', 'demo.css'),
            content: replaceTemplate(templates.css, variables)
        },
        {
            path: path.join(demoPath, 'README.md'),
            content: replaceTemplate(templates.readme, variables)
        },
        {
            path: path.join(demoPath, 'test-data.json'),
            content: replaceTemplate(templates.testData, variables)
        }
    ];

    // Write files
    files.forEach(file => {
        if (options.force || !fs.existsSync(file.path)) {
            fs.writeFileSync(file.path, file.content);
            console.log(`Created: ${file.path}`);
        } else {
            console.log(`Skipped (exists): ${file.path}`);
        }
    });

    console.log(`\nDemo generated successfully in: ${demoPath}`);
    console.log(`\nNext steps:`);
    console.log(`1. Review and customize the generated files`);
    console.log(`2. Test the demo by opening ${demoName}.html in a browser`);
    console.log(`3. Update the index.html to include this new demo`);
    console.log(`4. Run tests to validate functionality`);
}

// CLI handling
if (process.argv[1] === fileURLToPath(import.meta.url)) {
    const args = process.argv.slice(2);
    
    if (args.length < 2) {
        console.log('Usage: node generate-demo-template.js <nodeType> <demoName> [options]');
        console.log('\nAvailable node types:');
        Object.keys(nodeTypeConfigs).forEach(type => {
            const config = nodeTypeConfigs[type];
            console.log(`  ${type}: ${config.description}`);
        });
        console.log('\nExample: node generate-demo-template.js BaseNode simple');
        process.exit(1);
    }

    const nodeType = args[0];
    const demoName = args[1];
    
    // Parse options
    const options = {
        demoNumber: '01',
        description: '',
        features: [],
        force: false
    };
    
    // Parse remaining arguments
    for (let i = 2; i < args.length; i++) {
        const arg = args[i];
        if (arg === '--force') {
            options.force = true;
        } else if (arg.startsWith('--description=')) {
            options.description = arg.split('=')[1];
        } else if (arg.startsWith('--features=')) {
            options.features = arg.split('=')[1].split(',');
        } else if (arg.startsWith('--demoNumber=')) {
            options.demoNumber = arg.split('=')[1];
        } else if (!options.demoNumber || options.demoNumber === '01') {
            options.demoNumber = arg;
        } else if (!options.description) {
            options.description = arg;
        } else if (!options.features.length) {
            options.features = arg.split(',');
        }
    }

    generateDemo(nodeType, demoName, options);
}

export { generateDemo, nodeTypeConfigs };
