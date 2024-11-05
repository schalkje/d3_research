import AdapterNode from "./nodeAdapter.js";
import GroupNode from "./nodeGroup.js";
import FoundationNode from "./nodeFoundation.js";
import LaneNode from "./nodeLane.js";
import ColumnsNode from "./nodeColumns.js";
import RectangularNode from "./nodeRect.js";
import CircleNode from "./nodeCircle.js";
import EdgeDemoNode from "./nodeEdgeDemo.js";


// Function to create nodes with positioning and drag behavior
export function createNode(nodeData, container, settings, parentNode = null) {
  console.log("Creating Node:", nodeData, settings, parentNode);
  var node = null;
  switch (nodeData.type) {
    case "group":
      node = new GroupNode(nodeData, container, createNode, settings, parentNode);
      break;

    case "lane":
      node = new LaneNode(nodeData, container, createNode, settings, parentNode);
      break;

    case "columns":
      node = new ColumnsNode(nodeData, container, createNode, settings, parentNode);
      break;

    case "adapter":
      node = new AdapterNode(nodeData, container, createNode, settings, parentNode);
      break;

    case "foundation":
      node = new FoundationNode(nodeData, container, createNode, settings, parentNode);
      break;

    case "node":
      node = new RectangularNode(nodeData, container, settings, parentNode);
      break;

    case "circle":
      node = new CircleNode(nodeData, container, settings, parentNode);
      break;

    case "rect":
      node = new RectangularNode(nodeData, container, settings, parentNode);
      break;

    case "edge-demo":
      node = new EdgeDemoNode(nodeData, container, createNode, settings, parentNode);
      break;

    default:
      console.error(`Unknown node type "${nodeData.type}" !!!!!`);
      return null;
  }
  
  return node;
}

export function createNodes(nodes, container, settings) {
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

  var rootNode = createNode(root, container, settings);

  return rootNode;
}