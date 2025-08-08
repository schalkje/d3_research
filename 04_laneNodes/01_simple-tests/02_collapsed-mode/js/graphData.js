//////////////////////////////////////////////////////////////
//
// Demo: collapsed-mode
// Node Type: lane
// Features: Collapsed mode with 3 rectangles
// Test Status: Not Tested
//

export const demoData = {
    // Demo metadata
    metadata: {
        name: "collapsed-mode",
        nodeType: "lane",
        features: ["Collapsed mode", "3 rectangles", "Hidden children", "Expandable"],
        description: "Lane with 3 rectangles in collapsed mode",
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
            // Collapse state
            collapsed: true,
            // Child nodes (for container nodes)
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
                    parentId: "lane1",
                    visible: false // Hidden in collapsed mode
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
                    parentId: "lane1",
                    visible: false // Hidden in collapsed mode
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
                    parentId: "lane1",
                    visible: false // Hidden in collapsed mode
                }
            ],
            // Parent reference
            parentId: null
        }
    ],
    
    // Edge definitions
    edges: []
};
