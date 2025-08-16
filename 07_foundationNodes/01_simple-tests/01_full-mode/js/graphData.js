//////////////////////////////////////////////////////////////
//
// Demo: foundation_full
// Node Type: foundation
// Features: Full display mode, Auto child creation, Internal edge
// Test Status: Not Tested
//

export const demoData = {
    metadata: {
        name: "foundation_full",
        nodeType: "foundation",
        features: ["Full display mode", "Auto child creation", "Internal edge"],
        description: "Single foundation node in full display mode showing raw → base with internal edge",
        testStatus: "Ready for Testing",
        version: "1.0.0"
    },
    
    settings: {
        showCenterMark: false,
        showGrid: false,
        showGroupLabels: true,
        showGroupTitles: true,
        showGhostlines: true,
        curved: false,
        showConnectionPoints: false,
        demoMode: true,
        enableTesting: true,
        debugMode: false
    },
    
    nodes: [
        {
            id: "foundation-full-1",
            label: "Foundation (Full)",
            code: "FND-FULL",
            type: "foundation",
            layout: {
                mode: "auto",
                displayMode: "full",
                orientation: "horizontal"
            },
            status: "active",
            state: "ready",
            children: []
        }
    ],
    
    edges: []
};


