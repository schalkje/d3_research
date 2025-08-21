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
      .attr('class', 'header-background');
    
    // Create text element
    this.textElement = this.element.append('text')
      .attr('class', 'header-text')
      .attr('x', this.padding)
      .attr('y', 0)
      .attr('dy', '0.35em');
    
    // Create status indicator
    this.statusIndicator = this.element.append('circle')
      .attr('class', 'status-indicator')
      .attr('r', 3);
    
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
      .attr('class', 'zoom-button');
    
    // Button background
    this.zoomButton.append('circle')
      .attr('class', 'zoom-button-bg')
      .attr('r', 8);
    
    // Plus/minus icon
    this.zoomButton.append('text')
      .attr('class', 'zoom-icon')
      .attr('dy', '0.35em')
      .text('−'); // Default to minus (expanded)
  }

  /**
   * Setup header styling
   */
  setupStyling() {
    // Apply custom settings if provided, otherwise use CSS defaults
    if (this.node.settings.headerFill) {
      this.background.attr('fill', this.node.settings.headerFill);
    }
    if (this.node.settings.headerStroke) {
      this.background.attr('stroke', this.node.settings.headerStroke);
    }
    if (this.node.settings.headerStrokeWidth) {
      this.background.attr('stroke-width', this.node.settings.headerStrokeWidth);
    }
    
    if (this.node.settings.fontFamily) {
      this.textElement.attr('font-family', this.node.settings.fontFamily);
    }
    if (this.node.settings.fontSize) {
      this.textElement.attr('font-size', this.node.settings.fontSize);
    }
    if (this.node.settings.fontWeight) {
      this.textElement.attr('font-weight', this.node.settings.fontWeight);
    }
    if (this.node.settings.textColor) {
      this.textElement.attr('fill', this.node.settings.textColor);
    }
    
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
    
    // Update background - position relative to zone (which is already at top of container)
    this.background
      .attr('width', width)
      .attr('height', height)
      .attr('x', -width / 2)
      .attr('y', 0); // Position at top of zone (which is already at top of container)
    
    // Update text position and content
    this.updateText();
    
    // Update status indicator position
    this.updateStatusIndicatorPosition();
    
    // Update zoom button position
    this.updateZoomButtonPosition();
  }

  /**
   * Calculate the minimum width required by the header contents
   * Includes: left/right padding + full text width + status indicator + zoom button (if container) + small gaps
   */
  getMinimumWidth() {
    const text = this.node?.data?.label || this.node?.data?.name || '';
    let textWidth = 0;
    try {
      if (this.textElement && typeof this.textElement.node === 'function') {
        const tempElement = this.textElement.node().cloneNode(true);
        tempElement.textContent = text;
        tempElement.style.position = 'absolute';
        tempElement.style.left = '-99999px';
        tempElement.style.top = '-99999px';
        document.body.appendChild(tempElement);
        const rect = tempElement.getBoundingClientRect();
        textWidth = rect.width;
        document.body.removeChild(tempElement);
      } else {
        textWidth = text.length * 8; // Fallback approximation
      }
    } catch {
      textWidth = text.length * 8; // Fallback approximation
    }

    const leftPadding = this.padding || 0;
    const rightPadding = this.padding || 0;
    const indicatorDiameter = 6; // Matches updateStatusIndicatorPosition()
    const buttonDiameter = this.node?.isContainer ? 16 : 0; // Matches updateZoomButtonPosition()
    const gapBetweenTextAndIcons = (indicatorDiameter > 0 || buttonDiameter > 0) ? 8 : 0;
    const gapBetweenIndicatorAndButton = (indicatorDiameter > 0 && buttonDiameter > 0) ? 4 : 0;

    const minWidth =
      leftPadding +
      textWidth +
      gapBetweenTextAndIcons +
      indicatorDiameter +
      gapBetweenIndicatorAndButton +
      buttonDiameter +
      rightPadding;

    // Debug logging
    console.log(`HeaderZone getMinimumWidth - ${this.node?.data?.id}:`, {
      text,
      textWidth,
      leftPadding,
      gapBetweenTextAndIcons,
      indicatorDiameter,
      gapBetweenIndicatorAndButton,
      buttonDiameter,
      rightPadding,
      minWidth: Math.ceil(minWidth)
    });

    return Math.ceil(minWidth);
  }

  /**
   * Compute the reserved width on the right side (icons + gaps + right padding)
   * Must stay in sync with getMinimumWidth() and icon positioning
   */
  getReservedRightWidth() {
    const rightPadding = this.padding || 0;
    const indicatorDiameter = 6; // Matches updateStatusIndicatorPosition()
    const buttonDiameter = this.node?.isContainer ? 16 : 0; // Matches updateZoomButtonPosition()
    const gapBetweenTextAndIcons = (indicatorDiameter > 0 || buttonDiameter > 0) ? 8 : 0;
    const gapBetweenIndicatorAndButton = (indicatorDiameter > 0 && buttonDiameter > 0) ? 4 : 0;

    return (
      gapBetweenTextAndIcons +
      indicatorDiameter +
      gapBetweenIndicatorAndButton +
      buttonDiameter +
      rightPadding
    );
  }

  /**
   * Calculate text height based on content
   */
  calculateTextHeight() {
    if (!this.textElement) return this.minHeight;
    
    const text = this.node.data.label || this.node.data.name || '';
    if (!text) return this.minHeight;
    
    try {
      // Try to create temporary element to measure text height
      const tempElement = this.textElement.node().cloneNode(true);
      tempElement.textContent = text;
      document.body.appendChild(tempElement);
      
      const textHeight = tempElement.getBoundingClientRect().height;
      document.body.removeChild(tempElement);
      
      return Math.max(textHeight, this.minHeight);
    } catch (error) {
      // Fallback to minimum height if DOM measurement fails
      console.warn('Text height measurement failed, using minimum height fallback:', error);
      return this.minHeight;
    }
  }

  /**
   * Update text content and positioning
   */
  updateText() {
    if (!this.textElement) return;
    
    const text = this.node.data.label || this.node.data.name || '';
    // Reserve space on the right for icons + gaps + right padding so text never overlaps
    const reservedRight = this.getReservedRightWidth();
    const maxWidth = Math.max(0, this.size.width - this.padding - reservedRight);
    
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
    
    // Position text - align with header position (zone is already at top of container)
    const textHeight = this.calculateTextHeight();
    
    this.textElement
      .attr('x', -this.size.width / 2 + this.padding)
      .attr('y', textHeight / 2); // Center text vertically within header (relative to zone)
  }

  /**
   * Update status indicator
   */
  updateStatusIndicator() {
    if (!this.statusIndicator) return;
    
    const status = this.node.status;
    const statusColors = this.node.settings.statusColors || {};
    
    // Remove all status classes
    this.statusIndicator.classed('unknown ready updating updated error warning', false);
    
    if (statusColors[status] && statusColors[status].indicator) {
      // Apply custom indicator color if provided
      this.statusIndicator.attr('fill', statusColors[status].indicator);
    } else {
      // Apply CSS status class
      this.statusIndicator.classed(status.toLowerCase(), true);
    }
  }

  /**
   * Update status indicator position
   */
  updateStatusIndicatorPosition() {
    if (!this.statusIndicator) return;
    
    const height = this.calculateTextHeight();
    const indicatorSize = 6; // Diameter of indicator
    
    this.statusIndicator
      .attr('cx', this.size.width / 2 - indicatorSize - this.padding)
      .attr('cy', height / 2); // Center indicator vertically within header (relative to zone)
  }

  /**
   * Update zoom button position
   */
  updateZoomButtonPosition() {
    if (!this.zoomButton) return;
    
    const height = this.calculateTextHeight();
    const buttonSize = 16; // Diameter of button
    
    this.zoomButton
      .attr('transform', `translate(${this.size.width / 2 - buttonSize - this.padding}, ${height / 2})`);
    
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
      .classed('hover', true);
  }

  /**
   * Handle zoom button mouse leave
   */
  handleZoomMouseLeave(event) {
    this.zoomButton.select('.zoom-button-bg')
      .classed('hover', false);
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
    this.textElement.classed('hover', true);
    // Apply custom hover color if provided
    if (this.node.settings.textHoverColor) {
      this.textElement.attr('fill', this.node.settings.textHoverColor);
    }
  }

  /**
   * Handle text mouse leave
   */
  handleTextMouseLeave(event) {
    this.textElement.classed('hover', false);
    // Reset to custom color if provided, otherwise use CSS default
    if (this.node.settings.textColor) {
      this.textElement.attr('fill', this.node.settings.textColor);
    } else {
      this.textElement.attr('fill', null); // Reset to CSS default
    }
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