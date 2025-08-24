export const demoData = {
    metadata: {
        name: "foundation_full_vertical_explicit",
        nodeType: "foundation",
        features: ["Full display mode", "Vertical orientation", "Explicit children"],
        description: "FoundationNode with vertical orientation and explicit children",
        version: "1.0.0"
    },
    settings: { showGhostlines: false, demoMode: true, enableTesting: true },
    nodes: [{
        id: "foundation-explicit-full-v",
        label: "Vertical Foundation",
        type: "foundation",
        layout: { mode: "auto", displayMode: "full", orientation: "vertical" },
        status: "active",
        children: [
            { id: "raw-node-v", label: "FOUND.RAW_STACK", type: "node", role: "raw", category: "Raw", state: "Stacking", source: "layered" },
            { id: "base-node-v", label: "FOUND.BASE_STACK", type: "node", role: "base", category: "Base", state: "Layering", schema: "stacked" }
        ]
    }],
    edges: []
};
