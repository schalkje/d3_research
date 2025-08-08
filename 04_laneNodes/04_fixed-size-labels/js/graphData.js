//////////////////////////////////////////////////////////////
//
// Demo: fixed-size-labels
// Node Type: lane
// Features: Fixed-size labels with dynamic changes
// Test Status: Not Tested
//

export const demoData = {
    // Demo metadata
    metadata: {
        name: "fixed-size-labels",
        nodeType: "lane",
        features: ["Fixed-size labels", "Dynamic changes", "Different lengths", "Toggle functionality"],
        description: "Lane with fixed-size labels and dynamic changes",
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
            id: "lane1",
            label: "Process Lane",
            type: "lane",
            // Node-specific properties
            code: "L1",
            status: "Ready",
            // Layout properties
            layout: {
                displayMode: "full",
                arrangement: "default"
            },
            // Child nodes (for container nodes)
            children: [
                {
                    id: "rect1",
                    label: "Short",
                    type: "rect",
                    code: "R1",
                    status: "Ready",
                    layout: {
                        displayMode: "full",
                        arrangement: "default"
                    },
                    // Fixed size properties
                    width: 120,
                    height: 60,
                    fixedSize: true,
                    parentId: "lane1"
                },
                {
                    id: "rect2",
                    label: "Medium Length Label",
                    type: "rect",
                    code: "R2",
                    status: "Ready",
                    layout: {
                        displayMode: "full",
                        arrangement: "default"
                    },
                    // Fixed size properties
                    width: 120,
                    height: 60,
                    fixedSize: true,
                    parentId: "lane1"
                },
                {
                    id: "rect3",
                    label: "Very Long Label That Should Stay Fixed Size",
                    type: "rect",
                    code: "R3",
                    status: "Ready",
                    layout: {
                        displayMode: "full",
                        arrangement: "default"
                    },
                    // Fixed size properties
                    width: 120,
                    height: 60,
                    fixedSize: true,
                    parentId: "lane1"
                }
            ],
            // Parent reference
            parentId: null
        }
    ],
    
    // Edge definitions
    edges: []
};

// Label sets for dynamic changes
export const labelSets = [
    ["Short", "Medium Length Label", "Very Long Label That Should Stay Fixed Size"],
    ["A", "Medium Text Here", "Extremely Long Label That Will Stay Fixed Size"],
    ["Quick", "Somewhat Longer Text", "This Is An Exceptionally Long Label That Tests Fixed Size"],
    ["Fast", "Average Length Label", "Super Long Label That Pushes Fixed Size Limits"],
    ["Brief", "Standard Length Text", "Maximum Length Label For Fixed Size Testing"]
];
