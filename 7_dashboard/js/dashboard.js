import { createNode, createNodes } from "./node.js";
import { createMarkers } from "./markers.js";
import { createEdges } from "./edge.js";

export class Dashboard {
  constructor(dashboardData) {
    this.data = dashboardData;
    this.dashboard = {
      svg: null,
      width: 0,
      height: 0,
      container: null,
      root: null,
      scale: 1,
    };
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

    this.initializeZoom();
  }

  // render() {
  //     // this.dashboard.root.render();
  // }

  createContainer(svg, className) {
    // JS: 2024-11-06: I don't know (yet) if this is usefull or not
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


  initializeZoom() {
    console.log("intializeZoom", this.dashboard);
    const dag = null; // todo: remove
  
    const svg = this.dashboard.container;
    const dashboard = this.dashboard;
    const zoom = d3
      .zoom()
      .scaleExtent([1, 40])
      .on("zoom", function (event) {
        svg.attr("transform", event.transform);
        updateViewport(dashboard, event.transform);
      });

      this.dashboard.zoom = zoom;

      this.dashboard.svg.call(zoom);

      console.log("intializeZoom - svg", svg, zoom);
      // initialize default zoom buttons
    d3.select("#zoom-in").on("click", function () {zoomIn(dashboard)});

    d3.select("#zoom-out").on("click", function () {
      zoomOut(svg, zoom);
    });

    d3.select("#zoom-reset").on("click", function () {
      zoomReset(dashboard);
    });

    d3.select("#zoom-random").on("click", function () {
      zoomRandom(dashboard, dag);
    });

    d3.select("#zoom-node").on("click", function () {
      zoomToNodeByName("EM_Stater", dashboard, dag);
    });

    return zoom;
  }

  onDragUpdate() {
    console.log("Drag Update");
  }
}

function zoomIn(dashboard) {
  console.log("zoomIn", dashboard)
  // svg.selectAll(".boundingBox").remove();
  dashboard.svg.transition().duration(750).call(dashboard.zoom.scaleBy, 1.2);
  // todo: update zoom scale
}

function zoomOut(dashboard) {
  // svg.selectAll(".boundingBox").remove();
  dashboard.svg.transition().duration(750).call(dashboard.zoom.scaleBy, 0.8);
}

function zoomReset(dashboard) {
  console.log("zoomReset", dashboard);
  // canvas.svg.selectAll(".boundingBox").remove();
  dashboard.svg
    .transition()
    .duration(750)
    .call(
      dashboard.zoom.transform,
      d3.zoomIdentity,
      d3.zoomTransform(dashboard.svg.node()).invert([dashboard.width / 2, dashboard.height / 2])
    );
}


  function zoomClicked(event, [x, y]) {
    event.stopPropagation();
    svg
      .transition()
      .duration(750)
      .call(
        zoom.transform,
        d3.zoomIdentity
          .translate(width / 2, height / 2)
          .scale(40)
          .translate(-x, -y),
        d3.pointer(event)
      );
  }
  
  export function zoomToNodeByName(name, dashboard, dag) {
    console.log("zoomToNodeByName", name);
    for (const node of dag.nodes()) {
      if (node.data.label === name) {
        return zoomToNode(node, dashboard, dag);
      }
    }
  }
  
  export function zoomRandom(dashboard, dag){
    const data = [];
    for (const node of dag.nodes()) {
      data.push(node);
    }
    const node = data[Math.floor(Math.random() * data.length)];
    console.log("random node=", node.data.label, node);
    return zoomToNode(node, dashboard, dag);
  }

  
export function zoomToNode(node, dashboard, dag) {
    // 1. Identify the node's immediate neighbors
    const neighbors = getImmediateNeighbors(node, dag);
  
    // 2. Compute the bounding box
    const boundingBox = computeBoundingBox(neighbors, dashboard.layout.horizontal);
  
    // 3. Calculate the zoom scale and translation
    const { scale, translate } = calculateScaleAndTranslate(boundingBox, dashboard);
  
    if (dashboard.layout.showBoundingBox) {
      dashboard.main.canvas.svg.selectAll(".boundingBox").remove();
      dashboard.main.canvas.svg
        .append("rect")
        .attr("class", "boundingBox")
        .attr("stroke-width", scale * 2)
        .attr("x", boundingBox.x)
        .attr("y", boundingBox.y)
        .attr("width", boundingBox.width)
        .attr("height", boundingBox.height);
    }
  
    dashboard.main.boundingbox = {
      boundingBox: boundingBox,
      x: boundingBox.x,
      y: boundingBox.y,
      width: boundingBox.width,
      height: boundingBox.height,
      scale: scale,
    }
  
    // 4. Apply the zoom transform
    dashboard.main.canvas.svg.transition().duration(750).call(dashboard.zoom.transform, d3.zoomIdentity.translate(translate.x, translate.y).scale(scale));
  
    return dashboard.main.boundingbox;
  }
  
  export function getImmediateNeighbors(baseNode, graphData) {
    const neighbors = [baseNode];
  
    // Iterate over all edges to find connected nodes
    for (const node of graphData.nodes()) {
      if (baseNode.data.parentIds.includes(node.data.id) || baseNode.data.childrenIds.includes(node.data.id)) {
        neighbors.push(node);
      }
    }
  
    return neighbors;
  }
  

  export function computeBoundingBox(nodes, horizontal) {
    const padding = 2; // Add some padding
  
    let [minX, minY, maxX, maxY] = [Infinity, Infinity, -Infinity, -Infinity];
  
    const updateBounds = (x, y, dimension1, dimension2) => {
      minX = Math.min(minX, x - dimension1 / 2);
      minY = Math.min(minY, y - dimension2 / 2);
      maxX = Math.max(maxX, x + dimension1 / 2);
      maxY = Math.max(maxY, y + dimension2 / 2);
    };
  
    nodes.forEach((n) => {
      const {
        x,
        y,
        data: { width, height },
      } = n;
  
      if (horizontal) {
        updateBounds(y, x, width, height);
      } else {
        updateBounds(x, y, width, height);
      }
    });
  
    return {
      x: minX - padding,
      y: minY - padding,
      width: maxX - minX + 2 * padding,
      height: maxY - minY + 2 * padding,
    };
  }
  
  function calculateScaleAndTranslate(boundingBox, dashboard) {
    // correct canvas size for scaling
    let correctedCanvasHeight = dashboard.main.canvas.height;
    let correctedCanvasWidth = dashboard.main.canvas.width;
    if (dashboard.main.canvas.width / dashboard.main.canvas.height > dashboard.main.view.width / dashboard.main.view.height) {
      correctedCanvasHeight = dashboard.main.canvas.width * (dashboard.main.view.height / dashboard.main.view.width);
    } else {
      correctedCanvasWidth = dashboard.main.canvas.height * (dashboard.main.view.width / dashboard.main.view.height);
    }
  
    // compute the scale
    let scale;
    if (dashboard.layout.horizontal) {
      scale = Math.min(correctedCanvasWidth / boundingBox.width, correctedCanvasHeight / boundingBox.height);
    } else {
      scale = Math.min(correctedCanvasWidth / boundingBox.width, correctedCanvasHeight / boundingBox.height);
    }
    const isHorizontalBoundingBox = boundingBox.width / boundingBox.height > correctedCanvasWidth / correctedCanvasHeight;
  
    // compute the visual height and width of the bounding box
    const visualHeight = boundingBox.width * (correctedCanvasHeight / correctedCanvasWidth);
    const heightCorrection = (visualHeight - boundingBox.height) * 0.5;
  
    const visualWidth = boundingBox.height * (correctedCanvasWidth / correctedCanvasHeight);
    const widthCorrection = (visualWidth - boundingBox.width) * 0.5;
  
    // compute the base translation
    let translateX = -boundingBox.x * scale;
    let translateY = -boundingBox.y * scale;
  
    // add the white space to the translation
    if (dashboard.minimap.canvas.isHorizontalCanvas) translateY -= dashboard.minimap.canvas.whiteSpaceY;
    else translateX -= dashboard.minimap.canvas.whiteSpaceX;
  
    // add the height correction to the translation
    if (isHorizontalBoundingBox) translateY += heightCorrection * scale;
    else translateX += widthCorrection * scale;
  
    return {
      scale: scale,
      translate: {
        x: translateX,
        y: translateY,
      },
    };
  }
  
function updateViewport(dashboard, transform)
  {
    // js: is this the right function name?
    // console.log("updateViewPort", transform)
  }
