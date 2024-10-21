import BaseNode from "./nodeBase.js";
import CircleNode from "./nodeCircle.js";
import RectangularNode from "./nodeRect.js";
import Simulation from "./simulation.js";
import { getComputedDimensions } from "./utils.js";

export default class ParentNode extends BaseNode {
  constructor(nodeData, svg) {
    super(nodeData, svg);
    this.simulation = null;
    this.container = null;
    this.containerMargin = { top: 14, right: 0, bottom: 0, left: 0 };
  }

  // Method to render the parent node and its children
  async render(renderChildren = true) {
    console.log("Rendering Parent Node:", this.id);
    super.renderContainer();

    // A group/parent node consists of it's own display, a border, background and a label
    // and a container where the node is rendered

    // Draw the node shape
    this.element
      .append("rect")
      .attr("class", (d) => `node shape parent`)
      .attr("width", this.data.width)
      .attr("height", this.data.height)
      .attr("x", -this.data.width / 2)
      .attr("y", -this.data.height / 2)
      .attr("rx", 5)
      .attr("ry", 5);

    // Append text to the top left corner of the
    // parent node
    this.element
      .append("text")
      .attr("x", (d) => -this.data.width / 2 + 4)
      .attr("y", (d) => -this.data.height / 2 + 4)
      .text(this.data.label)
      .attr("class", "node label parent");

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
    if (this.data.interactionState.expanded) {
      this.element.classed("expanded", true);
      if (renderChildren) await this.renderChildren(this.container);
    } else {
      this.element.classed("collapsed", true);
    }
  }

  resize(boundingBox) {
    boundingBox.x -= this.containerMargin.left;
    boundingBox.y -= this.containerMargin.top;
    boundingBox.width += this.containerMargin.left + this.containerMargin.right;
    boundingBox.height += this.containerMargin.top + this.containerMargin.bottom;

    super.resize(boundingBox);

    this.element
      .select("rect")
      .attr("width", this.data.width)
      .attr("height", this.data.height)
      .attr("x", this.data.x)
      .attr("y", this.data.y + this.containerMargin.top);

    this.element
      .select("text")
      .attr("x", this.data.x)
      .attr("y", this.data.y + this.containerMargin.top);

    const containerWidth = this.data.width - this.containerMargin.left - this.containerMargin.right;
    const containerHeight = this.data.height - this.containerMargin.top - this.containerMargin.bottom;
    this.container
      .attr("width", containerWidth)
      .attr("height", containerHeight)
      .attr("transform", `translate(0, ${this.containerMargin.top})`);
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
      this.renderChildren(container);
    } else {
      container.classed("expanded", false).classed("collapsed", true);
      this.removeChildren();
    }
  }

  async renderChildren(parentContainer) {
    console.log("    Rendering Children for Parent:", this.id, this.data.children);
    if (!this.data.children || this.data.children.length === 0) {
      return;
    }

    // for this stage, only add links between children
    var links = [];
    for (let i = 0; i < this.data.children.length; i++) {
      if (i < this.data.children.length - 1) {
        links.push({
          source: this.data.children[i].id,
          target: this.data.children[i + 1].id,
        });
      }
    }

    // Create an array to hold all the render promises
    const renderPromises = [];

    for (const node of this.data.children) {
      // Create the childComponent instance based on node type
      const ComponentClass = typeToComponent[node.type] || typeToComponent.default;
      const childComponent = new ComponentClass(node, parentContainer);

      console.log("Rendering Child:", childComponent);

      // Push the render promise into the array
      renderPromises.push(childComponent.render());
    }

    // Wait for all renders to complete in parallel
    await Promise.all(renderPromises);

    // Initialize force-directed simulation for children
    const simulation = new Simulation(this.data.children, links, this);
    await simulation.init();
  }

  // Method to remove child nodes from the SVG
  removeChildren() {
    this.childComponents.forEach((childComponent) => {
      d3.select(`[data-id='${childComponent.id}']`).remove();
    });
    this.childComponents = [];
  }
}

const typeToComponent = {
  group: ParentNode,
  node: RectangularNode,
  default: CircleNode,
};
