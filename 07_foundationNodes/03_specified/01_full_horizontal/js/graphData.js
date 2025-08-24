//////////////////////////////////////////////////////////////
//
// Demo: foundation_full_horizontal_explicit
// Node Type: foundation
// Features: Full display mode,Horizontal orientation,Explicit children,State management
// Test Status: Ready for Testing
//

export const demoData = {
    // Demo metadata
    metadata: {
        name: "foundation_full_horizontal_explicit",
        nodeType: "foundation",
        features: ["Full display mode", "Horizontal orientation", "Explicit children", "State management"],
        description: "FoundationNode with full display mode, horizontal orientation, and explicitly defined children",
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
            id: "foundation-explicit-full-h",
            label: "Data Foundation",
            code: "DF1",
            type: "foundation",
            x: 320,
            y: 200,
            
            // Layout configuration for horizontal full mode
            layout: {
                mode: "auto",              // Auto mode for foundation nodes
                displayMode: "full",       // Full display mode
                orientation: "horizontal"  // Horizontal orientation
            },
            
            // Node properties
            status: "active",
            state: "building",
            
            // Explicitly defined children (raw and base)
            children: [
                {
                    id: "raw-node-h",
                    label: "FOUND.RAW_DATA",
                    description: "Raw data ingestion layer",
                    type: "node",
                    datasetId: 901,
                    category: "Raw",
                    layout: null,
                    children: [],
                    state: "Ingesting",
                    role: "raw",
                    source: "external",
                    format: "json"
                },
                {
                    id: "base-node-h", 
                    label: "FOUND.BASE_LAYER",
                    description: "Base layer for foundational data structures",
                    type: "node", 
                    datasetId: 902,
                    category: "Base",
                    layout: null,
                    children: [],
                    state: "Structuring",
                    role: "base",
                    schema: "normalized",
                    quality: "validated"
                }
            ]
        }
    ],
    
    // Edge definitions (no inner connections as per lesson learned)
    edges: []
};

// Additional demo data exports for testing scenarios
export const demoDataWithQuality = {
    ...demoData,
    nodes: [
        {
            ...demoData.nodes[0],
            children: [
                { ...demoData.nodes[0].children[0], state: "Validated", quality: "high" },
                { ...demoData.nodes[0].children[1], state: "Optimized", schema: "star" }
            ]
        }
    ]
};

export const demoDataMultiSource = {
    ...demoData,
    nodes: [
        {
            ...demoData.nodes[0],
            children: [
                { 
                    ...demoData.nodes[0].children[0], 
                    state: "Multi-Source-Ingesting",
                    source: "multi-source",
                    format: "mixed"
                },
                { 
                    ...demoData.nodes[0].children[1], 
                    state: "Harmonizing",
                    schema: "unified"
                }
            ]
        }
    ]
};
