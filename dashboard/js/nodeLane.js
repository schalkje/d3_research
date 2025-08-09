import BaseContainerNode from "./nodeBaseContainer.js";
import { getComputedDimensions } from "./utils.js";
import { LayoutManager } from "./layoutManager.js";

export default class LaneNode extends BaseContainerNode {
  constructor(nodeData, parentElement, createNode, settings, parentNode = null) {
    // console.log("LaneNode constructor", nodeData);
    super(nodeData, parentElement, createNode, settings, parentNode);
  }

  updateChildren() {
    console.log(`LaneNode ${this.id} updateChildren called`);
    
    // Always call layoutLane to recalculate size and positioning
    this.layoutLane();
  }

  updateChildrenWithZoneSystem() {
    console.log(`LaneNode ${this.id} updateChildrenWithZoneSystem called`);
    
    // Call layoutLane to recalculate size and positioning when using zone system
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

    // Debug: Log child visibility states
    const debugVisibleChildren = this.childNodes.filter(node => node.visible);
    console.log(`LaneNode ${this.id} layoutLane:`, {
      totalChildren: this.childNodes.length,
      visibleChildren: debugVisibleChildren.length,
      childStates: this.childNodes.map(node => ({
        id: node.id,
        visible: node.visible,
        collapsed: node.collapsed,
        height: node.data.height,
        minimumSize: node.minimumSize
      })),
      visibleChildIds: debugVisibleChildren.map(node => node.id)
    });

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
    
    // Debug: Log size calculation
    console.log(`LaneNode ${this.id} size calculation:`, {
      visibleChildrenCount: visibleChildren.length,
      totalChildHeight,
      totalSpacing,
      maxChildWidth,
      currentSize: { width: this.data.width, height: this.data.height },
      visibleChildrenDetails: visibleChildren.map(node => ({
        id: node.id,
        height: node.data.height,
        collapsed: node.collapsed,
        minimumSize: node.minimumSize
      }))
    });
    
    // Get margin zone for size calculations
    const marginZone = this.zoneManager?.marginZone;
    const headerZone = this.zoneManager?.headerZone;
    const headerHeight = headerZone ? headerZone.getHeaderHeight() : 20;

    if (marginZone) {
      let newSize;
      
      if (this.collapsed) {
        // When collapsed, only use header height (no margins or content)
        newSize = {
          width: Math.max(this.data.width, headerHeight * 8 + 36), // Minimum width based on label
          height: headerHeight // Only header height when collapsed
        };
      } else {
        // When expanded, use full margin zone calculation
        const requiredSize = marginZone.calculateContainerSize(
          maxChildWidth,
          totalChildHeight + totalSpacing,
          headerHeight
        );

        newSize = {
          width: Math.max(this.data.width, requiredSize.width),
          height: requiredSize.height // Full size when expanded
        };
      }
      
      // Debug: Log resize operation
      console.log(`LaneNode ${this.id} resize:`, {
        collapsed: this.collapsed,
        oldSize: { width: this.data.width, height: this.data.height },
        newSize,
        headerHeight,
        visibleChildrenCount: visibleChildren.length
      });
      
      this.resize(newSize);
      
      // Debug: Log size after resize
      console.log(`LaneNode ${this.id} after resize:`, {
        newSize: { width: this.data.width, height: this.data.height }
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