import { updateMainView } from "./drawNetwork.js";

// Function to update the main SVG based on the viewport rectangle position
let minimapDragInitialX, minimapDragInitialY;

// Define the maximum dimension for the minimap
export function setup(mainSize, updateMainView) {
  const MAX_MINIMAP_DIMENSION = 200;

  // Calculate the aspect ratio of the main SVG
  const aspectRatio = mainSize.width / mainSize.height;

  // Determine the appropriate dimensions for the minimap
  let minimapWidth, minimapHeight;
  if (mainSize.width >= mainSize.height) {
    minimapWidth = MAX_MINIMAP_DIMENSION;
    minimapHeight = minimapWidth / aspectRatio;
  } else {
    minimapHeight = MAX_MINIMAP_DIMENSION;
    minimapWidth = minimapHeight * aspectRatio;
  }

  // Set the dimensions of the minimap SVG
  const minimapSvg = d3
    .select("#minimap")
    .attr("width", minimapWidth + 1)
    .attr("height", minimapHeight + 1);
  console.log("minimap", minimapWidth, minimapHeight, mainSize.width, mainSize.height);

  let minimapScale = Math.min(minimapWidth / mainSize.width, minimapHeight / mainSize.height);
  console.log("minimapScale", minimapScale);


  const minimapView = { 
    svg:minimapSvg, 
    scale:minimapScale, 
    width:minimapWidth, 
    height:minimapHeight, 
  };

  return minimapView;
}

export function createViewPort(dashboard){
  console.log("createViewPort", dashboard);
  console.log("               - minimap canvas", dashboard.minimap.canvas);
  console.log("               - margin x", dashboard.minimap.canvas.width - dashboard.minimap.view.width);
  console.log("               - margin y", dashboard.minimap.canvas.height - dashboard.minimap.view.height);
  // remove any existing viewport
  dashboard.minimap.view.svg.selectAll(".viewport").remove();

  // Add viewport rectangle to the minimap
  const viewportRect = dashboard.minimap.view.svg
      .append("rect")
      .attr("class", "viewport")
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
        minimapDragInitialX = event.x - parseFloat(viewportRect.attr("x"));
        minimapDragInitialY = event.y - parseFloat(viewportRect.attr("y"));
      })
      .on("drag", (event) => {
        const newX = event.x - minimapDragInitialX;
        const newY = event.y - minimapDragInitialY;
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

    dashboard.minimap.view.viewport
        .attr("x", rectX)
        .attr("y", rectY)
        .attr("width", rectWidth)
        .attr("height", rectHeight);
}

