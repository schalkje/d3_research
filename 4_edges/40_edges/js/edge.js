import BaseEdge from "./edgeBase.js";

export function createInternalEdge(edgeData, parent, source, target, settings)
{
    // create edge
    const edge = new BaseEdge(edgeData, parent, source, target, settings);

    // add edge to source and target
    source.edges.outgoing.push(edge);
    target.edges.incoming.push(edge);

    // add edge to parent, for continued layout adjustments
    parent.childEdges.push(edge);
}

export function createEdge(rootNode, edgeData, settings)
{
    console.log("Creating Edge:", edgeData, rootNode, settings);
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

    console.log("Creating Edge:", edgeData, source, target);
    console.log("       Settings:", settings);
    console.log("       Parent:", parent);

        // console.log("Creating Edge:", edgeData, source, target);
    // create edge
    const edge = new BaseEdge(edgeData, parent, source, target, settings);

    // add edge to source and target
    source.edges.outgoing.push(edge);
    target.edges.incoming.push(edge);

    // add edge to parent, for continued layout adjustments
    parent.childEdges.push(edge);
}


export function createEdges(rootNode, edges, settings) {
  console.log("Creating Edges:", rootNode, edges, settings);
  edges.forEach((edgeData) => {
    createEdge(rootNode, edgeData, settings);
  });
  console.log("Edges created");

  rootNode.renderEdges();
}