import BaseNode from "./nodeBase.js";
import CircleNode from "./nodeCircle.js";
import RectangularNode from "./nodeRect.js";
import Simulation from "./simulation.js";
import { getComputedDimensions } from "./utils.js";

export default class ParentNode extends BaseNode {
  constructor(nodeData, parentElement, parentNode = null) {
    super(nodeData, parentElement, parentNode);
    this.simulation = null;
    this.container = null;
    this.containerMargin = { top: 18, right: 8, bottom: 8, left: 8 };
  }

  // Method to render the parent node and its children
  async render() {
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
    const labelElement = this.element
      .append("text")
      .attr("x", (d) => -this.data.width / 2 + 4)
      .attr("y", (d) => -this.data.height / 2 + 4)
      .text(this.data.label)
      .attr("class", "node label parent")
      .on("click", (event) => {
        event.stopPropagation();
        this.toggleExpandCollapse(this.element);
      })

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

    this.element
      .select("text")
      .attr("x", this.data.x)
      .attr("y", this.data.y + this.containerMargin.top);

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

    this.runSimulation();
  }

  async runSimulation() {
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

        this.simulation = new Simulation(this.data.children, links, this);
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

    // update simulation of parent node
    // this.parentContainer.simulation.restart();
    this.cascadeSimulation();
  }

  async renderChildren(parentContainer) {
    console.log("    Rendering Children for Parent:", this.id, this.data.children);
    if (!this.data.children || this.data.children.length === 0) {
      return;
    }

    // Create an array to hold all the render promises
    const renderPromises = [];

    for (const node of this.data.children) {
      // Create the childComponent instance based on node type
      const ComponentClass = typeToComponent[node.type] || typeToComponent.default;
      const childComponent = new ComponentClass(node, parentContainer, this);

      console.log("Rendering Child:", childComponent);

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
  default: CircleNode,
};
