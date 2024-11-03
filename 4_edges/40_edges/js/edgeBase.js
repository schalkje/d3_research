// import { line } from "d3";
import { getComputedDimensions } from "./utils.js";
import { generateDirectEdge, generateEdgePath } from "./utilPath.js";

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
    if (!this.settings.curved) this.settings.curved = false;
  }

  get x1() {
    // console.log("    Getting x1:", this.source, this.source.x);
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

    // Create ghostlines
    if (this.settings.showGhostlines) {
      this.ghostElement = this.parent.ghostContainer
        .append("g")
        // .attr("class", `edge ${this.data.type}`);
        .attr("class", `edge ghostline`);

      this.ghostElement
        .append("path")
        .attr("class", "path");
    }

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

    if (this.settings.showGhostlines) {
      const ghostEdge = generateDirectEdge(this);
      const ghostLine = this.lineGenerator();
      
      this.ghostElement.
        select(".path").
        attr("d", ghostLine(ghostEdge));
    }


    // Draw edges
    if (this.settings.showEdges) {
      const edge = generateEdgePath(this);
      // const line = d3.line().curve(d3.curveBasis);
      const line = this.lineGenerator();
  
      console.log("    Updating Edge:", this.element, edge);
      this.element.
        select(".path").
        attr("d", line(edge));
    }
  }



  lineGenerator(edge) {
    // return d3.line().curve(d3.curveBasis)
    return d3.line();
  }
//   getDefaultLineGenerator(layout) {
//     return layout.isEdgeCurved ? d3.line().curve(d3.curveBasis) : d3.line();
//   }




}
