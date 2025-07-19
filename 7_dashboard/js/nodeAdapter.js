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
    super(nodeData, parentElement, createNode, settings, parentNode);
    
    this.initializeNodeData(nodeData);

    this.stagingNode = null;
    this.transformNode = null;
    this.archiveNode = null;
    this.nodeSpacing = { horizontal: 20, vertical: 10 };
  }

  initializeNodeData(nodeData) {
    if (!nodeData.width) nodeData.width = 334;
    if (!nodeData.height) nodeData.height = 74;
    if (!nodeData.layout) nodeData.layout = {};
    if (!nodeData.layout.displayMode) nodeData.layout.displayMode = DisplayMode.ROLE;
    
    if (nodeData.layout.displayMode === DisplayMode.ROLE) {
      nodeData.width = 176; // 80 + 80 + 20 + 8 + 8
    }
    
    if (!nodeData.layout.mode) nodeData.layout.mode = AdapterMode.FULL;
    
    if (nodeData.layout.mode === AdapterMode.STAGING_ARCHIVE || 
        nodeData.layout.mode === AdapterMode.STAGING_TRANSFORM) {
      nodeData.layout.arrangement = 4;
      nodeData.height = 44;
    }
    
    if (nodeData.layout.mode === AdapterMode.ARCHIVE_ONLY) {
      nodeData.layout.arrangement = 5;
      nodeData.height = 44;
      if (nodeData.layout.displayMode === DisplayMode.ROLE) {
        nodeData.width = 96; // 80 + 8 + 8
      } else {
        nodeData.width = 166; // 150 + 8 + 8
      }
    }
    
    if (!nodeData.layout.arrangement) nodeData.layout.arrangement = 1;
  }

  get nestedCorrection_y() {
    return this.y;
  }

  initChildren() {
    this.suspenseDisplayChange = true;
    super.initChildren();

    if (!this.data.children || this.data.children.length === 0) {
      this.data.children = [];
    }

    this.archiveNode = this.initializeChildNode("archive", ["archive", "stg_archive", "arc_"]);
    this.stagingNode = this.initializeChildNode("staging", ["staging", "stg_"]);
    this.transformNode = this.initializeChildNode("transform", ["transform", "tfm_"]);

    this.createInternalEdges();
    this.initEdges();
    
    // Trigger child positioning after all children are initialized
    if (this.zoneManager?.innerContainerZone) {
      this.zoneManager.innerContainerZone.forceUpdateChildPositions();
    }
    
    this.updateChildren();
    this.resize(this.data.expandedSize, true);
    this.update();
    
    this.suspenseDisplayChange = false;
    this.handleDisplayChange();
  }

  createInternalEdges() {
    if (this.data.layout.mode === AdapterMode.STAGING_TRANSFORM || 
        this.data.layout.mode === AdapterMode.FULL) {
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
    }
    
    if (this.data.layout.mode === AdapterMode.STAGING_ARCHIVE || 
        this.data.layout.mode === AdapterMode.FULL) {
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
  }

  initializeChildNode(role, labels) {
    let node = this.childNodes.find(
      (child) => child.data.category != null && 
      child.data.category.toLowerCase() === role.toLowerCase()
    );
    
    if (!node) {
      node = this.childNodes.find(
        (child) => labels.some((label) => child.data.label.toLowerCase().includes(label))
      );
    }
    
    if (!node) {
      let childData = this.data.children.find((child) => child.category === role);
      if (!childData && this.shouldCreateChildNode(role)) {
        childData = {
          id: `${role}_${this.data.id}`,
          label: `${role.charAt(0).toUpperCase() + role.slice(1)} ${this.data.label}`,
          role: role,
          type: "Node",
          width: 150,
          height: 44,
        };
        this.data.children.push(childData);
      }
      node = this.initChildNode(childData, node);
    } else {
      if (this.data.layout.displayMode === DisplayMode.ROLE) {
        node.data.role = role;
        node.data.width = 80;
        node.redrawText(node.data.role, node.data.width);
      }
    }

    return node;
  }

  shouldCreateChildNode(role) {
    const mode = this.data.layout.mode;
    return (
      (role === "archive" &&
        (mode === AdapterMode.ARCHIVE_ONLY || 
         mode === AdapterMode.STAGING_ARCHIVE || 
         mode === AdapterMode.FULL)) ||
      (role === "staging" &&
        (mode === AdapterMode.STAGING_ARCHIVE ||
         mode === AdapterMode.STAGING_TRANSFORM ||
         mode === AdapterMode.FULL)) ||
      (role === "transform" && 
       (mode === AdapterMode.STAGING_TRANSFORM || mode === AdapterMode.FULL))
    );
  }

  initChildNode(childData, childNode) {
    if (childData) {
      // Always use the inner container zone's child container as the parent element
      const parentElement = this.zoneManager?.innerContainerZone?.getChildContainer();
      if (childNode == null) {
        const copyChild = JSON.parse(JSON.stringify(childData));
        if (this.data.layout.displayMode === DisplayMode.ROLE) {
          copyChild.label = copyChild.role;
          copyChild.width = 80;
        }
        childNode = new RectangularNode(copyChild, parentElement, this.settings, this);
        this.childNodes.push(childNode);
        // Add child to zone system
        if (this.zoneManager?.innerContainerZone) {
          this.zoneManager.innerContainerZone.addChild(childNode);
        }
      }
      // Always re-init with the correct parent element
      childNode.init(parentElement);
    }
    return childNode;
  }

  updateChildren() {
    // Always use zone system for child positioning
    if (!this.zoneManager?.innerContainerZone) {
      console.warn('Zone system not available for adapter node:', this.id);
      return;
    }
    
    // Set layout algorithm based on arrangement
    const innerContainerZone = this.zoneManager.innerContainerZone;
    
    switch (this.data.layout.arrangement) {
      case 1:
        innerContainerZone.setLayoutAlgorithm((childNodes, coordinateSystem) => {
          this.layoutAlgorithm1_full_archive(childNodes, coordinateSystem);
        });
        break;
      case 2:
        innerContainerZone.setLayoutAlgorithm((childNodes, coordinateSystem) => {
          this.layoutAlgorithm2_full_transform(childNodes, coordinateSystem);
        });
        break;
      case 3:
        innerContainerZone.setLayoutAlgorithm((childNodes, coordinateSystem) => {
          this.layoutAlgorithm3_full_staging(childNodes, coordinateSystem);
        });
        break;
      case 4:
        innerContainerZone.setLayoutAlgorithm((childNodes, coordinateSystem) => {
          this.layoutAlgorithm4_line(childNodes, coordinateSystem);
        });
        break;
      case 5:
        innerContainerZone.setLayoutAlgorithm((childNodes, coordinateSystem) => {
          this.layoutAlgorithm5(childNodes, coordinateSystem);
        });
        break;
    }
    
    // Update child positions using zone system
    innerContainerZone.updateChildPositions();
    
    // Resize container to fit children
    this.resizeToFitChildren();
  }

  // New layout algorithms that work with the zone system
  layoutAlgorithm1_full_archive(childNodes, coordinateSystem) {
    const stagingNode = childNodes.find(node => node.data.role === 'staging');
    const archiveNode = childNodes.find(node => node.data.role === 'archive');
    const transformNode = childNodes.find(node => node.data.role === 'transform');
    
    if (stagingNode && archiveNode) {
      // Position staging node on the left
      stagingNode.move(0, 0);
      
      // Position archive node on the right
      archiveNode.move(stagingNode.data.width + this.nodeSpacing.horizontal, 0);
      
      // Position transform node below staging and archive
      if (transformNode) {
        const factor = 5 / 16;
        const width = archiveNode.data.width + stagingNode.data.width * factor + this.nodeSpacing.horizontal;
        const height = transformNode.data.height;
        transformNode.resize({ width: width, height: height });
        
        const x = width / 2 - stagingNode.data.width * factor - this.nodeSpacing.horizontal / 2;
        const y = Math.max(stagingNode.data.height, archiveNode.data.height) + this.nodeSpacing.vertical;
        transformNode.move(x, y);
      }
    }
  }

  layoutAlgorithm2_full_transform(childNodes, coordinateSystem) {
    const stagingNode = childNodes.find(node => node.data.role === 'staging');
    const archiveNode = childNodes.find(node => node.data.role === 'archive');
    const transformNode = childNodes.find(node => node.data.role === 'transform');
    
    if (stagingNode && transformNode) {
      // Position archive node on the left
      if (archiveNode) {
        archiveNode.move(0, 0);
      }
      
      // Position staging node above transform
      stagingNode.move(0, archiveNode ? archiveNode.data.height + this.nodeSpacing.vertical : 0);
      
      // Position transform node to the right of staging
      transformNode.move(stagingNode.data.width + this.nodeSpacing.horizontal, 
                        archiveNode ? archiveNode.data.height + this.nodeSpacing.vertical : 0);
    }
  }

  layoutAlgorithm3_full_staging(childNodes, coordinateSystem) {
    const stagingNode = childNodes.find(node => node.data.role === 'staging');
    const archiveNode = childNodes.find(node => node.data.role === 'archive');
    const transformNode = childNodes.find(node => node.data.role === 'transform');
    
    if (stagingNode && transformNode && archiveNode) {
      // Resize staging node to accommodate archive and transform
      const width = stagingNode.data.width;
      let height = 44;
      if (archiveNode) {
        height = archiveNode.data.height;
      }
      if (transformNode) {
        height += transformNode.data.height + this.nodeSpacing.vertical;
      }
      stagingNode.resize({ width: width, height: height });
      
      // Position staging node on the left
      stagingNode.move(0, 0);
      
      // Position archive node to the right of staging
      archiveNode.move(stagingNode.data.width + this.nodeSpacing.horizontal, 0);
      
      // Position transform node to the right of staging, below archive
      transformNode.move(stagingNode.data.width + this.nodeSpacing.horizontal, 
                        archiveNode.data.height + this.nodeSpacing.vertical);
    }
  }

  layoutAlgorithm4_line(childNodes, coordinateSystem) {
    const stagingNode = childNodes.find(node => node.data.role === 'staging');
    const archiveNode = childNodes.find(node => node.data.role === 'archive');
    const transformNode = childNodes.find(node => node.data.role === 'transform');
    
    let otherNode = archiveNode;
    if (this.data.layout.mode === AdapterMode.STAGING_TRANSFORM) {
      otherNode = transformNode;
    }
    
    if (stagingNode && otherNode) {
      // Position staging node on the left
      stagingNode.move(0, 0);
      
      // Position other node to the right of staging
      otherNode.move(stagingNode.data.width + this.nodeSpacing.horizontal, 0);
    }
  }

  layoutAlgorithm5(childNodes, coordinateSystem) {
    const archiveNode = childNodes.find(node => node.data.role === 'archive');
    
    if (archiveNode) {
      // Position archive node in the center
      archiveNode.move(0, 0);
    }
  }

  // Method to resize container to fit children
  resizeToFitChildren() {
    if (!this.zoneManager?.innerContainerZone) return;
    
    const childNodes = this.zoneManager.innerContainerZone.getChildren();
    if (childNodes.length === 0) return;
    
    // Calculate bounding box of all children
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    
    childNodes.forEach(node => {
      const halfWidth = node.data.width / 2;
      const halfHeight = node.data.height / 2;
      
      minX = Math.min(minX, node.x - halfWidth);
      minY = Math.min(minY, node.y - halfHeight);
      maxX = Math.max(maxX, node.x + halfWidth);
      maxY = Math.max(maxY, node.y + halfHeight);
    });
    
    // Calculate required container size
    const contentWidth = maxX - minX + this.containerMargin.left + this.containerMargin.right;
    const contentHeight = maxY - minY + this.containerMargin.top + this.containerMargin.bottom;
    
    // Get header height
    const headerZone = this.zoneManager?.headerZone;
    const headerHeight = headerZone ? headerZone.getHeaderHeight() : 20;
    
    // Resize container to accommodate all children
    this.resize({
      width: Math.max(this.data.width, contentWidth),
      height: Math.max(this.data.height, contentHeight + headerHeight)
    });
  }
}
