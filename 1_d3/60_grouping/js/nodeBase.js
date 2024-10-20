import { getComputedDimensions } from "./utils.js";
export default class BaseNode {
  constructor(nodeData, metadata, parentElement) {
    this.id = nodeData.id;
    this.parentElement = parentElement;
    this.element = null;
    this.metadata = metadata;
    this.data = nodeData;

    this.interactionState = metadata.nodes[this.id]?.interactionState || { expanded: false };
    nodeData.interactionState = this.interactionState;

    // Set default values for x, y, width, and height
    if ( !this.data.x) this.data.x = 100;
    if ( !this.data.y) this.data.y = 100;
    if ( !this.data.width) this.data.width = 60;
    if ( !this.data.height) this.data.height = 60;
  }

  renderContainer() {
    this.element = this.parentElement
      .append("g")
      .attr("x", this.data.x)
      .attr("y", this.data.y)
      .attr("width", this.data.width)
      .attr("height", this.data.height)
      .attr("class", "node")
      .attr("data-id", this.id)
      .on("click", () => this.toggleExpandCollapse(this.element));

    // Set expanded or collapsed state
    if (this.interactionState.expanded) {
      this.element.classed("expanded", true);
    } else {
      this.element.classed("collapsed", true);
    }

    return this.element;
  }

  render(renderChildren = true){
    renderContainer();
  }

  resize(boundingBox) {
    console.log('Resizing base.node', this.id, boundingBox);
    const computedDimension = getComputedDimensions(this.element);
    // console.log('                   computed dimension ',computedDimension);
    console.log(`                   comparison  ${Math.round(boundingBox.width)} =?= ${Math.round(computedDimension.width)},  ${Math.round(boundingBox.height)} =?= ${Math.round(computedDimension.height)}`);
    this.data.x = boundingBox.x;
    this.data.y = boundingBox.y;
    // this.data.width = computedDimension.width; //boundingBox.width;
    // this.data.height = computedDimension.height; //boundingBox.height;
    this.data.width = boundingBox.width;
    this.data.height = boundingBox.height;

    this.element
      .attr('x', this.data.x)
      .attr('y', this.data.y)
      .attr('width', this.data.width)
      .attr('height', this.data.height);
    }


  // Method to toggle expansion/collapse of the node
  toggleExpandCollapse(container) {
    this.interactionState.expanded = !this.interactionState.expanded;
    this.updateRender(container);
  }

  // Method to update the node rendering based on interaction state
  updateRender(container) {
    if (this.interactionState.expanded) {
      container.classed("collapsed", false).classed("expanded", true);
    } else {
      container.classed("expanded", false).classed("collapsed", true);
    }
  }

  getConnectionPoint() {

  }
}



