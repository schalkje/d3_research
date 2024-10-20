
// simulation.js
// Responsible for setting up and managing force-directed simulations using D3.js

// import * as d3 from '../libs/d3.min.js';
import '../libs/d3.min.js';
import { computeBoundingBox } from './utils.js';

export default class Simulation {
  constructor(nodes, links, containerNode) {
    this.nodes = nodes;
    this.links = links;
    this.containerNode = containerNode;
    this.simulation = null;
    this.tickCounter = 0; // Counter to control resizing frequency
    this.resizeFrequency = 10; // Resize every 10 ticks
    console.log('---------------------------------------------------------------');
    console.log('-- Simulation created');
    console.log('--    nodes', this.nodes);
    console.log('--    links', this.links);
    console.log('--    container', this.containerNode);
  }

  // Method to initialize the force simulation
  init() {
    // make everything ready to run the simulation
    this.tickCounter = 0;

    // initialize the simulation
    this.simulation = d3.forceSimulation(this.nodes)
      .force('link', d3.forceLink(this.links).id(d => d.id).distance(100))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(0, 0));

    // this.resizeBoundingContainer();

    this.simulation
      .on('tick', () => this.tick())
      .on('end', () => this.end()); // Perform final resize when simulation ends
  }

  
  // Method to handle updating node positions on each tick of the simulation
  tick() {
    if ( this.containerNode.id == 'root') {
      console.log('Skip simulation',this.containerNode.id, this.tickCounter, this.nodes);
      this.stop(); return;
    }

    // Stop the simulation after a certain number of ticks for debugging purposes
    if (this.tickCounter >= 1) {
      console.log('Stopping simulation',this.containerNode.id, this.tickCounter, this.nodes);
      this.stop();
      return;
    }
    console.log('>>>>     Simulation tick', this.tickCounter,'     <<<<');

    this.nodes.forEach(node => {
      d3.select(`[data-id='${node.id}']`).attr('transform', `translate(${node.x}, ${node.y})`);
    });

    // Increment tick counter
    this.tickCounter++;

    // Resize bounding container every N ticks
    // if (this.tickCounter % this.resizeFrequency === 0) 
      {
      this.resizeBoundingContainer();
    }
  }


  // Method to resize the bounding container to fit all nodes
  resizeBoundingContainer() {    
    const boundingBox = computeBoundingBox(this.nodes);
    console.log('Resizing bounding container', boundingBox, this.containerNode);
    this.containerNode.resize(boundingBox);
  }

  // Method to perform the final resize when the simulation ends
  end() {
    console.log('Simulation ended');
    this.resizeBoundingContainer();
  }

  // Method to stop the simulation
  stop() {
    console.log('>>>>     Stop simulation     <<<<');
    if (this.simulation) {
      this.simulation.stop();
    }
  }
}