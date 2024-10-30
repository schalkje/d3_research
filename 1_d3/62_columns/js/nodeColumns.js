import BaseContainerNode from "./nodeBaseContainer.js";
import CircleNode from "./nodeCircle.js";
import RectangularNode from "./nodeRect.js";
import AdapterNode from "./nodeAdapter.js";
import GroupNode from "./nodeGroup.js";
import { getComputedDimensions } from "./utils.js";
import LaneNode from "./nodeLane.js";

export default class ColumnsNode extends BaseContainerNode {
  constructor(nodeData, parentElement, parentNode = null) {
    if (!nodeData.layout) nodeData.layout = {};
    if (!nodeData.layout.minimumColumnWidth) nodeData.layout.minimumColumnWidth = 50;

    super(nodeData, parentElement, parentNode);

    this.nodeSpacing = { horizontal: 20, vertical: 10 };
    // this.columns = [];
  }

  async renderChildren() {
    console.log("    Rendering Children for Group:", this.id, this.data.children);
    if (!this.data.children || this.data.children.length === 0) {
      return;
    }

    // Create an array to hold all the render promises
    const renderPromises = [];

    for (const node of this.data.children) {
      // Create the childComponent instance based on node type
      const ComponentClass = typeToComponent[node.type] || typeToComponent.default;
      const childComponent = new ComponentClass(node, this.container, this);

      console.log("Rendering Child:", childComponent);
      console.log("               :", this.data.x, this.data.y);

      this.childNodes.push(childComponent);
      // Push the render promise into the array
      renderPromises.push(childComponent.render());
    }

    // Wait for all renders to complete in parallel
    await Promise.all(renderPromises);

    this.layoutChildren();
  }

  layoutChildren() {
    console.log("layoutChildren - Layout for Columns:", this.id, this.data.layout);

    // each child is a column
    var x = 0;
    var y = 0;
    var containerWidth = 0;
    var containerHeight = 0;
    var firstColumnCenterCorrection = 0;

    this.childNodes.forEach((node, index) => {
      if ( node.data.width < this.data.layout.minimumColumnWidth) {
        // console.log(`    Column ${node.id} is smaller than minimumColumnWidth: ${node.data.width} < ${this.data.layout.minimumColumnWidth}`);
        const centerCorrection = (this.data.layout.minimumColumnWidth - node.data.width) / 2;
        // console.log(`    Column ${node.id} is smaller than minimumColumnWidth: ${node.data.width} < ${this.data.layout.minimumColumnWidth}: centerCorrection=${centerCorrection}`);
        node.element.attr("transform", `translate(${x + centerCorrection}, ${y})`);
        if (index === 0) {
          firstColumnCenterCorrection = centerCorrection;
        }
      }
      else {
        // console.log(`    Column ${node.id} is NOT smaller than minimumColumnWidth: ${node.data.width} < ${this.data.layout.minimumColumnWidth}`);
        node.element.attr("transform", `translate(${x}, ${y})`);
      }

      x += Math.max(node.data.width, this.data.layout.minimumColumnWidth) + this.nodeSpacing.horizontal;
      containerHeight = Math.max(containerHeight, node.data.height);
    });
    containerWidth = x - this.nodeSpacing.horizontal;

    this.resizeContainer({width: containerWidth, height: containerHeight});

    var containerDimensions = getComputedDimensions(this.container); console.log(`          < layoutLane after  - resizecontainer container ${this.id}, (${Math.round(containerDimensions.x)},${Math.round(containerDimensions.y)}) [${Math.round(containerDimensions.width)}x${Math.round(containerDimensions.height)}] data=[${Math.round(this.data.width)}x${Math.round(this.data.height)}]`);
    var elementDimensions = getComputedDimensions(this.element); console.log(`          < layoutLane after  - resizecontainer element   ${this.id}, (${Math.round(elementDimensions.x)},${Math.round(elementDimensions.y)}) [${Math.round(elementDimensions.width)}x${Math.round(elementDimensions.height)}] data=[${Math.round(this.data.width)}x${Math.round(this.data.height)}]`);
    const containerX = elementDimensions.x - containerDimensions.x + this.containerMargin.left + firstColumnCenterCorrection;
    var containerY = this.containerMargin.top/2;
    // console.log(`                                        containerX: ${elementDimensions.x}-${containerDimensions.x}+${this.containerMargin.left}=${containerX}`);
    // console.log(`                                        containerY: ${elementDimensions.y}-${containerDimensions.y}+${this.containerMargin.top}=${containerY}`);
    this.container
        .attr(
          "transform",
          `translate(${containerX}, ${containerY})`
        );
  }

  async arrange() {
    console.log("Arranging ColumnsNode:", this.id);
    this.layoutChildren();
  }
}



const typeToComponent = {
  group: GroupNode,
  node: RectangularNode,
  lane: LaneNode,
  columns: ColumnsNode,
  rect: RectangularNode,
  circle: CircleNode,
  adapter: AdapterNode,
  default: CircleNode,
};
