//////////////////////////////////////////////////////////////
//
// Demo: foundation_full_large_titles
// Node Type: foundation
// Features: Full display mode, Large titles, Internal edge, Enhanced readability
// Test Status: Not Tested
//

export const demoData = {
    metadata: {
        name: "foundation_full_large_titles",
        nodeType: "foundation",
        features: ["Full display mode", "Large titles", "Internal edge", "Enhanced readability"],
        description: "Foundation node in full display mode showing both components (raw → base) with large titles for enhanced readability",
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
            id: "foundation-full-large-1",
            label: "Data Foundation with Large Titles for Enhanced Readability",
            code: "FND-FULL-LARGE",
            type: "foundation",
            layout: {
                mode: "auto",
                displayMode: "full",
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


