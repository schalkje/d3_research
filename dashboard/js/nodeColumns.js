import BaseContainerNode from "./nodeBaseContainer.js";
import { getComputedDimensions } from "./utils.js";
import { LayoutManager } from "./layoutManager.js";

export default class ColumnsNode extends BaseContainerNode {
  constructor(nodeData, parentElement, createNode, settings, parentNode = null) {
    // Set up default layout configuration for columns node
    nodeData.layout ??= {};
    nodeData.layout.minimumColumnWidth ??= 0;
    const minHeight = 10; // header + top margin + min child + bottom margin
    nodeData.layout.minimumSize ??= { height: minHeight, useRootRatio: false };

    super(nodeData, parentElement, createNode, settings, parentNode);
    
    // Prevent infinite recursion during resize operations
    this._isResizing = false;
  }

  get nestedCorrection_y() {
    return this.y + this.containerMargin.top / 2;
  }

  get nestedCorrection_x() {
    try {
      return this.x - this.data.width / 2 + this.containerMargin.left;
    } catch(e) {
      console.error("Error in nestedCorrection_x", e);
      console.log("Data:", this.x, this.data.width / 2, this.containerMargin.left);
      return 0; // Fallback value
    }
  }

  updateChildren() {
    console.log(`ColumnsNode ${this.id} updateChildren called`);
    
    // Always call layoutColumns to recalculate size and positioning
    this.layoutColumns();
  }

  updateChildrenWithZoneSystem() {
    console.log(`ColumnsNode ${this.id} updateChildrenWithZoneSystem called`);
    
    // Call layoutColumns to recalculate size and positioning when using zone system
    this.layoutColumns();
  }

  layoutColumns() {
    // Always run sizing logic, even with zero children, so container height is at least header + margins

    // Get zone manager and inner container zone
    const innerContainerZone = this.zoneManager?.innerContainerZone;
    if (!innerContainerZone) {
      // Zone system is required for columns layout
      console.warn('Zone system not available for columns node:', this.id);
      return;
    }

    // Debug: Log child visibility states
    const debugVisibleChildren = this.childNodes.filter(node => node.visible);
    console.log(`ColumnsNode ${this.id} layoutColumns:`, {
      totalChildren: this.childNodes.length,
      visibleChildren: debugVisibleChildren.length,
      childStates: this.childNodes.map(node => ({
        id: node.id,
        visible: node.visible,
        collapsed: node.collapsed,
        width: node.data.width,
        height: node.data.height,
        minimumSize: node.minimumSize
      })),
      visibleChildIds: debugVisibleChildren.map(node => node.id)
    });

    // Set horizontal row layout algorithm
    innerContainerZone.setLayoutAlgorithm((childNodes, coordinateSystem) => {
      if (childNodes.length === 0) return;

      const spacing = this.nodeSpacing?.horizontal || 20;
      const leftPadding = 0;
      let currentX = -coordinateSystem.size.width / 2 + leftPadding;

      const visibleChildNodes = childNodes.filter(childNode => childNode.visible);

      visibleChildNodes.forEach(childNode => {
        const x = currentX + childNode.data.width / 2;
        const y = 0;
        childNode.move(x, y);
        currentX += childNode.data.width + spacing;
      });
    });

    // Calculate required size for visible children only
    // Children report their effective size (handling collapsed state internally)
    const visibleChildren = this.childNodes.filter(node => node.visible);
    const totalChildWidth = visibleChildren.reduce((sum, node) => {
      // Let each child report its effective width
      const effectiveWidth = node.getEffectiveWidth ? node.getEffectiveWidth() : node.data.width;
      console.log(`ColumnsNode ${this.id} child ${node.id} width calculation:`, {
        nodeId: node.id,
        dataWidth: node.data.width,
        effectiveWidth: effectiveWidth,
        collapsed: node.collapsed,
        minimumSize: node.minimumSize
      });
      return sum + effectiveWidth;
    }, 0);
    // Calculate spacing between ALL visible children (including collapsed ones)
    // This ensures proper spacing even when some children are collapsed
    const totalSpacing = visibleChildren.length > 1 ? (visibleChildren.length - 1) * this.nodeSpacing.horizontal : 0;
    const maxChildHeight = visibleChildren.length > 0 
      ? Math.max(...visibleChildren.map(node => {
          const effectiveHeight = node.getEffectiveHeight ? node.getEffectiveHeight() : node.data.height;
          return effectiveHeight;
        }))
      : 0;
    
    // Debug: Log size calculation
    console.log(`ColumnsNode ${this.id} size calculation:`, {
      visibleChildrenCount: visibleChildren.length,
      totalChildWidth,
      totalSpacing,
      maxChildHeight,
      currentSize: { width: this.data.width, height: this.data.height },
      visibleChildrenDetails: visibleChildren.map(node => ({
        id: node.id,
        width: node.data.width,
        height: node.data.height,
        effectiveWidth: node.getEffectiveWidth ? node.getEffectiveWidth() : node.data.width,
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
        const contentWidth = totalChildWidth + totalSpacing;
        const contentHeight = Math.max(maxChildHeight, 0);
        
        newSize = {
          width: Math.max(this.minimumSize.width, contentWidth + margins.left + margins.right),
          height: headerHeight + margins.top + Math.max(contentHeight, 0) + margins.bottom
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
    console.log("Arranging ColumnsNode:", this.id);
    this.updateChildren();
  }
}
