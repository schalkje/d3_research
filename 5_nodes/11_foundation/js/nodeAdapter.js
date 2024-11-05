// import BaseNode from "./nodeBase.js";
import BaseContainerNode from "./nodeBaseContainer.js";
import RectangularNode from "./nodeRect.js";
import { createInternalEdge } from "./edge.js";


const AdapterMode = Object.freeze({
  MANUAL: 'manual', 
  FULL: 'full',
  ARCHIVE_ONLY: 'archive-only',
  STAGING_ARCHIVE: 'staging-archive'
});

export default class AdapterNode extends BaseContainerNode {
  constructor(nodeData, parentElement, createNode, settings, parentNode = null) {
    if (!nodeData.width) nodeData.width = 334;
    if (!nodeData.height) nodeData.height = 74;
    if (!nodeData.layout) nodeData.layout = {};
    if (!nodeData.layout.mode) nodeData.layout.mode = AdapterMode.FULL; // manual, full, archive-only, staging-archive 
    if (!nodeData.layout.arrangement) nodeData.layout.arrangement = 1; // 1,2,3
    


    super(nodeData, parentElement, createNode, settings, parentNode);

    this.stagingNode = null;
    this.transformNode = null;
    this.archiveNode = null;
    this.nodeSpacing = { horizontal: 20, vertical: 10 };
  }

  async renderChildren() {
    // console.log("    Rendering Children for Adapter:", this.id, this.data.children);
    if (!this.data.children || this.data.children.length === 0) {
      this.data.children = [];
    }

    // render "archive" node
    let archiveChild = this.data.children.find((child) => child.category === "archive");
    if (
      !archiveChild &&
      (this.data.layout.mode === AdapterMode.ARCHIVE_ONLY ||
        this.data.layout.mode === AdapterMode.STAGING_ARCHIVE ||
        this.data.layout.mode === AdapterMode.FULL)
    ) {
      archiveChild = {
        id: `arc_${this.data.id}`,
        label: `Archive ${this.data.label}`,
        category: "archive",
        type: "node",
      };
      this.data.children.push(archiveChild);
    }
    if (archiveChild) {
      console.log("    Rendering Archive Node:", archiveChild, this);
      this.archiveNode = new RectangularNode(archiveChild, this.container, this.settings, this);
      this.archiveNode.render();
    } 

    // render "staging" node
    let stagingChild = this.data.children.find((child) => child.category === "staging");
    if (
      !stagingChild &&
      (this.data.layout.mode == AdapterMode.STAGING_ARCHIVE || 
        this.data.layout.mode == AdapterMode.FULL)
    ) {
      stagingChild = {
        id: `stg_${this.data.id}`,
        label: `Staging ${this.data.label}`,
        category: "staging",
        type: "node",
      };
      this.data.children.push(stagingChild);
    }
    if (stagingChild) {
      this.stagingNode = new RectangularNode(stagingChild, this.container, this.settings, this);
      this.stagingNode.render();
    }

    // render "transform" node
    let transformChild = this.data.children.find((child) => child.category === "transform");
    if (!transformChild && 
        this.data.layout.mode == AdapterMode.FULL) {
      transformChild = {
        id: `trn_${this.data.id}`,
        label: `Transform ${this.data.label}`,
        category: "transform",
        type: "node",
      };
      this.data.children.push(transformChild);
    }
    if (transformChild) {
      this.transformNode = new RectangularNode(transformChild, this.container, this.settings, this);
      this.transformNode.render();
    }

    // store the child nodes in an array for following the requirements of the base container node
    this.childNodes.push(this.stagingNode);
    this.childNodes.push(this.archiveNode);
    this.childNodes.push(this.transformNode);

    this.layoutChildren();

    createInternalEdge(
      {
        source: this.stagingNode,
        target: this.transformNode,
        isActive: true,
        type: "SSIS",
        state: "Ready",
      },
      this,
      this.stagingNode,
      this.transformNode,      
      this.settings,
    );
    createInternalEdge(
      {
        source: this.stagingNode,
        target: this.archiveNode,
        isActive: true,
        type: "SSIS",
        state: "Ready",
      },
      this,
      this.stagingNode,
      this.archiveNode,
      this.settings,
    );

    this.renderEdges();
    this.layoutEdges();
  }

  layoutChildren() {
    console.log("    Layout for Adapter:", this.id, this.data.layout);
    switch (this.data.layout.arrangement) {
      case 1:
        this.layout1();
        break;
      case 2:
        this.layout2();
        break;
      case 3:
        this.layout3();
        break;
    }
  }

  async layout1() {
    if (this.stagingNode) {
      const x = -this.data.width / 2 + this.stagingNode.data.width / 2 + this.containerMargin.left;
      const y = -this.data.height / 2 + this.stagingNode.data.height / 2 + this.containerMargin.top;
      this.stagingNode.move(x, y);
    }

    if (this.archiveNode) {
      const x =
        -this.data.width / 2 +
        this.archiveNode.data.width / 2 +
        this.containerMargin.left +
        this.stagingNode.data.width +
        this.nodeSpacing.horizontal;
      const y = -this.data.height / 2 + this.archiveNode.data.height / 2 + this.containerMargin.top;
      this.archiveNode.move(x, y);
    }

    if (this.transformNode) {
      // first resize the transform node to fit the width of the other two nodes
      const width =
        this.stagingNode.data.width +
        this.archiveNode.data.width -
        this.stagingNode.data.width / 2 +
        this.nodeSpacing.horizontal -
        +2 * this.nodeSpacing.horizontal;
      const height = this.transformNode.data.height;
      this.transformNode.resize({ width: width, height: height });

      // then position the transform node based on the new size
      const x =
        -this.data.width / 2 +
        this.transformNode.data.width / 2 +
        this.containerMargin.left +
        this.stagingNode.data.width / 2 + 
        2 * this.nodeSpacing.horizontal;
      const y =
        -this.data.height / 2 +
        this.transformNode.data.height / 2 +
        this.containerMargin.top + 
        this.archiveNode.data.height +
        this.nodeSpacing.vertical;
      this.transformNode.move(x, y);
    }
  }

  async layout2() {
    if (this.stagingNode) {
      const x = -this.data.width / 2 + this.stagingNode.data.width / 2 + this.containerMargin.left;
      const y =
        -this.data.height / 2 +
        this.stagingNode.data.height / 2 +
        this.containerMargin.top +
        this.archiveNode.data.height +
        this.nodeSpacing.vertical;
      this.stagingNode.move(x, y);
    }

    if (this.archiveNode) {
      const x =
        -this.data.width / 2 +
        this.archiveNode.data.width / 2 +
        this.containerMargin.left +
        this.archiveNode.data.width / 2 +
        this.nodeSpacing.horizontal;
      const y = -this.data.height / 2 + this.archiveNode.data.height / 2 + this.containerMargin.top;
      this.archiveNode.move(x, y);
    }

    if (this.transformNode) {
      const x =
        -this.data.width / 2 +
        this.transformNode.data.width / 2 +
        this.containerMargin.left +
        this.stagingNode.data.width +
        this.nodeSpacing.horizontal;
      const y =
        -this.data.height / 2 +
        this.transformNode.data.height / 2 +
        this.containerMargin.top +
        this.archiveNode.data.height +
        this.nodeSpacing.vertical;
      this.transformNode.move(x, y);
    }
  }

  async layout3() {
    if (this.stagingNode) {
      // first resize the staging node to fit the height of the other two nodes
      const width = this.stagingNode.data.width;
      var height = this.archiveNode.data.height ;
      if (this.transformNode) {
        height += this.transformNode.data.height + this.nodeSpacing.vertical;
      }
      this.stagingNode.resize({ width: width, height: height });

      // then position the staging node based on the new size
      const x = -this.data.width / 2 + this.stagingNode.data.width / 2 + this.containerMargin.left;
      const y = -this.data.height / 2 + this.stagingNode.data.height / 2 + this.containerMargin.top;
      this.stagingNode.move(x, y);
    }

    if (this.archiveNode) {
      const x =
        -this.data.width / 2 +
        this.archiveNode.data.width / 2 +
        this.containerMargin.left +
        this.stagingNode.data.width +
        this.nodeSpacing.horizontal;
      const y = -this.data.height / 2 + this.archiveNode.data.height / 2 + this.containerMargin.top;
      this.archiveNode.move(x, y);
    }

    if (this.transformNode) {
      const x =
        -this.data.width / 2 +
        this.transformNode.data.width / 2 +
        this.containerMargin.left +
        this.stagingNode.data.width +
        this.nodeSpacing.horizontal;
      const y =
        -this.data.height / 2 +
        this.transformNode.data.height / 2 +
        this.containerMargin.top +
        this.archiveNode.data.height +
        this.nodeSpacing.vertical;
      this.transformNode.move(x, y);
    }
  }
}
