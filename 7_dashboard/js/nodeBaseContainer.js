import BaseNode from "./nodeBase.js";
import Simulation from "./simulation.js";
import { getComputedDimensions } from "./utils.js";
import ZoomButton from "./buttonZoom.js";

export default class BaseContainerNode extends BaseNode {
  constructor(nodeData, parentElement, createNode, settings, parentNode = null) {
    super(nodeData, parentElement, settings, parentNode);

    this.createNode = createNode;

    this.simulation = null;
    this._container = null;
    this.edgesContainer = null;
    this.containerMargin = { top: 18, right: 8, bottom: 8, left: 8 };
    this.childNodes = [];

    // child edges contain the edges that are between nodes where this container
    // is the first joined parent
    this.childEdges = [];
  }

  get container() {
    if (this._container == null) {
      this._container = this.element.append("g").attr("class", (d) => `container`);
    }
    return this._container;
  }

  get collapsed() {
    return super.collapsed;
  }

  set collapsed(value) {
    if (value === this._collapsed) return;
    super.collapsed = value;

    this.childNodes.forEach((childNode) => {
      childNode.visible = !this.collapsed;
    });

    if (this.collapsed) {
      this.collapse();
    } else {
      this.expand();
    }

    this.cascadeUpdate();
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
    console.log("nodeBaseContainer - Setting status", value);
    super.status = value;
    this.shape.attr("status", value);
  }

  resize(size) {
    console.log("    BaseContainerNode - resize", this.data.label, size.width, size.height);

    // make sure the size of the element doesn't go below minimum size
    size.width = Math.max(size.width, this.minimumSize.width);
    size.height = Math.max(size.height, this.minimumSize.height);

    super.resize(size);
  }

  // resize the node based on a resize of the container and it's child
  resizeContainer(size) {
    size.width += this.containerMargin.left + this.containerMargin.right;
    size.height += this.containerMargin.top + this.containerMargin.bottom;
    console.log(`    BaseContainerNode - resizeContainer ${this.data.label}: ${Math.round(this.data.width)}x${Math.round(this.data.height)} --> ${Math.round(size.width)}x${Math.round(size.height)}`);

    this.resize(size);
  }

  async expand() {
    console.log("    BaseContainerNode - expand", this.data.label);
    // restore the expanded size if it was stored
    // if (this.data.expandedSize) {
    //   this.data.height = this.data.expandedSize.height;
    //   this.data.width = this.data.expandedSize.width;
    // }

    // const containerWidth = this.data.width - this.containerMargin.left - this.containerMargin.right;
    // const containerHeight = this.data.height - this.containerMargin.top - this.containerMargin.bottom;


    await this.initChildren();
    await this.initEdges();
    // await this.updateChildren();
    // await this.updateEdges();
    // await this.update();
    // Set expanded or collapsed state
    // await this.updateChildren();

    // this.resize({ width: this.data.width, height: this.data.height });
    if (this.parentNode)
      this.parentNode.update();

  }

  async collapse() {
    console.log("    BaseContainerNode - collapse", this.data.label);
    this.suspenseDisplayChange = true;
    // store the expanded size before collapsing
    if (this.data.height > this.minimumSize.height || this.data.width > this.minimumSize.width)
      this.data.expandedSize = { height: this.data.height, width: this.data.width };

    this.cleanContainer();

    // set the collapsed size

    // apply the collapsed size to the rectangle
    // this.resize({ width: this.minimumSize.height, height: this.minimumSize.width + 14 });
    this.resize({ width: this.minimumSize.width + 14, height: this.minimumSize.height });

    if (this.parentNode)
      this.parentNode.update();
    this.suspenseDisplayChange = false;
  }

  getNode(nodeId) {
    // console.log("    nodeBaseContainer getNode:", this.id, nodeId, this.id == nodeId);
    // console.log("                              :", this.childNodes.length, this.childNodes);
    // console.log("                              :", this.data);
    // console.log("                              :", this.childNodes[0]);
    if (this.id === nodeId) {
      // console.log("    nodeBaseContainer getNode found:", this.id, nodeId);
      return this;
    }
    for (const childNode of this.childNodes) {
      // console.log("    nodeBaseContainer getNode check child:", childNode.id, nodeId);
      const foundNode = childNode.getNode(nodeId);
      if (foundNode) {
        return foundNode;
      }
    }
    return null;
  }

  positionContainer() {
    // console.log(`Positioning Container for BaseContainerNode: ${this.id}`);
    var containerDimensions = getComputedDimensions(this.container);
    var elementDimensions = getComputedDimensions(this.element);

    const containerX = 0;
    var containerY = elementDimensions.y - containerDimensions.y + this.containerMargin.top;
    this.container.attr("transform", `translate(${containerX}, ${containerY})`);
  }

  async initEdges(propagate = false) {
    console.log("nodeBaseContainer - initEdges:", this.id, this.childEdges);
    // if there are any edges, create edges container
    if (this.childEdges.length > 0) {
      // create container for child nodes
      this.edgesContainer = this.container.append("g").attr("class", (d) => `edges`);

      // create container for child nodes
      this.ghostContainer = this.container
        .append("g")
        .attr("class", (d) => `ghostlines`)
        .lower(); // move it to the background

      this.childEdges.forEach((edge) => edge.init());
    }

    if (propagate) {
      this.childNodes.forEach((childNode) => {
        if (childNode instanceof BaseContainerNode) childNode.initEdges(propagate);
      });
    }
  }

  updateEdges() {
    console.log("    BaseContainerNode - updateEdges", this.id, this.childEdges.length);
    if (!this.visible) return;
    if (this.collapsed) return;

    if (this.childEdges.length > 0) {
      this.childEdges.forEach((edge) => edge.update());
    }
  }

  // function to return all the nodes in the graph
  getAllNodes(onlySelected = false) {
    const nodes = [];
    if (!onlySelected || this.selected) nodes.push(this);

    if (this.childNodes) {
      this.childNodes.forEach((childNode) => {
        nodes.push(...childNode.getAllNodes(onlySelected));
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

  async init() {
    console.log("    BaseContainerNode - init", this.id);
    await super.init();

    // Append text to the top left corner of the element
    const labelElement = this.element
      .append("text")
      .attr("x", -this.data.width / 2 + 4)
      .attr("y", -this.data.height / 2 + 4)
      .text(this.data.label)
      .attr("class", `node label container ${this.data.type}`);

    // the size of the text label determines the minimum size of the node
    this.minimumSize = getComputedDimensions(labelElement);
    this.minimumSize.width += 8;
    this.minimumSize.height += 4;
    if (this.data.width < this.minimumSize.width || this.data.height < this.minimumSize.height) {
      console.log(
        "Render Resizing BaseContainerNode:",
        this.data.width,
        this.minimumSize.width,
        this.data.height,
        this.minimumSize.height
      );
      this.data.width = Math.max(this.minimumSize.width, this.data.width);
      this.data.height = Math.max(this.minimumSize.height, this.data.height);
      // reposition the label based on the new size
      labelElement.attr("x", -this.data.width / 2 + 4).attr("y", -this.data.height / 2 + 4);
    }

    // Draw the node shape
    if (!this.shape)
      this.shape = this.element
        .insert("rect", ":first-child")
        .attr("class", (d) => `node shape container ${this.data.type}`)
        .attr("width", this.data.width)
        .attr("height", this.data.height)
        .attr("x", -this.data.width / 2)
        .attr("y", -this.data.height / 2)
        .attr("rx", 5)
        .attr("ry", 5);

    // Add zoom button
    this.zoomButton = new ZoomButton(
      this.element,
      { x: 16, y: 16 },
      (event, button) => {
        if (event) event.stopPropagation();

        button.toggle(); // Toggle between plus and minus on click
        this.collapsed = !this.collapsed;
      }
    );

    if (this.collapsed) {
      this.element.classed("collapsed", true);
      this.collapse();
    } else {
      this.element.classed("expanded", true);
      this.expand();
    }


    // you cannot move the g node,, move the child elements in stead
    this.element.attr("transform", `translate(${this.x}, ${this.y})`);
  }

  async initChildren() {
    console.log("BaseContainer - initChildren", this.data.label, this.data.children);

    // no default rendering of the children, but this renders a placeholder rect
    const containerWidth = this.data.width - this.containerMargin.left - this.containerMargin.right;
    const containerHeight = this.data.height - this.containerMargin.top - this.containerMargin.bottom;
    this.container
      .append("rect")
      .attr("class", (d) => `node placeholder`)
      .attr("width", containerWidth)
      .attr("height", containerHeight)
      .attr("fill", "red")
      .attr("stroke", "red")
      .attr("stroke-width", 2)
      .attr("x", -containerWidth / 2)
      .attr("y", -containerHeight / 2);

    this.updateChildren();
  }

  async update() {
    console.log("    BaseContainerNode - update", this.data.label);
    await super.update();

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

    if (!this.collapsed) {
      await this.updateChildren();

      this.updateEdges();
    }

    this.zoomButton.move(this.data.width / 2 - 16, -this.data.height / 2 + 2);    
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

  async updateChildren() {
    console.log("BaseContainer - updateChildren", this.data.label, this.data.children);

    this.container.attr(
      "transform",
      `translate(
            ${this.containerMargin.left - this.containerMargin.right}, 
            ${this.containerMargin.top - this.containerMargin.bottom}
          )`
    );
  }

  // Method to remove child nodes from the SVG
  cleanContainer() {
    console.log("    Removing Children for:", this.data.label);
    this.container.selectAll("*").remove();
    this.container.remove();
  }
}
