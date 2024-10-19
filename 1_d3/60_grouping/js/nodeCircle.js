import BaseNode from "./nodeBase.js";

export default class CircleNode extends BaseNode {
  constructor(nodeData, metadata, svg) {
    super(nodeData, metadata, svg);
  }

  // Method to render the node using D3
  render() {
    const container = super.renderContainer();
    console.log('Rendering Circle Node:', this.id);

    // Draw the node shape
    container
      .append("circle")
      .attr("r", 20)
      .attr("class", "node shape" )
      .attr("stroke", "#000")
      .attr("stroke-width", 1.5);

    // Add node label
    container
      .append("text")
      .attr("x", 0)
      .attr("y", 0)
      .attr("class", "node label")
      .text(this.label);

    // Set expanded or collapsed state
    if (this.interactionState.expanded) {
      container.classed("expanded", true);
    } else {
      container.classed("collapsed", true);
    }
  }
}

// CSS Classes (for reference, to be added in your stylesheet)
/*
  .node text {
    user-select: none;
  }
  .collapsed {
    opacity: 0.7;
  }
  .expanded {
    font-weight: bold;
  }
  */
