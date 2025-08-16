//////////////////////////////////////////////////////////////
//
// Demo: foundation_role
// Node Type: foundation
// Features: Role display mode, Fixed width role labels
// Test Status: Not Tested
//

export const demoData = {
    metadata: {
        name: "foundation_role",
        nodeType: "foundation",
        features: ["Role display mode", "Fixed width role labels"],
        description: "Foundation node with role display mode showing two role tags of fixed width",
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
            id: "foundation-role-1",
            label: "Foundation (Role)",
            code: "FND-ROLE",
            type: "foundation",
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


