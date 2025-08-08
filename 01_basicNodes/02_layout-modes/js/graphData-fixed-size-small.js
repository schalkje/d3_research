//////////////////////////////////////////////////////////////
//
// Demo: fixed-size-small
// Node Type: node
// Features: Fixed-size layout mode with small text
// Test Status: Not Tested
//

export const demoData = {
    // Demo metadata
    metadata: {
        name: "fixed-size-small",
        nodeType: "node",
        features: ["Fixed-size layout", "Fixed dimensions", "Small text example"],
        description: "Fixed-size layout mode with small text - demonstrates fixed dimensions",
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
            label: "Small Text",
            type: "node",
            // Node-specific properties
            code: "N1",
            status: "Ready",
            // Fixed dimensions for fixed-size layout
            width: 80,
            height: 60,
            // Layout properties
            layout: {
                displayMode: "full",
                arrangement: "default",
                layoutMode: "fixed-size" // Fixed dimensions regardless of content
            },
            // Text configuration
            text: {
                content: "Small Text",
                fontSize: 12,
                fontFamily: "Arial",
                fontWeight: "normal",
                textAnchor: "middle",
                dominantBaseline: "middle",
                color: "#333333",
                maxLength: 20 // Limit text length for fixed size
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
