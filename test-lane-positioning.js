// Test script to verify lane node positioning fix
import flowDashboard from './dashboard/js/index.js';

// Test data with lane and rectangles
const testData = {
    nodes: [
        {
            id: "lane1",
            label: "Process Lane",
            type: "lane",
            code: "L1",
            status: "Ready",
            layout: {
                displayMode: "full",
                arrangement: "default"
            },
            children: [
                {
                    id: "rect1",
                    label: "Step 1",
                    type: "rect",
                    code: "R1",
                    status: "Ready",
                    layout: {
                        displayMode: "full",
                        arrangement: "default"
                    },
                    parentId: "lane1"
                },
                {
                    id: "rect2",
                    label: "Step 2",
                    type: "rect",
                    code: "R2",
                    status: "Ready",
                    layout: {
                        displayMode: "full",
                        arrangement: "default"
                    },
                    parentId: "lane1"
                },
                {
                    id: "rect3",
                    label: "Step 3",
                    type: "rect",
                    code: "R3",
                    status: "Ready",
                    layout: {
                        displayMode: "full",
                        arrangement: "default"
                    },
                    parentId: "lane1"
                }
            ],
            parentId: null
        }
    ],
    edges: []
};

// Create a virtual DOM for testing
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

const dom = new JSDOM(`
<!DOCTYPE html>
<html>
<head>
    <title>Test</title>
</head>
<body>
    <div id="graph"></div>
</body>
</html>
`);

global.document = dom.window.document;
global.window = dom.window;

// Initialize dashboard
const flowdash = new flowDashboard.Dashboard(testData);
flowdash.initialize('#graph');

// Wait a bit for initialization
setTimeout(() => {
    // Check the SVG output
    const svg = document.querySelector('#graph svg');
    if (svg) {
        console.log('SVG found:', svg.outerHTML);
        
        // Check for lane node
        const laneNode = svg.querySelector('g.lane');
        if (laneNode) {
            console.log('Lane node found:', laneNode.outerHTML);
            
            // Check for inner container
            const innerContainer = laneNode.querySelector('g.zone-innerContainer');
            if (innerContainer) {
                console.log('Inner container found:', innerContainer.outerHTML);
                
                // Check for rectangles
                const rectangles = innerContainer.querySelectorAll('g.rect');
                console.log('Rectangles found:', rectangles.length);
                
                rectangles.forEach((rect, index) => {
                    console.log(`Rectangle ${index + 1}:`, rect.outerHTML);
                });
            }
        }
    }
}, 1000);
