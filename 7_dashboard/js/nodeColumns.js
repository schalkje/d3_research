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

    // Use zone-based layout system
    this.layoutColumns();

    this.suspenseDisplayChange = false;
    this.handleDisplayChange();
  }

  layoutColumns() {
    if (this.childNodes.length === 0) {
      return;
    }

    // Get zone manager and inner container zone
    const innerContainerZone = this.zoneManager?.innerContainerZone;
    if (!innerContainerZone) {
      // Fallback to old layout if zone system not available
      this.layoutColumnsLegacy();
      return;
    }

    // Set horizontal row layout algorithm
    innerContainerZone.setLayoutAlgorithm((childNodes, coordinateSystem) => {
      if (childNodes.length === 0) return;

      const spacing = this.nodeSpacing?.horizontal || 20;
      let currentX = 0;

      childNodes.forEach(childNode => {
        const x = currentX;
        // Center vertically within the inner container
        const y = coordinateSystem.size.height / 2 - childNode.data.height / 2;

        childNode.move(x, y);
        currentX += childNode.data.width + spacing;
      });
    });

    // Calculate required size for children
    const totalChildWidth = this.childNodes.reduce((sum, node) => sum + node.data.width, 0);
    const totalSpacing = this.childNodes.length > 1 ? (this.childNodes.length - 1) * this.nodeSpacing.horizontal : 0;
    const maxChildHeight = this.childNodes.length > 0 
      ? Math.max(...this.childNodes.map(node => node.data.height))
      : 0;
    
    // Get margin zone for size calculations
    const marginZone = this.zoneManager?.marginZone;
    const headerZone = this.zoneManager?.headerZone;
    const headerHeight = headerZone ? headerZone.getHeaderHeight() : 20;

    if (marginZone) {
      const requiredSize = marginZone.calculateContainerSize(
        totalChildWidth + totalSpacing,
        maxChildHeight,
        headerHeight
      );

      // Resize container to accommodate all children
      this.resize({
        width: Math.max(this.data.width, requiredSize.width),
        height: Math.max(this.data.height, requiredSize.height)
      });
    }

    // Update child positions using zone system
    innerContainerZone.updateChildPositions();
  }

  layoutColumnsLegacy() {
    if (this.childNodes.length === 0) {
      return;
    }

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
  }

  arrange() {
    // console.log("      nodeColumns - arrange Arranging ColumnsNode:", this.id);
    this.updateChildren();
  }
}
