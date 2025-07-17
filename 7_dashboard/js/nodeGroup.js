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

  layoutGroup() {
    if (this.childNodes.length === 0) {
      return;
    }

    // Calculate bounding box of all children
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    
    this.childNodes.forEach(node => {
      const halfWidth = node.data.width / 2;
      const halfHeight = node.data.height / 2;
      
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
      width: Math.max(this.data.width, contentWidth),
      height: Math.max(this.data.height, contentHeight)
    });

    // Position children relative to container center
    const containerCenterX = -this.data.width / 2 + this.containerMargin.left;
    const containerCenterY = -this.data.height / 2 + this.containerMargin.top;
    
    this.childNodes.forEach(node => {
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
