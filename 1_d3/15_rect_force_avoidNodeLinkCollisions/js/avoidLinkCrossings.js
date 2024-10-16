function avoidLinkCrossings() {
  let nodes, links;

  function force() {
    const n = links.length;

    for (let i = 0; i < n; ++i) {
      const linkA = links[i];
      const sourceA = linkA.source;
      const targetA = linkA.target;

      for (let j = i + 1; j < n; ++j) {
        const linkB = links[j];
        const sourceB = linkB.source;
        const targetB = linkB.target;

        // Check if links cross
        if (linksCross(sourceA, targetA, sourceB, targetB)) {
          // Apply forces to nodes to reduce crossing
          const dx = (sourceB.x + targetB.x - (sourceA.x + targetA.x)) / 2;
          const dy = (sourceB.y + targetB.y - (sourceA.y + targetA.y)) / 2;

          const strength = 0.1; // Adjust the strength as needed

          sourceA.vx -= dx * strength;
          sourceA.vy -= dy * strength;
          targetA.vx -= dx * strength;
          targetA.vy -= dy * strength;

          sourceB.vx += dx * strength;
          sourceB.vy += dy * strength;
          targetB.vx += dx * strength;
          targetB.vy += dy * strength;
        }
      }
    }
  }

  force.initialize = function (_) {
    nodes = _;
  };

  force.links = function (_) {
    return arguments.length ? ((links = _), force) : links;
  };

  return force;
}

// Helper function to determine if two line segments (links) cross.
// Uses the concept of orientation (counter-clockwise) 
// to determine if two line segments (links) cross.
function linksCross(a1, a2, b1, b2) {
  function ccw(p1, p2, p3) {
    return (p3.y - p1.y) * (p2.x - p1.x) > (p2.y - p1.y) * (p3.x - p1.x);
  }
  return ccw(a1, b1, b2) !== ccw(a2, b1, b2) && ccw(a1, a2, b1) !== ccw(a1, a2, b2);
}
