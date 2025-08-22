export const demoData = {
    metadata: {
        name: "mart_orientation_horizontal",
        nodeType: "mart",
        features: ["Full display mode", "Orientation: horizontal"],
        description: "Mart node in horizontal orientation",
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
            id: "mart-orient-h",
            label: "Mart H",
            type: "mart",
            layout: { mode: "auto", displayMode: "full", orientation: "horizontal" },
            children: []
        }
    ],
    edges: []
};


