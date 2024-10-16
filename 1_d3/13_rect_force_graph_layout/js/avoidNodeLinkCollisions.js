function avoidNodeLinkCollisions() {
    let nodes, links;
    const log = false;
    let quadtree;
  
    function force(alpha) {
      // Update quadtree with current node positions only if not initialized
      if (!quadtree) {
        quadtree = d3.quadtree()
          .x(d => d.x)
          .y(d => d.y)
          .addAll(nodes);
      } else {
        nodes.forEach(node => quadtree.add(node)); // Incrementally update the quadtree
      }
  
      const m = links.length;
  
      for (let i = 0; i < nodes.length; ++i) {
        const node = nodes[i];
  
        // Use quadtree to find nearby links to consider for collision
        quadtree.visit((quad, x0, y0, x1, y1) => {
          if (!quad.data) return false; // Skip empty quadrants
  
          for (let j = 0; j < m; ++j) {
            const link = links[j];
            const source = link.source;
            const target = link.target;
  
            // Skip if the node is part of the link
            if (node === source || node === target) continue;
  
            // Calculate the closest point on the link to the node rectangle
            const { linePoint, rectPoint } = closestPointOnSegment(
              node.x, node.y, node.width, node.height, source.x, source.y, target.x, target.y
            );
  
            if (log) console.log(`AvoidLink Collision ${node.name} and ${source.name} --> ${target.name}`, linePoint, rectPoint, alpha);
  
            let dx = linePoint.x - rectPoint.x;
            let dy = linePoint.y - rectPoint.y;
  
            if (dy === 0 && dx === 0) {
              dx = 0.01;
              dy = 0.01;
            }
  
            let distance = Math.sqrt(dx * dx + dy * dy);
            const minDistance = 10; // Minimum distance between link and node rectangle
  
            if (distance < minDistance) {
              if (log) console.log("   --- OVERLAP ===", minDistance, distance);
  
              const strength = 0.5 * alpha; // Increase the strength slightly for smoother avoidance
              const effectiveDistance = Math.max(minDistance - distance, 0.0001);
  
              const forceX = (dx / distance) * effectiveDistance * strength;
              const forceY = (dy / distance) * effectiveDistance * strength;
  
              if (log) console.log("      forces", forceX, "forceY", forceY, "node.vx", node.x, "node.y", node.y);
  
              node.vx += forceX;
              node.vy += forceY;
  
            // Adjust connected nodes to move in the same direction as the node
            links.forEach(link => {
                if (link.source === node || link.target === node) {
                  const otherNode = link.source === node ? link.target : link.source;
                  otherNode.x += forceX * 0.05;
                  otherNode.y += forceY * 0.05;
                }
              });
            }
          }
        });
      }
    }
  
    force.initialize = function(_) {
      nodes = _;
      nodes.forEach(node => {
        if (isNaN(node.x) || isNaN(node.y) || isNaN(node.width) || isNaN(node.height)) {
          console.warn("Node properties are not correctly initialized", node);
        }
      });
      quadtree = d3.quadtree().x(d => d.x).y(d => d.y).addAll(nodes);
    };
  
    force.links = function(_) {
      return arguments.length ? (links = _, force) : links;
    };
  
    return force;
  }
  
  function closestPointOnSegment(x, y, width, height, x1, y1, x2, y2) {
    // Rectangle bounds
    const rect = {
      left: x - width / 2,
      right: x + width / 2,
      top: y - height / 2,
      bottom: y + height / 2
    };
  
    // Line segment vector
    const dx = x2 - x1;
    const dy = y2 - y1;
  
    // Parameter t for the projection of point onto the line segment
    let t = ((rect.left - x1) * dx + (rect.top - y1) * dy) / (dx * dx + dy * dy);
    t = Math.max(0, Math.min(1, t));
  
    // Closest point on the segment
    const linePoint = {
      x: x1 + t * dx,
      y: y1 + t * dy
    };
  
    // Closest point on the rectangle perimeter to the line point
    const rectPoint = {
      x: Math.max(rect.left, Math.min(linePoint.x, rect.right)),
      y: Math.max(rect.top, Math.min(linePoint.y, rect.bottom))
    };
  
    return { linePoint, rectPoint };
  }