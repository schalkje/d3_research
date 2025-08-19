//////////////////////////////////////////////////////////////
//
// Demo: mart_full
// Node Type: mart
// Features: Full display mode, Auto child creation, Internal edge
// Test Status: Not Tested
//

export const demoData = {
    metadata: {
        name: "mart_full",
        nodeType: "mart",
        features: ["Full display mode", "Auto child creation", "Internal edge"],
        description: "Single mart node in full display mode showing load → report with internal edge",
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
            id: "mart-full-1",
            label: "Mart (Full)",
            code: "MRT-FULL",
            type: "mart",
            x: 320,
            y: 200,
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


