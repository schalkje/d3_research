import BaseContainerNode from "./nodeBaseContainer.js";
import { getComputedDimensions } from "./utils.js";
import { LayoutManager } from "./layoutManager.js";

export default class LaneNode extends BaseContainerNode {
  constructor(nodeData, parentElement, createNode, settings, parentNode = null) {
    // console.log("LaneNode constructor", nodeData);
    super(nodeData, parentElement, createNode, settings, parentNode);
    
    // Prevent infinite recursion during resize operations
    this._isResizing = false;
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
    // Children report their effective size (handling collapsed state internally)
    const visibleChildren = this.childNodes.filter(node => node.visible);
    const totalChildHeight = visibleChildren.reduce((sum, node) => {
      // Let each child report its effective height
      const effectiveHeight = node.getEffectiveHeight ? node.getEffectiveHeight() : node.data.height;
      return sum + effectiveHeight;
    }, 0);
    // Calculate spacing between ALL visible children (including collapsed ones)
    // This ensures proper spacing even when some children are collapsed
    const totalSpacing = visibleChildren.length > 1 ? (visibleChildren.length - 1) * this.nodeSpacing.vertical : 0;
    const maxChildWidth = visibleChildren.length > 0 ? Math.max(...visibleChildren.map(node => {
      // Let each child report its effective width
      const effectiveWidth = node.getEffectiveWidth ? node.getEffectiveWidth() : node.data.width;
      return effectiveWidth;
    })) : 0;
    
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
        effectiveHeight: node.getEffectiveHeight ? node.getEffectiveHeight() : node.data.height,
        collapsed: node.collapsed,
        minimumSize: node.minimumSize
      }))
    });
    
    // Get margin zone for size calculations
    const marginZone = this.zoneManager?.marginZone;
    const headerZone = this.zoneManager?.headerZone;
    const headerHeight = headerZone ? headerZone.getHeaderHeight() : 20;

    if (marginZone && !this._isResizing) {
      let newSize;
      
      if (this.collapsed) {
        // When collapsed, only use header height (no margins or content)
        newSize = {
          width: Math.max(this.data.width, headerHeight * 8 + 36), // Minimum width based on label
          height: headerHeight // Only header height when collapsed
        };
      } else {
        // When expanded, use margin zone calculation with correct margins
        // This ensures proper sizing based on actual child content
        const margins = marginZone.getMargins();
        const contentWidth = maxChildWidth;
        const contentHeight = totalChildHeight + totalSpacing;
        
        newSize = {
          width: Math.max(this.minimumSize.width, contentWidth + margins.left + margins.right),
          height: headerHeight + margins.top + contentHeight + margins.bottom
        };
      }
      
      // Set flag to prevent infinite recursion
      this._isResizing = true;
      try {
        this.resize(newSize);
        // Notify parent nodes that this node's size has changed
        this.handleDisplayChange();
      } finally {
        this._isResizing = false;
      }
    }

    // Update child positions using zone system
    innerContainerZone.updateChildPositions();
  }



  arrange() {
    console.log("Arranging LaneNode:", this.id);
    this.updateChildren();
  }
}