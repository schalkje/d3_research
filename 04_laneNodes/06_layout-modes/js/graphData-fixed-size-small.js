//////////////////////////////////////////////////////////////
//
// Demo: fixed-size-small
// Node Type: lane
// Features: Fixed-size small layout mode
// Test Status: Not Tested
//

export const demoData = {
    // Demo metadata
    metadata: {
        name: "fixed-size-small",
        nodeType: "lane",
        features: ["Fixed-size small", "3 rectangles", "Uniform small sizing"],
        description: "Lane with fixed-size small layout mode",
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
                    label: "Small Fixed",
                    type: "rect",
                    code: "R1",
                    status: "Ready",
                    layout: {
                        displayMode: "full",
                        arrangement: "default"
                    },
                    // Fixed size small properties
                    width: 100,
                    height: 50,
                    fixedSize: true,
                    sizeMode: "small",
                    parentId: "lane1"
                },
                {
                    id: "rect2",
                    label: "Compact Fixed",
                    type: "rect",
                    code: "R2",
                    status: "Ready",
                    layout: {
                        displayMode: "full",
                        arrangement: "default"
                    },
                    // Fixed size small properties
                    width: 100,
                    height: 50,
                    fixedSize: true,
                    sizeMode: "small",
                    parentId: "lane1"
                },
                {
                    id: "rect3",
                    label: "Tiny Fixed",
                    type: "rect",
                    code: "R3",
                    status: "Ready",
                    layout: {
                        displayMode: "full",
                        arrangement: "default"
                    },
                    // Fixed size small properties
                    width: 100,
                    height: 50,
                    fixedSize: true,
                    sizeMode: "small",
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
