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
  static getRequiredChildrenForMode(mode) {
    switch (mode) {
      case AdapterMode.FULL:
        return ["staging", "archive", "transform"];
      case AdapterMode.STAGING_ARCHIVE:
        return ["staging", "archive"];
      case AdapterMode.STAGING_TRANSFORM:
        return ["staging", "transform"];
      case AdapterMode.ARCHIVE_ONLY:
        return ["archive"];
      default:
        return ["staging", "archive", "transform"];
    }
  }
  constructor(nodeData, parentElement, createNode, settings, parentNode = null) {
    console.log("AdapterNode constructor called for:", nodeData.id, nodeData.label);
    
    try {
      // Initialize node data before calling super (static method)
      nodeData = AdapterNode.initializeNodeDataStatic(nodeData);
      
      super(nodeData, parentElement, createNode, settings, parentNode);

      this.stagingNode = null;
      this.transformNode = null;
      this.archiveNode = null;
      this.nodeSpacing = { horizontal: 20, vertical:10 };
      
      console.log("AdapterNode constructor completed for:", this.id, "mode:", this.data.layout.mode, "arrangement:", this.data.layout.arrangement);
    } catch (error) {
      console.error("AdapterNode constructor failed:", error);
      throw error;
    }
  }

  static initializeNodeDataStatic(nodeData) {
    console.log("Initializing adapter node data for:", nodeData.id);
    
    if (!nodeData.width) nodeData.width = 334;
    if (!nodeData.height) nodeData.height = 74;
    if (!nodeData.layout) nodeData.layout = {};
    if (!nodeData.layout.displayMode) nodeData.layout.displayMode = DisplayMode.FULL; // Changed from ROLE to FULL for better visibility
    
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
    
    // Ensure children array exists and pre-populate with child data
    if (!nodeData.children) nodeData.children = [];
    
    // Pre-create child data based on adapter mode so initChildren gets called
    if (nodeData.children.length === 0) {
      const childrenToCreate = AdapterNode.getRequiredChildrenForMode(nodeData.layout.mode);
      
      childrenToCreate.forEach(role => {
        const childData = {
          id: `${role}_${nodeData.id}`,
          label: `${role.charAt(0).toUpperCase() + role.slice(1)} ${nodeData.label}`,
          role: role,
          type: "Node",
          width: 150,
          height: 44,
        };
        nodeData.children.push(childData);
      });
    }
    
    console.log("Adapter node data initialized:", {
      id: nodeData.id,
      mode: nodeData.layout.mode,
      arrangement: nodeData.layout.arrangement,
      displayMode: nodeData.layout.displayMode,
      width: nodeData.width,
      height: nodeData.height,
      childrenCount: nodeData.children.length
    });
    
    return nodeData;
  }

  initializeNodeData(nodeData) {
    return AdapterNode.initializeNodeDataStatic(nodeData);
  }

  get nestedCorrection_y() {
    return this.y;
  }

  initChildren() {
    console.log("AdapterNode - initChildren called for:", this.id, this.data.label);
    this.suspenseDisplayChange = true;

    // Ensure children array exists
    if (!this.data.children || this.data.children.length === 0) {
      this.data.children = [];
      console.log("AdapterNode - initialized empty children array");
    }

    console.log("AdapterNode - calling super.initChildren to process pre-created child data...");
    
    // First call super.initChildren to let BaseContainerNode handle the child data we pre-created
    super.initChildren();
    
    // Now assign the created child nodes to our role-specific properties
    this.archiveNode = this.childNodes.find(child => child.data.role === "archive");
    this.stagingNode = this.childNodes.find(child => child.data.role === "staging");
    this.transformNode = this.childNodes.find(child => child.data.role === "transform");

    console.log("AdapterNode - child nodes assigned:", {
      staging: !!this.stagingNode,
      archive: !!this.archiveNode,
      transform: !!this.transformNode,
      totalChildren: this.childNodes.length,
      dataChildren: this.data.children.length
    });

    this.createInternalEdges();
    this.initEdges();
    
    // Trigger child positioning after all children are initialized
    if (this.zoneManager?.innerContainerZone) {
      console.log("AdapterNode - triggering child positioning");
      this.zoneManager.innerContainerZone.forceUpdateChildPositions();
    } else {
      console.warn("AdapterNode - zone system not available for positioning");
    }
    
    this.updateChildren();
    this.resize(this.data.expandedSize, true);
    this.update();
    
    this.suspenseDisplayChange = false;
    this.handleDisplayChange();
    
    console.log("AdapterNode - initChildren completed for:", this.id, "with", this.childNodes.length, "children");
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
    console.log(`Initializing child node for role: ${role}`);
    
    let node = this.childNodes.find(
      (child) => child.data.category != null && 
      child.data.category.toLowerCase() === role.toLowerCase()
    );
    
    if (!node) {
      node = this.childNodes.find(
        (child) => child.data.role === role ||
        labels.some((label) => child.data.label && child.data.label.toLowerCase().includes(label))
      );
    }
    
    if (!node) {
      let childData = this.data.children.find((child) => child.category === role || child.role === role);
      if (!childData && this.shouldCreateChildNode(role)) {
        console.log(`Creating child data for role: ${role}`);
        childData = {
          id: `${role}_${this.data.id}`,
          label: `${role.charAt(0).toUpperCase() + role.slice(1)} ${this.data.label}`,
          role: role,
          category: role,
          type: "node", // Use "node" type for rectangular nodes
          width: this.data.layout.displayMode === DisplayMode.ROLE ? 80 : 150,
          height: 44,
        };
        this.data.children.push(childData);
        console.log(`Added child data:`, childData);
      }
      
      if (childData) {
        node = this.initChildNode(childData, null);
        console.log(`Created node for role ${role}:`, node ? 'success' : 'failed');
      }
    } else {
      console.log(`Found existing node for role ${role}`);
      if (this.data.layout.displayMode === DisplayMode.ROLE) {
        node.data.role = role;
        node.data.width = 80;
        if (node.redrawText) {
          node.redrawText(node.data.role, node.data.width);
        }
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
      // Always use zone system for parent element
      const parentElement = this.zoneManager?.innerContainerZone?.getChildContainer();
      if (!parentElement) {
        console.error('Zone system not available for adapter node:', this.id);
        return null;
      }
      
      if (childNode == null) {
        const copyChild = JSON.parse(JSON.stringify(childData));
        if (this.data.layout.displayMode === DisplayMode.ROLE) {
          copyChild.label = copyChild.role;
          copyChild.width = 80;
        }
        childNode = new RectangularNode(copyChild, parentElement, this.settings, this);
        this.childNodes.push(childNode);
        // Add child to zone system
        this.zoneManager.innerContainerZone.addChild(childNode);
        
        // Initialize the child node immediately
        childNode.init(parentElement);
        console.log("Created and initialized child node:", copyChild.id, copyChild.label || copyChild.role);
      } else {
        // Re-init existing child node
        childNode.init(parentElement);
        console.log("Re-initialized existing child node:", childNode.id, childNode.data.label);
      }
    }
    return childNode;
  }

  updateChildren() {
    // Always use zone system for child positioning
    if (!this.zoneManager?.innerContainerZone) {
      console.error('Zone system not available for adapter node:', this.id);
      return;
    }
    
    console.log('Using zone system for adapter node positioning:', this.id);
    
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
  }

  // New layout algorithms that work with the zone system
  layoutAlgorithm1_full_archive(childNodes, coordinateSystem) {
    const stagingNode = childNodes.find(node => node.data.role === 'staging');
    const archiveNode = childNodes.find(node => node.data.role === 'archive');
    const transformNode = childNodes.find(node => node.data.role === 'transform');
    
    console.log('Layout algorithm 1 - found nodes:', {
      staging: !!stagingNode,
      archive: !!archiveNode,
      transform: !!transformNode,
      coordinateSystem
    });
    
    if (stagingNode && archiveNode) {
      // Use configurable margin from container margin settings
      const margin = this.containerMargin.top;
      
      // Calculate available width for positioning (zone coordinate system)
      const availableWidth = coordinateSystem?.size?.width || 318; // Default to expected container width
      
      // Calculate maximum position for archive to fit within container
      const maxArchiveX = availableWidth - margin - archiveNode.data.width;
      const stagingRightX = margin + stagingNode.data.width;
      const spacing = Math.max(5, maxArchiveX - stagingRightX);
      
      console.log('Layout algorithm 1 calculation:', {
        availableWidth,
        margin,
        stagingWidth: stagingNode.data.width,
        archiveWidth: archiveNode.data.width,
        maxArchiveX,
        stagingRightX,
        spacing,
        calculatedRightX: stagingRightX + spacing
      });
      
      // Position staging node with margin from left and top (zone coordinates start at 0,0)
      stagingNode.move(margin, margin);
      
      // Position archive node with calculated spacing
      const rightX = stagingRightX + spacing;
      archiveNode.move(rightX, margin);
      
      // Position transform node below staging and archive
      if (transformNode) {
        const factor = 5 / 16;
        const width = archiveNode.data.width + stagingNode.data.width * factor + spacing;
        const height = transformNode.data.height;
        transformNode.resize({ width: width, height: height });
        
        const x = margin; // Start from left margin
        const y = margin + Math.max(stagingNode.data.height, archiveNode.data.height) + this.nodeSpacing.vertical;
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
    console.log('layoutAlgorithm3_full_staging called with coordinateSystem:', coordinateSystem);
    
    const stagingNode = childNodes.find(node => node.data.role === 'staging');
    const archiveNode = childNodes.find(node => node.data.role === 'archive');
    const transformNode = childNodes.find(node => node.data.role === 'transform');
    
    console.log('Layout algorithm 3 - found nodes:', {
      staging: !!stagingNode,
      archive: !!archiveNode,
      transform: !!transformNode
    });
    
    if (stagingNode && transformNode && archiveNode) {
      console.log('Found all three nodes, positioning them...');
      
      // Archive and transform should have minimal height (44px) and same width as staging
      archiveNode.resize({ width: 150, height: 44 });
      transformNode.resize({ width: 150, height: 44 });
      
      // Staging height should be archive height + transform height + vertical spacing
      const stagingHeight = archiveNode.data.height + transformNode.data.height + this.nodeSpacing.vertical;
      stagingNode.resize({ width: stagingNode.data.width, height: stagingHeight });
      
      // Use configurable margin from container margin settings
      const margin = this.containerMargin.top;
      
      // Note: Container resizing is handled by resizeToFitChildren() after positioning
      
      // Calculate available width for positioning (zone coordinate system)
      const availableWidth = coordinateSystem?.size?.width || 318; // Default to expected container width
      
      // Calculate center positions for proper alignment
      // All nodes use center-based positioning, so we need to account for this
      
      // Staging: position so left edge aligns exactly with container left edge
      // Calculate position based on container coordinate system (no additional margin)
      const stagingCenterX = -availableWidth / 2 + stagingNode.data.width / 2;
      
      // Position staging node so it fits exactly within the available coordinate system space
      // The coordinate system already accounts for margins, coordinate origin is at (0,0)
      const availableHeight = coordinateSystem?.size?.height || 108;
      
      // When staging height equals available height, position so top edge is at y=0
      let stagingCenterY;
      if (stagingHeight >= availableHeight) {
        stagingCenterY = stagingHeight / 2; // Top edge at y=0, center at height/2
      } else {
        stagingCenterY = availableHeight / 2; // Center in available space
      }
      
      stagingNode.move(stagingCenterX, stagingCenterY);
      
      // Calculate positioning for archive and transform on the right side
      // Available width coordinate system: from -availableWidth/2 to +availableWidth/2
      // Archive and transform: position so right edge aligns exactly with container right edge
      const archiveCenterX = availableWidth / 2 - archiveNode.data.width / 2;
      
      console.log('Layout calculation:', {
        availableWidth,
        stagingCenterX,
        archiveCenterX,
        stagingLeftEdge: stagingCenterX - stagingNode.data.width / 2,
        containerLeftEdge: -availableWidth / 2,
        archiveRightEdge: archiveCenterX + archiveNode.data.width / 2,
        containerRightEdge: availableWidth / 2
      });
      
      // Archive: position so its TOP edge aligns with staging TOP edge
      // Archive top edge should be at: stagingCenterY - stagingHeight/2 
      // Archive center should be at: archiveTop + archiveHeight/2
      const archiveTop = stagingCenterY - stagingHeight / 2;
      const archiveCenterY = archiveTop + archiveNode.data.height / 2;
      
      // Transform: position so its BOTTOM edge aligns with staging BOTTOM edge  
      // Transform bottom edge should be at: stagingCenterY + stagingHeight/2
      // Transform center should be at: transformBottom - transformHeight/2
      const transformBottom = stagingCenterY + stagingHeight / 2;
      const transformCenterY = transformBottom - transformNode.data.height / 2;
      
      // Position archive and transform at calculated position
      // Both archive and transform should have the same X position (vertical alignment)
      
      // Position archive with aligned top edge
      archiveNode.move(archiveCenterX, archiveCenterY);
      
      // Position transform with aligned bottom edge  
      transformNode.move(archiveCenterX, transformCenterY);
      
              console.log('Positioning complete (arrangement 3):', {
          staging: { x: stagingNode.x, y: stagingNode.y, bottomEdge: stagingNode.y + stagingHeight / 2 },
          archive: { x: archiveNode.x, y: archiveNode.y },
          transform: { x: transformNode.x, y: transformNode.y, bottomEdge: transformNode.y + transformNode.data.height / 2 },
          margins: { top: margin, bottom: margin }
        });
        
        // Calculate required container size and resize if needed
        this.calculateAndResizeForArrangement3(stagingNode, archiveNode, transformNode);
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
    
    console.log('Layout algorithm 4 - found nodes:', {
      staging: !!stagingNode,
      other: !!otherNode,
      mode: this.data.layout.mode
    });
    
    if (stagingNode && otherNode) {
      const margin = this.containerMargin.top;
      
      // Position staging node with margin from left and top (zone coordinates start at 0,0)
      stagingNode.move(margin, margin);
      
      // Position other node to the right of staging
      otherNode.move(margin + stagingNode.data.width + this.nodeSpacing.horizontal, margin);
      
      console.log('Positioning complete:', {
        staging: { x: margin, y: margin },
        other: { x: margin + stagingNode.data.width + this.nodeSpacing.horizontal, y: margin }
      });
    }
  }

  layoutAlgorithm5(childNodes, coordinateSystem) {
    const archiveNode = childNodes.find(node => node.data.role === 'archive');
    
    console.log('Layout algorithm 5 - found nodes:', {
      archive: !!archiveNode
    });
    
    if (archiveNode) {
      const margin = this.containerMargin.top;
      
      // Position archive node with margin from left and top (zone coordinates start at 0,0)
      archiveNode.move(margin, margin);
      
      console.log('Positioning complete:', {
        archive: { x: margin, y: margin }
      });
    }
  }

  // Method to calculate and resize container for arrangement 3
  calculateAndResizeForArrangement3(stagingNode, archiveNode, transformNode) {
    if (!this._isResizing) {
      // Calculate the required size based on positioned children
      const childNodes = [stagingNode, archiveNode, transformNode];
      
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
      
      // Add margin to the bounding box
      const margin = this.containerMargin.top;
      const contentWidth = maxX - minX;
      const contentHeight = maxY - minY;
      
      // Get header height
      const headerZone = this.zoneManager?.headerZone;
      const headerHeight = headerZone ? headerZone.getHeaderHeight() : 20;
      
      // Get margins
      const marginZone = this.zoneManager?.marginZone;
      const margins = marginZone ? marginZone.getMargins() : { top: 8, bottom: 8, left: 8, right: 8 };
      
      const requiredSize = {
        width: Math.max(this.data.width, contentWidth + margins.left + margins.right),
        height: Math.max(this.data.height, headerHeight + margins.top + contentHeight + margins.bottom)
      };
      
      console.log('Arrangement 3 size calculation:', {
        childBounds: { minX, minY, maxX, maxY },
        contentSize: { width: contentWidth, height: contentHeight },
        headerHeight,
        margins,
        requiredSize,
        currentSize: { width: this.data.width, height: this.data.height }
      });
      
      // Resize if needed
      if (requiredSize.width !== this.data.width || requiredSize.height !== this.data.height) {
        this._isResizing = true;
        try {
          this.resize(requiredSize);
          // Force zones to update their coordinate systems after resizing
          if (this.zoneManager) {
            this.zoneManager.zones.forEach(zone => {
              if (zone.updateCoordinateSystem) {
                zone.updateCoordinateSystem();
              }
            });
          }
        } finally {
          this._isResizing = false;
        }
      }
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
    
    // Add margin to the bounding box
    const margin = this.containerMargin.top;
    minX -= margin;
    minY -= margin; 
    maxX += margin;
    maxY += margin;
    
    // Calculate required container size based on child bounding box
    const contentWidth = maxX - minX;
    const contentHeight = maxY - minY;
    
    // Get header height
    const headerZone = this.zoneManager?.headerZone;
    const headerHeight = headerZone ? headerZone.getHeaderHeight() : 20;
    
    // Get margin zone for proper sizing
    const marginZone = this.zoneManager?.marginZone;
    const margins = marginZone ? marginZone.getMargins() : { top: 8, bottom: 8, left: 8, right: 8 };
    
    const newSize = {
      width: Math.max(this.data.width, contentWidth + margins.left + margins.right),
      height: Math.max(this.data.height, headerHeight + margins.top + contentHeight + margins.bottom)
    };
    
    console.log('resizeToFitChildren calculation:', {
      childBounds: { minX, minY, maxX, maxY },
      contentSize: { width: contentWidth, height: contentHeight },
      headerHeight,
      margins,
      newSize,
      currentSize: { width: this.data.width, height: this.data.height }
    });
    
    // Resize container to accommodate all children
    if (newSize.width !== this.data.width || newSize.height !== this.data.height) {
      // Set flag to prevent infinite recursion
      this._isResizing = true;
      try {
        this.resize(newSize);
        // Force zones to update after resizing
        if (this.zoneManager) {
          this.zoneManager.resize(newSize.width, newSize.height);
        }
      } finally {
        this._isResizing = false;
      }
    }
  }
}
