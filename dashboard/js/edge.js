import BaseEdge from "./edgeBase.js";
import BaseContainerNode from "./nodeBaseContainer.js";

export function createInternalEdge(edgeData, source, target, settings)
{
    if ( source === target) {
      console.error("createInternalEdge - Source and Target are the same node", source);
      return;
    }
    // console.log("Creating Internal Edge:", edgeData, source, target);
    // console.log(`  Creating Internal Edge: ${source.data.label} -> ${target.data.label}`);
    
    // console.log("       Settings:", settings);

    // Find the joint parent container node and build the parent list for both source and target
    const parents = buildEdgeParents(source, target);

    // console.log("       Parents:", parents);

    const parent = parents.container;
    
    // Defensive check: ensure we have a valid parent container
    if (!parent) {
      console.error("createInternalEdge: No common parent container found for edge", {
        source: source.data.label,
        target: target.data.label,
        sourceParents: parents.source?.map(p => p.data?.label || p.id) || [],
        targetParents: parents.target?.map(p => p.data?.label || p.id) || []
      });
      return;
    }
    
    if (!parent.childEdges) {
      console.error("createInternalEdge: Parent container does not have childEdges array", {
        parent: parent,
        parentType: parent.constructor?.name,
        parentId: parent.id
      });
      return;
    }

    // check if edge already exists (no two edges between the same nodes)
    if (source.edges.outgoing.find((edge) => edge.target === target)) {
      // console.log(`Edge from ${source.data.label} to ${target.data.label} already exists, no need to define explicitly.`);
      return;
    }

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
  // console.log("Building Edge Parents", sourceNode.data.label, targetNode.data.label);

  // Get parent nodes for source and target
  const sourceParents = [sourceNode, ...sourceNode.getParents()];
  const targetParents = [targetNode, ...targetNode.getParents()];

  // console.log("   Source Parents:", sourceParents);
  // console.log("   Target Parents:", targetParents);

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

  // console.log("   Pruned Source Parents:", prunedSourceParents);
  // console.log("   Pruned Target Parents:", prunedTargetParents);

  return {
    source: prunedSourceParents,
    target: prunedTargetParents,
    container: container
  };
}



export function createEdge(rootNode, edgeData, settings)
{
    // console.log("Creating Edge:", edgeData, rootNode, settings);
    var sourceId = typeof edgeData.source === 'string' ? edgeData.source : edgeData.source.id;
    var targetId = typeof edgeData.target === 'string' ? edgeData.target : edgeData.target.id;

    const source = rootNode.getNode(sourceId);
    if (!source) {
      console.error(`   Creating Edge - Source node ${sourceId} not found`,edgeData);
      return;
    }

    // find target
    const target = rootNode.getNode(targetId);
    if (!target) {
      console.error(`   Creating Edge - Target node ${targetId} not found`);
      return;
    }
    // console.log(`   Creating Edge: ${source.data.label} -> ${target.data.label}`, edgeData);

    createInternalEdge(edgeData, source, target, settings)
}


export  function createEdges(rootNode, edges, settings) {
  // console.info("---------------------------------------------------------------------------------------------------------------------");
  // console.info("Creating Edges:", rootNode, edges, settings);
  edges.forEach((edgeData) => {
    createEdge(rootNode, edgeData, settings);
  });
  // console.log("Edges created");

   rootNode.initEdges(true);
}