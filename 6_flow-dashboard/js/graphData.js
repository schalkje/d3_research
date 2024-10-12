export function initializeGraphData(graphData) { 
  // Ensure each node has an id
  graphData.nodes.forEach((node, index) => {
    node.id = node.id || index; // Assign an ID if not present
    node.width = node.width || 150; // Default width if not present
    node.height = node.height || 40; // Default height if not present
    node.children = []; // Initialize children array
    node.childrenIds = []; // Initialize children array
    node.parents = []; // Initialize parents array
    node.parentsIds = []; // Use only IDs to track parents to avoid circular references
  });

  // Build the children and parents relationships
  graphData.edges.forEach((edge) => {
    // link up edges
    edge.sourceNode = edge.source || 0;
    edge.targetNode = edge.target || 0;

    const sourceNode = graphData.nodes.find((n) => n.id === edge.sourceNode);
    const targetNode = graphData.nodes.find((n) => n.id === edge.targetNode);

    if (sourceNode && targetNode) {
      sourceNode.children.push(targetNode);
      sourceNode.childrenIds.push(targetNode.id);
      targetNode.parents.push(sourceNode);
      targetNode.parentsIds.push(sourceNode.id);
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
    console.log("convertToStratifyData - edge",edge)
    const targetNode = nodesMap.get(edge.target);
    if (targetNode) {
      targetNode.parentIds.push(edge.source);
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
