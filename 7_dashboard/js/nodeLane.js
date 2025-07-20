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
    
    // Use zone-based layout system
    this.layoutLane();
  }

  layoutLane() {
    if (this.childNodes.length === 0) {
      return;
    }

    // Get zone manager and inner container zone
    const innerContainerZone = this.zoneManager?.innerContainerZone;
    if (!innerContainerZone) {
      // Fallback to old layout if zone system not available
      this.layoutLaneLegacy();
      return;
    }

    // Set vertical stacking layout algorithm
    innerContainerZone.setLayoutAlgorithm((childNodes, coordinateSystem) => {
      if (childNodes.length === 0) return;

      const spacing = this.nodeSpacing?.vertical || 10;
      let currentY = 0;

      childNodes.forEach(childNode => {
        // Center horizontally within the inner container
        // The coordinate system origin is at the top-left of the inner container
        const availableWidth = coordinateSystem.size.width;
        const x = (availableWidth - childNode.data.width) / 2; // Center horizontally
        const y = currentY;

        childNode.move(x, y);
        currentY += childNode.data.height + spacing;
      });
    });

    // Calculate required size for children
    const totalChildHeight = this.childNodes.reduce((sum, node) => sum + node.data.height, 0);
    const totalSpacing = this.childNodes.length > 1 ? (this.childNodes.length - 1) * this.nodeSpacing.vertical : 0;
    const maxChildWidth = Math.max(...this.childNodes.map(node => node.data.width));
    
    // Get margin zone for size calculations
    const marginZone = this.zoneManager?.marginZone;
    const headerZone = this.zoneManager?.headerZone;
    const headerHeight = headerZone ? headerZone.getHeaderHeight() : 20;

    if (marginZone) {
      const requiredSize = marginZone.calculateContainerSize(
        maxChildWidth,
        totalChildHeight + totalSpacing,
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

  layoutLaneLegacy() {
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
    
    // Simplified positioning: center children horizontally and stack vertically
    let currentY = 0; // Start at the top of the inner container
    
    this.childNodes.forEach((node) => {
      // Center horizontally (x = 0 means center of container)
      const x = 0;
      // Position vertically with proper spacing
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