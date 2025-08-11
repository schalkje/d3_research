import { ContainerZone } from './ContainerZone.js';
import { HeaderZone } from './HeaderZone.js';
import { MarginZone } from './MarginZone.js';
import { InnerContainerZone } from './InnerContainerZone.js';

/**
 * Zone Manager - Central coordinator for all zones within a node
 * Manages zone creation, positioning, and lifecycle
 * Handles zone-to-zone communication and dependencies
 * Provides unified interface for zone operations
 */
export class ZoneManager {
  constructor(node) {
    this.node = node;
    this.zones = new Map();
    this.zoneOrder = ['container', 'header', 'margin', 'innerContainer'];
    this.initialized = false;
  }

  /**
   * Initialize all zones for the node
   */
  init() {
    if (this.initialized) return;

    // Create zones in order
    this.createZone('container', new ContainerZone(this.node));
    this.createZone('header', new HeaderZone(this.node));
    this.createZone('margin', new MarginZone(this.node));
    this.createZone('innerContainer', new InnerContainerZone(this.node));

    // Initialize zones
    this.zones.forEach(zone => zone.init());

    this.initialized = true;
  }

  /**
   * Create a zone and add it to the manager
   */
  createZone(name, zone) {
    this.zones.set(name, zone);
    zone.manager = this;
  }

  /**
   * Get a zone by name
   */
  getZone(name) {
    return this.zones.get(name);
  }

  /**
   * Get all zones
   */
  getAllZones() {
    return Array.from(this.zones.values());
  }

  /**
   * Update all zones
   */
  update() {
    this.zones.forEach(zone => zone.update());
  }

  /**
   * Resize all zones based on new dimensions
   */
  resize(width, height) {
    this.zones.forEach(zone => zone.resize(width, height));
  }

  /**
   * Get the container zone
   */
  get containerZone() {
    return this.getZone('container');
  }

  /**
   * Get the header zone
   */
  get headerZone() {
    return this.getZone('header');
  }

  /**
   * Get the margin zone
   */
  get marginZone() {
    return this.getZone('margin');
  }

  /**
   * Get the inner container zone
   */
  get innerContainerZone() {
    return this.getZone('innerContainer');
  }

  /**
   * Calculate total size based on all zones
   */
  calculateTotalSize() {
    const headerSize = this.headerZone.getSize();
    const margins = this.marginZone.getMargins();
    const innerContainerSize = this.innerContainerZone.getSize();

    // When collapsed, margins should not contribute to container height
    // Only header height and minimum size constraints should apply
    if (this.node.collapsed) {
      return {
        width: Math.max(headerSize.width, innerContainerSize.width) + margins.left + margins.right,
        height: headerSize.height // Only header height when collapsed
      };
    }

    // When expanded, include all zone sizes
    return {
      width: Math.max(headerSize.width, innerContainerSize.width) + margins.left + margins.right,
      height: headerSize.height + margins.top + innerContainerSize.height + margins.bottom
    };
  }

  /**
   * Get coordinate system for child positioning
   */
  getChildCoordinateSystem() {
    return this.innerContainerZone.getCoordinateSystem();
  }

  /**
   * Handle zone-specific events
   */
  handleEvent(eventType, event, zoneName = null) {
    if (zoneName) {
      const zone = this.getZone(zoneName);
      if (zone) {
        zone.handleEvent(eventType, event);
      }
    } else {
      // Propagate to all zones
      this.zones.forEach(zone => zone.handleEvent(eventType, event));
    }
  }

  /**
   * Clean up all zones
   */
  destroy() {
    this.zones.forEach(zone => zone.destroy());
    this.zones.clear();
    this.initialized = false;
  }
} 