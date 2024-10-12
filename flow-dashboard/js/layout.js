import { changeDirection } from "./util.js";
import { initializeZoom } from "./zoom.js";
import { setup as minimapSetup, createViewPort, updateMinimapViewport } from "./minimap.js";
import { setup as mainSetup, draw, drawMinimap } from "./drawNetwork.js";
import { stratefyData } from "./graphData.js";
import { computeLayers } from "./layout-layers.js";
import { rectCollide } from "./rectCollide.js";

export function initializeFromData(
  graphData,
  layout = {},
  mainDivSelector = "#graph",
  minimapDivSelector = "#minimap"
) {
  console.log("initializeFromData", graphData, layout, mainDivSelector, minimapDivSelector);
  const dag = stratefyData(graphData);
  return initialize(dag, layout, mainDivSelector, minimapDivSelector);
}

export function initialize(dag, layout = {}, mainDivSelector = "#graph", minimapDivSelector = "#minimap") {
  console.log("initialize", layout, mainDivSelector, minimapDivSelector);
  console.log("          - dag", dag);

  const mainView = mainSetup(mainDivSelector);
  const minimapView = minimapSetup(mainView, minimapDivSelector);

  // Set default values for missing values in layout
  layout = setDefaultLayoutValues(layout);
  console.log("          - layout", layout);

  // Create the dashboard object (see readme.md for details)
  let dashboard = {
    main: {
      view: mainView,
      boundingbox: {
        scale: 1,
      },
    },
    minimap: {
      view: minimapView,
      viewport: {},
    },
    layout: layout,
  };
  console.log("          - dashboard", dashboard);

  // JS: TODO: make this a parameter based choice
  // computeLayoutAndCanvas(dashboard, dag);
  forceLayoutAndCanvas(dashboard, dag);
  console.log("          - xxxxxLayoutAndCanvas", dashboard);

  // computeLayers(dashboard, dag);

  initializeZoom(dashboard, dag, updateMinimapViewport);

  draw(dashboard, dag);

  // Create minimap content group
  createMinimap(minimapView, dashboard);
  drawMinimap(dashboard, dag);

  createViewPort(dashboard);

  return dashboard;
}



export function computeAndDraw(dag, mainView, minimap, layout = {}) {
  console.log("computeAndDraw - DEPRECATED");
  // Set default values for missing values in layout
  layout = setDefaultLayoutValues(layout);

  console.log("computeAndDraw", mainView, minimap, dag);
  // Create the dashboard object (see readme.md for details)
  let dashboard = {
    main: {
      view: mainView,
      boundingbox: {
        scale: 1,
      },
    },
    minimap: {
      view: minimap,
      viewport: {},
    },
    layout: layout,
  };

  // JS: TODO: make this a parameter based choice
  let layoutAlgotithm = "force";
  if (layoutAlgotithm == "sugiyama") {
    computeLayoutAndCanvas(dashboard, dag);
  } else { //layoutAlgotithm = "force";
    forceLayoutAndCanvas(dashboard, dag);
  }

  initializeZoom(dashboard, dag, updateMinimapViewport);

  draw(dashboard, dag);

  // Create minimap content group
  createMinimap(minimap, dashboard);
  drawMinimap(dashboard, dag);

  createViewPort(dashboard);

  return dashboard;
}

function createMinimap(minimap, dashboard) {
  minimap.svg.selectAll("g").remove();

  const isHorizontalCanvas =
    dashboard.main.canvas.width / dashboard.main.canvas.height >
    dashboard.minimap.view.width / dashboard.minimap.view.height;

  // compute the vertical border next to or above the canvas
  const whiteSpaceY = isHorizontalCanvas // horizontal canvas has a whitespace above and below the canvas
    ? (dashboard.main.canvas.width * (dashboard.minimap.view.height / dashboard.minimap.view.width) -
        dashboard.main.canvas.height) *
      0.5
    : 0;
  const whiteSpaceX = !isHorizontalCanvas // vertical canvas has a whitespace above and below the canvas
    ? (dashboard.main.canvas.height * (dashboard.minimap.view.width / dashboard.minimap.view.height) -
        dashboard.main.canvas.width) *
      0.5
    : 0;

  const widthScale = dashboard.main.view.width / dashboard.main.canvas.width;
  const heightScale = dashboard.main.view.height / dashboard.main.canvas.height;

  dashboard.minimap.canvas = {
    svg: minimap.svg.insert("g", ":first-child"),
    width: dashboard.main.canvas.width,
    height: dashboard.main.canvas.height,
    whiteSpaceX: whiteSpaceX,
    whiteSpaceY: whiteSpaceY,
    isHorizontalCanvas: isHorizontalCanvas,
    widthScale: widthScale,
    heightScale: heightScale,
  };
}

export function forceLayoutAndCanvas(dashboard, dag) {
  dashboard.main.view.svg.selectAll("*").remove();
  const svg = dashboard.main.view.svg.append("g");

  const marginX = changeDirection(8, 100, dashboard.layout.horizontal).x;
  const marginY = changeDirection(50, 8, dashboard.layout.horizontal).x;

  function getNodeSize({ data }) {
    console.log("getNodeSize", data, dashboard.layout.horizontal);
    return [
      data.width, // + marginX,
      data.height// + marginY,
    ];
  }

  // Create a new force simulation layout
  // const nodes = JSON.parse(JSON.stringify(dag.nodes()));
  const nodes = dag.nodes();
  const links = dag.links();
  

  console.log("forceLayoutAndCanvas - nodes, links", nodes, links);
  // Initialize node positions if they are undefined
  // Initialize node positions if they are undefined
  nodes.forEach((node) => {
    if (!node.id) node.id = node.data.id || Math.random().toString(36).substr(2, 9); // Ensure each node has a unique id
    if (node.ux === undefined) node.ux = Math.random() * dashboard.main.view.width;
    if (node.uy === undefined) node.uy = Math.random() * dashboard.main.view.height;
    if (node.x === undefined) node.x = node.ux;
    if (node.y === undefined) node.y = node.uy;
    if (node.vx === undefined) node.vx = 0;
    if (node.vy === undefined) node.vy = 0;
    console.log("forceLayoutAndCanvas - node after initialization", node);
  });
  
  const collideForce = d3.forceCollide()
  .radius((d) => {
    console.log("collide force applied to node", d);
    return Math.max(getNodeSize(d)[0], getNodeSize(d)[1]) / 2;
  })
  .iterations(10);

  const linkForce = d3.forceLink(links)
  .id((d) => d.id)  // If your nodes have an 'id' property, use this to link nodes properly
  .distance((link) => getLinkDistance(link));

  console.log("forceLayoutAndCanvas - nodes, links", nodes, links);
  nodes.forEach((node, index) => {
    console.log(`Node ${index}:`, JSON.parse(JSON.stringify(node)));
  });
  
  
  links.forEach((link, index) => {
    console.log(`Link ${index}:`, link);
  });
  
  const simulation = d3.forceSimulation(nodes)
  .alpha(1)
  // .force("collide", collideForce)
  .force("link", linkForce)
    .force("charge", d3.forceManyBody().strength(-300))
    // .force("center", d3.forceCenter(dashboard.main.view.width / 2, dashboard.main.view.height / 2))
    // .force("collide", rectCollide().size((d) => getNodeSize(d)).strength(0.7))
    // .force("collide", rectCollide().size((d) => getNodeSize(d)).strength(1.5).iterations(10))
    // .force("collide", d3.forceCollide((d) => Math.max(getNodeSize(d)[0], getNodeSize(d)[1]) / 2 + 10))
    .on("tick", ticked)
    .restart();

  // collideForce.initialize(nodes);

  function ticked() {
    console.log("ticked");
    // Update node positions based on the current state of the simulation
    d3.selectAll(".node")
      .attr("transform", (d) => `translate(${d.x}, ${d.y})`);

    // Update link positions based on the current state of the simulation
    d3.selectAll(".link")
      .attr("x1", (d) => d.source.x)
      .attr("y1", (d) => d.source.y)
      .attr("x2", (d) => d.target.x)
      .attr("y2", (d) => d.target.y);
  }

  function getLinkDistance(link) {
    console.log("getLinkDistance", link);
    // compute the distance between the source and target nodes
    // const sourceSize = getNodeSize(link.source);
    // const targetSize = getNodeSize(link.target);
    const dx = link.target.x - link.source.x;
    const dy = link.target.y - link.source.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance;
    
  }

  // Define width and height from the current dashboard settings
  const width = changeDirection(dashboard.main.view.width, dashboard.main.view.height, dashboard.layout.horizontal).x;
  const height = changeDirection(dashboard.main.view.width, dashboard.main.view.height, dashboard.layout.horizontal).y;

  console.log("forceLayoutAndCanvas - width, height", width, height, dashboard.main.view, dashboard.minimap.view);

  dashboard.main.view.svg.attr("viewBox", [0, 0, width, height]);
  dashboard.minimap.view.svg.attr("viewBox", [0, 0, width, height]);

  dashboard.main.canvas = { svg: svg, width: width, height: height };

  return dashboard.main.canvas;
}


export function computeLayoutAndCanvas(dashboard, dag) {
  dashboard.main.view.svg.selectAll("*").remove();
  const svg = dashboard.main.view.svg.append("g");

  const marginX = changeDirection(8, 100, dashboard.layout.horizontal).x;
  const marginY = changeDirection(50, 8, dashboard.layout.horizontal).x;

  function getNodeSize({ data }) {
    // console.log("getNodeSize", data, dashboard.layout.horizontal);
    return [
      changeDirection(data.width + marginX, data.height + marginY, dashboard.layout.horizontal).x,
      changeDirection(data.width + marginX, data.height + marginY, dashboard.layout.horizontal).y,
    ];
  }

  // Apply the Sugiyama layout
  const layout = d3
    .sugiyama()
    .layering(d3.layeringLongestPath())
    // .layering(d3.layeringTopological())
    // .decross(d3.decrossOpt()) // Option 1: Heuristic Optimization
    // .decross(d3.decrossTwoLayer()) // Option 2: Two-layer Optimization
    .decross(d3.decrossDfs()) // Option 3: Naive Approach
    // .coord(d3.coordQuad())
    .coord(d3.coordSimplex())
    .nodeSize((d) => getNodeSize(d));
  // const layout = d3.dagLayeringTopological();

  const { width: layoutWidth, height: layoutHeight } = layout(dag);
  const width = changeDirection(layoutWidth, layoutHeight, dashboard.layout.horizontal).x;
  const height = changeDirection(layoutWidth, layoutHeight, dashboard.layout.horizontal).y;

  console.log("computeLayoutAndCanvas - width, heigth", width, height, dashboard.main.view, dashboard.minimap.view);

  dashboard.main.view.svg.attr("viewBox", [0, 0, width, height]);

  dashboard.minimap.view.svg.attr("viewBox", [0, 0, width, height]);

  dashboard.main.canvas = { svg: svg, width: width, height: height };

  return dashboard.main.canvas;
}

// Function to get the computed width and height of an element
export function getComputedDimensions(element) {
  const rect = element.node().getBoundingClientRect();
  return { width: rect.width, height: rect.height };
}

function getDefaultLineGenerator(layout) {
  return layout.isEdgeCurved ? d3.line().curve(d3.curveBasis) : d3.line();
}

// Function to set default values for layout attributes
function setDefaultLayoutValues(layout) {
  const horizontal = layout.horizontal !== undefined && layout.horizontal !== null ? layout.horizontal : true;
  const isEdgeCurved = layout.isEdgeCurved !== undefined && layout.isEdgeCurved !== null ? layout.isEdgeCurved : false;
  const lineGenerator =
    layout.lineGenerator !== undefined && layout.lineGenerator !== null
      ? layout.lineGenerator
      : getDefaultLineGenerator(layout);

  return {
    horizontal: horizontal,
    isEdgeCurved: isEdgeCurved,
    lineGenerator: lineGenerator,
  };
}
