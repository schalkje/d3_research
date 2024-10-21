import { getComputedDimensions } from "./utils.js";
export default class BaseNode {
  constructor(nodeData, parentElement, parentNode = null) {
    this.id = nodeData.id;
    this.parentElement = parentElement;
    this.parentNode = parentNode;
    this.element = null;
    this.data = nodeData;

    if (!this.data.interactionState) this.data.interactionState = { expanded: true };

    // Set default values for x, y, width, and height
    if (!this.data.x) this.data.x = 100;
    if (!this.data.y) this.data.y = 100;
    if (!this.data.width) this.data.width = 60;
    if (!this.data.height) this.data.height = 60;
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
      .on("click", (event) => { 
        event.stopPropagation();
        this.toggleExpandCollapse(this.element); 
      });

    // Set expanded or collapsed state
    if (this.data.interactionState.expanded) {
      this.element.classed("expanded", true);
    } else {
      this.element.classed("collapsed", true);
    }

    return this.element;
  }

  render(renderChildren = true) {
    renderContainer();
  }

  resize(boundingBox) {
    this.data.x = boundingBox.x;
    this.data.y = boundingBox.y;
    this.data.width = boundingBox.width;
    this.data.height = boundingBox.height;
  }

  // Method to toggle expansion/collapse of the node
  toggleExpandCollapse(container) {
    this.data.interactionState.expanded = !this.data.interactionState.expanded;
    this.updateRender(container);
  }

  // Method to update the node rendering based on interaction state
  updateRender(container) {
    if (this.data.interactionState.expanded) {
      container.classed("collapsed", false).classed("expanded", true);
    } else {
      container.classed("expanded", false).classed("collapsed", true);
    }
  }

  getConnectionPoint() {}
}
