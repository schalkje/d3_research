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
  constructor(edgeData, parent, source, target, settings) {
    this.data = edgeData;
    this.parent = parent; // this is the joined parented container node of source and target
    this.source = source; 
    this.target = target;
    this.settings = settings;
    this._status = EdgeStatus.UNKNOWN;
    this._selected = false;
    this.onClick = null;
    this.onDblClick = null;

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
