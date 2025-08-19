//////////////////////////////////////////////////////////////
//
// Demo: full_arrangement2_explicit
// Node Type: adapter
// Features: Transform-focused layout,Full mode with explicit children,Arrangement 2 positioning,State management
// Test Status: Ready for Testing
//

export const demoData = {
    // Demo metadata
    metadata: {
        name: "full_arrangement2_explicit",
        nodeType: "adapter",
        features: ["Transform-focused layout", "Full mode with explicit children", "Arrangement 2 positioning", "State management"],
        description: "Adapter node with full mode arrangement 2 (transform-focused) and explicitly defined children",
        testStatus: "Ready for Testing",
        version: "1.0.0"
    },
    
    // Dashboard settings
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
    
    // Node definitions
    nodes: [
        {
            id: "adapter-explicit-arr2",
            label: "Transform Pipeline",
            code: "TP2",
            type: "adapter",
            
            // Layout configuration for arrangement 2 (transform-focused)
            layout: {
                mode: "full",               // Full adapter with all nodes
                arrangement: 2,             // Transform-focused layout
                displayMode: "full"         // Full display mode
            },
            
            // Node properties
            status: "active",
            state: "processing",
            
            // Explicitly defined children (staging, archive, transform)
            children: [
                {
                    id: "staging-node-2",
                    label: "DWH.STG_INPUT",
                    description: "Staging area for raw data processing",
                    type: "Node",
                    datasetId: 201,
                    category: "Staging",
                    layout: null,
                    children: [],
                    state: "Active",
                    role: "staging"
                },
                {
                    id: "archive-node-2", 
                    label: "DWH.ARC_BACKUP",
                    description: "Archive backup for processed data",
                    type: "Node", 
                    datasetId: 202,
                    category: "Archive",
                    layout: null,
                    children: [],
                    state: "Idle",
                    role: "archive"
                },
                {
                    id: "transform-node-2",
                    label: "DWH.TRF_ANALYTICS",
                    description: "Analytics transformation for business insights",
                    type: "Node",
                    datasetId: 203, 
                    category: "Transform",
                    layout: null,
                    children: [],
                    state: "Running",
                    role: "transform"
                }
            ]
        }
    ],
    
    // Edge definitions
    edges: [
    ]
};

// Additional demo data exports for testing scenarios
export const demoDataWithComplexTransform = {
    ...demoData,
    nodes: [
        {
            ...demoData.nodes[0],
            children: [
                { ...demoData.nodes[0].children[0], state: "Pending" },
                { ...demoData.nodes[0].children[1], state: "Ready" },
                { 
                    ...demoData.nodes[0].children[2], 
                    state: "Processing",
                    description: "Complex analytics transformation with ML models"
                }
            ]
        }
    ]
};
