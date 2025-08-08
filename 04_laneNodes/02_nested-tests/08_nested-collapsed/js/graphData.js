//////////////////////////////////////////////////////////////
//
// Demo: nested-collapsed
// Node Type: lane
// Features: Nested lanes with one collapsed sub-lane
// Test Status: Not Tested
//

export const demoData = {
    // Demo metadata
    metadata: {
        name: "nested-collapsed",
        nodeType: "lane",
        features: ["Nested lanes", "Collapsed state", "Child management", "Vertical stacking", "Horizontal centering"],
        description: "Lane with 2 nested lanes, one collapsed with hidden children",
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
            id: "mainLane",
            label: "Main Process Lane",
            type: "lane",
            // Node-specific properties
            code: "ML1",
            status: "Ready",
            // Layout properties
            layout: {
                displayMode: "full",
                arrangement: "default"
            },
            // Child nodes (for container nodes)
            children: [
                {
                    id: "subLane1",
                    label: "Sub Process 1 (Expanded)",
                    type: "lane",
                    code: "SL1",
                    status: "Ready",
                    layout: {
                        displayMode: "full",
                        arrangement: "default"
                    },
                    children: [
                        {
                            id: "rect1_1",
                            label: "Step 1.1",
                            type: "rect",
                            code: "R1_1",
                            status: "Ready",
                            layout: {
                                displayMode: "full",
                                arrangement: "default"
                            },
                            parentId: "subLane1"
                        },
                        {
                            id: "rect1_2",
                            label: "Step 1.2",
                            type: "rect",
                            code: "R1_2",
                            status: "Ready",
                            layout: {
                                displayMode: "full",
                                arrangement: "default"
                            },
                            parentId: "subLane1"
                        },
                        {
                            id: "rect1_3",
                            label: "Step 1.3",
                            type: "rect",
                            code: "R1_3",
                            status: "Ready",
                            layout: {
                                displayMode: "full",
                                arrangement: "default"
                            },
                            parentId: "subLane1"
                        }
                    ],
                    parentId: "mainLane"
                },
                {
                    id: "subLane2",
                    label: "Sub Process 2 (Collapsed)",
                    type: "lane",
                    code: "SL2",
                    status: "Ready",
                    collapsed: true,
                    layout: {
                        displayMode: "full",
                        arrangement: "default"
                    },
                    children: [
                        {
                            id: "rect2_1",
                            label: "Step 2.1",
                            type: "rect",
                            code: "R2_1",
                            status: "Ready",
                            visible: false,
                            layout: {
                                displayMode: "full",
                                arrangement: "default"
                            },
                            parentId: "subLane2"
                        },
                        {
                            id: "rect2_2",
                            label: "Step 2.2",
                            type: "rect",
                            code: "R2_2",
                            status: "Ready",
                            visible: false,
                            layout: {
                                displayMode: "full",
                                arrangement: "default"
                            },
                            parentId: "subLane2"
                        },
                        {
                            id: "rect2_3",
                            label: "Step 2.3",
                            type: "rect",
                            code: "R2_3",
                            status: "Ready",
                            visible: false,
                            layout: {
                                displayMode: "full",
                                arrangement: "default"
                            },
                            parentId: "subLane2"
                        }
                    ],
                    parentId: "mainLane"
                }
            ],
            // Parent reference
            parentId: null
        }
    ],
    
    // Edge definitions
    edges: []
};
