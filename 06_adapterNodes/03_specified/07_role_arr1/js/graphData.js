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
        showGhostlines: false,
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
                    label: "staging",
                    type: "node",
                    role: "staging",
                    category: "staging",
                    width: 80,
                    height: 44,
                    state: "Active"
                },
                {
                    id: "archive-role-1", 
                    label: "archive",
                    type: "node",
                    role: "archive",
                    category: "archive",
                    width: 80,
                    height: 44,
                    state: "Ready"
                },
                {
                    id: "transform-role-1",
                    label: "transform",
                    type: "node",
                    role: "transform",
                    category: "transform",
                    width: 80,
                    height: 44,
                    state: "Processing"
                }
            ]
        }
    ],
    
    edges: []
};
