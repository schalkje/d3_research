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
  // remove any existing viewport
  dashboard.minimap.view.svg.selectAll(".viewport").remove();

  // Add viewport rectangle to the minimap
  const viewportRect = dashboard.minimap.view.svg
      .append("rect")
      .attr("class", "viewport")
      .attr("x", 0) //dashboard.main.canvas.width - dashboard.main.view.width)
      .attr("y", 0)
      .attr("width", dashboard.main.canvas.width)
      .attr("height", dashboard.main.canvas.height);

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
    // compute the vertical border next to and above the canvas
    const whiteSpaceY = (dashboard.main.canvas.width * (dashboard.main.view.height / dashboard.main.view.width) - dashboard.main.canvas.height) * 0.5;
    const whiteSpaceX = (dashboard.main.canvas.height * (dashboard.main.view.width / dashboard.main.view.height) - dashboard.main.canvas.width) * 0.5;

    const isHorizontalCanvas = dashboard.main.canvas.width / dashboard.main.canvas.height > dashboard.main.view.width / dashboard.main.view.height;

    const widthScale = dashboard.main.view.width / dashboard.main.canvas.width;
    const heightScale = dashboard.main.view.height / dashboard.main.canvas.height;

    let rectX, rectY, rectWidth, rectHeight;
    rectX = -transform.x / transform.k
    rectY = -transform.y / transform.k;
    rectWidth = dashboard.main.view.width / transform.k / widthScale;
    rectHeight = dashboard.main.view.height / transform.k / heightScale;

    if (isHorizontalCanvas) {
        rectY -= whiteSpaceY / transform.k;
        rectHeight += whiteSpaceY / transform.k * 2;
    }
    else {
        rectX -= whiteSpaceX / transform.k;
        rectWidth += whiteSpaceX / transform.k * 2;
    }

    dashboard.minimap.view.viewport.attr("x", rectX)
        .attr("y", rectY)
        .attr("width", rectWidth)
        .attr("height", rectHeight);
}

