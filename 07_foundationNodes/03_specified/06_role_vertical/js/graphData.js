export const demoData = {
    metadata: {
        name: "foundation_role_vertical_explicit",
        nodeType: "foundation",
        features: ["Role display mode", "Vertical orientation", "Explicit children"],
        description: "FoundationNode with role display mode, vertical orientation, and explicit children",
        version: "1.0.0"
    },
    settings: { showGhostlines: false, demoMode: true, enableTesting: true },
    nodes: [{
        id: "foundation-explicit-role-v",
        label: "Role Vertical Foundation",
        type: "foundation",
        layout: { mode: "auto", displayMode: "role", orientation: "vertical" },
        status: "active",
        children: [
            { id: "raw-role-v", label: "raw vertical", type: "Node", role: "raw", category: "raw", width: 60, height: 32, state: "Active" },
            { id: "base-role-v", label: "base vertical", type: "Node", role: "base", category: "base", width: 60, height: 32, state: "Ready" }
        ]
    }],
    edges: []
};


