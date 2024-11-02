import BaseContainerNode from "./nodeBaseContainer.js";
import CircleNode from "./nodeCircle.js";
import RectangularNode from "./nodeRect.js";
import Simulation from "./simulation.js";
import AdapterNode from "./nodeAdapter.js";
import FoundationNode from "./nodeFoundation.js";
import LaneNode from "./nodeLane.js";

export default class GroupNode extends BaseContainerNode {
  constructor(nodeData, parentElement, parentNode = null) {
    super(nodeData, parentElement, parentNode);
  }

  async runSimulation() {
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
    await this.simulation.init();
  }

  async renderChildren() {
    // console.log("    Rendering Children for Group:", this.id, this.data.children);
    if (!this.data.children || this.data.children.length === 0) {
      return;
    }

    // Create an array to hold all the render promises
    const renderPromises = [];

    for (const node of this.data.children) {
      // Create the childComponent instance based on node type
      const ComponentClass = typeToComponent[node.type] || typeToComponent.default;
      const childComponent = new ComponentClass(node, this.container, this);

      // console.log("Rendering Child:", childComponent);
      // console.log("               :", this.x, this.data.y);

      this.childNodes.push(childComponent);
      // Push the render promise into the array
      renderPromises.push(childComponent.render());
    }

    // Wait for all renders to complete in parallel
    await Promise.all(renderPromises);

    await this.runSimulation();

    this.layoutEdges();
  }

  async arrange() {
    console.log("Arranging GroupNode:", this.id);
    await this.runSimulation();
  }
}


const typeToComponent = {
  group: GroupNode,
  node: RectangularNode,
  rect: RectangularNode,
  circle: CircleNode,
  adapter: AdapterNode,
  foundation: FoundationNode,
  lane: LaneNode,
  default: CircleNode,
};