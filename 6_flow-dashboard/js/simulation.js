// Responsible for setting up and managing force-directed simulations using D3.js
import '../libs/d3.min.js';
import { getComputedDimensions,computeBoundingBox } from './utils.js';
// import { forceBoundary } from './forceBoundary.js';
import { rectCollide } from './forceRectCollide.js';

export default class Simulation {
  constructor(nodes, links, containerNode) {
    for (const node of nodes) {
      console.log(`               >  sim node > ${node.id} = (${Math.round(node.x)},${Math.round(node.y)}) --> ${Math.round(node.width)}, ${Math.round(node.height)}:      (${Math.round(node.x - node.width / 2)},${Math.round(node.y - node.height / 2)}),(${Math.round(node.x + node.width / 2)},${Math.round(node.y + node.height / 2)})`);	
    }

    this.nodes = nodes;
    this.links = links;
    this.containerNode = containerNode;
    this.simulation = null;
    this.tickCounter = 0; // Counter to control resizing frequency
    this.resizeFrequency = 10; // Resize every 10 ticks
    console.log('---------------------------------------------------------------');
    console.log(`-- Simulation created "${this.containerNode.id}"`);
    console.log('--    nodes', this.nodes);
    console.log('--    links', this.links);
    console.log('--    container', this.containerNode);
  }

  // Method to initialize the force simulation
  init() {
    return new Promise((resolve) => {
    // make everything ready to run the simulation
    this.tickCounter = 0;

    // initialize the simulation
    this.simulation = d3.forceSimulation(this.nodes)
      .force('center', d3.forceCenter(0, 0))
      .force('link', d3.forceLink(this.links).id(d => d.id).distance(d => {
        console.log('distance',d);
        // return Math.min(d.source.width/2 + d.target.width/2,d.source.height/2 + d.target.height/2);
        return 100;
    }))
      // .force('charge', d3.forceManyBody()) //.strength(-1300))
      .force('collision', rectCollide()); // Use the custom collision force

    this.resizeBoundingContainer();

    this.simulation
      .on('tick', () => this.tick(resolve))
      .on('end', () => this.end(resolve)); // Perform final resize when simulation ends
    });
  }

  
  // Method to handle updating node positions on each tick of the simulation
  tick(resolve) {
    // if ( this.containerNode.id == 'root') {
    //   console.log('Skip simulation',this.containerNode.id, this.tickCounter, this.nodes);
    //   this.stop(resolve); return;
    // }

    // Stop the simulation after a certain number of ticks for debugging purposes
    // if (this.tickCounter >= 100) {
    //   console.log('Stopping simulation',this.containerNode.id, this.tickCounter, this.nodes);
    //   this.stop(resolve);
    //   return;
    // }
    // console.log('>>>>     Simulation tick', this.tickCounter,'     <<<<');

    this.nodes.forEach(node => {
      // console.log(`               <  tick > ${node.id} = (${Math.round(node.x)},${Math.round(node.y)}) --> ${Math.round(node.width)}, ${Math.round(node.height)}:      (${Math.round(node.x - node.width / 2)},${Math.round(node.y - node.height / 2)}),(${Math.round(node.x + node.width / 2)},${Math.round(node.y + node.height / 2)})`);	
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
    // const boundingBox = computeBoundingBox(this.nodes);
    if (this.containerNode.container) {
      const boundingBox = getComputedDimensions(this.containerNode.container);
      // console.log('Resizing bounding container', boundingBox, this.containerNode);
      this.containerNode.resize(boundingBox);
    }
  }

  // Method to perform the final resize when the simulation ends
  end(resolve) {
    console.log(`Simulation ended for ${this.containerNode.data.id}`);
    // console.log(`               ${this.containerNode.data.id}, (${Math.round(this.containerNode.data.x)},${Math.round(this.containerNode.data.y)}) --> ${Math.round(this.containerNode.data.width)}, ${Math.round(this.containerNode.data.height)}`);
    // getComputedDimensions(this.containerNode.container);
    this.resizeBoundingContainer();
    // console.log(`               ${this.containerNode.data.id}, (${Math.round(this.containerNode.data.x)},${Math.round(this.containerNode.data.y)}) --> ${Math.round(this.containerNode.data.width)}, ${Math.round(this.containerNode.data.height)}`);
    resolve();
  }

  // Method to stop the simulation
  stop(resolve) {
    console.log('>>>>     Stop simulation     <<<<');
    if (this.simulation) {
      this.simulation.stop();
      this.resizeBoundingContainer();
      resolve();
    }
  }
}