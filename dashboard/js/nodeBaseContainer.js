import BaseNode, { NodeStatus } from "./nodeBase.js";
import { getComputedDimensions } from "./utils.js";
// ZoomButton is now handled by HeaderZone in the zone system
import { StatusManager } from "./statusManager.js";
import { GeometryManager } from "./geometryManager.js";
import { ConfigManager } from "./configManager.js";
import { ZoneManager } from "./zones/index.js";

export default class BaseContainerNode extends BaseNode {
  constructor(nodeData, parentElement, createNode, settings, parentNode = null) {
    nodeData.width ??= 0;
    nodeData.height ??= 0;
    nodeData.expandedSize ??= { width: nodeData.width, height: nodeData.height };
    // Ensure layout is an object, not a string
    if (typeof nodeData.layout === 'string') {
      nodeData.layout = { type: nodeData.layout };
    }
    nodeData.layout ??= {};
    nodeData.layout.minimumSize ??= { width: 0, height: 0 };
    nodeData.layout.minimumSize.width ??= 0;
    nodeData.layout.minimumSize.height ??= 0;
    nodeData.layout.minimumSize.useRootRatio ??= false;

    super(nodeData, parentElement, settings, parentNode);
    this.data.type ??= "container";

    this.isContainer = true;

    this.createNode = createNode;

    this.simulation = null;
    this.edgesContainer ??= null;
    // Initialize layout-related properties from settings with sensible defaults
    this.containerMargin = {
      ...ConfigManager.getDefaultContainerMargin(),
      ...(this.settings?.containerMargin || {})
    };
    this.nodeSpacing = {
      ...ConfigManager.getDefaultNodeSpacing(),
      ...(this.settings?.nodeSpacing || {})
    };
    this.childNodes = [];
    this.zoneManager = null;

    // child edges contain the edges that are between nodes where this container
    // is the first joined parent
    this.childEdges = [];
  }

  get nestedCorrection_y() {
    // Prefer zone-system derived offset when available (offset from container center to inner content origin)
    try {
      const innerZone = this.zoneManager?.innerContainerZone;
      const transform = innerZone?.coordinateSystem?.transform;
      if (transform && typeof transform === 'string') {
        const match = transform.match(/translate\(([^,]+),\s*([^)]+)\)/);
        if (match) return parseFloat(match[2]);
      }
    } catch {}

    // Legacy fallback (non-zone layout)
    return this.y - this.data.height / 2 + this.containerMargin.top;
  }

  get nestedCorrection_x() {
    // Prefer zone-system derived offset when available (offset from container center to inner content origin)
    try {
      const innerZone = this.zoneManager?.innerContainerZone;
      const transform = innerZone?.coordinateSystem?.transform;
      if (transform && typeof transform === 'string') {
        const match = transform.match(/translate\(([^,]+),\s*([^)]+)\)/);
        if (match) return parseFloat(match[1]);
      }
    } catch {}

    // Legacy fallback (non-zone layout)
    return this.x;
  }

  get collapsed() {
    return super.collapsed;
  }

  set collapsed(value) {
    // console.log("    BaseContainerNode - Setting collapsed", value, this.data.label);
    if (value === this._collapsed) return;
    super.collapsed = value;

    // Zoom button state is now handled by HeaderZone

    if (this.collapsed) {
      this.collapse();
      this.handleDisplayChange(this, false);
    } else {
      this.expand();
    }

    this.cascadeUpdate();
  }

  propagateVisibility(visible) {
    this.childNodes.forEach((childNode) => {
      childNode.visible = visible;
      
      // Only propagate to nested containers if they are not collapsed
      // Collapsed containers should become visible themselves, but their children should remain hidden
      if (childNode instanceof BaseContainerNode && !childNode.collapsed) {
        childNode.propagateVisibility(visible);
      }
    });
  }

  get visible() {
    return this._visible;
  }

  set visible(value) {
    if (value === this._visible) return;
    super.visible = value;
    // JS: todo - change visibility of the children
  }

  get status() {
    return super.status;
  }
  set status(value) {
    super.status = value;
  }

  determineStatusBasedOnChildren() {
    if (this.childNodes.length === 0) return;
    if (!this.settings.cascadeOnStatusChange) {
      return;
    }

    const containerStatus = StatusManager.calculateContainerStatus(this.childNodes, this.settings);
    this.status = containerStatus;
  }

  handleDisplayChange(node = this, propagate = true) {
    if (this.suspenseDisplayChange) {
      return;
    }
    
    if (this.onDisplayChange) {
      this.onDisplayChange();
    } else if (propagate && this.parentNode && typeof this.parentNode.handleDisplayChange === 'function') {
      this.parentNode.handleDisplayChange();
    }
  }

  resize(size, forced = false) {
    // console.log("    BaseContainerNode - resize", this.data.label, Math.round(size.width), Math.round(size.height));

    // make sure the size of the element doesn't go below minimum size
    size.width = Math.max(size.width, this.minimumSize.width);
    size.height = Math.max(size.height, this.minimumSize.height);

    super.resize(size, forced);
  }

  // resize the node based on a resize of the container and it's child
  resizeContainer(size, forced = false) {
    size.width += this.containerMargin.left + this.containerMargin.right;
    size.height += this.containerMargin.top + this.containerMargin.bottom;
    // console.log(
    //   `    BaseContainerNode - resizeContainer ${this.data.label}: ${Math.round(this.data.width)}x${Math.round(
    //     this.data.height
    //   )} --> ${Math.round(size.width)}x${Math.round(size.height)}`
    // );

    this.resize(size, forced);
  }

  expand() {
    // console.warn(
    //   `    BaseContainerNode - expand ${Math.round(this.data.width)}x${Math.round(this.data.height)} -> ${Math.round(
    //     this.data.expandedSize.width
    //   )}x${Math.round(this.data.expandedSize.height)}`,
    //   this.data.label
    // );

    // you can only expand a container if it's parent is already expanded
    // expand parent first when not expanded
    if (this.parentNode && this.parentNode.collapsed) {
      this.parentNode.collapsed = false;
    } else {
      // Recreate inner container zone DOM and re-attach child nodes to the DOM when expanding
      if (this.zoneManager) {
        // Lazily ensure the inner zone exists only when expanding
        const innerZone = this.zoneManager.ensureInnerContainerZone ? this.zoneManager.ensureInnerContainerZone() : this.zoneManager.innerContainerZone;
        
        // Force re-initialization of the inner container zone if its DOM was destroyed
        if (!innerZone.element || !innerZone.initialized) {
          innerZone.init();
          // Ensure freshly recreated zone has correct size from current node
          if (this.zoneManager) {
            this.zoneManager.resize(this.data.width, this.data.height);
          } else {
            innerZone.resize(this.data.width, this.data.height);
          }
          innerZone.update(); // Ensure coordinate system is updated
        }
        
        // Show zones first so the child container exists
        this.zoneManager.updateZoneVisibility();
        
        // CRITICAL: Restore the layout algorithm BEFORE reattaching children
        // This ensures the zone knows how to position children correctly
        if (!innerZone.layoutAlgorithm) {
          // If no layout algorithm exists (was lost during zone destruction), 
          // call the specific node type's layout method to restore it
          if (typeof this.layoutLane === 'function') {
            this.layoutLane();
          } else if (typeof this.layoutColumns === 'function') {
            this.layoutColumns();
          } else if (typeof this.updateChildren === 'function') {
            this.updateChildren();
          }
        }
        
        // CRITICAL: Update children BEFORE reattaching to ensure proper sizing
        // This ensures the container knows its proper dimensions before positioning children
        if (typeof this.updateChildren === 'function') {
          this.updateChildren();
        }
        
        // Ensure zones reflect current size and coordinate systems
        this.zoneManager.update();
        
        // Re-attach children and make them visible
        this.attachChildrenToDOM();
        
        // Now that children are attached and layout algorithm is restored, position them
        if (innerZone.layoutAlgorithm) {
          innerZone.updateChildPositions();
        }
        
        // Ensure the inner zone is properly updated after children are attached
        innerZone.update();
        innerZone.updateChildVisibility(true);

        // FINAL: Recompute container size from actual child content and resize
        if (!this.collapsed) {
          const headerHeight = this.zoneManager?.headerZone ? this.zoneManager.headerZone.getHeaderHeight() : 20;
          const margins = this.zoneManager?.marginZone ? this.zoneManager.marginZone.getMargins() : { top: 8, right: 8, bottom: 8, left: 8 };
          const contentSize = innerZone.calculateChildContentSize();
          const widthFromContent = contentSize.width + margins.left + margins.right;
          const newWidth = Math.max(this.data.width, this.minimumSize.width, widthFromContent);
          const newHeight = Math.max(this.minimumSize.height, headerHeight + margins.top + contentSize.height + margins.bottom);
          this.resize({ width: newWidth, height: newHeight }, true);
          // Ensure zones reflect final size
          if (this.zoneManager) this.zoneManager.resize(newWidth, newHeight);
          this.zoneManager.update();
          // And update child positions once more relative to final coordinate system
          innerZone.updateChildPositions();
          innerZone.update();
        }
      }

      // Show edges and ghostlines when expanding
      if (this.edgesContainer) {
        this.edgesContainer.style('display', null);
      }
      if (this.ghostContainer) {
        this.ghostContainer.style('display', null);
      }

      // Store current collapsed size before expanding  
      const collapsedSize = { width: this.data.width, height: this.data.height };

      // Recalculate container size based on current child content
      // This works for both:
      // 1. Containers that were expanded before (recalculates current content)
      // 2. Containers that started collapsed (calculates proper expanded size)
      // Note: We already called updateChildren above, so this is just for final sizing
      if (this.data.height > collapsedSize.height + 5 || this.data.width > collapsedSize.width + 5) {
        this.data.expandedSize = { width: this.data.width, height: this.data.height };
      }
      
      // Update parent container if this container's size changed
      if (this.parentNode) {
        this.parentNode.updateChildren();
      }
      
      this.initEdges();
    }
  }

  collapse() {
    // console.log("    BaseContainerNode - collapse", this.data.label);
    this.suspenseDisplayChange = true;
    // store the expanded size before collapsing
    if (this.data.height > this.minimumSize.height + 5 || this.data.width > this.minimumSize.width + 5)
      // Js: + 5, because of a strange bug, where the size differs slightly between renders, depending on the zoom level
      this.data.expandedSize = { height: this.data.height, width: this.data.width };

    // Detach child nodes and remove inner container/edges from the DOM
    if (this.zoneManager) {
      // Remove child DOM and child zone managers
      this.detachChildrenFromDOM();

      // Remove edges and ghostlines groups entirely
      if (this.edgesContainer) {
        this.edgesContainer.remove();
        this.edgesContainer = null;
      }
      if (this.ghostContainer) {
        this.ghostContainer.remove();
        this.ghostContainer = null;
      }

      // Destroy inner container zone DOM (g and rect)
      const innerZone = this.zoneManager.innerContainerZone;
      if (innerZone && typeof innerZone.destroy === 'function') {
        innerZone.destroy();
      }

      // Update zone visibility to hide inner container and margin zones
      this.zoneManager.updateZoneVisibility();
    } else {
      // Fallback to old behavior if zone system not available
      this.cleanContainer();
    }

    // Hide edges and ghostlines groups when collapsed
    if (this.edgesContainer) {
      this.edgesContainer.style('display', 'none');
    }
    if (this.ghostContainer) {
      this.ghostContainer.style('display', 'none');
    }

    // Update zones before sizing, so header metrics are current
    this.update();

    // Compute collapsed size based on header's intrinsic minimum (text + controls) and user minimums
    let headerMinWidth = 0;
    let headerHeight = this.minimumSize.height;
    if (this.zoneManager?.headerZone) {
      // Prefer precise header minimum width calculation when available
      if (typeof this.zoneManager.headerZone.getMinimumWidth === 'function') {
        headerMinWidth = this.zoneManager.headerZone.getMinimumWidth();
      } else {
        // Fallback to current header size width (may be larger than minimum)
        headerMinWidth = this.zoneManager.headerZone.getSize().width || 0;
      }
      // Use header's measured height if available
      headerHeight = this.zoneManager.headerZone.getHeaderHeight?.() ?? this.zoneManager.headerZone.getSize().height ?? headerHeight;
    }

    // Final collapsed dimensions
    const collapsedWidth = Math.max(headerMinWidth, this.minimumSize.width);
    const collapsedHeight = Math.max(headerHeight, this.minimumSize.height);

    // Apply collapsed size
    this.resize({ width: collapsedWidth, height: collapsedHeight }, true);

    if (this.parentNode) this.parentNode.update();
    this.suspenseDisplayChange = false;
  }

  getNode(nodeId) {
    // console.log("    nodeBaseContainer getNode:", this.id, nodeId, this.id == nodeId);
    // console.log("                              :", this.childNodes.length, this.childNodes);
    // console.log("                              :", this.data);
    // console.log("                              :", this.childNodes[0]);
    if (this.id == nodeId) {
      // console.log("    nodeBaseContainer getNode found:", this.id, nodeId);
      return this;
    }
    for (const childNode of this.childNodes) {
      // console.log("    nodeBaseContainer getNode check child:", this.id, childNode.id, nodeId);
      const foundNode = childNode.getNode(nodeId);
      if (foundNode) {
        return foundNode;
      }
    }
    return null;
  }

  getNodesByDatasetId(datasetId) {
    // console.log("    nodeBaseContainer getNodesByDatasetId:", this.id, datasetId);
    var nodes = [];
    if (this.data.datasetId == datasetId) {
      nodes.push(this);
    }
    if (this.childNodes) {
      for (const childNode of this.childNodes) {
        nodes.push(...childNode.getNodesByDatasetId(datasetId));
      }
    }
    return nodes;
  }

  positionContainer() {
    // When using the zone system, container positioning is handled by zones (center-based)
    if (this.zoneManager) {
      return;
    }
    // Legacy fallback (non-zone system)
    var containerDimensions = getComputedDimensions(this.element);
    var elementDimensions = getComputedDimensions(this.element);
    const containerX = 0;
    var containerY = elementDimensions.y - containerDimensions.y + this.containerMargin.top;
    this.element.attr("transform", `translate(${containerX}, ${containerY})`);
  }

  initEdges(propagate = false) {
    if (this.collapsed) return;
    // console.log("nodeBaseContainer - initEdges:", this.id, this.childEdges);
    if (this.childEdges.length > 0) {
      // create container for ghost lines first (so they appear behind edges)
      if (this.settings.showGhostlines)
      {
            if (this.ghostContainer)
              this.ghostContainer.selectAll("*").remove();
            else
              this.ghostContainer = this.element
                .append("g")
                .attr("class", (d) => `ghostlines`);
      }

      // create container for edges (after ghost lines, so edges appear on top)
      if (this.edgesContainer == null) 
      {
        this.edgesContainer = this.element.append("g").attr("class", (d) => `edges`);
      }
      else
      {
        // console.log("                   clean cont:", this.id, this.childEdges);
        this.edgesContainer.selectAll("*").remove();
      }

      this.childEdges.forEach((edge) => edge.init());
    }

    if (propagate) {
      this.childNodes.forEach((childNode) => {
        if (childNode instanceof BaseContainerNode) childNode.initEdges(propagate);
      });
    }
  }

  updateEdges() {
    // console.log("    BaseContainerNode - updateEdges", this.id, this.childEdges.length);
    if (!this.visible) return;
    if (this.collapsed) return;

    if (this.childEdges.length > 0) {
      this.childEdges.forEach((edge) => edge.update());
    }
  }

  // function to return all the nodes in the graph
  getAllNodes(onlySelected = false, onlyEndNodes = false) {
    const nodes = [];
    if ((!onlySelected || this.selected) && !onlyEndNodes) nodes.push(this);

    if (this.childNodes) {
      this.childNodes.forEach((childNode) => {
        nodes.push(...childNode.getAllNodes(onlySelected, onlyEndNodes));
      });
    }
    return nodes;
  }

  getAllEdges(onlySelected = false, allEdges = []) {
    // console.log("    getAllEdges BaseContainerNode:", this.id, onlySelected, allEdges.length);
    super.getAllEdges(onlySelected, allEdges);

    if (this.childNodes) {
      this.childNodes.forEach((childNode) => {
        childNode.getAllEdges(onlySelected, allEdges);
      });
    }
  }

  init(parentElement = null) {
    if (parentElement) this.parentElement = parentElement;
    // console.log("    BaseContainerNode - init", this.id);
    super.init(parentElement);

    // Zone manager is already initialized in BaseNode.init()

    // Calculate minimum size based on label and zone system
    const labelText = this.data.label || '';
    const labelWidth = labelText.length * 8 + 36; // Approximate text width
    
    // Use zone system header height if available, otherwise fallback to default
    let labelHeight = 20; // Default fallback
    if (this.zoneManager?.headerZone) {
      labelHeight = this.zoneManager.headerZone.getHeaderHeight();
    }
    
    const defaultSize = { width: labelWidth, height: labelHeight };
    this.minimumSize = GeometryManager.calculateMinimumSize([], defaultSize);
    
    if (this.data.layout.minimumSize.width > this.minimumSize.width) this.minimumSize.width = this.data.layout.minimumSize.width;
    if (this.data.layout.minimumSize.height > this.minimumSize.height) this.minimumSize.height = this.data.layout.minimumSize.height;
    if (this.data.layout.minimumSize.useRootRatio) this.applyMinimumSize();

    if (this.data.width < this.minimumSize.width || this.data.height < this.minimumSize.height) {
      this.resize(
        {
          width: Math.max(this.minimumSize.width, this.data.width),
          height: Math.max(this.minimumSize.height, this.data.height),
        },
        true
      );
    }

    // Shape drawing is now handled by ContainerZone in the zone system

    // Always initialize children, regardless of collapsed state
    if (this.data.children && this.data.children.length > 0) {
      this.initChildren();
    }
    
    // Apply collapsed state after children are initialized
    if (this.collapsed) {
      this.collapse();
    } else {
      this.expand();
    }

    // you cannot move the g node,, move the child elements in stead
    this.element.attr("transform", `translate(${this.x}, ${this.y})`);
  }

  initChildren() {
    if (!this.data.children || this.data.children.length === 0) {
      return;
    }

    

    if (this.data.children.length == 0) {
      // no rendering of the children, but this renders a placeholder rect
      const containerWidth = this.data.width - this.containerMargin.left - this.containerMargin.right;
      const containerHeight = this.data.height - this.containerMargin.top - this.containerMargin.bottom;
      this.element
        .append("rect")
        .attr("class", `${this.data.type} placeholder`)
        .attr("width", containerWidth)
        .attr("height", containerHeight)
        .attr("x", -containerWidth / 2)
        .attr("y", -containerHeight / 2);
    }
    else
    {
      // Get child container from zone system
      const childContainer = this.zoneManager?.innerContainerZone?.getChildContainer() || this.element;
      
      for (const node of this.data.children) {
        // Create the childComponent instance based on node type
        var childComponent = this.getNode(node.id);
        if (childComponent == null) {
          
          childComponent = this.createNode(node, childContainer, this.settings, this);
          this.childNodes.push(childComponent);

          // Add child to zone system
          if (this.zoneManager?.innerContainerZone) {
            this.zoneManager.innerContainerZone.addChild(childComponent);
          } else {
            console.warn("Zone system not available for child:", node.id);
          }

          // console.log("      nodeColumns - initChildren - Creating Node:", node.id, childComponent);
        }

        childComponent.init(childContainer);
      }
      
      // Trigger child positioning after all children are initialized
      if (this.zoneManager?.innerContainerZone) {
        this.zoneManager.innerContainerZone.forceUpdateChildPositions();
      }
    }

    this.updateChildren();
  }

  update() {
    // console.log(`    BaseContainerNode - update ${this.data.width}x${this.data.height}`, this.data.label);
    super.update();

    // Shape drawing is now handled by ContainerZone in the zone system

    // Always call updateChildren to recalculate size and positioning
    // (even when collapsed, we need to recalculate based on child sizes)
    this.updateChildren();

    if (!this.collapsed) {
      this.updateEdges();
    }
  }

  // // Method to update rendering based on interaction state
  // updateLayout() {
  //   console.log("    BaseContainerNode - updateLayout", this.data.label, this.collapsed);
  //   super.updateLayout();

  //   this.childNodes.forEach((childNode) => {
  //     childNode.visible = !this.collapsed;
  //   });

  //   if (this.collapsed) {
  //     this.renderCollapsed();
  //   } else {
  //     this.renderExpanded();
  //   }

  //   this.cascadeUpdate();

  //   this.updateEdges();
  // }

  updateChildren() {
    // console.log("BaseContainer - updateChildren", this.data.label, this.data.children);

    // Use zone system for child positioning if available
    if (this.zoneManager) {
      // Zone system handles positioning automatically
      return;
    }

    // Fallback to legacy positioning
    this.element.attr(
      "transform",
      `translate(
            ${this.containerMargin.left - this.containerMargin.right}, 
            ${this.containerMargin.top - this.containerMargin.bottom}
          )`
    );
  }

  // Method to remove child nodes from the SVG
  cleanContainer(propagate = true) {
    // console.log("    Removing Children for:", this.data.label);
    this.element.selectAll("*").remove();
    this.edgesContainer = null;
    for (const childNode of this.childNodes) {
      if (childNode instanceof BaseContainerNode) childNode.cleanContainer(propagate);
    }
  }

  // Remove child DOM nodes (but keep instances) so collapsed containers reduce DOM size
  detachChildrenFromDOM() {
    if (!this.childNodes || this.childNodes.length === 0) return;

    // Mark children invisible and remove their DOM elements
    this.childNodes.forEach((childNode) => {
      try {
        childNode.visible = false;
        if (childNode.element) {
          childNode.element.remove();
          childNode.element = null;
        }
        // If child is a container and has zones, destroy them so they can re-init on expand
        if (childNode.zoneManager && typeof childNode.zoneManager.destroy === 'function') {
          childNode.zoneManager.destroy();
          childNode.zoneManager = null;
        }
      } catch (e) {
        console.warn('Failed detaching child from DOM:', childNode?.id, e);
      }
    });
  }

  // Re-create child DOM nodes and add them back into the inner container zone
  attachChildrenToDOM() {
    if (!this.childNodes || this.childNodes.length === 0) return;
    // Ensure inner container exists only when the parent is expanded
    const innerZone = this.zoneManager?.ensureInnerContainerZone ? this.zoneManager.ensureInnerContainerZone() : this.zoneManager?.innerContainerZone;
    const childContainer = innerZone?.getChildContainer() || this.element;

    this.childNodes.forEach((childNode) => {
      try {
        // If DOM does not exist, re-init the child into the current child container
        if (!childNode.element) {
          childNode.init(childContainer);
        }
        // Ensure the zone knows about this child (always re-register after zone recreation)
        if (innerZone) {
          innerZone.addChild(childNode);
        }
        // Make the child visible again (containers will manage their own collapsed children)
        childNode.visible = true;
        // For nested containers, ensure their zones and layout are refreshed
        if (childNode.isContainer) {
          // Ensure descendants are visible unless they are collapsed containers
          if (typeof childNode.propagateVisibility === 'function') {
            childNode.propagateVisibility(true);
          }
          
          // Force re-initialization of nested container zones if their DOM was destroyed
          if (childNode.zoneManager?.innerContainerZone && (!childNode.zoneManager.innerContainerZone.element || !childNode.zoneManager.innerContainerZone.initialized)) {
            // Only initialize nested inner zones if the nested container is expanded
            if (!childNode.collapsed) {
              childNode.zoneManager.innerContainerZone.init();
              // Ensure nested zones have correct size from child node
              childNode.zoneManager.resize(childNode.data.width, childNode.data.height);
              childNode.zoneManager.innerContainerZone.update();
            }
          }
          
          if (childNode.zoneManager) {
            childNode.zoneManager.update();
          }
          
          // CRITICAL: Update children BEFORE calling updateChildPositions
          // This ensures the nested container has proper dimensions
          if (!childNode.collapsed && typeof childNode.updateChildren === 'function') {
            childNode.updateChildren();
          }
          
          // Now that children are updated, position them
          if (!childNode.collapsed && childNode.zoneManager?.innerContainerZone) {
            childNode.zoneManager.innerContainerZone.updateChildPositions();
          }
        }
      } catch (e) {
        console.warn('Failed attaching child to DOM:', childNode?.id, e);
      }
    });

    // After re-attaching, update positions via the zone system
    if (innerZone) {
      innerZone.forceUpdateChildPositions();
    }

    // Finally, ensure this container recomputes its own sizing/zone metrics
    if (this.zoneManager) {
      this.zoneManager.update();
    }

    // Defer an additional layout pass to ensure nested containers complete init cycles
    setTimeout(() => {
      try {
        this.childNodes.forEach((childNode) => {
          if (childNode.isContainer) {
            if (childNode.zoneManager) childNode.zoneManager.update();
            
            // CRITICAL: Update children BEFORE positioning them
            if (!childNode.collapsed && typeof childNode.updateChildren === 'function') {
              childNode.updateChildren();
            }
            
            // Now position children after they're updated
            if (!childNode.collapsed && childNode.zoneManager?.innerContainerZone) {
              childNode.zoneManager.innerContainerZone.updateChildPositions();
            }
          }
        });
        
        // Finally update this container's child positions
        if (innerZone) {
          innerZone.updateChildPositions();
        }
        
        if (this.zoneManager) this.zoneManager.update();
      } catch (e) {
        console.warn('Deferred layout after reattach failed for', this.id, e);
      }
    }, 0);
  }

  applyMinimumSize() {
    // console.error("    BaseContainerNode - applyRatioToMinimumSize", this.data.label, this.data.layout.minimumSize.useRootRatio, this);
    if (this.minimumSize.width < this.data.layout.minimumSize.width) this.minimumSize.width = this.data.layout.minimumSize.width;
    if (this.minimumSize.height < this.data.layout.minimumSize.height) this.minimumSize.height = this.data.layout.minimumSize.height;

    if (!this.data.layout.minimumSize.useRootRatio) return;

    // Guard: ensure we have a valid ratio to avoid NaN during early layout passes
    const ratio = (this.settings && this.settings.divRatio && this.settings.divRatio > 0)
      ? this.settings.divRatio
      : 16 / 9;

    // Use current node data.height as reference; avoid undefined "this.height"
    const currentHeight = this.data.height || this.minimumSize.height || 1;

    if (this.minimumSize.width / currentHeight > ratio) {
      this.minimumSize.height = this.minimumSize.width / ratio;
    } else {
      this.minimumSize.width = this.minimumSize.height * ratio;
    }
    // console.log("    BaseContainerNode - applyRatioToMinimumSize", this.minimumSize.width, this.minimumSize.height);
  }
}
