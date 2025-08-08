function forceBoundary(x0, y0, x1, y1) {
    let nodes;
  
    function force() {
      for (let i = 0, n = nodes.length; i < n; ++i) {
        const node = nodes[i];
        const halfWidth = node.width / 2;
        const halfHeight = node.height / 2;
  
        // Enforce left boundary
        if (node.x - halfWidth < x0) {
          node.x = x0 + halfWidth;
        }
        // Enforce right boundary
        if (node.x + halfWidth > x1) {
          node.x = x1 - halfWidth;
        }
        // Enforce top boundary
        if (node.y - halfHeight < y0) {
          node.y = y0 + halfHeight;
        }
        // Enforce bottom boundary
        if (node.y + halfHeight > y1) {
          node.y = y1 - halfHeight;
        }
      }
    }
  
    force.initialize = function(_) {
      nodes = _;
    };
  
    return force;
  }
  