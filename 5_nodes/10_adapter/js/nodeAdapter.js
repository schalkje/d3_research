import BaseNode from "./nodeBase.js";
import RectangularNode from "./nodeRect.js";
import { getComputedDimensions } from "./utils.js";

export default class AdapterNode extends BaseNode {
  constructor(nodeData, parentElement, parentNode = null) {
    if (!nodeData.width) nodeData.width = 350;
    if (!nodeData.height) nodeData.height = 74;

    super(nodeData, parentElement, parentNode);
    this.container = null;
    this.containerMargin = { top: 18, right: 8, bottom: 8, left: 8 };
    this.stagingNode = null;
    this.transformNode = null;
    this.archiveNode = null;
  }

  // Method to render the parent node and its children
  async render() {
    console.log("Rendering Adapter Node:", this.id);
    super.renderContainer();

    // A group/parent node consists of it's own display, a border, background and a label
    // and a container where the node is rendered

    // Draw the node shape
    this.element
      .append("rect")
      .attr("class", (d) => `node shape adapter`)
      .attr("width", this.data.width)
      .attr("height", this.data.height)
      .attr("x", -this.data.width / 2)
      .attr("y", -this.data.height / 2)
      .attr("rx", 5)
      .attr("ry", 5);

    // Append text to the top left corner of the
    // parent node    
    const labelElement = this.element
      .append("text")
      .attr("x", (d) => -this.data.width / 2 + 4)
      .attr("y", (d) => -this.data.height / 2 + 4)
      .text(this.data.label)
      .attr("class", "node label adapter")
      .on("click", (event) => {
        event.stopPropagation();
        this.toggleExpandCollapse(this.element);
      });

    this.minimumSize = getComputedDimensions(labelElement);
    this.minimumSize.width += 8;
    this.minimumSize.height += 4;

    if (this.data.interactionState.expanded) {
      this.element.classed("expanded", true);
      this.renderExpanded();
    } else {
      this.element.classed("collapsed", true);
      this.renderCollapsed();
    }
  }

  resize(boundingBox) {
    boundingBox.x -= this.containerMargin.left;
    boundingBox.y -= this.containerMargin.top;
    boundingBox.width += this.containerMargin.left + this.containerMargin.right;
    boundingBox.height += this.containerMargin.top + this.containerMargin.bottom;

    // make sure it doesn't go below minimum size
    boundingBox.width = Math.max(boundingBox.width, this.minimumSize.width);
    boundingBox.height = Math.max(boundingBox.height, this.minimumSize.height);

    super.resize(boundingBox);

    this.element
      .select("rect")
      .attr("width", this.data.width)
      .attr("height", this.data.height)
      .attr("x", this.data.x)
      .attr("y", this.data.y + this.containerMargin.top);

    this.element
      .select("text")
      .attr("x", this.data.x+4)
      .attr("y", this.data.y + this.containerMargin.top+4);

    const containerWidth = this.data.width - this.containerMargin.left - this.containerMargin.right;
    const containerHeight = this.data.height - this.containerMargin.top - this.containerMargin.bottom;
    this.container
      .attr("width", containerWidth)
      .attr("height", containerHeight)
      .attr("transform", `translate(0, ${this.containerMargin.top})`);
  }

  async renderExpanded() {
    this.data.expandedSize = {height: this.data.height, width: this.data.width};
    if (this.data.expandedSize) {
      this.data.height = this.data.expandedSize.height;
      this.data.width = this.data.expandedSize.width;
    }

    this.element.select("rect").attr("width", this.data.width).attr("height", this.data.height);

    // this.element
    //   .select("text")
    //   .attr("x", this.data.x)
    //   .attr("y", this.data.y + this.containerMargin.top);

    const containerWidth = this.data.width - this.containerMargin.left - this.containerMargin.right;
    const containerHeight = this.data.height - this.containerMargin.top - this.containerMargin.bottom;
    this.container = this.element
      .append("g")
      .attr("class", (d) => `node container parent`)
      .attr("width", containerWidth)
      .attr("height", containerHeight)
      .attr("x", -containerWidth / 2 + this.containerMargin.left)
      .attr("y", -containerHeight / 2); // + this.containerMargin.top);

    // Set expanded or collapsed state
    await this.renderChildren(this.container);
  }

  async renderCollapsed() {
    if (this.data.height > this.minimumSize.height || this.data.width > this.minimumSize.width )
      this.data.expandedSize = {height: this.data.height, width: this.data.width};
    this.data.height = this.minimumSize.height;
    this.data.width = this.minimumSize.width;
    this.element.select("rect").attr("width", this.data.width).attr("height", this.data.height);

    // this.element
    //   .select("text")
    //   .attr("x", this.data.x)
    //   .attr("y", this.data.y + this.containerMargin.top);

  }

  // Method to toggle expansion/collapse of the parent node
  toggleExpandCollapse(container) {
    this.data.interactionState.expanded = !this.data.interactionState.expanded;
    this.updateRender(container);
  }

  // Method to update the parent node rendering based on interaction state
  updateRender(container) {
    if (this.data.interactionState.expanded) {
      container.classed("collapsed", false).classed("expanded", true);
      this.renderExpanded();
    } else {
      container.classed("expanded", false).classed("collapsed", true);
      this.removeChildren();
      this.renderCollapsed();
    }
  }

  async renderChildren(parentContainer) {
    console.log("    Rendering Children for Parent:", this.id, this.data.children);
    if (!this.data.children || this.data.children.length === 0) {
      return;
    }

    // render "archive" node
    let archiveChild = this.data.children.find((child) => child.category === "archive");
    if (archiveChild) {
      this.archiveNode = new RectangularNode(archiveChild, parentContainer, this);
      this.archiveNode.render();
      const x = -this.data.width/2 + (this.archiveNode.data.width/2) + this.containerMargin.left + this.archiveNode.data.width/2 + 30;
      const y = -this.data.height/2 + (this.archiveNode.data.height/2) + this.containerMargin.top;
      this.archiveNode.element.attr("transform", `translate(${x}, ${y})`);
    }

    // render "staging" node
    let stagingChild = this.data.children.find((child) => child.category === "staging");
    if (stagingChild) {
      this.stagingNode = new RectangularNode(stagingChild, parentContainer, this);
      this.stagingNode.render();
      const x = -this.data.width/2 + (this.stagingNode.data.width/2) + this.containerMargin.left;
      const y = -this.data.height/2 + (this.stagingNode.data.height/2) + this.containerMargin.top + this.archiveNode.data.height + 10;
      this.stagingNode.element.attr("transform", `translate(${x}, ${y})`);
    }

    // render "transform" node
    let transformChild = this.data.children.find((child) => child.category === "transform");
    if (transformChild) {
      this.transformNode = new RectangularNode(transformChild, parentContainer, this);
      this.transformNode.render();
      const x = -this.data.width/2 + (this.transformNode.data.width/2) + this.containerMargin.left + this.stagingNode.data.width + 30;
      const y = -this.data.height/2 + (this.transformNode.data.height/2) + this.containerMargin.top + this.archiveNode.data.height + 10;
      this.transformNode.element.attr("transform", `translate(${x}, ${y})`);
    }

  }

  // Method to remove child nodes from the SVG
  removeChildren() {
    console.log("    Removing Children for Parent:", this.id);
    this.container.selectAll("*").remove();
    this.container.remove();
  }
}
