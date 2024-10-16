function avoidNodeLinkCollisions() {
    let nodes, links;
    const log = false;
    let quadtree;

    function force(alpha) {
        // Update quadtree with current node positions
        quadtree = d3.quadtree()
            .x(d => d.x)
            .y(d => d.y)
            .addAll(nodes);

        const m = links.length;
        const linkNodeModeFactor = 0.5;

        for (let i = 0; i < nodes.length; ++i) {
            const node = nodes[i];

            // Loop over all links to check for potential collisions
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

                let dx = linePoint.x - rectPoint.x;
                let dy = linePoint.y - rectPoint.y;

                if (dy === 0 && dx === 0) {
                    dx = 0.01;
                    dy = 0.01;
                }

                let distance = Math.sqrt(dx * dx + dy * dy);
                const minDistance = 10; // Minimum distance between link and node rectangle

                if (distance < minDistance) {
                    const strength = 0.5 * alpha;
                    const effectiveDistance = Math.max(minDistance - distance, 0.0001);

                    let forceX = (dx / distance) * effectiveDistance * strength;
                    let forceY = (dy / distance) * effectiveDistance * strength;

                    let reverseForce = false;

                    // Check if moving the node would pull connected nodes closer to the link
                    links.forEach(connLink => {
                        if (connLink.source === node || connLink.target === node) {
                                const otherNode = connLink.source === node ? connLink.target : connLink.source;

                            // Distance from connected node to the link before moving
                            const { linePoint: linePointBefore, rectPoint: rectPointBefore } = closestPointOnSegment(
                                otherNode.x, otherNode.y, otherNode.width, otherNode.height, source.x, source.y, target.x, target.y
                            );
                            const dxBefore = linePointBefore.x - rectPointBefore.x;
                            const dyBefore = linePointBefore.y - rectPointBefore.y;
                            const distanceBefore = Math.sqrt(dxBefore * dxBefore + dyBefore * dyBefore);

                            // Expected position of connected node after moving
                            const otherNodeNewX = otherNode.x + forceX * linkNodeModeFactor;
                            const otherNodeNewY = otherNode.y + forceY * linkNodeModeFactor;

                            // Distance from connected node to the link after moving
                            const { linePoint: linePointAfter, rectPoint: rectPointAfter } = closestPointOnSegment(
                                otherNodeNewX, otherNodeNewY, otherNode.width, otherNode.height, source.x, source.y, target.x, target.y
                            );
                            const dxAfter = linePointAfter.x - rectPointAfter.x;
                            const dyAfter = linePointAfter.y - rectPointAfter.y;
                            const distanceAfter = Math.sqrt(dxAfter * dxAfter + dyAfter * dyAfter);

                            if (distanceAfter < distanceBefore) {
                                reverseForce = true;
                                if (log) console.log(`Reversing force for node ${node.name} due to connected node ${otherNode.name}`);
                                return;
                            }
                        }
                    });

                    if (reverseForce) {
                        forceX = -forceX * node.width;
                        forceY = -forceY * node.height;
                    }

                    node.vx += forceX;
                    node.vy += forceY;

                    // Adjust connected nodes to move in the same direction
                    links.forEach(connLink => {
                        if (connLink.source === node || connLink.target === node) {
                            const otherNode = connLink.source === node ? connLink.target : connLink.source;
                            otherNode.x += forceX * linkNodeModeFactor;
                            otherNode.y += forceY * linkNodeModeFactor;
                        }
                    });
                }
            }
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