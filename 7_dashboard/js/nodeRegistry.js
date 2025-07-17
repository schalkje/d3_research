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
    return null;
  }
  
  return new NodeConstructor(nodeData, container, createNode, settings, parentNode);
}

export function getRegisteredNodeTypes() {
  return Array.from(nodeTypes.keys());
}

export function isNodeTypeRegistered(type) {
  return nodeTypes.has(type.toLowerCase());
} 