import BaseNode, { NodeStatus } from "./nodeBase.js";
import { getComputedDimensions } from "./utils.js";
import ZoomButton from "./buttonZoom.js";

export default class BaseContainerNode extends BaseNode {
  constructor(nodeData, parentElement, createNode, settings, parentNode = null) {
    nodeData.width ??= 0;
    nodeData.height ??= 0;
    nodeData.expandedSize ??= { width: nodeData.width, height: nodeData.height };
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
    this._container = null;
    this.edgesContainer ??= null;
    this.containerMargin = { top: 18, right: 8, bottom: 8, left: 8 };
    this.nodeSpacing = { horizontal: 20, vertical: 10 };
    this.childNodes = [];

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

  get container() {
    if (this._container == null) {
      // console.log("    BaseContainerNode - Creating container", this.data.label);
      this._container = this.element.append("g").attr("class", (d) => `node-container`);
    }
    return this._container;
  }

  get collapsed() {
    return super.collapsed;
  }

  set collapsed(value) {
    // console.log("    BaseContainerNode - Setting collapsed", value, this.data.label);
    if (value === this._collapsed) return;
    super.collapsed = value;

    this.zoomButton.toggle(value); // Toggle between plus and minus on click

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
    this.shape.attr("status", value);
  }

  determineStatusBasedOnChildren() {
    // if the status of all children is Ready, then the status of the container is Ready
    // if the status of all children is Updated, then the status of the container is Updated
    // if the status of one or more of the children is SKIPPED and the rest is UPDATED, then the status of the container is Skipped, unless the child is a container node, then it is Updated
    // if the status of all children is Disabled, then the status of the container is Disabled
    // if the status of all children is Unknown, then the status of the container is Unknown
    if (this.childNodes.length == 0) return;
    if ( !this.settings.cascadeOnStatusChange )
      {
        return;
      }  

      
    var containerStatus = NodeStatus.UNDETERMINED;
    for (const childNode of this.childNodes) {
    if (childNode.status != containerStatus) {
        // error
        // if there is an error, the status of the container is error
        if (containerStatus == NodeStatus.ERROR) continue;
        if (childNode.status == NodeStatus.ERROR && !(childNode instanceof BaseContainerNode)) {
          containerStatus = NodeStatus.ERROR;
          continue;
        }

        // warning
        // if there is a warning, the status of the container is warning
        if (containerStatus == NodeStatus.WARNING) continue;
        if (childNode.status == NodeStatus.WARNING && !(childNode instanceof BaseContainerNode)) {
          containerStatus = NodeStatus.WARNING;
          continue;
        }

        // delayed
        // if there is a delayed, the status of the container is delayed
        if (containerStatus == NodeStatus.DELAYED) continue;
        if (childNode.status == NodeStatus.DELAYED && !(childNode instanceof BaseContainerNode)) {
          containerStatus = NodeStatus.DELAYED;
          continue;
        }


        // unknown
        // if there is at least one unknown, the status of the container is unknown
        if (containerStatus == NodeStatus.UNKNOWN) continue;
        if (childNode.status == NodeStatus.UNKNOWN) 
        {
          containerStatus = NodeStatus.UNKNOWN;
          continue
        }


        if (containerStatus == NodeStatus.UNDETERMINED) {
          if (childNode.status == NodeStatus.ERROR || childNode.status == NodeStatus.WARNING || childNode.status == NodeStatus.DELAYED)
            containerStatus = NodeStatus.UNKNOWN;
          else
            containerStatus = childNode.status;
          continue;
        }


        if (containerStatus == NodeStatus.UPDATING
               && (childNode.status == NodeStatus.UPDATING || childNode.status == NodeStatus.UPDATED || childNode.status == NodeStatus.Ready) 
               && !(childNode instanceof BaseContainerNode)) {
          containerStatus = NodeStatus.UPDATING;
          continue;
        }

        if (containerStatus == NodeStatus.UPDATED
            && (childNode.status == NodeStatus.UPDATING) 
            && !(childNode instanceof BaseContainerNode)) {
          containerStatus = NodeStatus.UPDATING;
          continue;
        }
        if (childNode.status == NodeStatus.UPDATING) {
          containerStatus = NodeStatus.UNKNOWN;
          continue;
        }

        // partial updated/skipped
        if ((childNode.status == NodeStatus.UPDATED || childNode.status == NodeStatus.SKIPPED ) && (containerStatus != NodeStatus.UPDATED && containerStatus != NodeStatus.SKIPPED)) {
          containerStatus = NodeStatus.UNKNOWN;
          continue;
        }
               
        // skipped
        // if there is at least one skipped and the rets are only skipped or updated, the status of the container is skipped
        if ((containerStatus == NodeStatus.UPDATED || containerStatus == NodeStatus.SKIPPED) && (childNode.status != NodeStatus.UPDATED && childNode.status != NodeStatus.SKIPPED))
        {
          containerStatus = NodeStatus.UNKNOWN;
          continue;
        }
        if (containerStatus == NodeStatus.UPDATED && childNode.status == NodeStatus.SKIPPED && !(childNode instanceof BaseContainerNode)) {
          containerStatus = NodeStatus.SKIPPED;
          continue;
        }

        // ready, only if all children are ready
        // disabled, does not influence the status of the container, unless everything is disabled
      }
    }
    
    this.status = containerStatus;
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
    var containerDimensions = getComputedDimensions(this.container);
    var elementDimensions = getComputedDimensions(this.element);

    const containerX = 0;
    var containerY = elementDimensions.y - containerDimensions.y + this.containerMargin.top;
    this.container.attr("transform", `translate(${containerX}, ${containerY})`);
  }

  initEdges(propagate = false) {
    // console.log("nodeBaseContainer - initEdges:", this.id, this.childEdges);
    if (this.childEdges.length > 0) {
      // create container for child nodes
      if (this.edgesContainer == null) 
      {
        this.edgesContainer = this.container.append("g").attr("class", (d) => `edges`);
      }
      else
      {
        this.edgesContainer.selectAll("*").remove();
      }

      // create container for child nodes
      if (this.settings.showGhostlines)
      {
            if (this.ghostContainer)
              this.ghostContainer.selectAll("*").remove();
            else
              this.ghostContainer = this.container
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

    // Append text to the top left corner of the element
    const labelElement = this.element
      .append("text")
      .attr("x", -this.data.width / 2 + 4)
      .attr("y", -this.data.height / 2 + 4)
      .text(this.data.label)
      .attr("class", `container ${this.data.type} label`);

    // the size of the text label determines the minimum size of the node
    this.minimumSize = getComputedDimensions(labelElement);
    this.minimumSize.width += 36;
    this.minimumSize.height += 4;
    if (this.data.layout.minimumSize.width > this.minimumSize.width) this.minimumSize.width = this.data.layout.minimumSize.width;
    if (this.data.layout.minimumSize.height > this.minimumSize.height) this.minimumSize.height = this.data.layout.minimumSize.height;
    if ( this.data.layout.minimumSize.useRootRatio) this.applyMinimumSize();

    // console.log(
    //   "    BaseContainerNode - init minimumSize",
    //   this.data.label,
    //   this.minimumSize.width,
    //   this.minimumSize.height
    // );
    if (this.data.width < this.minimumSize.width || this.data.height < this.minimumSize.height) {
      // console.log(
      //   "Render Resizing BaseContainerNode:",
      //   this.data.width,
      //   this.minimumSize.width,
      //   this.data.height,
      //   this.minimumSize.height
      // );
      // this.data.width = Math.max(this.minimumSize.width, this.data.width);
      // this.data.height = Math.max(this.minimumSize.height, this.data.height);
      this.resize(
        {
          width: Math.max(this.minimumSize.width, this.data.width),
          height: Math.max(this.minimumSize.height, this.data.height),
        },
        true
      );
      // reposition the label based on the new size
      labelElement.attr("x", -this.data.width / 2 + 4).attr("y", -this.data.height / 2 + 4);
    }

    // Draw the node shape
    // if (!this.shape)
    this.shape = this.element
      .insert("rect", ":first-child")
      .attr("class", (d) => `${this.data.type} shape`)
      .attr("width", this.data.width)
      .attr("height", this.data.height)
      .attr("status", this.status)
      .attr("x", -this.data.width / 2)
      .attr("y", -this.data.height / 2)
      .attr("rx", 5)
      .attr("ry", 5);

    // Add zoom button
    this.zoomButton = new ZoomButton(
      this.element,
      { x: 0, y: 0 },
      (event, button) => {
        if (event) event.stopPropagation();

        this.collapsed = !this.collapsed;
        // button.toggle(this.collapsed); // Toggle between plus and minus on click
      },
      14,
      this.collapsed
    );

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
      this.container
        .append("rect")
        .attr("class", (d) => `${this.data.type} placeholder`)
        .attr("width", containerWidth)
        .attr("height", containerHeight)
        .attr("fill", "red")
        .attr("stroke", "red")
        .attr("stroke-width", 2)
        .attr("x", -containerWidth / 2)
        .attr("y", -containerHeight / 2);
    }
    else
    {
      for (const node of this.data.children) {
        // Create the childComponent instance based on node type
        var childComponent = this.getNode(node.id);
        if (childComponent == null) {
          childComponent = this.createNode(node, this.container, this.settings, this);
          this.childNodes.push(childComponent);

          // console.log("      nodeColumns - initChildren - Creating Node:", node.id, childComponent);
        }

        childComponent.init(this.container);
      }
    }

    this.updateChildren();
  }

  update() {
    // console.log(`    BaseContainerNode - update ${this.data.width}x${this.data.height}`, this.data.label);
    super.update();

    this.element
      .select(".shape")
      .attr("width", this.data.width)
      .attr("height", this.data.height)
      .attr("x", -this.data.width / 2)
      .attr("y", -this.data.height / 2);

    this.element
      .select(".label")
      .attr("x", -this.data.width / 2 + 4)
      .attr("y", -this.data.height / 2 + 4);

    if (this.zoomButton) this.zoomButton.move(this.data.width / 2 - 16, -this.data.height / 2 + 2);

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

    this.container.attr(
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
    this.container.selectAll("*").remove();
    this.container.remove();
    this._container = null;
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
