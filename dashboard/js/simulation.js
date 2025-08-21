// Responsible for setting up and managing force-directed simulations using D3.js
import '../libs/d3.min.js';
import { getComputedDimensions,computeBoundingBox } from './utils.js';
import { rectCollide } from './forceRectCollide.js';

export default class Simulation {
  constructor(containerNode) {

    this.containerNode = containerNode;
    this.simulation = null;
    this.tickCounter = 0; // Counter to control resizing frequency
    this.resizeFrequency = 10; // Resize every 10 ticks
    this.links=[];
  }

  // Method to initialize the force simulation
  init() {
    
    return new Promise((resolve) => {
    this.tickCounter = 0;
    this.containerNode.childNodes.forEach(node => {
      node.x = node.x;
      node.y = node.data.y;
      node.width = node.data.width;
      node.height = node.data.height;      
    });

    // initialize the simulation
    this.simulation = d3.forceSimulation(this.containerNode.childNodes)
      .force('center', d3.forceCenter(0, 0))
      .force('link', d3.forceLink(this.links).id(d => d.id).distance(d => {
        // return Math.min(d.source.width/2 + d.target.width/2,d.source.height/2 + d.target.height/2);
        return 100;
    }))
          .force('collision', rectCollide());

    this.resizeBoundingContainer();

    this.simulation
      .on('tick', () => this.tick(resolve))
      .on('end', () => this.end(resolve)); // Perform final resize when simulation ends
    });
  }

  
  // Method to handle updating node positions on each tick of the simulation
  tick(resolve) {

    this.containerNode.childNodes.forEach(node => {
      node.element.attr('transform', `translate(${node.x}, ${node.y})`);
    });

    // Increment tick counter
    this.tickCounter++;

    {
      this.resizeBoundingContainer();
    }
  }


  // Method to resize the bounding container to fit all nodes
  resizeBoundingContainer() {    
    if (this.containerNode.container) {
      const boundingBox = getComputedDimensions(this.containerNode.container);
      this.containerNode.resizeContainer(boundingBox);
      this.containerNode.positionContainer();
    }
    else
    {
      
    }
  }

  // Method to perform the final resize when the simulation ends
  end(resolve) {
    
    resolve();
    this.resizeBoundingContainer();
  }

  // Method to stop the simulation
  stop(resolve) {
    
    if (this.simulation) {
      this.simulation.stop();
      this.resizeBoundingContainer();
      resolve();
    }
  }
}