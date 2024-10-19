
export function computeBoundingBox(nodes, horizontal = false) {
    const padding = 2; // Add some padding
    // console.log('computeBoundingBox nodes', nodes);
  
    let [minX, minY, maxX, maxY] = [Infinity, Infinity, -Infinity, -Infinity];
  
    const updateBounds = (x, y, dimension1, dimension2) => {
      minX = Math.min(minX, x - dimension1 / 2);
      minY = Math.min(minY, y - dimension2 / 2);
      maxX = Math.max(maxX, x + dimension1 / 2);
      maxY = Math.max(maxY, y + dimension2 / 2);
    };
  
    nodes.forEach((node) => {
      const {
        x = 0,
        y = 0,
        data: { width, height },
      } = node;

  
    //   console.log('        node', node, x, y, width, height );
      if (horizontal) {
        updateBounds(y, x, width, height);
      } else {
        updateBounds(x, y, width, height);
      }
    });
  
    return {
      x: minX - padding,
      y: minY - padding,
      width: maxX - minX + 2 * padding,
      height: maxY - minY + 2 * padding,
    };
  }
  
  // Function to get the computed width and height of an element
  export function getComputedDimensions(element) {
    const rect = element.node().getBoundingClientRect();
    return { width: rect.width, height: rect.height };
  }
  