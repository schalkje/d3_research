export function makeData(cfg) {
    return {
        settings: {
            showCenterMark: false,
            showGrid: true,
            showGroupLabels: true,
            showGroupTitles: true,
            showGhostlines: !!cfg.ghost,
            showEdges: true,
            curved: !!cfg.curved,
            curveMargin: cfg.curved ? 0.1 : 0,
            showConnectionPoints: false
        },
        nodes: [
            {
                id: 'edge-demo-1',
                type: 'edge-demo',
                label: 'Edge Demo',
                x: 0,
                y: 0,
                width: 334,
                height: 74,
                layout: { type: cfg.layout || 'grid' }
            }
        ],
        edges: []
    };
}


