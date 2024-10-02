// Connect default zoom buttons
function initializeZoom(svg, svg_canvas, width, height, horizontal, dag, updateViewport) {
    const zoom = d3.zoom()
        .scaleExtent([1, 40])
        .on("zoom", function (event) {
            svg_canvas.attr("transform", event.transform);
            updateViewport(event.transform);
        });
        
        svg.call(zoom)

    d3.select("#zoom-in").on("click", function () {
        zoomIn(svg_canvas, zoom);
    });

    d3.select("#zoom-out").on("click", function () {
        zoomOut(svg_canvas, zoom);
    });

    d3.select("#zoom-reset").on("click", function () {
        zoomReset(svg_canvas, zoom, width, height, horizontal);
    });

    d3.select("#zoom-random").on("click", function () {
        zoomRandom(svg_canvas, dag, zoom, width, height, horizontal);
    });

    d3.select("#zoom-node").on("click", function () {
        zoomToNodeByName(svg_canvas, "EM_Stater", dag, zoom, width, height, horizontal);
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

function zoomReset(svg, zoom, width, height) {
    svg.transition().duration(750).call(
        zoom.transform,
        d3.zoomIdentity,
        d3.zoomTransform(svg.node()).invert([width / 2, height / 2])
    );
}

function zoomClicked(event, [x, y]) {
    event.stopPropagation();
    svg.transition().duration(750).call(
        zoom.transform,
        d3.zoomIdentity.translate(width / 2, height / 2).scale(40).translate(-x, -y),
        d3.pointer(event)
    );
}

function zoomToNodeByName(svg, name, dag, zoom, width, height, horizontal) {
    console.log("zoomToNodeByName", name);
    for (const node of dag.nodes()) {
        if (node.data.label === name) {
            zoomToNode(svg, node, dag, zoom, width, height, horizontal);
            break;
        }
    }
}

function zoomRandom(svg, dag, zoom, width, height, horizontal) {
    // console.log("zoomRandom", dag);
    const data = [];
    for (const node of dag.nodes()) {
        // data.push([node.x, node.y]);
        data.push(node);
    }
    const node = data[Math.floor(Math.random() * data.length)];
    console.log("random node=", node.data.label, node);
    zoomToNode(svg, node, dag, zoom, width, height, horizontal);
}

function zoomToNode(svg, node, graphData, zoom, width, height, horizontal) {
  // 1. Identify the node's immediate neighbors
  const neighbors = getImmediateNeighbors(node, graphData);

  // 2. Compute the bounding box
  const boundingBox = computeBoundingBox(neighbors);
  // console.log("boundingBox", boundingBox);

  // 3. Calculate the zoom scale and translation
  const { scale, translate } = calculateScaleAndTranslate(
    boundingBox,
    width,
    height,
    horizontal
  );

//   console.log("scale", scale);
//   console.log("translate", translate);

  // 4. Apply the zoom transform
  svg
    .transition()
    .duration(750)
    .call(
      zoom.transform,
      d3.zoomIdentity.translate(translate.x, translate.y).scale(scale)
    );
}

function getImmediateNeighbors(baseNode, graphData) {
  // console.log("getImmediateNeighbors baseNode",baseNode);
  // console.log("getImmediateNeighbors graphData",graphData);
  const neighbors = [baseNode];

  // Iterate over all edges to find connected nodes
  for (const node of graphData.nodes()) {
    if (
      baseNode.data.parentIds.includes(node.data.id) ||
      baseNode.data.childrenIds.includes(node.data.id)
    ) {
      // console.log("getImmediateNeighbors node", node);
      neighbors.push(node);
    }
  }

  return neighbors;
}

function computeBoundingBox(nodes) {
  const padding = 20; // Add some padding
  // console.log("computeBoundingBox nodes",nodes);

  let minX = Infinity,
    minY = Infinity,
    maxX = -Infinity,
    maxY = -Infinity;

  nodes.forEach((n) => {
    // console.log("computeBoundingBox node", n);
    const x = n.x;
    const y = n.y;
    const width = n.data.width;
    const height = n.data.height;

    minX = Math.min(minX, x - width / 2);
    minY = Math.min(minY, y - height / 2);
    maxX = Math.max(maxX, x + width / 2);
    maxY = Math.max(maxY, y + height / 2);
  });

  return {
    x: minX - padding,
    y: minY - padding,
    width: maxX - minX + 2 * padding,
    height: maxY - minY + 2 * padding,
  };
}

function calculateScaleAndTranslate(
  boundingBox,
  svgWidth,
  svgHeight,
  horizontal
) {
    const scale = Math.min(
        svgWidth / boundingBox.width,
        svgHeight / boundingBox.height
      );
    
    const translateX =
      svgWidth / 2 - scale * (boundingBox.x + boundingBox.width / 2);
    const translateY =
      svgHeight / 2 - scale * (boundingBox.y + boundingBox.height / 2);

  if (horizontal) {
    // Reverse the x and y translations
    return {
      scale: scale,
      translate: {
        x: translateY,
        y: translateX,
      },
    };
  } else {
    return {
      scale: scale,
      translate: {
        x: translateX,
        y: translateY,
      },
    };
  }
}


