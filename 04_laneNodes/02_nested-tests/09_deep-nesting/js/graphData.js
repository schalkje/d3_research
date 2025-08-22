//////////////////////////////////////////////////////////////
//
// Demo: deep-nesting
// Node Type: lane
// Features: Deep nesting with 3 levels of hierarchy
// Test Status: Not Tested
//

export const demoData = {
    // Demo metadata
    metadata: {
        name: "deep-nesting",
        nodeType: "lane",
        features: ["Deep nesting", "3-level hierarchy", "Child management", "Vertical stacking", "Horizontal centering"],
        description: "Lane with 3 levels of nesting, demonstrating deep hierarchical layout",
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
            id: "level1Lane",
            label: "Level 1 - Main Process",
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
                    id: "level2Lane1",
                    label: "Level 2 - Sub Process A",
                    type: "lane",
                    code: "L2A",
                    status: "Ready",
                    layout: {
                        displayMode: "full",
                        arrangement: "default"
                    },
                    children: [
                        {
                            id: "level3Lane1",
                            label: "Level 3 - Detail Process A1",
                            type: "lane",
                            code: "L3A1",
                            status: "Ready",
                            layout: {
                                displayMode: "full",
                                arrangement: "default"
                            },
                            children: [
                                {
                                    id: "rectA1_1",
                                    label: "Detail Step A1.1",
                                    type: "rect",
                                    code: "RA1_1",
                                    status: "Ready",
                                    layout: {
                                        displayMode: "full",
                                        arrangement: "default"
                                    },
                                    parentId: "level3Lane1"
                                },
                                {
                                    id: "rectA1_2",
                                    label: "Detail Step A1.2",
                                    type: "rect",
                                    code: "RA1_2",
                                    status: "Ready",
                                    layout: {
                                        displayMode: "full",
                                        arrangement: "default"
                                    },
                                    parentId: "level3Lane1"
                                }
                            ],
                            parentId: "level2Lane1"
                        },
                        {
                            id: "level3Lane2",
                            label: "Level 3 - Detail Process A2",
                            type: "lane",
                            code: "L3A2",
                            status: "Ready",
                            layout: {
                                displayMode: "full",
                                arrangement: "default"
                            },
                            children: [
                                {
                                    id: "rectA2_1",
                                    label: "Detail Step A2.1",
                                    type: "rect",
                                    code: "RA2_1",
                                    status: "Ready",
                                    layout: {
                                        displayMode: "full",
                                        arrangement: "default"
                                    },
                                    parentId: "level3Lane2"
                                }
                            ],
                            parentId: "level2Lane1"
                        }
                    ],
                    parentId: "level1Lane"
                },
                {
                    id: "level2Lane2",
                    label: "Level 2 - Sub Process B",
                    type: "lane",
                    code: "L2B",
                    status: "Ready",
                    layout: {
                        displayMode: "full",
                        arrangement: "default"
                    },
                    children: [
                        {
                            id: "level3Lane3",
                            label: "Level 3 - Detail Process B1",
                            type: "lane",
                            code: "L3B1",
                            status: "Ready",
                            layout: {
                                displayMode: "full",
                                arrangement: "default"
                            },
                            children: [
                                {
                                    id: "rectB1_1",
                                    label: "Detail Step B1.1",
                                    type: "rect",
                                    code: "RB1_1",
                                    status: "Ready",
                                    layout: {
                                        displayMode: "full",
                                        arrangement: "default"
                                    },
                                    parentId: "level3Lane3"
                                },
                                {
                                    id: "rectB1_2",
                                    label: "Detail Step B1.2",
                                    type: "rect",
                                    code: "RB1_2",
                                    status: "Ready",
                                    layout: {
                                        displayMode: "full",
                                        arrangement: "default"
                                    },
                                    parentId: "level3Lane3"
                                }
                            ],
                            parentId: "level2Lane2"
                        }
                    ],
                    parentId: "level1Lane"
                }
            ],
            // Parent reference
            parentId: null
        }
    ],
    
    // Edge definitions
    edges: []
};
