//////////////////////////////////////////////////////////////
//
// Demo: archive_only_explicit
// Node Type: adapter
// Features: Archive-only mode,Single-node layout,Explicit children,Storage focus
// Test Status: Ready for Testing
//

export const demoData = {
    metadata: {
        name: "archive_only_explicit",
        nodeType: "adapter",
        features: ["Archive-only mode", "Single-node layout", "Explicit children", "Storage focus"],
        description: "Adapter node with archive-only mode and explicitly defined child (storage only)",
        testStatus: "Ready for Testing",
        version: "1.0.0"
    },
    
    settings: {
        showCenterMark: false,
        showGrid: false,
        showGroupLabels: true,
        showGroupTitles: true,
        showGhostlines: false,
        curved: false,
        showConnectionPoints: false,
        demoMode: true,
        enableTesting: true,
        debugMode: false
    },
    
    nodes: [
        {
            id: "adapter-explicit-archive-only",
            label: "Archive Storage",
            code: "AS",
            type: "adapter",
            
            layout: {
                mode: "archive-only",        // Single-node adapter with archive only
                arrangement: 5,             // Single-node centered layout
                displayMode: "full"         // Full display mode
            },
            
            status: "active",
            state: "storing",
            
            children: [
                {
                    id: "archive-node-only",
                    label: "DWH.ARC_VAULT",
                    description: "Long-term data vault for permanent storage",
                    type: "node",
                    datasetId: 601,
                    category: "Archive",
                    layout: null,
                    children: [],
                    state: "Storing",
                    role: "archive",
                    capacity: "unlimited",
                    retention: "permanent",
                    redundancy: "triple"
                }
            ]
        }
    ],
    
    edges: []
};
