//////////////////////////////////////////////////////////////
//
// Demo: full_arrangement1_explicit
// Node Type: adapter
// Features: Archive-focused layout,Full mode with explicit children,Arrangement 1 positioning,State management
// Test Status: Ready for Testing
//

export const demoData = {
    // Demo metadata
    metadata: {
        name: "full_arrangement1_explicit",
        nodeType: "adapter",
        features: ["Archive-focused layout", "Full mode with explicit children", "Arrangement 1 positioning", "State management"],
        description: "Adapter node with full mode arrangement 1 and explicitly defined children with states",
        testStatus: "Ready for Testing",
        version: "1.0.0"
    },
    
    // Dashboard settings
    settings: {
        // Display settings
        showCenterMark: false,
        showGrid: false,
        showGroupLabels: true,
        showGroupTitles: true,
        
        // Edge settings
        showGhostlines: false,
        curved: false,
        
        // Node settings
        showConnectionPoints: false,
        
        // Demo-specific settings
        demoMode: true,
        enableTesting: true,
        debugMode: false
    },
    
    // Node definitions
    nodes: [
        {
            id: "adapter-explicit-arr1",
            label: "Data Pipeline",
            code: "DP1",
            type: "adapter",
            
            // Layout configuration for arrangement 1 (archive-focused)
            layout: {
                mode: "full",               // Full adapter with all nodes
                arrangement: 1,             // Archive-focused layout
                displayMode: "full"         // Full display mode
            },
            
            // Node properties
            status: "active",
            state: "processing",
            
            // Explicitly defined children (staging, archive, transform)
            children: [
                {
                    id: "staging-node-1",
                    label: "DWH.STG_LOAD",
                    description: "Staging area for raw data ingestion",
                    type: "node",
                    datasetId: 101,
                    category: "Staging",
                    layout: null,
                    children: [],
                    state: "Updated",
                    role: "staging"
                },
                {
                    id: "archive-node-1", 
                    label: "DWH.ARC_STORE",
                    description: "Archive storage for historical data",
                    type: "node", 
                    datasetId: 102,
                    category: "Archive",
                    layout: null,
                    children: [],
                    state: "Ready",
                    role: "archive"
                },
                {
                    id: "transform-node-1",
                    label: "DWH.TRF_PROCESS",
                    description: "Transform processing for data enrichment",
                    type: "node",
                    datasetId: 103, 
                    category: "Transform",
                    layout: null,
                    children: [],
                    state: "Processing",
                    role: "transform"
                }
            ]
        }
    ],
    
    // Edge definitions
    edges: []
};

// Additional demo data exports for testing scenarios
export const demoDataWithStates = {
    ...demoData,
    nodes: [
        {
            ...demoData.nodes[0],
            children: [
                { ...demoData.nodes[0].children[0], state: "Error" },
                { ...demoData.nodes[0].children[1], state: "Ready" },
                { ...demoData.nodes[0].children[2], state: "Processing" }
            ]
        }
    ]
};

export const demoDataMinimal = {
    ...demoData,
    nodes: [
        {
            ...demoData.nodes[0],
            children: [
                { ...demoData.nodes[0].children[0] },
                { ...demoData.nodes[0].children[1] }
            ]
        }
    ]
};
