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
    if (this.childNodes.length === 0) {
      return;
    }

    // Get zone manager and inner container zone
    const innerContainerZone = this.zoneManager?.innerContainerZone;
    if (!innerContainerZone) {
      // Fallback to legacy layout if zone system not available
      this.layoutColumnsLegacy();
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
      // Start with minimal padding from the left edge of the inner container
      // The inner container already accounts for margins, so use minimal padding
      const leftPadding = 0; // Minimal left padding
      let currentX = -coordinateSystem.size.width / 2 + leftPadding;

      // Only position visible children
      const visibleChildNodes = childNodes.filter(childNode => childNode.visible);

      visibleChildNodes.forEach(childNode => {
        const x = currentX + childNode.data.width / 2; // Position by center
        // Position children at a consistent Y position (like lanes do)
        const y = childNode.data.height / 2; // Position by center, starting from top

        // Position children relative to the inner container's coordinate system
        childNode.move(x, y);
        currentX += childNode.data.width + spacing;
      });
    });

    // Calculate required size for visible children only
    const visibleChildren = this.childNodes.filter(node => node.visible);
    const totalChildWidth = visibleChildren.reduce((sum, node) => sum + node.data.width, 0);
    const totalSpacing = visibleChildren.length > 1 ? (visibleChildren.length - 1) * this.nodeSpacing.horizontal : 0;
    const maxChildHeight = visibleChildren.length > 0 
      ? Math.max(...visibleChildren.map(node => node.data.height))
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
        const contentHeight = maxChildHeight;
        
        newSize = {
          width: Math.max(this.data.width, contentWidth + margins.left + margins.right),
          height: headerHeight + margins.top + contentHeight + margins.bottom
        };
      }
      
      // Set flag to prevent infinite recursion
      this._isResizing = true;
      this.resize(newSize);
      this._isResizing = false;
    }

    // Update child positions using zone system
    innerContainerZone.updateChildPositions();
  }

  layoutColumnsLegacy() {
    if (this.childNodes.length === 0) {
      return;
    }

    // Calculate total width needed for visible children only
    const visibleChildren = this.childNodes.filter(node => node.visible);
    const totalChildWidth = visibleChildren.reduce((sum, node) => sum + node.data.width, 0);
    const totalSpacing = visibleChildren.length > 1 ? (visibleChildren.length - 1) * this.nodeSpacing.horizontal : 0;
    
    // Calculate max height needed for visible children
    const maxChildHeight = visibleChildren.length > 0 
      ? Math.max(...visibleChildren.map(node => node.data.height))
      : 0;
    
    // Calculate container size needed
    const contentWidth = totalChildWidth + totalSpacing + this.containerMargin.left + this.containerMargin.right;
    const contentHeight = maxChildHeight + this.containerMargin.top + this.containerMargin.bottom;
    
    // Resize container to accommodate all children
    this.resize({
      width: Math.max(this.data.width, contentWidth),
      height: Math.max(this.data.height, contentHeight)
    });
    
    // Position visible children relative to container center, starting just below the label
    // Account for the container transform that's applied in BaseContainerNode.updateChildren()
    // The container is offset by: (containerMargin.left - containerMargin.right, containerMargin.top - containerMargin.bottom)
    const containerOffsetX = this.containerMargin.left - this.containerMargin.right;
    const containerOffsetY = this.containerMargin.top - this.containerMargin.bottom;
    
    let currentX = -this.data.width / 2 + this.containerMargin.left - containerOffsetX;
    visibleChildren.forEach((node) => {
      const x = currentX + node.data.width / 2;
      const y = -this.data.height / 2 + this.containerMargin.top - this.containerMargin.bottom - containerOffsetY + node.data.height / 2;
      node.move(x, y);
      currentX += node.data.width + this.nodeSpacing.horizontal;
    });
  }

  arrange() {
    console.log("Arranging ColumnsNode:", this.id);
    this.updateChildren();
  }
}
