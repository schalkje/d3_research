//////////////////////////////////////////////////////////////
//
// Demo: archive_only
// Node Type: adapter
// Features: Archive-only mode,Single-node layout,Arrangement 5 positioning
// Test Status: Not Tested
//

export const demoData = {
    // Demo metadata
    metadata: {
        name: "archive_only",
        nodeType: "adapter",
        features: ["Archive-only mode", "Single-node layout", "Arrangement 5 positioning"],
        description: "Single adapter node with archive-only mode (single-node layout)",
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
        showGhostlines: true,
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
            id: "adapter-arc-only",
            label: "Archive Only",
            code: "AO",
            type: "adapter",
            x: 300,
            y: 200,
            
            // Layout configuration for archive-only mode
            layout: {
                mode: "archive-only",     // Single-node adapter with archive only
                arrangement: 5,           // Single node centered layout
                displayMode: "full"       // Full display mode
            },
            
            // Node properties
            status: "active",
            state: "ready",
            
            // Auto-generated children (archive only)
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