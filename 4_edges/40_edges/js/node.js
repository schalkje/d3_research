import AdapterNode from "./nodeAdapter.js";
import GroupNode from "./nodeGroup.js";
import FoundationNode from "./nodeFoundation.js";
import LaneNode from "./nodeLane.js";
import ColumnsNode from "./nodeColumns.js";

// Function to create nodes with positioning and drag behavior
export function createNode(node, container) {
  // console.log("Creating Node:", node);
  switch (node.type) {
    case "group":
      const groupRootNode = new GroupNode(node, container);
      groupRootNode.render();
      break;

    case "lane":
      const laneRootNode = new LaneNode(node, container);
      laneRootNode.render();
      break;

    case "columns":
      const columnsRootNode = new ColumnsNode(node, container);
      columnsRootNode.render();
      break;

    case "adapter":
      const adapterRootNode = new AdapterNode(node, container);
      adapterRootNode.render();
      break;

    case "foundation":
      const foundationRootNode = new FoundationNode(node, container);
      foundationRootNode.render();
      break;

    default:
      console.log(`Unknown node type "${node.type}" !!!!!`);
  }
}
