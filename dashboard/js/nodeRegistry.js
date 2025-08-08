// Node Registry for managing node type registration and creation
const nodeTypes = new Map();

export function registerNodeType(type, constructor) {
  nodeTypes.set(type.toLowerCase(), constructor);
}

export function createNode(nodeData, container, settings, parentNode = null) {
  const nodeType = nodeData.type.toLowerCase();
  console.log("Creating node with type:", nodeType);
  console.log("Available node types:", Array.from(nodeTypes.keys()));
  
  const NodeConstructor = nodeTypes.get(nodeType);
  
  if (!NodeConstructor) {
    console.error(`Unknown node type "${nodeData.type}"`);
    console.error("Available node types:", Array.from(nodeTypes.keys()));
    return null;
  }
  
  console.log("Found constructor for node type:", nodeType);
  return new NodeConstructor(nodeData, container, createNode, settings, parentNode);
}

export function getRegisteredNodeTypes() {
  return Array.from(nodeTypes.keys());
}

export function isNodeTypeRegistered(type) {
  return nodeTypes.has(type.toLowerCase());
} 