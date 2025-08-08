//////////////////////////////////////////////////////////////
//
// Demo: fixed-size-large
// Node Type: lane
// Features: Fixed-size large layout mode
// Test Status: Not Tested
//

export const demoData = {
    // Demo metadata
    metadata: {
        name: "fixed-size-large",
        nodeType: "lane",
        features: ["Fixed-size large", "3 rectangles", "Uniform large sizing"],
        description: "Lane with fixed-size large layout mode",
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
                    label: "Large Fixed",
                    type: "rect",
                    code: "R1",
                    status: "Ready",
                    layout: {
                        displayMode: "full",
                        arrangement: "default"
                    },
                    // Fixed size large properties
                    width: 250,
                    height: 120,
                    fixedSize: true,
                    sizeMode: "large",
                    parentId: "lane1"
                },
                {
                    id: "rect2",
                    label: "Big Fixed",
                    type: "rect",
                    code: "R2",
                    status: "Ready",
                    layout: {
                        displayMode: "full",
                        arrangement: "default"
                    },
                    // Fixed size large properties
                    width: 250,
                    height: 120,
                    fixedSize: true,
                    sizeMode: "large",
                    parentId: "lane1"
                },
                {
                    id: "rect3",
                    label: "Expanded Fixed",
                    type: "rect",
                    code: "R3",
                    status: "Ready",
                    layout: {
                        displayMode: "full",
                        arrangement: "default"
                    },
                    // Fixed size large properties
                    width: 250,
                    height: 120,
                    fixedSize: true,
                    sizeMode: "large",
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
