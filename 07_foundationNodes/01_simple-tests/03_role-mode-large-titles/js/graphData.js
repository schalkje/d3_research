//////////////////////////////////////////////////////////////
//
// Demo: foundation_role_large_titles
// Node Type: foundation
// Features: Role display mode, Large titles, Enhanced readability
// Test Status: Not Tested
//

export const demoData = {
    metadata: {
        name: "foundation_role_large_titles",
        nodeType: "foundation",
        features: ["Role display mode", "Large titles", "Enhanced readability"],
        description: "Foundation node with role display mode showing large titles for enhanced readability",
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
            id: "foundation-role-large-1",
            label: "Data Foundation with Large Titles for Enhanced Readability",
            code: "FND-ROLE-LARGE",
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
            // Large title configuration
            text: {
                fontSize: 16,
                fontFamily: "Arial, sans-serif",
                fontWeight: "bold",
                textAnchor: "middle",
                dominantBaseline: "middle",
                color: "#2c3e50",
                maxLength: null
            },
            children: []
        }
    ],
    
    edges: []
};


