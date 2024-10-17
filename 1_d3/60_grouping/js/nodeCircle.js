import BaseNode from "./nodeBase.js";

export default class CircleNode extends BaseNode {
  constructor(nodeData, metadata, svg) {
    super(nodeData, metadata, svg);
  }

  // Method to render the node using D3
  render() {
    const container = super.renderContainer();

    // Draw the node shape
    container
      .append("circle")
      .attr("r", 20)
      .attr("class", "node_shape" )
      .attr("stroke", "#000")
      .attr("stroke-width", 1.5);

    // Add node label
    container
      .append("text")
      .attr("x", 25)
      .attr("y", 5)
      .attr("class", "node_label")
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
