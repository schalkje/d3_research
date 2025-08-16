export const demoData = {
    metadata: {
        name: "mart_orientation_vertical",
        nodeType: "mart",
        features: ["Full display mode", "Orientation: vertical"],
        description: "Mart node in vertical orientation",
        testStatus: "Ready for Testing",
        version: "1.0.0"
    },
    settings: {
        showGhostlines: true,
        showGroupTitles: true,
        demoMode: true,
        enableTesting: true
    },
    nodes: [
        {
            id: "mart-orient-v",
            label: "Mart V",
            type: "mart",
            layout: { mode: "auto", displayMode: "full", orientation: "vertical" },
            children: []
        }
    ],
    edges: []
};


