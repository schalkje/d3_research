import { createNode, createNodes } from './node.js'
import { createMarkers } from './markers.js'
import { createEdges } from './edge.js'

export function createDashboard(dashboard, container) {

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
