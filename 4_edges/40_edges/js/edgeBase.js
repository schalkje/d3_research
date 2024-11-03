// import { line } from "d3";
import { getComputedDimensions } from "./utils.js";

// const EdgeType = Object.freeze({
//     FULL: 'full',
//     CODE: 'code'
//   });

export default class BaseEdge {
  constructor(edgeData, parent, source, target, settings) {
    this.data = edgeData;
    this.parent = parent; // this is the joined parented container node of source and target
    this.source = source; 
    this.target = target;
    this.settings = settings;

    this.element = null;
    this.ghostElement = null;

    // default data settings
    if (!this.data.type) this.data.type = "unknown";
    if (!this.data.active) this.data.active = true;

    // default settings
    if (!this.settings) this.settings = {};
    if (!this.settings.showGhostlines) this.settings.showGhostlines = true;
    if (!this.settings.showEdges) this.settings.showEdges = true;
  }

  get x1() {
    console.log("    Getting x1:", this.source, this.source.x);
    return this.source ? this.source.x : null;
  }

  get y1() {
    return this.source ? this.source.y : null;
  }

  get x2() {
    return this.target ? this.target.x : null;
  }

  get y2() {
    return this.target ? this.target.y : null;
  }

  get sourcePoint() {
    // console.log("    Getting Source Point:", this.x1, this.y1);
    return [this.x1, this.y1];
  }

  get targetPoint() {
    return [this.x2, this.y2];
  }

  render() {
    console.log("    Rendering Base Edge:", this.data.source, this.data.target, this.data);
    console.log("                       :", this.parent);
    // console.log(
    //   `Rendering Base Edge: ${this.data.source}--${this.data.type}-->${this.data.target}  [${this.data.active}]`
    // );
    // this.element = this.parent.edgesContainer

    // Draw ghostlines
    if (this.settings.showGhostlines) {
      this.ghostElement = this.parent.ghostContainer
        .append("g")
        // .attr("class", `edge ${this.data.type}`);
        .attr("class", `edge ghostline`);

      this.ghostElement
        .append("path")
        .attr("class", "path");
    }

    // const edge = this.generateDirectEdge();
    // console.log("    Edge:", edge);
    // const line = this.lineGenerator();
    // console.log("    Line:", line);

    // Create edge
    if (this.settings.showEdges) {
      this.element = this.parent.edgesContainer
      .append("g")
      .attr("class", `edge ${this.data.type}`);

      this.element
        .append("path")
        .attr("class", "path");
    }

    return this.element;
  }

  layout() {
    console.log("----------------------------------------------------------------------------------------------");
    console.log("--     Updating Render for EDGE BASE:", this.id);


    const edge = this.generateDirectEdge();
    console.log("    Edge:", edge);
    const line = this.lineGenerator();
    console.log("    Line:", line);

    if (this.settings.showGhostlines) {
      console.log("    Updating Ghost Edge:", this.ghostElement, edge);
      this.ghostElement.
        select(".path").
        attr("d", line(edge));
    }

    // // Draw edges
    // if (this.settings.showEdges) {
    //   console.log("    Updating Edge:", this.element, edge);
    //   this.element.
    //     select(".path").
    //     attr("d", line(edge));
    // }
  }



  lineGenerator(edge) {
    // return d3.line().curve(d3.curveBasis)
    return d3.line();
  }
//   getDefaultLineGenerator(layout) {
//     return layout.isEdgeCurved ? d3.line().curve(d3.curveBasis) : d3.line();
//   }


  generateDirectEdge(edge) {
    console.log("    Generating Direct Edge:", this.source, this.target, this.data);
    console.log("                           :", this.sourcePoint, this.targetPoint);
    return [this.sourcePoint, this.targetPoint];
  }

}
