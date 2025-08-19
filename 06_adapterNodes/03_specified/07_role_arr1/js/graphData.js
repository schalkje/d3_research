export const demoData = {
    metadata: {
        name: "role_arrangement1_explicit",
        nodeType: "adapter",
        features: ["Role display mode", "Arrangement 1", "Explicit children", "Role-based rendering"],
        description: "Adapter node with role display mode, arrangement 1, and explicitly defined children",
        testStatus: "Ready for Testing",
        version: "1.0.0"
    },
    
    settings: {
        showCenterMark: false,
        showGrid: false,
        showGroupLabels: true,
        showGroupTitles: true,
        showGhostlines: true,
        curved: false,
        showConnectionPoints: false,
        demoMode: true,
        enableTesting: true,
        debugMode: false
    },
    
    nodes: [
        {
            id: "adapter-explicit-role-arr1",
            label: "Role-Based Pipeline",
            code: "RBP1",
            type: "adapter",
            
            layout: {
                mode: "full",               // Full adapter with all nodes
                arrangement: 1,             // Arrangement 1 layout
                displayMode: "role"         // Role display mode
            },
            
            status: "active",
            state: "operating",
            
            children: [
                {
                    id: "staging-role-1",
                    label: "Staging",
                    description: "Data staging role",
                    type: "Node",
                    datasetId: 701,
                    category: "Staging",
                    layout: null,
                    children: [],
                    state: "Active",
                    role: "staging"
                },
                {
                    id: "archive-role-1", 
                    label: "Archive",
                    description: "Data archival role",
                    type: "Node", 
                    datasetId: 702,
                    category: "Archive",
                    layout: null,
                    children: [],
                    state: "Ready",
                    role: "archive"
                },
                {
                    id: "transform-role-1",
                    label: "Transform",
                    description: "Data transformation role",
                    type: "Node",
                    datasetId: 703, 
                    category: "Transform",
                    layout: null,
                    children: [],
                    state: "Processing",
                    role: "transform"
                }
            ]
        }
    ],
    
    edges: [
        { id: "edge-role-1-sa", source: "staging-role-1", target: "archive-role-1", type: "dataflow" },
        { id: "edge-role-1-st", source: "staging-role-1", target: "transform-role-1", type: "dataflow" }
    ]
};
