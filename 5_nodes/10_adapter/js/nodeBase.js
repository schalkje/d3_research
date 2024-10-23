import { getComputedDimensions } from "./utils.js";
export default class BaseNode {
  constructor(nodeData, parentElement, parentNode = null) {
    this.id = nodeData.id;
    this.parentElement = parentElement;
    this.parentNode = parentNode;
    this.element = null;
    this.data = nodeData;
    this.simulation = null;

    if (!this.data.interactionState) this.data.interactionState = { expanded: true };

    // Set default values for x, y, width, and height
    if (!this.data.x) this.data.x = 0;
    if (!this.data.y) this.data.y = 0;
    if (!this.data.width) this.data.width = 60;
    if (!this.data.height) this.data.height = 60;
  }

  renderContainer() {
    console.log("Rendering Base Node renderContainer:", this.id, this.data.x, this.data.y);
    this.element = this.parentElement
      .append("g")
      .attr("width", this.data.width)
      .attr("height", this.data.height)
      .attr("class", "node")
      .attr("data-id", this.id)
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
    this.element.append("circle").attr("r", 3).attr("cx", 0).attr("cy", 0).attr("fill", "red");	

    // Set expanded or collapsed state
    if (this.data.interactionState.expanded) {
      this.element.classed("expanded", true);
    } else {
      this.element.classed("collapsed", true);
    }

    return this.element;
  }

  render(renderChildren = true) {
    renderContainer();
  }

  resize(boundingBox) {
    this.data.width = boundingBox.width;
    this.data.height = boundingBox.height;
  }

  // Method to toggle expansion/collapse of the node
  toggleExpandCollapse(container) {
    this.data.interactionState.expanded = !this.data.interactionState.expanded;
    this.updateRender(container);
  }

  // Method to update the node rendering based on interaction state
  updateRender(container) {
    console.log("    Updating Render for BASE:", this.id, this.data.interactionState.expanded);

    if (this.data.interactionState.expanded) {
      container.classed("collapsed", false).classed("expanded", true);
    } else {
      container.classed("expanded", false).classed("collapsed", true);
    }
  }

  cascadeSimulation() {
    if (this.parentNode) {
      this.parentNode.runSimulation();
      this.parentNode.cascadeSimulation();
    }
  }

  cascadeRestartSimulation() {
    console.log("cascadeRestartSimulation ", this.id);
    if (this.simulation) {
      console.log("                    simulaiton restart", this.id);
      this.simulation.simulation.alphaTarget(0.8).restart();
    }
    if (this.parentNode) {
      // if  (this.parentNode.simulation)
      //   this.parentNode.simulation.simulation.alphaTarget(1).restart();
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

  getConnectionPoint() {}

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
    node.element.attr("transform", "translate(" + event.fx + "," + event.fy + ")");
  }

  drag_ended(event, node) {
    // console.log("drag_ended event",event);

    node.element.classed("grabbing", false);

    node.cascadeStopSimulation();
  }
}
