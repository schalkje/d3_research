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
  }

  // Method to initialize the force simulation
  init() {
    // make everything ready to run the simulation
    this.tickCounter = 0;
    this.resizeBoundingContainer();

    // initialize the simulation
    this.simulation = d3.forceSimulation(this.nodes)
      .force('link', d3.forceLink(this.links).id(d => d.id).distance(100))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(0, 0))
      .on('tick', () => this.tick())
      .on('end', () => this.end()); // Perform final resize when simulation ends
  }

  
  // Method to handle updating node positions on each tick of the simulation
  tick() {
    // Stop the simulation after a certain number of ticks for debugging purposes
    // if (this.tickCounter > 40) {
    //   console.log('Stopping simulation',this.tickCounter);
    //   this.stop();
    //   return;
    // }

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
    // this.boundingContainer.attr('width', boundingBox.width);
    // this.boundingContainer.attr('height', boundingBox.height);
    // this.boundingContainer.attr('viewBox', `${boundingBox.x} ${boundingBox.y} ${boundingBox.width} ${boundingBox.height}`);
  }

  // Method to perform the final resize when the simulation ends
  end() {
    console.log('Simulation ended');
    this.resizeBoundingContainer();
  }

  // Method to stop the simulation
  stop() {
    console.log('Stop simulation');
    if (this.simulation) {
      this.simulation.stop();
    }
  }
}