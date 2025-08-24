export const demoData = {
    metadata: {
        name: "foundation_full_rotate90_explicit",
        nodeType: "foundation",
        features: ["Full display mode", "Rotate90 orientation", "Explicit children"],
        description: "FoundationNode with rotate90 orientation and explicit children",
        version: "1.0.0"
    },
    settings: { showGhostlines: false, demoMode: true, enableTesting: true },
    nodes: [{
        id: "foundation-explicit-full-r90",
        label: "Rotate90 Foundation",
        type: "foundation",
        layout: { mode: "auto", displayMode: "full", orientation: "rotate90" },
        status: "active",
        children: [
            { id: "raw-node-r90", label: "FOUND.RAW_ROT90", type: "node", role: "raw", category: "Raw", state: "Ingesting", source: "external", format: "json" },
            { id: "base-node-r90", label: "FOUND.BASE_ROT90", type: "node", role: "base", category: "Base", state: "Structuring", schema: "normalized", quality: "validated" }
        ]
    }],
    edges: []
};


