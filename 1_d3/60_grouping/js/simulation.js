// simulation.js
// Responsible for setting up and managing force-directed simulations using D3.js

// import * as d3 from '../libs/d3.min.js';
import '../libs/d3.min.js';

export default class Simulation {
  constructor(nodes, links) {
    this.nodes = nodes;
    this.links = links;
    this.simulation = null;
  }

  // Method to initialize the force simulation
  init() {
    this.simulation = d3.forceSimulation(this.nodes)
      .force('link', d3.forceLink(this.links).id(d => d.id).distance(100))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(0, 0))
      .on('tick', () => this.tickHandler());
  }

  // Method to handle updating node positions on each tick of the simulation
  tickHandler() {
    this.nodes.forEach(node => {
      d3.select(`[data-id='${node.id}']`).attr('transform', `translate(${node.x}, ${node.y})`);
    });
  }

  // Method to stop the simulation
  stop() {
    if (this.simulation) {
      this.simulation.stop();
    }
  }
}
