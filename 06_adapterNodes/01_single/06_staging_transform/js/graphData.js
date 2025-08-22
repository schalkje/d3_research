//////////////////////////////////////////////////////////////
//
// Demo: staging_transform
// Node Type: adapter
// Features: Staging-transform mode,Two-node layout,Arrangement 4 positioning
// Test Status: Not Tested
//

export const demoData = {
    // Demo metadata
    metadata: {
        name: "staging_transform",
        nodeType: "adapter",
        features: ["Staging-transform mode", "Two-node layout", "Arrangement 4 positioning"],
        description: "Single adapter node with staging-transform mode (two-node layout)",
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
            id: "adapter-stg-tfm",
            label: "Staging-Transform",
            code: "ST",
            type: "adapter",

            
            // Layout configuration for staging-transform mode
            layout: {
                mode: "staging-transform", // Two-node adapter with staging and transform
                arrangement: 4,           // Two-node horizontal layout
                displayMode: "full"       // Full display mode
            },
            
            // Node properties
            status: "active",
            state: "ready",
            
            // Auto-generated children (staging, transform)
            children: []
        }
    ],
    
    // Edge definitions
    edges: []
};

// Additional demo data exports for different scenarios
export const demoDataWithChildren = {
    // ... similar structure with children
};

export const demoDataComplex = {
    // ... complex scenario
};