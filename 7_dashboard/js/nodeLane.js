import BaseContainerNode from "./nodeBaseContainer.js";
import { getComputedDimensions } from "./utils.js";
import { LayoutManager } from "./layoutManager.js";

export default class LaneNode extends BaseContainerNode {
  constructor(nodeData, parentElement, createNode, settings, parentNode = null) {
    // console.log("LaneNode constructor", nodeData);
    super(nodeData, parentElement, createNode, settings, parentNode);
  }

  updateChildren() {
    // console.log(
    //   `      nodeLane - updateChildren - Layout for Columns: ${this.id}, ${Math.round(this.data.width)}x${Math.round(
    //     this.data.height
    //   )}`,
    //   this.data.layout,
    //   this.childNodes.length
    // );
    
    // Don't call base method as it applies a transform that interferes with our positioning
    // super.updateChildren();
    
    // Apply our layout logic
    this.layoutLane();
  }

  layoutLane() {
    if (this.childNodes.length === 0) {
      return;
    }

    // Calculate the total height needed for all children
    const totalChildHeight = this.childNodes.reduce((sum, node) => sum + node.data.height, 0);
    const totalSpacing = this.childNodes.length > 1 ? (this.childNodes.length - 1) * this.nodeSpacing.vertical : 0;
    
    // Calculate the maximum width needed (max of all child widths)
    const maxChildWidth = Math.max(...this.childNodes.map(node => node.data.width));
    
    // Calculate container size needed
    const contentWidth = maxChildWidth + this.containerMargin.left + this.containerMargin.right;
    const contentHeight = totalChildHeight + totalSpacing + this.containerMargin.top + this.containerMargin.bottom;
    
    // Resize container to accommodate all children
    this.resize({
      width: Math.max(this.data.width, contentWidth),
      height: Math.max(this.data.height, contentHeight)
    });
    
    // Position children vertically, starting just below the label
    // Account for the container transform that's applied in BaseContainerNode.updateChildren()
    // The container is offset by: (containerMargin.left - containerMargin.right, containerMargin.top - containerMargin.bottom)
    const containerOffsetX = this.containerMargin.left - this.containerMargin.right;
    const containerOffsetY = this.containerMargin.top - this.containerMargin.bottom;
    
    let currentY = -this.data.height / 2 + this.containerMargin.top - this.containerMargin.bottom - containerOffsetY;
    this.childNodes.forEach((node) => {
      const x = -this.data.width / 2 + node.data.width / 2 + this.containerMargin.left - containerOffsetX;
      const y = currentY + node.data.height / 2;
      node.move(x, y);
      currentY += node.data.height + this.nodeSpacing.vertical;
    });
  }

  arrange() {
    console.log("Arranging LaneNode:", this.id);
    this.updateChildren();
  }
}