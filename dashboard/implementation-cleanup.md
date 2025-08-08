# Code Cleanup and DRY Implementation Plan

## Overview

This document outlines a comprehensive plan to clean up the dashboard codebase and improve adherence to DRY (Don't Repeat Yourself) principles. The current implementation has several areas where code duplication and inconsistent patterns can be improved.

## Current Issues Analysis

### 1. Node Type Creation Duplication

**Problem:** The node factory in `node.js` uses a switch statement that could be more maintainable.

**Current Code:**
```javascript
switch (nodeType) {
  case "group":
    node = new GroupNode(nodeData, container, createNode, settings, parentNode);
    break;
  case "lane":
    node = new LaneNode(nodeData, container, createNode, settings, parentNode);
    break;
  // ... more cases
}
```

**Solution:** Implement a registry pattern:

```javascript
// nodeRegistry.js
const nodeTypes = new Map();

export function registerNodeType(type, constructor) {
  nodeTypes.set(type.toLowerCase(), constructor);
}

export function createNode(nodeData, container, settings, parentNode = null) {
  const nodeType = nodeData.type.toLowerCase();
  const NodeConstructor = nodeTypes.get(nodeType);
  
  if (!NodeConstructor) {
    console.error(`Unknown node type "${nodeData.type}"`);
    return null;
  }
  
  return new NodeConstructor(nodeData, container, createNode, settings, parentNode);
}

// Register all node types
registerNodeType('group', GroupNode);
registerNodeType('lane', LaneNode);
registerNodeType('adapter', AdapterNode);
// ... etc
```

### 2. Layout Logic Duplication

**Problem:** Similar layout patterns are repeated across different node types.

**Current Issues:**
- AdapterNode has multiple layout methods (`updateLayout1_full_archive`, etc.)
- LaneNode and ColumnsNode have similar positioning logic
- Common spacing and margin calculations are duplicated

**Solution:** Create a layout manager:

```javascript
// layoutManager.js
export class LayoutManager {
  static arrangeInRow(nodes, spacing = 20, startX = 0, startY = 0) {
    let currentX = startX;
    nodes.forEach(node => {
      node.x = currentX + node.data.width / 2;
      node.y = startY;
      currentX += node.data.width + spacing;
    });
  }
  
  static arrangeInColumn(nodes, spacing = 10, startX = 0, startY = 0) {
    let currentY = startY;
    nodes.forEach(node => {
      node.x = startX;
      node.y = currentY + node.data.height / 2;
      currentY += node.data.height + spacing;
    });
  }
  
  static arrangeInGrid(nodes, columns, spacing = { horizontal: 20, vertical: 10 }) {
    nodes.forEach((node, index) => {
      const row = Math.floor(index / columns);
      const col = index % columns;
      node.x = col * (node.data.width + spacing.horizontal);
      node.y = row * (node.data.height + spacing.vertical);
    });
  }
}
```

### 3. Status Management Duplication

**Problem:** Status calculation logic is duplicated across container nodes.

**Current Issues:**
- `BaseContainerNode.determineStatusBasedOnChildren()` is complex and duplicated
- Status cascading logic is repeated
- Status constants are defined in multiple places

**Solution:** Create a centralized status manager:

```javascript
// statusManager.js
export class StatusManager {
  static calculateContainerStatus(childNodes, settings) {
    if (!settings.cascadeOnStatusChange || childNodes.length === 0) {
      return NodeStatus.UNKNOWN;
    }
    
    const statuses = childNodes
      .filter(node => !(node instanceof BaseContainerNode))
      .map(node => node.status);
    
    return this.determineAggregateStatus(statuses);
  }
  
  static determineAggregateStatus(statuses) {
    // Priority order: Error > Warning > Delayed > Unknown > Updating > Updated > Skipped > Ready
    const priority = [
      NodeStatus.ERROR,
      NodeStatus.WARNING,
      NodeStatus.DELAYED,
      NodeStatus.UNKNOWN,
      NodeStatus.UPDATING,
      NodeStatus.UPDATED,
      NodeStatus.SKIPPED,
      NodeStatus.READY
    ];
    
    for (const status of priority) {
      if (statuses.includes(status)) {
        return status;
      }
    }
    
    return NodeStatus.UNKNOWN;
  }
}
```

### 4. Event Handling Duplication

**Problem:** Event handling patterns are repeated across node types.

**Current Issues:**
- Click and double-click handlers are duplicated
- Event propagation logic is repeated
- Drag behavior setup is similar across nodes

**Solution:** Create an event manager:

```javascript
// eventManager.js
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
  
  static propagateEvent(node, eventType, event) {
    if (node[`on${eventType}`]) {
      node[`on${eventType}`](event, node);
    } else if (node.parentNode) {
      this.propagateEvent(node.parentNode, eventType, event);
    }
  }
}
```

### 5. Configuration Management

**Problem:** Default settings and configuration are scattered across files.

**Current Issues:**
- Default values are set in multiple constructors
- Settings validation is duplicated
- Configuration structure is inconsistent

**Solution:** Create a configuration manager:

```javascript
// configManager.js
export const DEFAULT_SETTINGS = {
  selector: { incomming: 1, outgoing: 1 },
  showBoundingBox: true,
  zoomToRoot: true,
  toggleCollapseOnStatusChange: true,
  cascadeOnStatusChange: true,
  showCenterMark: false,
  showConnectionPoints: false,
  containerMargin: { top: 18, right: 8, bottom: 8, left: 8 },
  nodeSpacing: { horizontal: 20, vertical: 10 }
};

export class ConfigManager {
  static mergeWithDefaults(userSettings) {
    return this.deepMerge(DEFAULT_SETTINGS, userSettings);
  }
  
  static deepMerge(target, source) {
    const result = { ...target };
    
    for (const key in source) {
      if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
        result[key] = this.deepMerge(target[key] || {}, source[key]);
      } else {
        result[key] = source[key];
      }
    }
    
    return result;
  }
  
  static validateSettings(settings) {
    const errors = [];
    
    if (settings.selector && (settings.selector.incomming < 0 || settings.selector.outgoing < 0)) {
      errors.push("Selector values must be non-negative");
    }
    
    return errors;
  }
}
```

### 6. Dimension and Position Calculations

**Problem:** Bounding box and position calculations are duplicated.

**Current Issues:**
- Similar calculations in multiple node types
- Container sizing logic is repeated
- Position adjustment patterns are duplicated

**Solution:** Create a geometry manager:

```javascript
// geometryManager.js
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
}
```

## Implementation Plan

### Phase 1: Core Infrastructure (Week 1)

1. **Create utility modules:**
   - `nodeRegistry.js` - Node type registration
   - `configManager.js` - Configuration management
   - `eventManager.js` - Event handling
   - `statusManager.js` - Status management
   - `geometryManager.js` - Geometry calculations
   - `layoutManager.js` - Layout algorithms

2. **Update base classes:**
   - Refactor `BaseNode` to use new managers
   - Update `BaseContainerNode` to use centralized logic
   - Modify `Dashboard` class to use new configuration system

### Phase 2: Node Type Refactoring (Week 2)

1. **Refactor node types:**
   - Update `AdapterNode` to use layout manager
   - Simplify `LaneNode` and `ColumnsNode` using common patterns
   - Remove duplicated code from all node types

2. **Standardize interfaces:**
   - Create consistent method signatures
   - Implement common base functionality
   - Remove type-specific duplications

### Phase 3: Edge and Simulation Cleanup (Week 3)

1. **Refactor edge system:**
   - Simplify edge creation logic
   - Centralize path calculation
   - Standardize marker creation

2. **Clean up simulation:**
   - Extract common force configurations
   - Standardize simulation parameters
   - Remove duplicated collision logic

### Phase 4: Testing and Documentation (Week 4)

1. **Add comprehensive tests:**
   - Unit tests for new managers
   - Integration tests for refactored components
   - Performance benchmarks

2. **Update documentation:**
   - Document new architecture
   - Update usage examples
   - Create migration guide

## Benefits of Refactoring

### 1. Maintainability
- Single source of truth for common functionality
- Easier to add new node types
- Consistent behavior across components

### 2. Performance
- Reduced code duplication
- More efficient algorithms
- Better caching opportunities

### 3. Extensibility
- Easier to add new features
- Consistent extension points
- Better separation of concerns

### 4. Testing
- Easier to test individual components
- Better isolation of functionality
- More comprehensive test coverage

## Migration Strategy

### 1. Backward Compatibility
- Maintain existing public APIs
- Gradual migration of internal code
- Feature flags for new implementations

### 2. Incremental Refactoring
- Refactor one component at a time
- Maintain working state throughout
- Continuous integration testing

### 3. Documentation Updates
- Update implementation documentation
- Create migration guides
- Maintain API documentation

## Risk Mitigation

### 1. Testing Strategy
- Comprehensive unit tests before refactoring
- Integration tests for each phase
- Performance regression testing

### 2. Rollback Plan
- Version control for each phase
- Ability to revert individual changes
- Feature flags for gradual rollout

### 3. Communication
- Clear documentation of changes
- Team training on new patterns
- Regular progress updates

## Success Metrics

### 1. Code Quality
- Reduced lines of code (target: 20% reduction)
- Improved code coverage (target: 90%+)
- Reduced cyclomatic complexity

### 2. Performance
- Faster initialization (target: 25% improvement)
- Reduced memory usage
- Better rendering performance

### 3. Maintainability
- Reduced time to add new features
- Fewer bugs in common functionality
- Easier onboarding for new developers

## Conclusion

This refactoring plan addresses the major DRY violations in the current codebase while maintaining functionality and improving maintainability. The phased approach ensures minimal disruption while achieving significant improvements in code quality and developer experience. 