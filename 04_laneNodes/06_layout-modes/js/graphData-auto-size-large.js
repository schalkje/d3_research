//////////////////////////////////////////////////////////////
//
// Demo: auto-size-large
// Node Type: lane
// Features: Auto-size large layout mode
// Test Status: Not Tested
//

export const demoData = {
    // Demo metadata
    metadata: {
        name: "auto-size-large",
        nodeType: "lane",
        features: ["Auto-size large", "3 rectangles", "Expanded sizing"],
        description: "Lane with auto-size large layout mode",
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
                    label: "Large Node",
                    type: "rect",
                    code: "R1",
                    status: "Ready",
                    layout: {
                        displayMode: "full",
                        arrangement: "default"
                    },
                    // Auto-size large properties
                    autoSize: true,
                    sizeMode: "large",
                    parentId: "lane1"
                },
                {
                    id: "rect2",
                    label: "Expanded Node",
                    type: "rect",
                    code: "R2",
                    status: "Ready",
                    layout: {
                        displayMode: "full",
                        arrangement: "default"
                    },
                    // Auto-size large properties
                    autoSize: true,
                    sizeMode: "large",
                    parentId: "lane1"
                },
                {
                    id: "rect3",
                    label: "Big Node",
                    type: "rect",
                    code: "R3",
                    status: "Ready",
                    layout: {
                        displayMode: "full",
                        arrangement: "default"
                    },
                    // Auto-size large properties
                    autoSize: true,
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
