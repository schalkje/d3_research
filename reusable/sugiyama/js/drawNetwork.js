// const { min } = require("d3");

function setupMainView(divSelector) {
  // Set up the main view
  const mainSvg = d3.select(`${divSelector}`);
  const { width: mainWidth, height: mainHeight } = getComputedDimensions(mainSvg);

  return {svg:mainSvg, width:mainWidth, height:mainHeight};
}


function drawMain(svg_canvas, dag, horizontal, width, height, lineGenerator) {
  // console.log("drawMain - clean children", svg_canvas);
  // start with a clean slate
  svg_canvas.selectAll("*").remove();

  // Draw drawing boundary
  let showBoundary = true;
  drawBoundary(svg_canvas, dag, width, height, showBoundary);

  // Draw edges
  drawEdges(svg_canvas, dag, width, height, horizontal, lineGenerator);

  // Draw nodes
  drawNodes(svg_canvas, dag, horizontal, onNodeClickFunction);
}

function onNodeClickFunction(event, d) {
  console.log("onClickFunction", d.data.label, d);
  zoomToNode(svg_canvas, d, dag, zoom, width, height, horizontal);
}

function drawMinimap(svg_canvas, dag, horizontal, width, height, lineGenerator) {
  // start with a clean slate
  svg_canvas.selectAll("*").remove();

  // Draw drawing boundary
  let showBoundary = true;
  drawBoundary(svg_canvas, dag, width, height, showBoundary);

  // Draw edges
  drawEdges(svg_canvas, dag, width, height, horizontal, lineGenerator);

  // Draw nodes
  drawNodes(svg_canvas, dag, horizontal, onNodeClickFunction, false, true);

  // Initial update of the viewport rectangle
  updateViewport(d3.zoomIdentity);
}

function changeDirection(x, y, horizontal = true) {
  if (horizontal) {
    return { x: y, y: x };
  } else {
    return { x: x, y: y };
  }
}

function changePointDirection(points, horizontal) {
  if (horizontal) {
    return points.map((point) => [point[1], point[0]]); // Swap x and y when horizontal is true
  }
  return points; // Return points unchanged when horizontal is false
}

function drawBoundary(
  svg_canvas,
  dag,
  width,
  height,
  showBoudary = false
) {
  if (showBoudary) {
    const drawingBoundary = svg_canvas
      .append("g")
      .append("rect")
      .attr("class", (d) => `drawing_boundary`)
      .attr("x", (d) => 0)
      .attr("y", (d) => 0)
      .attr("width", (d) => width)
      .attr("height", (d) => height);
  }
}

function drawNodes(svg, dag, horizontal, onClickFunction, showConnectionPoints = false, minimap = false) {
  // Draw nodes
  const node = svg
    .append("g")
    .selectAll(".nodecontainer")
    .data(dag.nodes())
    .enter()
    .append("g")
    .attr("class", (d) => `nodecontainer`)
    .attr(
      "transform",
      (d) =>
        `translate(${
          changeDirection(d.x, d.y, horizontal).x - d.data.width / 2
        },${changeDirection(d.x, d.y, horizontal).y - d.data.height / 2})`
    );



  const nodes = node
    .append("rect")
    .attr("class", (d) => `node`)
    // .attr("class", d => `node s${d.data.data.state}`)
    .attr("width", (d) => d.data.width)
    .attr("height", (d) => d.data.height)
    .attr("rx", 5)
    .attr("ry", 5);

    // Add the click event
    nodes.on("click", function(event, d) {
        // console.log("Node clicked:", d);
        onClickFunction(event,d);
    });

  if (!minimap) {
    node
      .append("text")
      .attr("class", "label")
      .attr("x", (d) => d.data.width / 2)
      .attr("y", (d) => d.data.height / 2 + 5)
      .text((d) => d.data.label);
  }

  if (showConnectionPoints) {
    node.each(function (d) {
      const connectionPoints = computeConnectionPoints(
        d.data.width,
        d.data.height
      );
      Object.values(connectionPoints).forEach((point) => {
        d3.select(this)
          .append("circle")
          .attr("class", "connection-point")
          .attr("cx", point.x)
          .attr("cy", point.y)
          .attr("r", 3);
      });
    });
  }
}



function computeConnectionPoints(width, height) {
  return {
    top: { x: width / 2, y: 0 },
    bottom: { x: width / 2, y: height },
    left: { x: 0, y: height / 2 },
    right: { x: width, y: height / 2 },
  };
}

function generateEdgePath(d, horizontal) {
//   console.log("d", d);
  const sourceNode = d.source;
  const targetNode = d.target;

  const sourceConnectionPoints = computeConnectionPoints(
    sourceNode.data.width,
    sourceNode.data.height
  );
  const targetConnectionPoints = computeConnectionPoints(
    targetNode.data.width,
    targetNode.data.height
  );

  let sourcePoint, targetPoint;

  if (horizontal) {
    sourcePoint = sourceConnectionPoints.right;
    targetPoint = targetConnectionPoints.left;
  } else {
    sourcePoint = sourceConnectionPoints.bottom;
    targetPoint = targetConnectionPoints.top;
  }

  sourcePoint = [
    changeDirection(sourceNode.x, sourceNode.y, horizontal).x +
      sourcePoint.x -
      sourceNode.data.width / 2,
    changeDirection(sourceNode.x, sourceNode.y, horizontal).y +
      sourcePoint.y -
      sourceNode.data.height / 2,
  ];

  targetPoint = [
    changeDirection(targetNode.x, targetNode.y, horizontal).x +
      targetPoint.x -
      targetNode.data.width / 2,
    changeDirection(targetNode.x, targetNode.y, horizontal).y +
      targetPoint.y -
      targetNode.data.height / 2,
  ];

  // Calculate waypoints
  let waypoints;
  const midX = (targetPoint[0] - sourcePoint[0]) / 2;
  const midY = (targetPoint[1] - sourcePoint[1]) / 2;
  if (horizontal) {
    if (isEdgeCurved) {
      waypoints = [
        // // for a curve
        [sourcePoint[0] + midX * 0.9, sourcePoint[1] + midY * 0.1], // Move horizontally to half the distance
        [sourcePoint[0] + midX * 1.1, targetPoint[1] + midY * 0.1], // Stay on x and move vertically
      ];
    } else {
      waypoints = [
        [sourcePoint[0] + midX, sourcePoint[1]], // Move horizontally to half the distance
        [sourcePoint[0] + midX, targetPoint[1]], // Stay on x and move vertically
      ];
    }
  } else {
    if (isEdgeCurved) {
      // // for a curve
      waypoints = [
        [sourcePoint[0] + midX * 0.1, sourcePoint[1] + midY * 0.9], // Move horizontally to half the distance
        [targetPoint[0] - midX * 0.1, sourcePoint[1] + midY * 1.5], // Stay on x and move vertically
      ];
    } else {
      waypoints = [
        [sourcePoint[0], sourcePoint[1] + midY], // Move horizontally to half the distance
        [targetPoint[0], sourcePoint[1] + midY], // Stay on x and move vertically
      ];
    }
  }

  return [sourcePoint, ...waypoints, targetPoint];
}

function drawEdges(svg, dag, width, height, horizontal, lineGenerator) {
  // Define arrowhead marker
  svg
    .append("defs")
    .append("marker")
    .attr("id", "arrowhead")
    .attr("class", "marker")
    .attr("viewBox", "-0 -5 10 10")
    .attr("refX", changeDirection(10, 10, horizontal).x)
    .attr("refY", 0)
    .attr("orient", "auto")
    .attr("markerWidth", 4)
    .attr("markerHeight", 4)
    .attr("xoverflow", "visible")
    .append("svg:path")
    .attr("d", "M 0,-5 L 10 ,0 L 0,5");

  // Draw edges
  svg
    .append("g")
    .selectAll(".edge")
    .data(dag.links())
    .enter()
    .append("path")
    .attr("class", "edge")
    .attr("d", (d) => {
    //   console.log("link points for path d: ", d);
    //   console.log("link points for path: ", d.points);
    //   console.log(
    //     "link points for path changed: ",
    //     changePointDirection(d.points, horizontal)
    //   );
      // // return lineGenerator(d.points);
      // return lineGenerator(changePointDirection(d.points, horizontal));

      const points = generateEdgePath(d, horizontal);
    //   console.log("points", points);
      return lineGenerator(points);
    });
}
