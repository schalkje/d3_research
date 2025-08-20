export const demoData = {
    metadata: {
        name: "foundation_role_rotate90_explicit",
        nodeType: "foundation",
        features: ["Role display mode", "Rotate90 orientation", "Explicit children"],
        description: "FoundationNode with role display mode, rotate90 orientation, and explicit children",
        version: "1.0.0"
    },
    settings: { showGhostlines: false, demoMode: true, enableTesting: true },
    nodes: [{
        id: "foundation-explicit-role-r90",
        label: "Role Rotate90 Foundation",
        type: "foundation",
        layout: { mode: "auto", displayMode: "role", orientation: "rotate90" },
        status: "active",
        children: [
            { id: "raw-role-r90", label: "raw rotate 90", type: "Node", role: "raw", category: "raw", width: 60, height: 32, state: "Active" },
            { id: "base-role-r90", label: "base rotate 90", type: "Node", role: "base", category: "base", width: 60, height: 32, state: "Ready" }
        ]
    }],
    edges: []
};


