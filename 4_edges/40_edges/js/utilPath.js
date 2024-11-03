const ConnectorSide = Object.freeze({
  TOP: "top",
  RIGHT: "right",
  BOTTOM: "bottom",
  LEFT: "left",
});

export function computeConnectionPoints(x, y, width, height) {
  return {
    top: { side: ConnectorSide.TOP, x: x, y: y - height / 2 },
    bottom: { side: ConnectorSide.BOTTOM, x: x, y: y + height / 2 },
    left: { side: ConnectorSide.LEFT, x: x - width / 2, y: y },
    right: { side: ConnectorSide.RIGHT, x: x + width / 2, y: y },
  };
}

export function computeLocalConnectionPoints(width, height) {
  return {
    top: { x: width / 2, y: 0 },
    bottom: { x: width / 2, y: height },
    left: { x: 0, y: height / 2 },
    right: { x: width, y: height / 2 },
  };
}

export function generateEdgePath(edge) {
  console.log(`    Generating Edge Path [${edge.sourcePoint}] -> [${edge.targetPoint}]:`, edge);
  const sourceNode = edge.source;
  const targetNode = edge.target;

  const sourceConnectionPoints = sourceNode.computeConnectionPoints(
    edge.x1,
    edge.y1,
    sourceNode.data.width,
    sourceNode.data.height
  );
  console.log("    Source Connection Points:", sourceConnectionPoints);
  const targetConnectionPoints = targetNode.computeConnectionPoints(
    edge.x2,
    edge.y2,
    targetNode.data.width,
    targetNode.data.height
  );
  console.log("    Target Connection Points:", targetConnectionPoints);

  let sourcePoint, targetPoint;

  // look for closest connection points to straight line
  let minDistance = Number.MAX_VALUE;
  Object.values(sourceConnectionPoints).forEach((source) => {
    Object.values(targetConnectionPoints).forEach((target) => {
      console.log("    Checking Connection Points:", source, target);

      // exclude wrong connections
      // Vertical constraints (top and bottom)
      if (
        (source.side == ConnectorSide.BOTTOM && source.y > target.y) ||
        (target.side == ConnectorSide.TOP && source.y > target.y) ||
        (source.side == ConnectorSide.TOP && source.y < target.y) ||
        (target.side == ConnectorSide.BOTTOM && source.y < target.y)
      ) {
        return;
      }
      // Horizontal constraints (left and right)
      if (
        (source.side == ConnectorSide.LEFT && source.x < target.x) ||
        (source.side == ConnectorSide.RIGHT && source.x > target.x) ||
        (target.side == ConnectorSide.RIGHT && source.x < target.x) ||
        (target.side == ConnectorSide.LEFT && source.x > target.x)
      ) {
        return;
      }

      // calculate distance
      const distance = Math.sqrt((source.x - target.x) ** 2 + (source.y - target.y) ** 2);
      // store if it is smaller than the current minimum distance
      if (distance < minDistance) {
        minDistance = distance;
        sourcePoint = source;
        targetPoint = target;
      }
    });
  });

  // Calculate waypoints
  // there are different scenarios to consider:
  let waypoints = [];
  const midX = (targetPoint.x - sourcePoint.x) / 2;
  const midY = (targetPoint.y - sourcePoint.y) / 2;
  if (
    (sourcePoint.side == ConnectorSide.LEFT && targetPoint.side == ConnectorSide.RIGHT) ||
    (sourcePoint.side == ConnectorSide.RIGHT && targetPoint.side == ConnectorSide.LEFT)
  ) {
    // left to right or right to left
    console.log("    Generating Edge Path: Left to Right or Right to Left");
    if (edge.settings.curved) {
      waypoints = [
        // // for a curve
        [sourcePoint.x + midX * 0.9, sourcePoint.y + midY * 0.1], // Move horizontally to half the distance
        [sourcePoint.x + midX * 1.1, targetPoint.y - midY * 0.1], // Stay on x and move vertically
      ];
    } else {
      waypoints = [
        [sourcePoint.x + midX, sourcePoint.y], // Move horizontally to half the distance
        [sourcePoint.x + midX, targetPoint.y], // Stay on x and move vertically
      ];
    }
  } else if (
    (sourcePoint.side == ConnectorSide.BOTTOM && targetPoint.side == ConnectorSide.TOP) ||
    (sourcePoint.side == ConnectorSide.TOP && targetPoint.side == ConnectorSide.BOTTOM)
  ) {
    // bottom to top or top to bottom
    if (edge.settings.curved) {
      waypoints = [
        // // for a curve
        [sourcePoint.x + midX * 0.1, sourcePoint.y + midY * 0.9], // Move vertically to half the distance
        [targetPoint.x - midX * 0.1, targetPoint.y + midY * 1.1], // Stay on y and move horizontal
      ];
    } else {
      waypoints = [
        [sourcePoint.x, sourcePoint.y + midY], // Move vertically to half the distance
        [targetPoint.x, sourcePoint.y + midY], // Stay on y and move horizontal
      ];
    }
  } else if (
    (sourcePoint.side == ConnectorSide.BOTTOM || sourcePoint.side == ConnectorSide.TOP) &&
    (targetPoint.side == ConnectorSide.LEFT || targetPoint.side == ConnectorSide.RIGHT)
  ) {
    // bottom to top or top to bottom
    if (edge.settings.curved) {
      waypoints = [
        // // for a curve
        [sourcePoint.x + midX * 0.1, targetPoint.y - midY * 0.1], // Stay on y and move horizontal
      ];
    } else {
      waypoints = [[sourcePoint.x, targetPoint.y]];
    }
  } else if (
    (sourcePoint.side == ConnectorSide.LEFT || sourcePoint.side == ConnectorSide.RIGHT) &&
    (targetPoint.side == ConnectorSide.TOP || targetPoint.side == ConnectorSide.BOTTOM)
  ) {
    // bottom to top or top to bottom
    if (edge.settings.curved) {
      waypoints = [
        // // for a curve
        [targetPoint.x - midX * 0.1, sourcePoint.y + midY * 0.1], // Stay on y and move horizontal
      ];
    } else {
      waypoints = [[targetPoint.x, sourcePoint.y]];
    }
  } else {
    console.error("    ERROR: Unsupported edge connection:", sourcePoint.side, targetPoint.side);
  }

  //   const result = [edge.sourcePoint, toPoint(sourcePoint), ...waypoints, toPoint(targetPoint)];
  const result = [toPoint(sourcePoint), ...waypoints, toPoint(targetPoint)];
  console.log("    Generating Edge Path:", result, edge.sourcePoint);
  //   return [sourcePoint, ...waypoints, targetPoint];
  return result;
}

function toPoint(point) {
  return [point.x, point.y];
}
export function generateDirectEdge(edge) {
  return [edge.sourcePoint, edge.targetPoint];
}