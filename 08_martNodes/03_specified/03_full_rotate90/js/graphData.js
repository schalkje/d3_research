export const demoData = {
    metadata: {
        name: "mart_full_rotate90_explicit",
        nodeType: "mart",
        features: ["Full display mode", "90° rotation", "Explicit children"],
        description: "MartNode with 90° rotation and explicit children",
        version: "1.0.0"
    },
    settings: { showGhostlines: false, demoMode: true, enableTesting: true },
    nodes: [{
        id: "mart-explicit-full-r90",
        label: "Rotated Mart",
        type: "mart",
        layout: { mode: "auto", displayMode: "full", orientation: "rotate90" },
        status: "active",
        children: [
            { id: "load-node-r90", label: "MART.LOAD_ROTATE", type: "node", role: "load", category: "Load", state: "Rotating" },
            { id: "report-node-r90", label: "MART.REPORT_ROTATE", type: "node", role: "report", category: "Report", state: "Aligned" }
        ]
    }],
    edges: []
};
