import AdapterNode from "./nodeAdapter.js";
import GroupNode from "./nodeGroup.js";
import FoundationNode from "./nodeFoundation.js";
import LaneNode from "./nodeLane.js";
import ColumnsNode from "./nodeColumns.js";
import RectangularNode from "./nodeRect.js";
import CircleNode from "./nodeCircle.js";


const typeToComponent = {
  group: GroupNode,
  node: RectangularNode,
  rect: RectangularNode,
  circle: CircleNode,
  adapter: AdapterNode,
  foundation: FoundationNode,
  lane: LaneNode,
  default: CircleNode,
};

// Function to create nodes with positioning and drag behavior
export function createNode(nodeData, container) {
  // console.log("Creating Node:", nodeData);
  var node = null;
  switch (nodeData.type) {
    case "group":
      node = new GroupNode(nodeData, container, typeToComponent);
      break;

    case "lane":
      node = new LaneNode(nodeData, container, typeToComponent);
      break;

    case "columns":
      node = new ColumnsNode(nodeData, container, typeToComponent);
      break;

    case "adapter":
      node = new AdapterNode(nodeData, container, typeToComponent);
      break;

    case "foundation":
      node = new FoundationNode(nodeData, container, typeToComponent);
      break;

    default:
      console.log(`Unknown node type "${nodeData.type}" !!!!!`);
      return null;
  }
  
  node.render();
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

  return createNode(root, container);
}