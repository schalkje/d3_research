import BaseContainerNode from "./nodeBaseContainer.js";
import RectangularNode from "./nodeRect.js";
import { createInternalEdge } from "./edge.js";
import { getComputedDimensions } from "./utils.js";

const roleWidth = 80;

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

const MartMode = Object.freeze({
  MANUAL: 'manual', 
  AUTO: 'auto',
});


export default class MartNode extends BaseContainerNode {
  static initializeNodeDataStatic(nodeData) {
    if (!nodeData.width) nodeData.width = 334;
    if (!nodeData.height) nodeData.height = 44;
    if (!nodeData.layout) nodeData.layout = {};
    if (!nodeData.layout.displayMode) nodeData.layout.displayMode = DisplayMode.ROLE;
    if (!nodeData.layout.orientation) nodeData.layout.orientation = Orientation.HORIZONTAL;
    if (!nodeData.layout.mode) nodeData.layout.mode = MartMode.AUTO; // manual, auto

    if (nodeData.layout.displayMode === DisplayMode.ROLE) {
      nodeData.width = roleWidth + roleWidth + 20 + 8 + 8;
      nodeData.height = 44;
    }

    // Ensure children exist and pre-create for AUTO mode
    if (!nodeData.children) nodeData.children = [];
    const isAuto = nodeData.layout.mode === MartMode.AUTO;
    const ensureChild = (role) => {
      let child = nodeData.children.find((c) => c.role === role || c.category === role);
      if (!child && isAuto) {
        const isRoleMode = nodeData.layout.displayMode === DisplayMode.ROLE;
        child = {
          id: `${role}_${nodeData.id}`,
          label: isRoleMode ? role : `${role.charAt(0).toUpperCase() + role.slice(1)} ${nodeData.label}`,
          role: role,
          category: role,
          type: "node",
          width: isRoleMode ? roleWidth : 150,
          height: 44,
        };
        nodeData.children.push(child);
      }
    };
    ensureChild('load');
    ensureChild('report');

    return nodeData;
  }

  constructor(nodeData, parentElement, createNode, settings, parentNode = null) {
    nodeData = MartNode.initializeNodeDataStatic(nodeData);

    super(nodeData, parentElement, createNode, settings, parentNode);

    this.loadNode = null;
    this.reportNode = null;
    this.nodeSpacing = {
      horizontal: (this.settings?.nodeSpacing?.horizontal ?? 20),
      vertical: (this.settings?.nodeSpacing?.vertical ?? 10)
    };
  }

  get nestedCorrection_y() {
    return this.y;
  }


  initChildren() {
    this.suspenseDisplayChange = true;
    // console.log("    nodeMart - initChildren - Create Children for Mart:", this.data.label, this.data.children);

    super.initChildren();

    if (!this.data.children || this.data.children.length === 0) {
      this.data.children = [];
    }

    this.loadNode = this.childNodes.find((c) => c?.data?.role === 'load') || this.initializeChildNode("load", ["load"]);
    this.reportNode = this.childNodes.find((c) => c?.data?.role === 'report') || this.initializeChildNode("report", ["report","rprt"]);

    createInternalEdge(
      {
        source: this.loadNode.data.id,
        target: this.reportNode.data.id,
        isActive: true,
        type: "SSIS",
        state: "Ready",
      },
      this.loadNode,
      this.reportNode,
      this.settings
    );

    this.initEdges();

    this.data.expandedSize = {
      width:
        this.loadNode.data.width +
        this.nodeSpacing.horizontal +
        this.reportNode.data.width +
        this.containerMargin.left +
        this.containerMargin.right,
      height: this.containerMargin.top + this.containerMargin.bottom + 18,  //JS: why fixed 18
    };

    this.resize(this.data.expandedSize, true);
    this.update();
    this.cascadeUpdate();

    this.suspenseDisplayChange = false;
    this.handleDisplayChange();
  }

  initializeChildNode(role, labels) {
    let node = this.childNodes.find((child) => child.data.category != null && child.data.category.toLowerCase() === role.toLowerCase());
    if (!node) {
      node = this.childNodes.find((child) => labels.some(label => child.data.label.toLowerCase().includes(label.toLowerCase()+'.')));
    }
    if (!node) {
      node = this.childNodes.find((child) => labels.some(label => child.data.label.toLowerCase().includes(label.toLowerCase())));
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
        node.data.width = roleWidth;
        // console.log("                                            Replaced role:", node.data.role);
        node.redrawText(node.data.role, node.data.width);
      }

    }
    return node;
  }

  shouldCreateChildNode(role) {
    const mode = this.data.layout.mode;
    return mode === MartMode.AUTO;
  }

  initChildNode(childData, childNode) {
    if (!childData) return null;
    // Prefer inner container zone; lazily ensure it, otherwise fallback to node element
    let parentElement = this.zoneManager?.innerContainerZone?.getChildContainer();
    if (!parentElement && this.zoneManager?.ensureInnerContainerZone) {
      parentElement = this.zoneManager.ensureInnerContainerZone()?.getChildContainer();
    }
    parentElement = parentElement || this.element;
    if (childNode == null) {
      const copyChild = JSON.parse(JSON.stringify(childData));
      if (this.data.layout.displayMode === DisplayMode.ROLE) {
        copyChild.label = copyChild.role;
        copyChild.width = roleWidth;
      }
      childNode = new RectangularNode(copyChild, parentElement, this.settings, this);
      this.childNodes.push(childNode);
      if (this.zoneManager?.innerContainerZone) {
        this.zoneManager.innerContainerZone.addChild(childNode);
      }
      childNode.init(parentElement);
    } else {
      childNode.init(parentElement);
    }
    return childNode;
  }

  updateChildren() {
    // When collapsed, size to header minimum and skip zone-dependent layout
    if (this.collapsed) {
      const headerZone = this.zoneManager?.headerZone;
      const headerHeight = headerZone ? headerZone.getHeaderHeight() : 10;
      const headerMinWidth = (headerZone && typeof headerZone.getMinimumWidth === 'function')
        ? headerZone.getMinimumWidth()
        : (headerZone ? headerZone.getSize().width : this.data.width);
      const collapsedWidth = Math.max(this.minimumSize.width, headerMinWidth);
      const collapsedHeight = Math.max(this.minimumSize.height, headerHeight);
      this.resize({ width: collapsedWidth, height: collapsedHeight });
      return;
    }

    // Ensure inner container exists for expanded layout
    let innerContainerZone = this.zoneManager?.innerContainerZone;
    if (!innerContainerZone && this.zoneManager?.ensureInnerContainerZone) {
      innerContainerZone = this.zoneManager.ensureInnerContainerZone();
    }
    if (!innerContainerZone) return;

    switch (this.data.layout.displayMode) {
      case DisplayMode.FULL:
        this.updateFullZone();
        break;
      case DisplayMode.ROLE:
        this.updateRoleZone();
        break;
      default:
        console.warn(`Unknown displayMode "${this.data.layout.displayMode}" using ${DisplayMode.FULL}`);
        this.updateFullZone();
        break;
    }
  }

   updateFull() {
    // Account for the container transform that's applied in BaseContainerNode.updateChildren()
    // The container is offset by: (containerMargin.left - containerMargin.right, containerMargin.top - containerMargin.bottom)
    const containerOffsetX = this.containerMargin.left - this.containerMargin.right;
    const containerOffsetY = this.containerMargin.top - this.containerMargin.bottom;
    
    if (this.loadNode) {
      const x = -this.data.width / 2 + this.loadNode.data.width / 2 + this.containerMargin.left - containerOffsetX;
      const y = -this.data.height / 2 + this.loadNode.data.height / 2 + this.containerMargin.top - containerOffsetY;
      this.loadNode.move(x, y);
    }

    if (this.reportNode) {
      const x =
        -this.data.width / 2 +
        this.reportNode.data.width / 2 +
        this.containerMargin.left +
        this.loadNode.data.width +
        this.nodeSpacing.horizontal - containerOffsetX;
      const y = -this.data.height / 2 + this.reportNode.data.height / 2 + this.containerMargin.top - containerOffsetY;
      this.reportNode.move(x, y);
    }    
  }

   updateRole() {
    // JS: TODO: use code as label; need rerendering of the children
    // console.log("    Layout Code for Adapter:", this.id);
    
    // Account for the container transform that's applied in BaseContainerNode.updateChildren()
    // The container is offset by: (containerMargin.left - containerMargin.right, containerMargin.top - containerMargin.bottom)
    const containerOffsetX = this.containerMargin.left - this.containerMargin.right;
    const containerOffsetY = this.containerMargin.top - this.containerMargin.bottom;
    
    if (this.loadNode) {
      const x = -this.data.width / 2 + this.loadNode.data.width / 2 + this.containerMargin.left - containerOffsetX;
      const y = -this.data.height / 2 + this.loadNode.data.height / 2 + this.containerMargin.top - containerOffsetY;
      this.loadNode.move(x, y);
    }

    if (this.reportNode) {
      const x =
        -this.data.width / 2 +
        this.reportNode.data.width / 2 +
        this.containerMargin.left +
        this.loadNode.data.width +
        this.nodeSpacing.horizontal - containerOffsetX;
      const y = -this.data.height / 2 + this.reportNode.data.height / 2 + this.containerMargin.top - containerOffsetY;
      this.reportNode.move(x, y);
    }

  }

  // Zone-based layout methods
  updateFullZone() {
    const innerContainerZone = this.zoneManager.innerContainerZone;
    
    innerContainerZone.setLayoutAlgorithm((childNodes, coordinateSystem) => {
      const loadNode = childNodes.find(node => node.data.role === 'load');
      const reportNode = childNodes.find(node => node.data.role === 'report');
      
      if (loadNode && reportNode) {
        const orientation = (this.data.layout?.orientation || 'horizontal').toLowerCase();
        switch (orientation) {
          case 'vertical':
          case 'rotate90': {
            const totalHeight = loadNode.data.height + this.nodeSpacing.vertical + reportNode.data.height;
            const loadY = -totalHeight / 2 + loadNode.data.height / 2;
            const reportY = totalHeight / 2 - reportNode.data.height / 2;
            loadNode.move(0, loadY);
            reportNode.move(0, reportY);
            this.resizeTwoNodeContainer(loadNode, reportNode, 'vertical');
            break;
          }
          case 'rotate270': {
            const totalHeight = loadNode.data.height + this.nodeSpacing.vertical + reportNode.data.height;
            const reportY = -totalHeight / 2 + reportNode.data.height / 2;
            const loadY = totalHeight / 2 - loadNode.data.height / 2;
            loadNode.move(0, loadY);
            reportNode.move(0, reportY);
            this.resizeTwoNodeContainer(loadNode, reportNode, 'vertical');
            break;
          }
          case 'horizontal_line':
          case 'horizontal':
          default: {
            const totalWidth = loadNode.data.width + this.nodeSpacing.horizontal + reportNode.data.width;
            const loadX = -totalWidth / 2 + loadNode.data.width / 2;
            const reportX = totalWidth / 2 - reportNode.data.width / 2;
            loadNode.move(loadX, 0);
            reportNode.move(reportX, 0);
            this.resizeTwoNodeContainer(loadNode, reportNode, 'horizontal');
            break;
          }
        }
      }
    });
    
    innerContainerZone.updateChildPositions();
  }

  updateRoleZone() {
    const innerContainerZone = this.zoneManager.innerContainerZone;
    
    innerContainerZone.setLayoutAlgorithm((childNodes, coordinateSystem) => {
      const loadNode = childNodes.find(node => node.data.role === 'load');
      const reportNode = childNodes.find(node => node.data.role === 'report');
      
      if (loadNode && reportNode) {
        const orientation = (this.data.layout?.orientation || 'horizontal').toLowerCase();
        loadNode.data.width = roleWidth;
        reportNode.data.width = roleWidth;
        switch (orientation) {
          case 'vertical':
          case 'rotate90': {
            const totalHeight = loadNode.data.height + this.nodeSpacing.vertical + reportNode.data.height;
            const loadY = -totalHeight / 2 + loadNode.data.height / 2;
            const reportY = totalHeight / 2 - reportNode.data.height / 2;
            loadNode.move(0, loadY);
            reportNode.move(0, reportY);
            this.resizeTwoNodeContainer(loadNode, reportNode, 'vertical');
            break;
          }
          case 'rotate270': {
            const totalHeight = loadNode.data.height + this.nodeSpacing.vertical + reportNode.data.height;
            const reportY = -totalHeight / 2 + reportNode.data.height / 2;
            const loadY = totalHeight / 2 - loadNode.data.height / 2;
            loadNode.move(0, loadY);
            reportNode.move(0, reportY);
            this.resizeTwoNodeContainer(loadNode, reportNode, 'vertical');
            break;
          }
          case 'horizontal_line':
          case 'horizontal':
          default: {
            const totalWidth = loadNode.data.width + this.nodeSpacing.horizontal + reportNode.data.width;
            const loadX = -totalWidth / 2 + loadNode.data.width / 2;
            const reportX = totalWidth / 2 - reportNode.data.width / 2;
            loadNode.move(loadX, 0);
            reportNode.move(reportX, 0);
            this.resizeTwoNodeContainer(loadNode, reportNode, 'horizontal');
            break;
          }
        }
      }
    });
    
    innerContainerZone.updateChildPositions();
  }

  // Resize container to fit two children according to zone-system sizing
  resizeTwoNodeContainer(firstNode, secondNode, direction = 'horizontal') {
    if (!this.zoneManager || this._isResizing) return;
    const marginZone = this.zoneManager.marginZone;
    const headerZone = this.zoneManager.headerZone;
    const headerHeight = headerZone ? headerZone.getHeaderHeight() : 10;
    if (!marginZone) return;
    const margins = marginZone.getMargins();

    let contentWidth, contentHeight;
    if (direction === 'vertical') {
      contentWidth = Math.max(firstNode.data.width, secondNode.data.width);
      contentHeight = firstNode.data.height + this.nodeSpacing.vertical + secondNode.data.height;
    } else {
      contentWidth = firstNode.data.width + this.nodeSpacing.horizontal + secondNode.data.width;
      contentHeight = Math.max(firstNode.data.height, secondNode.data.height);
    }

    const newSize = {
      width: contentWidth + margins.left + margins.right,
      height: headerHeight + margins.top + contentHeight + margins.bottom,
    };

    if (newSize.width !== this.data.width || newSize.height !== this.data.height) {
      this._isResizing = true;
      try {
        this.resize(newSize);
        if (this.zoneManager) this.zoneManager.resize(newSize.width, newSize.height);
        this.handleDisplayChange();
      } finally {
        this._isResizing = false;
      }
    }
  }

}
