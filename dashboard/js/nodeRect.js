import BaseNode from "./nodeBase.js";
import { getTextWidth } from "./utils.js";

export default class RectangularNode extends BaseNode {
  constructor(nodeData, parentElement, settings, parentNode = null) {
    if (!nodeData.height) nodeData.height = 20;
    
    // Check layout mode
    const layoutMode = nodeData.layout?.layoutMode || 'default';
    
    if (layoutMode === 'auto-size') {
      // For auto-size, calculate width based on text
      const textWidth = getTextWidth(nodeData.label);
      nodeData.width = Math.max(textWidth + 20, 60); // Minimum width of 60
    } else {
      // For default and fixed-size, use provided width or default
      if (!nodeData.width) nodeData.width = 150;
      
      // Calculate text width and ensure minimum width
      const textWidth = getTextWidth(nodeData.label);
      const minWidth = Math.max(nodeData.width, textWidth + 20); // Add padding
      nodeData.width = minWidth;
    }

    super(nodeData, parentElement, settings, parentNode);
  }

  // Method to render the node using D3
  init(parentElement = null) {
    if (parentElement) this.parentElement = parentElement;
    super.init(parentElement);
    this.draw();
  }

  draw() {
    // Create a single rectangle for the node shape (no separate border needed)
    this.shape = this.element
      .append("rect")
      .attr("class", `${this.data.type} shape`)
      .attr("width", this.data.width)
      .attr("height", this.data.height)
      .attr("status", this.status)
      .attr("x", -this.data.width / 2)
      .attr("y", -this.data.height / 2);

    // Create label text element with proper truncation
    this.label = this.element
      .append("text")
      .attr("class", `${this.data.type} label`)
      .attr("x", 0)
      .attr("y", 0)
      .text(this.data.label);

    // Apply custom styling if provided
    this.applyCustomStyling();

    // Apply text truncation if needed
    this.truncateTextIfNeeded();
  }

  applyCustomStyling() {
    // Apply custom settings if provided, otherwise use CSS defaults
    if (this.settings.containerFill) {
      this.shape.attr('fill', this.settings.containerFill);
    }
    if (this.settings.containerStroke) {
      this.shape.attr('stroke', this.settings.containerStroke);
    }
    if (this.settings.containerStrokeWidth) {
      this.shape.attr('stroke-width', this.settings.containerStrokeWidth);
    }
    
    if (this.settings.fontFamily) {
      this.label.attr('font-family', this.settings.fontFamily);
    }
    if (this.settings.fontSize) {
      this.label.attr('font-size', this.settings.fontSize);
    }
    if (this.settings.fontWeight) {
      this.label.attr('font-weight', this.settings.fontWeight);
    }
    if (this.settings.textColor) {
      this.label.attr('fill', this.settings.textColor);
    }
  }

  truncateTextIfNeeded() {
    if (!this.label) return;

    const maxWidth = this.data.width - 20; // Leave 10px padding on each side
    const text = this.data.label;
    
    // Check if text needs truncation
    const textWidth = getTextWidth(text);
    if (textWidth <= maxWidth) {
      this.label.text(text);
      return;
    }

    // Truncate text with ellipsis
    let truncatedText = text;
    while (truncatedText.length > 0) {
      const testText = truncatedText + '...';
      const testWidth = getTextWidth(testText);
      if (testWidth <= maxWidth) {
        this.label.text(testText);
        return;
      }
      truncatedText = truncatedText.slice(0, -1);
    }

    // If even single character with ellipsis is too wide, show just ellipsis
    this.label.text('...');
  }

  redrawText(label, width) {
    // Update data properties
    if (label !== undefined) this.data.label = label;
    if (width !== undefined) this.data.width = width;
    
    // Check layout mode
    const layoutMode = this.data.layout?.layoutMode || 'default';
    
    if (layoutMode === 'auto-size' && label !== undefined) {
      // For auto-size, recalculate width based on text
      const textWidth = getTextWidth(label);
      const newWidth = Math.max(textWidth + 20, 60); // Minimum width of 60
      this.data.width = newWidth;
      
      // Update visual elements directly without triggering simulation
      this.element
        .select("rect")
        .attr("width", this.data.width)
        .attr("x", -this.data.width / 2);
      
      // Update text without truncation
      this.label.text(label);
    } else {
      // For default and fixed-size, or when width is specified
      if (label !== undefined) {
        const textWidth = getTextWidth(label);
        this.data.width = Math.max(this.data.width, textWidth + 20);
      }
      
      this.element
        .select("rect")
        .attr("width", this.data.width)
        .attr("x", -this.data.width / 2);

      // Apply text truncation
      this.truncateTextIfNeeded();
    }
  }

  get status() {
    return super.status;
  }
  
  set status(value) {
    super.status = value;
    if (this.shape) {
      this.shape.attr("status", value);
    }
    
    // Apply status-based styling
    const statusColors = this.settings.statusColors || {};
    if (statusColors[value]) {
      // Apply custom status colors if provided
      if (statusColors[value].border) {
        this.shape.attr("stroke", statusColors[value].border);
      }
      if (statusColors[value].fill) {
        this.shape.attr("fill", statusColors[value].fill);
      }
    }
    // CSS will handle default status styling via attribute selectors
  }

  update() {
    // Call parent update first
    super.update();
    
    // Update text if label has changed
    if (this.label && this.data.label !== this.label.text()) {
      this.handleTextUpdate();
    }
  }

  handleTextUpdate() {
    // Check layout mode
    const layoutMode = this.data.layout?.layoutMode || 'default';
    
    if (layoutMode === 'auto-size') {
      // For auto-size, recalculate width based on text
      const textWidth = getTextWidth(this.data.label);
      const newWidth = Math.max(textWidth + 20, 60); // Minimum width of 60
      
      if (newWidth !== this.data.width) {
        // Update data width
        this.data.width = newWidth;
        
        // Update visual elements directly without triggering simulation
        this.element
          .select("rect")
          .attr("width", this.data.width)
          .attr("x", -this.data.width / 2);
        
        // Update text without truncation
        this.label.text(this.data.label);
      } else {
        // Just update the text without truncation
        this.label.text(this.data.label);
      }
    } else {
      // For default and fixed-size, use truncation
      this.truncateTextIfNeeded();
    }
  }

  resize(size, forced = false) {
    // Update data properties first
    if (size.width !== undefined) this.data.width = size.width;
    if (size.height !== undefined) this.data.height = size.height;
    
    super.resize(size, forced);

    // Always update the visual elements
    this.element
      .select("rect")
      .attr("width", this.data.width)
      .attr("height", this.data.height)
      .attr("x", -this.data.width / 2)
      .attr("y", -this.data.height / 2);

    // Keep label centered
    this.element
      .select("text")
      .attr("x", 0)
      .attr("y", 0);
    
    // Check layout mode for text handling
    const layoutMode = this.data.layout?.layoutMode || 'default';
    if (layoutMode !== 'auto-size') {
      // Only truncate for non-auto-size layouts
      this.truncateTextIfNeeded();
    }
  }
}
