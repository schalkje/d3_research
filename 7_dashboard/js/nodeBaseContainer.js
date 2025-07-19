import BaseNode, { NodeStatus } from "./nodeBase.js";
import { getComputedDimensions } from "./utils.js";
// ZoomButton is now handled by HeaderZone in the zone system
import { StatusManager } from "./statusManager.js";
import { GeometryManager } from "./geometryManager.js";
import { ConfigManager } from "./configManager.js";
import { ZoneManager } from "./zones/index.js";

export default class BaseContainerNode extends BaseNode {
  constructor(nodeData, parentElement, createNode, settings, parentNode = null) {
    nodeData.width ??= 0;
    nodeData.height ??= 0;
    nodeData.expandedSize ??= { width: nodeData.width, height: nodeData.height };
    // Ensure layout is an object, not a string
    if (typeof nodeData.layout === 'string') {
      nodeData.layout = { type: nodeData.layout };
    }
    nodeData.layout ??= {};
    nodeData.layout.minimumSize ??= { width: 0, height: 0 };
    nodeData.layout.minimumSize.width ??= 0;
    nodeData.layout.minimumSize.height ??= 0;
    nodeData.layout.minimumSize.useRootRatio ??= false;

    super(nodeData, parentElement, settings, parentNode);
    this.data.type ??= "container";

    this.isContainer = true;

    this.createNode = createNode;

    this.simulation = null;
    this.edgesContainer ??= null;
    this.containerMargin = ConfigManager.getDefaultContainerMargin();
    this.nodeSpacing = ConfigManager.getDefaultNodeSpacing();
    this.childNodes = [];
    this.zoneManager = null;

    // child edges contain the edges that are between nodes where this container
    // is the first joined parent
    this.childEdges = [];
  }

  get nestedCorrection_y() {
    return this.y - this.data.height / 2 + this.containerMargin.top;
  }

  get nestedCorrection_x() {
    return this.x;
  }

  get collapsed() {
    return super.collapsed;
  }

  set collapsed(value) {
    // console.log("    BaseContainerNode - Setting collapsed", value, this.data.label);
    if (value === this._collapsed) return;
    super.collapsed = value;

    // Zoom button state is now handled by HeaderZone

    if (this.collapsed) {
      this.collapse();
      this.handleDisplayChange(this, false);
    } else {
      this.expand();
    }

    this.cascadeUpdate();
  }

  propagateVisibility(visible) {
    this.childNodes.forEach((childNode) => {
      childNode.visible = visible;
      if (childNode instanceof BaseContainerNode) childNode.propagateVisibility(visible);
    });
  }

  get visible() {
    return this._visible;
  }

  set visible(value) {
    if (value === this._visible) return;
    super.visible = value;
    // JS: todo - change visibility of the children
  }

  get status() {
    return super.status;
  }
  set status(value) {
    super.status = value;
  }

  determineStatusBasedOnChildren() {
    if (this.childNodes.length === 0) return;
    if (!this.settings.cascadeOnStatusChange) {
      return;
    }

    const containerStatus = StatusManager.calculateContainerStatus(this.childNodes, this.settings);
    this.status = containerStatus;
  }

  handleDisplayChange(node = this, propagate = true) {
    if (this.suspenseDisplayChange) {
      return;
    }
    
    if (this.onDisplayChange) {
      this.onDisplayChange();
    } else if (propagate && this.parentNode && typeof this.parentNode.handleDisplayChange === 'function') {
      this.parentNode.handleDisplayChange();
    }
  }

  resize(size, forced = false) {
    // console.log("    BaseContainerNode - resize", this.data.label, Math.round(size.width), Math.round(size.height));

    // make sure the size of the element doesn't go below minimum size
    size.width = Math.max(size.width, this.minimumSize.width);
    size.height = Math.max(size.height, this.minimumSize.height);

    super.resize(size, forced);
  }

  // resize the node based on a resize of the container and it's child
  resizeContainer(size, forced = false) {
    size.width += this.containerMargin.left + this.containerMargin.right;
    size.height += this.containerMargin.top + this.containerMargin.bottom;
    // console.log(
    //   `    BaseContainerNode - resizeContainer ${this.data.label}: ${Math.round(this.data.width)}x${Math.round(
    //     this.data.height
    //   )} --> ${Math.round(size.width)}x${Math.round(size.height)}`
    // );

    this.resize(size, forced);
  }

  expand() {
    // console.warn(
    //   `    BaseContainerNode - expand ${Math.round(this.data.width)}x${Math.round(this.data.height)} -> ${Math.round(
    //     this.data.expandedSize.width
    //   )}x${Math.round(this.data.expandedSize.height)}`,
    //   this.data.label
    // );

    // you can only expand a container if it's parent is already expanded
    // expand parent first when not expanded
    if (this.parentNode && this.parentNode.collapsed) {
      this.parentNode.collapsed = false;
    } else {
      // restore the expanded size if it was stored
      if (this.data.expandedSize) {
        this.resize(this.data.expandedSize, true);
      }

      this.initChildren();
      this.initEdges();
    }
  }

  collapse() {
    // console.log("    BaseContainerNode - collapse", this.data.label);
    this.suspenseDisplayChange = true;
    // store the expanded size before collapsing
    if (this.data.height > this.minimumSize.height + 5 || this.data.width > this.minimumSize.width + 5)
      // Js: + 5, because of a strange bug, where the size differs slightly between renders, depending on the zoom level
      this.data.expandedSize = { height: this.data.height, width: this.data.width };

    this.cleanContainer();

    this.update();

    // set the collapsed size
    this.resize({ width: this.minimumSize.width, height: this.minimumSize.height });

    if (this.parentNode) this.parentNode.update();
    this.suspenseDisplayChange = false;
  }

  getNode(nodeId) {
    // console.log("    nodeBaseContainer getNode:", this.id, nodeId, this.id == nodeId);
    // console.log("                              :", this.childNodes.length, this.childNodes);
    // console.log("                              :", this.data);
    // console.log("                              :", this.childNodes[0]);
    if (this.id == nodeId) {
      // console.log("    nodeBaseContainer getNode found:", this.id, nodeId);
      return this;
    }
    for (const childNode of this.childNodes) {
      // console.log("    nodeBaseContainer getNode check child:", this.id, childNode.id, nodeId);
      const foundNode = childNode.getNode(nodeId);
      if (foundNode) {
        return foundNode;
      }
    }
    return null;
  }

  getNodesByDatasetId(datasetId) {
    // console.log("    nodeBaseContainer getNodesByDatasetId:", this.id, datasetId);
    var nodes = [];
    if (this.data.datasetId == datasetId) {
      nodes.push(this);
    }
    if (this.childNodes) {
      for (const childNode of this.childNodes) {
        nodes.push(...childNode.getNodesByDatasetId(datasetId));
      }
    }
    return nodes;
  }

  positionContainer() {
    // console.log(`Positioning Container for BaseContainerNode: ${this.id}`);
    var containerDimensions = getComputedDimensions(this.element);
    var elementDimensions = getComputedDimensions(this.element);

    const containerX = 0;
    var containerY = elementDimensions.y - containerDimensions.y + this.containerMargin.top;
    this.element.attr("transform", `translate(${containerX}, ${containerY})`);
  }

  initEdges(propagate = false) {
    if (this.collapsed) return;
    // console.log("nodeBaseContainer - initEdges:", this.id, this.childEdges);
    if (this.childEdges.length > 0) {
      // create container for child nodes
      if (this.edgesContainer == null) 
      {
        this.edgesContainer = this.element.append("g").attr("class", (d) => `edges`);
      }
      else
      {
        // console.log("                   clean cont:", this.id, this.childEdges);
        this.edgesContainer.selectAll("*").remove();
      }

      // create container for child nodes
      if (this.settings.showGhostlines)
      {
            if (this.ghostContainer)
              this.ghostContainer.selectAll("*").remove();
            else
              this.ghostContainer = this.element
                .append("g")
                .attr("class", (d) => `ghostlines`)
                .lower(); // move it to the background
      }

      this.childEdges.forEach((edge) => edge.init());
    }

    if (propagate) {
      this.childNodes.forEach((childNode) => {
        if (childNode instanceof BaseContainerNode) childNode.initEdges(propagate);
      });
    }
  }

  updateEdges() {
    // console.log("    BaseContainerNode - updateEdges", this.id, this.childEdges.length);
    if (!this.visible) return;
    if (this.collapsed) return;

    if (this.childEdges.length > 0) {
      this.childEdges.forEach((edge) => edge.update());
    }
  }

  // function to return all the nodes in the graph
  getAllNodes(onlySelected = false, onlyEndNodes = false) {
    const nodes = [];
    if ((!onlySelected || this.selected) && !onlyEndNodes) nodes.push(this);

    if (this.childNodes) {
      this.childNodes.forEach((childNode) => {
        nodes.push(...childNode.getAllNodes(onlySelected, onlyEndNodes));
      });
    }
    return nodes;
  }

  getAllEdges(onlySelected = false, allEdges = []) {
    // console.log("    getAllEdges BaseContainerNode:", this.id, onlySelected, allEdges.length);
    super.getAllEdges(onlySelected, allEdges);

    if (this.childNodes) {
      this.childNodes.forEach((childNode) => {
        childNode.getAllEdges(onlySelected, allEdges);
      });
    }
  }

  init(parentElement = null) {
    if (parentElement) this.parentElement = parentElement;
    // console.log("    BaseContainerNode - init", this.id);
    super.init(parentElement);

    // Zone manager is already initialized in BaseNode.init()

    // Calculate minimum size based on label
    const labelText = this.data.label || '';
    const labelWidth = labelText.length * 8 + 36; // Approximate text width
    const labelHeight = 20; // Approximate text height
    const defaultSize = { width: labelWidth, height: labelHeight };
    this.minimumSize = GeometryManager.calculateMinimumSize([], defaultSize);
    
    if (this.data.layout.minimumSize.width > this.minimumSize.width) this.minimumSize.width = this.data.layout.minimumSize.width;
    if (this.data.layout.minimumSize.height > this.minimumSize.height) this.minimumSize.height = this.data.layout.minimumSize.height;
    if (this.data.layout.minimumSize.useRootRatio) this.applyMinimumSize();

    if (this.data.width < this.minimumSize.width || this.data.height < this.minimumSize.height) {
      this.resize(
        {
          width: Math.max(this.minimumSize.width, this.data.width),
          height: Math.max(this.minimumSize.height, this.data.height),
        },
        true
      );
    }

    // Shape drawing is now handled by ContainerZone in the zone system

    if (this.collapsed) {
      this.collapse();
    } else {
      this.expand();
    }

    // you cannot move the g node,, move the child elements in stead
    this.element.attr("transform", `translate(${this.x}, ${this.y})`);
  }

  initChildren() {
    if (!this.data.children || this.data.children.length === 0) {
      return;
    }

    // console.log("BaseContainer - initChildren", this.data.label, this.data.children);

    if (this.data.children.length == 0) {
      // no rendering of the children, but this renders a placeholder rect
      const containerWidth = this.data.width - this.containerMargin.left - this.containerMargin.right;
      const containerHeight = this.data.height - this.containerMargin.top - this.containerMargin.bottom;
      this.element
        .append("rect")
        .attr("class", `${this.data.type} placeholder`)
        .attr("width", containerWidth)
        .attr("height", containerHeight)
        .attr("x", -containerWidth / 2)
        .attr("y", -containerHeight / 2);
    }
    else
    {
      // Get child container from zone system
      const childContainer = this.zoneManager?.innerContainerZone?.getChildContainer() || this.element;
      
      for (const node of this.data.children) {
        // Create the childComponent instance based on node type
        var childComponent = this.getNode(node.id);
        if (childComponent == null) {
          childComponent = this.createNode(node, childContainer, this.settings, this);
          this.childNodes.push(childComponent);

          // Add child to zone system
          if (this.zoneManager?.innerContainerZone) {
            this.zoneManager.innerContainerZone.addChild(childComponent);
          }

          // console.log("      nodeColumns - initChildren - Creating Node:", node.id, childComponent);
        }

        childComponent.init(childContainer);
      }
      
      // Trigger child positioning after all children are initialized
      if (this.zoneManager?.innerContainerZone) {
        this.zoneManager.innerContainerZone.forceUpdateChildPositions();
      }
    }

    this.updateChildren();
  }

  update() {
    // console.log(`    BaseContainerNode - update ${this.data.width}x${this.data.height}`, this.data.label);
    super.update();

    // Shape drawing is now handled by ContainerZone in the zone system

    if (!this.collapsed) {
      this.updateChildren();

      this.updateEdges();
    }
  }

  // // Method to update rendering based on interaction state
  // updateLayout() {
  //   console.log("    BaseContainerNode - updateLayout", this.data.label, this.collapsed);
  //   super.updateLayout();

  //   this.childNodes.forEach((childNode) => {
  //     childNode.visible = !this.collapsed;
  //   });

  //   if (this.collapsed) {
  //     this.renderCollapsed();
  //   } else {
  //     this.renderExpanded();
  //   }

  //   this.cascadeUpdate();

  //   this.updateEdges();
  // }

  updateChildren() {
    // console.log("BaseContainer - updateChildren", this.data.label, this.data.children);

    // Use zone system for child positioning if available
    if (this.zoneManager?.innerContainerZone) {
      // Zone system handles positioning automatically
      return;
    }

    // Fallback to legacy positioning
    this.element.attr(
      "transform",
      `translate(
            ${this.containerMargin.left - this.containerMargin.right}, 
            ${this.containerMargin.top - this.containerMargin.bottom}
          )`
    );
  }

  // Method to remove child nodes from the SVG
  cleanContainer(propagate = true) {
    // console.log("    Removing Children for:", this.data.label);
    this.element.selectAll("*").remove();
    this.edgesContainer = null;
    for (const childNode of this.childNodes) {
      if (childNode instanceof BaseContainerNode) childNode.cleanContainer(propagate);
    }
  }

  applyMinimumSize() {
    // console.error("    BaseContainerNode - applyRatioToMinimumSize", this.data.label, this.data.layout.minimumSize.useRootRatio, this);
    if (this.minimumSize.width < this.data.layout.minimumSize.width) this.minimumSize.width = this.data.layout.minimumSize.width;
    if (this.minimumSize.height < this.data.layout.minimumSize.height) this.minimumSize.height = this.data.layout.minimumSize.height;

    if ( !this.data.layout.minimumSize.useRootRatio) return;


    if (this.minimumSize.width / this.height > this.settings.divRatio)
    {
      this.minimumSize.height = this.minimumSize.width / this.settings.divRatio;
    }
    else
    {
        this.minimumSize.width = this.minimumSize.height * this.settings.divRatio;
    }
    // console.log("    BaseContainerNode - applyRatioToMinimumSize", this.minimumSize.width, this.minimumSize.height);
  }
}
