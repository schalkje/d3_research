import BaseNode from "./nodeBase.js";

// ParentNodeComponent.js
// Component responsible for rendering parent nodes that contain child nodes using D3.js

import CircleNode from './nodeCircle.js';

export default class ParentNode  extends BaseNode {
  constructor(nodeData, metadata, svg) {
    super(nodeData, metadata, svg);
    this.childComponents = []; // Initialize childComponents array
  }


  // Method to render the parent node and its children
  render() {
    const container = super.renderContainer();

    // Draw the node shape
    container
      .append("rect")
      .attr("class", (d) => `parent-node`)
      .attr("width", this.width)
      .attr("height", this.height)
      .attr('x', -this.width / 2)
      .attr('y', -this.height / 2)
      .attr("rx", 5)
      .attr("ry", 5);

    // Append text to the top left corner of the
    // parent node
    container
      .append("text")
      .attr("x", (d) => 4)
      .attr("y", (d) => 4)
      .text(this.label)
      .attr("class", "node_label");

    // Set expanded or collapsed state
    if (this.interactionState.expanded) {
      container.classed('expanded', true);
      this.renderChildren(container);
    } else {
      container.classed('collapsed', true);
    }
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
  renderChildren(parentContainer) {
    this.children.forEach(childData => {
      const childComponent = childData.type === 'group'
        ? new ParentNode(childData, this.metadata, this.svg)
        : new CircleNode(childData, this.metadata, this.svg);
      this.childComponents.push(childComponent);
      childComponent.render();

      // Position children relative to the parent node
      d3.select(`[data-id='${childData.id}']`).attr('transform', `translate(${Math.random() * 100 - 50}, ${Math.random() * 100 - 50})`);
    });
  }

  // Method to remove child nodes from the SVG
  removeChildren() {
    this.childComponents.forEach(childComponent => {
      d3.select(`[data-id='${childComponent.id}']`).remove();
    });
    this.childComponents = [];
  }
}
