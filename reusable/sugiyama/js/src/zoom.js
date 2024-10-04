export function initializeZoom(dashboard, dag, updateViewport) {
  const zoom = d3
    .zoom()
    .scaleExtent([1, 40])
    .on("zoom", function (event) {
      dashboard.main.canvas.svg.attr("transform", event.transform);
      updateViewport(dashboard, event.transform);
    });

  dashboard.main.zoom = zoom;

  dashboard.main.canvas.svg.call(zoom);

  // initialize default zoom buttons
  d3.select("#zoom-in").on("click", function () {
    zoomIn(dashboard.main.canvas.svg, zoom);
  });

  d3.select("#zoom-out").on("click", function () {
    zoomOut(dashboard.main.canvas.svg, zoom);
  });

  d3.select("#zoom-reset").on("click", function () {
    zoomReset(dashboard.main.canvas, zoom);
  });

  d3.select("#zoom-random").on("click", function () {
    zoomRandom(mainCanvas, layout, zoom, dag);
  });

  d3.select("#zoom-node").on("click", function () {
    zoomToNodeByName("EM_Stater", mainCanvas, layout, zoom, dag);
  });

  return zoom;
}



// Define zoom functions
function zoomIn(svg, zoom) {
  svg.transition().duration(750).call(zoom.scaleBy, 1.2);
}

function zoomOut(svg, zoom) {
  svg.transition().duration(750).call(zoom.scaleBy, 0.8);
}

function zoomReset(canvas, zoom) {
  svg
    .transition()
    .duration(750)
    .call(zoom.transform, d3.zoomIdentity, d3.zoomTransform(canvas.svg.node()).invert([canvas.width / 2, canvas.height / 2]));
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

export function zoomToNodeByName(name, canvas, layout, zoom, dag) {
  console.log("zoomToNodeByName", name);
  for (const node of dag.nodes()) {
    if (node.data.label === name) {
      return zoomToNode(node, canvas, layout, zoom, dag);
    }
  }
}

export function zoomRandom(canvas, layout, zoom, dag){
  const data = [];
  for (const node of dag.nodes()) {
    data.push(node);
  }
  const node = data[Math.floor(Math.random() * data.length)];
  console.log("random node=", node.data.label, node);
  return zoomToNode(node, canvas, layout, zoom, dag);
}

// export function zoomToNode(svg, node, graphData, zoom, width, height, horizontal, showboundingBox = true) {
export function zoomToNode(node, canvas, layout, zoom, dag, showboundingBox = true) {
  // 1. Identify the node's immediate neighbors
  const neighbors = getImmediateNeighbors(node, dag);

  // 2. Compute the bounding box
  const boundingBox = computeBoundingBox(neighbors, layout.horizontal);

  if (showboundingBox) {
    console.log("boundingBox", boundingBox);
    canvas.svg.selectAll(".boundingBox").remove();
    canvas.svg
      .append("rect")
      .attr("class", "boundingBox")
      .attr("x", boundingBox.x)
      .attr("y", boundingBox.y)
      .attr("width", boundingBox.width)
      .attr("height", boundingBox.height)
      .attr("fill", "none")
      .attr("stroke", "red");
  }

  // 3. Calculate the zoom scale and translation
  const { scale, translate } = calculateScaleAndTranslate(boundingBox, canvas, layout);

  console.log("scale", scale);
  console.log("translate", translate);

  // 4. Apply the zoom transform
  svg.transition().duration(750).call(zoom.transform, d3.zoomIdentity.translate(translate.x, translate.y).scale(scale));

  return boundingBox;
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

function calculateScaleAndTranslate(boundingBox, canvas, layout) {
  // correct canvas size for scaling
  let correctedCanvasHeight = canvas.height;
  let correctedCanvasWidth = canvas.width;
  if (canvas.width / canvas.height > mainView.width / mainView.height) {
    correctedCanvasHeight = canvas.width * (mainView.height / mainView.width);
  } else {
    correctedCanvasWidth = canvas.height * (mainView.width / mainView.height);
  }

  // compute the scale
  let scale;
  if (horizontal) {
    scale = Math.min(correctedCanvasWidth / boundingBox.width, correctedCanvasHeight / boundingBox.height);
  } else {
    scale = Math.min(correctedCanvasWidth / boundingBox.width, correctedCanvasHeight / boundingBox.height);
  }

  // compute the vertical border next to and above the canvas
  const whiteSpaceY = (width * (mainView.height / mainView.width) - height) * 0.5;
  const whiteSpaceX = (height * (mainView.width / mainView.height) - width) * 0.5;

  // determine if the canvas and bounding box are horizontal or vertical compared to the main view
  const isHorizontalCanvas = canvas.width / canvas.height > mainView.width / mainView.height;
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
  if (isHorizontalCanvas) translateY -= whiteSpaceY;
  else translateX -= whiteSpaceX;

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
