import { getComputedDimensions } from "./layout.js";
import { changeDirection } from "./util.js";
import { updateMinimapViewport } from "./minimap.js";
import { zoomToNode } from "./zoom.js";

export function setup(divSelector) {
  // Set up the main view
  const mainSvg = d3.select(`${divSelector}`);
  const { width: mainWidth, height: mainHeight } = getComputedDimensions(mainSvg);

  return { svg: mainSvg, width: mainWidth, height: mainHeight, onDragUpdate: updateMainView };
}

export function draw(dashboard, dag) {
  // start with a clean slate
  dashboard.main.canvas.svg.selectAll("*").remove();

  // Draw drawing boundary
  let showBoundary = true;
  if (showBoundary) drawBoundary(dashboard.main.canvas);

  // Draw edges
  drawEdges(dashboard.main.canvas, dashboard, dag);

  // Draw nodes
  drawNodes(dashboard.main.canvas, dashboard, dag, onNodeClickFunction);
}

function onNodeClickFunction(event, node, dashboard, dag) {
  console.log("onClickFunction", node.data.label, node);
  zoomToNode(node, dashboard, dag);
}

export function drawMinimap(dashboard, dag) {
  const canvas = dashboard.minimap.canvas;
  // start with a clean slate
  canvas.svg.selectAll("*").remove();

  // Draw drawing boundary
  let showBoundary = true;
  if (showBoundary) drawBoundary(canvas);

  // Draw edges
  drawEdges(canvas, dashboard, dag);

  // Draw nodes
  drawNodes(canvas, dashboard, dag, onNodeClickFunction, false, true);
}

// Function to update the main SVG based on the viewport rectangle position
export function updateMainView(drag, dashboard) {
  // Maintain the current scale
  const currentTransform = d3.zoomTransform(dashboard.main.canvas.svg.node());
  const k = currentTransform.k;

  // Calculate the translation
  const x = -drag.x * k;
  const y = -drag.y * k;

  dashboard.main.canvas.svg.call(dashboard.zoom.transform, d3.zoomIdentity.translate(x, y).scale(k));
}

function drawBoundary(canvas) {
  const drawingBoundary = canvas.svg
    .append("g")
    .append("rect")
    .attr("class", (d) => `drawing_boundary`)
    .attr("x", (d) => 0)
    .attr("y", (d) => 0)
    .attr("width", (d) => canvas.width)
    .attr("height", (d) => canvas.height);
}

function drawNodes(canvas, dashboard, dag, onClickFunction, showConnectionPoints = false, minimap = false) {
  // Draw nodes
  const node = canvas.svg
    .append("g")
    .selectAll(".node")
    .data(dag.nodes())
    .enter()
    .append("g")
    // .attr("id", d => `${d.data.id}`)
    .attr("class", (d) => `node  s${d.data.state}`)
    .attr(
      "transform",
      (d) =>
        `translate(${changeDirection(d.x, d.y, dashboard.layout.horizontal).x - d.data.width / 2},${
          changeDirection(d.x, d.y, dashboard.layout.horizontal).y - d.data.height / 2
        })`
    );

  const nodes = node
    .append("rect")
    .attr("class", (d) => `nodeRect`)
    .attr("width", (d) => d.data.width)
    .attr("height", (d) => d.data.height)
    .attr("rx", 5)
    .attr("ry", 5);

  // Add the click event
  nodes.on("click", function (event, node) {
    // console.log("Node clicked:", d);
    onClickFunction(event, node, dashboard, dag);
    // function onNodeClickFunction(event, node, canvas, layout, zoom, dag) {
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
      const connectionPoints = computeConnectionPoints(d.data.width, d.data.height);
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

function generateDirectEdge(edge, layout) {
  const sourceNode = edge.source;
  const targetNode = edge.target;

  let sourcePoint, targetPoint;
  sourcePoint = [sourceNode.x, sourceNode.y];

  targetPoint = [targetNode.x, targetNode.y];

  return [sourcePoint, targetPoint];
}

export function generateEdgePath(edge, layout) {
  const sourceNode = edge.source;
  const targetNode = edge.target;

  const sourceConnectionPoints = computeConnectionPoints(sourceNode.data.width, sourceNode.data.height);
  const targetConnectionPoints = computeConnectionPoints(targetNode.data.width, targetNode.data.height);

  let sourcePoint, targetPoint;

  if (layout.horizontal) {
    sourcePoint = sourceConnectionPoints.right;
    targetPoint = targetConnectionPoints.left;
  } else {
    sourcePoint = sourceConnectionPoints.bottom;
    targetPoint = targetConnectionPoints.top;
  }

  sourcePoint = [
    changeDirection(sourceNode.x, sourceNode.y, layout.horizontal).x + sourcePoint.x - sourceNode.data.width / 2,
    changeDirection(sourceNode.x, sourceNode.y, layout.horizontal).y + sourcePoint.y - sourceNode.data.height / 2,
  ];

  targetPoint = [
    changeDirection(targetNode.x, targetNode.y, layout.horizontal).x + targetPoint.x - targetNode.data.width / 2,
    changeDirection(targetNode.x, targetNode.y, layout.horizontal).y + targetPoint.y - targetNode.data.height / 2,
  ];

  // Calculate waypoints
  let waypoints;
  const midX = (targetPoint[0] - sourcePoint[0]) / 2;
  const midY = (targetPoint[1] - sourcePoint[1]) / 2;
  if (layout.horizontal) {
    if (layout.isEdgeCurved) {
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
    if (layout.isEdgeCurved) {
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

function drawEdges(canvas, dashboard, dag) {
  // Define arrowhead marker
  canvas.svg
    .append("defs")
    .append("marker")
    .attr("id", "arrowhead")
    .attr("class", "marker")
    .attr("viewBox", "-0 -5 10 10")
    .attr("refX", changeDirection(10, 10, dashboard.layout.horizontal).x)
    .attr("refY", 0)
    .attr("orient", "auto")
    .attr("markerWidth", 4)
    .attr("markerHeight", 4)
    .attr("xoverflow", "visible")
    .append("svg:path")
    .attr("d", "M 0,-5 L 10 ,0 L 0,5");

  canvas.svg
    .append("defs")
    .append("marker")
    .attr("id", "circle-marker")
    .attr("class", "circlemarker")
    .attr("viewBox", "-5 -5 10 10")
    .attr("refX", 0)
    .attr("refY", 0)
    .attr("orient", "auto")
    .attr("markerWidth", 4)
    .attr("markerHeight", 4)
    .attr("xoverflow", "visible")
    .append("circle")
    .attr("cx", 0)
    .attr("cy", 0)
    .attr("r", 5);

  // Draw ghostlines
  if (dashboard.layout.showGhostlines) {
    canvas.svg
      .append("g")
      .selectAll(".ghostline")
      .data(dag.links())
      .enter()
      .append("path")
      .attr("class", "ghostline")
      .attr("d", (edge) => {
        const points = generateDirectEdge(edge, dashboard.layout);
        return dashboard.layout.lineGenerator(points);
      });
  }

  // Draw edges
  if (dashboard.layout.showEdges) {
    canvas.svg
      .append("g")
      .selectAll(".edge")
      .data(dag.links())
      .enter()
      .append("path")
      .attr("class", "edge")
      .attr("d", (edge) => {
        const points = generateEdgePath(edge, dashboard.layout);
        // console.log("    ", points);
        return dashboard.layout.lineGenerator(points);
      });
  }
}

export function updateNodeStatus(stateUpdate) {
  //console.log(`id=${stateUpdate.id} --> state=${stateUpdate.state}`); // Log the node data to the console
  const node = d3
    .selectAll(".node")
    .filter((d) => d.data.id === `${stateUpdate.id}`)
    .attr("class", (d) => {
      //console.log(d); // Log the node data to the console
      return `node s${stateUpdate.state}`;
    });
}
