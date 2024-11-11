import { createNode, createNodes } from "./node.js";
import { createMarkers } from "./markers.js";
import { createEdges } from "./edge.js";

export class Dashboard {
  constructor(dashboardData) {
    this.data = dashboardData;
    this.main = {
      svg: null,
      width: 0,
      height: 0,
      container: null,
      root: null,
      scale: 1,
      zoomSpeed: 0.2,
      transform: { x: 0, y: 0, k: 1 },
    };
    this.minimap = {
      svg: null,
      width: 0,
      height: 0,
      container: null,
      eye: { x: 0, y: 0, width: 0, height: 0 },
    };

    this.isMainAndMinimapSyncing = false; // isSyncing prevents re-entrant calls and ensures the synchronization code runs only once per zoom action.
  }

  async initialize(mainDivSelector, minimapDivSelector = null) {
    // initialize dashboard
    const div = this.initializeSvg(mainDivSelector);
    this.main.svg = div.svg;
    this.main.width = div.width;
    this.main.height = div.height;
    this.main.onDragUpdate = this.onDragUpdate;
    this.main.container = this.createContainer(this.main, "dashboard");
    this.main.root = await this.createDashboard(this.data, this.main.container);

    this.main.zoom = this.initializeZoom();

    // initialize minimap
    if (minimapDivSelector) {
      const div = this.initializeSvg(minimapDivSelector);
      this.minimap.svg = div.svg;
      this.minimap.width = div.width;
      this.minimap.height = div.height;
      this.minimap.onDragUpdate = div.onDragUpdate;
      this.minimap.container = this.createContainer(this.minimap, "minimap");
      this.initializeMinimap();
      this.updateMinimap();
      console.log("minimap", this.minimap);

      const dashboard = this;
      this.isMainAndMinimapSyncing = true; // why is it called directly after initializing the minimap?

      this.main.root.onDisplayChange = () => {
        this.onMainDisplayChange();
      };
      this.isMainAndMinimapSyncing = false;
    }
  }

  initializeMinimap() {
    console.log("initializeMinimap", this);

    const dashboard = this;

    // Initialize drag behavior
    const drag = d3.drag().on("drag", function (event) {
      dragEye(dashboard, event);
    });
    this.minimap.svg.call(drag);
    dashboard.minimap.drag = drag;

    // Initialize zoom behavior
    const zoom = d3
      .zoom()
      .scaleExtent([1, 40])
      .on("zoom", function (event) {
        zoomMinimap(dashboard, event);
      });
    this.minimap.svg.call(zoom);
    dashboard.minimap.zoom = zoom;

    // comput the scale of the minimap compared to the main view
    this.minimap.scale = Math.min(this.minimap.width / this.main.width, this.minimap.height / this.main.height);

    // update zoom
    this.minimap.svg.attr(
      "viewBox",
      `${-this.main.width / 2} ${-this.main.height / 2} ${this.main.width} ${this.main.height}`
    );

    this.minimap.eye = {
      x: -this.main.width / 2,
      y: -this.main.height / 2,
      width: this.main.width,
      height: this.main.height,
    };

    const defs = this.minimap.svg.append("defs");
    const eye = defs.append("mask").attr("id", "fade-mask");
    eye
      .append("rect")
      .attr("id", "eyeball")
      .attr("x", -this.main.width / 2)
      .attr("y", -this.main.height / 2)
      .attr("width", "100%")
      .attr("height", "100%")
      .attr("fill", "white");
    eye
      .append("rect")
      .attr("id", "pupil")
      .attr("x", this.minimap.eye.x)
      .attr("y", this.minimap.eye.y)
      .attr("width", this.minimap.eye.width)
      .attr("height", this.minimap.eye.height)
      .attr("fill", "black");

      this.minimap.svg
      .insert("rect", ":first-child") // Insert as the first child
      .attr("class", `background`)
      .attr("width", this.main.width)
      .attr("height", this.main.height)
      .attr("x", -this.main.width / 2)
      .attr("y", -this.main.height / 2);

      this.minimap.svg
      .append("rect")
      .attr("class", `eye`)
      .attr("width", "100%")
      .attr("height", "100%")
      .attr("x", -this.main.width / 2)
      .attr("y", -this.main.height / 2)
      .attr("mask", "url(#fade-mask)");

    this.minimap.svg
      .append("rect")
      .attr("class", `iris`)
      .attr("x", this.minimap.eye.x)
      .attr("y", this.minimap.eye.y)
      .attr("width", this.minimap.eye.width)
      .attr("height", this.minimap.eye.height);


    // return zoom;
    return zoom;
  }

  updateMinimap() {
    // clone the dashboard container elements to the minimap
    const clone = this.main.container.node().cloneNode(true);
    console.log("     clone=", clone);

    // remove old minimap
    const minimap = d3.select(".minimap");
    minimap.selectAll("*").remove();

    // clone dashboard to minimap
    minimap.node().appendChild(clone);
    this.minimap.container = d3.select(clone);
    // this.minimap.container.attr("class", "minimap2");
  }

  // Function to update the position and size of the eye
  updateMinimapEye(x, y, width, height) {
    console.log("updateMinimapEye", this);
    // Update minimap.eye properties
    this.minimap.eye.x = x;
    this.minimap.eye.y = y;
    this.minimap.eye.width = width;
    this.minimap.eye.height = height;

    // Select and update the 'pupil' rectangle in the mask for the clear area
    this.minimap.svg.select("#pupil").attr("x", x).attr("y", y).attr("width", width).attr("height", height);

    // If you are displaying a visible outline of the pupil, update it here as well
    this.minimap.svg.select(".iris").attr("x", x).attr("y", y).attr("width", width).attr("height", height);
  }

  // render() {
  //     // this.dashboard.root.render();
  // }

  createContainer(dashboard, className) {
    // create background rect
    // create a container, to enable zooming and panning
    const container = dashboard.svg.append("g").attr("class", `${className}`);
    // container
    //   .append("rect")
    //   .attr("class", "background")
    //   .attr("x", -dashboard.width / 2)
    //   .attr("y", -dashboard.height / 2)
    //   .attr("width", dashboard.width)
    //   .attr("height", dashboard.height);

    return container;
  }

  initializeSvg(divSelector) {
    const svg = d3.select(`${divSelector}`);
    const { width, height } = svg.node().getBoundingClientRect();

    svg.attr("viewBox", [-width / 2, -height / 2, width, height]);

    const onDragUpdate = null;

    return { svg, width, height, onDragUpdate };
  }

  async createDashboard(dashboard, container) {
    createMarkers(container);

    var root;
    if (dashboard.nodes.length == 1) {
      root = await createNode(dashboard.nodes[0], container, dashboard.settings);
    } else {
      root = await createNodes(dashboard.nodes, container, dashboard.settings);
    }
    await root.render();

    if (dashboard.edges.length > 0) await createEdges(root, dashboard.edges, dashboard.settings);

    return root;
  }

  initializeZoom() {
    console.log("intializeZoom", this);
    const dag = null; // todo: remove

    // const svg = this.dashboard.container;
    const dashboard = this;
    const zoom = d3
      .zoom()
      .scaleExtent([1, 40])
      .on("zoom", function (event) {
        zoomMain(dashboard, event);
      });

    this.main.svg.call(zoom);

    // initialize default zoom buttons
    d3.select("#zoom-in").on("click", function () {
      zoomIn(dashboard);
    });

    d3.select("#zoom-out").on("click", function () {
      zoomOut(dashboard);
    });

    d3.select("#zoom-reset").on("click", function () {
      zoomReset(dashboard);
    });

    d3.select("#zoom-random").on("click", function () {
      zoomRandom(dashboard);
    });

    d3.select("#zoom-node").on("click", function () {
      zoomToNodeByName("EM_Stater", dashboard);
    });

    return zoom;
  }

  onDragUpdate() {
    console.log("Drag Update");
  }

  onMainDisplayChange() {
    console.log("#######################################");
    console.log("##### onMainDisplayChange", this);
    console.log("##### syncing=", this.isMainAndMinimapSyncing);
    if (this.isMainAndMinimapSyncing) return;
    this.isMainAndMinimapSyncing = true;
    // Update the minimap
    this.updateMinimap();
    this.isMainAndMinimapSyncing = false;
  }
}

// function onMainDisplayChange(dashboard) {
//   console.log("#######################################");
//   console.log("##### onMainDisplayChange", dashboard);
//   console.log("##### syncing=",dashboard.isMainAndMinimapSyncing);
//   if (dashboard.isMainAndMinimapSyncing) return;
//   dashboard.isMainAndMinimapSyncing = true;
//   // Update the minimap
//   dashboard.updateMinimap();
//   dashboard.isMainAndMinimapSyncing = false;
// }

function zoomIn(dashboard) {
  // svg.selectAll(".boundingBox").remove();
  dashboard.main.svg.transition().duration(750).call(dashboard.main.zoom.scaleBy, 1.2);
  dashboard.main.scale = dashboard.main.scale * (1 + dashboard.main.zoomSpeed);
}

function zoomOut(dashboard) {
  // svg.selectAll(".boundingBox").remove();
  dashboard.main.svg.transition().duration(750).call(dashboard.main.zoom.scaleBy, 0.8);
  dashboard.main.scale = dashboard.main.scale * (1 - dashboard.main.zoomSpeed);
}

function zoomReset(dashboard) {
  console.log("zoomReset", dashboard);
  // canvas.svg.selectAll(".boundingBox").remove();
  dashboard.main.svg
    .transition()
    .duration(750)
    .call(
      dashboard.main.zoom.transform,
      d3.zoomIdentity,
      d3.zoomTransform(dashboard.main.svg.node()).invert([dashboard.main.width / 2, dashboard.main.height / 2])
    );
  dashboard.main.scale = 1;

  dashboard.minimap.svg
    .transition()
    .duration(750)
    .call(
      dashboard.minimap.zoom.transform,
      d3.zoomIdentity,
      d3.zoomTransform(dashboard.main.svg.node()).invert([dashboard.main.width / 2, dashboard.main.height / 2])
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

export function zoomRandom(dashboard, dag) {
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
  };

  // 4. Apply the zoom transform
  dashboard.main.canvas.svg
    .transition()
    .duration(750)
    .call(dashboard.zoom.transform, d3.zoomIdentity.translate(translate.x, translate.y).scale(scale));

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
  if (
    dashboard.main.canvas.width / dashboard.main.canvas.height >
    dashboard.main.view.width / dashboard.main.view.height
  ) {
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

function updateViewport(dashboard, transform) {
  // js: is this the right function name?
  console.log("updateViewPort", dashboard, transform);
  const x = (transform.x + dashboard.main.width / 2) / -transform.k;
  const y = (transform.y + dashboard.main.height / 2) / -transform.k;
  const width = dashboard.main.width / transform.k;
  const height = dashboard.main.height / transform.k;
  dashboard.updateMinimapEye(x, y, width, height);
}

function dragEye(dashboard, dragEvent) {
  // Calculate scaled movement for the eye rectangle
  const scaledDx = dragEvent.dx / dashboard.minimap.scale;
  const scaledDy = dragEvent.dy / dashboard.minimap.scale;

  // Calculate the new eye position based on the scaled movement
  const newEyeX = dashboard.minimap.eye.x + scaledDx;
  const newEyeY = dashboard.minimap.eye.y + scaledDy;

  // Update the eye's position
  dashboard.updateMinimapEye(newEyeX, newEyeY, dashboard.minimap.eye.width, dashboard.minimap.eye.height);

  // Calculate the corresponding translation for the main view, maintaining the current scale
  dashboard.main.transform.x = -newEyeX * dashboard.main.transform.k - dashboard.main.width / 2;
  dashboard.main.transform.y = -newEyeY * dashboard.main.transform.k - dashboard.main.height / 2;

  // Apply the updated transformation to the main view
  const transform = d3.zoomIdentity
    .translate(dashboard.main.transform.x, dashboard.main.transform.y)
    .scale(dashboard.main.transform.k);
  dashboard.main.container.attr("transform", transform);

  // Store the current zoom level at svg level, for the next event
  dashboard.main.svg.call(dashboard.main.zoom.transform, transform);
}

function zoomMain(dashboard, zoomEvent) {
  if (dashboard.isMainAndMinimapSyncing) return;
  dashboard.isMainAndMinimapSyncing = true;

  dashboard.main.transform.k = zoomEvent.transform.k;
  dashboard.main.transform.x = zoomEvent.transform.x;
  dashboard.main.transform.y = zoomEvent.transform.y;

  // Apply transform to the main view
  dashboard.main.container.attr("transform", zoomEvent.transform);

  // Update the viewport in the minimap
  updateViewport(dashboard, zoomEvent.transform);

  // Store the current zoom level at svg level, for the next event
  dashboard.minimap.svg.call(dashboard.minimap.zoom.transform, zoomEvent.transform);

  dashboard.isMainAndMinimapSyncing = false;
}

function zoomMinimap(dashboard, zoomEvent) {
  if (dashboard.isMainAndMinimapSyncing) return;
  dashboard.isMainAndMinimapSyncing = true;

  console.log("zoomMinimap", dashboard, zoomEvent, zoomEvent.transform);

  dashboard.main.transform.x = zoomEvent.transform.x;
  dashboard.main.transform.y = zoomEvent.transform.y;
  dashboard.main.transform.k = zoomEvent.transform.k;

  // Apply transform to the main view
  dashboard.main.container.attr("transform", zoomEvent.transform);
  // Store the current zoom level at svg level, for the next event
  dashboard.main.svg.call(dashboard.main.zoom.transform, zoomEvent.transform);

  // Update the viewport in the minimap
  updateViewport(dashboard, zoomEvent.transform);

  dashboard.isMainAndMinimapSyncing = false;
}
