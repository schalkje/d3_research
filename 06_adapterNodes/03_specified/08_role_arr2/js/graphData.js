export const demoData = {
    metadata: {
        name: "role_arrangement2_explicit",
        nodeType: "adapter",
        features: ["Role display mode", "Arrangement 2", "Transform-focused"],
        description: "Role display with arrangement 2 (transform-focused)",
        version: "1.0.0"
    },
    settings: { demoMode: true, enableTesting: true },
    nodes: [{
        id: "adapter-explicit-role-arr2",
        label: "Transform-Focused Roles",
        type: "adapter",
        layout: { mode: "full", arrangement: 2, displayMode: "role" },
        status: "active",
        children: [
            { id: "staging-role-2", label: "Staging", role: "staging", state: "Active" },
            { id: "archive-role-2", label: "Archive", role: "archive", state: "Ready" },
            { id: "transform-role-2", label: "Transform", role: "transform", state: "Processing" }
        ]
    }],
    edges: [
        { id: "edge-role-2-st", source: "staging-role-2", target: "transform-role-2", type: "dataflow" },
        { id: "edge-role-2-ta", source: "transform-role-2", target: "archive-role-2", type: "dataflow" }
    ]
};
