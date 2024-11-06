import { createNode, createNodes } from "./node.js";
import { createMarkers } from "./markers.js";
import { createEdges } from "./edge.js";

export class Dashboard {
  constructor(dashboardData) {
    this.data = dashboardData;
    this.dashboard = null;
    this.minimap = null;
  }

  initialize(mainDivSelector, minimapDivSelector = null) {
    // initialize dashboard
    this.dashboard = this.initializeSvg(mainDivSelector);
    this.dashboard.onDragUpdate = this.onDragUpdate;
    this.dashboard.container = this.createContainer(this.dashboard.svg, "dashboard");

    // initialize minimap
    if (this.minimapDivSelector) {
      this.minimap = this.initializeSvg(this.minimapDivSelector);
      this.minimap.container = this.createContainer(this.minimap.svg, "minimap");
    }

    this.dashboard.root = this.createDashboard(this.data, this.dashboard.container);
  }

  // render() {
  //     // this.dashboard.root.render();
  // }

  createContainer(svg, className) {
    return svg.append("g").attr("class", `${className}`);
  }

  initializeSvg(divSelector) {
    const svg = d3.select(`${divSelector}`);
    const { width, height } = svg.node().getBoundingClientRect();

    svg.attr("viewBox", [-width / 2, -height / 2, width, height]);

    const onDragUpdate = null;

    return { svg, width, height, onDragUpdate };
  }

  createDashboard(dashboard, container) {
    createMarkers(container);

    var root;
    if (dashboard.nodes.length == 1) {
      root = createNode(dashboard.nodes[0], container, dashboard.settings);
    } else {
      root = createNodes(dashboard.nodes, container, dashboard.settings);
    }
    root.render();

    if (dashboard.edges.length > 0) createEdges(root, dashboard.edges, dashboard.settings);

    return root;
  }

  onDragUpdate() {
    console.log("Drag Update");
  }
}
