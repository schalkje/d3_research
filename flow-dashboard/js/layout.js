import { changeDirection } from "./util.js";
import { initializeZoom } from "./zoom.js";
import { setup as minimapSetup, createViewPort, updateMinimapViewport } from "./minimap.js";
import { setup as mainSetup, draw, drawMinimap } from "./drawNetwork.js";
import { stratefyData } from "./graphData.js";
import { computeLayers } from "./layout-layers.js";

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

  computeLayoutAndCanvas(dashboard, dag);
  console.log("          - computeLayoutAndCanvas", dashboard);

  computeLayers(dashboard, dag);

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

  computeLayoutAndCanvas(dashboard, dag);

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
    // .decross(d3.decrossOpt()) // Option 1: Heuristic Optimization
    .decross(d3.decrossTwoLayer()) // Option 2: Two-layer Optimization
    // .decross(d3.decrossDfs()) // Option 3: Naive Approach
    .coord(d3.coordQuad())
    .nodeSize((d) => getNodeSize(d));

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
