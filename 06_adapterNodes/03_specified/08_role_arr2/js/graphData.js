export const demoData = {
    metadata: {
        name: "role_arrangement2_explicit",
        nodeType: "adapter",
        features: ["Role display mode", "Arrangement 2", "Transform-focused"],
        description: "Role display with arrangement 2 (transform-focused)",
        version: "1.0.0"
    },
    settings: {
        showCenterMark: false,
        showGrid: false,
        showGroupLabels: true,
        showGroupTitles: true,
        showGhostlines: false,
        curved: false,
        showConnectionPoints: false,
        demoMode: true,
        enableTesting: true,
        debugMode: false
    },
    nodes: [{
        id: "adapter-explicit-role-arr2",
        label: "Transform-Focused Roles",
        type: "adapter",
        layout: { mode: "full", arrangement: 2, displayMode: "role" },
        status: "active",
        children: [
            { id: "staging-role-2", label: "staging", type: "Node", role: "staging", category: "staging", width: 80, height: 44, state: "Active" },
            { id: "archive-role-2", label: "archive", type: "Node", role: "archive", category: "archive", width: 80, height: 44, state: "Ready" },
            { id: "transform-role-2", label: "transform", type: "Node", role: "transform", category: "transform", width: 80, height: 44, state: "Processing" }
        ]
    }],
    edges: []
};
