export const demoData = {
    metadata: {
        name: "foundation_orientation_rotate270",
        nodeType: "foundation",
        features: ["Full display mode", "Orientation: rotate270"],
        description: "Foundation node in rotate270 orientation",
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
            id: "foundation-orient-r270",
            label: "Foundation R270",
            type: "foundation",
            layout: { mode: "auto", displayMode: "full", orientation: "rotate270" },
            children: []
        }
    ],
    edges: []
};


