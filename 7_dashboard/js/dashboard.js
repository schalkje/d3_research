import { createNode, createNodes } from "./node.js";
import { getBoundingBoxRelativeToParent } from "./utils.js";
import { createMarkers } from "./markers.js";
import { createEdges } from "./edge.js";

export class Dashboard {
  constructor(dashboardData) {
    this.data = dashboardData;

    this.data.settings ??= {};
    this.data.settings.selector ??= {};
    this.data.settings.selector.incomming ??= 1;
    this.data.settings.selector.outgoing ??= 1;
    this.data.settings.showBoundingBox ??= true;
    this.data.settings.zoomToRoot ??= true;

    this.main = {
      svg: null,
      width: 0,
      height: 0,
      divRatio: 0,
      container: null,
      root: null,
      scale: 1,
      zoomSpeed: 0.2,
      transform: { k: 1, x: 0, y: 0 },
    };
    this.minimap = {
      active: false,
      svg: null,
      width: 0,
      height: 0,
      container: null,
      eye: { x: 0, y: 0, width: 0, height: 0 },
    };
    this.selection = {
      nodes: [],
      edges: [],
      boundingBox: { x: 0, y: 0, width: 0, height: 0 },
    };

    this.isMainAndMinimapSyncing = false; // isSyncing prevents re-entrant calls and ensures the synchronization code runs only once per zoom action.
  }

   initialize(mainDivSelector, minimapDivSelector = null) {
    console.log("dashboard - initialize", this);
    // initialize dashboard
    const div = this.initializeSvg(mainDivSelector);
    this.main.svg = div.svg;
    this.main.width = div.width;
    this.main.height = div.height;
    this.main.divRatio = this.main.width / this.main.height;
    this.data.settings.divRatio ??= this.main.divRatio;
    this.main.onDragUpdate = this.onDragUpdate;
    this.main.container = this.createContainer(this.main, "dashboard");
    this.main.root =  this.createDashboard(this.data, this.main.container);

    this.main.zoom = this.initializeZoom();
    this.main.root.onClick = (node) => this.selectNode(node);
    this.main.root.onDblClick = (node) => this.zoomToNode(node);

    // initialize minimap
    if (minimapDivSelector) {
      const div = this.initializeSvg(minimapDivSelector);
      this.minimap.active = true;
      this.minimap.svg = div.svg;
      this.minimap.width = div.width;
      this.minimap.height = div.height;
      this.minimap.onDragUpdate = div.onDragUpdate;
      this.minimap.container = this.createContainer(this.minimap, "minimap");
      this.initializeMinimap();
      this.updateMinimap();
      console.log("minimap", this.minimap);

      // const dashboard = this;
      // this.isMainAndMinimapSyncing = true; // why is it called directly after initializing the minimap?

      // this.isMainAndMinimapSyncing = false;
    }
    this.main.root.onDisplayChange = () => {
      this.onMainDisplayChange();
    };

    if (this.data.settings.zoomToRoot)
      this.zoomToRoot();
    console.log("dashboard - initialize - finished", this);
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
      .on("zoom", (event) => this.zoomMinimap(event));
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
    // Use requestAnimationFrame to Wait for the Next Render Cycle
    requestAnimationFrame(() => {
      // clone the dashboard container elements to the minimap
      const clone = this.main.container.node().cloneNode(true);

      // remove old minimap
      const minimap = d3.select(".minimap");
      minimap.selectAll("*").remove();

      // clone dashboard to minimap
      minimap.node().appendChild(clone);
      this.minimap.container = d3.select(clone);
    });
  }

  // Function to update the position and size of the eye
  updateMinimapEye(x, y, width, height) {
    if (!this.minimap.active) return;

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

  updateNodeStatus(nodeId, status) {
    console.log("updateNodeStatus", nodeId, status);
    const node = this.main.root.getNode(nodeId);
    if (node) {
      node.status = status;
    } else {
      console.error("updateNodeStatus: Node not found:", nodeId);
    }
  }

  updateDatasetStatus(datasetId, status) {
    // console.log("updateDatasetStatus", datasetId, status);
    let stateUpdated = false;
    const nodes = this.main.root.getNodesByDatasetId(datasetId);
    if (nodes && nodes.length > 0) {
      for (const node of nodes) {
        node.status = status;
        stateUpdated = true;
      }
    }
    return stateUpdated; 
  }

  createContainer(parentContainer, className) {
    // create background rect
    // create a container, to enable zooming and panning
    parentContainer.svg.selectAll("*").remove(); // clear the svg

    const container = parentContainer.svg.append("g").attr("class", `${className}`);    

    return container;
  }

  initializeSvg(divSelector) {
    const svg = d3.select(`${divSelector}`);
    svg.selectAll("*").remove(); // clear the svg
    
    const { width, height } = svg.node().getBoundingClientRect();

    svg.attr("viewBox", [-width / 2, -height / 2, width, height]);

    const onDragUpdate = null;

    return { svg, width, height, onDragUpdate };
  }

   createDashboard(dashboard, container) {
    console.log("dashboard - createDashboard", dashboard, container);
    createMarkers(container);

    var root;
    if (dashboard.nodes.length == 1) {
      root = createNode(dashboard.nodes[0], container, dashboard.settings);
    } else {
      root = createNodes(dashboard.nodes, container, dashboard.settings);
    }
    root.init();

    if (dashboard.edges.length > 0) createEdges(root, dashboard.edges, dashboard.settings);

    console.log("dashboard - createDashboard - finish", dashboard, container);
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
      .on("zoom", (event) => this.zoomMain(event));

    this.main.svg.call(zoom);

    // initialize default zoom buttons
    d3.select("#zoom-in").on("click", () => this.zoomIn(dashboard));

    d3.select("#zoom-out").on("click", () => this.zoomOut(dashboard));

    d3.select("#zoom-reset").on("click", () => this.zoomReset(dashboard));

    d3.select("#zoom-random").on("click", () => this.zoomRandom(dashboard));

    // d3.select("#zoom-node").on("click", () => this.zoomToNodeById("pbdwh_dwh", dashboard));
    d3.select("#zoom-node").on("click", () => this.zoomToRoot(dashboard));

    return zoom;
  }

  onDragUpdate() {
    console.log("Drag Update");
  }

  onMainDisplayChange() {
    console.log("#######################################");
    console.log("##### onMainDisplayChange", this);
    console.log("##### syncing=", this.isMainAndMinimapSyncing);

    if (this.minimap.svg) {
      if (this.isMainAndMinimapSyncing) return;
      this.isMainAndMinimapSyncing = true;
      // Update the minimap
      this.updateMinimap();
      this.isMainAndMinimapSyncing = false;
    }

    if (this.data.settings.zoomToRoot)
      this.zoomToRoot();
  }

  zoomMain(zoomEvent) {
    if (this.isMainAndMinimapSyncing) return;
    this.isMainAndMinimapSyncing = true;

    this.main.transform.k = zoomEvent.transform.k;
    this.main.transform.x = zoomEvent.transform.x;
    this.main.transform.y = zoomEvent.transform.y;

    // Apply transform to the main view
    console.log("zoomMain", zoomEvent.transform, this.main.transform);
    // this.main.container.attr("transform", zoomEvent.transform);
    const transform = d3.zoomIdentity.translate(this.main.transform.x, this.main.transform.y).scale(this.main.transform.k);
    this.main.container.attr("transform", transform );
    
    // Update the viewport in the minimap
    updateViewport(this, zoomEvent.transform);

    // Store the current zoom level at svg level, for the next event
    if (this.minimap.active)
      this.minimap.svg.call(this.minimap.zoom.transform, zoomEvent.transform);

    this.isMainAndMinimapSyncing = false;
  }

  zoomMinimap(zoomEvent) {
    if (this.isMainAndMinimapSyncing) return;
    this.isMainAndMinimapSyncing = true;

    console.log("zoomMinimap", this, zoomEvent, zoomEvent.transform);

    this.main.transform.x = zoomEvent.transform.x;
    this.main.transform.y = zoomEvent.transform.y;
    this.main.transform.k = zoomEvent.transform.k;

    // Apply transform to the main view
    this.main.container.attr("transform", zoomEvent.transform);
    // Store the current zoom level at svg level, for the next event
    this.main.svg.call(this.main.zoom.transform, zoomEvent.transform);

    // Update the viewport in the minimap
    updateViewport(this, zoomEvent.transform);

    this.isMainAndMinimapSyncing = false;
  }

  zoomIn() {
    // svg.selectAll(".boundingBox").remove();
    this.main.svg.transition().duration(750).call(this.main.zoom.scaleBy, 1.2);
    this.main.scale = this.main.scale * (1 + this.main.zoomSpeed);
  }

  zoomOut() {
    // svg.selectAll(".boundingBox").remove();
    this.main.svg.transition().duration(750).call(this.main.zoom.scaleBy, 0.8);
    this.main.scale = this.main.scale * (1 - this.main.zoomSpeed);
  }

  zoomToRoot() {
    console.log("zoomToRoot", this.data.settings.zoomToRoot, this);

    // set the viewport to the root node
    var width = this.main.root.data.width;
    var height = this.main.root.data.height;

    // keep aspect ratio
    if (width / height > this.main.divRatio) {
      height = width / this.main.divRatio;
    } else {
      width = height * this.main.divRatio;
    }

    this.main.width = width;
    this.main.height = height;

    this.main.svg.attr("viewBox", [-width / 2, -height / 2, width, height]);
    this.main.transform.k = 1;
    this.main.transform.x = 0;
    this.main.transform.y = 0;
    const transform = d3.zoomIdentity
      .translate(this.main.transform.x, this.main.transform.y)
      .scale(this.main.transform.k);
    this.main.container.attr("transform", transform);

    if (this.minimap.svg) {
      // this.initializeMinimap();
      this.minimap.svg.attr("viewBox", [-width / 2, -height / 2, width, height]);
      this.updateMinimap();
      this.updateMinimapEye(-width / 2, -height / 2, width, height);
    }

    // Store the current zoom level at svg level, for the next event
    this.main.svg.call(this.main.zoom.transform, transform);
  }

  zoomReset() {
    console.log("zoomReset", this);
    // canvas.svg.selectAll(".boundingBox").remove();
    this.main.svg
      .transition()
      .duration(750)
      .call(
        this.main.zoom.transform,
        d3.zoomIdentity,
        d3.zoomTransform(this.main.svg.node()).invert([this.main.width / 2, this.main.height / 2])
      );
    this.main.scale = 1;


    if (this.minimap.active)
      this.minimap.svg
        .transition()
        .duration(750)
        .call(
          this.minimap.zoom.transform,
          d3.zoomIdentity,
          d3.zoomTransform(this.main.svg.node()).invert([this.main.width / 2, this.main.height / 2])
        );

    this.deselectAll();
  }

  zoomClicked(event, [x, y]) {
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

  zoomToNodeById(nodeId) {
    console.log("zoomToNodeById", nodeId);
    const node = this.main.root.getNode(nodeId);
    if (node) {
      console.log("node=", node);
      return this.zoomToNode(node);
    }

    console.error("zoomToNodeById: Node not found:", nodeId);
    return null;
  }

  setStatusToNodeById(nodeId, status) {
    console.log("setStatusToNodeById", nodeId);
    const node = this.main.root.getNode(nodeId);
    if (node) {
      console.log("node=", node);
      node.status = status;
    }

    console.error("setStatusToNodeById: Node not found:", nodeId);
    return null;
  }

  zoomRandom(dashboard) {
    // todo: remove dag; and get nodes from this.main.root
    const nodes = dashboard.main.root.getAllNodes();
    const node = nodes[Math.floor(Math.random() * nodes.length)];
    console.log("random node=", node.data.label, node);
    return this.zoomToNode(node);
  }

  selectNode(node) {
    console.log("dashboard - selectNode", node.selected, node);
    node.selected = !node.selected;

    // // test status updates:
    // switch (node.status) {
    //   case NodeStatus.NEW:
    //     node.status = NodeStatus.READY;
    //     break;
    //   case NodeStatus.READY:
    //     node.status = NodeStatus.ACTIVE;
    //     break;
    //   case NodeStatus.ACTIVE:
    //     node.status = NodeStatus.WARNING;
    //     break;
    //   case NodeStatus.WARNING:
    //     node.status = NodeStatus.ERROR;
    //     break;
    //   case NodeStatus.ERROR:
    //     node.status = NodeStatus.DISABLED;
    //     break;
    //   case NodeStatus.DISABLED:
    //     node.status = NodeStatus.UNKNOWN;
    //     break;
    //   case NodeStatus.UNKNOWN:
    //     node.status = NodeStatus.NEW;
    //     break;
    //   // otherwise
    //   default:
    //     node.status = NodeStatus.UNKNOWN;
    //     console.log("            Unknown status", node.status);
    // }
  }

  getSelectedNodes() {
    return this.main.root.getAllNodes(true);
  }

  getStructure() {
    if (!this.main.root) return null;
    
    var nodes = this.main.root.getAllNodes(false, true);
    const edges = [];
    this.main.root.getAllEdges(false,edges);

    // strip the nodes and edges to the base structure
    const structureNodes = nodes.map((node) => {
      return {
        Id: node.id,
      };
    });

    const structureEdges = edges.map((edge) => {
      return {
        Source: edge.source.id,
        Target: edge.target.id,
        Id: edge.id,
      };
    });

    return { Nodes: structureNodes, Edges: structureEdges };
  }

  deselectAll() {
    // console.log("deselectAllNodes"); 
    const nodes = this.getSelectedNodes();
    // console.log("deselectAllNodes - nodes", nodes); 
    nodes.forEach((node) => node.selected = false);

    const edges = [];
    this.main.root.getAllEdges(true, edges);
    // console.log("deselectAllNodes - edges", edges);
    edges.forEach((edge) => edge.selected = false);

  }

  
  zoomToNode(node) {
    console.log("zoomToNode", node);
    // 1. Identify the node's immediate neighbors
    const neighbors = node.getNeighbors(this.data.settings.selector);
    console.log("zoomToNode: neighbors", neighbors);

    // select the node and its neighbors
    this.deselectAll();
    neighbors.nodes.forEach((node) => node.selected = true);
    neighbors.edges.forEach((edge) => edge.selected = true);

    // 2. Compute the bounding box
    const boundingBox = computeBoundingBox(this, neighbors.nodes);
    console.log("zoomToNode: boundingBox", boundingBox);

    // 3. Calculate the zoom scale and translation
    // const { scale, translate } = calculateScaleAndTranslate(boundingBox, this);
    const scale = this.main.transform.k;

    if (this.data.settings.showBoundingBox) {
      const borderWidth = 2;
      this.main.container.selectAll(".boundingBox").remove();
      this.main.container
        .append("rect")
        .attr("class", "boundingBox")
        .attr("stroke-width", borderWidth)
        .attr("x", boundingBox.x)
        .attr("y", boundingBox.y)
        .attr("width", boundingBox.width)
        .attr("height", boundingBox.height);
    }

    this.main.boundingbox = {
      boundingBox: boundingBox,
      x: boundingBox.x,
      y: boundingBox.y,
      width: boundingBox.width,
      height: boundingBox.height,
      scale: scale,
    };

    // 4. Apply the zoom transform
    // this.main.canvas.svg
    //   .transition()
    //   .duration(750)
    //   .call(this.zoom.transform, d3.zoomIdentity.translate(translate.x, translate.y).scale(scale));
    this.zoomToBoundingBox(boundingBox);

    return this.main.boundingbox;
  }

  zoomToBoundingBox(boundingBox) {
    // Get the dimensions of the SVG viewport
    const svgWidth = this.main.width;
    const svgHeight = this.main.height;

    // Calculate the scale factor to fit the bounding box within the SVG
    const scaleX = svgWidth / boundingBox.width;
    const scaleY = svgHeight / boundingBox.height;
    const scale = Math.min(scaleX, scaleY); // Use the smaller scale to fit within both dimensions

    // Calculate the translation to center the bounding box in the SVG
    this.main.transform.x = (-boundingBox.width * scale) / 2 - boundingBox.x * scale;
    this.main.transform.y = (-boundingBox.height * scale) / 2 - boundingBox.y * scale;
    this.main.transform.k = scale;

    // Apply transform to the main view
    // this.main.container.attr("transform", zoomEvent.transform);
    const transform = d3.zoomIdentity
      .translate(this.main.transform.x, this.main.transform.y)
      .scale(this.main.transform.k);
    this.main.container.attr("transform", transform);

    // Update the viewport in the minimap
    updateViewport(this, transform);

    // Store the current zoom level at svg level, for the next event
    if (this.minimap.active)
      this.minimap.svg.call(this.minimap.zoom.transform, transform);

    this.isMainAndMinimapSyncing = false;
  }
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

export function computeBoundingBox(dashboard, nodes) {
  const padding = 2; // Add some padding

  let [minX, minY, maxX, maxY] = [Infinity, Infinity, -Infinity, -Infinity];

  const updateBounds = (x, y, width, height) => {
    console.log("computeBoundingBox updateBounds:", x, y, width, height);
    minX = Math.min(minX, x - (width / 2));
    minY = Math.min(minY, y - height / 2);
    maxX = Math.max(maxX, x + width / 2);
    maxY = Math.max(maxY, y + height / 2);
  };
  console.log(`                   bounds: ${minX}, ${minY}, ${maxX}, ${maxY}`);

  nodes.forEach((node) => {
    // const {
    //   x,
    //   y,
    //   data: { width, height },
    // } = node;

    // const dimensions = getRelativeBBox(node.element)
    const dimensions = getBoundingBoxRelativeToParent(node.element, dashboard.main.container);
    // const dimensions = node.element.node().getBBox();
    // minX = Math.min(minX, dimensions.x - dashboard.main.width / 2);
    // minY = Math.min(minY, dimensions.y - dashboard.main.height / 2);
    // maxX = Math.max(maxX, dimensions.x + dimensions.width - dashboard.main.width / 2);
    // maxY = Math.max(maxY, dimensions.y + dimensions.height - dashboard.main.height / 2);
    minX = Math.min(minX, dimensions.x);
    minY = Math.min(minY, dimensions.y);
    maxX = Math.max(maxX, dimensions.x + dimensions.width);
    maxY = Math.max(maxY, dimensions.y + dimensions.height);

    console.log("computeBoundingBox dimensions:", node.id, dimensions, node);
    

    // updateBounds(x, y, width, height);
    // console.log("computeBoundingBox node:", node.id, x, y, width, height, x -(width/2));
    console.log(`                   bounds: ${minX}, ${minY}, ${maxX}, ${maxY}`);

      
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
  console.log("updateViewport", dashboard, transform);
  // js: is this the right function name?
  const x = (transform.x + dashboard.main.width / 2) / -transform.k;
  const y = (transform.y + dashboard.main.height / 2) / -transform.k;
  const width = dashboard.main.width / transform.k;
  const height = dashboard.main.height / transform.k;
  dashboard.updateMinimapEye(x, y, width, height);
}

function dragEye(dashboard, dragEvent) {
  console.log("dragEye", dragEvent);
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


export function createAndInitDashboard(dashboardData, mainDivSelector, minimapDivSelector = null) {  
  const dashboard = new Dashboard(dashboardData);
  dashboard.initialize(mainDivSelector, minimapDivSelector);
  return dashboard;
}

export function setDashboardProperty(dashboardObject, propertyPath, value) {
  console.warn("setDashboardProperty", dashboardObject, propertyPath, value);
  const properties = propertyPath.split('.');
  let obj = dashboardObject;
  for (let i = 0; i < properties.length - 1; i++) {
    console.warn("                    - ", i, properties[i], obj[properties[i]]);
    obj = obj[properties[i]];
  }
  console.warn("                    - before = ", obj[properties[properties.length - 1]]);
  obj[properties[properties.length - 1]] = value;
  console.warn("                    -  after = ", obj[properties[properties.length - 1]]);
}