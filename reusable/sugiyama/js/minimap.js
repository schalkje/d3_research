// Define the maximum dimension for the minimap
function setupMinimap(mainSize, updateMainView) {
  const MAX_MINIMAP_DIMENSION = 200;

  // Calculate the aspect ratio of the main SVG
  const aspectRatio = mainSize.x / mainSize.y;

  // Determine the appropriate dimensions for the minimap
  let minimapWidth, minimapHeight;
  if (mainSize.x >= mainSize.y) {
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
  console.log("minimap", minimapWidth, minimapHeight, mainSize.x, mainSize.y);

  let minimapScale = Math.min(minimapWidth / mainSize.x, minimapHeight / mainSize.y);
  console.log("minimapScale", minimapScale);

  // Add viewport rectangle to the minimap
  const viewportRect = minimapSvg
    .append("rect")
    .attr("class", "viewport")
    .attr("width", minimapWidth)
    .attr("height", minimapHeight);

  // Add drag behavior to the viewport rectangle
  viewportRect.call(
    d3
      .drag()
      .on("start", (event) => {
        initialX = event.x - parseFloat(viewportRect.attr("x"));
        initialY = event.y - parseFloat(viewportRect.attr("y"));
      })
      .on("drag", (event) => {
        const newX = event.x - initialX;
        const newY = event.y - initialY;
        viewportRect.attr("x", newX).attr("y", newY);
        updateMainView({ x: newX, y: newY });
      })
  );

  return { svg:minimapSvg, scale:minimapScale, width:minimapWidth, height:minimapHeight, viewport:viewportRect };
}
