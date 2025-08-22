//////////////////////////////////////////////////////////////
//
// Demo: staging_archive_explicit
// Node Type: adapter
// Features: Staging-archive mode,Two-node layout,Explicit children,Direct flow
// Test Status: Ready for Testing
//

export const demoData = {
    // Demo metadata
    metadata: {
        name: "staging_archive_explicit",
        nodeType: "adapter",
        features: ["Staging-archive mode", "Two-node layout", "Explicit children", "Direct flow"],
        description: "Adapter node with staging-archive mode and explicitly defined children (no transform)",
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
            id: "adapter-explicit-staging-archive",
            label: "Storage Pipeline",
            code: "STP",
            type: "adapter",
            
            // Layout configuration for staging-archive mode
            layout: {
                mode: "staging-archive",     // Two-node adapter with staging and archive only
                arrangement: 4,             // Two-node horizontal layout
                displayMode: "full"         // Full display mode
            },
            
            // Node properties
            status: "active",
            state: "archiving",
            
            // Explicitly defined children (staging and archive only)
            children: [
                {
                    id: "staging-node-sa",
                    label: "DWH.STG_BATCH",
                    description: "Staging area for batch data collection",
                    type: "Node",
                    datasetId: 401,
                    category: "Staging",
                    layout: null,
                    children: [],
                    state: "Collecting",
                    role: "staging",
                    batchSize: "large",
                    frequency: "hourly"
                },
                {
                    id: "archive-node-sa", 
                    label: "DWH.ARC_PERMANENT",
                    description: "Permanent archive storage for long-term retention",
                    type: "Node", 
                    datasetId: 402,
                    category: "Archive",
                    layout: null,
                    children: [],
                    state: "Archiving",
                    role: "archive",
                    retention: "permanent",
                    compression: "high"
                }
            ]
        }
    ],
    
    // Edge definitions (direct staging to archive flow)
    edges: []
};

// Additional demo data exports for testing scenarios
export const demoDataWithCompression = {
    ...demoData,
    nodes: [
        {
            ...demoData.nodes[0],
            children: [
                { 
                    ...demoData.nodes[0].children[0], 
                    state: "Compressing",
                    batchSize: "extra-large"
                },
                { 
                    ...demoData.nodes[0].children[1], 
                    state: "Compressed",
                    compression: "ultra"
                }
            ]
        }
    ]
};
