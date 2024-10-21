import BaseNode from "./nodeBase.js";
import CircleNode from './nodeCircle.js';
import Simulation from './simulation.js';
import { getComputedDimensions } from "./utils.js";

export default class ParentNode  extends BaseNode {
  constructor(nodeData, metadata, svg) {
    super(nodeData, metadata, svg);
    this.simulation = null;
    this.container = null;
    this.containerMargin = {top:14,right:0,bottom:0,left:0};
  }


  // Method to render the parent node and its children
  async render(renderChildren = true){
    console.log('Rendering Parent Node:', this.id);
    super.renderContainer();

    // A group/parent node consists of it's own display, a border, background and a label
    // and a container where the node is rendered

    // Draw the node shape
  this.element
      .append("rect")
      .attr("class", (d) => `node shape parent`)
      .attr("width", this.data.width)
      .attr("height", this.data.height)
      .attr('x', -this.data.width / 2)
      .attr('y', -this.data.height / 2)
      .attr("rx", 5)
      .attr("ry", 5);

    // Append text to the top left corner of the
    // parent node
    this.element
      .append("text")
      .attr("x", (d) => -this.data.width / 2 + 4)
      .attr("y", (d) => -this.data.height / 2 + 4)
      .text(this.data.label)
      .attr("class", "node label parent");    

    const containerWidth = this.data.width - this.containerMargin.left - this.containerMargin.right;
    const containerHeight = this.data.height - this.containerMargin.top - this.containerMargin.bottom;
    this.container = this.element
      .append("g")
      .attr("class", (d) => `node container parent`)
      .attr("width", containerWidth)
      .attr("height", containerHeight)
      .attr('x', -containerWidth / 2 + this.containerMargin.left)
      .attr('y', -containerHeight / 2);// + this.containerMargin.top);

    // Set expanded or collapsed state
    if (this.interactionState.expanded) {
      this.element.classed('expanded', true);
      if (renderChildren)
        await this.renderChildren(this.container);
    } else {
      this.element.classed('collapsed', true);
    }
  }

  resize(boundingBox) {
    console.log('Resizing parent node', this.id, boundingBox);
    // add room for the label text on the top (left corner)
    // const labelMargin = 10;
    // console.log('         ', boundingBox.y);
    // boundingBox.y -= labelMargin;
    // console.log('         ', boundingBox.y);
    // boundingBox.height += labelMargin;
    boundingBox.x -= this.containerMargin.left;
    boundingBox.y -= this.containerMargin.top;
    boundingBox.width += this.containerMargin.left + this.containerMargin.right;
    boundingBox.height += this.containerMargin.top + this.containerMargin.bottom;

    for (let i = 0; i < this.data.children.length; i++) {
      console.log('  children:', this.data.children[i].x, this.data.children[i].y);
    }


    super.resize(boundingBox);

    // JS: why is g right, but rect not?
    // console.log(`Resizing parent.node ${this.id}, (${Math.round(boundingBox.x)},${Math.round(boundingBox.y)}) --> ${Math.round(boundingBox.width)}, ${Math.round(boundingBox.height)}`);
    // const computedDimension = getComputedDimensions(this.element);
    // console.log(`                comparison (${Math.round(boundingBox.x)},${Math.round(boundingBox.y)}) --> ${Math.round(boundingBox.width)} =?= ${Math.round(computedDimension.width)},  ${Math.round(boundingBox.height)} =?= ${Math.round(computedDimension.height)}`);
    // console.log(`                parent (${Math.round(this.data.x)},${Math.round(this.data.y)}) --> ${Math.round(this.data.width)} =?= ${Math.round(this.data.width)},  ${Math.round(this.data.height)} =?= ${Math.round(this.data.height)}`);


    this.element.select('rect')
      .attr('width', this.data.width)
      .attr('height', this.data.height)
      .attr('x', this.data.x)
      .attr('y', this.data.y + this.containerMargin.top);

    this.element.select('text')
      .attr("x", this.data.x)
      .attr("y", this.data.y + this.containerMargin.top)

    const containerWidth = this.data.width - this.containerMargin.left - this.containerMargin.right;
    const containerHeight = this.data.height - this.containerMargin.top - this.containerMargin.bottom;
    console.log('  container:', containerWidth, containerHeight, -containerHeight / 2 + this.containerMargin.top);
    this.container
        .attr("width", containerWidth)
        .attr("height", containerHeight)
        .attr('transform', `translate(0, ${this.containerMargin.top})`);
        // .attr('x', 0)
        // .attr('y', -40);
        // // .attr('x', -containerWidth / 2 + this.containerMargin.left)
        // .attr('y', -containerHeight / 2 + this.containerMargin.top);

    // console.log(`               ${this.data.id}, (${Math.round(this.data.x)},${Math.round(this.data.y)}) --> ${Math.round(this.data.width)}, ${Math.round(this.data.height)}`);        
  
      for (let i = 0; i < this.data.children.length; i++) {
        console.log('  children:', this.data.children[i].x, this.data.children[i].y);
      }
  }

  // Method to toggle expansion/collapse of the parent node
  toggleExpandCollapse(container) {
    this.interactionState.expanded = !this.interactionState.expanded;
    this.updateRender(container);
  }

  // Method to update the parent node rendering based on interaction state
  updateRender(container) {
    if (this.interactionState.expanded) {
      container.classed('collapsed', false).classed('expanded', true);
      this.renderChildren(container);
    } else {
      container.classed('expanded', false).classed('collapsed', true);
      this.removeChildren();
    }
  }

  // Method to render child nodes
  // renderChildren(parentContainer) {
  //   this.children.forEach(childData => {
  //     const childComponent = childData.type === 'group'
  //       ? new ParentNode(childData, this.metadata, this.svg)
  //       : new CircleNode(childData, this.metadata, this.svg);
  //     this.childComponents.push(childComponent);
  //     childComponent.render();

  //     // Position children relative to the parent node
  //     d3.select(`[data-id='${childData.id}']`).attr('transform', `translate(${Math.random() * 100 - 50}, ${Math.random() * 100 - 50})`);
  //   });
  // }

  async renderChildren(parentContainer) {
    console.log('    Rendering Children for Parent:', this.id, this.data.children);
    if (!this.data.children || this.data.children.length === 0) {
      return;
    }

    // for this stage, only add links between children
    var links = [];    
    for (let i = 0; i < this.data.children.length; i++) {
      if (i < this.data.children.length - 1) {
        links.push({
          source: this.data.children[i].id,
          target: this.data.children[i + 1].id
        });
      }
    }

    console.log('        Links:', links);


    // Create child components
  //   this.data.children.forEach(async node => {
  //     const childComponent = node.type === 'group'
  //       ? new ParentNode(node, this.metadata, parentContainer)
  //       : new CircleNode(node, this.metadata, parentContainer);
  //     console.log('        Rendering Child:', childComponent);
  //     await childComponent.render();
  //     console.log('        Rendering Child:', childComponent, ' <-- done');
  //   });

    for (const node of this.data.children) {
      var childComponent = node.type === 'group'
        ? new ParentNode(node, this.metadata, parentContainer)
        : new CircleNode(node, this.metadata, parentContainer);
    
      console.log('Rendering Child:', childComponent);
      await childComponent.render(); // Wait for each child to complete rendering
      console.log('Rendering Child:', childComponent, '<-- done');
      console.log(`               : ${childComponent.data.id} = (${Math.round(childComponent.data.x)},${Math.round(childComponent.data.y)}) --> ${Math.round(childComponent.data.width)}, ${Math.round(childComponent.data.height)}:      (${Math.round(childComponent.data.x - childComponent.data.width / 2)},${Math.round(childComponent.data.y - childComponent.data.height / 2)}),(${Math.round(childComponent.data.x + childComponent.data.width / 2)},${Math.round(childComponent.data.y + childComponent.data.height / 2)})`);	
      console.log(`               : ${node.id} = (${Math.round(node.x)},${Math.round(node.y)}) --> ${Math.round(node.width)}, ${Math.round(node.height)}:      (${Math.round(node.x - node.width / 2)},${Math.round(node.y - node.height / 2)}),(${Math.round(node.x + node.width / 2)},${Math.round(node.y + node.height / 2)})`);	
    }

    for (const node of this.data.children) {
      console.log(`               /\ ${node.id} = (${Math.round(node.x)},${Math.round(node.y)}) --> ${Math.round(node.width)}, ${Math.round(node.height)}:      (${Math.round(node.x - node.width / 2)},${Math.round(node.y - node.height / 2)}),(${Math.round(node.x + node.width / 2)},${Math.round(node.y + node.height / 2)})`);	
    }
    // Initialize force-directed simulation for children
    const simulation = new Simulation(this.data.children, links, this);
    await simulation.init();    
  }



  // Method to remove child nodes from the SVG
  removeChildren() {
    this.childComponents.forEach(childComponent => {
      d3.select(`[data-id='${childComponent.id}']`).remove();
    });
    this.childComponents = [];
  }
}