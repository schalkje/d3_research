import BaseNode from "./nodeBase.js";
import CircleNode from "./nodeCircle.js";
import RectangularNode from "./nodeRect.js";
import Simulation from "./simulation.js";
import AdapterNode from "./nodeAdapter.js";
import { getComputedDimensions } from "./utils.js";

export default class ParentNode extends BaseNode {
  constructor(nodeData, parentElement, parentNode = null) {
    super(nodeData, parentElement, parentNode);
    this.simulation = null;
    this.container = null;
    this.containerMargin = { top: 18, right: 8, bottom: 8, left: 8 };
    this.childNodes = [];
  }

  // Method to render the parent node and its children
  async render() {
    console.log("Rendering Parent Node:", this.id);
    super.renderContainer();

    // A group/parent node consists of it's own display, a border, background and a label
    // and a container where the node is rendered

    // Append text to the top left corner of the element
    const labelElement = this.element
      .append("text")
      .attr("x", -this.data.width / 2 + 4)
      .attr("y", -this.data.height / 2 + 4)
      .text(this.data.label)
      .attr("class", "node label parent")
      .on("click", (event) => {
        event.stopPropagation();
        this.toggleExpandCollapse(this.element);
      });

    this.minimumSize = getComputedDimensions(labelElement);
    this.minimumSize.width += 8;
    this.minimumSize.height += 4;
    if (this.data.width < this.minimumSize.width || this.data.height < this.minimumSize.height) {
      this.data.width = Math.max(this.minimumSize.width, this.data.width);
      this.data.height = Math.max(this.minimumSize.height, this.data.height);
      // reposition the label based on the new size
      labelElement.attr("x", -this.data.width / 2 + 4).attr("y", -this.data.height / 2 + 4);
    }

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

  resize(boundingBox) {
    boundingBox.x -= this.containerMargin.left;
    boundingBox.y -= this.containerMargin.top;
    boundingBox.width += this.containerMargin.left + this.containerMargin.right;
    boundingBox.height += this.containerMargin.top + this.containerMargin.bottom;

    // make sure it doesn't go below minimum size
    // console.log("ParentNode resize", boundingBox.width, this.minimumSize.width, boundingBox.height, this.minimumSize.height);
    boundingBox.width = Math.max(boundingBox.width, this.minimumSize.width);
    boundingBox.height = Math.max(boundingBox.height, this.minimumSize.height);

    super.resize(boundingBox);

    this.element
      .select("rect")
      .attr("width", this.data.width)
      .attr("height", this.data.height)
      .attr("x", -this.data.width / 2)
      .attr("y", -this.data.height / 2);
    // .attr("x", this.data.x)
    // .attr("y", this.data.y + this.containerMargin.top);

    this.element
      .select("text")
      .attr("x", -this.data.width / 2 + 4)
      .attr("y", -this.data.height / 2 + 4);

    const containerWidth = this.data.width - this.containerMargin.left - this.containerMargin.right;
    const containerHeight = this.data.height - this.containerMargin.top - this.containerMargin.bottom;
    this.container
      .attr("width", containerWidth)
      .attr("height", containerHeight)
      // .attr("transform", `translate(${-boundingBox.width / 2}, ${-this.data.height / 2 + containerHeight/2 + this.containerMargin.top})`);
      .attr(
        "transform",
        `translate(${-this.data.width / 2 + containerWidth / 2 + this.containerMargin.left}, ${
          -this.data.height / 2 + containerHeight / 2 + this.containerMargin.top
        })`
      );
    // .attr("transform", `translate(${-this.data.width / 2}, ${-this.data.height / 2})`);
    // .attr("transform", `translate(${-this.data.width / 2 + containerWidth/2 + this.containerMargin.left}, ${-this.data.height / 2 + containerHeight/2 + this.containerMargin.top})`);
    // .attr("transform", `translate(${-this.data.width / 2 + this.containerMargin.left}, ${-this.data.height / 2 + this.containerMargin.top})`);
  }

  async renderExpanded() {
    // restore the expanded size if it was stored
    if (this.data.expandedSize) {
      this.data.height = this.data.expandedSize.height;
      this.data.width = this.data.expandedSize.width;
    }

    this.element.select("rect").attr("width", this.data.width).attr("height", this.data.height);

    const containerWidth = this.data.width - this.containerMargin.left - this.containerMargin.right;
    const containerHeight = this.data.height - this.containerMargin.top - this.containerMargin.bottom;
    this.container = this.element
      .append("g")
      .attr("class", (d) => `node container parent`)
      .attr("width", containerWidth)
      .attr("height", containerHeight)
      .attr("x", -containerWidth / 2 + this.containerMargin.left)
      .attr("y", -containerHeight / 2 + this.containerMargin.top);

    // Set expanded or collapsed state
    await this.renderChildren();
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

    this.runSimulation();
  }

  async runSimulation() {
    // for this stage, only add links between children
    var links = [];
    // for (let i = 0; i < this.data.children.length; i++) {
    //   if (i < this.data.children.length - 1) {
    //     links.push({
    //       source: this.data.children[i].id,
    //       target: this.data.children[i + 1].id,
    //     });
    //   }
    // }

    this.simulation = new Simulation(this);
    await this.simulation.init();
  }

  // drag_started (event, node) {
  //   console.log("drag_started 22222 event",event, node);
  //   // if (!d3.event.active) {
  //     // Set the attenuation coefficient to simulate the node position movement process. The higher the value, the faster the movement. The value range is [0, 1]
  //     // this.simulation.alphaTarget(0.8).restart()
  //     if (this.simulation) {
  //       console.log("drag_started simulation",this.simulation);
  //     this.simulation.restart()
  //     }
  //   // }
  //   event.fx = event.x;
  //   event.fy = event.y;
  //   d3.select(this).attr("class", "node_grabbing");
  // }

  // cascadeRestartSimulation() {
  //   if  (this.simulation)
  //     this.simulation.simulation.alphaTarget(0.8).restart();
  // if (this.parentNode)
  //   {
  //     // if  (this.parentNode.simulation)
  //     //   this.parentNode.simulation.simulation.alphaTarget(1).restart();
  //       this.parentNode.cascadeRestartSimulation();
  //   }
  // }

  // Method to toggle expansion/collapse of the parent node
  toggleExpandCollapse() {
    this.data.interactionState.expanded = !this.data.interactionState.expanded;
    this.updateRender();
  }

  // Method to update the parent node rendering based on interaction state
  updateRender() {
    if (this.data.interactionState.expanded) {
      this.container.classed("collapsed", false).classed("expanded", true);
      this.renderExpanded();
    } else {
      this.container.classed("expanded", false).classed("collapsed", true);
      this.removeChildren();
      this.renderCollapsed();
    }

    // update simulation of parent node
    // this.parentContainer.simulation.restart();
    this.cascadeSimulation();
  }

  async renderChildren() {
    console.log("    Rendering Children for Parent:", this.id, this.data.children);
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

    await this.runSimulation();
  }

  // Method to remove child nodes from the SVG
  removeChildren() {
    console.log("    Removing Children for Parent:", this.id);
    this.container.selectAll("*").remove();
    this.container.remove();
  }
}

const typeToComponent = {
  group: ParentNode,
  node: RectangularNode,
  adapter: AdapterNode,
  default: CircleNode,
};
