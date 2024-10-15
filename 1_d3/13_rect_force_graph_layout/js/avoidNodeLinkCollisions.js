function avoidNodeLinkCollisions() {
    let nodes, links;
  
    // Create a quadtree for efficient spatial queries
    const quadtree = d3.quadtree()
      .x(d => d.x)
      .y(d => d.y);
  
    function force(alpha) {
      // Update quadtree with current node positions
      quadtree.addAll(nodes);
  
      const m = links.length;
  
      for (let i = 0; i < nodes.length; ++i) {
        const node = nodes[i];
  
        // Use quadtree to find nearby links to consider for collision
        quadtree.visit((quad, x0, y0, x1, y1) => {
          if (!quad.data) return false; // If there is no data in this quadrant, skip it
  
          for (let j = 0; j < m; ++j) {
            const link = links[j];
            const source = link.source;
            const target = link.target;
  
            // Skip if the node is part of the link
            if (node === source || node === target) continue;
  
            // Calculate the closest point on the link to the node rectangle
            const point = closestPointOnSegment(node.x, node.y, source.x, source.y, target.x, target.y, node.width, node.height);
            console.log("point",point)
  
            // Check if the node's bounding box intersects with the link
            const rectHalfWidth = node.width / 2;
            const rectHalfHeight = node.height / 2;
            const nodeMinX = node.x - rectHalfWidth;
            const nodeMaxX = node.x + rectHalfWidth;
            const nodeMinY = node.y - rectHalfHeight;
            const nodeMaxY = node.y + rectHalfHeight;
  
            const dx = Math.max(nodeMinX - point.x, 0, point.x - nodeMaxX);
            const dy = Math.max(nodeMinY - point.y, 0, point.y - nodeMaxY);
            const distance = Math.sqrt(dx * dx + dy * dy);
  
            const minDistance = 10; // Minimum distance between link and node rectangle
  
            if (distance < minDistance) {
              const strength = 0.1 * alpha; // Adjust the strength as needed and apply alpha for smooth adjustment
              const forceX = (dx / distance) * (minDistance - distance) * strength;
              const forceY = (dy / distance) * (minDistance - distance) * strength;
  
              node.vx += forceX;
              node.vy += forceY;
            }
          }
        });
      }
    }
  
    force.initialize = function(_) {
      nodes = _;
      // Initialize quadtree with nodes
      console.log("force.initialize nodes",nodes);
      quadtree.addAll(nodes);
    };
  
    force.links = function(_) {
      return arguments.length ? (links = _, force) : links;
    };
  
    return force;
  }
  
  function closestPointOnSegment(px, py, x1, y1, x2, y2) {
    console.log("px",px,"py",py,"x1",x1,"y1",y1,"x2",x2,"y2",y2);
    const dx = x2 - x1;
    const dy = y2 - y1;
    const lengthSquared = dx * dx + dy * dy;
  
    if (lengthSquared === 0) {
      return { x: x1, y: y1 }; // The segment is a point
    }
  
    let t = ((px - x1) * dx + (py - y1) * dy) / lengthSquared;
    t = Math.max(0, Math.min(1, t)); // Clamp t to the segment
  
    return {
      x: x1 + t * dx,
      y: y1 + t * dy
    };
  }