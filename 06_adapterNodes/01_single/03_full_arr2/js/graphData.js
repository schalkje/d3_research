//////////////////////////////////////////////////////////////
//
// Demo: full_arrangement2
// Node Type: adapter
// Features: Transform-focused layout,Full mode with staging/archive/transform,Arrangement 2 positioning
// Test Status: Not Tested
//

export const demoData = {
    // Demo metadata
    metadata: {
        name: "full_arrangement2",
        nodeType: "adapter",
        features: ["Transform-focused layout", "Full mode with staging/archive/transform", "Arrangement 2 positioning"],
        description: "Single adapter node with full mode arrangement 2 (transform-focused layout)",
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
            id: "adapter-arr2",
            label: "Transform Focused",
            code: "TF2",
            type: "adapter",
            x: 300,
            y: 200,
            
            // Layout configuration for arrangement 2 (transform-focused)
            layout: {
                mode: "full",           // Full adapter with all nodes
                arrangement: 2,         // Transform-focused layout
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