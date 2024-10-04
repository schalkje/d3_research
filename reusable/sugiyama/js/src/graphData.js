export function initializeGraphData(graphData) {
  // Ensure each node has an id
  graphData.nodes.forEach((node, index) => {
    node.id = node.id || index; // Assign an ID if not present
    node.width = node.width || 150; // Default width if not present
    node.height = node.height || 40; // Default height if not present
    node.children = []; // Initialize children array
    node.childrenIds = []; // Initialize children array
    node.parents = []; // Initialize parents array
  });

  // Build the children and parents relationships
  graphData.edges.forEach((edge) => {
    // link up edges
    edge.sourceNode = edge.source || 0;
    edge.targetNode = edge.target || 0;

    const sourceNode = graphData.nodes.find((n) => n.id === edge.sourceNode);
    const targetNode = graphData.nodes.find((n) => n.id === edge.targetNode);

    // link up nodes
    if (sourceNode && targetNode) {
      // Add the target node to the source node's children
      sourceNode.children.push(targetNode);
      sourceNode.childrenIds.push(targetNode.id);
      // Add the source node to the target node's parents
      targetNode.parents.push(sourceNode);
    } else {
      console.warn("Edge refers to non-existent node:", edge);
    }
  });
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



export async function fetchFileToDag(selectedFile) {
    const graphData = await d3.json(`data/${selectedFile}`);
    initializeGraphData(graphData);
    console.log(graphData);

    // const maxNodeHeight = Math.max(...graphData.nodes.map(node => node.height));
    // const maxNodeWidth = Math.max(...graphData.nodes.map(node => node.width));
    // console.log("maxHeight", maxNodeHeight, maxNodeWidth);

    const stratifyData = convertToStratifyData(graphData);
    const stratify = d3.graphStratify();
    const dag = stratify(stratifyData);

    return { dag };
}
