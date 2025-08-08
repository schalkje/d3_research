//////////////////////////////////////////////////////////////
//
// Demo: auto-size-small
// Node Type: lane
// Features: Auto-size small layout mode
// Test Status: Not Tested
//

export const demoData = {
    // Demo metadata
    metadata: {
        name: "auto-size-small",
        nodeType: "lane",
        features: ["Auto-size small", "3 rectangles", "Compact sizing"],
        description: "Lane with auto-size small layout mode",
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
                    label: "Small",
                    type: "rect",
                    code: "R1",
                    status: "Ready",
                    layout: {
                        displayMode: "full",
                        arrangement: "default"
                    },
                    // Auto-size small properties
                    autoSize: true,
                    sizeMode: "small",
                    parentId: "lane1"
                },
                {
                    id: "rect2",
                    label: "Compact",
                    type: "rect",
                    code: "R2",
                    status: "Ready",
                    layout: {
                        displayMode: "full",
                        arrangement: "default"
                    },
                    // Auto-size small properties
                    autoSize: true,
                    sizeMode: "small",
                    parentId: "lane1"
                },
                {
                    id: "rect3",
                    label: "Tiny",
                    type: "rect",
                    code: "R3",
                    status: "Ready",
                    layout: {
                        displayMode: "full",
                        arrangement: "default"
                    },
                    // Auto-size small properties
                    autoSize: true,
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
