// import BaseNode from "./nodeBase.js";
import BaseContainerNode from "./nodeBaseContainer.js";
import RectangularNode from "./nodeRect.js";
import { createInternalEdge } from "./edge.js";

const AdapterMode = Object.freeze({
  MANUAL: "manual",
  FULL: "full",
  ARCHIVE_ONLY: "archive-only",
  STAGING_ARCHIVE: "staging-archive",
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
    this.firstInit = true;
  }

  async initChildren() {
    this.suspenseDisplayChange = true;
    console.log("nodeAdapter - initChildren - Create Children for Adapter:", this.data.label, this.data.children);
    if (!this.data.children || this.data.children.length === 0) {
      this.data.children = [];
    }

    // render "archive" node
    let archiveChild = this.data.children.find((child) => child.role === "archive");
    if (
      !archiveChild &&
      (this.data.layout.mode === AdapterMode.ARCHIVE_ONLY ||
        this.data.layout.mode === AdapterMode.STAGING_ARCHIVE ||
        this.data.layout.mode === AdapterMode.FULL)
    ) {
      archiveChild = {
        id: `arc_${this.data.id}`,
        label: `Archive ${this.data.label}`,
        role: "archive",
        type: "node",
      };
      this.data.children.push(archiveChild);
    }
    if (archiveChild) {
      console.log("    Rendering Archive Node:", archiveChild, this);
      if (this.archiveNode == null) {
        this.archiveNode = new RectangularNode(archiveChild, this.container, this.settings, this);
        this.childNodes.push(this.archiveNode);
      }

      this.archiveNode.init();
    }

    // render "staging" node
    let stagingChild = this.data.children.find((child) => child.role === "staging");
    if (
      !stagingChild &&
      (this.data.layout.mode == AdapterMode.STAGING_ARCHIVE || this.data.layout.mode == AdapterMode.FULL)
    ) {
      stagingChild = {
        id: `stg_${this.data.id}`,
        label: `Staging ${this.data.label}`,
        role: "staging",
        type: "node",
      };
      this.data.children.push(stagingChild);
    }
    if (stagingChild) {
      console.log("    Rendering Staging Node:", stagingChild, this);
      if (this.stagingNode == null) {
        this.stagingNode = new RectangularNode(stagingChild, this.container, this.settings, this);
        this.childNodes.push(this.stagingNode);
      }

      this.stagingNode.init();
    }

    // render "transform" node
    let transformChild = this.data.children.find((child) => child.role === "transform");
    if (!transformChild && this.data.layout.mode == AdapterMode.FULL) {
      transformChild = {
        id: `trn_${this.data.id}`,
        label: `Transform ${this.data.label}`,
        role: "transform",
        type: "node",
      };
      this.data.children.push(transformChild);
    }
    if (transformChild) {
      console.log("    Rendering Transform Node:", transformChild, this);
      if (this.transformNode == null) {
        this.transformNode = new RectangularNode(transformChild, this.container, this.settings, this);
        this.childNodes.push(this.transformNode);
      }

      this.transformNode.init();
    }

    this.updateChildren;

    // JS: do not recreate edges if they are already existing
    if (this.firstInit) {
      createInternalEdge(
        {
          source: this.stagingNode,
          target: this.transformNode,
          isActive: true,
          type: "SSIS",
          state: "Ready",
        },
        this.stagingNode,
        this.transformNode,
        this.settings
      );
      createInternalEdge(
        {
          source: this.stagingNode,
          target: this.archiveNode,
          isActive: true,
          type: "SSIS",
          state: "Ready",
        },
        this.stagingNode,
        this.archiveNode,
        this.settings
      );
    }

    this.initEdges();

    this.update();

    console.log("*************** END ****** Rendering Children for Adapter:", this.data.label);
    this.suspenseDisplayChange = false;
    this.handleDisplayChange();
    this.firstInit = false;
  }

  updateChildren() {
    console.log(`    Layout ${this.data.layout.arrangement} for Adapter:`, this.id, this.data.layout);
    switch (this.data.layout.arrangement) {
      case 1:
        this.updateLayout1();
        break;
      case 2:
        this.updateLayout2();
        break;
      case 3:
        this.updateLayout3();
        break;
    }
  }

  async updateLayout1() {
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

  async updateLayout2() {
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

  async updateLayout3() {
    if (this.stagingNode) {
      // first resize the staging node to fit the height of the other two nodes
      const width = this.stagingNode.data.width;
      var height = this.archiveNode.data.height;
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
