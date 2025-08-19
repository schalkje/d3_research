export const demoData = {
    metadata: {
        name: "foundation_orientation_horizontal",
        nodeType: "foundation",
        features: ["Full display mode", "Orientation: horizontal"],
        description: "Foundation node in horizontal orientation",
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
            id: "foundation-orient-h",
            label: "Foundation H",
            type: "foundation",
            layout: { mode: "auto", displayMode: "full", orientation: "horizontal" },
            children: []
        }
    ],
    edges: []
};


