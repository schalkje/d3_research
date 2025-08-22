//////////////////////////////////////////////////////////////
//
// Demo: mart_role
// Node Type: mart
// Features: Role display mode, Fixed width role labels
// Test Status: Not Tested
//

export const demoData = {
    metadata: {
        name: "mart_role",
        nodeType: "mart",
        features: ["Role display mode", "Fixed width role labels"],
        description: "Mart node with role display mode showing two role tags of fixed width",
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
            id: "mart-role-1",
            label: "Mart (Role)",
            code: "MRT-ROLE",
            type: "mart",
            x: 320,
            y: 200,
            layout: {
                mode: "auto",
                displayMode: "role",
                orientation: "horizontal"
            },
            status: "active",
            state: "ready",
            children: []
        }
    ],
    edges: []
};


