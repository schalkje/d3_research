//////////////////////////////////////////////////////////////
//
// Demo: full_arrangement3_explicit
// Node Type: adapter
// Features: Staging-focused layout,Full mode with explicit children,Arrangement 3 positioning,State management
// Test Status: Ready for Testing
//

export const demoData = {
    // Demo metadata
    metadata: {
        name: "full_arrangement3_explicit",
        nodeType: "adapter",
        features: ["Staging-focused layout", "Full mode with explicit children", "Arrangement 3 positioning", "State management"],
        description: "Adapter node with full mode arrangement 3 (staging-focused) and explicitly defined children",
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
            id: "adapter-explicit-arr3",
            label: "Staging Pipeline",
            code: "SP3",
            type: "adapter",
            
            // Layout configuration for arrangement 3 (staging-focused)
            layout: {
                mode: "full",               // Full adapter with all nodes
                arrangement: 3,             // Staging-focused layout
                displayMode: "full"         // Full display mode
            },
            
            // Node properties
            status: "active",
            state: "ingesting",
            
            // Explicitly defined children (staging, archive, transform)
            children: [
                {
                    id: "staging-node-3",
                    label: "DWH.STG_INGEST",
                    description: "Primary staging area for high-volume data ingestion",
                    type: "Node",
                    datasetId: 301,
                    category: "Staging",
                    layout: null,
                    children: [],
                    state: "Ingesting",
                    role: "staging",
                    volume: "high",
                    priority: "primary"
                },
                {
                    id: "archive-node-3", 
                    label: "DWH.ARC_STORE",
                    description: "Archive storage for completed staging batches",
                    type: "Node", 
                    datasetId: 302,
                    category: "Archive",
                    layout: null,
                    children: [],
                    state: "Storing",
                    role: "archive"
                },
                {
                    id: "transform-node-3",
                    label: "DWH.TRF_CLEAN",
                    description: "Data cleaning and validation transforms",
                    type: "Node",
                    datasetId: 303, 
                    category: "Transform",
                    layout: null,
                    children: [],
                    state: "Cleaning",
                    role: "transform"
                }
            ]
        }
    ],
    
    // Edge definitions (staging-first fan-out pattern)
    edges: [
        {
            id: "edge-staging-archive-3",
            source: "staging-node-3",
            target: "archive-node-3",
            type: "dataflow",
            priority: "high"
        },
        {
            id: "edge-staging-transform-3", 
            source: "staging-node-3",
            target: "transform-node-3",
            type: "dataflow",
            priority: "high"
        }
    ]
};

// Additional demo data exports for testing scenarios
export const demoDataWithHighVolume = {
    ...demoData,
    nodes: [
        {
            ...demoData.nodes[0],
            children: [
                { 
                    ...demoData.nodes[0].children[0], 
                    state: "Ingesting",
                    description: "High-volume staging with 10M+ records/hour",
                    volume: "very-high"
                },
                { ...demoData.nodes[0].children[1], state: "Archiving" },
                { ...demoData.nodes[0].children[2], state: "Validating" }
            ]
        }
    ]
};
