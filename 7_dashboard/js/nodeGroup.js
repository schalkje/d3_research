import BaseContainerNode from "./nodeBaseContainer.js";
import Simulation from "./simulation.js";


export default class GroupNode extends BaseContainerNode {
  constructor(nodeData, parentElement, createNode, settings, parentNode = null) {
    super(nodeData, parentElement, createNode, settings, parentNode);
  }

   runSimulation() {
    // for this stage, only add links between children
    var links = [];
    // for (let i = 0; i < this.data.children.length; i++) {
    //   if (i < this.data.children.length - 1) {
    //     links.push({
    //       source: this.data.children[i].id,
    //       target: this.data.children[i + 1].id,
    //     });
    //   }
    // }

    this.simulation = new Simulation(this);
     this.simulation.init();
  }

  //  renderChildren() {
  //   // console.log("    Rendering Children for Group:", this.id, this.data.children);
  //   if (!this.data.children || this.data.children.length === 0) {
  //     return;
  //   }



  //   for (const node of this.data.children) {
  //     // Create the childComponent instance based on node type
  //     const childComponent = this.createNode(node, this.container, this.settings, this);

  //     // console.log("Rendering Child:", childComponent);
  //     // console.log("               :", this.x, this.data.y);

  //     this.childNodes.push(childComponent);
  //     childComponent.render();
  //   }

    

  //    this.runSimulation();

  //   this.updateEdges();
  // }

   arrange() {
    // console.log("Arranging GroupNode:", this.id);
     this.runSimulation();
  }
}
