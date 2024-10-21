import BaseNode from "./nodeBase.js";

export default class CircleNode extends BaseNode {
  constructor(nodeData, svg) {
    super(nodeData, svg);

    // add radius property, that is the half of the max of width and height
    if (!this.data.radius)
      this.data.radius = Math.max(this.data.width, this.data.height) / 2;

    // for a circle node, width and height are the same and twice the radius to make a bounding rectangle
    // set width and height to the same value
    this.data.width = this.data.radius*2;
    this.data.height = this.data.width;
  }

  // Method to render the node using D3
  render() {
    const container = super.renderContainer();
    console.log('Rendering Circle Node:', this.id);

    // Draw the node shape
    container
      .append("circle")
      .attr("class", "node shape" )
      .attr("r", this.data.radius)
      .attr("stroke", "#000")
      .attr("stroke-width", 1.5);

    // Add node label
    container
      .append("text")
      .attr("class", "node label")
      .attr("x", 0)
      .attr("y", 0)      
      .text(this.data.label);

    // Set expanded or collapsed state
    if (this.data.interactionState.expanded) {
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
