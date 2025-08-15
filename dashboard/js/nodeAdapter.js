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
      // Adopt node spacing from container settings if provided
      this.nodeSpacing = {
        horizontal: (this.settings?.nodeSpacing?.horizontal ?? 20),
        vertical: (this.settings?.nodeSpacing?.vertical ?? 10)
      };
      
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
    
    // Validate and normalize arrangement
    const validArrangements = [1, 2, 3, 4, 5];
    if (nodeData.layout.arrangement === undefined || nodeData.layout.arrangement === null) {
      nodeData.layout.arrangement = 1;
    } else {
      const arr = nodeData.layout.arrangement;
      if (typeof arr !== 'number' || !Number.isInteger(arr) || !validArrangements.includes(arr)) {
        console.error(`AdapterNode: invalid layout.arrangement value: "${arr}". Expected number in [1..5]. Defaulting to 1.`);
        nodeData.layout.arrangement = 1;
      }
    }
    
    // Ensure children array exists and pre-populate with child data
    if (!nodeData.children) nodeData.children = [];
    
    // Pre-create child data based on adapter mode so initChildren gets called
    if (nodeData.children.length === 0) {
      const childrenToCreate = AdapterNode.getRequiredChildrenForMode(nodeData.layout.mode);
      const isRoleMode = nodeData.layout.displayMode === DisplayMode.ROLE;
      
      childrenToCreate.forEach(role => {
        const childData = {
          id: `${role}_${nodeData.id}`,
          label: isRoleMode ? role : `${role.charAt(0).toUpperCase() + role.slice(1)} ${nodeData.label}`,
          role: role,
          category: role,
          type: "node", // rectangular node type
          width: isRoleMode ? 80 : 150,
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
    // Defer to BaseContainerNode's zone-aware implementation to avoid double offsets
    return super.nestedCorrection_y;
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
    
    // Normalize labels and sizes for role display mode even when children were pre-created by super
    if (this.data.layout.displayMode === DisplayMode.ROLE) {
      [this.stagingNode, this.archiveNode, this.transformNode].forEach((child) => {
        if (!child) return;
        child.data.width = 80;
        const roleText = child.data.role || child.data.category || child.data.label;
        if (typeof child.redrawText === 'function') {
          child.redrawText(roleText, child.data.width);
        } else {
          child.data.label = roleText;
        }
      });
    }

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
    
    // When collapsed, do not run child layout; resize to collapsed min
    if (this.collapsed) {
      const headerZone = this.zoneManager?.headerZone;
      const headerHeight = headerZone ? headerZone.getHeaderHeight() : 10;
      const headerSize = headerZone ? headerZone.getSize() : { width: this.data.width, height: headerHeight };
      const collapsedWidth = Math.max(this.minimumSize.width, headerSize.width, this.data.width);
      const collapsedHeight = Math.max(this.minimumSize.height, headerHeight);
      this.resize({ width: collapsedWidth, height: collapsedHeight });
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
  }

  // New layout algorithms that work with the zone system
  layoutAlgorithm1_full_archive(childNodes, coordinateSystem) {
    const stagingNode = childNodes.find(node => node.data.role === 'staging');
    const archiveNode = childNodes.find(node => node.data.role === 'archive');
    const transformNode = childNodes.find(node => node.data.role === 'transform');
    
    console.log('Layout algorithm 1 (archive-focused) - found nodes:', {
      staging: !!stagingNode,
      archive: !!archiveNode,
      transform: !!transformNode,
      coordinateSystem
    });
    
    if (stagingNode && archiveNode && transformNode) {
      // First standardize transform node size
      transformNode.resize({ width: 150, height: 44 });
      
      // Calculate archive width as: transform width + horizontal spacing + (1/3) * staging width
      const horizontalSpacing = this.nodeSpacing.horizontal; // 20px
      const requiredArchiveWidth = transformNode.data.width + horizontalSpacing + (1/3) * stagingNode.data.width;
      
      // Resize archive node with calculated width
      archiveNode.resize({ width: requiredArchiveWidth, height: 44 });
      
      // Calculate required dimensions based on layout constraints
      // Total height = staging height + vertical spacing + archive height
      const verticalSpacing = this.nodeSpacing.vertical; // 10px
      const totalContentHeight = stagingNode.data.height + verticalSpacing + archiveNode.data.height;
      
      // Calculate required content width including all nodes and spacing
      const contentWidth = Math.max(
        stagingNode.data.width,
        archiveNode.data.width,
        stagingNode.data.width + horizontalSpacing + transformNode.data.width
      );
      
      // Center the entire layout horizontally within the coordinate system
      const layoutCenterX = 0; // Center horizontally within coordinate system
      
      // Calculate Y positioning based on the required content height
      // We want: archive at top, staging/transform at bottom
      
      // Archive: position at top (negative Y)
      const archiveCenterY = -totalContentHeight / 2 + archiveNode.data.height / 2;
      
      // Staging and Transform: position at bottom (positive Y)  
      const stagingCenterY = totalContentHeight / 2 - stagingNode.data.height / 2;
      const transformCenterY = stagingCenterY; // Same Y as staging
      
      console.log('Y positioning calculation:', {
        totalContentHeight,
        verticalSpacing,
        archiveCenterY,
        stagingCenterY,
        transformCenterY,
        expectedVerticalGap: stagingCenterY - archiveCenterY
      });
      
      // Staging positioning: Bottom left, positioned to center the overall layout
      const stagingCenterX = layoutCenterX - (contentWidth / 2) + (stagingNode.data.width / 2);
      
      // Archive positioning: Top row, respecting layout constraints
      // Archive left edge starts at 2/3 staging width from staging left
      const stagingLeftEdge = stagingCenterX - stagingNode.data.width / 2;
      const expectedArchiveLeftEdge = stagingLeftEdge + (2/3) * stagingNode.data.width;
      const archiveCenterX = expectedArchiveLeftEdge + archiveNode.data.width / 2;
      
      // Transform positioning: Bottom right, in line with staging, with horizontal spacing
      const transformCenterX = stagingCenterX + stagingNode.data.width / 2 + horizontalSpacing + transformNode.data.width / 2;
      
      // Verify right edge alignment constraint  
      const stagingRightEdge = stagingCenterX + stagingNode.data.width / 2;
      const actualArchiveRightEdge = archiveCenterX + archiveNode.data.width / 2;
      const rightEdgeAlignment = Math.abs(actualArchiveRightEdge - stagingRightEdge);
      
      // Apply positioning
      stagingNode.move(stagingCenterX, stagingCenterY);
      archiveNode.move(archiveCenterX, archiveCenterY);
      transformNode.move(transformCenterX, transformCenterY);
      
      // Trigger container resize for proper fitting
      this.resizeArrangementContainer(stagingNode, archiveNode, transformNode);
      
      console.log('Positioning complete (arrangement 1 - archive-focused):', {
        staging: { x: stagingCenterX, y: stagingCenterY, leftEdge: stagingCenterX - stagingNode.data.width/2, rightEdge: stagingCenterX + stagingNode.data.width/2 },
        archive: { x: archiveCenterX, y: archiveCenterY, leftEdge: archiveCenterX - archiveNode.data.width/2, rightEdge: archiveCenterX + archiveNode.data.width/2 },
        transform: { x: transformCenterX, y: transformCenterY, leftEdge: transformCenterX - transformNode.data.width/2, rightEdge: transformCenterX + transformNode.data.width/2 },
        constraints: {
          expectedArchiveLeftEdge,
          actualArchiveLeftEdge: archiveCenterX - archiveNode.data.width / 2,
          archiveLeftConstraintMet: Math.abs((archiveCenterX - archiveNode.data.width / 2) - expectedArchiveLeftEdge) < 5,
          rightEdgeAlignment,
          archiveRightConstraintMet: rightEdgeAlignment < 5,
          verticalGap: stagingCenterY - archiveCenterY,
          horizontalSpacing: (transformCenterX - transformNode.data.width/2) - (stagingCenterX + stagingNode.data.width/2)
        }
      });
    }
  }

  // Method to resize container for three-node arrangements (1, 2, 3)
  resizeArrangementContainer(stagingNode, archiveNode, transformNode) {
    if (!this.zoneManager || this._isResizing) return;
    
    const marginZone = this.zoneManager.marginZone;
    const headerZone = this.zoneManager.headerZone;
    const headerHeight = headerZone ? headerZone.getHeaderHeight() : 10;
    
    if (marginZone) {
      const margins = marginZone.getMargins();
      
      // Calculate bounding box of all nodes
      const allNodes = [stagingNode, archiveNode, transformNode];
      let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
      
      allNodes.forEach(node => {
        const left = node.x - node.data.width / 2;
        const right = node.x + node.data.width / 2;
        const top = node.y - node.data.height / 2;
        const bottom = node.y + node.data.height / 2;
        
        minX = Math.min(minX, left);
        minY = Math.min(minY, top);
        maxX = Math.max(maxX, right);
        maxY = Math.max(maxY, bottom);
      });
      
      const contentWidth = maxX - minX;
      const contentHeight = maxY - minY;
      
      const newSize = {
        width: contentWidth + margins.left + margins.right,
        height: headerHeight + margins.top + contentHeight + margins.bottom
      };
      
      console.log('Arrangement container resize:', {
        contentBounds: { minX, minY, maxX, maxY, contentWidth, contentHeight },
        margins,
        headerHeight,
        newSize
      });
      
      this._isResizing = true;
      this.resize(newSize);
      this._isResizing = false;
      
      // Also resize the innerContainer zone to properly contain all children
      const innerContainerZone = this.zoneManager.innerContainerZone;
      if (innerContainerZone) {
        // Calculate the bounding box of positioned children to size innerContainer around them
        const allNodes = [stagingNode, archiveNode, transformNode];
        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
        
        allNodes.forEach(node => {
          const left = node.x - node.data.width / 2;
          const right = node.x + node.data.width / 2;
          const top = node.y - node.data.height / 2;
          const bottom = node.y + node.data.height / 2;
          
          minX = Math.min(minX, left);
          minY = Math.min(minY, top);
          maxX = Math.max(maxX, right);
          maxY = Math.max(maxY, bottom);
        });
        
        // Add padding around the children for visual comfort
        const padding = 10;
        const innerContainerSize = {
          width: (maxX - minX) + padding * 2,
          height: (maxY - minY) + padding * 2
        };
        
        console.log('InnerContainer sizing around children:', {
          childBounds: { minX, minY, maxX, maxY },
          innerContainerSize,
          padding
        });
        
        // Resize the innerContainer zone to contain the positioned children
        innerContainerZone.resize(innerContainerSize.width, innerContainerSize.height);
        
        // Update the coordinate system after resizing
        innerContainerZone.updateCoordinateSystem();
      }
    }
  }

  layoutAlgorithm2_full_transform(childNodes, coordinateSystem) {
    const stagingNode = childNodes.find(node => node.data.role === 'staging');
    const archiveNode = childNodes.find(node => node.data.role === 'archive');
    const transformNode = childNodes.find(node => node.data.role === 'transform');
    
    if (stagingNode && transformNode && archiveNode) {
      const horizontalSpacing = this.nodeSpacing.horizontal; // 20
      const verticalSpacing = this.nodeSpacing.vertical; // 10

      // Compute column layout widths
      const totalWidth = stagingNode.data.width + horizontalSpacing + transformNode.data.width;

      // Center horizontally in inner zone (origin at 0,0)
      const stagingCenterX = -totalWidth / 2 + stagingNode.data.width / 2;
      const transformCenterX = stagingCenterX + stagingNode.data.width / 2 + horizontalSpacing + transformNode.data.width / 2;
      const archiveCenterX = stagingCenterX; // same column as staging

      // Vertical stacking for archive over staging (centered around 0)
      const columnHeight = archiveNode.data.height + verticalSpacing + stagingNode.data.height;
      const archiveCenterY = -columnHeight / 2 + archiveNode.data.height / 2;
      const stagingCenterY = columnHeight / 2 - stagingNode.data.height / 2;
      const transformCenterY = stagingCenterY; // align with staging

      archiveNode.move(archiveCenterX, archiveCenterY);
      stagingNode.move(stagingCenterX, stagingCenterY);
      transformNode.move(transformCenterX, transformCenterY);

      // Fit container to children
      this.resizeArrangementContainer(stagingNode, archiveNode, transformNode);
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
      
      // Ensure sizes
      archiveNode.resize({ width: 150, height: 44 });
      transformNode.resize({ width: 150, height: 44 });
      const verticalSpacing = this.nodeSpacing.vertical; // 10
      const horizontalSpacing = this.nodeSpacing.horizontal; // 20
      
      // Staging is tall: height = archive + spacing + transform
      const stagingHeight = archiveNode.data.height + verticalSpacing + transformNode.data.height;
      stagingNode.resize({ width: stagingNode.data.width, height: stagingHeight });
      
      // Horizontal: staging on left, archive/transform on right; center horizontally around 0
      const rightColumnWidth = Math.max(archiveNode.data.width, transformNode.data.width);
      const totalWidth = stagingNode.data.width + horizontalSpacing + rightColumnWidth;
      const stagingCenterX = -totalWidth / 2 + stagingNode.data.width / 2;
      const rightColumnCenterX = stagingCenterX + stagingNode.data.width / 2 + horizontalSpacing + rightColumnWidth / 2;

      // Vertical: center staging at 0; archive at top of staging; transform at bottom of staging
      const stagingCenterY = 0;
      const archiveCenterY = -stagingHeight / 2 + archiveNode.data.height / 2;
      const transformCenterY = stagingHeight / 2 - transformNode.data.height / 2;

      // Apply
      stagingNode.move(stagingCenterX, stagingCenterY);
      archiveNode.move(rightColumnCenterX, archiveCenterY);
      transformNode.move(rightColumnCenterX, transformCenterY);

      // Resize to fit
      this.resizeArrangementContainer(stagingNode, archiveNode, transformNode);
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
      mode: this.data.layout.mode,
      coordinateSystem
    });
    
    if (stagingNode && otherNode) {
      // Center the two nodes horizontally within the zone coordinate system
      // Zone coordinate system has origin at (0,0) and size represents available space
      const totalWidth = stagingNode.data.width + this.nodeSpacing.horizontal + otherNode.data.width;
      const y = 0; // center vertically in zone coordinate system
      
      // Center the layout horizontally
      const startX = -totalWidth / 2;
      const stagingX = startX + stagingNode.data.width / 2;
      const otherX = stagingX + stagingNode.data.width / 2 + this.nodeSpacing.horizontal + otherNode.data.width / 2;
      
      stagingNode.move(stagingX, y);
      otherNode.move(otherX, y);
      
      console.log('Positioning complete (horizontal line, centered):', {
        staging: { x: stagingX, y },
        other: { x: otherX, y },
        totalWidth,
        coordinateSystemSize: coordinateSystem?.size
      });
      
      // Resize container to fit both nodes properly (like archive-only mode)
      this.resizeTwoNodeContainer(stagingNode, otherNode);
    }
  }

  layoutAlgorithm5(childNodes, coordinateSystem) {
    const archiveNode = childNodes.find(node => node.data.role === 'archive');
    
    console.log('Layout algorithm 5 - found nodes:', {
      archive: !!archiveNode,
      coordinateSystem
    });
    
    if (archiveNode) {
      // Center the archive node within the innerContainer zone
      // Zone coordinate system has origin at (0,0) and size represents available space
      const x = 0; // Center horizontally
      const y = 0; // Center vertically in zone coordinate system
      
      archiveNode.move(x, y);
      
      console.log('Positioning complete (archive-only, centered):', {
        archive: { x, y },
        coordinateSystemSize: coordinateSystem?.size
      });
      
      // Resize container to fit archive node properly (like lane/column nodes do)
      this.resizeArchiveOnlyContainer(archiveNode);
    }
  }

  // Method to resize container for two-node horizontal layout (staging-archive/staging-transform)
  resizeTwoNodeContainer(stagingNode, otherNode) {
    if (!this.zoneManager || this._isResizing) return;
    
    const marginZone = this.zoneManager.marginZone;
    const headerZone = this.zoneManager.headerZone;
    const headerHeight = headerZone ? headerZone.getHeaderHeight() : 10;
    
    if (marginZone) {
      const margins = marginZone.getMargins();
      
      // Calculate required size based on both nodes + spacing
      const contentWidth = stagingNode.data.width + this.nodeSpacing.horizontal + otherNode.data.width;
      const contentHeight = Math.max(stagingNode.data.height, otherNode.data.height);
      
      const newSize = {
        width: contentWidth + margins.left + margins.right,
        height: headerHeight + margins.top + contentHeight + margins.bottom
      };
      
      console.log('Two-node container resize calculation:', {
        stagingNode: { width: stagingNode.data.width, height: stagingNode.data.height },
        otherNode: { width: otherNode.data.width, height: otherNode.data.height },
        spacing: this.nodeSpacing.horizontal,
        margins,
        headerHeight,
        contentSize: { width: contentWidth, height: contentHeight },
        newSize,
        currentSize: { width: this.data.width, height: this.data.height }
      });
      
      // Resize if the calculated size is different
      if (newSize.width !== this.data.width || newSize.height !== this.data.height) {
        this._isResizing = true;
        try {
          this.resize(newSize);
          // Force zones to update their coordinate systems after resizing
          if (this.zoneManager) {
            this.zoneManager.zones.forEach(zone => {
              if (zone.updateCoordinateSystem) {
                zone.updateCoordinateSystem();
              }
            });
          }
          // Notify parent nodes that this node's size has changed
          this.handleDisplayChange();
        } finally {
          this._isResizing = false;
        }
      }
    }
  }

  // Method to resize container for archive-only mode (similar to lane/column nodes)
  resizeArchiveOnlyContainer(archiveNode) {
    if (!this.zoneManager || this._isResizing) return;
    
    const marginZone = this.zoneManager.marginZone;
    const headerZone = this.zoneManager.headerZone;
    const headerHeight = headerZone ? headerZone.getHeaderHeight() : 10;
    
    if (marginZone) {
      const margins = marginZone.getMargins();
      
      // Calculate required size based on archive node content
      const contentWidth = archiveNode.data.width;
      const contentHeight = archiveNode.data.height;
      
      const newSize = {
        width: contentWidth + margins.left + margins.right,
        height: headerHeight + margins.top + contentHeight + margins.bottom
      };
      
      console.log('Archive-only container resize calculation:', {
        archiveNode: { width: archiveNode.data.width, height: archiveNode.data.height },
        margins,
        headerHeight,
        newSize,
        currentSize: { width: this.data.width, height: this.data.height }
      });
      
      // Resize if the calculated size is different
      if (newSize.width !== this.data.width || newSize.height !== this.data.height) {
        this._isResizing = true;
        try {
          this.resize(newSize);
          // Force zones to update their coordinate systems after resizing
          if (this.zoneManager) {
            this.zoneManager.zones.forEach(zone => {
              if (zone.updateCoordinateSystem) {
                zone.updateCoordinateSystem();
              }
            });
          }
          // Notify parent nodes that this node's size has changed
          this.handleDisplayChange();
        } finally {
          this._isResizing = false;
        }
      }
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
