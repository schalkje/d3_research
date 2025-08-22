// Layout Manager for centralized layout algorithms
export class LayoutManager {
  static arrangeInRow(nodes, spacing = 20, startX = 0, startY = 0) {
    let currentX = startX;
    nodes.forEach(node => {
      const x = currentX + node.data.width / 2;
      const y = startY;
      node.move(x, y);
      currentX += node.data.width + spacing;
    });
  }
  
  static arrangeInColumn(nodes, spacing = 10, startX = 0, startY = 0) {
    let currentY = startY;
    nodes.forEach(node => {
      const x = startX;
      const y = currentY + node.data.height / 2;
      node.move(x, y);
      currentY += node.data.height + spacing;
    });
  }
  
  static arrangeInGrid(nodes, columns, spacing = { horizontal: 20, vertical: 10 }, startX = 0, startY = 0) {
    nodes.forEach((node, index) => {
      const row = Math.floor(index / columns);
      const col = index % columns;
      
      let x, y;
      
      if (col === 0) {
        // First column, calculate Y position
        if (row === 0) {
          y = startY + node.data.height / 2;
        } else {
          const prevNode = nodes[index - columns];
          y = prevNode.y + prevNode.data.height / 2 + spacing.vertical + node.data.height / 2;
        }
        x = startX + node.data.width / 2;
      } else {
        // Same row, calculate X position
        const prevNode = nodes[index - 1];
        x = prevNode.x + prevNode.data.width / 2 + spacing.horizontal + node.data.width / 2;
        y = prevNode.y;
      }
      
      node.move(x, y);
    });
  }
  
  static arrangeInLanes(nodes, laneCount, spacing = { horizontal: 20, vertical: 10 }, startX = 0, startY = 0) {
    const nodesPerLane = Math.ceil(nodes.length / laneCount);
    const laneWidth = Math.max(...nodes.map(n => n.data.width)) + spacing.horizontal;
    
    for (let laneIndex = 0; laneIndex < laneCount; laneIndex++) {
      const laneNodes = nodes.slice(laneIndex * nodesPerLane, (laneIndex + 1) * nodesPerLane);
      const laneX = startX + laneIndex * laneWidth;
      
      this.arrangeInColumn(laneNodes, spacing.vertical, laneX, startY);
    }
  }
  
  static arrangeInColumns(nodes, columnCount, spacing = { horizontal: 20, vertical: 10 }, startX = 0, startY = 0) {
    const nodesPerColumn = Math.ceil(nodes.length / columnCount);
    const columnHeight = Math.max(...nodes.map(n => n.data.height)) + spacing.vertical;
    
    for (let columnIndex = 0; columnIndex < columnCount; columnIndex++) {
      const columnNodes = nodes.slice(columnIndex * nodesPerColumn, (columnIndex + 1) * nodesPerColumn);
      const columnY = startY + columnIndex * columnHeight;
      
      this.arrangeInRow(columnNodes, spacing.horizontal, startX, columnY);
    }
  }
  
  static centerNodesInContainer(nodes, containerWidth, containerHeight) {
    if (nodes.length === 0) return;
    
    const boundingBox = this.calculateBoundingBox(nodes);
    const offsetX = (containerWidth - boundingBox.width) / 2 - boundingBox.x;
    const offsetY = (containerHeight - boundingBox.height) / 2 - boundingBox.y;
    
    nodes.forEach(node => {
      const x = node.x + offsetX;
      const y = node.y + offsetY;
      node.move(x, y);
    });
  }
  
  static calculateBoundingBox(nodes) {
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
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY
    };
  }
  
  static distributeEvenly(nodes, containerWidth, containerHeight, padding = 20) {
    if (nodes.length === 0) return;
    
    const totalWidth = nodes.reduce((sum, node) => sum + node.data.width, 0);
    const totalHeight = nodes.reduce((sum, node) => sum + node.data.height, 0);
    
    const availableWidth = containerWidth - padding * 2;
    const availableHeight = containerHeight - padding * 2;
    
    if (totalWidth <= availableWidth) {
      // Arrange horizontally
      const spacing = (availableWidth - totalWidth) / (nodes.length + 1);
      let currentX = padding + spacing;
      
      nodes.forEach(node => {
        const x = currentX + node.data.width / 2;
        const y = containerHeight / 2;
        node.move(x, y);
        currentX += node.data.width + spacing;
      });
    } else if (totalHeight <= availableHeight) {
      // Arrange vertically
      const spacing = (availableHeight - totalHeight) / (nodes.length + 1);
      let currentY = padding + spacing;
      
      nodes.forEach(node => {
        const x = containerWidth / 2;
        const y = currentY + node.data.height / 2;
        node.move(x, y);
        currentY += node.data.height + spacing;
      });
    } else {
      // Use grid layout
      const columns = Math.ceil(Math.sqrt(nodes.length));
      this.arrangeInGrid(nodes, columns, { horizontal: 20, vertical: 10 }, padding, padding);
    }
  }
} 