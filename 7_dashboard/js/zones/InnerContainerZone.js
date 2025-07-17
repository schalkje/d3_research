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
    
    // Create child container for positioning child nodes
    this.childContainer = this.element.append('g')
      .attr('class', 'child-container');
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
    if (!this.childContainer) return;
    
    // Update coordinate system
    this.updateCoordinateSystem();
    
    // Apply transform to child container
    this.childContainer.attr('transform', this.coordinateSystem.transform);
  }

  /**
   * Update coordinate system for child positioning
   */
  updateCoordinateSystem() {
    const headerHeight = this.getHeaderHeight();
    const marginZone = this.manager.getZone('margin');
    
    if (marginZone) {
      const marginSize = marginZone.getSize();
      
      // Calculate inner container position relative to node center
      const innerX = -this.size.width / 2 + marginSize.left;
      const innerY = -this.size.height / 2 + headerHeight + marginSize.top;
      
      this.coordinateSystem = {
        origin: {
          x: innerX,
          y: innerY
        },
        size: {
          width: this.size.width - marginSize.left - marginSize.right,
          height: this.size.height - headerHeight - marginSize.top - marginSize.bottom
        },
        transform: `translate(${innerX}, ${innerY})`
      };
    } else {
      // Fallback if margin zone is not available
      const innerY = -this.size.height / 2 + headerHeight;
      this.coordinateSystem = {
        origin: { x: -this.size.width / 2, y: innerY },
        size: { width: this.size.width, height: this.size.height - headerHeight },
        transform: `translate(${-this.size.width / 2}, ${innerY})`
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
      const x = 0; // Center horizontally
      const y = currentY;
      
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
    let minX = Infinity, minY = Infinity;
    let maxX = -Infinity, maxY = -Infinity;
    
    initializedChildren.forEach(childNode => {
      const childX = childNode.x;
      const childY = childNode.y;
      const childWidth = childNode.data.width;
      const childHeight = childNode.data.height;
      
      minX = Math.min(minX, childX);
      minY = Math.min(minY, childY);
      maxX = Math.max(maxX, childX + childWidth);
      maxY = Math.max(maxY, childY + childHeight);
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
      const x = 0; // Center horizontally
      const y = currentY;
      
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
      const y = 0; // Center vertically
      
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
      
      childNode.move(x, y);
    });
  }

  /**
   * Get child container element
   */
  getChildContainer() {
    return this.childContainer;
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
    this.childNodes.forEach(childNode => {
      childNode.visible = visible;
      if (childNode.isContainer) {
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