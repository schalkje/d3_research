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
    if (this.childNodes.length === 0) {
      return;
    }

    // Calculate bounding box of visible children only
    const visibleChildren = this.childNodes.filter(node => node.visible);
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    
    visibleChildren.forEach(node => {
      // Let each child report its effective size (handling collapsed state internally)
      const effectiveWidth = node.getEffectiveWidth ? node.getEffectiveWidth() : node.data.width;
      const effectiveHeight = node.getEffectiveHeight ? node.getEffectiveHeight() : node.data.height;
      const halfWidth = effectiveWidth / 2;
      const halfHeight = effectiveHeight / 2;
      
      minX = Math.min(minX, node.x - halfWidth);
      minY = Math.min(minY, node.y - halfHeight);
      maxX = Math.max(maxX, node.x + halfWidth);
      maxY = Math.max(maxY, node.y + halfHeight);
    });

    // Calculate container size needed
    const contentWidth = maxX - minX + this.containerMargin.left + this.containerMargin.right;
    const contentHeight = maxY - minY + this.containerMargin.top + this.containerMargin.bottom;
    
    // Resize container to accommodate all children
    this.resize({
      width: Math.max(this.minimumSize.width, contentWidth),
      height: Math.max(this.minimumSize.height, contentHeight)
    });
    
    // Notify parent nodes that this node's size has changed
    this.handleDisplayChange();

    // Position visible children relative to container center
    const containerCenterX = -this.data.width / 2 + this.containerMargin.left;
    const containerCenterY = -this.data.height / 2 + this.containerMargin.top;
    
    visibleChildren.forEach(node => {
      const x = containerCenterX + (node.x - minX) + node.data.width / 2;
      const y = containerCenterY + (node.y - minY) + node.data.height / 2;
      node.move(x, y);
    });
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
