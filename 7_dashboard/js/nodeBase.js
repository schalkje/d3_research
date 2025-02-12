import { computeConnectionPoints } from "./utilPath.js";

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
    this.settings = settings;
    this.computeConnectionPoints = computeConnectionPoints;
    this.onDisplayChange = null;
    this.onClick = null;
    this.onDblClick = null;
    this._selected = false;
    this._status = nodeData.state ?? NodeStatus.UNKNOWN;
    this._visible = true; 
    this._collapsed = false; 
    this.suspenseDisplayChange = false;

    this.id = nodeData.id;

    this.edges = {
      incoming: [],
      outgoing: [],
    };

    this.element = null;
    this.simulation = null;
    this.layoutDebug = true;

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
    this.element.attr("status", value);

    if (this.settings.toggleCollapseOnStatusChange) {
      // if status is ready, unknown, disabled or updated then collapse the node, otherwise expand it
      this.collapsed = [NodeStatus.READY, NodeStatus.DISABLED, NodeStatus.UPDATED, NodeStatus.SKIPPED].includes(value);
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
      if (this.parentNode) this.parentNode.handleDisplayChange();
    }
  }

  move(x, y) {
    // console.log(`          > move ${this.id}, (x:${Math.round(this.x)},y:${Math.round(this.y)}) -> (x:${Math.round(x)},y:${Math.round(y)})`);
    this.x = x;
    this.y = y;
    this.element.attr("transform", `translate(${this.x}, ${this.y})`);

    this.handleDisplayChange();
  }

   init(parentElement = null) {
    if (parentElement) this.parentElement = parentElement;
    // console.log("nodeBase - init", this.data.label);

    this.element = this.parentElement
      .append("g")
      .attr("class", this.data.type)
      .attr("id", this.id)
      .attr("status", this.status)
      .on("click", (event) => {
        // console.log("Clicked on Adapter Node [BASE]:", this.id, event);
        if (event) event.stopPropagation();
        this.handleClicked(event);
      })
      .on("dblclick", (event) => {
        // console.log("Double-clicked on Adapter Node [BASE]:", this.id, event);
        if (event) event.stopPropagation();
        this.handleDblClicked(event);
      });

      
    // Set expanded or collapsed state
    this.element.classed("collapsed", this.collapsed);
    this.element.classed("expanded", !this.collapsed);

    // show the center stip
    if (this.settings.showCenterMark)
      this.element.append("circle").attr("class", "centermark").attr("r", 3).attr("cx", 0).attr("cy", 0);

    // show the connection points
    if (this.settings.showConnectionPoints) {
      const connectionPoints = this.computeConnectionPoints(0, 0, this.data.width, this.data.height);
      Object.values(connectionPoints).forEach((point) => {
        this.element
          .append("circle")
          .attr("class", `connection-point side-${point.side}`)
          .attr("cx", point.x)
          .attr("cy", point.y)
          .attr("r", 2);
      });
    }
  }

  // function to put all the elements in the correct place
   update() {
    // console.log("nodeBase - update", this.data.label);

    if (this.settings.showConnectionPoints) {
      const connectionPoints = this.computeConnectionPoints(0, 0, this.data.width, this.data.height);
      Object.values(connectionPoints).forEach((point) => {
        this.element.select(`.connection-point.side-${point.side}`).attr("cx", point.x).attr("cy", point.y);
      });
    }
  }
  
  handleClicked(event, node = this) {
    console.log("handleClicked:", this.id, event);

    if (this.onClick) {
      this.onClick(node);
    } else if (this.parentNode) {
      this.parentNode.handleClicked(event, node);
    } else {
      console.warn(`No onClicked handler, node ${node.id} clicked!`);
    }
  }

  handleDblClicked(event, node = this) {
    console.log("handleClicked:", this.id, event);

    if (this.onDblClick) {
      this.onDblClick(node);
    } else if (this.parentNode) {
      this.parentNode.handleDblClicked(event, node);
    } else {
      console.warn(`No onDblClick handler, node ${node.id} clicked!`);
    }
  }

   resize(size, forced = false) {
    // node base has no elements of it's own, so just update the data
    if  (forced || this.data.width != size.width || this.data.height != size.height)
    {
      // console.log(`nodeBase - resize`, this.data.label, Math.round(this.data.width), Math.round(this.data.height), Math.round(size.width), Math.round(size.height)); 
      this.data.width = size.width;
      this.data.height = size.height;

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
    return this.parentNode ? [this.parentNode, ...this.parentNode.getParents()] : [];
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
    if (this.parentNode) {
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
}
