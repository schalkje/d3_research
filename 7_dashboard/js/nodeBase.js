import { getComputedDimensions } from "./utils.js";
import { computeConnectionPoints } from "./utilPath.js";

export default class BaseNode {
  constructor(nodeData, parentElement, settings, parentNode = null) {
    this.data = nodeData;
    this.parentElement = parentElement;
    this.parentNode = parentNode;
    this.settings = settings;
    this.computeConnectionPoints = computeConnectionPoints;
    this.onDisplayChange = null;

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

  handleDisplayChange() {
    console.log(`          > handleDisplayChange ${this.id}`, this.onDisplayChange, this);
    if (this.onDisplayChange) {
      console.log(`          > calling`);
      this.onDisplayChange();
    } else {
      if (this.parentNode)
        this.parentNode.handleDisplayChange();
    }
  }

  move(x,y) {
    console.log(`          > move ${this.id}, (x:${x},y:${y})`);
    this.x = x;
    this.y = y;
    this.element.attr("transform", `translate(${this.x}, ${this.y})`);

    this.handleDisplayChange();
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
    this.data.width = size.width;
    this.data.height = size.height;

    this.layoutConnectionPoints();

    this.handleDisplayChange();
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
  
  // drag
  drag_started(event, node) {
    node.cascadeRestartSimulation();
    event.fx = event.x;
    event.fy = event.y;
    node.element.classed("grabbing", true);
  }

  dragged(event, node) {
    event.fx = event.x;
    event.fy = event.y;

    // move the simulation
    node.move(event.fx,event.fy);
  }

  drag_ended(event, node) {
    node.element.classed("grabbing", false);

    node.cascadeStopSimulation();
  }
}
