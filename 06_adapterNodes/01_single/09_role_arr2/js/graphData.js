//////////////////////////////////////////////////////////////
//
// Demo: role_full_arr2
// Node Type: adapter
// Features: Role display mode,Transform-focused layout,Arrangement 2 positioning
// Test Status: Not Tested
//

export const demoData = {
    // Demo metadata
    metadata: {
        name: "role_full_arr2",
        nodeType: "adapter",
        features: ["Role display mode", "Transform-focused layout", "Arrangement 2 positioning"],
        description: "Single adapter node with role display mode and full arrangement 2",
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
            id: "adapter-role-arr2",
            label: "Transform Focused (Role)",
            code: "TFR2",
            type: "adapter",
            x: 300,
            y: 200,
            
            // Layout configuration for arrangement 2 with role display
            layout: {
                mode: "full",           // Full adapter with all nodes
                arrangement: 2,         // Transform-focused layout
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