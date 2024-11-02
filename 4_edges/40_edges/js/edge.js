import BaseEdge from "./edgeBase.js";

export function createEdges(rootNode, edges, container) {
  console.log("Creating Edges:", rootNode, edges);
  edges.forEach((edgeData) => {
    // find source in rootNode hierarchy
    const source = rootNode.findNode(edgeData.source);
    if (!source) {
      console.error(`Source node ${edgeData.source} not found`);
      return;
    }

    // find target
    const target = rootNode.findNode(edgeData.target);
    if (!target) {
      console.error(`Target node ${edgeData.target} not found`);
      return;
    }

    // Find the joint parent container node and add edge to it
    const parent = source.findJointParentContainer(target);

    // console.log("Creating Edge:", edgeData, source, target);
    // create edge
    const edge = new BaseEdge(edgeData, parent, source, target);

    // add edge to source and target
    source.edges.outgoing.push(edge);
    target.edges.incoming.push(edge);

    // add edge to parent, for continued layout adjustments
    parent.childEdges.push(edge);
  });
  console.log("Edges created");

  rootNode.renderEdges();
}