import BaseContainerNode from "./nodeBaseContainer.js";
import RectangularNode from "./nodeRect.js";
import { createInternalEdge } from "./edge.js";
import { getComputedDimensions } from "./utils.js";

const DisplayMode = Object.freeze({
  FULL: 'full',
  ROLE: 'role'  
});

const Orientation = Object.freeze({
  HORIZONTAL: 'horizontal',
  HORIZONTAL_LINE: 'horizontal_line',
  VERTICAL: 'vertical',
  ROTATE_90: 'rotate90',
  ROTATE_270: 'rotate270'  
});

const FoundationMode = Object.freeze({
  MANUAL: 'manual', 
  AUTO: 'auto',
});


export default class FoundationNode extends BaseContainerNode {
  constructor(nodeData, parentElement, createNode, settings, parentNode = null) {
    if (!nodeData.width) nodeData.width = 334;
    if (!nodeData.height) nodeData.height = 44;
    if (!nodeData.layout) nodeData.layout = {};
    if (!nodeData.layout.displayMode) nodeData.layout.displayMode = DisplayMode.ROLE;
    if (!nodeData.layout.orientation) nodeData.layout.orientation = Orientation.HORIZONTAL;
    if (!nodeData.layout.mode) nodeData.layout.mode = FoundationMode.AUTO; // manual, full

    super(nodeData, parentElement, createNode, settings, parentNode);

    this.rawNode = null;
    this.baseNode = null;
    this.nodeSpacing = { horizontal: 20, vertical: 10 };
  }

  get nestedCorrection_y() {
    return this.y;
  }


  initChildren() {
    this.suspenseDisplayChange = true;
    console.log("    nodeFoundation - initChildren - Create Children for Foundation:", this.data.label, this.data.children);

    super.initChildren();

    if (!this.data.children || this.data.children.length === 0) {
      this.data.children = [];
    }

    this.rawNode = this.initializeChildNode("raw", ["raw"]);
    this.baseNode = this.initializeChildNode("base", ["base"]);

    createInternalEdge(
      {
        source: this.rawNode.data.id,
        target: this.baseNode.data.id,
        isActive: true,
        type: "SSIS",
        state: "Ready",
      },
      this.rawNode,
      this.baseNode,
      this.settings
    );

    this.initEdges();

    this.data.expandedSize = {
      width:
        this.rawNode.data.width +
        this.nodeSpacing.horizontal +
        this.baseNode.data.width +
        this.containerMargin.left +
        this.containerMargin.right,
      height: this.containerMargin.top + this.containerMargin.bottom + 18,
    };

    this.resize(this.data.expandedSize, true);
    this.update();
    this.cascadeUpdate();

    this.suspenseDisplayChange = false;
    this.handleDisplayChange();
  }

  initializeChildNode(role, labels) {
    let node = this.childNodes.find((child) => child.data.role === role);
    if (!node) {
      node = this.childNodes.find((child) => labels.some(label => child.data.label.toLowerCase().includes(label.toLowerCase())));
    }
    if (!node) {
      let childData = this.data.children.find((child) => child.role === role);
      if (!childData && this.shouldCreateChildNode(role)) {
        childData = {
          id: `${role}_${this.data.id}`,
          label: `${role.charAt(0).toUpperCase() + role.slice(1)} ${this.data.label}`,
          role: role,
          type: "node",
        };
        this.data.children.push(childData);
      }
      node = this.initChildNode(childData, node);
    }
    return node;
  }

  shouldCreateChildNode(role) {
    const mode = this.data.layout.mode;
    return mode === FoundationMode.AUTO;
  }

  initChildNode(childData, childNode) {
    if (childData) {
      if (childNode == null) {
        const copyChild = JSON.parse(JSON.stringify(childData));
        if (this.data.layout.displayMode == DisplayMode.ROLE) {
          copyChild.label = copyChild.role;
          copyChild.width = 50;
        }
        childNode = new RectangularNode(copyChild, this.container, this.settings, this);
        this.childNodes.push(childNode);
      }

      childNode.init(this.container);
    }
    return childNode;
  }

  updateChildren() {
    console.log("    Layout for Adapter:", this.id, this.data.layout);
    switch (this.data.layout.displayMode) {
      case DisplayMode.FULL:
        this.updateFull();
        break;
      case DisplayMode.ROLE:
        this.updateRole();
        break;
      default:
        console.warn(`Unknown displayMode "${this.data.layout.displayMode}" using ${DisplayMode.FULL}`)
        this.updateFull();
        break;
    }
  }

   updateFull() {
    if (this.rawNode) {
      const x = -this.data.width / 2 + this.rawNode.data.width / 2 + this.containerMargin.left;
      const y = -this.data.height / 2 + this.rawNode.data.height / 2 + this.containerMargin.top;
      this.rawNode.move(x, y);
    }

    if (this.baseNode) {
      const x =
        -this.data.width / 2 +
        this.baseNode.data.width / 2 +
        this.containerMargin.left +
        this.rawNode.data.width +
        this.nodeSpacing.horizontal;
      const y = -this.data.height / 2 + this.baseNode.data.height / 2 + this.containerMargin.top;
      this.baseNode.move(x, y);
    }    
  }

   updateRole() {
    // JS: TODO: use code as label; need rerendering of the children
    console.log("    Layout Code for Adapter:", this.id);
    if (this.rawNode) {
      const x = -this.data.width / 2 + this.rawNode.data.width / 2 + this.containerMargin.left;
      const y = -this.data.height / 2 + this.rawNode.data.height / 2 + this.containerMargin.top;
      this.rawNode.move(x, y);
    }

    if (this.baseNode) {
      const x =
        -this.data.width / 2 +
        this.baseNode.data.width / 2 +
        this.containerMargin.left +
        this.rawNode.data.width +
        this.nodeSpacing.horizontal;
      const y = -this.data.height / 2 + this.baseNode.data.height / 2 + this.containerMargin.top;
      this.baseNode.move(x, y);
    }

  }

}
