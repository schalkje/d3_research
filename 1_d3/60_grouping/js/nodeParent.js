import BaseNode from "./nodeBase.js";
import CircleNode from './nodeCircle.js';
import Simulation from './simulation.js';
import { getComputedDimensions } from "./utils.js";

export default class ParentNode  extends BaseNode {
  constructor(nodeData, metadata, svg) {
    super(nodeData, metadata, svg);
    this.simulation = null;
  }


  // Method to render the parent node and its children
  render(renderChildren = true){
    console.log('Rendering Parent Node:', this.id);
    super.renderContainer();

    // Draw the node shape
    this.element
      .append("rect")
      .attr("class", (d) => `node shape parent`)
      .attr("width", this.data.width)
      .attr("height", this.data.height)
      .attr('x', -this.data.width / 2)
      .attr('y', -this.data.height / 2)
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

    // Set expanded or collapsed state
    if (this.interactionState.expanded) {
      this.element.classed('expanded', true);
      if (renderChildren)
        this.renderChildren(this.element);
    } else {
      this.element.classed('collapsed', true);
    }
  }

  resize(boundingBox) {
    // console.log('Resizing parent node', this.id, boundingBox);
    // add room for the label text on the top (left corner)
    const labelMargin = 12;
    boundingBox.y -= labelMargin;
    boundingBox.height += labelMargin;


    super.resize(boundingBox);

    // JS: why is g right, but rect not?
    console.log(`Resizing parent.node ${this.id}, (${Math.round(boundingBox.x)},${Math.round(boundingBox.y)}) --> ${Math.round(boundingBox.width)}, ${Math.round(boundingBox.height)}`);
    const computedDimension = getComputedDimensions(this.element);
    console.log(`                comparison (${Math.round(boundingBox.x)},${Math.round(boundingBox.y)}) --> ${Math.round(boundingBox.width)} =?= ${Math.round(computedDimension.width)},  ${Math.round(boundingBox.height)} =?= ${Math.round(computedDimension.height)}`);


    this.element.select('rect')
      .attr('width', this.data.width)
      .attr('height', this.data.height)
      .attr('x', this.data.x)
      .attr('y', this.data.y);

    this.element.select('text')
      .attr("x", this.data.x)
      .attr("y", this.data.y)
  }

  // Method to toggle expansion/collapse of the parent node
  toggleExpandCollapse(container) {
    this.interactionState.expanded = !this.interactionState.expanded;
    this.updateRender(container);
  }

  // Method to update the parent node rendering based on interaction state
  updateRender(container) {
    if (this.interactionState.expanded) {
      container.classed('collapsed', false).classed('expanded', true);
      this.renderChildren(container);
    } else {
      container.classed('expanded', false).classed('collapsed', true);
      this.removeChildren();
    }
  }

  // Method to render child nodes
  // renderChildren(parentContainer) {
  //   this.children.forEach(childData => {
  //     const childComponent = childData.type === 'group'
  //       ? new ParentNode(childData, this.metadata, this.svg)
  //       : new CircleNode(childData, this.metadata, this.svg);
  //     this.childComponents.push(childComponent);
  //     childComponent.render();

  //     // Position children relative to the parent node
  //     d3.select(`[data-id='${childData.id}']`).attr('transform', `translate(${Math.random() * 100 - 50}, ${Math.random() * 100 - 50})`);
  //   });
  // }

  renderChildren(parentContainer) {
    console.log('    Rendering Children for Parent:', this.id, this.data.children);

    // for this stage, only add links between children
    var links = [];    
    for (let i = 0; i < this.data.children.length; i++) {
      if (i < this.data.children.length - 1) {
        links.push({
          source: this.data.children[i].id,
          target: this.data.children[i + 1].id
        });
      }
    }

    console.log('        Links:', links);


    // Create child components
    this.data.children.forEach(node => {
      const childComponent = node.type === 'group'
        ? new ParentNode(node, this.metadata, parentContainer)
        : new CircleNode(node, this.metadata, parentContainer);
      console.log('        Rendering Child:', childComponent);
      childComponent.render();
    });

    // Initialize force-directed simulation for children
    const simulation = new Simulation(this.data.children, links, this);
    simulation.init();    
  }

  // Method to remove child nodes from the SVG
  removeChildren() {
    this.childComponents.forEach(childComponent => {
      d3.select(`[data-id='${childComponent.id}']`).remove();
    });
    this.childComponents = [];
  }
}