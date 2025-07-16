import { updateMainView } from "./drawNetwork.js";

// Function to update the main SVG based on the viewport rectangle position
let minimapDragInitialX, minimapDragInitialY;

// Define the maximum dimension for the minimap
export function setup(mainView, minimapDivSelector = "#minimap") {
  const MAX_MINIMAP_DIMENSION = 200;

  // Calculate the aspect ratio of the main SVG
  const aspectRatio = mainView.width / mainView.height;

  // Determine the appropriate dimensions for the minimap
  let minimapWidth, minimapHeight;
  if (mainView.width >= mainView.height) {
    minimapWidth = MAX_MINIMAP_DIMENSION;
    minimapHeight = minimapWidth / aspectRatio;
  } else {
    minimapHeight = MAX_MINIMAP_DIMENSION;
    minimapWidth = minimapHeight * aspectRatio;
  }

  // Set the dimensions of the minimap SVG
  const minimapSvg = d3
    .select(minimapDivSelector)
    .attr("width", minimapWidth + 1)
    .attr("height", minimapHeight + 1);

  let minimapScale = Math.min(minimapWidth / mainView.width, minimapHeight / mainView.height);

  const minimapView = { 
    svg:minimapSvg, 
    scale:minimapScale, 
    width:minimapWidth, 
    height:minimapHeight, 
  };

  return minimapView;
}

export function createMinimap(minimap, dashboard) {
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


export function createViewPort(dashboard){
  console.log("createViewPort", dashboard);
  // console.log("               - minimap canvas", dashboard.minimap.canvas);
  // console.log("               - margin x", dashboard.minimap.canvas.width - dashboard.minimap.view.width);
  // console.log("               - margin y", dashboard.minimap.canvas.height - dashboard.minimap.view.height);
  // console.log("               - boundingbox", dashboard.main.boundingbox);
  // remove any existing viewport
  dashboard.minimap.view.svg.selectAll(".viewport").remove();

  // Add viewport rectangle to the minimap
  const viewportRect = dashboard.minimap.view.svg
      .append("rect")
      .attr("class", "viewport")
      .attr("stroke-width", dashboard.minimap.canvas.width/dashboard.minimap.view.width*2)
      .attr("x", -dashboard.minimap.canvas.whiteSpaceX)
      .attr("y", -dashboard.minimap.canvas.whiteSpaceY)
      .attr("width", dashboard.main.canvas.width + 2 * dashboard.minimap.canvas.whiteSpaceX)
      .attr("height", dashboard.main.canvas.height + 2 * dashboard.minimap.canvas.whiteSpaceY);

  dashboard.minimap.view.viewport = viewportRect;

    // Add drag behavior to the viewport rectangle
  viewportRect.call(
    d3
      .drag()
      .on("start", (event) => {
        // console.log("drag start", event.x, viewportRect.attr("x"), event.y, viewportRect.attr("y"));
        // console.log("          ",event);
        minimapDragInitialX = event.x - parseFloat(viewportRect.attr("x"));
        minimapDragInitialY = event.y - parseFloat(viewportRect.attr("y"));
        // console.log("          ",minimapDragInitialX, minimapDragInitialY);
        dashboard.minimap.viewport.dragInitialX = minimapDragInitialX;
        dashboard.minimap.viewport.dragInitialY = minimapDragInitialY;
      })
      .on("drag", (event) => {
        // console.log("drag", event.x, event.y, minimapDragInitialX, minimapDragInitialY, dashboard.minimap.viewport.dragInitialX, dashboard.minimap.viewport.dragInitialY);
        const newX = event.x - minimapDragInitialX;
        const newY = event.y - minimapDragInitialY;
        // console.log("     newX, newY", newX, newY);
        viewportRect.attr("x", newX).attr("y", newY);
        updateMainView({ x: newX, y: newY }, dashboard);
      })
  );

  return viewportRect;
}

export function updateMinimapViewport(dashboard, transform) {
    let rectX, rectY, rectWidth, rectHeight;
    rectX = -transform.x / transform.k
    rectY = -transform.y / transform.k;
    rectWidth = dashboard.main.view.width / transform.k / dashboard.minimap.canvas.widthScale;
    rectHeight = dashboard.main.view.height / transform.k / dashboard.minimap.canvas.heightScale;

    // compensate for the whitespace around the canvas
    rectY -= dashboard.minimap.canvas.whiteSpaceY / transform.k;
    rectHeight += dashboard.minimap.canvas.whiteSpaceY / transform.k * 2;
    rectX -= dashboard.minimap.canvas.whiteSpaceX / transform.k;
    rectWidth += dashboard.minimap.canvas.whiteSpaceX / transform.k * 2;

    // console.log("updateMinimapViewport", rectX, rectY, rectWidth, rectHeight, dashboard, dashboard.minimap.canvas.width/dashboard.minimap.view.width);
    dashboard.minimap.view.viewport
        .attr("x", rectX)
        .attr("y", rectY)
        .attr("width", rectWidth)
        .attr("height", rectHeight)
        .attr("stroke-width", dashboard.minimap.canvas.width/dashboard.minimap.view.width*2);

}

