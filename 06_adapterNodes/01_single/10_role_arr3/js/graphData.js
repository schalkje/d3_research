//////////////////////////////////////////////////////////////
//
// Demo: role_full_arr3
// Node Type: adapter
// Features: Role display mode,Staging-focused layout,Arrangement 3 positioning
// Test Status: Not Tested
//

export const demoData = {
    // Demo metadata
    metadata: {
        name: "role_full_arr3",
        nodeType: "adapter",
        features: ["Role display mode", "Staging-focused layout", "Arrangement 3 positioning"],
        description: "Single adapter node with role display mode and full arrangement 3",
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
            id: "adapter-role-arr3",
            label: "Staging Focused (Role)",
            code: "SFR3",
            type: "adapter",

            
            // Layout configuration for arrangement 3 with role display
            layout: {
                mode: "full",           // Full adapter with all nodes
                arrangement: 3,         // Staging-focused layout
                displayMode: "role"     // Role display mode
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