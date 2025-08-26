import { computeConnectionPoints } from "./utilPath.js";
import { EventManager } from "./eventManager.js";
import { StatusManager } from "./statusManager.js";
import { ConfigManager } from "./configManager.js";
import { ZoneManager } from "./zones/index.js";

export const NodeStatus = Object.freeze({
  UNDETERMINED: 'Undetermined',
  UNKNOWN: 'Unknown',
  DISABLED: 'Disabled',
  // process states
  READY: 'Ready',
  UPDATING: 'Updating',
  UPDATED: 'Updated',
  SKIPPED: 'Skipped',
  // error states
  DELAYED: 'Delayed',  
  WARNING: 'Warning',
  ERROR: 'Error'
});

export default class BaseNode {
  constructor(nodeData, parentElement, settings, parentNode = null) {
    this.isContainer = false;
    this.data = nodeData;
    this.parentElement = parentElement;
    this.parentNode = parentNode;
    this.settings = ConfigManager.mergeWithDefaults(settings);
    this.computeConnectionPoints = computeConnectionPoints;
    this.onDisplayChange = null;
    this.onClick = null;
    this.onDblClick = null;
    this._selected = false;
    this._status = nodeData.state ?? NodeStatus.UNKNOWN;
    this._visible = nodeData.visible ?? true; 
    this._collapsed = nodeData.collapsed ?? false; 
    this.suspenseDisplayChange = false;

    this.id = nodeData.id;

    this.edges = {
      incoming: [],
      outgoing: [],
    };

    this.element = null;
    this.simulation = null;

    this.zoneManager = null;
    this._updatingCollapseState = false;

    // Set default values for x, y, width, and height
    this.x ??= 0;
    this.y ??= 0;
    this.data.width ??= 60;
    this.data.height ??= 60;
  }

  get visible() {
    return this._visible;
  }

  set visible(value) {
    if (value === this._visible) return;

    this._visible = value;
    
    // Actually hide/show the DOM element
    if (this.element) {
      if (value) {
        this.element.style('display', null); // Show element
      } else {
        this.element.style('display', 'none'); // Hide element
      }
    }
  }

  get collapsed() {
    return this._collapsed;
  }

  set collapsed(value) {
    if (value === this._collapsed) return;
    
    console.log(`BaseNode.collapsed setter: Setting ${this.id} collapsed to ${value}, _updatingCollapseState: ${this._updatingCollapseState}`);
    
    this._collapsed = value;

    // Always update DOM classes if element exists
    if (this.element) {
      console.log(`BaseNode.collapsed setter: Updating DOM classes for ${this.id}`);
      this.element.classed("collapsed", this.collapsed);
      this.element.classed("expanded", !this.collapsed);
    } else {
      console.log(`BaseNode.collapsed setter: Skipping DOM update for ${this.id} - element: ${!!this.element}`);
    }
  }

  get status() {
    return this._status;
  }

  set status(value) {
    this._status = value;
    if (this.element) {
      this.element.attr("status", value);
    }

    // Auto collapse/expand based on status when enabled, avoiding re-entrancy
    if (this.settings.toggleCollapseOnStatusChange && !this._updatingCollapseState) {
      // Determine collapse rule based on effective status (containers use aggregated child status)
      let effectiveStatus = value;
      if (this.isContainer && this.childNodes && this.childNodes.length > 0) {
        try { effectiveStatus = StatusManager.calculateContainerStatus(this.childNodes, this.settings); } catch {}
      }
      const shouldCollapse = StatusManager.shouldCollapseOnStatus(effectiveStatus, this.settings);
      this._updatingCollapseState = true;
      try {
        if (shouldCollapse) {
          this.collapsed = true;
        } else {
          // Explicitly expand when status becomes non-collapsible
          this.collapsed = false;
          // Ensure all ancestor containers are expanded so this node becomes visible
          let ancestor = this.parentNode;
          while (ancestor) {
            try {
              if (ancestor.collapsed) ancestor.collapsed = false;
            } catch {}
            ancestor = ancestor.parentNode;
          }
        }
      } finally {
        this._updatingCollapseState = false;
      }
    }

    if (this.settings.cascadeOnStatusChange) {
      this.cascadeStatusChange();
    }
  }

  get selected() {
    return this._selected;
  }

  set selected(value) {

    this._selected = value;
    // Only update DOM if element exists
    if (this.element) {
      this.element.classed("selected", this._selected);
    }
  }

  handleDisplayChange() {
    if (this.suspenseDisplayChange) {
      return;
    }
    // If dashboard is temporarily suspending display changes during bulk init,
    // skip bubbling to avoid mid-cascade zoom recalculation. We detect via the
    // closest available dashboard reference on the root node if present.
    try {
      const root = this.parentNode?.parentNode ? this.parentNode.parentNode : this.parentNode || this;
      const dashboard = root?.dashboard || root?.__dashboard;
      if (dashboard && dashboard._suspendDisplayChange) {
        return;
      }
    } catch {}
    if (this.onDisplayChange) {
      this.onDisplayChange();
    } else {
      if (this.parentNode && typeof this.parentNode.handleDisplayChange === 'function') {
        this.parentNode.handleDisplayChange();
      }
    }
  }

  move(x, y) {
    this.x = x;
    this.y = y;
    
    // Only update element if it exists (has been initialized)
    if (this.element) {
      this.element.attr("transform", `translate(${this.x}, ${this.y})`);
      
      // Only call handleDisplayChange if we're not in the middle of initialization
      if (!this.suspenseDisplayChange) {
        this.handleDisplayChange();
      }
    }
  }

   init(parentElement = null) {
    if (parentElement) this.parentElement = parentElement;

    this.element = this.parentElement
      .append("g")
      .attr("class", this.data.type)
      .attr("id", this.id)
      .attr("status", this.status);
      
    // Attach the node instance to the DOM element for testing access
    this.element.node().__node = this;

    // Initialize zone manager only for container nodes
    if (this.isContainer) {
      this.zoneManager = new ZoneManager(this);
      this.zoneManager.init();

      // Resize zones with actual node dimensions
      if (this.zoneManager) {
        this.zoneManager.resize(this.data.width, this.data.height);
      }
    }

    // Ensure DOM parenting matches logical parenting for all nodes
    try {
      const parent = this.parentNode;
      if (parent && parent.element && this.element) {
        let desiredParentGroup = parent.element;
        if (parent.isContainer && !parent.collapsed) {
          const innerZone = parent.zoneManager?.innerContainerZone || (parent.zoneManager?.ensureInnerContainerZone ? parent.zoneManager.ensureInnerContainerZone() : null);
          desiredParentGroup = innerZone?.getChildContainer?.() || parent.element;
        }
        const currentParent = this.element.node()?.parentNode || null;
        const desired = desiredParentGroup?.node?.() || null;
        if (desired && currentParent !== desired) {
          desired.appendChild(this.element.node());
        }
      }
    } catch {}

    // Set up default events using EventManager
    EventManager.setupDefaultNodeEvents(this);
      
    // Set expanded or collapsed state
    this.element.classed("collapsed", this.collapsed);
    this.element.classed("expanded", !this.collapsed);

    // show the center stip
    if (this.settings.showCenterMark)
      this.element.append("circle").attr("class", "centermark").attr("r", 3).attr("cx", 0).attr("cy", 0);

    // show the connection points
    if (this.settings.showConnectionPoints) {
      // Create a dedicated group to isolate this node's connection points from descendants
      this.connectionPointsGroup = this.element.append("g").attr("class", "connection-points");
      const connectionPoints = this.computeConnectionPoints(0, 0, this.data.width, this.data.height);
      Object.values(connectionPoints).forEach((point) => {
        this.connectionPointsGroup
          .append("circle")
          .attr("class", `connection-point side-${point.side}`)
          .attr("cx", point.x)
          .attr("cy", point.y)
          .attr("r", 2);
      });
      try {
        if (this.settings.isDebug) {
          const bbox = this.element?.node()?.getBBox?.();
        }
      } catch {}
    }
    
    // Trigger display change after initialization to ensure loading overlay is hidden
    this.handleDisplayChange();
  }

  // function to put all the elements in the correct place
   update() {

    // Update zones only for container nodes
    if (this.isContainer && this.zoneManager) {
      this.zoneManager.update();
    }

    if (this.settings.showConnectionPoints) {
      // Use data width/height for containers (exact zone size); for non-containers, allow bbox fallback
      let width = this.data.width;
      let height = this.data.height;
      let bbox = null;
      if (!this.isContainer) {
        try {
          bbox = this.element?.node()?.getBBox();
          if (bbox && bbox.width > 0 && bbox.height > 0) {
            width = bbox.width;
            height = bbox.height;
          }
        } catch {}
      }
      if (this.settings.isDebug) {
      }

      const connectionPoints = this.computeConnectionPoints(0, 0, width, height);
      Object.values(connectionPoints).forEach((point) => {
        // Update only this node's own points (scoped to the dedicated group)
        const scope = this.connectionPointsGroup || this.element;
        if (scope) {
          scope
            .select(`.connection-point.side-${point.side}`)
            .attr("cx", point.x)
            .attr("cy", point.y);
        }
      });
              try {
          if (this.settings.isDebug) {
            const scope = this.connectionPointsGroup || this.element;
            if (scope) {
              const read = (side) => ({
                side,
                cx: parseFloat(scope.select(`.connection-point.side-${side}`).attr('cx')),
                cy: parseFloat(scope.select(`.connection-point.side-${side}`).attr('cy')),
              });
            }
          }
        } catch {}
    }
  }
  
  handleClicked(event, node = this) {
    // Forward the originally clicked node so bubbling preserves the true target
    EventManager.handleNodeClick(this, event, node);
  }

  handleDblClicked(event, node = this) {
    // Forward the originally double-clicked node so bubbling preserves the true target
    EventManager.handleNodeDblClick(this, event, node);
  }

   resize(size, forced = false) {
    // node base has no elements of it's own, so just update the data
    if  (forced || this.data.width !== size.width || this.data.height !== size.height)
    {
      this.data.width = size.width;
      this.data.height = size.height;

      // Resize zones only for container nodes
      if (this.isContainer && this.zoneManager) {
        this.zoneManager.resize(size.width, size.height);
      }

       this.update();

      this.handleDisplayChange();
    }
  }

  getNode(nodeId) {
    if (this.id == nodeId) {
      return this;
    }
    return null;
  }

  getNodesByDatasetId(datasetId) {
    if (this.data.datasetId == datasetId) {
      return [this];
    }
    return [];
  }

  // function to return all the nodes in the graph
  getAllNodes(onlySelected = false, onlyEndNodes = false) {
    if (onlySelected && !this.selected) return [];
    return [this];
  }

  // function to return all the nodes in the graph
  getAllEdges(onlySelected = false, allEdges = []) {
    this.edges.incoming.forEach((edge) => {
      if (!onlySelected || edge.selected) 
      {
        if (allEdges.indexOf(edge) === -1) {
          allEdges.push(edge);
        } 
      }
    });
    this.edges.outgoing.forEach((edge) => {
      if (!onlySelected || edge.selected) 
        {
          if (allEdges.indexOf(edge) === -1) {
            allEdges.push(edge);
          } 
        }
      });
  }

  isDescendantOf(node) {
    let current = this.parentNode;
    while (current) {
      if (current === node) {
        return true;
      }
      current = current.parentNode;
    }
    return false;
  }

  getNeighbors(selector = { incomming: 1, outgoing: 1 }) {
    const neighbors = {nodes:[],edges:[]};

    // Add the incoming neighbors
    if (selector.incomming > 0) {
      this.edges.incoming.forEach((edge) => {
        neighbors.edges.push(edge);
        if (selector.incomming > 1) {
          // Get the neighbors recursively and add them to the neighbors array
          neighbors.nodes.push(...edge.source.getNeighbors({ incomming: selector.incomming - 1, outgoing: 0 }));
        } else {
          // Directly add the source node to the neighbors array
          neighbors.nodes.push(edge.source);
        }
      });
    }

    // Add the current node to the neighbors array
    neighbors.nodes.push(this);

    // Add the outgoing neighbors
    if (selector.outgoing > 0) {
      this.edges.outgoing.forEach((edge) => {
        neighbors.edges.push(edge);
        if (selector.outgoing > 1) {
          // Get the neighbors recursively and add them to the neighbors array
          neighbors.nodes.push(...edge.target.getNeighbors({ incomming: 0, outgoing: selector.outgoing - 1 }));
        } else {
          // Directly add the source node to the neighbors array
          neighbors.nodes.push(edge.target);
        }
      });
    }

    return neighbors;
  }

  getParents() {
    if (!this.parentNode) {
      return [];
    }
    
    // Defensive check: ensure parentNode has getParents method and it returns an array
    if (typeof this.parentNode.getParents === 'function') {
      const parentParents = this.parentNode.getParents();
      // Ensure the result is an array before spreading
      if (Array.isArray(parentParents)) {
        return [this.parentNode, ...parentParents];
      } else {
        return [this.parentNode];
      }
    } else {
      return [this.parentNode];
    }
  }
  



  cascadeUpdate() {
    if (this.parentNode) {
      // console.log(`cascadeUpdate from "${this.data.label}" --> "${this.parentNode.data.label}"`);
      this.parentNode.update();
      this.parentNode.cascadeUpdate();
    } else {
      // console.log(`cascadeUpdate "${this.data.label}" --> has no parent to cascade to`);
    }
  }

  cascadeStatusChange() {
    if (this.parentNode && 
        typeof this.parentNode.determineStatusBasedOnChildren === 'function' &&
        this.parentNode.element && // Safety check: parent element exists
        !this.parentNode.collapsed) { // Safety check: parent is not collapsed
      this.parentNode.determineStatusBasedOnChildren();
    } 
  }

  cascadeRestartSimulation() {
    // console.log("cascadeRestartSimulation ", this.id);
    if (this.simulation) {
      // console.log("                    simulaiton restart", this.id);
      this.simulation.simulation.alphaTarget(0.8).restart();
    }
    if (this.parentNode) {
      this.parentNode.cascadeRestartSimulation();
    }
  }

  cascadeStopSimulation() {
    // console.log("cascadeStopSimulation ", this.id);
    if (this.simulation) {
      // console.log("                    simulation stop", this.id);
      this.simulation.simulation.alphaTarget(0);
    }
    if (this.parentNode) {
      this.parentNode.cascadeStopSimulation();
    }
  }


  // drag
  drag_started(event, node) {
    node.cascadeRestartSimulation();
    event.fx = event.x;
    event.fy = event.y;
    node.element.classed("grabbing", true);
  }

  dragged(event, node) {
    event.fx = event.x;
    event.fy = event.y;

    // move the simulation
    node.move(event.fx, event.fy);
  }

  drag_ended(event, node) {
    node.element.classed("grabbing", false);

    node.cascadeStopSimulation();
  }

  /**
   * Get the effective width of this node for layout calculations
   * This method handles collapsed state internally
   */
  getEffectiveWidth() {
    if (this.collapsed) {
      // When collapsed, always use minimumSize, not data.width
      // This ensures we get the correct collapsed size even if data.width hasn't been updated yet
      return this.minimumSize?.width || 20; // Default minimum width
    }
    return this.data.width;
  }

  /**
   * Get the effective height of this node for layout calculations
   * This method handles collapsed state internally
   */
  getEffectiveHeight() {
    if (this.collapsed) {
      // When collapsed, always use minimumSize, not data.height
      // This ensures we get the correct collapsed size even if data.height hasn't been updated yet
      return this.minimumSize?.height || 20; // Default minimum height
    }
    return this.data.height;
  }
}
