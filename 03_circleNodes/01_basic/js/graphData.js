//////////////////////////////////////////////////////////////
//
// Demo: basic
// Node Type: circle
// Features: 
// Test Status: Not Tested
//

export const demoData = {
    // Demo metadata
    metadata: {
        name: "basic",
        nodeType: "circle",
        features: ["Circular shape", "Radius-based sizing"],
        description: "Circular node with radius-based sizing",
        testStatus: "Not Tested",
        version: "1.0.0"
    },
    
    // Dashboard settings
    settings: {
        // Display settings
        showCenterMark: false,
        showGrid: true,
        showGroupLabels: true,
        showGroupTitles: true,
        
        // Edge settings
        showGhostlines: false,
        curved: false,
        
        // Node settings
        showConnectionPoints: false,
        
        // Demo-specific settings
        demoMode: true,
        enableTesting: true
    },
    
    // Node definitions
    nodes: [
        {
            id: "node1",
            label: "circle Node",
            type: "circle",
            // Node-specific properties
            code: "N1",
            status: "Ready",
            // Layout properties
            layout: {
                displayMode: "full", // or "role", "code"
                arrangement: "default" // varies by node type
            },
            // Child nodes (for container nodes)
            children: [],
            // Parent reference
            parentId: null
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