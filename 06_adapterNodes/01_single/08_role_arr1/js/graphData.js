//////////////////////////////////////////////////////////////
//
// Demo: role_full_arr1
// Node Type: adapter
// Features: Role display mode,Archive-focused layout,Arrangement 1 positioning
// Test Status: Not Tested
//

export const demoData = {
    // Demo metadata
    metadata: {
        name: "role_full_arr1",
        nodeType: "adapter",
        features: ["Role display mode", "Archive-focused layout", "Arrangement 1 positioning"],
        description: "Single adapter node with role display mode and full arrangement 1",
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
            id: "adapter-role-arr1",
            label: "Archive Focused (Role)",
            code: "AFR1",
            type: "adapter",
            x: 300,
            y: 200,
            
            // Layout configuration for arrangement 1 with role display
            layout: {
                mode: "full",           // Full adapter with all nodes
                arrangement: 1,         // Archive-focused layout
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