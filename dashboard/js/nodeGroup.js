import BaseContainerNode from "./nodeBaseContainer.js";
import Simulation from "./simulation.js";

export default class GroupNode extends BaseContainerNode {
  constructor(nodeData, parentElement, createNode, settings, parentNode = null) {
    super(nodeData, parentElement, createNode, settings, parentNode);
  }

  updateChildren() {
    // console.log("GroupNode - updateChildren", this.id, this.childNodes.length);
    
    // Call base method to set container transform
    super.updateChildren();
    
    // Apply our layout logic
    this.layoutGroup();
  }

  updateChildrenWithZoneSystem() {
    console.log(`GroupNode ${this.id} updateChildrenWithZoneSystem called`);
    
    // Call layoutGroup to recalculate size and positioning when using zone system
    this.layoutGroup();
  }

  layoutGroup() {
    if (this.childNodes.length === 0) return;

    // Use inner container zone when available to center children around (0,0)
    const innerContainerZone = this.zoneManager?.innerContainerZone;
    const marginZone = this.zoneManager?.marginZone;
    const headerZone = this.zoneManager?.headerZone;

    const visibleChildren = this.childNodes.filter(node => node.visible);
    if (visibleChildren.length === 0) return;

    // Simple center-based layout: keep existing relative positions, but normalize to center
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    visibleChildren.forEach(node => {
      const effectiveWidth = node.getEffectiveWidth ? node.getEffectiveWidth() : node.data.width;
      const effectiveHeight = node.getEffectiveHeight ? node.getEffectiveHeight() : node.data.height;
      minX = Math.min(minX, node.x - effectiveWidth / 2);
      minY = Math.min(minY, node.y - effectiveHeight / 2);
      maxX = Math.max(maxX, node.x + effectiveWidth / 2);
      maxY = Math.max(maxY, node.y + effectiveHeight / 2);
    });

    const contentWidth = maxX - minX;
    const contentHeight = maxY - minY;

    // Normalize child positions to be centered around (0,0)
    const contentCenterX = minX + contentWidth / 2;
    const contentCenterY = minY + contentHeight / 2;
    visibleChildren.forEach(node => {
      const dx = node.x - contentCenterX;
      const dy = node.y - contentCenterY;
      node.move(dx, dy);
    });

    // If zone system exists, size container and zone to fit content + margins
    if (innerContainerZone && marginZone && headerZone) {
      const margins = marginZone.getMargins();
      const headerHeight = headerZone.getHeaderHeight();
      const newSize = {
        width: Math.max(this.minimumSize.width, contentWidth + margins.left + margins.right),
        height: Math.max(this.minimumSize.height, headerHeight + margins.top + contentHeight + margins.bottom)
      };
      this.resize(newSize);
      this.handleDisplayChange();

      // Resize inner zone to tightly contain children (with small padding)
      const padding = 10;
      innerContainerZone.resize(contentWidth + padding * 2, contentHeight + padding * 2);
      innerContainerZone.updateCoordinateSystem();
    } else {
      // Fallback: size to content + container margins
      const newSize = {
        width: Math.max(this.minimumSize.width, contentWidth + this.containerMargin.left + this.containerMargin.right),
        height: Math.max(this.minimumSize.height, contentHeight + this.containerMargin.top + this.containerMargin.bottom)
      };
      this.resize(newSize);
      this.handleDisplayChange();
    }
  }

  runSimulation() {
    // for this stage, only add links between children
    var links = [];
    // for (let i = 0; i < this.data.children.length; i++) {
    //   if (i < this.data.children.length - 1) {
    //     links.push({
    //       source: this.data.children[i].id,
    //       source: this.data.children[i + 1].id,
    //     });
    //   }
    // }

    this.simulation = new Simulation(this);
    this.simulation.init();
  }

  arrange() {
    // console.log("Arranging GroupNode:", this.id);
    this.runSimulation();
  }
}
