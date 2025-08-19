export const demoData = {
    metadata: {
        name: "role_arrangement3_explicit",
        nodeType: "adapter",
        features: ["Role display mode", "Arrangement 3", "Staging-focused"],
        description: "Role display with arrangement 3 (staging-focused)",
        version: "1.0.0"
    },
    settings: { demoMode: true, enableTesting: true },
    nodes: [{
        id: "adapter-explicit-role-arr3",
        label: "Staging-Focused Roles",
        type: "adapter",
        layout: { mode: "full", arrangement: 3, displayMode: "role" },
        status: "active",
        children: [
            { id: "staging-role-3", label: "Staging", role: "staging", state: "Ingesting" },
            { id: "archive-role-3", label: "Archive", role: "archive", state: "Storing" },
            { id: "transform-role-3", label: "Transform", role: "transform", state: "Cleaning" }
        ]
    }],
    edges: [
        { id: "edge-role-3-sa", source: "staging-role-3", target: "archive-role-3", type: "dataflow" },
        { id: "edge-role-3-st", source: "staging-role-3", target: "transform-role-3", type: "dataflow" }
    ]
};
