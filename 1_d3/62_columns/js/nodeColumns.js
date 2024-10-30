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
    if (!nodeData.layout.minimumColumnWidth) nodeData.layout.minimumColumnWidth = 0;

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
      console.log("               :", this.data.x, this.data.y, this.data.width, this.data.height);
      childComponent.x = 0;
      childComponent.y = 0;

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

    // position the nodes
    this.childNodes.forEach((node, index) => {
      // add spacing between nodes
      if (index > 0 )
        x += this.nodeSpacing.horizontal;

      x += Math.max(node.data.width/2, this.data.layout.minimumColumnWidth/2);
      console.log(`    Corrected x: ${node.id}: ${x}`);

    // position the node
      // console.log(`    Column ${node.id} is NOT smaller than minimumColumnWidth: ${node.data.width} < ${this.data.layout.minimumColumnWidth}`);
      var elementCtm = node.element.node().getCTM(); console.log(`    elementCtm after resize   : a=${elementCtm.a}, b=${elementCtm.b}, c=${elementCtm.c}, d=${elementCtm.d}, e=${elementCtm.e}, f=${elementCtm.f}`);
      console.log(`    Column ${node.id}: node.data.width=${Math.round(node.data.width)} node.x=${Math.round(node.x)}, node.y=${node.y}, x=${x}, y=${y}, translate(${x-node.data.width/2}, ${y})`);
      // node.element.attr("transform", `translate(${x-node.data.width/2}, ${y})`);
      // node.x = -node.data.width/2;
      node.x = x;
      node.y = y;
      const trans = `translate(${node.x}, ${node.y})`;
      console.log(`                    --> ${trans}`);
      node.element.attr("transform", trans);
      var elementCtm = node.element.node().getCTM(); console.log(`    elementCtm after resize   : a=${elementCtm.a}, b=${elementCtm.b}, c=${elementCtm.c}, d=${elementCtm.d}, e=${elementCtm.e}, f=${elementCtm.f}`);
  

      // console.log(`    Column ${node.id} center positioned at (${Math.round(x)},${Math.round(y)})`);
      x = x + Math.max(node.data.width/2, this.data.layout.minimumColumnWidth/2);
      console.log(`                     next x=${Math.round(x)}`);
      containerHeight = Math.max(containerHeight, node.data.height);
    });


    // reposition the container
    containerWidth = x;
    

    this.resizeContainer({width: containerWidth, height: containerHeight});

    var containerDimensions = getComputedDimensions(this.container); console.log(`          < layoutLane after  - resizecontainer container ${this.id}, (${Math.round(containerDimensions.x)},${Math.round(containerDimensions.y)}) [${Math.round(containerDimensions.width)}x${Math.round(containerDimensions.height)}]`);
    var elementDimensions = getComputedDimensions(this.element); console.log(`          < layoutLane after  - resizecontainer element   ${this.id}, (${Math.round(elementDimensions.x)},${Math.round(elementDimensions.y)}) [${Math.round(elementDimensions.width)}x${Math.round(elementDimensions.height)}] data=[${Math.round(this.data.width)}x${Math.round(this.data.height)}]`);
    // const containerX = elementDimensions.x - containerDimensions.x + this.containerMargin.left + firstColumnCenterCorrection;
    const containerX = elementDimensions.x - containerDimensions.x + this.containerMargin.left + firstColumnCenterCorrection;
    var containerY = this.containerMargin.top/2;
    console.log(`                                        containerX: ${elementDimensions.x}-${containerDimensions.x}+${this.containerMargin.left}=${containerX}`);
    console.log(`                                        containerY: ${elementDimensions.y}-${containerDimensions.y}+${this.containerMargin.top}=${containerY}`);
    this.container
        .attr(
          "transform",
          `translate(${containerX}, ${containerY})`
        );
  }


  layoutChildren2() {
    console.log("layoutChildren - Layout for Columns:", this.id, this.data.layout);

    // each child is a column
    var x = 0;
    var y = 0;
    var containerWidth = 0;
    var containerHeight = 0;
    var firstColumnCenterCorrection = 0;

    // position the nodes
    this.childNodes.forEach((node, index) => {
      // add spacing between nodes
      if (index > 0 )
        x += this.nodeSpacing.horizontal;

      if ( node.data.width < this.data.layout.minimumColumnWidth) {
        // apply the minimum width and position the node in the center
        const centerCorrection = (this.data.layout.minimumColumnWidth - node.data.width) / 2;
        console.log(`    Column ${node.id} is smaller than minimumColumnWidth: ${node.data.width} < ${this.data.layout.minimumColumnWidth}: centerCorrection=${centerCorrection}`);
        node.element.attr("transform", `translate(${x + centerCorrection}, ${y})`);
        node.x = x + centerCorrection;
        node.y = y;
        if (index === 0) {
          firstColumnCenterCorrection = centerCorrection;
        }
      }
      else {
        // position the node
        // console.log(`    Column ${node.id} is NOT smaller than minimumColumnWidth: ${node.data.width} < ${this.data.layout.minimumColumnWidth}`);
        console.log(`    Column ${node.id}: node.x=${node.x}, node.y=${node.y}, x=${x}, y=${y}`);
        node.element.attr("transform", `translate(${x}, ${y})`);
        node.x = x;
        node.y = y;
      }
      console.log(`    Column ${node.id} positioned at (${x},${y})`);
      x += Math.max(node.data.width, this.data.layout.minimumColumnWidth);
      console.log(`                     next x=${x}`);
      containerHeight = Math.max(containerHeight, node.data.height);
    });


    // reposition the container
    containerWidth = x;
    

    this.resizeContainer({width: containerWidth, height: containerHeight});

    var containerDimensions = getComputedDimensions(this.container); console.log(`          < layoutLane after  - resizecontainer container ${this.id}, (${Math.round(containerDimensions.x)},${Math.round(containerDimensions.y)}) [${Math.round(containerDimensions.width)}x${Math.round(containerDimensions.height)}]`);
    var elementDimensions = getComputedDimensions(this.element); console.log(`          < layoutLane after  - resizecontainer element   ${this.id}, (${Math.round(elementDimensions.x)},${Math.round(elementDimensions.y)}) [${Math.round(elementDimensions.width)}x${Math.round(elementDimensions.height)}] data=[${Math.round(this.data.width)}x${Math.round(this.data.height)}]`);
    // const containerX = elementDimensions.x - containerDimensions.x + this.containerMargin.left + firstColumnCenterCorrection;
    const containerX = elementDimensions.x - containerDimensions.x + this.containerMargin.left + firstColumnCenterCorrection;
    var containerY = this.containerMargin.top/2;
    console.log(`                                        containerX: ${elementDimensions.x}-${containerDimensions.x}+${this.containerMargin.left}=${containerX}`);
    console.log(`                                        containerY: ${elementDimensions.y}-${containerDimensions.y}+${this.containerMargin.top}=${containerY}`);
    // this.container
    //     .attr(
    //       "transform",
    //       `translate(${containerX}, ${containerY})`
    //     );
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
