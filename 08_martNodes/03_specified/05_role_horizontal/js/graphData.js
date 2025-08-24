export const demoData = {
    metadata: {
        name: "mart_role_horizontal_explicit",
        nodeType: "mart",
        features: ["Role display mode", "Horizontal orientation", "Explicit children"],
        description: "MartNode with role display mode and explicit children",
        version: "1.0.0"
    },
    settings: {
        showGhostlines: false,
        demoMode: true,
        enableTesting: true
    },
    nodes: [{
        id: "mart-explicit-role-h",
        label: "Role-Based Mart",
        type: "mart",
        layout: { mode: "auto", displayMode: "role", orientation: "horizontal" },
        status: "active",
        children: [
            {
                id: "load-role-h",
                label: "load",
                type: "node",
                role: "load",
                category: "load",
                width: 60,
                height: 32,
                state: "Active"
            },
            {
                id: "report-role-h", 
                label: "report",
                type: "node",
                role: "report",
                category: "report",
                width: 60,
                height: 32,
                state: "Ready"
            }
        ]
    }],
    edges: []
};
