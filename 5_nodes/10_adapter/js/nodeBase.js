import { getComputedDimensions } from "./utils.js";
import { computeConnectionPoints } from "./utilPath.js";

export default class BaseNode {
  constructor(nodeData, parentElement, settings, parentNode = null) {
    this.data = nodeData;
    this.parentElement = parentElement;
    this.parentNode = parentNode;
    this.settings = settings;
    this.computeConnectionPoints = computeConnectionPoints;

    this.id = nodeData.id;

    this.edges = {
      incoming: [],
      outgoing: [],
    }

    this.element = null;
    this.simulation = null;
    this.layoutDebug = true;

    this.data.interactionState ??= { expanded: true };

    // Set default values for x, y, width, and height
    this.x ??= 0;
    this.y ??= 0;
    this.data.width ??= 60;
    this.data.height ??= 60;
  }

  move(x,y) {
    console.log(`          > move ${this.id}, (x:${x},y:${y})`);
    this.x = x;
    this.y = y;
    this.element.attr("transform", `translate(${this.x}, ${this.y})`);
  }

  renderContainer() {
    // console.log("Rendering Base Node renderContainer:", this.id, this.x, this.data.y, this.parentElement);
    this.element = this.parentElement
      .append("g")
      // .attr("width", this.data.width) // a g element doesn't have width/height attributes
      // .attr("height", this.data.height)
      .attr("class", "node")
      .attr("id", this.id)
      .on("click", (event) => {
        console.log("Clicked on Adapter Node [BASE]:", this.id, event);
        if (event) event.stopPropagation();
        this.toggleExpandCollapse(this.element);
      });
    // .call(d3.drag()
    //   .on("start", (event) => this.drag_started(event, this))
    //   .on("drag", (event) => this.dragged(event, this))
    //   .on("end", (event) => this.drag_ended(event, this)));

    // show the center stip
    if ( this.settings.showCenterMark )
      this.element
        .append("circle")
        .attr("class", "centermark")
        .attr("r", 3)
        .attr("cx", 0)
        .attr("cy", 0);	
    
    if (this.settings.showConnectionPoints) {
      const connectionPoints = this.computeConnectionPoints(0,0,this.data.width, this.data.height);
      Object.values(connectionPoints).forEach((point) => {
        this.element
          .append("circle")
          .attr("class", `connection-point side-${point.side}`)
          .attr("cx", point.x)
          .attr("cy", point.y)
          .attr("r", 2);
      });
    }

    // Set expanded or collapsed state
    if (this.data.interactionState.expanded) {
      this.element.classed("expanded", true);
    } else {
      this.element.classed("collapsed", true);
    }

    return this.element;
  }

  render() {
    renderContainer();
  }

  resize(size) {
    // node base has no elements of it's own, so just update the data

    // const oldSize = {width: this.data.width, height: this.data.height};
    // const elementDimensions = getComputedDimensions(this.element);
    // console.log("    nodeBase.resize  > ", this.id, this.x, this.data.y, this.data.width, this.data.height, elementDimensions.width, elementDimensions.height, size.width, size.height);
    this.data.width = size.width;
    this.data.height = size.height;

    // // this.x -= this.data.width / 2 - oldSize.width / 2;
    // // this.data.y -= this.data.height / 2 - oldSize.height / 2;

    // this.data.width = elementDimensions.width;
    // this.data.height = elementDimensions.height;

    // this.x += oldSize.width - elementDimensions.width;
    // this.data.y -= elementDimensions.height / 2 - oldSize.height / 2;

    // var ctm = this.container.node().getCTM(); console.log(`    nodeBase.resize  > before ctm a=${ctm.a}, b=${ctm.b}, c=${ctm.c}, d=${ctm.d}, e=${ctm.e}, f=${ctm.f}`);

    // this.element.attr("transform", `translate(${this.x}, ${this.data.y})`);
    //  ctm = this.container.node().getCTM(); console.log(`    nodeBase.resize  >  after ctm a=${ctm.a}, b=${ctm.b}, c=${ctm.c}, d=${ctm.d}, e=${ctm.e}, f=${ctm.f}`);

    this.layoutConnectionPoints();
  }

  findNode(nodeId) {
    // console.log("    nodeBase findNode:", this.id, nodeId, this.id == nodeId);
    if (this.id === nodeId) {
      // console.log("    nodeBase findNode: return this", this);
      return this;
    }
    return null;
  }

  isDescendantOf(node) {
    let current = this.parentNode;
    while (current) {
      if (current === node) {
        return true;
      }
      current = current.parentNode;
    }
    return false;
  }

  findJointParentContainer(target) {
    console.log("    findJointParentContainer:", this.id, target.id);
    let parent = this;
    while (parent && !target.isDescendantOf(parent)) {
      console.log("    findJointParentContainer: next", parent);
      parent = parent.parentNode;
    }
    console.log("    findJointParentContainer: return", parent);
    return parent;
  }

  // Method to toggle expansion/collapse of the node
  toggleExpandCollapse(container) {
    this.data.interactionState.expanded = !this.data.interactionState.expanded;
    this.updateLayout(container);
  }

  // Method to update the node rendering based on interaction state
  updateLayout() {
    console.log("    Updating Render for BASE:", this.id, this.data.interactionState.expanded);

    if (this.data.interactionState.expanded) {
      this.element.classed("collapsed", false).classed("expanded", true);
    } else {
      this.element.classed("expanded", false).classed("collapsed", true);
    }
  }

  cascadeArrange() {
    if (this.parentNode) {
      console.log(`cascadeLayoutUpdate cascade from "${this.id}" --> "${this.parentNode.id}"`);
      this.parentNode.arrange();
      this.parentNode.cascadeArrange();
    } else {
      console.log(`cascadeLayoutUpdate "${this.id}" --> has no parent to cascade to`);
    }

  }

  cascadeRestartSimulation() {
    console.log("cascadeRestartSimulation ", this.id);
    if (this.simulation) {
      console.log("                    simulaiton restart", this.id);
      this.simulation.simulation.alphaTarget(0.8).restart();
    }
    if (this.parentNode) {
      this.parentNode.cascadeRestartSimulation();
    }
  }

  cascadeStopSimulation() {
    console.log("cascadeStopSimulation ", this.id);
    if (this.simulation) {
      console.log("                    simulation stop", this.id);
      this.simulation.simulation.alphaTarget(0);
    }
    if (this.parentNode) {
      this.parentNode.cascadeStopSimulation();
    }
  }
  
  layoutConnectionPoints() {
    if (this.settings.showConnectionPoints) {
      const connectionPoints = this.computeConnectionPoints(0,0,this.data.width, this.data.height);
      Object.values(connectionPoints).forEach((point) => {
        this.element
          .select(`.connection-point.side-${point.side}`)
          .attr("cx", point.x)
          .attr("cy", point.y);
      });
    }
  }

  // if (showConnectionPoints) {
  //   node.each(function (d) {
  //     const connectionPoints = computeConnectionPoints(d.data.width, d.data.height);
  //     Object.values(connectionPoints).forEach((point) => {
  //       d3.select(this)
  //         .append("circle")
  //         .attr("class", "connection-point")
  //         .attr("cx", point.x)
  //         .attr("cy", point.y)
  //         .attr("r", 3);
  //     });
  //   });
  // }
  // function computeConnectionPoints(width, height) {
  //   return {
  //     top: { x: width / 2, y: 0 },
  //     bottom: { x: width / 2, y: height },
  //     left: { x: 0, y: height / 2 },
  //     right: { x: width, y: height / 2 },
  //   };
  // }
  
  // drag
  drag_started(event, node) {
    console.log("drag_started event", event, node);
    // if (!d3.event.active) {
    // Set the attenuation coefficient to simulate the node position movement process. The higher the value, the faster the movement. The value range is [0, 1]
    // this.simulation.alphaTarget(0.8).restart()
    // if (node.simulation) {
    //   console.log("drag_started simulation",node.simulation);
    //   // node.simulation.simulation.restart();
    //   // node.runSimulation();
    //   node.parentNode.cascadeRestartSimulation();
    // }
    // }
    node.cascadeRestartSimulation();
    event.fx = event.x;
    event.fy = event.y;
    node.element.classed("grabbing", true);
  }

  dragged(event, node) {
    // console.log("dragged event",event);

    event.fx = event.x;
    event.fy = event.y;
    // move the simulation
    node.move(event.fx,event.fy);
  }

  drag_ended(event, node) {
    // console.log("drag_ended event",event);

    node.element.classed("grabbing", false);

    node.cascadeStopSimulation();
  }
}
