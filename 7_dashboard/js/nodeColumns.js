import BaseContainerNode from "./nodeBaseContainer.js";
import RectangularNode from "./nodeRect.js";


export default class ColumnsNode extends BaseContainerNode {
  constructor(nodeData, parentElement, createNode, settings, parentNode = null) {
    if (!nodeData.layout) nodeData.layout = {};
    if (!nodeData.layout.minimumColumnWidth) nodeData.layout.minimumColumnWidth = 0;

    super(nodeData, parentElement, createNode, settings, parentNode);

    this.nodeSpacing = { horizontal: 20, vertical: 10 };
  }

   initChildren() {
    // console.log("      nodeColumns - initChildren    Rendering Children for Group:", this.id, this.data.children);
    if (!this.data.children || this.data.children.length === 0) {
      return;
    }

    

      for (const node of this.data.children) {
      // Create the childComponent instance based on node type

      var childComponent = this.getNode(node.id);
      if (childComponent == null) {
        childComponent = this.createNode(node, this.container, this.settings, this);
        this.childNodes.push(childComponent);

        // console.log("      nodeColumns - initChildren - Creating Node:", node.id, childComponent);
      }

      childComponent.x = 0;
      childComponent.y = 0;

      childComponent.init(this.container);
    }
    



    this.updateChildren();
  }

  updateChildren() {
    // console.log(`      nodeColumns - updateChildren - Layout for Columns: ${this.id}, ${Math.round(this.data.width)}x${Math.round(this.data.height)}`, this.data.layout, this.childNodes.length);
    this.suspenseDisplayChange = true;

    // each child is a column
    var x = 0; 
    var y = 0;
    var containerHeight = 0;

    // position the nodes
    this.childNodes.forEach((node, index) => {
      // console.log(`      nodeColumns - updateChildren - Layout for Node: ${node.data.label}, ${Math.round(node.data.width)}x${Math.round(node.data.height)}`, node.data.layout);
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

    // this.updateEdges();


    // reposition the container
    this.resizeContainer({width: x, height: containerHeight});

    var containerX = -this.data.width/2 + this.containerMargin.left;
    var containerY = this.containerMargin.top/2;
    this.container
        .attr("transform", `translate(${containerX}, ${containerY})`);

    this.suspenseDisplayChange = false;    
    // this.handleDisplayChange();
  }

   arrange() {
    // console.log("      nodeColumns - arrange Arranging ColumnsNode:", this.id);
    this.updateChildren();
  }
}


