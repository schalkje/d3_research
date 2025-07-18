import BaseNode from "./nodeBase.js";
import { getTextWidth } from "./utils.js";

export default class RectangularNode extends BaseNode {
  constructor(nodeData, parentElement, settings, parentNode = null) {
    if (!nodeData.height) nodeData.height = 20;
    if (!nodeData.width) nodeData.width = 150;
    
    const textWidth = getTextWidth(nodeData.label);
    nodeData.width = Math.max(nodeData.width, textWidth);

    super(nodeData, parentElement, settings, parentNode);
  }

  // Method to render the node using D3
  init(parentElement = null) {
    if (parentElement) this.parentElement = parentElement;
    super.init(parentElement);
    this.draw();
  }

  draw() {
    // Draw the node shape
    this.shape = this.element
      .append("rect")
      .attr("class", `${this.data.type} shape`)
      .attr("width", this.data.width)
      .attr("height", this.data.height)
      .attr("status", this.status)
      .attr("x", -this.data.width / 2)
      .attr("y", -this.data.height / 2)
      .attr("rx", 5)
      .attr("ry", 5);

    // Append text for default type
    this.element
      .append("text")
      .attr("class", `${this.data.type} label`)
      .attr("x", 0)
      .attr("y", 0)
      .text(this.data.label);
  }

  redrawText(label, width) {
    this.element
      .select("rect")
      .attr("width", width)
      .attr("x", -width / 2);

    this.element
      .select("text")
      .text(label);
  }

  get status() {
    return super.status;
  }
  
  set status(value) {
    super.status = value;
    this.shape.attr("status", value);
  }

  resize(size, forced = false) {
    super.resize(size, forced);

    this.element
      .select("rect")
      .attr("width", this.data.width)
      .attr("height", this.data.height)
      .attr("x", -this.data.width / 2)
      .attr("y", -this.data.height / 2);

    // Reposition the label based on the new size
    // If the node is much taller than it is wide, position text at the top
    // Otherwise, center the text
    const textY = this.data.height > this.data.width * 1.5 ? -this.data.height / 2 + 10 : 0;
    
    this.element
      .select("text")
      .attr("x", 0)
      .attr("y", textY);
  }
}
