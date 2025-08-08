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
    
    // Always call layoutLane to recalculate size and positioning
    this.layoutLane();
  }

  layoutLane() {
    if (this.childNodes.length === 0) {
      return;
    }

    // Get zone manager and inner container zone
    const innerContainerZone = this.zoneManager?.innerContainerZone;
    if (!innerContainerZone) {
      // Zone system is required for lane layout
      console.warn('Zone system not available for lane node:', this.id);
      return;
    }

    // Set vertical stacking layout algorithm
    innerContainerZone.setLayoutAlgorithm((childNodes, coordinateSystem) => {
      if (childNodes.length === 0) return;

      const spacing = this.nodeSpacing?.vertical || 10;
      let currentY = 0;

      // Only position visible children
      const visibleChildNodes = childNodes.filter(childNode => childNode.visible);

      visibleChildNodes.forEach(childNode => {
        // Center horizontally within the inner container
        // Use center-based coordinate system for consistent positioning
        const x = 0; // Center horizontally (child nodes are now centered)
        const y = currentY + childNode.data.height / 2; // Position by center, not top

        // Position children relative to the inner container's coordinate system
        childNode.move(x, y);
        currentY += childNode.data.height + spacing;
      });
    });

    // Calculate required size for visible children only
    const visibleChildren = this.childNodes.filter(node => node.visible);
    const totalChildHeight = visibleChildren.reduce((sum, node) => sum + node.data.height, 0);
    const totalSpacing = visibleChildren.length > 1 ? (visibleChildren.length - 1) * this.nodeSpacing.vertical : 0;
    const maxChildWidth = visibleChildren.length > 0 ? Math.max(...visibleChildren.map(node => node.data.width)) : 0;
    
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



  arrange() {
    console.log("Arranging LaneNode:", this.id);
    this.updateChildren();
  }
}