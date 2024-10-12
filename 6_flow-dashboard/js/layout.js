import { changeDirection } from "./util.js";
import { initializeZoom } from "./zoom.js";
import { setup as minimapSetup, createMinimap, createViewPort, updateMinimapViewport } from "./minimap.js";
import { setup as mainSetup, draw, drawMinimap } from "./drawNetwork.js";
import { stratefyData } from "./graphData.js";
import { computeLayers } from "./layout-layers.js";
import { rectCollide } from "./rectCollide.js";
import { sugiyamaLayoutAndCanvas } from "./layout-sugiyama.js";
import { forceLayoutAndCanvas } from "./layout-force.js";

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
  console.log("          - layout.layoutMechanism", layout.layoutMechanism);

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
  console.log("          - layout.layoutMechanism", layout.layoutMechanism);
  if (layout.layoutMechanism == "sugiyama") {
    sugiyamaLayoutAndCanvas(dashboard, dag);
    console.log("          - sugiyamaLayoutAndCanvas", dashboard);
  } else {
    //layoutAlgotithm = "force";
    forceLayoutAndCanvas(dashboard, dag);
    console.log("          - forceLayoutAndCanvas", dashboard);
  }

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
    sugiyamaLayoutAndCanvas(dashboard, dag);
  } else {
    //layoutAlgotithm = "force";
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
    layoutMechanism: layout.layoutMechanism || "force",
    margin: {
      x: layout.marginX || (horizontal ? 100 : 8),
      y: layout.marginY || (horizontal ? 8 : 50),
    }
    // JS: idea: make the margin dependable on the widht and height of the nodes, an maybe the orientation
  };
}
