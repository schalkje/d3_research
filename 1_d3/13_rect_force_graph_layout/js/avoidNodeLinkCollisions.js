function avoidNodeLinkCollisions() {
    let nodes, links;
    const log = false;
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
            const { linePoint, rectPoint } = closestPointOnSegment(node.x, node.y, node.width, node.height, source.x, source.y, target.x, target.y);
            if (log) console.log(`avoidLink Collision ${node.name} and ${source.name} --> ${target.name}`,linePoint, rectPoint, alpha);
  
            let dx = linePoint.x - rectPoint.x;
            let dy = linePoint.y - rectPoint.y;
            if (dy === 0 && dx===0) {
                dx = 0.01; 
                dy = 0.01; 
            }

            // console.log("dx",nodeMinX - point.x, 0, point.x - nodeMaxX);
            // const dy = Math.max(nodeMinY - point.y, 0, point.y - nodeMaxY);
            if (log) console.log("dx",dx,"dy",dy);
            let distance = Math.sqrt(dx * dx + dy * dy);
 
            const minDistance = 10; // Minimum distance between link and node rectangle
  
            if (distance < minDistance) {
                if (log) console.log("   --- OVERLAP ===", minDistance, distance);
                const strength = 0.1 * alpha; // Adjust the strength as needed and apply alpha for smooth adjustment

                const effectiveDistance = Math.max(minDistance - distance, 0.0001);

                const forceX = (dx / distance) * (minDistance - distance) * strength;
                if (log) console.log("      forceX",forceX, dx ,distance, minDistance , strength);
                const forceY = (dy / distance) * (minDistance - distance) * strength;
                if (log) console.log("      forceY",forceY, dy ,distance, minDistance , strength);
  
            //   node.vx += forceX;
            //   node.vy += forceY;
            if (log) console.log("      forces",forceX,"forceY",forceY, "node.vx",node.x,"node.y",node.y);
              node.x += forceX;
              node.y += forceY;
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
        quadtree.addAll(nodes);
      };
  
    force.links = function(_) {
      return arguments.length ? (links = _, force) : links;
    };
  
    return force;
  }
  
  function closestPointOnSegment(x, y, width, height, x1, y1, x2, y2) {
    const rectHalfWidth = width / 2;
    const rectHalfHeight = height / 2;
  
    // Rectangle bounds
    const nodeMinX = x - rectHalfWidth;
    const nodeMaxX = x + rectHalfWidth;
    const nodeMinY = y - rectHalfHeight;
    const nodeMaxY = y + rectHalfHeight;
  
    // Calculate closest point on the line segment to the center of the rectangle
    const dx = x2 - x1;
    const dy = y2 - y1;
    const lengthSquared = dx * dx + dy * dy;
  
    let t = ((x - x1) * dx + (y - y1) * dy) / lengthSquared;
    t = Math.max(0, Math.min(1, t)); // Clamp t to the segment
  
    const linePoint = {
      x: x1 + t * dx,
      y: y1 + t * dy
    };
  
    // Calculate the closest point on the rectangle to the line point
    const rectPoint = {
      x: Math.max(nodeMinX, Math.min(linePoint.x, nodeMaxX)),
      y: Math.max(nodeMinY, Math.min(linePoint.y, nodeMaxY))
    };
  
    return { linePoint, rectPoint };
  }