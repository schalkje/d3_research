export const demoData = {
    metadata: {
        name: "role_arrangement3_explicit",
        nodeType: "adapter",
        features: ["Role display mode", "Arrangement 3", "Staging-focused"],
        description: "Role display with arrangement 3 (staging-focused)",
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
        id: "adapter-explicit-role-arr3",
        label: "Staging-Focused Roles",
        type: "adapter",
        layout: { mode: "full", arrangement: 3, displayMode: "role" },
        status: "active",
        children: [
            { id: "staging-role-3", label: "staging", type: "Node", role: "staging", category: "staging", width: 80, height: 44, state: "Ingesting" },
            { id: "archive-role-3", label: "archive", type: "Node", role: "archive", category: "archive", width: 80, height: 44, state: "Storing" },
            { id: "transform-role-3", label: "transform", type: "Node", role: "transform", category: "transform", width: 80, height: 44, state: "Cleaning" }
        ]
    }],
    edges: []
};
