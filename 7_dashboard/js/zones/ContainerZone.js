import { BaseZone } from './BaseZone.js';

/**
 * Container Zone - The outermost boundary of the node
 * Handles drag and drop operations, selection state, and visual feedback
 * Defines the node's bounding box and position in parent coordinate system
 */
export class ContainerZone extends BaseZone {
  constructor(node) {
    super(node, 'container');
    this.shape = null;
    this.border = null;
  }

  /**
   * Create the container zone element
   */
  createElement() {
    super.createElement();
    
    // Create the main container shape
    this.shape = this.element.append('rect')
      .attr('class', 'container-shape')
      .attr('rx', 4) // Rounded corners
      .attr('ry', 4)
      .attr('x', 0)
      .attr('y', 0);
    
    // Create border for selection feedback
    this.border = this.element.append('rect')
      .attr('class', 'container-border')
      .attr('rx', 4)
      .attr('ry', 4)
      .attr('fill', 'none')
      .attr('stroke-width', 2)
      .attr('stroke', 'transparent')
      .attr('x', 0)
      .attr('y', 0);
  }

  /**
   * Setup container styling
   */
  setupStyling() {
    this.shape
      .attr('fill', this.node.settings.containerFill || '#f8f9fa')
      .attr('stroke', this.node.settings.containerStroke || '#dee2e6')
      .attr('stroke-width', this.node.settings.containerStrokeWidth || 1);
    
    this.border
      .attr('stroke-width', this.node.settings.selectionBorderWidth || 2);
  }

  /**
   * Setup container interactions
   */
  setupInteractions() {
    // Handle selection state changes
    this.updateSelectionState();
    
    // Handle status changes
    this.updateStatusState();
  }

  /**
   * Update container size
   */
  updateSize() {
    if (!this.shape || !this.border) return;
    
    const width = this.size.width;
    const height = this.size.height;
    
    // Update main shape - center it
    this.shape
      .attr('width', width)
      .attr('height', height)
      .attr('x', -width / 2)
      .attr('y', -height / 2);
    
    // Update border (slightly larger for selection feedback)
    const borderOffset = 2;
    this.border
      .attr('width', width + borderOffset * 2)
      .attr('height', height + borderOffset * 2)
      .attr('x', -width / 2 - borderOffset)
      .attr('y', -height / 2 - borderOffset);
  }

  /**
   * Update container styling
   */
  updateStyling() {
    this.updateSelectionState();
    this.updateStatusState();
  }

  /**
   * Update selection state visual feedback
   */
  updateSelectionState() {
    if (!this.border) return;
    
    if (this.node.selected) {
      this.border
        .attr('stroke', this.node.settings.selectionColor || '#007bff')
        .attr('stroke-width', this.node.settings.selectionBorderWidth || 2);
    } else {
      this.border
        .attr('stroke', 'transparent');
    }
  }

  /**
   * Update status state visual feedback
   */
  updateStatusState() {
    if (!this.shape) return;
    
    // Apply status-based styling
    const status = this.node.status;
    const statusColors = this.node.settings.statusColors || {};
    
    if (statusColors[status]) {
      this.shape
        .attr('stroke', statusColors[status].border || this.node.settings.containerStroke)
        .attr('fill', statusColors[status].fill || this.node.settings.containerFill);
    }
  }

  /**
   * Handle container events
   */
  handleEvent(eventType, event) {
    switch (eventType) {
      case 'click':
        this.handleClick(event);
        break;
      case 'dblclick':
        this.handleDblClick(event);
        break;
      case 'mouseenter':
        this.handleMouseEnter(event);
        break;
      case 'mouseleave':
        this.handleMouseLeave(event);
        break;
    }
  }

  /**
   * Handle click events
   */
  handleClick(event) {
    // Propagate to node click handler
    if (this.node.handleClicked) {
      this.node.handleClicked(event, this.node);
    }
  }

  /**
   * Handle double click events
   */
  handleDblClick(event) {
    // Propagate to node double click handler
    if (this.node.handleDblClicked) {
      this.node.handleDblClicked(event, this.node);
    }
  }

  /**
   * Handle mouse enter events
   */
  handleMouseEnter(event) {
    this.shape
      .attr('stroke-width', (this.node.settings.containerStrokeWidth || 1) + 1);
  }

  /**
   * Handle mouse leave events
   */
  handleMouseLeave(event) {
    this.shape
      .attr('stroke-width', this.node.settings.containerStrokeWidth || 1);
  }

  /**
   * Get container bounds for collision detection
   */
  getCollisionBounds() {
    return this.getBounds();
  }

  /**
   * Check if container is colliding with another container
   */
  isCollidingWith(otherContainer) {
    const bounds1 = this.getCollisionBounds();
    const bounds2 = otherContainer.getCollisionBounds();
    
    return !(bounds1.right < bounds2.left || 
             bounds1.left > bounds2.right || 
             bounds1.bottom < bounds2.top || 
             bounds1.top > bounds2.bottom);
  }
} 