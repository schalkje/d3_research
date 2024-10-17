export default class BaseNode {
  constructor(nodeData, metadata, svg) {
    this.id = nodeData.id;
    this.label = nodeData.label;
    this.width = nodeData.width || 60; // Default width if not specified
    this.height = nodeData.height || 60; // Default height if not specified
    this.type = nodeData.type;
    this.groupType = nodeData.groupType || null;
    this.children = nodeData.children;
    this.interactionState = metadata.nodes[this.id]?.interactionState || { expanded: false };
    this.svg = svg;
    this.metadata = metadata;
  }

  renderContainer() {
    const container = this.svg
      .append("g")
      .attr("class", "node")
      .attr("data-id", this.id)
      .on("click", () => this.toggleExpandCollapse(container));

    // Set expanded or collapsed state
    if (this.interactionState.expanded) {
      container.classed("expanded", true);
    } else {
      container.classed("collapsed", true);
    }

    return container;
  }

  render(){
    const container = renderContainer();

  }

  // Method to toggle expansion/collapse of the node
  toggleExpandCollapse(container) {
    this.interactionState.expanded = !this.interactionState.expanded;
    this.updateRender(container);
  }

  // Method to update the node rendering based on interaction state
  updateRender(container) {
    if (this.interactionState.expanded) {
      container.classed("collapsed", false).classed("expanded", true);
    } else {
      container.classed("expanded", false).classed("collapsed", true);
    }
  }

  getConnectionPoint() {

  }
}
