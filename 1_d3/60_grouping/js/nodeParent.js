import BaseNode from "./nodeBase.js";
import CircleNode from './nodeCircle.js';
import Simulation from './simulation.js';

export default class ParentNode  extends BaseNode {
  constructor(nodeData, metadata, svg) {
    super(nodeData, metadata, svg);
    this.childComponents = []; // Initialize childComponents array
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
      .attr("width", this.width)
      .attr("height", this.height)
      .attr('x', -this.width / 2)
      .attr('y', -this.height / 2)
      .attr("rx", 5)
      .attr("ry", 5);

    // Append text to the top left corner of the
    // parent node
    this.element
      .append("text")
      .attr("x", (d) => -this.width / 2 + 4)
      .attr("y", (d) => -this.height / 2 + 4)
      .text(this.label)
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
    console.log('Resizing parent node', this.id, boundingBox);
    // add room for the label text on the top (left corner)
    boundingBox.y -= 10;


    super.resize(boundingBox);

    this.element.select('rect')
      .attr('width', this.width)
      .attr('height', this.height)
      .attr('x', this.x)
      .attr('y', this.y);

    this.element.select('text')
      .attr("x", (d) => this.x + 4)
      .attr("y", (d) => this.y + 4)
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
    const nodes = this.children.map(childData => ({
      id: childData.id,
      data: childData,
    }));
    console.log('    Rendering Children for Parent:', this.id, nodes);

    // for this stage, only add links between children
    var links = [];    
    for (let i = 0; i < nodes.length; i++) {
      if (i < nodes.length - 1) {
        links.push({
          source: nodes[i].id,
          target: nodes[i + 1].id
        });
      }
    }
    // if (nodes.length > 0) {
    //   links = nodes.map((node) => ({
    //     source: this.id,
    //     target: node.id,
    //   }));
    // }

    console.log('        Nodes:', nodes);
    console.log('        Links:', links);


    // Create child components
    nodes.forEach(node => {
      const childData = node.data;
      const childComponent = childData.type === 'group'
        ? new ParentNode(childData, this.metadata, parentContainer)
        : new CircleNode(childData, this.metadata, parentContainer);
      this.childComponents.push(childComponent);
      console.log('        Rendering Child:', childComponent);
      childComponent.render();
    });

    // Initialize force-directed simulation for children
    const simulation = new Simulation(nodes, links, this);
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