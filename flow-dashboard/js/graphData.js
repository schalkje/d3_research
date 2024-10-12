export function initializeGraphData(graphData) { 
  // Ensure each node has an id
  graphData.nodes.forEach((node, index) => {
    node.id = node.id || index; // Assign an ID if not present
    node.width = node.width || 150; // Default width if not present
    node.height = node.height || 40; // Default height if not present
    node.childrenIds = []; // Use only IDs to track children to avoid circular references
    node.parentsIds = []; // Use only IDs to track parents to avoid circular references
  });

  // Build the children and parents relationships
  graphData.edges.forEach((edge) => {
    // link up edges
    const sourceNode = graphData.nodes.find((n) => n.id === edge.source);
    const targetNode = graphData.nodes.find((n) => n.id === edge.target);

    if (sourceNode && targetNode) {
      // Add the target node ID to the source node's children IDs
      sourceNode.childrenIds.push(targetNode.id);
      // Add the source node ID to the target node's parents IDs
      targetNode.parentsIds.push(sourceNode.id);

      // Ensure edges have valid node references for source and target
      edge.source = sourceNode;
      edge.target = targetNode;
    } else {
      console.warn("Edge refers to non-existent node:", edge);
    }
  });

  return graphData; // Return updated graphData to keep the function's behavior clear
}

// Convert graphData to the structure required by d3.dagStratify
export function convertToStratifyData(graphData) {
  const nodesMap = new Map(
    graphData.nodes.map((node) => [node.id, { ...node, parentIds: [] }])
  );

  graphData.edges.forEach((edge) => {
    const targetNode = nodesMap.get(edge.targetNode);
    if (targetNode) {
      targetNode.parentIds.push(edge.sourceNode);
    }
  });

  return Array.from(nodesMap.values());
}

export function stratefyData(graphData)
{
  console.log("stratefyData - graphData",graphData)
  initializeGraphData(graphData);
  console.log("stratefyData - after initializeGraphData",graphData)
  const stratifyData = convertToStratifyData(graphData);
  console.log("             - stratefyData",stratifyData)
  const stratify = d3.graphStratify();
  const dag = stratify(stratifyData);

  return dag;
}


export async function fetchFileToDag(selectedFile) {
    const graphData = await d3.json(`data/${selectedFile}`);

    return stratefyData(graphData);
}
