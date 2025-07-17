import { BaseZone } from './BaseZone.js';

/**
 * Header Zone - Dedicated zone at the top of the node
 * Contains the node's label, title, and header elements
 * Handles text rendering, overflow, and styling
 * Manages header-specific interactions (click, hover)
 * Supports status indicators, icons, and zoom buttons
 */
export class HeaderZone extends BaseZone {
  constructor(node) {
    super(node, 'header');
    this.textElement = null;
    this.background = null;
    this.statusIndicator = null;
    this.zoomButton = null;
    this.minHeight = 10; // Minimum height constraint
    this.padding = 4; // Left padding for text
  }

  /**
   * Create the header zone element
   */
  createElement() {
    super.createElement();
    
    // Create background rectangle
    this.background = this.element.append('rect')
      .attr('class', 'header-background')
      .attr('rx', 4)
      .attr('ry', 4);
    
    // Create text element
    this.textElement = this.element.append('text')
      .attr('class', 'header-text')
      .attr('x', this.padding)
      .attr('y', 0)
      .attr('dy', '0.35em')
      .attr('text-anchor', 'start');
    
    // Create status indicator
    this.statusIndicator = this.element.append('circle')
      .attr('class', 'status-indicator')
      .attr('r', 3)
      .attr('fill', 'transparent');
    
    // Create zoom button (for container nodes)
    if (this.node.isContainer) {
      this.createZoomButton();
    }
  }

  /**
   * Create zoom button for container nodes
   */
  createZoomButton() {
    this.zoomButton = this.element.append('g')
      .attr('class', 'zoom-button')
      .style('cursor', 'pointer');
    
    // Button background
    this.zoomButton.append('circle')
      .attr('class', 'zoom-button-bg')
      .attr('r', 8)
      .attr('fill', '#ffffff')
      .attr('stroke', '#dee2e6')
      .attr('stroke-width', 1);
    
    // Plus/minus icon
    this.zoomButton.append('text')
      .attr('class', 'zoom-icon')
      .attr('text-anchor', 'middle')
      .attr('dy', '0.35em')
      .attr('font-size', '12px')
      .attr('font-weight', 'bold')
      .text('−'); // Default to minus (expanded)
  }

  /**
   * Setup header styling
   */
  setupStyling() {
    // Background styling
    this.background
      .attr('fill', this.node.settings.headerFill || '#ffffff')
      .attr('stroke', this.node.settings.headerStroke || '#dee2e6')
      .attr('stroke-width', this.node.settings.headerStrokeWidth || 1);
    
    // Text styling
    this.textElement
      .attr('font-family', this.node.settings.fontFamily || 'Arial, sans-serif')
      .attr('font-size', this.node.settings.fontSize || '12px')
      .attr('font-weight', this.node.settings.fontWeight || 'normal')
      .attr('fill', this.node.settings.textColor || '#333333');
    
    // Status indicator styling
    this.updateStatusIndicator();
  }

  /**
   * Setup header interactions
   */
  setupInteractions() {
    // Setup zoom button interactions
    if (this.zoomButton) {
      this.zoomButton
        .on('click', (event) => this.handleZoomClick(event))
        .on('mouseenter', (event) => this.handleZoomMouseEnter(event))
        .on('mouseleave', (event) => this.handleZoomMouseLeave(event));
    }
    
    // Setup text interactions
    this.textElement
      .on('click', (event) => this.handleTextClick(event))
      .on('mouseenter', (event) => this.handleTextMouseEnter(event))
      .on('mouseleave', (event) => this.handleTextMouseLeave(event));
  }

  /**
   * Update header size
   */
  updateSize() {
    if (!this.background || !this.textElement) return;
    
    const width = this.size.width;
    const height = this.calculateTextHeight();
    
    // Position header at the top of the node (0,0 relative to node center)
    // The header should be positioned at the top edge of the container
    const containerHeight = this.node.data.height;
    const headerY = -containerHeight / 2; // Top of the container
    
    // Update background - position at top of container
    this.background
      .attr('width', width)
      .attr('height', height)
      .attr('x', -width / 2)
      .attr('y', headerY);
    
    // Update text position and content
    this.updateText();
    
    // Update status indicator position
    this.updateStatusIndicatorPosition();
    
    // Update zoom button position
    this.updateZoomButtonPosition();
  }

  /**
   * Calculate text height based on content
   */
  calculateTextHeight() {
    if (!this.textElement) return this.minHeight;
    
    const text = this.node.data.label || this.node.data.name || '';
    if (!text) return this.minHeight;
    
    // Create temporary element to measure text height
    const tempElement = this.textElement.node().cloneNode(true);
    tempElement.textContent = text;
    document.body.appendChild(tempElement);
    
    const textHeight = tempElement.getBoundingClientRect().height;
    document.body.removeChild(tempElement);
    
    return Math.max(textHeight, this.minHeight);
  }

  /**
   * Update text content and positioning
   */
  updateText() {
    if (!this.textElement) return;
    
    const text = this.node.data.label || this.node.data.name || '';
    const maxWidth = this.size.width - this.padding * 2;
    
    // Handle text overflow with ellipsis
    if (text.length > 0) {
      this.textElement.text(text);
      
      // Check if text needs ellipsis
      const textLength = this.textElement.node().getComputedTextLength();
      if (textLength > maxWidth) {
        // Truncate text with ellipsis
        let truncatedText = text;
        while (truncatedText.length > 0 && 
               this.textElement.text(truncatedText + '...').node().getComputedTextLength() > maxWidth) {
          truncatedText = truncatedText.slice(0, -1);
        }
        this.textElement.text(truncatedText + '...');
      }
    } else {
      this.textElement.text('');
    }
    
    // Position text - align with header position at top of container
    const textHeight = this.calculateTextHeight();
    const containerHeight = this.node.data.height;
    const headerY = -containerHeight / 2; // Top of the container
    
    this.textElement
      .attr('x', -this.size.width / 2 + this.padding)
      .attr('y', headerY + textHeight / 2); // Center text vertically within header
  }

  /**
   * Update status indicator
   */
  updateStatusIndicator() {
    if (!this.statusIndicator) return;
    
    const status = this.node.status;
    const statusColors = this.node.settings.statusColors || {};
    
    if (statusColors[status]) {
      this.statusIndicator
        .attr('fill', statusColors[status].indicator || statusColors[status].border || '#666666');
    } else {
      this.statusIndicator.attr('fill', 'transparent');
    }
  }

  /**
   * Update status indicator position
   */
  updateStatusIndicatorPosition() {
    if (!this.statusIndicator) return;
    
    const height = this.calculateTextHeight();
    const indicatorSize = 6; // Diameter of indicator
    const containerHeight = this.node.data.height;
    const headerY = -containerHeight / 2; // Top of the container
    
    this.statusIndicator
      .attr('cx', this.size.width / 2 - indicatorSize - this.padding)
      .attr('cy', headerY + height / 2); // Center indicator vertically within header
  }

  /**
   * Update zoom button position
   */
  updateZoomButtonPosition() {
    if (!this.zoomButton) return;
    
    const height = this.calculateTextHeight();
    const buttonSize = 16; // Diameter of button
    const containerHeight = this.node.data.height;
    const headerY = -containerHeight / 2; // Top of the container
    
    this.zoomButton
      .attr('transform', `translate(${this.size.width / 2 - buttonSize - this.padding}, ${headerY + height / 2})`);
    
    // Update zoom button state
    this.updateZoomButtonState();
  }

  /**
   * Update zoom button state (plus/minus)
   */
  updateZoomButtonState() {
    if (!this.zoomButton) return;
    
    const icon = this.zoomButton.select('.zoom-icon');
    if (this.node.collapsed) {
      icon.text('+'); // Plus for collapsed
    } else {
      icon.text('−'); // Minus for expanded
    }
  }

  /**
   * Update header styling
   */
  updateStyling() {
    this.updateStatusIndicator();
    this.updateZoomButtonState();
  }

  /**
   * Handle zoom button click
   */
  handleZoomClick(event) {
    event.stopPropagation();
    
    if (this.node.isContainer) {
      this.node.collapsed = !this.node.collapsed;
    }
  }

  /**
   * Handle zoom button mouse enter
   */
  handleZoomMouseEnter(event) {
    this.zoomButton.select('.zoom-button-bg')
      .attr('fill', '#f8f9fa');
  }

  /**
   * Handle zoom button mouse leave
   */
  handleZoomMouseLeave(event) {
    this.zoomButton.select('.zoom-button-bg')
      .attr('fill', '#ffffff');
  }

  /**
   * Handle text click
   */
  handleTextClick(event) {
    // Propagate to node click handler
    if (this.node.handleClicked) {
      this.node.handleClicked(event, this.node);
    }
  }

  /**
   * Handle text mouse enter
   */
  handleTextMouseEnter(event) {
    this.textElement
      .attr('fill', this.node.settings.textHoverColor || '#007bff');
  }

  /**
   * Handle text mouse leave
   */
  handleTextMouseLeave(event) {
    this.textElement
      .attr('fill', this.node.settings.textColor || '#333333');
  }

  /**
   * Get header height
   */
  getHeaderHeight() {
    return this.calculateTextHeight();
  }

  /**
   * Update zone position - override to position header at top of node
   */
  updatePosition() {
    if (this.element) {
      // Position header at the top of the node (0,0 relative to node center)
      // The header should be positioned at the top edge of the container
      const containerHeight = this.node.data.height;
      const headerY = -containerHeight / 2; // Top of the container
      
      // Position the header at the top of the container, centered horizontally
      this.element.attr('transform', `translate(0, ${headerY})`);
    }
  }

  /**
   * Resize the zone - override to use container width
   */
  resize(width, height) {
    // Header should span the full width of the container
    this.size.width = width;
    this.size.height = this.calculateTextHeight();
    this.update();
  }
} 