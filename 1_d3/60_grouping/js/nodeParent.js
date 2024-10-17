// ParentNodeComponent.js
// Component responsible for rendering parent nodes that contain child nodes using D3.js

import CircleNode from './nodeCircle.js';

export default class ParentNode {
  constructor(nodeData, metadata, svg) {
    this.id = nodeData.id;
    this.label = nodeData.label;
    this.type = nodeData.type;
    this.groupType = nodeData.groupType || null;
    this.children = nodeData.children;
    this.interactionState = metadata.nodes[this.id]?.interactionState || { expanded: false };
    this.svg = svg;
    this.childComponents = [];
    this.metadata = metadata;
  }

  // Method to render the parent node and its children
  render() {
    const group = this.svg.append('g')
      .attr('class', 'parent-node')
      .attr('data-id', this.id)
      .on('click', () => this.toggleExpandCollapse(group));

    // Draw the parent node shape
    group.append('circle')
      .attr('r', 30)
      .attr('fill', this.getNodeColor())
      .attr('stroke', '#000')
      .attr('stroke-width', 1.5);

    // Add node label
    group.append('text')
      .attr('x', 35)
      .attr('y', 5)
      .text(this.label)
      .style('font-size', '14px')
      .style('font-family', 'Arial, sans-serif');

    // Set expanded or collapsed state
    if (this.interactionState.expanded) {
      group.classed('expanded', true);
      this.renderChildren(group);
    } else {
      group.classed('collapsed', true);
    }
  }

  // Method to toggle expansion/collapse of the parent node
  toggleExpandCollapse(group) {
    this.interactionState.expanded = !this.interactionState.expanded;
    this.updateRender(group);
  }

  // Method to update the parent node rendering based on interaction state
  updateRender(group) {
    if (this.interactionState.expanded) {
      group.classed('collapsed', false).classed('expanded', true);
      this.renderChildren(group);
    } else {
      group.classed('expanded', false).classed('collapsed', true);
      this.removeChildren();
    }
  }

  // Method to render child nodes
  renderChildren(parentGroup) {
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

  // Helper method to determine the node color based on its type
  getNodeColor() {
    if (this.type === 'group') {
      switch (this.groupType) {
        case 'dynamic':
          return '#00f';
        case 'fixed':
          return '#0f0';
        case 'pinned':
          return '#f00';
        default:
          return '#ccc';
      }
    }
    return '#999';
  }
}

// // Example usage with D3
// const svg = d3.select('body').append('svg')
//   .attr('width', 800)
//   .attr('height', 600);

// const rootNode = new ParentNodeComponent(testDataModel[0], testDataModelMetadata, svg);
// rootNode.render();

// CSS Classes (for reference, to be added in your stylesheet)
/*
.parent-node text {
  user-select: none;
}
.collapsed {
  opacity: 0.7;
}
.expanded {
  font-weight: bold;
}
*/
