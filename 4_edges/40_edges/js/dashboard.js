import { createNode, createNodes } from './node.js'
import { createMarkers } from './markers.js'
import { createEdges, initializeEdgeData } from './edge.js'

export function createDashboard(dashboard, container) {
    initializeEdgeData(dashboard.nodes, dashboard.edges);

    createMarkers(container);

    var root;
    if ( dashboard.nodes.length == 1 )
        root = createNode(dashboard.nodes[0], container);
    else {
        root = createNodes(dashboard.nodes, container);
    }

    if ( dashboard.edges.length > 0 )
        createEdges(root, dashboard.edges, container);
}
