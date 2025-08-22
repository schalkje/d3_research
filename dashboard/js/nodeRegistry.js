// Node Registry for managing node type registration and creation
const nodeTypes = new Map();

export function registerNodeType(type, constructor) {
  nodeTypes.set(type.toLowerCase(), constructor);
}

export function createNode(nodeData, container, settings, parentNode = null) {
  const nodeType = nodeData.type.toLowerCase();
  
  const NodeConstructor = nodeTypes.get(nodeType);
  
  if (!NodeConstructor) {
    console.error(`Unknown node type "${nodeData.type}"`);
    console.error("Available node types:", Array.from(nodeTypes.keys()));
    return null;
  }
  
  // Check if this is a container node (needs createNode parameter) or simple node
  // Container nodes: group, lane, columns, adapter, foundation, mart, edge-demo
  const containerNodeTypes = ['group', 'lane', 'columns', 'adapter', 'foundation', 'mart', 'edge-demo'];
  const isContainerNode = containerNodeTypes.includes(nodeType);
  
  if (isContainerNode) {
    // Container nodes expect: (nodeData, parentElement, createNode, settings, parentNode)
    return new NodeConstructor(nodeData, container, createNode, settings, parentNode);
  } else {
    // Simple nodes expect: (nodeData, parentElement, settings, parentNode)
    return new NodeConstructor(nodeData, container, settings, parentNode);
  }
}

export function getRegisteredNodeTypes() {
  return Array.from(nodeTypes.keys());
}

export function isNodeTypeRegistered(type) {
  return nodeTypes.has(type.toLowerCase());
} 