import AdapterNode from "./nodeAdapter.js";
import GroupNode from "./nodeGroup.js";
import FoundationNode from "./nodeFoundation.js";
import LaneNode from "./nodeLane.js";
import ColumnsNode from "./nodeColumns.js";
import RectangularNode from "./nodeRect.js";
import CircleNode from "./nodeCircle.js";


// Function to create nodes with positioning and drag behavior
export function createNode(nodeData, container, parentNode = null) {
  console.log("Creating Node:", nodeData);
  var node = null;
  switch (nodeData.type) {
    case "group":
      node = new GroupNode(nodeData, container, createNode, parentNode);
      break;

    case "lane":
      node = new LaneNode(nodeData, container, createNode, parentNode);
      break;

    case "columns":
      node = new ColumnsNode(nodeData, container, createNode, parentNode);
      break;

    case "adapter":
      node = new AdapterNode(nodeData, container, createNode, parentNode);
      break;

    case "foundation":
      node = new FoundationNode(nodeData, container, createNode, parentNode);
      break;

    case "node":
      node = new RectangularNode(nodeData, container, parentNode);
      break;

    case "circle":
      node = new CircleNode(nodeData, container, parentNode);
      break;

    case "rect":
      node = new RectangularNode(nodeData, container, parentNode);
      break;

    default:
      console.error(`Unknown node type "${nodeData.type}" !!!!!`);
      return null;
  }
  
  return node;
}

export function createNodes(nodes, container) {
  // create a group node as the container for all nodes
  const root = {
    id: "root",
    label: "Automatic root",
    type: "group",
    groupType: "dynamic",
    layout: {
      size: { width: 1000, height: 1000 },
      display: "content",
    },
    children: nodes,
  }

  var rootNode = createNode(root, container);

  return rootNode;
}