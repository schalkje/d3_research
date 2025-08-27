import { createNode, createNodes } from "./node.js";
import { getRegisteredNodeTypes } from "./nodeRegistry.js";
import { getBoundingBoxRelativeToParent } from "./utils.js";
import { createMarkers } from "./markers.js";
import { createEdges } from "./edge.js";
import { ConfigManager } from "./configManager.js";
import { fetchDashboardFile } from "./data.js";
import { LoadingOverlay, showLoading as showLoader, hideLoading as hideLoader, resolveLoadingContainer as resolveLoadingHost } from "./loadingOverlay.js";
import { Minimap } from "./minimap.js";
import ZoomManager from "./zoomManager.js";
import { NodeStatus } from "./nodeBase.js";

export class Dashboard {
  constructor(dashboardData) {
    this._isInitialized = false;
    this._data = null;
    Object.defineProperty(this, 'data', {
      get: () => this._data,
      set: (value) => {
        if (!this._isInitialized) {
          this._data = value || {};
          return;
        }
        this.setData(value);
      },
      configurable: true
    });
    this.data = dashboardData;

    this.data.settings = ConfigManager.mergeWithDefaults(this.data.settings);
    
    this.main = {
      svg: null,
      width: 0,
      height: 0,
      divRatio: 0,
      aspectRatio: 0,
      container: null,
      root: null,
      scale: 1,
      zoomSpeed: 0.2,
      transform: { k: 1, x: 0, y: 0 },
      pixelToSvgRatio: 1.0,
      fitK: 1.0,
      fitTransform: null,
    };
    this.minimap = new Minimap(this);
    this.selection = {
      nodes: [],
      edges: [],
      neighborhood: null, // { nodes, edges, boundingBox }
    };

    this.isMainAndMinimapSyncing = false;
    this._displayChangeScheduled = false;
    this.hasPerformedInitialZoomToRoot = false;
    this._displayChangeCount = 0;
    this._suspendDisplayChange = false;
    this.zoomManager = new ZoomManager(this);
  }

  // --- Selection bounding box helpers ---
  
  /**
   * Global cleanup method to remove any orphaned zoom-cockpit elements
   * This prevents the duplication issue that can occur after expand/collapse operations
   */
  cleanupOrphanedElements() {
    try {
      if (typeof document !== 'undefined') {
        // Remove any orphaned zoom-cockpit elements that might exist outside the current minimap instance
        const allCockpits = document.querySelectorAll('.zoom-cockpit');
        allCockpits.forEach(cockpit => {
          // Only remove if it's not the current minimap's cockpit
          if (cockpit !== this.minimap?.cockpit?.node()) {
            console.warn('Removing orphaned zoom-cockpit element');
            cockpit.remove();
          }
        });
        
        // Remove empty overlay hosts
        const emptyOverlayHosts = document.querySelectorAll('.zoom-overlay-host');
        emptyOverlayHosts.forEach(host => {
          if (host.children.length === 0) {
            host.remove();
          }
        });
      }
    } catch (e) {
      console.warn('Error during cleanup of orphaned elements:', e);
    }
  }
  
  renderSelectionBoundingBox(bbox) {
    try {
      // Respect settings: if disabled, just clear and return
      if (!this.data?.settings?.showBoundingBox) { this.clearSelectionBoundingBox(); return; }
      this.main.container.selectAll('.boundingBox').remove();
      this.main.container
        .append('rect')
        .attr('class', 'boundingBox')
        .attr('x', bbox.x)
        .attr('y', bbox.y)
        .attr('width', bbox.width)
        .attr('height', bbox.height)
        .attr('fill', 'none')
        .attr('stroke', 'var(--fd-border, rgba(0,0,0,0.85))')
        .attr('stroke-width', 2)
        .attr('pointer-events', 'none');
    } catch {}
  }

  clearSelectionBoundingBox() {
    try { this.main.container.selectAll('.boundingBox').remove(); } catch {}
  }

  // Compute a DOM-accurate bounding box for a single node and enforce a minimum
  // on-screen size to avoid extreme zooming. Returns a bbox in parent coordinates.
  computeSaneNodeBoundingBox(node) {
    // Start from DOM-based bbox for accuracy
    let bbox = computeBoundingBox(this, [node]);
    const k = this.main.transform.k || 1;
    const minPx = 80; // minimum visual size in pixels
    const minWorld = minPx / k;
    const cx = bbox.x + bbox.width / 2;
    const cy = bbox.y + bbox.height / 2;
    const w = Math.max(bbox.width, minWorld);
    const h = Math.max(bbox.height, minWorld);
    return { x: cx - w / 2, y: cy - h / 2, width: w, height: h };
  }

  getContentBBox() {
    // Prefer DOM-accurate bounding box to account for nested transforms and collapsed containers
    try {
      if (this.main?.root) {
        const nodes = this.main.root.getAllNodes(false);
        if (nodes && nodes.length) {
          const bbox = computeBoundingBox(this, nodes);
          if (
            bbox &&
            Number.isFinite(bbox.x) &&
            Number.isFinite(bbox.y) &&
            Number.isFinite(bbox.width) &&
            Number.isFinite(bbox.height)
          ) {
            return bbox;
          }
        }
      }
    } catch {}
    // Fallback: centered viewport
    return { x: -this.main.width / 2, y: -this.main.height / 2, width: this.main.width, height: this.main.height };
  }

  

  recomputeBaselineFit() { return this.zoomManager.recomputeBaselineFit(); }

  setData(newDashboardData) {
    this._initialLoading = true;
    try { this.showLoading(); } catch {}

    const userSettings = (newDashboardData && newDashboardData.settings) ? newDashboardData.settings : {};
    this._data = newDashboardData || {};
    this._data.settings = ConfigManager.mergeWithDefaults(userSettings);
    try {
      const fallbackRatio = (this.main && this.main.divRatio) ? this.main.divRatio : (16 / 9);
      if (!this._data.settings.divRatio || !(this._data.settings.divRatio > 0)) {
        this._data.settings.divRatio = fallbackRatio;
      }
    } catch {}

    if (this.main?.svg) {
      this.main.svg.selectAll('*').remove();
    }

    this.main.container = this.createContainer(this.main, "dashboard");
    this.main.root = this.createDashboard(this.data, this.main.container);

  this.main.root.onClick = (node) => this.selectNode(node);
  this.main.root.onDblClick = (node, event) => this.handleNodeDblClick(node, event);
    this.main.root.onDisplayChange = () => { this.onMainDisplayChange(); };

    if (this.main.zoom) {
      this.main.svg.call(this.main.zoom);
    } else {
      this.main.zoom = this.initializeZoom();
    }

    // CRITICAL FIX: Instead of destroying and recreating the minimap, 
    // just reinitialize the existing one to prevent zoom-cockpit duplication
    if (this.minimap) {
      try { 
        // Clean up any orphaned elements first
        this.cleanupOrphanedElements();
        // Use safe initialization to prevent duplicates
        this.minimap.safeInitialize();
      } catch (e) {
        // If reinitialization fails, fall back to creating a new instance
        console.warn('Failed to reinitialize minimap, creating new instance:', e);
        this.minimap = new Minimap(this);
        this.minimap.initializeEmbedded();
      }
    } else {
      // Only create new instance if one doesn't exist
      this.minimap = new Minimap(this);
      this.minimap.initializeEmbedded();
    }

    this.hasPerformedInitialZoomToRoot = false;
    // Defer baseline fit to onMainDisplayChange to ensure layout is settled
    this.onMainDisplayChange();
  }

   initialize(mainDivSelector, minimapDivSelector = null) {
    this.mainDivSelector = mainDivSelector;
    
    try { 
      if (typeof window !== 'undefined' && window.showFlowDashLoading) {
        window.showFlowDashLoading();
      } else {
        this.showLoading();
      }
    } catch {}
    
    const div = this.initializeSvg(mainDivSelector);
    this.main.svg = div.svg;
    this.main.width = div.width;
    this.main.height = div.height;
    this.main.divRatio = this.main.width / this.main.height;
    this.main.aspectRatio = this.main.divRatio;
    this.main.pixelToSvgRatio = 1.0;
    this.data.settings.divRatio ??= this.main.divRatio;
    this.main.onDragUpdate = this.onDragUpdate;

    this._initialLoading = true;

    this.main.container = this.createContainer(this.main, "dashboard");
    
    const tempDisplayChangeCallback = () => {
      this.onMainDisplayChange();
    };
    
  this.main.root =  this.createDashboard(this.data, this.main.container, tempDisplayChangeCallback);

  this.main.zoom = this.initializeZoom();
  this.main.root.onClick = (node) => this.selectNode(node);
  this.main.root.onDblClick = (node, event) => this.handleNodeDblClick(node, event);

    // CRITICAL FIX: Clean up any orphaned elements and use safe initialization to prevent duplicates
    this.cleanupOrphanedElements();
    this.minimap.safeInitialize();

    // Defer initial zoom-to-root to onMainDisplayChange so it happens after layout settles
    

    this.initializeFullscreenToggle();

    if (typeof window !== 'undefined') {
      this._onWindowResize = () => {
        if (this.main.svg.classed('flowdash-fullscreen')) return;
        // Avoid early resizes during initial layout stabilization which can shift the view
        if ((this._displayChangeCount || 0) < 2) return;
        this.applyResizePreserveZoom();
      };
      window.addEventListener('resize', this._onWindowResize);
    }
    this._isInitialized = true;
  }



  initializeEmbeddedMinimap() {
    const mm = this.data.settings.minimap;
    if (!mm || mm.enabled === false) {
      this.minimap.active = false;
      return;
    }

    const isSmallScreen = typeof window !== 'undefined' && (window.innerWidth || 0) < 600;
    let mode = this.data.settings.minimap.mode || (isSmallScreen ? 'disabled' : 'hover');
    if (mode === 'hidden') mode = 'disabled';
    this.data.settings.minimap.mode = mode;

    if (mode === 'disabled') {
      this.data.settings.minimap.enabled = false;
      return;
    }

    if (mm.persistence && mm.persistence.persistCollapsedState && typeof window !== 'undefined') {
      try {
        const persisted = window.localStorage.getItem(mm.persistence.storageKey);
        if (persisted !== null) {
          this.data.settings.minimap.collapsed = persisted === 'true';
        }
      } catch {}
    }
    if (mode === 'always') {
      this.data.settings.minimap.enabled = true;
      this.data.settings.minimap.collapsed = false;
      this.data.settings.minimap.pinned = true;
    }
    if (mode === 'hover' && typeof this.data.settings.minimap.collapsed === 'undefined') {
      this.data.settings.minimap.collapsed = true;
    }

    const graphContainer = this.main.svg.node().parentElement;
    try {
      graphContainer.style.position = graphContainer.style.position || 'relative';
      graphContainer.style.overflow = 'hidden';
    } catch {}
    const cockpitDiv = d3.select(graphContainer)
      .append('div')
      .attr('class', 'zoom-cockpit');
    this.minimap.cockpit = cockpitDiv;
    this.minimap.overlay = cockpitDiv;
    const cockpitSvg = cockpitDiv.append('svg')
      .attr('class', 'minimap-chrome')
      .style('position', 'absolute')
      .style('top', '0')
      .style('left', '0')
      .style('width', '100%')
      .style('height', '100%')
      .style('pointer-events', 'all');
    this.minimap.chromeSvg = cockpitSvg;
    this.minimap.content = cockpitSvg.append('g').attr('class', 'minimap-content');
    this.minimap.active = true;
    this.minimap.state = { showTimer: null, hideTimer: null, interacting: false, wheelTimer: null };

    this.minimap.collapsedIcon = this.minimap.content.append('g')
      .attr('class', 'minimap-collapsed-icon')
      .style('cursor', 'pointer')
      .style('pointer-events', 'all');
    this.minimap.collapsedIcon.append('rect').attr('class', 'collapsed-icon-bg').attr('width', 20).attr('height', 14).attr('rx', 2).attr('ry', 2);
    this.minimap.collapsedIcon.append('rect').attr('class', 'collapsed-icon-mini').attr('x', 4).attr('y', 3).attr('width', 12).attr('height', 8);
    this.minimap.collapsedIcon.on('click', () => {
      this.setMinimapCollapsed(false, true);
    });

    this.minimap.header = this.minimap.content.append('g').attr('class', 'minimap-header');
    this.minimap.headerHeight = 20;

    this.minimap.collapseButton = this.minimap.header.append('g').attr('class', 'minimap-collapse-button').style('cursor', 'pointer');
    this.minimap.collapseButton.append('rect').attr('class', 'collapse-btn-bg').attr('width', 16).attr('height', 16).attr('rx', 3).attr('ry', 3);
    this.minimap.collapseButton.append('path').attr('class', 'collapse-btn-icon').attr('d', 'M2,6 L14,6 L8,12 Z');
    this.minimap.collapseButton.on('click', () => {
      this.setMinimapCollapsed(true, true);
    });

    this.minimap.pinButton = this.minimap.header.append('g').attr('class', 'minimap-pin-button').style('cursor', 'pointer')
      .attr('role', 'button')
      .attr('aria-label', 'Pin')
      .attr('aria-pressed', String(!!mm.pinned));
    this.minimap.sizeButton = this.minimap.header.append('g').attr('class', 'minimap-size-button').style('cursor', 'pointer');
    this.minimap.sizeButton.append('rect').attr('class', 'btn-bg').attr('width', 20).attr('height', 16).attr('rx', 3).attr('ry', 3);
    this.minimap.sizeLabel = this.minimap.sizeButton.append('text').attr('class', 'btn-label').attr('x', 10).attr('y', 10).attr('text-anchor', 'middle').style('dominant-baseline', 'middle').style('font-size', '10px');
    const updateSizeLabel = () => {
      const token = this.data.settings.minimap.size;
      const label = (typeof token === 'object' ? (token.label || 'M') : String(token || 'm').toUpperCase());
      this.minimap.sizeLabel.text(label);
    };
    updateSizeLabel();
    this.minimap.sizeButton.on('click', () => {
      const order = (this.data.settings.minimap.sizeSwitcher && this.data.settings.minimap.sizeSwitcher.order) || ['s','m','l'];
      const current = this.data.settings.minimap.size;
      const idx = order.indexOf(typeof current === 'object' ? current.token : current) >= 0 ? order.indexOf(typeof current === 'object' ? current.token : current) : order.indexOf('m');
      const nextToken = order[(idx + 1) % order.length];
      this.data.settings.minimap.size = nextToken;
      this.resizeMinimap();
      this.minimap.position();
      updateSizeLabel();
      if (typeof this.data.settings.minimap.onSizeChange === 'function') {
        try { 
          this.data.settings.minimap.onSizeChange({ 
            size: nextToken, 
            width: this.minimap.targetWidthPx, 
            height: this.minimap.targetHeightPx 
          }); 
        } catch {}
      }
    });
    this.minimap.pinButton.selectAll('*').remove();
    const iconGroup = this.minimap.pinButton.append('g').attr('class', 'pin-icon');
    const pinBasePath = 'M8 2 C9.2 2 10 2.8 10 4 L10 6 L12.5 8 L9 8 L9 12 L7 12 L7 8 L3.5 8 L6 6 L6 4 C6 2.8 6.8 2 8 2 Z';
    const pinSlashPath = 'M3 13 L13 3';
    this.minimap.pinBase = iconGroup.append('path')
      .attr('class', 'pin-base')
      .attr('d', pinBasePath)
      .attr('fill', 'var(--fd-border, rgba(0,0,0,0.85))');
    this.minimap.pinSlash = iconGroup.append('path')
      .attr('class', 'pin-slash')
      .attr('d', pinSlashPath)
      .attr('stroke', 'var(--fd-border, rgba(0,0,0,0.85))')
      .attr('stroke-width', 2)
      .attr('stroke-linecap', 'round')
      .style('display', mm.pinned ? 'none' : 'block');
    iconGroup.attr('transform', mm.pinned ? 'rotate(0,8,8)' : 'rotate(-20,8,8)');
    this.minimap.pinButton.append('title').text('Pin (toggle pinned / hover)');
    this.minimap.pinButton.on('click', () => {
      mm.pinned = !mm.pinned;
      this.data.settings.minimap.mode = mm.pinned ? 'always' : 'hover';
      if (this.minimap.state.showTimer) { clearTimeout(this.minimap.state.showTimer); this.minimap.state.showTimer = null; }
      if (this.minimap.state.hideTimer) { clearTimeout(this.minimap.state.hideTimer); this.minimap.state.hideTimer = null; }
      this.minimap.state.interacting = false;
      this.updatePinVisualState();
      this.minimap.updateHoverBindings();
    });

    this.minimap.svg = this.minimap.content.append('svg').attr('class', 'minimap-svg');
    this.minimap.container = this.minimap.svg.append('g').attr('class', 'minimap');

    this.resizeMinimap();

    this.initializeMinimap();

    this.minimap.footer = this.minimap.content.append('g').attr('class', 'minimap-footer');
    this.minimap.footerHeight = 20;
    if (mm.scaleIndicator?.visible !== false) {
      this.minimap.scaleText = this.minimap.footer.append('text').attr('class', 'minimap-scale').attr('text-anchor', 'end');
    }

    const makeButton = (group, className, onClick) => {
      const g = group.append('g').attr('class', `minimap-btn ${className}`).style('cursor', 'pointer');
      g.append('rect').attr('class', 'btn-bg').attr('width', 16).attr('height', 16).attr('rx', 3).attr('ry', 3);
      g.on('click', (ev) => { ev.stopPropagation(); onClick(); });
      return g;
    };
    this.minimap.controls = this.minimap.footer.append('g').attr('class', 'minimap-controls');
    this.minimap.btnZoomIn = makeButton(this.minimap.controls, 'zoom-in', () => this.zoomIn());
    this.minimap.btnZoomIn.append('rect').attr('class', 'icon plus-h').attr('x', 3).attr('y', 7).attr('width', 10).attr('height', 2);
    this.minimap.btnZoomIn.append('rect').attr('class', 'icon plus-v').attr('x', 7).attr('y', 3).attr('width', 2).attr('height', 10);

    this.minimap.btnZoomOut = makeButton(this.minimap.controls, 'zoom-out', () => this.zoomOut());
    this.minimap.btnZoomOut.append('rect').attr('class', 'icon minus').attr('x', 3).attr('y', 7).attr('width', 10).attr('height', 2);

    this.minimap.btnReset = makeButton(this.minimap.controls, 'reset', () => this.zoomReset());
    this.minimap.btnReset.append('circle').attr('class', 'icon target-outer').attr('cx', 8).attr('cy', 8).attr('r', 5);
    this.minimap.btnReset.append('circle').attr('class', 'icon target-inner').attr('cx', 8).attr('cy', 8).attr('r', 1.5);

    this.minimap.headerHitRect = this.minimap.header.append('rect').attr('class', 'minimap-header-hit').attr('fill', 'transparent');
    this.minimap.footerHitRect = this.minimap.footer.append('rect').attr('class', 'minimap-footer-hit').attr('fill', 'transparent');
    if (this.minimap.headerHitRect) this.minimap.headerHitRect.lower();
    if (this.minimap.footerHitRect) this.minimap.footerHitRect.lower();

    if (this.minimap.header) this.minimap.header.raise();
    if (this.minimap.footer) this.minimap.footer.raise();

    this.positionEmbeddedMinimap();

    this.minimap.updateHoverBindings();

    this.minimap.setCollapsed(mm.collapsed === true);
    this.minimap.updateVisibilityByZoom();
    this.minimap.updatePinVisualState();
  }















  initializeFullscreenToggle() {
    const graphContainer = this.main.svg.node().parentElement;
    let host = graphContainer.querySelector('.fullscreen-overlay');
    if (!host) {
      host = document.createElement('div');
      host.className = 'fullscreen-overlay';
      host.style.position = 'absolute';
      host.style.right = '12px';
      host.style.top = '12px';
      host.style.pointerEvents = 'auto';
      graphContainer.appendChild(host);
    }
    let button = host.querySelector('.fullscreen-toggle');
    if (!button) {
      button = document.createElement('button');
      button.className = 'fullscreen-toggle';
      button.setAttribute('aria-label', 'Toggle fullscreen');
      button.title = 'Maximize / Restore';
      host.appendChild(button);
    }

    const updateIcon = () => {
      const isFullscreen = this.main.svg.classed('flowdash-fullscreen');
      button.textContent = isFullscreen ? '⤡' : '⤢';
    };

    const applySize = () => {
      const rect = this.main.svg.node().getBoundingClientRect();

      const prevWidth = this.main.width;
      const prevHeight = this.main.height;
      const prevK = this.main.transform.k;
      const prevX = this.main.transform.x;
      const prevY = this.main.transform.y;

      const worldLeft = (prevX + prevWidth / 2) / -prevK;
      const worldTop = (prevY + prevHeight / 2) / -prevK;
      const worldWidth = prevWidth / prevK;
      const worldHeight = prevHeight / prevK;
      const worldCenterX = worldLeft + worldWidth / 2;
      const worldCenterY = worldTop + worldHeight / 2;

      const newWidth = rect.width;
      const newHeight = rect.height;
      this.main.width = newWidth;
      this.main.height = newHeight;
      this.main.divRatio = newWidth / newHeight;
      this.main.svg.attr('viewBox', [-newWidth / 2, -newHeight / 2, newWidth, newHeight]);

      const newK = prevK;
      const newWorldWidth = newWidth / newK;
      const newWorldHeight = newHeight / newK;
      const newLeft = worldCenterX - newWorldWidth / 2;
      const newTop = worldCenterY - newWorldHeight / 2;
      const newTransform = d3.zoomIdentity
        .translate(-newLeft * newK - newWidth / 2, -newTop * newK - newHeight / 2)
        .scale(newK);

      if (this.minimap.active) {
        this.minimap.resize();
      }

      this.main.transform = { k: newK, x: newTransform.x, y: newTransform.y };
      this.main.container.attr('transform', newTransform);
      this.main.svg.call(this.main.zoom.transform, newTransform);

      this.recomputeBaselineFit();

      if (this.minimap.active) {
        this.minimap.update();
        this.minimap.updateViewport(newTransform);
        this.minimap.position();
      }
    };

    const onResize = () => {
      if (!this.main.svg.classed('flowdash-fullscreen')) return;
      applySize();
    };

    const toggle = () => {
      const isFullscreen = this.main.svg.classed('flowdash-fullscreen');
      if (!isFullscreen) {
        this.main.svg.classed('flowdash-fullscreen', true).classed('fullscreen', true);
        window.addEventListener('resize', onResize);
        applySize();
        button.classList.add('fullscreen-active');
      } else {
        this.main.svg.classed('flowdash-fullscreen', false).classed('fullscreen', false);
        window.removeEventListener('resize', onResize);
        const rect = this.main.svg.node().getBoundingClientRect();
        this.main.width = rect.width;
        this.main.height = rect.height;
        this.main.divRatio = this.main.width / this.main.height;
        this.main.svg.attr('viewBox', [-this.main.width / 2, -this.main.height / 2, this.main.width, this.main.height]);
        if (this.minimap.active) {
          this.minimap.svg.attr('viewBox', [-this.main.width / 2, -this.main.height / 2, this.main.width, this.main.height]);
          this.minimap.update();
          const transform = d3.zoomIdentity
            .translate(this.main.transform.x, this.main.transform.y)
            .scale(this.main.transform.k);
          this.minimap.updateViewport(transform);
          this.minimap.position();
        }
        button.classList.remove('fullscreen-active');
      }
      updateIcon();
    };

    button.onclick = toggle;
    updateIcon();
  }

  applyResizePreserveZoom() {
    const rect = this.main.svg.node().getBoundingClientRect();

    const prevWidth = this.main.width || 1;
    const prevHeight = this.main.height || 1;
    const prevK = this.main.transform.k;
    const prevX = this.main.transform.x;
    const prevY = this.main.transform.y;

    // Preserve world center instead of scaling translate by size ratios
    // Derive current world-space center from previous transform and container size
    const worldLeft = (prevX + prevWidth / 2) / -prevK;
    const worldTop = (prevY + prevHeight / 2) / -prevK;
    const worldWidth = prevWidth / prevK;
    const worldHeight = prevHeight / prevK;
    const worldCenterX = worldLeft + worldWidth / 2;
    const worldCenterY = worldTop + worldHeight / 2;

    const newWidth = rect.width || prevWidth;
    const newHeight = rect.height || prevHeight;

    this.main.width = newWidth;
    this.main.height = newHeight;
    this.main.divRatio = newWidth / newHeight;
    this.main.aspectRatio = this.main.divRatio;
    this.main.svg.attr('viewBox', [-newWidth / 2, -newHeight / 2, newWidth, newHeight]);

    const newK = prevK;
    const newWorldWidth = newWidth / newK;
    const newWorldHeight = newHeight / newK;
    const newLeft = worldCenterX - newWorldWidth / 2;
    const newTop = worldCenterY - newWorldHeight / 2;
    const newTransform = d3.zoomIdentity
      .translate(-newLeft * newK - newWidth / 2, -newTop * newK - newHeight / 2)
      .scale(newK);

    if (this.minimap.active) this.minimap.resize();

    this.main.transform = { k: newK, x: newTransform.x, y: newTransform.y };
    this.main.container.attr('transform', newTransform);
    this.main.svg.call(this.main.zoom.transform, newTransform);

    this.recomputeBaselineFit();

    if (this.minimap.active) {
      this.minimap.update();
      this.minimap.updateViewport(newTransform);
      this.minimap.position();
      this.minimap.updateScaleIndicator?.();
    }
  }

  updateNodeStatus(nodeId, status) {
    
    const node = this.main.root.getNode(nodeId);
    if (node) {
      try {
        node.status = status;
      } catch (e) {
        console.warn('updateNodeStatus: Failed to update status for node:', nodeId, e);
      }
    } else {
      console.error("updateNodeStatus: Node not found:", nodeId);
    }
  }

  updateDatasetStatus(datasetId, status) {
    let stateUpdated = false;
    const nodes = this.main.root.getNodesByDatasetId(datasetId);
    if (nodes && nodes.length > 0) {
      for (const node of nodes) {
        try {
          node.status = status;
          stateUpdated = true;
        } catch (e) {
          console.warn('updateDatasetStatus: Failed to update status for node:', node.id, e);
        }
      }
    }
    return stateUpdated; 
  }

  createContainer(parentContainer, className) {
    parentContainer.svg.selectAll("*").remove();

    const container = parentContainer.svg.append("g").attr("class", `${className}`);    

    return container;
  }

  initializeSvg(divSelector) {
    const svg = d3.select(`${divSelector}`);
    svg.selectAll("*").remove();
    
    const { width, height } = svg.node().getBoundingClientRect();

    svg.attr("viewBox", [-width / 2, -height / 2, width, height]);

    const onDragUpdate = null;

    return { svg, width, height, onDragUpdate };
  }

  createDashboard(dashboard, container, displayChangeCallback = null) {
    
    createMarkers(container);

    var root;
    if (dashboard.nodes.length == 1) {
      root = createNode(dashboard.nodes[0], container, dashboard.settings);
      
      if (root) {
        root.move(0, 0);
      }
    } else {
      root = createNodes(dashboard.nodes, container, dashboard.settings);
      
      if (root && root.isContainer) {
        root.move(0, 0);
      }
    }

    if (!root) {
      console.error("Failed to create node - root is null");
      return null;
    }

    if (displayChangeCallback) {
      root.onDisplayChange = () => {
        if (this._suspendDisplayChange) return;
        displayChangeCallback();
      };
    }

    // Suspend display-change reactions during bulk initialization to avoid
    // mid-cascade zoom/fit recalculations that cause drift
    this._suspendDisplayChange = true;
    root.init();
    this._suspendDisplayChange = false;

    this.initializeChildrenStatusses(root);

    if (dashboard.edges.length > 0) createEdges(root, dashboard.edges, dashboard.settings);

    if (this.data.settings.isDebug) {
      container.append("circle")
        .attr("class", "debug-center")
        .attr("cx", 0)
        .attr("cy", 0)
        .attr("r", 5)
        .attr("fill", "red")
        .attr("stroke", "darkred")
        .attr("stroke-width", 2);
    }

    
    // After initial construction, fix up hierarchy for nodes with explicit parentId(s)
    try { this.reparentNodesByParentIds(); } catch {}

    // Defer initial baseline fit and zoom until layout has fully settled
    // This will be handled by onMainDisplayChange via ZoomManager.handleLayoutChange

    return root;
  }

  reparentNodesByParentIds() {
    if (!this.main?.root) return;
    const all = this.main.root.getAllNodes(false, false);
    const idMap = new Map(all.map(n => [n.id, n]));
    const ensureChildAttached = (parent, child) => {
      try {
        // Adjust logical tree
        if (child.parentNode && child.parentNode !== parent) {
          const prev = child.parentNode;
          const idx = prev.childNodes ? prev.childNodes.indexOf(child) : -1;
          if (idx >= 0) prev.childNodes.splice(idx, 1);
          // Remove from previous zone listing
          try { prev.zoneManager?.innerContainerZone?.removeChild?.(child); } catch {}
        }
        child.parentNode = parent;
        parent.childNodes = parent.childNodes || [];
        if (parent.childNodes.indexOf(child) === -1) parent.childNodes.push(child);
        // Register with zone system and move DOM
        const innerZone = parent.zoneManager?.innerContainerZone || (parent.zoneManager?.ensureInnerContainerZone ? parent.zoneManager.ensureInnerContainerZone() : null);
        if (innerZone) {
          innerZone.addChild(child);
          const target = innerZone.getChildContainer?.();
          const el = child.element?.node?.();
          const tgt = target?.node?.();
          if (el && tgt && el.parentNode !== tgt) tgt.appendChild(el);
          // Update layout for new parent
          try { parent.updateChildren?.(); } catch {}
          try { parent.zoneManager?.update?.(); } catch {}
          try { innerZone.updateChildPositions(); } catch {}
        } else if (parent.element && child.element) {
          const tgt = parent.element.node();
          const el = child.element.node();
          if (tgt && el && el.parentNode !== tgt) tgt.appendChild(el);
        }
      } catch {}
    };
    for (const node of all) {
      const pids = Array.isArray(node?.data?.parentIds) ? node.data.parentIds : (node?.data?.parentId ? [node.data.parentId] : []);
      if (!pids.length) continue;
      // Prefer first existing container parent
      const target = pids.map(id => idMap.get(id)).find(n => n && n.isContainer);
      if (target && node.parentNode !== target) {
        ensureChildAttached(target, node);
      }
    }
    // Update top-level after reparenting
    this.main.root.update();
  }

  initializeChildrenStatusses(node) {
    var allNodes = node.getAllNodes();

    for (var i = allNodes.length - 1; i >= 0; i--) {
      const currentNode = allNodes[i];
      // Safety check: only process nodes with valid elements
      if (!currentNode.element) {
        console.warn('initializeChildrenStatusses: Node has null element, skipping:', currentNode.id);
        continue;
      }
      
      if (currentNode.isContainer && (currentNode.status == null || currentNode.status == "" || currentNode.status == "Unknown")) {
        try {
          currentNode.determineStatusBasedOnChildren();
        } catch (e) {
          console.warn('initializeChildrenStatusses: Failed to determine status for node:', currentNode.id, e);
        }
      } 
    }
  }

  initializeZoom() {

    const dag = null;

    const dashboard = this;
    const zoom = this.zoomManager.initializeZoomBehavior();

    this.main.svg.call(zoom);

    d3.select("#zoom-in").on("click", () => this.zoomIn(dashboard));

    d3.select("#zoom-out").on("click", () => this.zoomOut(dashboard));

    d3.select("#zoom-reset").on("click", () => this.zoomReset(dashboard));

    d3.select("#zoom-random").on("click", () => this.zoomRandom(dashboard));

    d3.select("#zoom-node").on("click", () => this.zoomToRoot(dashboard));

    return zoom;
  }

  onDragUpdate() {
    
  }

  onMainDisplayChange() {
    if (this._displayChangeScheduled) return;
    this._displayChangeScheduled = true;

    requestAnimationFrame(() => {
      this._displayChangeCount = (this._displayChangeCount || 0) + 1;
      try { this.zoomManager.handleLayoutChange(); } catch {}
      // Ensure DOM hierarchy is consistent with logical parent/child relationships
      try { this.enforceDomHierarchy(); } catch {}
      if (this.minimap.svg) {
        try {
          this.minimap.update();
          const transform = d3.zoomIdentity
            .translate(this.main.transform.x, this.main.transform.y)
            .scale(this.main.transform.k);
          this.minimap.updateViewport(transform);
          this.minimap.updateScaleIndicator?.();
        } catch {}
      }
      this.minimap.position();

      // Recompute selection bounding box after layout changes (e.g., collapse/expand)
      try {
        if (this.data?.settings?.showBoundingBox) {
          const nb = this.selection?.neighborhood;
          let nodesToBox = null;
          if (nb && Array.isArray(nb.nodes) && nb.nodes.length > 0) {
            nodesToBox = nb.nodes;
          } else if (typeof this.getSelectedNodes === 'function') {
            const sel = this.getSelectedNodes();
            if (sel && sel.length) nodesToBox = sel;
          }
          if (nodesToBox && nodesToBox.length) {
            const bbox = computeBoundingBox(this, nodesToBox);
            if (
              Number.isFinite(bbox.x) &&
              Number.isFinite(bbox.y) &&
              Number.isFinite(bbox.width) &&
              Number.isFinite(bbox.height)
            ) {
              this.renderSelectionBoundingBox(bbox);
              if (nb) nb.boundingBox = bbox;
            } else {
              this.clearSelectionBoundingBox?.();
            }
          } else {
            this.clearSelectionBoundingBox?.();
          }
        } else {
          this.clearSelectionBoundingBox?.();
        }
      } catch {}

      if (this._initialLoading) {
        console.log('📊 Dashboard onMainDisplayChange - Initial loading complete, calling hideLoading()');
        this._initialLoading = false;
        this.hideLoading();
      }

      this._displayChangeScheduled = false;
    });
  }

  enforceDomHierarchy() {
    try {
      if (!this.main?.root) return;
      const allNodes = this.main.root.getAllNodes(false, false);
      allNodes.forEach((node) => {
        if (!node?.element) return;
        const parent = node.parentNode;
        if (!parent) return;
        // Determine correct DOM parent group
        let parentGroup = parent.element;
        try {
          if (parent.isContainer && !parent.collapsed) {
            const innerZone = parent.zoneManager?.innerContainerZone || (parent.zoneManager?.ensureInnerContainerZone ? parent.zoneManager.ensureInnerContainerZone() : null);
            parentGroup = innerZone?.getChildContainer?.() || parent.element;
          }
        } catch {}
        const targetDom = parentGroup?.node?.();
        const el = node.element?.node?.();
        if (!targetDom || !el) return;
        if (el.parentNode !== targetDom) {
          try { targetDom.appendChild(el); } catch {}
        }
      });
    } catch {}
  }



  zoomMain(zoomEvent) { this.zoomManager.onMainZoom(zoomEvent); }

  zoomMinimap(zoomEvent) { this.zoomManager.onMinimapZoom(zoomEvent); }

  zoomIn() { this.zoomManager.zoomIn(); }

  zoomOut() { this.zoomManager.zoomOut(); }

  zoomToRoot() {
    if (!this.main.root) return;
    const allNodes = this.main.root.getAllNodes(false);
    if (!allNodes || allNodes.length === 0) return;
    const bbox = computeBoundingBox(this, allNodes);
    const { fitK, fitTransform } = this.zoomManager.computeFit(bbox);
    this.main.fitK = fitK || 1.0;
    this.main.fitTransform = fitTransform;
    this.minimap.updateScaleIndicator?.();
    this.zoomToBoundingBox(bbox);
  }

  zoomReset() { this.zoomManager.zoomReset(); this.deselectAll(); }

  zoomClicked(event, [x, y]) {
    event.stopPropagation();
    this.main.svg.transition().duration(750).call(
        this.main.zoom.transform,
        d3.zoomIdentity
          .translate(this.main.width / 2, this.main.height / 2)
          .scale(40)
          .translate(-x, -y),
        d3.pointer(event)
      );
  }

  zoomToNodeById(nodeId) {
    
    const node = this.main.root.getNode(nodeId);
    if (node) {
      return this.zoomToNode(node);
    }

    console.error("zoomToNodeById: Node not found:", nodeId);
    return null;
  }

  setStatusToNodeById(nodeId, status) {
    
    const node = this.main.root.getNode(nodeId);
    if (node) {
      try {
        node.status = status;
      } catch (e) {
        console.warn('setStatusToNodeById: Failed to update status for node:', nodeId, e);
      }
    }
    else {
      console.error("setStatusToNodeById: Node not found:", nodeId);
    }

    return null;
  }

  zoomRandom(dashboard) {
    const nodes = dashboard.main.root.getAllNodes();
    const node = nodes[Math.floor(Math.random() * nodes.length)];
    return this.zoomToNode(node);
  }

  selectNode(node) {
  // Exclusive single selection: clear previous and select only this node
  this.deselectAll();
  node.selected = true;
  // Clear any previous neighborhood when manually selecting
  this.selection.neighborhood = null;
  // Draw bounding box for the single selected node
  let bbox = computeBoundingBox(this, [node]);
  // If node has no incoming or outgoing edges, also zoom to a sane bbox
  const hasNoEdges = (!node.edges || ((node.edges.incoming?.length || 0) === 0 && (node.edges.outgoing?.length || 0) === 0));
  if (hasNoEdges) {
    const k = this.main.transform.k || 1;
    const minPx = 80; // minimum size on screen to avoid over-zooming
    const minWorld = minPx / k;
    const cx = bbox.x + bbox.width / 2;
    const cy = bbox.y + bbox.height / 2;
    const w = Math.max(bbox.width, minWorld);
    const h = Math.max(bbox.height, minWorld);
    bbox = { x: cx - w / 2, y: cy - h / 2, width: w, height: h };
  }
  this.renderSelectionBoundingBox(bbox);
  }

  getSelectedNodes() {
    return this.main.root.getAllNodes(true);
  }

  getStructure() {
    if (!this.main.root) return null;
    
    var nodes = this.main.root.getAllNodes(false, true);
    const edges = [];
    this.main.root.getAllEdges(false,edges);

    const structureNodes = nodes.map((node) => {
      return {
        Id: node.id,
      };
    });

    const structureEdges = edges.map((edge) => {
      return {
        Source: edge.source.id,
        Target: edge.target.id,
        Id: edge.id,
      };
    });

    return { Nodes: structureNodes, Edges: structureEdges };
  }

  /**
   * Re-evaluate and apply status-based collapse logic to all nodes
   * This method is called when toggleCollapseOnStatusChange setting changes
   */
  updateStatusBasedCollapse() {
    if (!this.main.root) return;
    
    const nodes = this.main.root.getAllNodes(false, true);
    if (!nodes || nodes.length === 0) return;

    let hasChanges = false;

    // Re-evaluate collapse state for each node based on current status and new setting
    nodes.forEach(node => {
      if (node && typeof node.status !== 'undefined') {
        // Safety check: only process nodes with valid elements
        if (!node.element) {
          console.warn('Skipping node with null element in updateStatusBasedCollapse:', node.id);
          return;
        }
        
        // Determine if this node should be collapsed based on current status
        const shouldCollapse = this.data.settings.toggleCollapseOnStatusChange && 
          [NodeStatus.READY, NodeStatus.DISABLED, NodeStatus.UPDATED, NodeStatus.SKIPPED].includes(node.status);
        
        // Only change state if it's different from current
        if (shouldCollapse !== node.collapsed) {
          hasChanges = true;
         
          // Use the collapsed setter to ensure proper state management and trigger expand/collapse methods
          try {
            node.collapsed = shouldCollapse;
          } catch (e) {
            console.warn('Failed to change collapse state for node:', node.id, e);
          }
        }
      }
    });

    // If there were changes, restart the simulation to recalculate the layout
    if (hasChanges && this.main.root) {
     
      // Restart simulation to recalculate layout with new collapsed/expanded states
      this.main.root.cascadeRestartSimulation();
      
      // Update the display to show the new layout
      this.main.root.update();
    }

    // Trigger display update to reflect changes
    this.onMainDisplayChange();
  }

  deselectAll() {
    const nodes = this.getSelectedNodes();
    nodes.forEach((node) => node.selected = false);

    const edges = [];
    this.main.root.getAllEdges(true, edges);
    edges.forEach((edge) => edge.selected = false);

    // Clear neighborhood selection context
    this.selection.neighborhood = null;
  // Remove any selection bounding box
  this.clearSelectionBoundingBox();
  }

  
  zoomToNode(node) {
    const neighbors = node.getNeighbors(this.data.settings.selector);

    this.deselectAll();
    neighbors.nodes.forEach((node) => node.selected = true);
    neighbors.edges.forEach((edge) => edge.selected = true);

    // If the node has no neighbors beyond itself, compute a sane bbox to avoid over-zoom
    let boundingBox = computeBoundingBox(this, neighbors.nodes);
    const onlySelf = neighbors && neighbors.nodes && neighbors.nodes.length > 0
      ? neighbors.nodes.every(n => n === node)
      : true;
    if (onlySelf) {
      boundingBox = this.computeSaneNodeBoundingBox(node);
    }

    // Store neighborhood context for subsequent dblclick handling
    this.selection.neighborhood = {
      nodes: neighbors.nodes,
      edges: neighbors.edges,
      boundingBox
    };

  // Always draw selection bounding box for neighborhood selection
  this.renderSelectionBoundingBox(boundingBox);

    this.main.boundingbox = {
      boundingBox: boundingBox,
      x: boundingBox.x,
      y: boundingBox.y,
      width: boundingBox.width,
      height: boundingBox.height,
      scale: this.main.transform.k,
    };

    this.zoomToBoundingBox(boundingBox);

    return this.main.boundingbox;
  }

  // Double-click behavior:
  // - If a neighborhood bbox is active and the dblclick is inside it, zoom to bbox
  // - Otherwise zoom to node
  handleNodeDblClick(node, event) {
    const nb = this.selection.neighborhood;
    if (nb && nb.boundingBox) {
      // If an event is available, determine pointer in SVG coordinates
      // Fallback: if the node is part of the neighborhood, consider it inside
      const insideByNode = nb.nodes && nb.nodes.indexOf(node) !== -1;
      let insideByPoint = false;
      try {
        if (event && this.main.container) {
          const [px, py] = d3.pointer(event, this.main.container.node());
          const b = nb.boundingBox;
          insideByPoint = px >= b.x && px <= b.x + b.width && py >= b.y && py <= b.y + b.height;
        }
      } catch {}
      if (insideByPoint || insideByNode) {
        this.zoomToBoundingBox(nb.boundingBox);
        return;
      }
    }
    // Default: zoom to the specific node; if node has no neighbors, ensure a sane bbox
    const neighbors = node.getNeighbors(this.data.settings.selector);
    const onlySelf = neighbors && neighbors.nodes && neighbors.nodes.length > 0
      ? neighbors.nodes.every(n => n === node)
      : true;
    if (onlySelf) {
      const bbox = this.computeSaneNodeBoundingBox(node);
      this.deselectAll();
      node.selected = true;
      this.selection.neighborhood = { nodes: [node], edges: [], boundingBox: bbox };
  this.renderSelectionBoundingBox(bbox);
      this.zoomToBoundingBox(bbox);
    } else {
      this.zoomToNode(node);
    }
  }

  zoomToBoundingBox(boundingBox) { this.zoomManager.zoomToBoundingBox(boundingBox, { animate: true, duration: 500 }); }

  showLoading() {
    console.log('📊 Dashboard.showLoading() called');
    const container = resolveLoadingHost(this.main?.svg);
    console.log('📊 Dashboard.showLoading() - Using container:', container);
    LoadingOverlay.show(container);
  }
  hideLoading() {
    console.log('📊 Dashboard.hideLoading() called');
    LoadingOverlay.hide();
  }
}


export function getImmediateNeighbors(baseNode, graphData) {
  const neighbors = [baseNode];

  for (const node of graphData.nodes()) {
    if (baseNode.data.parentIds.includes(node.data.id) || baseNode.data.childrenIds.includes(node.data.id)) {
      neighbors.push(node);
    }
  }

  return neighbors;
}

export function computeBoundingBox(dashboard, nodes) {
  const padding = 2;

  let [minX, minY, maxX, maxY] = [Infinity, Infinity, -Infinity, -Infinity];

  const updateBounds = (x, y, width, height) => {
    minX = Math.min(minX, x - (width / 2));
    minY = Math.min(minY, y - height / 2);
    maxX = Math.max(maxX, x + width / 2);
    maxY = Math.max(maxY, y + height / 2);
  };

  nodes.forEach((node) => {
    let dimensions;
    try {
      dimensions = getBoundingBoxRelativeToParent(node.element, dashboard.main.container);
    } catch {
      dimensions = null;
    }
    if (!dimensions || !isFinite(dimensions.width) || !isFinite(dimensions.height)) {
      // Skip nodes that are not rendered/visible (e.g., collapsed descendants removed from DOM)
      const hasDom = !!(node?.element && typeof node.element.node === 'function' && node.element.node());
      const isVisible = (node?.visible !== false);
      if (!hasDom || !isVisible) {
        return;
      }
      // Fallback to effective size when DOM bbox is unavailable but node is visible
      const nx = (typeof node.x === 'number') ? node.x : 0;
      const ny = (typeof node.y === 'number') ? node.y : 0;
      const nw = (typeof node.getEffectiveWidth === 'function')
        ? node.getEffectiveWidth()
        : ((node.data && typeof node.data.width === 'number') ? node.data.width : (typeof node.width === 'number' ? node.width : 0));
      const nh = (typeof node.getEffectiveHeight === 'function')
        ? node.getEffectiveHeight()
        : ((node.data && typeof node.data.height === 'number') ? node.data.height : (typeof node.height === 'number' ? node.height : 0));
      minX = Math.min(minX, nx - nw / 2);
      minY = Math.min(minY, ny - nh / 2);
      maxX = Math.max(maxX, nx + nw / 2);
      maxY = Math.max(maxY, ny + nh / 2);
      return;
    }
    minX = Math.min(minX, dimensions.x);
    minY = Math.min(minY, dimensions.y);
    maxX = Math.max(maxX, dimensions.x + dimensions.width);
    maxY = Math.max(maxY, dimensions.y + dimensions.height);

  });


  return {
    x: minX - padding,
    y: minY - padding,
    width: maxX - minX + 2 * padding,
    height: maxY - minY + 2 * padding,
  };
}

function calculateScaleAndTranslate(boundingBox, dashboard) {
  let correctedCanvasHeight = dashboard.main.canvas.height;
  let correctedCanvasWidth = dashboard.main.canvas.width;
  if (
    dashboard.main.canvas.width / dashboard.main.canvas.height >
    dashboard.main.view.width / dashboard.main.view.height
  ) {
    correctedCanvasHeight = dashboard.main.canvas.width * (dashboard.main.view.height / dashboard.main.view.width);
  } else {
    correctedCanvasWidth = dashboard.main.canvas.height * (dashboard.main.view.width / dashboard.main.view.height);
  }

  let scale;
  if (dashboard.layout.horizontal) {
    scale = Math.min(correctedCanvasWidth / boundingBox.width, correctedCanvasHeight / boundingBox.height);
  } else {
    scale = Math.min(correctedCanvasWidth / boundingBox.width, correctedCanvasHeight / boundingBox.height);
  }
  const isHorizontalBoundingBox = boundingBox.width / boundingBox.height > correctedCanvasWidth / correctedCanvasHeight;

  const visualHeight = boundingBox.width * (correctedCanvasHeight / correctedCanvasWidth);
  const heightCorrection = (visualHeight - boundingBox.height) * 0.5;

  const visualWidth = boundingBox.height * (correctedCanvasWidth / correctedCanvasHeight);
  const widthCorrection = (visualWidth - boundingBox.width) * 0.5;

  let translateX = -boundingBox.x * scale;
  let translateY = -boundingBox.y * scale;

  if (dashboard.minimap.canvas.isHorizontalCanvas) translateY -= dashboard.minimap.canvas.whiteSpaceY;
  else translateX -= dashboard.minimap.canvas.whiteSpaceX;

  if (isHorizontalBoundingBox) translateY += heightCorrection * scale;
  else translateX += widthCorrection * scale;

  return {
    scale: scale,
    translate: {
      x: translateX,
      y: translateY,
    },
  };
}




export function createAndInitDashboard(dashboardData, mainDivSelector, thirdArg = null) {  
  let minimapDivSelector = null;
  if (thirdArg && typeof thirdArg === 'string') {
    minimapDivSelector = thirdArg;
  } else if (thirdArg && typeof thirdArg === 'object') {
    const userSettings = (dashboardData && dashboardData.settings) ? dashboardData.settings : {};
    dashboardData.settings = ConfigManager.mergeWithDefaults({ ...userSettings, ...thirdArg });
  }
  const dashboard = new Dashboard(dashboardData);
  dashboard.initialize(mainDivSelector, minimapDivSelector);
  return dashboard;
}

export async function loadDashboardFromFile(mainDivSelector, selectedFile, applySettings) {
  let dashboard = null;
  try {
    showLoading();
    const dashboardData = await fetchDashboardFile(selectedFile);
    if (typeof applySettings === 'function') {
      try { applySettings(dashboardData); } catch {}
    }
    dashboard = new Dashboard(dashboardData);
    dashboard.initialize(mainDivSelector);
    return dashboard;
  } catch (e) {
    hideLoading();
    throw e;
  }
}

export function setDashboardProperty(dashboardObject, propertyPath, value) {
  const properties = propertyPath.split('.');
  let obj = dashboardObject;
  for (let i = 0; i < properties.length - 1; i++) {
    obj = obj[properties[i]];
  }
  obj[properties[properties.length - 1]] = value;

  try {
    // Handle immediate visual updates for non-minimap properties
    if (propertyPath.endsWith('showBoundingBox') || propertyPath.includes('.showBoundingBox')) {
      const dash = dashboardObject;
      const show = !!value;
      if (!show) {
        dash.clearSelectionBoundingBox?.();
      } else {
        // Re-render bbox for current selection if present
        const nb = dash.selection?.neighborhood;
        if (nb?.boundingBox) {
          dash.renderSelectionBoundingBox(nb.boundingBox);
        } else if (typeof dash.getSelectedNodes === 'function') {
          const sel = dash.getSelectedNodes();
          if (sel && sel.length) {
            const bbox = computeBoundingBox(dash, sel);
            dash.renderSelectionBoundingBox(bbox);
          }
        }
      }
    }

    const isMinimapChange = propertyPath.includes('minimap');
    if (!isMinimapChange) return;

    const dash = dashboardObject;
    const mm = dash.data?.settings?.minimap;
    if (!mm || !dash.minimap?.active) return;

    const recalcSize = () => {
      if (dash.minimap?.svg) {
        dash.minimap.resize();
      }
    };

    if (propertyPath.endsWith('minimap.size') || propertyPath.includes('.minimap.size')) {
      recalcSize();
      dash.minimap.update();
      dash.minimap.scale = Math.min(dash.minimap.width / dash.main.width, dash.minimap.height / dash.main.height);
      dash.minimap.position();
    }

    if (propertyPath.endsWith('minimap.position') || propertyPath.includes('.minimap.position')) {
      dash.minimap.position();
    }

    if (propertyPath.endsWith('minimap.collapsedIcon.position') || propertyPath.includes('.minimap.collapsedIcon.position')) {
      dash.minimap.position();
    }

    if (propertyPath.endsWith('minimap.collapsed') || propertyPath.includes('.minimap.collapsed')) {
      dash.minimap.setCollapsed(!!value, true);
    }

    if (propertyPath.endsWith('minimap.mode') || propertyPath.includes('.minimap.mode')) {
      const newMode = (value === 'hidden') ? 'disabled' : value;
      mm.mode = newMode;
      if (newMode === 'always') {
        mm.enabled = true;
        mm.pinned = true;
      } else if (newMode === 'hover') {
        mm.pinned = false;
      } else if (newMode === 'disabled') {
        dash.minimap.setCollapsed(true);
      }
      dash.minimap.position();
      dash.minimap.updateHoverBindings();
    }

    if (propertyPath.endsWith('minimap.pinned') || propertyPath.includes('.minimap.pinned')) {
      dash.minimap.updatePinVisualState();
      dash.minimap.updateVisibilityByZoom();
      dash.minimap.updateHoverBindings();
    }

    if (propertyPath.endsWith('scaleIndicator.visible') || propertyPath.includes('.minimap.scaleIndicator.visible')) {
      const visible = !!value;
      if (visible) {
        if (!dash.minimap.scaleText && dash.minimap.footer) {
          dash.minimap.scaleText = dash.minimap.footer.append('text').attr('class', 'minimap-scale').attr('text-anchor', 'end');
        }
        dash.minimap.scaleText.style('display', 'block');
      } else if (dash.minimap.scaleText) {
        dash.minimap.scaleText.style('display', 'none');
      }
      dash.minimap.position();
      dash.minimap.updateScaleIndicator();
    }
  } catch (e) {
    console.warn('setDashboardProperty post-update failed', e);
  }
}

export { showLoader as showLoading, hideLoader as hideLoading };