export const demoData = {
    metadata: {
        name: "foundation_full_rotate270_explicit",
        nodeType: "foundation",
        features: ["Full display mode", "Rotate270 orientation", "Explicit children"],
        description: "FoundationNode with rotate270 orientation and explicit children",
        version: "1.0.0"
    },
    settings: { showGhostlines: false, demoMode: true, enableTesting: true },
    nodes: [{
        id: "foundation-explicit-full-r270",
        label: "Rotate270 Foundation",
        type: "foundation",
        layout: { mode: "auto", displayMode: "full", orientation: "rotate270" },
        status: "active",
        children: [
            { id: "raw-node-r270", label: "FOUND.RAW_ROT270", type: "node", role: "raw", category: "Raw", state: "Ingesting", source: "external", format: "csv" },
            { id: "base-node-r270", label: "FOUND.BASE_ROT270", type: "node", role: "base", category: "Base", state: "Structuring", schema: "star", quality: "validated" }
        ]
    }],
    edges: []
};


