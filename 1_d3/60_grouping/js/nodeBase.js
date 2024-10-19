export default class BaseNode {
  constructor(nodeData, metadata, parentElement) {
    this.id = nodeData.id;
    this.label = nodeData.label;    
    this.type = nodeData.type;
    this.groupType = nodeData.groupType || null;
    this.children = nodeData.children;
    this.parentElement = parentElement;
    this.element = null;
    this.metadata = metadata;

    this.interactionState = metadata.nodes[this.id]?.interactionState || { expanded: false };
    nodeData.interactionState = this.interactionState;

    this.width = nodeData.width || 60; // Default width if not specified
    nodeData.width = this.width;
    console.log('BaseNode nodeData.width', nodeData.width);

    this.height = nodeData.height || 60; // Default height if not specified
    nodeData.height = this.height;

  }

  renderContainer() {
    this.element = this.parentElement
      .append("g")
      .attr("x", 100)
      .attr("y", 100)
      .attr("width", this.width)
      .attr("height", this.height)
      .attr("class", "node")
      .attr("data-id", this.id)
      .on("click", () => this.toggleExpandCollapse(this.element));

    // Set expanded or collapsed state
    if (this.interactionState.expanded) {
      this.element.classed("expanded", true);
    } else {
      this.element.classed("collapsed", true);
    }

    return this.element;
  }

  render(renderChildren = true){
    const container = renderContainer();

  }

  resize(boundingBox) {
    console.log('Resizing base.node', this.id, boundingBox);
    // d3.select(`[data-id='${this.id}']`).attr('viewBox', `${boundingBox.x} ${boundingBox.y} ${boundingBox.width} ${boundingBox.height}`);
    this.x = boundingBox.x;
    this.y = boundingBox.y;
    this.width = boundingBox.width;
    this.height = boundingBox.height;

    this.element
      .attr('x', this.x)
      .attr('y', this.y)
      .attr('width', this.width)
      .attr('height', this.height);


    // .attr('transform', `translate(${boundingBox.x}, ${boundingBox.y})`);
    // this.x = boundingBox.x;
    // this.y = boundingBox.y;
    // this.

    // this.render(false);
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



