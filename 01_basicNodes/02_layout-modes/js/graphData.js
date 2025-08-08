//////////////////////////////////////////////////////////////
//
// Demo: default-layout
// Node Type: node
// Features: Default layout mode with fixed dimensions
// Test Status: Not Tested
//

export const demoData = {
    // Demo metadata
    metadata: {
        name: "default-layout",
        nodeType: "node",
        features: ["Default layout", "Fixed dimensions", "Standard positioning"],
        description: "Default layout mode with standard positioning and fixed sizing",
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
            label: "Default Layout Node",
            type: "node",
            // Node-specific properties
            code: "N1",
            status: "Ready",
            // Fixed dimensions for default layout
            width: 80,
            height: 60,
            // Layout properties
            layout: {
                displayMode: "full",
                arrangement: "default",
                layoutMode: "default" // Fixed dimensions
            },
            // Text configuration
            text: {
                content: "Default Layout Node",
                fontSize: 12,
                fontFamily: "Arial",
                fontWeight: "normal",
                textAnchor: "middle",
                dominantBaseline: "middle",
                color: "#333333",
                maxLength: null
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
