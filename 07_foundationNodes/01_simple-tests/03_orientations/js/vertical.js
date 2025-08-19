export const demoData = {
    metadata: {
        name: "foundation_orientation_vertical",
        nodeType: "foundation",
        features: ["Full display mode", "Orientation: vertical"],
        description: "Foundation node in vertical orientation",
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
            id: "foundation-orient-v",
            label: "Foundation V",
            type: "foundation",
            layout: { mode: "auto", displayMode: "full", orientation: "vertical" },
            children: []
        }
    ],
    edges: []
};


