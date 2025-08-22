//////////////////////////////////////////////////////////////
//
// Demo: staging_archive
// Node Type: adapter
// Features: Staging-archive mode,Two-node layout,Arrangement 4 positioning
// Test Status: Not Tested
//

export const demoData = {
    // Demo metadata
    metadata: {
        name: "staging_archive",
        nodeType: "adapter",
        features: ["Staging-archive mode", "Two-node layout", "Arrangement 4 positioning"],
        description: "Single adapter node with staging-archive mode (two-node layout)",
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
            id: "adapter-stg-arc",
            label: "Staging-Archive",
            code: "SA",
            type: "adapter",

            
            // Layout configuration for staging-archive mode
            layout: {
                mode: "staging-archive", // Two-node adapter with staging and archive
                arrangement: 4,         // Two-node horizontal layout
                displayMode: "full"     // Full display mode
            },
            
            // Node properties
            status: "active",
            state: "ready",
            
            // Auto-generated children (staging, archive)
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