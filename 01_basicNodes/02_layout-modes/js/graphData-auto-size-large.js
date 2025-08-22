//////////////////////////////////////////////////////////////
//
// Demo: auto-size-large
// Node Type: node
// Features: Auto-size layout mode with large text
// Test Status: Not Tested
//

export const demoData = {
    // Demo metadata
    metadata: {
        name: "auto-size-large",
        nodeType: "node",
        features: ["Auto-size layout", "Dynamic sizing", "Large text example"],
        description: "Auto-size layout mode with large text - demonstrates dynamic sizing",
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
            label: "Very Long Text That Should Expand The Node Size Significantly",
            type: "node",
            // Node-specific properties
            code: "N1",
            status: "Ready",
            // Auto-size dimensions (will be calculated based on content)
            width: null, // Will be calculated
            height: null, // Will be calculated
            // Layout properties
            layout: {
                displayMode: "full",
                arrangement: "default",
                layoutMode: "auto-size" // Dynamic sizing based on content
            },
            // Text configuration
            text: {
                content: "Very Long Text That Should Expand The Node Size Significantly",
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
