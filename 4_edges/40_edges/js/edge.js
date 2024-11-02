import BaseEdge from './edgeBase.js';

export function createEdges(edges, container) {
    edges.forEach(edgeData => {
        // find source
        const source = container.select(`#${edgeData.source}`);
        if (source.empty()) {
            console.error(`Source node ${edgeData.source} not found`);
            return;
        }

        // find target
        const target = container.select(`#${edgeData.target}`);
        if (target.empty()) {
            console.error(`Target node ${edgeData.target} not found`);
            return;
        }

        console.log("Creating Edge:", edgeData, source, target);
        // create edge
        const edge = new BaseEdge(edgeData, container, source, target);
        edge.render();
    });
    console.log("Edges created");

}

// Helper function to traverse the hierarchy and collect all nodes
// function collectAllNodes(node, allNodes = []) {
//     allNodes.push(node);
//     if (node.childNodes && node.childNodes.length > 0) {
//         node.childNodes.forEach(child => collectAllNodes(child, allNodes));
//     }
//     return allNodes;
// }
function collectAllNodes(node, allNodes = []) {
        allNodes.push(node);
        if (node.children && node.children.length > 0) {
            node.children.forEach(child => collectAllNodes(child, allNodes));
        }
        return allNodes;
    }
    
export function initializeEdgeData(nodes, edges) {
    const allNodes = nodes.reduce((acc, rootNode) => collectAllNodes(rootNode, acc), []);
    console.log("initializeEdgeData - allNodes",allNodes);

    edges.forEach(edge => {
        edge.sourceNode = allNodes.find((n) => n.id === edge.source);
        edge.targetNode = allNodes.find((n) => n.id === edge.target);

        console.log("initializeEdgeData - edge",edge, edge.sourceNode, edge.targetNode);

    //     if (edge.sourceNode && edge.targetNode) {
    //         edge.sourceNode.children.push(edge.targetNode);
    //         edge.targetNode.parents.push(edge.sourceNode);
    //       } else {
    //         console.warn("Edge refers to non-existent node:", edge);
    //       }
      
    });
}