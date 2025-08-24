export const demoData = {
    metadata: {
        name: "foundation_role_horizontal_explicit",
        nodeType: "foundation",
        features: ["Role display mode", "Horizontal orientation", "Explicit children"],
        description: "FoundationNode with role display mode and explicit children",
        version: "1.0.0"
    },
    settings: {
        showGhostlines: false,
        demoMode: true,
        enableTesting: true
    },
    nodes: [{
        id: "foundation-explicit-role-h",
        label: "Role-Based Foundation",
        type: "foundation",
        layout: { mode: "auto", displayMode: "role", orientation: "horizontal" },
        status: "active",
        children: [
            {
                id: "raw-role-h",
                label: "raw horizontal",
                type: "node",
                role: "raw",
                category: "raw",
                width: 60,
                height: 32,
                state: "Active"
            },
            {
                id: "base-role-h", 
                label: "base horizontal",
                type: "node",
                role: "base",
                category: "base",
                width: 60,
                height: 32,
                state: "Ready"
            }
        ]
    }],
    edges: []
};
