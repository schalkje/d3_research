import BaseContainerNode from "./nodeBaseContainer.js";
import { LayoutManager } from "./layoutManager.js";

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
      console.error("Error in nestedCorrection_x", e);
      console.log("                           - ", this.x, this.data.width / 2,this.containerMargin.left);
    }
  }

  updateChildren() {
    // console.log(`      nodeColumns - updateChildren - Layout for Columns: ${this.id}, ${Math.round(this.data.width)}x${Math.round(this.data.height)}`, this.data.layout, this.childNodes.length);
    this.suspenseDisplayChange = true;

    // Don't call base method as it applies a transform that interferes with our positioning
    // super.updateChildren();

    // Calculate total width needed
    const totalChildWidth = this.childNodes.reduce((sum, node) => sum + node.data.width, 0);
    const totalSpacing = this.childNodes.length > 1 ? (this.childNodes.length - 1) * this.nodeSpacing.horizontal : 0;
    
    // Calculate max height needed
    const maxChildHeight = this.childNodes.length > 0 
      ? Math.max(...this.childNodes.map(node => node.data.height))
      : 0;
    
    // Calculate container size needed
    const contentWidth = totalChildWidth + totalSpacing + this.containerMargin.left + this.containerMargin.right;
    const contentHeight = maxChildHeight + this.containerMargin.top + this.containerMargin.bottom;
    
    // Resize container to accommodate all children
    this.resize({
      width: Math.max(this.data.width, contentWidth),
      height: Math.max(this.data.height, contentHeight)
    });
    
    // Position children relative to container center, starting just below the label
    // Account for the container transform that's applied in BaseContainerNode.updateChildren()
    // The container is offset by: (containerMargin.left - containerMargin.right, containerMargin.top - containerMargin.bottom)
    const containerOffsetX = this.containerMargin.left - this.containerMargin.right;
    const containerOffsetY = this.containerMargin.top - this.containerMargin.bottom;
    
    let currentX = -this.data.width / 2 + this.containerMargin.left - containerOffsetX;
    this.childNodes.forEach((node) => {
      const x = currentX + node.data.width / 2;
      const y = -this.data.height / 2 + this.containerMargin.top - this.containerMargin.bottom - containerOffsetY + node.data.height / 2;
      node.move(x, y);
      currentX += node.data.width + this.nodeSpacing.horizontal;
    });

    this.suspenseDisplayChange = false;
    this.handleDisplayChange();
  }

  arrange() {
    // console.log("      nodeColumns - arrange Arranging ColumnsNode:", this.id);
    this.updateChildren();
  }
}
