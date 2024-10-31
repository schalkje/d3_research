import { createNode } from './node.js'

export function createDashboard(dashboard, container) {
    if ( dashboard.nodes.length == 1 )
        createNode(dashboard.nodes[0], container);
}
