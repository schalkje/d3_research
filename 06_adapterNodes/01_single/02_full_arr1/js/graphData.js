//////////////////////////////////////////////////////////////
//
// Demo: full_arrangement1
// Node Type: adapter
// Features: Archive-focused layout,Full mode with staging/archive/transform,Arrangement 1 positioning
// Test Status: Not Tested
//

export const demoData = {
    // Demo metadata
    metadata: {
        name: "full_arrangement1",
        nodeType: "adapter",
        features: ["Archive-focused layout", "Full mode with staging/archive/transform", "Arrangement 1 positioning"],
        description: "Single adapter node with full mode arrangement 1 (archive-focused layout)",
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
            id: "adapter-arr1",
            label: "Archive Focused",
            code: "AF1",
            type: "adapter",
            
            // Layout configuration for arrangement 1 (archive-focused)
            layout: {
                mode: "full",           // Full adapter with all nodes
                arrangement: 1,         // Archive-focused layout
                displayMode: "full"     // Full display mode
            },
            
            // Node properties
            status: "active",
            state: "ready",
            
            // Auto-generated children (staging, archive, transform)
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