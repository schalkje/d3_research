export const demoData = {
    metadata: {
        name: "foundation_orientation_rotate90",
        nodeType: "foundation",
        features: ["Full display mode", "Orientation: rotate90"],
        description: "Foundation node in rotate90 orientation",
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
            id: "foundation-orient-r90",
            label: "Foundation R90",
            type: "foundation",
            layout: { mode: "auto", displayMode: "full", orientation: "rotate90" },
            children: []
        }
    ],
    edges: []
};


