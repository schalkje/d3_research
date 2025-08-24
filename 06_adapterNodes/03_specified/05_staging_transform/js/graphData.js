//////////////////////////////////////////////////////////////
//
// Demo: staging_transform_explicit
// Node Type: adapter
// Features: Staging-transform mode,Two-node layout,Explicit children,Processing flow
// Test Status: Ready for Testing
//

export const demoData = {
    // Demo metadata
    metadata: {
        name: "staging_transform_explicit",
        nodeType: "adapter",
        features: ["Staging-transform mode", "Two-node layout", "Explicit children", "Processing flow"],
        description: "Adapter node with staging-transform mode and explicitly defined children (no archive)",
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
            id: "adapter-explicit-staging-transform",
            label: "Processing Pipeline",
            code: "PP",
            type: "adapter",
            
            // Layout configuration for staging-transform mode
            layout: {
                mode: "staging-transform",   // Two-node adapter with staging and transform only
                arrangement: 4,             // Two-node horizontal layout
                displayMode: "full"         // Full display mode
            },
            
            // Node properties
            status: "active",
            state: "processing",
            
            // Explicitly defined children (staging and transform only)
            children: [
                {
                    id: "staging-node-st",
                    label: "DWH.STG_STREAM",
                    description: "Staging area for real-time stream processing",
                    type: "node",
                    datasetId: 501,
                    category: "Staging",
                    layout: null,
                    children: [],
                    state: "Streaming",
                    role: "staging",
                    streamType: "real-time",
                    protocol: "kafka"
                },
                {
                    id: "transform-node-st",
                    label: "DWH.TRF_REALTIME",
                    description: "Real-time transformation and enrichment processing",
                    type: "node",
                    datasetId: 502,
                    category: "Transform",
                    layout: null,
                    children: [],
                    state: "Transforming",
                    role: "transform",
                    processingType: "stream",
                    latency: "low"
                }
            ]
        }
    ],
    
    // Edge definitions (direct staging to transform flow)
    edges: []
};

// Additional demo data exports for testing scenarios
export const demoDataWithHighThroughput = {
    ...demoData,
    nodes: [
        {
            ...demoData.nodes[0],
            children: [
                { 
                    ...demoData.nodes[0].children[0], 
                    state: "High-Throughput",
                    streamType: "high-volume"
                },
                { 
                    ...demoData.nodes[0].children[1], 
                    state: "Optimizing",
                    latency: "ultra-low"
                }
            ]
        }
    ]
};
