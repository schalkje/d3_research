export const demoData = {
    metadata: {
        name: "mart_orientation_rotate90",
        nodeType: "mart",
        features: ["Full display mode", "Orientation: rotate90"],
        description: "Mart node in rotate90 orientation",
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
            id: "mart-orient-r90",
            label: "Mart R90",
            type: "mart",
            layout: { mode: "auto", displayMode: "full", orientation: "rotate90" },
            children: []
        }
    ],
    edges: []
};


