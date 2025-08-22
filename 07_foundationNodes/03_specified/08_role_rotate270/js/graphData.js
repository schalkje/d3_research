export const demoData = {
    metadata: {
        name: "foundation_role_rotate270_explicit",
        nodeType: "foundation",
        features: ["Role display mode", "Rotate270 orientation", "Explicit children"],
        description: "FoundationNode with role display mode, rotate270 orientation, and explicit children",
        version: "1.0.0"
    },
    settings: { showGhostlines: false, demoMode: true, enableTesting: true },
    nodes: [{
        id: "foundation-explicit-role-r270",
        label: "Role Rotate270 Foundation",
        type: "foundation",
        layout: { mode: "auto", displayMode: "role", orientation: "rotate270" },
        status: "active",
        children: [
            { id: "raw-role-r270", label: "raw rotate 270", type: "Node", role: "raw", category: "raw", width: 60, height: 32, state: "Active" },
            { id: "base-role-r270", label: "base rotate 270", type: "Node", role: "base", category: "base", width: 60, height: 32, state: "Ready" }
        ]
    }],
    edges: []
};


