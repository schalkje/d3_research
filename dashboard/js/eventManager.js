// Event Manager for centralized event handling
export class EventManager {
  static setupNodeEvents(node, handlers) {
    const element = node.element;
    
    if (handlers.onClick) {
      element.on("click", (event) => {
        event.stopPropagation();
        handlers.onClick(event, node);
      });
    }
    
    if (handlers.onDblClick) {
      element.on("dblclick", (event) => {
        event.stopPropagation();
        handlers.onDblClick(event, node);
      });
    }
    
    if (handlers.onDrag) {
      const drag = d3.drag()
        .on("start", handlers.onDrag.start)
        .on("drag", handlers.onDrag.drag)
        .on("end", handlers.onDrag.end);
      
      element.call(drag);
    }
  }
  
  static setupDefaultNodeEvents(node) {
    const element = node.element;
    
    element.on("click", (event) => {
      event.stopPropagation();
      node.handleClicked(event);
    });
    
    element.on("dblclick", (event) => {
      event.stopPropagation();
      node.handleDblClicked(event);
    });
  }
  
  static setupDragEvents(node) {
    const drag = d3.drag()
      .on("start", (event) => node.drag_started(event, node))
      .on("drag", (event) => node.dragged(event, node))
      .on("end", (event) => node.drag_ended(event, node));
    
    node.element.call(drag);
  }
  
  static propagateEvent(node, eventType, event) {
    if (node[`on${eventType}`]) {
      node[`on${eventType}`](event, node);
    } else if (node.parentNode) {
      this.propagateEvent(node.parentNode, eventType, event);
    }
  }
  
  static handleNodeClick(node, event) {
    if (node.onClick) {
      node.onClick(node);
    } else if (node.parentNode) {
      node.parentNode.handleClicked(event, node);
    } else {
      console.warn(`No onClicked handler, node ${node.id} clicked!`);
    }
  }
  
  static handleNodeDblClick(node, event) {
    if (node.onDblClick) {
      node.onDblClick(node);
    } else if (node.parentNode) {
      node.parentNode.handleDblClicked(event, node);
    } else {
      console.warn(`No onDblClicked handler, node ${node.id} double-clicked!`);
    }
  }
} 