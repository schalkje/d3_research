//////////////////////////////////////////////////////////////
//
// Demo: mart_full_horizontal_explicit
// Node Type: mart
// Features: Full display mode,Horizontal orientation,Explicit children,State management
// Test Status: Ready for Testing
//

export const demoData = {
    // Demo metadata
    metadata: {
        name: "mart_full_horizontal_explicit",
        nodeType: "mart",
        features: ["Full display mode", "Horizontal orientation", "Explicit children", "State management"],
        description: "MartNode with full display mode, horizontal orientation, and explicitly defined children",
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
            id: "mart-explicit-full-h",
            label: "Data Mart",
            code: "DM1",
            type: "mart",
            x: 320,
            y: 200,
            
            // Layout configuration for horizontal full mode
            layout: {
                mode: "auto",              // Auto mode for mart nodes
                displayMode: "full",       // Full display mode
                orientation: "horizontal"  // Horizontal orientation
            },
            
            // Node properties
            status: "active",
            state: "processing",
            
            // Explicitly defined children (load and report)
            children: [
                {
                    id: "load-node-h",
                    label: "MART.LOAD_DATA",
                    description: "Data loading process for mart ingestion",
                    type: "Node",
                    datasetId: 801,
                    category: "Load",
                    layout: null,
                    children: [],
                    state: "Loading",
                    role: "load",
                    volume: "medium",
                    frequency: "daily"
                },
                {
                    id: "report-node-h", 
                    label: "MART.REPORT_GEN",
                    description: "Report generation from mart data",
                    type: "Node", 
                    datasetId: 802,
                    category: "Report",
                    layout: null,
                    children: [],
                    state: "Generating",
                    role: "report",
                    format: "dashboard",
                    schedule: "hourly"
                }
            ]
        }
    ],
    
    // Edge definitions (no inner connections as per lesson learned)
    edges: []
};

// Additional demo data exports for testing scenarios
export const demoDataWithStates = {
    ...demoData,
    nodes: [
        {
            ...demoData.nodes[0],
            children: [
                { ...demoData.nodes[0].children[0], state: "Loaded" },
                { ...demoData.nodes[0].children[1], state: "Published" }
            ]
        }
    ]
};

export const demoDataHighVolume = {
    ...demoData,
    nodes: [
        {
            ...demoData.nodes[0],
            children: [
                { 
                    ...demoData.nodes[0].children[0], 
                    state: "High-Volume-Loading",
                    volume: "high",
                    frequency: "real-time"
                },
                { 
                    ...demoData.nodes[0].children[1], 
                    state: "Auto-Generating",
                    format: "real-time-dashboard"
                }
            ]
        }
    ]
};
