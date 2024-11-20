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

  async initChildren() {
    this.suspenseDisplayChange = true;

    // console.log("    Rendering Children for Adapter:", this.id, this.data.children);
    if (!this.data.children || this.data.children.length === 0) {
      this.data.children = [];
    }

    // render "raw" node
    let rawChild = this.data.children.find((child) => child.role === "raw");
    if (
      !rawChild &&
        this.data.layout.mode === FoundationMode.AUTO
    ) {
      rawChild = {
        id: `raw_${this.data.id}`,
        label: `raw ${this.data.label}`,
        role: "raw",
        type: "node",
      };
      this.data.children.push(rawChild);
    }
    if (rawChild) {
      if (this.rawNode == null) {
        const copyRawChild = JSON.parse(JSON.stringify(rawChild));
        if (this.data.layout.displayMode == DisplayMode.ROLE) {
          copyRawChild.label = copyRawChild.role;
          copyRawChild.width = 50;
        }
        this.rawNode = new RectangularNode(copyRawChild, this.container, this.settings, this);
        this.childNodes.push(this.rawNode);
      }
      
      this.rawNode.init(this.container);
    }

    // render "base" node
    let baseChild = this.data.children.find((child) => child.role === "base");
    if (
      !baseChild &&
        this.data.layout.mode === FoundationMode.AUTO
    ) {
      baseChild = {
        id: `base_${this.data.id}`,
        label: `base ${this.data.label}`,
        role: "base",
        type: "node",
      };
      this.data.children.push(baseChild);
    }
    if (baseChild) {
      // console.log("    Rendering Base Node:", baseChild, this);
      if (this.baseNode == null) {
        const copyBaseChild = JSON.parse(JSON.stringify(baseChild));
        if (this.data.layout.displayMode == DisplayMode.ROLE) {
          copyBaseChild.label = copyBaseChild.role;
          copyBaseChild.width = 50;
        }
        this.baseNode = new RectangularNode(copyBaseChild, this.container, this.settings, this);
        this.childNodes.push(this.baseNode);
      }
      
      this.baseNode.init(this.container);
    }

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
      this.settings,
    );

    await this.initEdges();

    // compute the size of the container
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

    await this.update();
    this.cascadeUpdate();

    this.suspenseDisplayChange = false;
    this.handleDisplayChange();
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

  async updateFull() {
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

  async updateRole() {
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
