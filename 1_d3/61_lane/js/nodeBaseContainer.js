import BaseNode from "./nodeBase.js";
import Simulation from "./simulation.js";
import { getComputedDimensions } from "./utils.js";

export default class BaseContainerNode extends BaseNode {
  constructor(nodeData, parentElement, parentNode = null) {
    super(nodeData, parentElement, parentNode);
    
    this.simulation = null;
    this.container = null;
    this.containerMargin = { top: 18, right: 8, bottom: 8, left: 8 };
    this.childNodes = [];
  }

  // Method to render the parent node and its children
  async render() {
    console.log(`Rendering BaseContainerNode type=${this.data.type} Node:`, this.id);
    super.renderContainer();

    // A container node consists of it's own display, a border, background and a label
    // and a container where the node is rendered

    // Append text to the top left corner of the element
    const labelElement = this.element
      .append("text")
      .attr("x", -this.data.width / 2 + 4)
      .attr("y", -this.data.height / 2 + 4)
      .text(this.data.label)
      .attr("class", `node label container ${this.data.type}`);
      // .on("click", (event) => {
      //   event.stopPropagation();
      //   this.toggleExpandCollapse(this.element);
      // });

    this.minimumSize = getComputedDimensions(labelElement);
    this.minimumSize.width += 8;
    this.minimumSize.height += 4;
    if (this.data.width < this.minimumSize.width || this.data.height < this.minimumSize.height) {
      console.log("Render Resizing BaseContainerNode:", this.data.width, this.minimumSize.width, this.data.height, this.minimumSize.height);
      this.data.width = Math.max(this.minimumSize.width, this.data.width);
      this.data.height = Math.max(this.minimumSize.height, this.data.height);
      // reposition the label based on the new size
      labelElement.attr("x", -this.data.width / 2 + 4).attr("y", -this.data.height / 2 + 4);
    }

    // Draw the node shape
    this.element
      .append("rect")
      .attr("class", (d) => `node shape container ${this.data.type}`)
      .attr("width", this.data.width)
      .attr("height", this.data.height)
      .attr("x", -this.data.width / 2)
      .attr("y", -this.data.height / 2)
      .attr("rx", 5)
      .attr("ry", 5);

    if (this.data.interactionState.expanded) {
      this.element.classed("expanded", true);
      this.renderExpanded();
    } else {
      this.element.classed("collapsed", true);
      this.renderCollapsed();
    }

    // you cannot move the g node,, move the child elements in stead
    this.element.attr("transform", `translate(${this.data.x}, ${this.data.y})`);
  }

  resize(size) {
    // make sure it doesn't go below minimum size
    // console.log("BaseNodeContainer resize", size.width, this.minimumSize.width, size.height, this.minimumSize.height);
    size.width = Math.max(size.width, this.minimumSize.width);
    size.height = Math.max(size.height, this.minimumSize.height);

    super.resize(size);

    this.element
      .select("rect")
      .attr("width", this.data.width)
      .attr("height", this.data.height)
      .attr("x", -this.data.width / 2)
      .attr("y", -this.data.height / 2);

    this.element
      .select("text")
      .attr("x", -this.data.width / 2 + 4)
      .attr("y", -this.data.height / 2 + 4);


    if (this.container) {
      const containerRect = getComputedDimensions(this.container);
      const elementRect = getComputedDimensions(this.element);


      const containerX = elementRect.x - containerRect.x + this.containerMargin.left;
      const containerY = elementRect.y - containerRect.y + this.containerMargin.top;
      // const containerX = -containerRect.width/2 + this.containerMargin.left;
      // const containerY = -containerRect.height/2 + this.containerMargin.top;
      console.log(`                                        width: ${elementRect.x}-${containerRect.x}+${this.containerMargin.left}=${containerX}`);
      console.log(`                                       height: ${elementRect.y}-${containerRect.y}+${this.containerMargin.top}=${containerY}`);
      this.container
          .attr(
            "transform",
            `translate(${containerX}, ${containerY})`
          );
    }
  }

  // resize the node based on a resize of the container and it's child
  resizeContainer(boundingBox) {
    boundingBox.x -= this.containerMargin.left;
    boundingBox.y -= this.containerMargin.top;
    boundingBox.width += this.containerMargin.left + this.containerMargin.right;
    boundingBox.height += this.containerMargin.top + this.containerMargin.bottom;

    // make sure it doesn't go below minimum size
    // console.log("ParentNode resize", boundingBox.width, this.minimumSize.width, boundingBox.height, this.minimumSize.height);
    boundingBox.width = Math.max(boundingBox.width, this.minimumSize.width);
    boundingBox.height = Math.max(boundingBox.height, this.minimumSize.height);

    this.resize(boundingBox);
  }

  async renderExpanded() {
    // restore the expanded size if it was stored
    if (this.data.expandedSize) {
      this.data.height = this.data.expandedSize.height;
      this.data.width = this.data.expandedSize.width;
    }

    // this.resize({ width: this.data.width, height: this.data.height });
    // this.element.select("rect").attr("width", this.data.width).attr("height", this.data.height);

    const containerWidth = this.data.width - this.containerMargin.left - this.containerMargin.right;
    const containerHeight = this.data.height - this.containerMargin.top - this.containerMargin.bottom;
    this.container = this.element
      .append("g")
      .attr("class", (d) => `node container parent`);


    // Set expanded or collapsed state
    await this.renderChildren();

    this.resize({ width: this.data.width, height: this.data.height });
  }

  async renderCollapsed() {
    // store the expanded size before collapsing
    if (this.data.height > this.minimumSize.height || this.data.width > this.minimumSize.width)
      this.data.expandedSize = { height: this.data.height, width: this.data.width };

    // set the collapsed size
    this.data.height = this.minimumSize.height;
    this.data.width = this.minimumSize.width;

    // apply the collapsed size to the rectangle
    this.element.select("rect").attr("width", this.data.width).attr("height", this.data.height);

    this.resize({ width: this.data.width, height: this.data.height });

    // this.cascadeLayoutUpdate(); // JS: todo: ugly: why do we need to call this here (and not in the rederExpanded method)?
  }

  // Method to toggle expansion/collapse of the parent node
  toggleExpandCollapse() {
    this.data.interactionState.expanded = !this.data.interactionState.expanded;
    this.updateLayout();
  }

  // Method to update rendering based on interaction state
  updateLayout() {
    if (this.data.interactionState.expanded) {
      this.element.classed("collapsed", false).classed("expanded", true);
      this.renderExpanded();
    } else {
      this.element.classed("expanded", false).classed("collapsed", true);
      this.removeChildren();
      this.renderCollapsed();
    }

    this.cascadeArrange();
  }

  arrange() {
    console.log("Arranging BaseContainerNode:", this.id);
  }

  async renderChildren() {
    console.log("    Rendering Children for BaseContainer:", this.id, this.data.children);
    // no default rendering of the children, but this renders a placeholder rect
    const containerWidth = this.data.width - this.containerMargin.left - this.containerMargin.right;
    const containerHeight = this.data.height - this.containerMargin.top - this.containerMargin.bottom;
    this.container
      .append("rect")
      .attr("class", (d) => `node placeholder`)
      .attr("width", containerWidth)
      .attr("height", containerHeight)
      .attr("fill", "red")
      .attr("stroke", "red")
      .attr("stroke-width", 2)
      .attr("x", -containerWidth / 2)
      .attr("y", -containerHeight / 2);

    if ( this.layoutDebug )
      this.container.append("circle").attr("r", 3).attr("cx", 0).attr("cy", 0).attr("fill", "red");	
  

    this.container.attr(
      "transform",
      `translate(
            ${this.containerMargin.left - this.containerMargin.right}, 
            ${this.containerMargin.top- this.containerMargin.bottom}
          )`
    );
}

  // Method to remove child nodes from the SVG
  removeChildren() {
    console.log("    Removing Children for Parent:", this.id);
    this.container.selectAll("*").remove();
    this.container.remove();
    this.childNodes = [];
  }
}

