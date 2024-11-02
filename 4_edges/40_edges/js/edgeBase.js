// import { line } from "d3";
import { getComputedDimensions } from "./utils.js";

// const EdgeType = Object.freeze({
//     FULL: 'full',
//     CODE: 'code'
//   });

export default class BaseEdge {
  // constructor(nodeData, parentElement, parentNode = null) {
  constructor(edgeData, parentElement, source, target, settings) {
    this.data = edgeData;
    this.parentElement = parentElement;
    this.sourceElement = source; // what is the datatype of source and target?
    this.targetElement = target;
    this.settings = settings;

    // default data settings
    if (!this.data.type) this.data.type = "unknown";
    if (!this.data.active) this.data.active = true;

    // Set default values for source: (x1,y1) and target: (x2,y2)
    if (!this.data.x1) this.data.x1 = 0;
    if (!this.data.y1) this.data.y1 = 0;
    if (!this.data.x2) this.data.x2 = 100;
    if (!this.data.y2) this.data.y2 = 100;

    // default settings
    if (!this.settings) this.settings = {};
    if (!this.settings.showGhostlines) this.settings.showGhostlines = true;
    if (!this.settings.showEdges) this.settings.showEdges = true;
  }

  render() {
    console.log("    Rendering Base Edge:", this.data.source, this.data.target, this.data);
    // console.log(
    //   `Rendering Base Edge: ${this.data.source}--${this.data.type}-->${this.data.target}  [${this.data.active}]`
    // );
    this.element = this.parentElement.append("g").attr("class", `edge ${this.data.type}`);

    // // Draw ghostlines
    // if (this.settings.showGhostlines) {
    //   this.element
    //     .append("path")
    //     .attr("class", "ghostline")
    //     .attr("d", (d) => {
    //       const points = this.generateDirectEdge(this.data);
    //       return this.lineGenerator(points);
    //     });
    // }

    const edge = this.generateDirectEdge(this.data);
    console.log("    Edge:", edge);
    const line = this.lineGenerator();
    console.log("    Line:", line);

    // Draw edges
    if (this.settings.showEdges) {
      this.element
        .append("path")
        .attr("class", "path")
        // .attr("stroke", "black")
        // .attr("stroke-width", 2)
        .attr("d", line(edge));
    }

    return this.element;
  }



  lineGenerator(edge) {
    // return d3.line().curve(d3.curveBasis)
    return d3.line();
  }
//   getDefaultLineGenerator(layout) {
//     return layout.isEdgeCurved ? d3.line().curve(d3.curveBasis) : d3.line();
//   }

  generateDirectEdge(edge) {
    console.log("    Generating Direct Edge:", edge.sourceNode, edge.targetNode, this.data);
    const sourceNode = edge.sourceNode;
    const targetNode = edge.targetNode;

    let sourcePoint, targetPoint;
    sourcePoint = [sourceNode.x, sourceNode.y];

    // targetPoint = [targetNode.x, targetNode.y];
    targetPoint = [100, 100];

    return [sourcePoint, targetPoint];
  }

  // Method to update the node rendering based on interaction state
  layout() {
    console.log("    Updating Render for BASE:", this.id, this.data.interactionState.expanded);
  }
}
