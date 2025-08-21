import { registerNodeType, createNode as createNodeFromRegistry } from "./nodeRegistry.js";
import AdapterNode from "./nodeAdapter.js";
import GroupNode from "./nodeGroup.js";
import FoundationNode from "./nodeFoundation.js";
import MartNode from "./nodeMart.js";
import LaneNode from "./nodeLane.js";
import ColumnsNode from "./nodeColumns.js";
import RectangularNode from "./nodeRect.js";
import CircleNode from "./nodeCircle.js";
import EdgeDemoNode from "./nodeEdgeDemo.js";

registerNodeType('group', GroupNode);
registerNodeType('lane', LaneNode);
registerNodeType('columns', ColumnsNode);
registerNodeType('adapter', AdapterNode);
registerNodeType('foundation', FoundationNode);
registerNodeType('mart', MartNode);
registerNodeType('node', RectangularNode);
registerNodeType('circle', CircleNode);
registerNodeType('rect', RectangularNode);
registerNodeType('edge-demo', EdgeDemoNode);

export function createNode(nodeData, container, settings, parentNode = null) {
  return createNodeFromRegistry(nodeData, container, settings, parentNode);
}

export function createNodes(nodes, container, settings) {
  const root = {
    id: "root",
    label: "Automatic root",
    type: "lane",
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