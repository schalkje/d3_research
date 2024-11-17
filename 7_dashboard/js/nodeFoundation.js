import BaseContainerNode from "./nodeBaseContainer.js";
import RectangularNode from "./nodeRect.js";
import { createInternalEdge } from "./edge.js";

const DisplayMode = Object.freeze({
  FULL: 'full',
  CODE: 'code'  
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
    if (!nodeData.height) nodeData.height = 48;
    if (!nodeData.layout) nodeData.layout = {};
    if (!nodeData.layout.displayMode) nodeData.layout.displayMode = DisplayMode.FULL;
    if (!nodeData.layout.orientation) nodeData.layout.orientation = Orientation.HORIZONTAL;
    if (!nodeData.layout.mode) nodeData.layout.mode = FoundationMode.AUTO; // manual, full

    super(nodeData, parentElement, createNode, settings, parentNode);

    this.rawNode = null;
    this.baseNode = null;
    this.nodeSpacing = { horizontal: 20, vertical: 10 };
  }

  async renderChildren() {
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
      if (this.rawNode == null)
        this.rawNode = new RectangularNode(rawChild, this.container, this.settings, this);
      
      this.rawNode.render();
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
      if (this.baseNode == null)
        this.baseNode = new RectangularNode(baseChild, this.container, this.settings, this);
      
      this.baseNode.render();
    }



    // store the child nodes in an array for following the requirements of the base container node
    this.childNodes.push(this.rawNode);
    this.childNodes.push(this.baseNode);

    this.layoutChildren();

    console.log("    AdapterNode children:", this.rawNode, this.baseNode);
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

    this.renderEdges();
    this.layoutEdges();
  }

  layoutChildren() {
    console.log("    Layout for Adapter:", this.id, this.data.layout);
    switch (this.data.layout.displayMode) {
      case DisplayMode.FULL:
        this.layoutFull();
        break;
      case DisplayMode.CODE:
        this.layoutCode();
        break;
      default:
        console.log(`Unknown displayMode "${this.data.layout.displayMode}" using ${DisplayMode.FULL}`)
        this.layoutFull();
        break;
    }
  }

  async layoutFull() {
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

  async layoutCode() {
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
