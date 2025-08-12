import { BaseZone } from './BaseZone.js';

/**
 * Inner Container Zone - Dedicated content area below the header zone
 * Contains all child nodes and their content
 * Manages child node positioning and lifecycle
 * Handles layout algorithm execution
 * Provides coordinate system for child positioning
 */
export class InnerContainerZone extends BaseZone {
  constructor(node) {
    super(node, 'innerContainer');
    this.childContainer = null;
    this.childNodes = [];
    this.layoutAlgorithm = null;
    this.coordinateSystem = {
      origin: { x: 0, y: 0 },
      size: { width: 0, height: 0 },
      transform: 'translate(0, 0)'
    };
  }

  /**
   * Create the inner container zone element
   */
  createElement() {
    super.createElement();
    
    // Create visual border for the inner container zone
    this.borderElement = this.element.append('rect')
      .attr('class', 'zone-innerContainer')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', 0)
      .attr('height', 0);
  }

  /**
   * Setup inner container styling
   */
  setupStyling() {
    // Inner container is transparent, no styling needed
  }

  /**
   * Setup inner container interactions
   */
  setupInteractions() {
    // Inner container interactions are handled by child nodes
  }

  /**
   * Update inner container size
   */
  updateSize() {
    // Update coordinate system
    this.updateCoordinateSystem();
    
    // Update border element dimensions
    // Calculate actual size needed for children
    const childContentSize = this.calculateChildContentSize();
    
    if (this.borderElement) {
      // Use actual child content size instead of hardcoded values
      const rectWidth = Math.max(childContentSize.width, this.coordinateSystem.size.width);
      const rectHeight = Math.max(childContentSize.height, 1); // Minimum height of 1 to ensure visibility
      
      // Position the rect to encompass all children
      // The zone has a transform that positions it in the global coordinate system.
      // Children are positioned relative to (0,0) in this zone's coordinate system.
      // We need to position the rect so that after the zone transform is applied,
      // it appears at the same global position as the children.
      
      // Calculate the zone transform offset to determine rect positioning
      const headerHeight = this.getHeaderHeight();
      const marginZone = this.manager.getZone('margin');
      const margins = marginZone ? marginZone.getMargins() : { top: 8, bottom: 8, left: 8, right: 8 };
      
      // The zone transform moves it down by: containerTop + headerHeight + margins.top
      // where containerTop = -this.node.data.height / 2
      const containerTop = -this.node.data.height / 2;
      const zoneOffsetY = containerTop + headerHeight + margins.top;
      
      // Position the rect so that when the zone transform is applied,
      // it appears at y=0 in the global coordinate system (where children start)
      const rectX = -rectWidth / 2; // Center horizontally
      const rectY = -zoneOffsetY; // Compensate for zone transform
      

      
      this.borderElement
        .attr('width', rectWidth)
        .attr('height', rectHeight)
        .attr('x', rectX)
        .attr('y', rectY);
    }
    
    // Apply transform to the zone element itself (which contains child nodes)
    this.element.attr('transform', this.coordinateSystem.transform);
  }

  /**
   * Update coordinate system for child positioning
   */
  updateCoordinateSystem() {
    const headerHeight = this.getHeaderHeight();
    const marginZone = this.manager.getZone('margin');
    
    if (marginZone) {
      const margins = marginZone.getMargins();
      
      // Calculate inner container position relative to node center
      // Position below header zone + top margin for proper spacing
      const containerTop = -this.node.data.height / 2;
      const innerX = 0; // Center horizontally
      const innerY = containerTop + headerHeight + margins.top;
      
      // Calculate available space for content
      const availableWidth = Math.max(0, this.size.width - margins.left - margins.right);
      const availableHeight = Math.max(0, this.size.height - headerHeight - margins.top - margins.bottom);
      
      this.coordinateSystem = {
        origin: {
          x: 0, // Children are positioned relative to (0,0) in this zone
          y: 0  // Children are positioned relative to (0,0) in this zone
        },
        size: {
          width: availableWidth,
          height: availableHeight
        },
        transform: `translate(${innerX}, ${innerY})` // Transform moves the zone to the correct position
      };
    } else {
      // Fallback if margin zone is not available
      const defaultMargin = 8;
      const innerX = 0; // Center horizontally
      const innerY = -this.node.data.height / 2 + headerHeight + defaultMargin;
      
      const availableWidth = Math.max(0, this.size.width - defaultMargin * 2);
      const availableHeight = Math.max(0, this.size.height - headerHeight - defaultMargin * 2);
      
      this.coordinateSystem = {
        origin: { x: 0, y: 0 }, // Children are positioned relative to (0,0) in this zone
        size: { width: availableWidth, height: availableHeight },
        transform: `translate(${innerX}, ${innerY})` // Transform moves the zone to the correct position
      };
    }
  }

  /**
   * Get header height from header zone
   */
  getHeaderHeight() {
    const headerZone = this.manager.getZone('header');
    return headerZone ? headerZone.getHeaderHeight() : 0;
  }

  /**
   * Get inner container size - returns zero height when collapsed
   */
  getSize() {
    // When collapsed, inner container should have zero height
    if (this.node.collapsed) {
      return {
        width: this.size.width,
        height: 0
      };
    }
    
    // When expanded, return actual size
    return super.getSize();
  }

  /**
   * Get coordinate system for child positioning
   */
  getCoordinateSystem() {
    return { ...this.coordinateSystem };
  }

  /**
   * Add a child node to the inner container
   */
  addChild(childNode) {
    if (!this.childNodes.includes(childNode)) {
      this.childNodes.push(childNode);
      
      // Only update positions if the child node has been initialized
      if (childNode.element) {
        this.updateChildPositions();
      }
    }
  }

  /**
   * Remove a child node from the inner container
   */
  removeChild(childNode) {
    const index = this.childNodes.indexOf(childNode);
    if (index > -1) {
      this.childNodes.splice(index, 1);
      this.updateChildPositions();
    }
  }

  /**
   * Get all child nodes
   */
  getChildren() {
    return [...this.childNodes];
  }

  /**
   * Force update child positions (called after all children are initialized)
   */
  forceUpdateChildPositions() {
    // Wait a bit to ensure all children are fully initialized
    setTimeout(() => {
      this.updateChildPositions();
    }, 0);
  }

  /**
   * Update positions of all child nodes
   */
  updateChildPositions() {
    // Only update if we have initialized child nodes
    const initializedChildren = this.childNodes.filter(child => child.element);
    
    if (initializedChildren.length === 0) return;
    
    if (!this.layoutAlgorithm) {
      this.applyDefaultLayout();
    } else {
      this.layoutAlgorithm(initializedChildren, this.coordinateSystem);
    }
  }

  /**
   * Apply default layout algorithm
   */
  applyDefaultLayout() {
    const initializedChildren = this.childNodes.filter(child => child.element);
    if (initializedChildren.length === 0) return;
    
    // Default vertical stacking layout
    let currentY = 0;
    const spacing = this.node.nodeSpacing?.vertical || 10;
    
    initializedChildren.forEach((childNode, index) => {
      // Position children relative to the inner container origin (top-left)
      // Center horizontally within the available width
      const availableWidth = this.coordinateSystem.size.width;
      const x = (availableWidth - childNode.data.width) / 2; // Center horizontally
      const y = currentY;
      
      // Position children relative to the inner container's coordinate system
      // The inner container transform handles the offset from the lane node
      childNode.move(x, y);
      currentY += childNode.data.height + spacing;
    });
  }

  /**
   * Set layout algorithm for child positioning
   */
  setLayoutAlgorithm(algorithm) {
    this.layoutAlgorithm = algorithm;
    this.updateChildPositions();
  }

  /**
   * Get layout algorithm
   */
  getLayoutAlgorithm() {
    return this.layoutAlgorithm;
  }

  /**
   * Calculate size needed for all children
   */
  calculateChildContentSize() {
    const initializedChildren = this.childNodes.filter(child => child.element);
    if (initializedChildren.length === 0) {
      return { width: 0, height: 0 };
    }
    
    const spacing = this.node.nodeSpacing || { horizontal: 20, vertical: 10 };
    
    // Calculate bounding box of all children
    // Children are positioned relative to the inner container zone's coordinate system (0,0)
    // We need to calculate the bounding box based on their relative positions
    let minX = Infinity, minY = Infinity;
    let maxX = -Infinity, maxY = -Infinity;
    
    initializedChildren.forEach(childNode => {
      // Get the child's position relative to the inner container zone
      // This should be the position set by the layout algorithm
      const childX = childNode.x || 0;
      const childY = childNode.y || 0;
      const childWidth = childNode.data.width;
      const childHeight = childNode.data.height;
      
      // Calculate the bounding box
      const childLeft = childX - childWidth / 2; // Children are positioned by center
      const childRight = childX + childWidth / 2;
      const childTop = childY - childHeight / 2; // Children are positioned by center
      const childBottom = childY + childHeight / 2;
      
      minX = Math.min(minX, childLeft);
      minY = Math.min(minY, childTop);
      maxX = Math.max(maxX, childRight);
      maxY = Math.max(maxY, childBottom);
    });
    
    return {
      width: maxX - minX,
      height: maxY - minY
    };
  }

  /**
   * Position child nodes using vertical stacking layout
   */
  layoutVerticalStack() {
    const initializedChildren = this.childNodes.filter(child => child.element);
    if (initializedChildren.length === 0) return;
    
    const spacing = this.node.nodeSpacing?.vertical || 10;
    let currentY = 0;
    
    initializedChildren.forEach(childNode => {
      // Center horizontally within the available width
      const availableWidth = this.coordinateSystem.size.width;
      const x = (availableWidth - childNode.data.width) / 2; // Center horizontally
      const y = currentY;
      
      // Position children relative to the inner container's coordinate system
      childNode.move(x, y);
      currentY += childNode.data.height + spacing;
    });
  }

  /**
   * Position child nodes using horizontal row layout
   */
  layoutHorizontalRow() {
    const initializedChildren = this.childNodes.filter(child => child.element);
    if (initializedChildren.length === 0) return;
    
    const spacing = this.node.nodeSpacing?.horizontal || 20;
    let currentX = 0;
    
    initializedChildren.forEach(childNode => {
      const x = currentX;
      // Center vertically within the available height
      const availableHeight = this.coordinateSystem.size.height;
      const y = (availableHeight - childNode.data.height) / 2; // Center vertically
      
      // Position children relative to the inner container's coordinate system
      childNode.move(x, y);
      currentX += childNode.data.width + spacing;
    });
  }

  /**
   * Position child nodes using bounding box layout
   */
  layoutBoundingBox() {
    const initializedChildren = this.childNodes.filter(child => child.element);
    if (initializedChildren.length === 0) return;
    
    // Calculate bounding box
    const contentSize = this.calculateChildContentSize();
    
    // Center children within the container
    const centerX = this.coordinateSystem.size.width / 2;
    const centerY = this.coordinateSystem.size.height / 2;
    
    initializedChildren.forEach(childNode => {
      const x = centerX - contentSize.width / 2 + childNode.x;
      const y = centerY - contentSize.height / 2 + childNode.y;
      
      // Position children relative to the inner container's coordinate system
      childNode.move(x, y);
    });
  }

  /**
   * Get child container element
   */
  getChildContainer() {
    return this.element;
  }

  /**
   * Check if a position is within the inner container bounds
   */
  isWithinBounds(x, y) {
    return x >= this.coordinateSystem.origin.x &&
           x <= this.coordinateSystem.origin.x + this.coordinateSystem.size.width &&
           y >= this.coordinateSystem.origin.y &&
           y <= this.coordinateSystem.origin.y + this.coordinateSystem.size.height;
  }

  /**
   * Get bounds of the inner container
   */
  getBounds() {
    return {
      left: this.coordinateSystem.origin.x,
      top: this.coordinateSystem.origin.y,
      right: this.coordinateSystem.origin.x + this.coordinateSystem.size.width,
      bottom: this.coordinateSystem.origin.y + this.coordinateSystem.size.height,
      width: this.coordinateSystem.size.width,
      height: this.coordinateSystem.size.height
    };
  }

  /**
   * Update child visibility based on container state
   */
  updateChildVisibility(visible) {
    console.log(`InnerContainerZone updateChildVisibility: setting ${this.childNodes.length} children to visible=${visible}`);
    this.childNodes.forEach(childNode => {
      childNode.visible = visible;
      console.log(`  Child ${childNode.id}: visible = ${childNode.visible}, collapsed = ${childNode.collapsed}`);
      
      // For container children, only propagate visibility if the container is not collapsed
      // When making containers visible, their children should only become visible if the container is expanded
      if (childNode.isContainer && visible && !childNode.collapsed) {
        childNode.propagateVisibility(visible);
      } else if (childNode.isContainer && !visible) {
        // When hiding containers, always propagate hide regardless of collapsed state
        childNode.propagateVisibility(visible);
      }
    });
  }

  /**
   * Clean up child nodes
   */
  cleanupChildren() {
    this.childNodes.forEach(childNode => {
      if (childNode.destroy) {
        childNode.destroy();
      }
    });
    this.childNodes = [];
  }

  /**
   * Get child node by ID
   */
  getChildById(id) {
    return this.childNodes.find(child => child.id === id);
  }

  /**
   * Get child nodes by dataset ID
   */
  getChildrenByDatasetId(datasetId) {
    return this.childNodes.filter(child => child.data.datasetId === datasetId);
  }
} 