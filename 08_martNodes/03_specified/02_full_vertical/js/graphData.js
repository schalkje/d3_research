export const demoData = {
    metadata: {
        name: "mart_full_vertical_explicit",
        nodeType: "mart",
        features: ["Full display mode", "Vertical orientation", "Explicit children"],
        description: "MartNode with vertical orientation and explicit children",
        version: "1.0.0"
    },
    settings: {
        showGhostlines: false,
        demoMode: true,
        enableTesting: true
    },
    nodes: [{
        id: "mart-explicit-full-v",
        label: "Vertical Mart",
        type: "mart",
        layout: { mode: "auto", displayMode: "full", orientation: "vertical" },
        status: "active",
        children: [
            {
                id: "load-node-v",
                label: "MART.LOAD_BATCH",
                type: "Node",
                role: "load",
                category: "Load",
                state: "Batching",
                batchType: "incremental"
            },
            {
                id: "report-node-v", 
                label: "MART.REPORT_ANALYTICS",
                type: "Node",
                role: "report",
                category: "Report",
                state: "Analyzing",
                reportType: "analytical"
            }
        ]
    }],
    edges: []
};
