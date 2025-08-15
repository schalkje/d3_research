import { computeConnectionPoints } from "./utilPath.js";
import { EventManager } from "./eventManager.js";
import { StatusManager } from "./statusManager.js";
import { ConfigManager } from "./configManager.js";
import { ZoneManager } from "./zones/index.js";

export const NodeStatus = Object.freeze({
  UNDETERMINED: 'Undetermined', // technically not a status, but used in the status determination logic
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
    this.layoutDebug = true;
    this.zoneManager = null;

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
    // console.log("nodeBase - Setting visible", this.data.label, value);
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
    this._collapsed = value;

    this.element.classed("collapsed", this.collapsed);
    this.element.classed("expanded", !this.collapsed);
  }

  get status() {
    return this._status;
  }

  set status(value) {
    this._status = value;
    if (this.element) {
      this.element.attr("status", value);
    }

    if (StatusManager.shouldCollapseOnStatus(value, this.settings)) {
      this.collapsed = true;
    }

    if (this.settings.cascadeOnStatusChange) {
      this.cascadeStatusChange();
    }
  }

  get selected() {
    return this._selected;
  }

  set selected(value) {
    // console.log("nodeBase - Setting selected", value);
    this._selected = value;
    this.element.classed("selected", this._selected);
  }

  handleDisplayChange() {
    if (this.suspenseDisplayChange) {
      // console.log(`          > skip handleDisplayChange ${this.data.label}`);
      return;
    }
    // console.log(`          > handleDisplayChange ${this.id}`, this.onDisplayChange, this);
    if (this.onDisplayChange) {
      // console.log(`          > calling handleDisplayChange ${this.data.label}`);
      this.onDisplayChange();
    } else {
      if (this.parentNode && typeof this.parentNode.handleDisplayChange === 'function') {
        this.parentNode.handleDisplayChange();
      }
    }
  }

  move(x, y) {
    // console.log(`          > move ${this.id}, (x:${Math.round(this.x)},y:${Math.round(this.y)}) -> (x:${Math.round(x)},y:${Math.round(y)})`);
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
    // console.log("nodeBase - init", this.data.label);

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
          console.log(`[CP/INIT] ${this.id} (${this.data.type}) using data size`, { width: this.data.width, height: this.data.height, bbox });
        }
      } catch {}
    }
  }

  // function to put all the elements in the correct place
   update() {
    // console.log("nodeBase - update", this.data.label);

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
        console.log(`[CP/UPDATE] ${this.id} (${this.data.type}) width/height used`, { width, height, data: { width: this.data.width, height: this.data.height }, bbox });
      }

      const connectionPoints = this.computeConnectionPoints(0, 0, width, height);
      Object.values(connectionPoints).forEach((point) => {
        // Update only this node's own points (scoped to the dedicated group)
        const scope = this.connectionPointsGroup || this.element;
        scope
          .select(`.connection-point.side-${point.side}`)
          .attr("cx", point.x)
          .attr("cy", point.y);
      });
      try {
        if (this.settings.isDebug) {
          const read = (side) => ({
            side,
            cx: parseFloat((this.connectionPointsGroup || this.element).select(`.connection-point.side-${side}`).attr('cx')),
            cy: parseFloat((this.connectionPointsGroup || this.element).select(`.connection-point.side-${side}`).attr('cy')),
          });
          console.log(`[CP/READ] ${this.id}`, [read('top'), read('right'), read('bottom'), read('left')]);
        }
      } catch {}
    }
  }
  
  handleClicked(event, node = this) {
    console.log("handleClicked:", this.id, event);
    EventManager.handleNodeClick(this, event);
  }

  handleDblClicked(event, node = this) {
    console.log("handleDblClicked:", this.id, event);
    EventManager.handleNodeDblClick(this, event);
  }

   resize(size, forced = false) {
    // node base has no elements of it's own, so just update the data
    if  (forced || this.data.width !== size.width || this.data.height !== size.height)
    {
      // console.log(`nodeBase - resize`, this.data.label, Math.round(this.data.width), Math.round(this.data.height), Math.round(size.width), Math.round(size.height)); 
      this.data.width = size.width;
      this.data.height = size.height;

      // Resize zones only for container nodes
      if (this.isContainer && this.zoneManager) {
        this.zoneManager.resize(size.width, size.height);
      }

       this.update();

      this.handleDisplayChange();
    }
    // else console.log("SKIPPED - nodeBase - resize", this.data.label, size, this.data.width, this.data.height);   
  }

  getNode(nodeId) {
    // console.log("    nodeBase getNode:", this.id, nodeId, this.id == nodeId);
    if (this.id == nodeId) {
      // console.log("    nodeBase getNode: return this", this);
      return this;
    }
    return null;
  }

  getNodesByDatasetId(datasetId) {
    // console.log("    nodeBase getNodesByDatasetId:", this.id, datasetId, this.data.datasetId == datasetId);
    if (this.data.datasetId == datasetId) {
      // console.log("    nodeBase getNodesByDatasetId: return this", this);
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
    // console.log("    getAllEdges:", this.id, onlySelected, allEdges);
    this.edges.incoming.forEach((edge) => {
      if (!onlySelected || edge.selected) 
      {
        // console.log("    getAllEdges: incoming", edge, allEdges.indexOf(edge));
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
    // console.log("    getNeighbors:", this.id, selector);
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
    // console.log("    getParents:", this.id, this.parentNode);
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
        console.warn(`getParents: parentNode.getParents() returned non-array for node ${this.id}:`, parentParents);
        return [this.parentNode];
      }
    } else {
      console.warn(`getParents: parentNode does not have getParents method for node ${this.id}, parentNode:`, this.parentNode);
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
    if (this.parentNode && typeof this.parentNode.determineStatusBasedOnChildren === 'function') {
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
