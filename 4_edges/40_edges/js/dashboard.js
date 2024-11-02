import { createNode } from './node.js'
import { createMarkers } from './markers.js'
import { createEdges, initializeEdgeData } from './edge.js'

export function createDashboard(dashboard, container) {
    initializeEdgeData(dashboard.nodes, dashboard.edges);

    createMarkers(container);

    if ( dashboard.nodes.length == 1 )
        createNode(dashboard.nodes[0], container);

    if ( dashboard.edges.length > 0 )
        createEdges(dashboard.edges, container);
}
