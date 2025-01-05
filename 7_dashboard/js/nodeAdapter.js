// import BaseNode from "./nodeBase.js";
import BaseContainerNode from "./nodeBaseContainer.js";
import RectangularNode from "./nodeRect.js";
import { createInternalEdge } from "./edge.js";

const DisplayMode = Object.freeze({
  FULL: 'full',
  ROLE: 'role'  
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
    if (!nodeData.layout.displayMode) nodeData.layout.displayMode = DisplayMode.FULL;
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
      if (nodeData.layout.displayMode == DisplayMode.ROLE)
        nodeData.width = 80 + 8 + 8;
      else
        nodeData.width = 150 + 8 + 8;
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
    console.log(
      "        nodeAdapter - initChildren - Create Children for Adapter:",
      this.data.label,
      this.data.children,
      this.container
    );

    super.initChildren();

    if (!this.data.children || this.data.children.length === 0) {
      this.data.children = [];
    }

    if ( this.archiveNode == null )
    {
      this.archiveNode = this.childNodes.find((child) => child.data.role === "archive");
      if ( this.archiveNode == null )
        this.archiveNode = this.childNodes.find((child) => child.data.label.toLowerCase().includes("archive".toLowerCase()));
      if ( this.archiveNode == null )
        this.archiveNode = this.childNodes.find((child) => child.data.label.toLowerCase().includes("STG_ARCHIVE".toLowerCase()));      
    }
    if ( this.archiveNode == null )
    {
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
      this.archiveNode = this.initChildNode(archiveChild, this.archiveNode);
    }

    if ( this.stagingNode == null )
    {
      this.stagingNode = this.childNodes.find((child) => child.data.role === "staging");
      if ( this.stagingNode == null )
        this.stagingNode = this.childNodes.find((child) => child.data.label.toLowerCase().includes("staging".toLowerCase()));
    }
    if ( this.stagingNode == null )
    {
      // render "staging" node
      let stagingChild = this.data.children.find((child) => child.role === "staging");
      if (
        !stagingChild &&
        (this.data.layout.mode == AdapterMode.STAGING_ARCHIVE ||
          this.data.layout.mode == AdapterMode.STAGING_TRANSFORM ||
          this.data.layout.mode == AdapterMode.FULL)
      ) {
        stagingChild = {
          id: `stg_${this.data.id}`,
          label: `Staging ${this.data.label}`,
          role: "staging",
          type: "node",
        };
        this.data.children.push(stagingChild);
      }
      this.stagingNode = this.initChildNode(stagingChild, this.stagingNode);
    }

    if ( this.transformNode == null )
    {
      this.transformNode = this.childNodes.find((child) => child.data.role === "transform");
      if ( this.transformNode == null )
        this.transformNode = this.childNodes.find((child) => child.data.label.toLowerCase().includes("transform".toLowerCase()));
    }
    if ( this.transformNode == null )
    {
      // render "transform" node
      let transformChild = this.data.children.find((child) => child.role === "transform");
      if (
        !transformChild &&
        (this.data.layout.mode == AdapterMode.STAGING_TRANSFORM || this.data.layout.mode == AdapterMode.FULL)
      ) {
        transformChild = {
          id: `trn_${this.data.id}`,
          label: `Transform ${this.data.label}`,
          role: "transform",
          type: "node",
        };
        this.data.children.push(transformChild);
      }
      this.transformNode = this.initChildNode(transformChild, this.transformNode);
    }

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
    console.log("        nodeAdapter - *************** END ****** Rendering Children for Adapter:", this.data.label);
    this.suspenseDisplayChange = false;
    this.handleDisplayChange();
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
    console.log(
      `        nodeAdapter - updateChildren - Layout=${this.data.layout.arrangement} for Adapter:`,
      this.id,
      this.data.layout
    );
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
      case 4:
        this.updateLayout4();
        break;
      case 5:
        this.updateLayout5();
        break;
    }
  }

   updateLayout1() {
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
      const factor = 5/16;
      const width =
      this.archiveNode.data.width +
      this.stagingNode.data.width * factor+
      this.nodeSpacing.horizontal;

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

   updateLayout2() {
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

   updateLayout3() {
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

   updateLayout4() {
    let otherNode = this.archiveNode;
    if (this.data.layout.mode === AdapterMode.STAGING_TRANSFORM) {
      otherNode = this.transformNode;
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

    if (onlyNode) {
      const x = -this.data.width / 2 + onlyNode.data.width / 2 + this.containerMargin.left;
      const y = -this.data.height / 2 + onlyNode.data.height / 2 + this.containerMargin.top;
      onlyNode.move(x, y);
    }
  }
}
