// Geometry Manager for centralized geometry calculations
export class GeometryManager {
  static calculateBoundingBox(nodes, padding = 0) {
    if (nodes.length === 0) {
      return { x: 0, y: 0, width: 0, height: 0 };
    }
    
    let [minX, minY, maxX, maxY] = [Infinity, Infinity, -Infinity, -Infinity];
    
    nodes.forEach(node => {
      const halfWidth = node.data.width / 2;
      const halfHeight = node.data.height / 2;
      
      minX = Math.min(minX, node.x - halfWidth);
      minY = Math.min(minY, node.y - halfHeight);
      maxX = Math.max(maxX, node.x + halfWidth);
      maxY = Math.max(maxY, node.y + halfHeight);
    });
    
    return {
      x: minX - padding,
      y: minY - padding,
      width: maxX - minX + 2 * padding,
      height: maxY - minY + 2 * padding
    };
  }
  
  static calculateContainerSize(nodes, margins, spacing) {
    const boundingBox = this.calculateBoundingBox(nodes);
    
    return {
      width: boundingBox.width + margins.left + margins.right,
      height: boundingBox.height + margins.top + margins.bottom
    };
  }
  
  static adjustPositionForContainer(node, container) {
    return {
      x: node.x + container.x,
      y: node.y + container.y
    };
  }
  
  static calculateMinimumSize(nodes, defaultSize = { width: 100, height: 100 }) {
    if (nodes.length === 0) {
      return defaultSize;
    }
    
    const boundingBox = this.calculateBoundingBox(nodes);
    
    return {
      width: Math.max(boundingBox.width, defaultSize.width),
      height: Math.max(boundingBox.height, defaultSize.height)
    };
  }
  
  static calculateExpandedSize(nodes, margins, spacing) {
    const boundingBox = this.calculateBoundingBox(nodes);
    
    return {
      width: boundingBox.width + margins.left + margins.right,
      height: boundingBox.height + margins.top + margins.bottom
    };
  }
  
  static getNodeCenter(node) {
    return {
      x: node.x,
      y: node.y
    };
  }
  
  static getNodeBounds(node) {
    const halfWidth = node.data.width / 2;
    const halfHeight = node.data.height / 2;
    
    return {
      left: node.x - halfWidth,
      right: node.x + halfWidth,
      top: node.y - halfHeight,
      bottom: node.y + halfHeight
    };
  }
  
  static isNodeOverlapping(node1, node2, tolerance = 0) {
    const bounds1 = this.getNodeBounds(node1);
    const bounds2 = this.getNodeBounds(node2);
    
    return !(bounds1.right + tolerance < bounds2.left ||
             bounds1.left > bounds2.right + tolerance ||
             bounds1.bottom + tolerance < bounds2.top ||
             bounds1.top > bounds2.bottom + tolerance);
  }
} 