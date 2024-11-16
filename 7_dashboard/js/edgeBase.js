// import { line } from "d3";
import { getComputedDimensions } from "./utils.js";
import { generateDirectEdge, generateEdgePath } from "./utilPath.js";

// const EdgeType = Object.freeze({
//     FULL: 'full',
//     CODE: 'code'
//   });

export const EdgeStatus = Object.freeze({
  READY: 'ready',
  ACTIVE: 'active',
  ERROR: 'error',
  WARNING: 'warning',
  UNKNOWN: 'unknown',
  DISABLED: 'disabled'
});

export default class BaseEdge {
  constructor(edgeData, parents, settings) {
    console.log("Creating Base Edge:", edgeData, parents, settings);
    this.data = edgeData;
    this.parents = parents; 
    this.settings = settings;
    this._status = EdgeStatus.UNKNOWN;
    this._selected = false;
    this.onClick = null;
    this.onDblClick = null;

    console.log("Creating Base Edge - source", this.source, this.source.id);
    console.log(`Creating Base Edge - target ${this.target.id}`, this.source, this.target.id);
    this.id ??= `${this.source.id}--${this.data.type}--${this.target.id}`;

    this.element = null;
    this.ghostElement = null;

    // default data settings
    this.data.active ??= true;
    this.data.type ??= "unknown";

    // default settings
    if (!this.settings) this.settings = {};
    this.settings.showGhostlines ??= true;
    this.settings.showEdges ??= true;
    this.settings.curved ??= false;
    this.settings.curveMargin ??= this.settings.curved ? 0.1 : 0;
  }

  get parent() {
    // log error if no parents or no container
    if (!this.parents || !this.parents.container) {
      console.error("No parent or container for edge:", this.id);
      return null;
    }
    return this.parents.container;
  }

  get source() {
    // log error if no parents or no source
    if (!this.parents || !this.parents.source) {
      console.error("No parents or source for edge:", this.id);
      return null;
    }
    return this.parents.source[0];
  }


  get target() {
    // log error if no parents or no target
    if (!this.parents || !this.parents.target) {
      console.error("No parents or target for edge:", this.id);
      return null;
    }
    return this.parents.target[0];
  }

  get status() {
    return this._status;
  }

  set status(value) {
    this._status = value;
    this.element.attr("status", value);    
  }

  get selected() {
    return this._selected;
  }

  set selected(value) {
    this._selected = value;
    if (!this.element){
      console.warn("No element to select.");
      return;
    }
    this.element.classed("selected", this._selected);
  }

  get x1() {
    // console.log("    Getting x1:", this.source, this.source.x);
    let correction = 0;
    for (let i = 1; i < this.parents.source.length; i++){
      correction += this.parents.source[i].x;
      } 
    return this.source ? this.source.x + correction : null;
  }

  get y1() {
    let correction = 0;
    for (let i = 1; i < this.parents.source.length; i++){
      correction += this.parents.source[i].y;
      } 
    return this.source ? this.source.y + correction : null;
  }

  get x2() {
    let correction = 0;
    for (let i = 1; i < this.parents.target.length; i++){
      correction += this.parents.target[i].x;
      } 
    return this.target ? this.target.x + correction : null;
  }

  get y2() {
    let correction = 0;
    for (let i = 1; i < this.parents.target.length; i++){
      correction += this.parents.target[i].y;
      } 
    return this.target ? this.target.y + correction : null;
  }

  get sourcePoint() {
    // console.log("    Getting Source Point:", this.x1, this.y1);
    return [this.x1, this.y1];
  }

  get targetPoint() {
    return [this.x2, this.y2];
  }

  render() {
    // console.log(
    //   `Rendering Base Edge: ${this.data.source}--${this.data.type}-->${this.data.target}  [${this.data.active}]`
    // );

    // Create ghostlines
    if (this.settings.showGhostlines) {
      this.ghostElement = this.parent.ghostContainer
        .append("g")
        .attr("class", `edge ghostline`);

      this.ghostElement
        .append("path")
        .attr("class", "path");
    }

    // Create edge
    if (this.settings.showEdges) {
      this.element = this.parent.edgesContainer
      .append("g")
      .attr("class", `edge ${this.data.type}`)
      .attr("id", this.id)
      .on("click", (event) => {
        if (event) event.stopPropagation();
        this.handleClicked(event);
      })
      .on("dblclick", (event) => {
        if (event) event.stopPropagation();
        this.handleDblClicked(event);
      });


      this.element
        .append("path")
        .attr("class", "path");
    }

    return this.element;
  }

  layout() {
    // console.log("----------------------------------------------------------------------------------------------");
    // console.log("--     Updating Render for EDGE BASE:", this.id);

    if (this.settings.showGhostlines) {
      const ghostEdge = generateDirectEdge(this);
      const ghostLine = this.ghostlineGenerator();
      
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

  ghostlineGenerator(edge) {
    return d3.line();
  }


  lineGenerator(edge) {
    if (this.settings.curved) {
      return d3.line().curve(d3.curveBasis);
    }
    else {
      return d3.line();
    }
  }
//   getDefaultLineGenerator(layout) {
//     return layout.isEdgeCurved ? d3.line().curve(d3.curveBasis) : d3.line();
//   }


handleClicked(event, edge = this) {
  console.log("handleClicked:", this.id, event);

  this.selected = !this.selected;

  if (this.onClick) {
    this.onClick(edge);
  } else {
    console.warn(`No onClicked handler, node ${edge.id} clicked!`);
  }
}

handleDblClicked(event, edge = this) {
  console.log("handleClicked:", this.id, event);

  if (this.onDblClick) {
    this.onDblClick(edge);
  } else {
    console.warn(`No onDblClick handler, node ${edge.id} clicked!`);
  }
}


}
