import BaseEdge from "./edgeBase.js";

export function createInternalEdge(edgeData, source, target, settings)
{
    console.log("Creating Internal Edge:", edgeData, source, target);
    
    console.log("       Settings:", settings);

    // Find the joint parent container node and build the parent list for both source and target
    const parents = buildEdgeParents(source, target);

    console.log("       Parents:", parents);

    const parent = parents.container;

        // console.log("Creating Edge:", edgeData, source, target);
    // create edge
    const edge = new BaseEdge(edgeData, parents, settings);

    // add edge to source and target
    source.edges.outgoing.push(edge);
    target.edges.incoming.push(edge);

    // add edge to parent, for continued layout adjustments
    parent.childEdges.push(edge);

}

// this function returns an object with the following structure:
// parents: {
//   source: [], // list of parent nodes for source, where element 0 is the direct parent, the last element is the element before the container
//   target: [], // list of parent nodes for target, where element 0 is the direct parent, the last element is the element before the container
//   container: null // the joint parent container node for source and target
// }
export function buildEdgeParents(sourceNode, targetNode) {
  console.log("Building Edge Parents", sourceNode.data.label, targetNode.data.label);

  // Get parent nodes for source and target
  const sourceParents = [sourceNode, ...sourceNode.getParents()];
  const targetParents = [targetNode, ...targetNode.getParents()];

  console.log("   Source Parents:", sourceParents);
  console.log("   Target Parents:", targetParents);

  let container = null;

  // Use a Set for efficient lookup and determine the container
  const targetParentSet = new Set(targetParents);
  for (let i = 0; i < sourceParents.length; i++) {
    if (targetParentSet.has(sourceParents[i])) {
      container = sourceParents[i];
      break;
    }
  }

  // Prune the source and target parent arrays up to the container
  const prunedSourceParents = sourceParents.slice(0, sourceParents.indexOf(container));
  const prunedTargetParents = targetParents.slice(0, targetParents.indexOf(container));

  console.log("   Pruned Source Parents:", prunedSourceParents);
  console.log("   Pruned Target Parents:", prunedTargetParents);

  return {
    source: prunedSourceParents,
    target: prunedTargetParents,
    container: container
  };
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

    createInternalEdge(edgeData, source, target, settings)
}


export function createEdges(rootNode, edges, settings) {
  console.log("Creating Edges:", rootNode, edges, settings);
  edges.forEach((edgeData) => {
    createEdge(rootNode, edgeData, settings);
  });
  console.log("Edges created");

  rootNode.renderEdges();
}