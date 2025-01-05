import BaseContainerNode from "./nodeBaseContainer.js";

export default class ColumnsNode extends BaseContainerNode {
  constructor(nodeData, parentElement, createNode, settings, parentNode = null) {
    nodeData.layout ??= {};
    nodeData.layout.minimumColumnWidth ??= 0;
    nodeData.layout.minimumSize ??= { height: 50, useRootRatio: false };

    super(nodeData, parentElement, createNode, settings, parentNode);    
  }

  get nestedCorrection_y() {
    // return this.y;
    return this.y  + this.containerMargin.top/2;
  }

  get nestedCorrection_x() {
    try{
      // console.warn("       get nestedCorrection_x", this.x, this.data.width / 2,this.containerMargin.left);
    return this.x - this.data.width / 2 + this.containerMargin.left;
    } catch(e) {
      console.log("Error in nestedCorrection_x", e);
      console.log("                           - ", this.x, this.data.width / 2,this.containerMargin.left);
    }
  }


  updateChildren() {
    console.log(`      nodeColumns - updateChildren - Layout for Columns: ${this.id}, ${Math.round(this.data.width)}x${Math.round(this.data.height)}`, this.data.layout, this.childNodes.length);
    this.suspenseDisplayChange = true;

    // each child is a column
    var x = 0;
    var y = 0;
    var containerWidth = 0;
    var containerHeight = 0;

    // position the nodes
    this.childNodes.forEach((node, index) => {
      // console.log(`      nodeColumns - updateChildren - Layout for Node: ${node.data.label}, ${Math.round(node.data.width)}x${Math.round(node.data.height)}`, node.data.layout);
      // add spacing between nodes
      if (containerWidth > 0) containerWidth += this.nodeSpacing.horizontal + node.data.width;
      else containerWidth += node.data.width;

      if (index > 0) x += this.nodeSpacing.horizontal;

      x += Math.max(node.data.width / 2, this.data.layout.minimumColumnWidth / 2);

      // position the node
      node.move(x, y);

      x = x + Math.max(node.data.width / 2, this.data.layout.minimumColumnWidth / 2);

      // compute the height of the group container
      containerHeight = Math.max(containerHeight, node.data.height);
    });

    // this.updateEdges();

    // reposition the container
    this.resizeContainer({ width: x, height: containerHeight });

    var containerX = -(containerWidth + this.containerMargin.left/2)/2;
    var containerY = this.containerMargin.top / 2;

    // var containerX = -this.data.width / 2 + this.containerMargin.left;
    // var containerY = this.containerMargin.top / 2;
    this.container.attr("transform", `translate(${containerX}, ${containerY})`);

    this.suspenseDisplayChange = false;
    this.handleDisplayChange();
  }

  arrange() {
    // console.log("      nodeColumns - arrange Arranging ColumnsNode:", this.id);
    this.updateChildren();
  }
}
