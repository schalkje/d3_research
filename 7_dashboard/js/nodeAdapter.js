// import BaseNode from "./nodeBase.js";
import BaseContainerNode from "./nodeBaseContainer.js";
import RectangularNode from "./nodeRect.js";
import { createInternalEdge } from "./edge.js";

const DisplayMode = Object.freeze({
  FULL: "full",
  ROLE: "role",
});

const AdapterMode = Object.freeze({
  MANUAL: "manual",
  FULL: "full",
  ARCHIVE_ONLY: "archive-only",
  STAGING_ARCHIVE: "staging-archive",
  STAGING_TRANSFORM: "staging-transform",
});

export default class AdapterNode extends BaseContainerNode {
  constructor(nodeData, parentElement, createNode, settings, parentNode = null) {
    if (!nodeData.width) nodeData.width = 334;
    if (!nodeData.height) nodeData.height = 74;
    if (!nodeData.layout) nodeData.layout = {};
    if (!nodeData.layout.displayMode) nodeData.layout.displayMode = DisplayMode.ROLE;
    if (nodeData.layout.displayMode == DisplayMode.ROLE) {
      nodeData.width = 80 + 80 + 20 + 8 + 8;
    }
    if (!nodeData.layout.mode) nodeData.layout.mode = AdapterMode.FULL; // manual, full, archive-only, staging-archive
    if (nodeData.layout.mode == AdapterMode.STAGING_ARCHIVE || nodeData.layout.mode == AdapterMode.STAGING_TRANSFORM) {
      nodeData.layout.arrangement = 4;
      nodeData.height = 44;
    }
    if (nodeData.layout.mode == AdapterMode.ARCHIVE_ONLY) {
      nodeData.layout.arrangement = 5;
      nodeData.height = 44;
      if (nodeData.layout.displayMode == DisplayMode.ROLE) nodeData.width = 80 + 8 + 8;
      else nodeData.width = 150 + 8 + 8;
    }
    if (!nodeData.layout.arrangement) nodeData.layout.arrangement = 1; // 1,2,3

    super(nodeData, parentElement, createNode, settings, parentNode);


    this.stagingNode = null;
    this.transformNode = null;
    this.archiveNode = null;
    this.nodeSpacing = { horizontal: 20, vertical: 10 };
  }

  get nestedCorrection_y() {
    return this.y;
  }

  initChildren() {
    this.suspenseDisplayChange = true;
    // console.log(
    //   "        nodeAdapter - initChildren - Create Children for Adapter:",
    //   this.data.label,
    //   this.data.children,
    //   this.container
    // );

    super.initChildren();

    if (!this.data.children || this.data.children.length === 0) {
      this.data.children = [];
    }

    this.archiveNode = this.initializeChildNode("archive", ["archive", "stg_archive", "arc_"]);
    this.stagingNode = this.initializeChildNode("staging", ["staging", "stg_"]);
    this.transformNode = this.initializeChildNode("transform", ["transform", "tfm_"]);

    if (this.data.layout.mode == AdapterMode.STAGING_TRANSFORM || this.data.layout.mode == AdapterMode.FULL)
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
    if (this.data.layout.mode == AdapterMode.STAGING_ARCHIVE || this.data.layout.mode == AdapterMode.FULL)
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

    this.initEdges();

    // this.updateChildren();
    // this.updateEdges();
    this.resize(this.data.expandedSize, true);
    this.update();
    // console.log("        nodeAdapter - *************** END ****** Rendering Children for Adapter:", this.data.label);
    this.suspenseDisplayChange = false;
    this.handleDisplayChange();
  }

  initializeChildNode(role, labels) {
      let node = this.childNodes.find((child) => child.data.category != null && child.data.category.toLowerCase() === role.toLowerCase());
    if (!node) {
      // console.log("        nodeAdapter - initializeChildNode - Role:", role, labels);
      node = this.childNodes.find((child) => labels.some((label) => child.data.label.toLowerCase().includes(label)));
    }
    if (!node) {
      let childData = this.data.children.find((child) => child.category === role);
      if (!childData && this.shouldCreateChildNode(role)) {
        childData = {
          id: `${role}_${this.data.id}`,
          label: `${role.charAt(0).toUpperCase() + role.slice(1)} ${this.data.label}`,
          role: role,
          type: "Node",
        };
        this.data.children.push(childData);
      }
      node = this.initChildNode(childData, node);
    }
    else 
    {
      if (this.data.layout.displayMode == DisplayMode.ROLE) {
        // console.log("        nodeAdapter - initializeChildNode - Found Node:", node.data.label, node.data.role);
        node.data.role = role;
        node.data.width = 80;
        // console.log("                                            Replaced role:", node.data.role);
        node.redrawText(node.data.role, node.data.width);
      }
  }

    return node;
  }

  shouldCreateChildNode(role) {
    const mode = this.data.layout.mode;
    return (
      (role === "archive" &&
        (mode === AdapterMode.ARCHIVE_ONLY || mode === AdapterMode.STAGING_ARCHIVE || mode === AdapterMode.FULL)) ||
      (role === "staging" &&
        (mode === AdapterMode.STAGING_ARCHIVE ||
          mode === AdapterMode.STAGING_TRANSFORM ||
          mode === AdapterMode.FULL)) ||
      (role === "transform" && (mode === AdapterMode.STAGING_TRANSFORM || mode === AdapterMode.FULL))
    );
  }

  initChildNode(childData, childNode) {
    if (childData) {
      if (childNode == null) {
        const copyChild = JSON.parse(JSON.stringify(childData));
        if (this.data.layout.displayMode == DisplayMode.ROLE) {
          copyChild.label = copyChild.role;
          copyChild.width = 80;
        }
        childNode = new RectangularNode(copyChild, this.container, this.settings, this);
        this.childNodes.push(childNode);
      }

      childNode.init(this.container);
    }
    return childNode;
  }

  updateChildren() {
    // console.log(
    //   `        nodeAdapter - updateChildren - Layout=${this.data.layout.arrangement} for Adapter:`,
    //   this.id,
    //   this.data.layout
    // );
    switch (this.data.layout.arrangement) {
      case 1:
        this.updateLayout1_full_archive();
        break;
      case 2:
        this.updateLayout2_full_tranform();
        break;
      case 3:
        this.updateLayout3_full_staging();
        break;
      case 4:
        this.updateLayout4_line();
        break;
      case 5:
        this.updateLayout5();
        break;
    }
  }

  updateLayout1_full_archive() {
    if (this.stagingNode && this.archiveNode){
      this.data.width = Math.max(
        this.data.width,
        this.stagingNode.data.width + this.archiveNode.data.width + this.nodeSpacing.horizontal + this.containerMargin.left + this.containerMargin.right
      )
    }

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
      // console.log("        nodeAdapter - updateLayout1 - ArchiveNode:", x, y, this.archiveNode.data.width, this.archiveNode.data.height);
      this.archiveNode.move(x, y);
    }

    if (this.transformNode) {
      // first resize the transform node to fit the width of the other two nodes

      // width = archive.width +
      const factor = 5 / 16;
      const width = this.archiveNode.data.width + this.stagingNode.data.width * factor + this.nodeSpacing.horizontal;

      const height = this.transformNode.data.height;
      this.transformNode.resize({ width: width, height: height });

      const x = width / 2 - this.stagingNode.data.width * factor - this.nodeSpacing.horizontal / 2;

      const y =
        -this.data.height / 2 +
        this.transformNode.data.height / 2 +
        this.containerMargin.top +
        this.archiveNode.data.height +
        this.nodeSpacing.vertical;
      this.transformNode.move(x, y);
    }
  }

  updateLayout2_full_tranform() {
    if (this.stagingNode && this.transformNode){
      this.data.width = Math.max(
        this.data.width,
        this.stagingNode.data.width + this.transformNode.data.width + this.nodeSpacing.horizontal + this.containerMargin.left + this.containerMargin.right
      )
    }

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

  updateLayout3_full_staging() {
    if (this.stagingNode && this.transformNode&& this.archiveNode){
      this.data.width = Math.max(
        this.data.width,
        this.stagingNode.data.width + Math.max(this.transformNode.data.width,this.archiveNode.data.width) + this.nodeSpacing.horizontal + this.containerMargin.left + this.containerMargin.right
      )
    }

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

  updateLayout4_line() {
    let otherNode = this.archiveNode;
    if (this.data.layout.mode === AdapterMode.STAGING_TRANSFORM) {
      otherNode = this.transformNode;
    }

    if (this.stagingNode && otherNode){
      this.data.width = Math.max(
        this.data.width,
        this.stagingNode.data.width + otherNode.data.width + this.nodeSpacing.horizontal + this.containerMargin.left + this.containerMargin.right
      )
    }

    // console.log("        nodeAdapter - updateLayout4 - OtherNode:", otherNode);

    if (this.stagingNode) {
      const x = -this.data.width / 2 + this.stagingNode.data.width / 2 + this.containerMargin.left;
      const y = -this.data.height / 2 + this.stagingNode.data.height / 2 + this.containerMargin.top;
      this.stagingNode.move(x, y);
    }

    if (otherNode) {
      const x =
        -this.data.width / 2 +
        otherNode.data.width / 2 +
        this.containerMargin.left +
        this.stagingNode.data.width +
        this.nodeSpacing.horizontal;
      const y = -this.data.height / 2 + otherNode.data.height / 2 + this.containerMargin.top;

      otherNode.move(x, y);
    }
  }

  updateLayout5() {
    let onlyNode = this.archiveNode;

    if (onlyNode){
      this.data.width = Math.max(
        this.data.width,
        onlyNode.data.width + this.containerMargin.left + this.containerMargin.right
      )

      const x = -this.data.width / 2 + onlyNode.data.width / 2 + this.containerMargin.left;
      const y = -this.data.height / 2 + onlyNode.data.height / 2 + this.containerMargin.top;
      onlyNode.move(x, y);
    }
  }
}
