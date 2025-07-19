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
    // Create a single rectangle for the node shape (no separate border needed)
    this.shape = this.element
      .append("rect")
      .attr("class", `${this.data.type} shape`)
      .attr("width", this.data.width)
      .attr("height", this.data.height)
      .attr("status", this.status)
      .attr("x", -this.data.width / 2)
      .attr("y", -this.data.height / 2)
      .attr("rx", 5)
      .attr("ry", 5)
      .attr("fill", this.settings.containerFill || "#f8f9fa")
      .attr("stroke", this.settings.containerStroke || "#dee2e6")
      .attr("stroke-width", this.settings.containerStrokeWidth || 1);

    // Create label text element
    this.label = this.element
      .append("text")
      .attr("class", `${this.data.type} label`)
      .attr("x", 0)
      .attr("y", 0)
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "middle")
      .attr("font-family", this.settings.fontFamily || "Arial, sans-serif")
      .attr("font-size", this.settings.fontSize || "12px")
      .attr("font-weight", this.settings.fontWeight || "normal")
      .attr("fill", this.settings.textColor || "#333333")
      .text(this.data.label);
  }

  redrawText(label, width) {
    // Update data properties
    if (label !== undefined) this.data.label = label;
    if (width !== undefined) this.data.width = width;
    
    this.element
      .select("rect")
      .attr("width", this.data.width)
      .attr("x", -this.data.width / 2);

    this.element
      .select("text")
      .text(label || this.data.label);
  }

  get status() {
    return super.status;
  }
  
  set status(value) {
    super.status = value;
    if (this.shape) {
      this.shape.attr("status", value);
    }
    
    // Apply status-based styling
    const statusColors = this.settings.statusColors || {};
    if (statusColors[value]) {
      this.shape
        .attr("stroke", statusColors[value].border || this.settings.containerStroke)
        .attr("fill", statusColors[value].fill || this.settings.containerFill);
    }
  }

  resize(size, forced = false) {
    // Update data properties first
    if (size.width !== undefined) this.data.width = size.width;
    if (size.height !== undefined) this.data.height = size.height;
    
    super.resize(size, forced);

    // Always update the visual elements
    this.element
      .select("rect")
      .attr("width", this.data.width)
      .attr("height", this.data.height)
      .attr("x", -this.data.width / 2)
      .attr("y", -this.data.height / 2);

    // Keep label centered
    this.element
      .select("text")
      .attr("x", 0)
      .attr("y", 0);
  }
}
