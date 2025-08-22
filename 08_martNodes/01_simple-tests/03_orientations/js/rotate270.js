export const demoData = {
    metadata: {
        name: "mart_orientation_rotate270",
        nodeType: "mart",
        features: ["Full display mode", "Orientation: rotate270"],
        description: "Mart node in rotate270 orientation",
        testStatus: "Ready for Testing",
        version: "1.0.0"
    },
    settings: {
        showGhostlines: false,
        showGroupTitles: true,
        demoMode: true,
        enableTesting: true
    },
    nodes: [
        {
            id: "mart-orient-r270",
            label: "Mart R270",
            type: "mart",
            layout: { mode: "auto", displayMode: "full", orientation: "rotate270" },
            children: []
        }
    ],
    edges: []
};


