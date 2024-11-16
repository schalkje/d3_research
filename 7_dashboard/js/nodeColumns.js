import BaseContainerNode from "./nodeBaseContainer.js";
import RectangularNode from "./nodeRect.js";


export default class ColumnsNode extends BaseContainerNode {
  constructor(nodeData, parentElement, createNode, settings, parentNode = null) {
    if (!nodeData.layout) nodeData.layout = {};
    if (!nodeData.layout.minimumColumnWidth) nodeData.layout.minimumColumnWidth = 0;

    super(nodeData, parentElement, createNode, settings, parentNode);

    this.nodeSpacing = { horizontal: 20, vertical: 10 };
  }

  async renderChildren() {
    // console.log("    Rendering Children for Group:", this.id, this.data.children);
    if (!this.data.children || this.data.children.length === 0) {
      return;
    }

    // Create an array to hold all the render promises
    const renderPromises = [];

    for (const node of this.data.children) {
      // Create the childComponent instance based on node type
      const childComponent = this.createNode(node, this.container, this.settings, this);

      // console.log("Rendering Child:", childComponent);
      // console.log("               :", this.x, this.data.y, this.data.width, this.data.height);
      childComponent.x = 0;
      childComponent.y = 0;

      this.childNodes.push(childComponent);
      // Push the render promise into the array
      renderPromises.push(childComponent.render());
    }

    // Wait for all renders to complete in parallel
    await Promise.all(renderPromises);

    this.layoutChildren();
  }

  layoutChildren() {
    // console.log("layoutChildren - Layout for Columns:", this.id, this.data.layout);

    // each child is a column
    var x = 0;
    var y = 0;
    var containerHeight = 0;

    // position the nodes
    this.childNodes.forEach((node, index) => {
      // add spacing between nodes
      if (index > 0 )
        x += this.nodeSpacing.horizontal;

      x += Math.max(node.data.width/2, this.data.layout.minimumColumnWidth/2);

      // position the node
      node.move(x, y);

      x = x + Math.max(node.data.width/2, this.data.layout.minimumColumnWidth/2);

      // compute the height of the group container
      containerHeight = Math.max(containerHeight, node.data.height);
    });

    this.layoutEdges();


    // reposition the container
    this.resizeContainer({width: x, height: containerHeight});

    var containerX = -this.data.width/2 + this.containerMargin.left;
    var containerY = this.containerMargin.top/2;
    this.container
        .attr("transform", `translate(${containerX}, ${containerY})`);
    
  }

  async arrange() {
    console.log("Arranging ColumnsNode:", this.id);
    this.layoutChildren();
  }
}


