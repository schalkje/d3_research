import { createNode, createNodes } from "./node.js";
import { getRegisteredNodeTypes } from "./nodeRegistry.js";
import { getBoundingBoxRelativeToParent } from "./utils.js";
import { createMarkers } from "./markers.js";
import { createEdges } from "./edge.js";
import { ConfigManager } from "./configManager.js";
import { fetchDashboardFile } from "./data.js";
import { LoadingOverlay, showLoading as showLoader, hideLoading as hideLoader, resolveLoadingContainer as resolveLoadingHost } from "./loadingOverlay.js";
import { Minimap } from "./minimap.js";

export class Dashboard {
  constructor(dashboardData) {
    // Allow reactive reassignment of data to reinitialize minimap and scene
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

    // log all attributes from data.settings to the console log (removed verbose logs)

    // Use ConfigManager to merge with defaults on initial construction
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
      boundingBox: { x: 0, y: 0, width: 0, height: 0 },
    };

    this.isMainAndMinimapSyncing = false; // isSyncing prevents re-entrant calls and ensures the synchronization code runs only once per zoom action.
    this._displayChangeScheduled = false; // debounce flag for display changes
    this.hasPerformedInitialZoomToRoot = false; // ensure zoomToRoot runs only once after init
  }

  // Get bounding box of all graph content in dashboard coordinates
  getContentBBox() {
    if (!this.main?.root) return { x: -this.main.width / 2, y: -this.main.height / 2, width: this.main.width, height: this.main.height };
    const nodes = this.main.root.getAllNodes(false);
    if (!nodes || nodes.length === 0) return { x: -this.main.width / 2, y: -this.main.height / 2, width: this.main.width, height: this.main.height };
    return computeBoundingBox(this, nodes);
  }

  // Compute the fit transform for a given bounding box without mutating state
  computeFitForBoundingBox(boundingBox) {
    const svgWidth = this.main.width || 1;
    const svgHeight = this.main.height || 1;
    const scaleX = svgWidth / boundingBox.width;
    const scaleY = svgHeight / boundingBox.height;
    const k = Math.min(scaleX, scaleY);
    const x = (-boundingBox.width * k) / 2 - boundingBox.x * k;
    const y = (-boundingBox.height * k) / 2 - boundingBox.y * k;
    const transform = d3.zoomIdentity.translate(x, y).scale(k);
    return { k, x, y, transform };
  }

  // Establish or refresh the "100%" baseline fit-to-container
  recomputeBaselineFit() {
    if (!this.main?.root) return;
    const nodes = this.main.root.getAllNodes(false);
    if (!nodes || nodes.length === 0) return;
    const bbox = computeBoundingBox(this, nodes);
    const fit = this.computeFitForBoundingBox(bbox);
    this.main.fitK = fit.k || 1.0;
    this.main.fitTransform = fit.transform;
    this.minimap.updateScaleIndicator?.();
  }

  // Replace the dashboard data and reinitialize the scene and minimap
  setData(newDashboardData) {
    // Start loading state for the new model
    this._initialLoading = true;
    try { this.showLoading(); } catch {}

    // Merge settings with defaults without losing user overrides
    const userSettings = (newDashboardData && newDashboardData.settings) ? newDashboardData.settings : {};
    // Assign directly to the backing field to avoid triggering the setter recursion
    this._data = newDashboardData || {};
    this._data.settings = ConfigManager.mergeWithDefaults(userSettings);
    // Ensure aspect ratio is available for nodes that rely on it during sizing
    // Use current main.divRatio when present to avoid NaN computations in nodes
    try {
      const fallbackRatio = (this.main && this.main.divRatio) ? this.main.divRatio : (16 / 9);
      if (!this._data.settings.divRatio || !(this._data.settings.divRatio > 0)) {
        this._data.settings.divRatio = fallbackRatio;
      }
    } catch {}

    // Clear main SVG and rebuild root
    if (this.main?.svg) {
      this.main.svg.selectAll('*').remove();
    }

    // Recreate container and dashboard content
    this.main.container = this.createContainer(this.main, "dashboard");
    this.main.root = this.createDashboard(this.data, this.main.container);

    // Rebind interactions on the new root
    this.main.root.onClick = (node) => this.selectNode(node);
    this.main.root.onDblClick = (node) => this.zoomToNode(node);
    this.main.root.onDisplayChange = () => { this.onMainDisplayChange(); };

    // Ensure zoom behavior is bound to the current SVG
    if (this.main.zoom) {
      this.main.svg.call(this.main.zoom);
    } else {
      this.main.zoom = this.initializeZoom();
    }

    // Fully reset the minimap so it matches the new content
    if (this.minimap) {
      try { this.minimap.destroy(); } catch {}
    }
    this.minimap = new Minimap(this);
    this.minimap.initializeEmbedded();

    // Recompute baseline fit and optionally zoom to root
    this.hasPerformedInitialZoomToRoot = false;
    this.recomputeBaselineFit();
    if (this.data.settings.zoomToRoot) {
      this.zoomToRoot();
      this.hasPerformedInitialZoomToRoot = true;
    }

    // Kick a display sync
    this.onMainDisplayChange();
  }

   initialize(mainDivSelector, minimapDivSelector = null) {
    // initialize dashboard
    this.mainDivSelector = mainDivSelector;
    // Show loading overlay immediately before anything else
    try { this.showLoading(); } catch {}
    const div = this.initializeSvg(mainDivSelector);
    this.main.svg = div.svg;
    this.main.width = div.width;
    this.main.height = div.height;
    this.main.divRatio = this.main.width / this.main.height;
    this.main.aspectRatio = this.main.divRatio;
    this.main.pixelToSvgRatio = 1.0; // At 100% zoom, 1 SVG unit = 1 screen pixel
    this.data.settings.divRatio ??= this.main.divRatio;
    this.main.onDragUpdate = this.onDragUpdate;

    // Show loading as soon as rendering a new model starts
    this._initialLoading = true;
    this.showLoading();

    this.main.container = this.createContainer(this.main, "dashboard");
    this.main.root =  this.createDashboard(this.data, this.main.container);

    this.main.zoom = this.initializeZoom();
    this.main.root.onClick = (node) => this.selectNode(node);
    this.main.root.onDblClick = (node) => this.zoomToNode(node);

    // initialize minimap (embedded)
    this.minimap.initializeEmbedded();
    this.main.root.onDisplayChange = () => {
      this.onMainDisplayChange();
    };

    if (this.data.settings.zoomToRoot) {
      this.zoomToRoot();
      this.hasPerformedInitialZoomToRoot = true;
    }
    

    // Initialize fullscreen toggle button after setup
    this.initializeFullscreenToggle();

    // Preserve zoom and center on normal window resizes (when not fullscreen)
    if (typeof window !== 'undefined') {
      this._onWindowResize = () => {
        if (this.main.svg.classed('flowdash-fullscreen')) return; // fullscreen path handles its own resizes
        this.applyResizePreserveZoom();
      };
      window.addEventListener('resize', this._onWindowResize);
    }
    // Mark component as initialized so subsequent data assignments trigger reinit
    this._isInitialized = true;
  }



  initializeEmbeddedMinimap() {
    const mm = this.data.settings.minimap;
    if (!mm || mm.enabled === false) {
      // Performance optimization: Skip minimap entirely if disabled
      this.minimap.active = false;
      return;
    }

    // Determine mode defaults by environment
    const isSmallScreen = typeof window !== 'undefined' && (window.innerWidth || 0) < 600;
    let mode = this.data.settings.minimap.mode || (isSmallScreen ? 'disabled' : 'hover');
    if (mode === 'hidden') mode = 'disabled';
    this.data.settings.minimap.mode = mode;

    // Disabled mode: do not create the cockpit at all
    if (mode === 'disabled') {
      this.data.settings.minimap.enabled = false;
      return;
    }

    // Persistent collapsed state
    if (mm.persistence && mm.persistence.persistCollapsedState && typeof window !== 'undefined') {
      try {
        const persisted = window.localStorage.getItem(mm.persistence.storageKey);
        if (persisted !== null) {
          this.data.settings.minimap.collapsed = persisted === 'true';
        }
      } catch {}
    }
    // In 'always' mode, force cockpit to be visible/enabled and pinned by default
    if (mode === 'always') {
      this.data.settings.minimap.enabled = true;
      this.data.settings.minimap.collapsed = false;
      this.data.settings.minimap.pinned = true;
    }
    if (mode === 'hover' && typeof this.data.settings.minimap.collapsed === 'undefined') {
      this.data.settings.minimap.collapsed = true; // show button by default
    }

    // Create overlay DIV inside the graph container (separate from main SVG)
    const graphContainer = this.main.svg.node().parentElement;
    // Ensure host container does not cause page scrollbars when overlays are positioned
    try {
      graphContainer.style.position = graphContainer.style.position || 'relative';
      graphContainer.style.overflow = 'hidden';
    } catch {}
    const cockpitDiv = d3.select(graphContainer)
      .append('div')
      .attr('class', 'zoom-cockpit');
    this.minimap.cockpit = cockpitDiv;
    this.minimap.overlay = cockpitDiv; // alias for existing code paths
    // Create an inner SVG to host minimap UI and content
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

    // Collapsed icon (always rendered; visibility toggled)
    this.minimap.collapsedIcon = this.minimap.content.append('g')
      .attr('class', 'minimap-collapsed-icon')
      .style('cursor', 'pointer')
      .style('pointer-events', 'all');
    // Simple square icon placeholder; themes can override
    this.minimap.collapsedIcon.append('rect').attr('class', 'collapsed-icon-bg').attr('width', 20).attr('height', 14).attr('rx', 2).attr('ry', 2);
    this.minimap.collapsedIcon.append('rect').attr('class', 'collapsed-icon-mini').attr('x', 4).attr('y', 3).attr('width', 12).attr('height', 8);
    this.minimap.collapsedIcon.on('click', () => {
      this.setMinimapCollapsed(false, true);
    });

    // Header (pin, collapse, size switch)
    this.minimap.header = this.minimap.content.append('g').attr('class', 'minimap-header');
    this.minimap.headerHeight = 20;

    // Collapse and Pin buttons when expanded
    this.minimap.collapseButton = this.minimap.header.append('g').attr('class', 'minimap-collapse-button').style('cursor', 'pointer');
    this.minimap.collapseButton.append('rect').attr('class', 'collapse-btn-bg').attr('width', 16).attr('height', 16).attr('rx', 3).attr('ry', 3);
    // triangle-down shape
    this.minimap.collapseButton.append('path').attr('class', 'collapse-btn-icon').attr('d', 'M2,6 L14,6 L8,12 Z');
    this.minimap.collapseButton.on('click', () => {
      // Hide cockpit only; do not change pin/mode
      this.setMinimapCollapsed(true, true);
    });

    this.minimap.pinButton = this.minimap.header.append('g').attr('class', 'minimap-pin-button').style('cursor', 'pointer')
      .attr('role', 'button')
      .attr('aria-label', 'Pin')
      .attr('aria-pressed', String(!!mm.pinned));
    // Size switcher (cycles s → m → l)
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
      // Use unified sizing method for consistent behavior
      this.resizeMinimap();
      this.minimap.position();
      updateSizeLabel();
      // Notify via callback if provided
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
    // Traditional pin/unpin icon without square background
    // Clear previous children if any rerun occurs
    this.minimap.pinButton.selectAll('*').remove();
    const iconGroup = this.minimap.pinButton.append('g').attr('class', 'pin-icon');
    // Base pushpin shape (16x16 box)
    const pinBasePath = 'M8 2 C9.2 2 10 2.8 10 4 L10 6 L12.5 8 L9 8 L9 12 L7 12 L7 8 L3.5 8 L6 6 L6 4 C6 2.8 6.8 2 8 2 Z';
    // Slash line for unpinned state
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
    // Slight rotation for unpinned to further differentiate visually
    iconGroup.attr('transform', mm.pinned ? 'rotate(0,8,8)' : 'rotate(-20,8,8)');
    this.minimap.pinButton.append('title').text('Pin (toggle pinned / hover)');
    this.minimap.pinButton.on('click', () => {
      mm.pinned = !mm.pinned;
      this.data.settings.minimap.mode = mm.pinned ? 'always' : 'hover';
      // Clear any pending timers and reset interaction state on mode change
      if (this.minimap.state.showTimer) { clearTimeout(this.minimap.state.showTimer); this.minimap.state.showTimer = null; }
      if (this.minimap.state.hideTimer) { clearTimeout(this.minimap.state.hideTimer); this.minimap.state.hideTimer = null; }
      this.minimap.state.interacting = false;
      this.updatePinVisualState();
      this.minimap.updateHoverBindings();
    });

    // Create minimap svg and inner content group
    this.minimap.svg = this.minimap.content.append('svg').attr('class', 'minimap-svg');
    this.minimap.container = this.minimap.svg.append('g').attr('class', 'minimap');

    // Use unified sizing method for consistent behavior
    this.resizeMinimap();

    // Initialize behaviors and content
    this.initializeMinimap();

    // Footer bar (controls + scale)
    this.minimap.footer = this.minimap.content.append('g').attr('class', 'minimap-footer');
    this.minimap.footerHeight = 20;
    // Scale indicator in footer
    if (mm.scaleIndicator?.visible !== false) {
      this.minimap.scaleText = this.minimap.footer.append('text').attr('class', 'minimap-scale').attr('text-anchor', 'end');
    }

    // Controls: zoom in/out/reset
    const makeButton = (group, className, onClick) => {
      const g = group.append('g').attr('class', `minimap-btn ${className}`).style('cursor', 'pointer');
      // Button background for clear affordance
      g.append('rect').attr('class', 'btn-bg').attr('width', 16).attr('height', 16).attr('rx', 3).attr('ry', 3);
      g.on('click', (ev) => { ev.stopPropagation(); onClick(); });
      return g;
    };
    this.minimap.controls = this.minimap.footer.append('g').attr('class', 'minimap-controls');
    // Icons as simple shapes
    this.minimap.btnZoomIn = makeButton(this.minimap.controls, 'zoom-in', () => this.zoomIn());
    this.minimap.btnZoomIn.append('rect').attr('class', 'icon plus-h').attr('x', 3).attr('y', 7).attr('width', 10).attr('height', 2);
    this.minimap.btnZoomIn.append('rect').attr('class', 'icon plus-v').attr('x', 7).attr('y', 3).attr('width', 2).attr('height', 10);

    this.minimap.btnZoomOut = makeButton(this.minimap.controls, 'zoom-out', () => this.zoomOut());
    this.minimap.btnZoomOut.append('rect').attr('class', 'icon minus').attr('x', 3).attr('y', 7).attr('width', 10).attr('height', 2);

    this.minimap.btnReset = makeButton(this.minimap.controls, 'reset', () => this.zoomReset());
    this.minimap.btnReset.append('circle').attr('class', 'icon target-outer').attr('cx', 8).attr('cy', 8).attr('r', 5);
    this.minimap.btnReset.append('circle').attr('class', 'icon target-inner').attr('cx', 8).attr('cy', 8).attr('r', 1.5);

    // Invisible hit rects to stabilize hover over header/footer rows
    this.minimap.headerHitRect = this.minimap.header.append('rect').attr('class', 'minimap-header-hit').attr('fill', 'transparent');
    this.minimap.footerHitRect = this.minimap.footer.append('rect').attr('class', 'minimap-footer-hit').attr('fill', 'transparent');
    // Ensure hit-rects sit underneath interactive controls so they don't block clicks
    if (this.minimap.headerHitRect) this.minimap.headerHitRect.lower();
    if (this.minimap.footerHitRect) this.minimap.footerHitRect.lower();

    // Ensure chrome sits on top
    if (this.minimap.header) this.minimap.header.raise();
    if (this.minimap.footer) this.minimap.footer.raise();

    // Position overlay
    this.positionEmbeddedMinimap();

    // Setup hover bindings based on current mode
    this.minimap.updateHoverBindings();

    // Initial collapsed state
    this.minimap.setCollapsed(mm.collapsed === true);
    this.minimap.updateVisibilityByZoom();
    this.minimap.updatePinVisualState();
  }















  initializeFullscreenToggle() {
    const graphContainer = this.main.svg.node().parentElement;
    // Create a separate overlay DIV for fullscreen toggle
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

      // Capture previous canvas and transform
      const prevWidth = this.main.width;
      const prevHeight = this.main.height;
      const prevK = this.main.transform.k;
      const prevX = this.main.transform.x;
      const prevY = this.main.transform.y;

      // Compute current world viewport from previous values
      const worldLeft = (prevX + prevWidth / 2) / -prevK;
      const worldTop = (prevY + prevHeight / 2) / -prevK;
      const worldWidth = prevWidth / prevK;
      const worldHeight = prevHeight / prevK;
      const worldCenterX = worldLeft + worldWidth / 2;
      const worldCenterY = worldTop + worldHeight / 2;

      // Apply new canvas size
      const newWidth = rect.width;
      const newHeight = rect.height;
      this.main.width = newWidth;
      this.main.height = newHeight;
      this.main.divRatio = newWidth / newHeight;
      this.main.svg.attr('viewBox', [-newWidth / 2, -newHeight / 2, newWidth, newHeight]);

      // Preserve previous zoom level (k) and world center; canvas shows more/less world as size changes
      const newK = prevK;
      const newWorldWidth = newWidth / newK;
      const newWorldHeight = newHeight / newK;
      const newLeft = worldCenterX - newWorldWidth / 2;
      const newTop = worldCenterY - newWorldHeight / 2;
      const newTransform = d3.zoomIdentity
        .translate(-newLeft * newK - newWidth / 2, -newTop * newK - newHeight / 2)
        .scale(newK);

      // Minimap sizing with fixed monitor pixel size
      if (this.minimap.active) {
        // Use unified sizing method for consistent behavior
        this.minimap.resize();
      }

      // Apply transform to keep relative zoom consistent
      this.main.transform = { k: newK, x: newTransform.x, y: newTransform.y };
      this.main.container.attr('transform', newTransform);
      this.main.svg.call(this.main.zoom.transform, newTransform);

      // Recompute the fit (100%) baseline for the new viewport
      this.recomputeBaselineFit();

      // Update minimap clone and eye position
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

  // Recompute sizes when the browser window resizes (not fullscreen)
  applyResizePreserveZoom() {
    const rect = this.main.svg.node().getBoundingClientRect();

    // Previous canvas and transform
    const prevWidth = this.main.width || 1;
    const prevHeight = this.main.height || 1;
    const prevK = this.main.transform.k;
    const prevX = this.main.transform.x;
    const prevY = this.main.transform.y;

    // Ratios for proportional adaptation
    const newWidth = rect.width || prevWidth;
    const newHeight = rect.height || prevHeight;
    const widthRatio = newWidth / prevWidth;
    const heightRatio = newHeight / prevHeight;

    // Update canvas metrics and viewBox
    this.main.width = newWidth;
    this.main.height = newHeight;
    this.main.divRatio = newWidth / newHeight;
    this.main.aspectRatio = this.main.divRatio;
    this.main.svg.attr('viewBox', [-newWidth / 2, -newHeight / 2, newWidth, newHeight]);

    // Preserve zoom level and proportionally adapt translation
    const newK = prevK;
    const newX = prevX * widthRatio;
    const newY = prevY * heightRatio;
    const newTransform = d3.zoomIdentity.translate(newX, newY).scale(newK);

    // Minimap keeps constant screen size; recalc via unified sizing
    if (this.minimap.active) this.minimap.resize();

    // Apply transform and propagate to zoom behaviors
    this.main.transform = { k: newK, x: newX, y: newY };
    this.main.container.attr('transform', newTransform);
    this.main.svg.call(this.main.zoom.transform, newTransform);

    // Refresh 100% baseline for new dimensions
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
      node.status = status;
    } else {
      console.error("updateNodeStatus: Node not found:", nodeId);
    }
  }

  updateDatasetStatus(datasetId, status) {
    // console.log("updateDatasetStatus", datasetId, status);
    let stateUpdated = false;
    const nodes = this.main.root.getNodesByDatasetId(datasetId);
    if (nodes && nodes.length > 0) {
      for (const node of nodes) {
        node.status = status;
        stateUpdated = true;
      }
    }
    return stateUpdated; 
  }

  createContainer(parentContainer, className) {
    // create background rect
    // create a container, to enable zooming and panning
    parentContainer.svg.selectAll("*").remove(); // clear the svg

    const container = parentContainer.svg.append("g").attr("class", `${className}`);    

    return container;
  }

  initializeSvg(divSelector) {
    const svg = d3.select(`${divSelector}`);
    svg.selectAll("*").remove(); // clear the svg
    
    const { width, height } = svg.node().getBoundingClientRect();

    svg.attr("viewBox", [-width / 2, -height / 2, width, height]);

    const onDragUpdate = null;

    return { svg, width, height, onDragUpdate };
  }

  createDashboard(dashboard, container) {
    
    createMarkers(container);

    var root;
    if (dashboard.nodes.length == 1) {
      root = createNode(dashboard.nodes[0], container, dashboard.settings);
      
      // For single nodes, ensure they are positioned at the center of the dashboard
      if (root) {
        // All nodes (both container and regular) use center-based positioning
        // so they can all be positioned at (0,0)
        root.move(0, 0);
      }
    } else {
      root = createNodes(dashboard.nodes, container, dashboard.settings);
      
      // The dashboard is responsible for positioning the LaneNode at the center
      if (root && root.isContainer) {
        // Center the container node at (0,0) - this is the dashboard's responsibility
        root.move(0, 0);
      }
    }

    if (!root) {
      console.error("Failed to create node - root is null");
      return null;
    }

    root.init();

    this.initializeChildrenStatusses(root);

    if (dashboard.edges.length > 0) createEdges(root, dashboard.edges, dashboard.settings);

    // Add debug circle in the middle of the dashboard (drawn last to appear on top)
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

    
    return root;
  }

  initializeChildrenStatusses(node) {
    // apply status to all nodes without a status based on children status
    var allNodes = node.getAllNodes();
    // iterate over all nodes in reverse order

    for (var i = allNodes.length - 1; i >= 0; i--) {
      // if the containernode has no status, set the status based on the children status
      if (allNodes[i].isContainer && (allNodes[i].status == null || allNodes[i].status == "" || allNodes[i].status == "Unknown")) {
        allNodes[i].determineStatusBasedOnChildren();
      } 
    }
  }

  initializeZoom() {

    const dag = null; // todo: remove

    // const svg = this.dashboard.container;
    const dashboard = this;
    const zoom = d3
      .zoom()
      .scaleExtent([0.1, 40])
      .wheelDelta(event => {
        // Custom wheel delta for smoother zooming
        return -event.deltaY * (event.deltaMode ? 120 : 1) * 0.002;
      })
      .on("zoom", (event) => this.zoomMain(event));

    this.main.svg.call(zoom);

    // initialize default zoom buttons
    d3.select("#zoom-in").on("click", () => this.zoomIn(dashboard));

    d3.select("#zoom-out").on("click", () => this.zoomOut(dashboard));

    d3.select("#zoom-reset").on("click", () => this.zoomReset(dashboard));

    d3.select("#zoom-random").on("click", () => this.zoomRandom(dashboard));

    // d3.select("#zoom-node").on("click", () => this.zoomToNodeById("pbdwh_dwh", dashboard));
    d3.select("#zoom-node").on("click", () => this.zoomToRoot(dashboard));

    return zoom;
  }

  onDragUpdate() {
    
  }

  onMainDisplayChange() {
    if (this._displayChangeScheduled) return;
    this._displayChangeScheduled = true;

    requestAnimationFrame(() => {
      // console.log("#######################################");
      // console.log("##### onMainDisplayChange", this);
      // console.log("##### syncing=", this.isMainAndMinimapSyncing);

      if (this.minimap.svg) {
        if (this.isMainAndMinimapSyncing) { this._displayChangeScheduled = false; return; }
        this.isMainAndMinimapSyncing = true;
        // Update the minimap
        this.minimap.update();
        this.isMainAndMinimapSyncing = false;
      }

      // Only perform initial zoom once after initialization
      if (this.data.settings.zoomToRoot && !this.hasPerformedInitialZoomToRoot) {
        this.zoomToRoot();
        this.hasPerformedInitialZoomToRoot = true;
      }

      this.minimap.position();

      // Hide loading once the first full draw/display cycle completes
      if (this._initialLoading) {
        this._initialLoading = false;
        this.hideLoading();
      }

      this._displayChangeScheduled = false;
    });
  }



  zoomMain(zoomEvent) {
    if (this.isMainAndMinimapSyncing) return;
    this.isMainAndMinimapSyncing = true;

    this.main.transform.k = zoomEvent.transform.k;
    this.main.transform.x = zoomEvent.transform.x;
    this.main.transform.y = zoomEvent.transform.y;

    // Apply transform to the main view
    const transform = d3.zoomIdentity.translate(this.main.transform.x, this.main.transform.y).scale(this.main.transform.k);
    this.main.container.attr("transform", transform );

    // Performance optimization: Batch minimap updates with debouncing
    if (this.minimap.active) {
      this.minimap.scheduleUpdate(zoomEvent.transform);
    }

    this.isMainAndMinimapSyncing = false;
  }

  zoomMinimap(zoomEvent) {
    if (this.isMainAndMinimapSyncing) return;
    this.isMainAndMinimapSyncing = true;

    this.main.transform.x = zoomEvent.transform.x;
    this.main.transform.y = zoomEvent.transform.y;
    this.main.transform.k = zoomEvent.transform.k;

    // Apply transform to the main view
    this.main.container.attr("transform", zoomEvent.transform);
    this.main.svg.call(this.main.zoom.transform, zoomEvent.transform);

    // Performance optimization: Batch minimap updates with debouncing
    this.minimap.scheduleUpdate(zoomEvent.transform);

    this.isMainAndMinimapSyncing = false;
  }

  zoomIn() {
    // svg.selectAll(".boundingBox").remove();
    this.main.svg.transition().duration(750).call(this.main.zoom.scaleBy, 1.2);
    this.main.scale = this.main.scale * (1 + this.main.zoomSpeed);
  }

  zoomOut() {
    // svg.selectAll(".boundingBox").remove();
    this.main.svg.transition().duration(750).call(this.main.zoom.scaleBy, 0.8);
    this.main.scale = this.main.scale * (1 - this.main.zoomSpeed);
  }

  zoomToRoot() {
    // Fit the full graph content inside the current viewport using transform only
    if (!this.main.root) return;
    const allNodes = this.main.root.getAllNodes(false);
    if (!allNodes || allNodes.length === 0) return;
    const bbox = computeBoundingBox(this, allNodes);
    // Establish baseline 100% for this content
    const fit = this.computeFitForBoundingBox(bbox);
    this.main.fitK = fit.k || 1.0;
    this.main.fitTransform = fit.transform;
    this.minimap.updateScaleIndicator?.();
    // Then apply the fit transform
    this.zoomToBoundingBox(bbox);
  }

  zoomReset() {
    // Reset to the 100% baseline (fit-to-container)
    const target = this.main.fitTransform || d3.zoomIdentity;
    this.main.svg
      .transition()
      .duration(750)
      .call(this.main.zoom.transform, target);
    this.main.scale = 1;

    if (this.minimap.active)
      this.minimap.svg
        .transition()
        .duration(750)
        .call(this.minimap.zoom.transform, target);

    this.deselectAll();
  }

  zoomClicked(event, [x, y]) {
    event.stopPropagation();
    svg
      .transition()
      .duration(750)
      .call(
        zoom.transform,
        d3.zoomIdentity
          .translate(width / 2, height / 2)
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
      node.status = status;
    }

    console.error("setStatusToNodeById: Node not found:", nodeId);
    return null;
  }

  zoomRandom(dashboard) {
    // todo: remove dag; and get nodes from this.main.root
    const nodes = dashboard.main.root.getAllNodes();
    const node = nodes[Math.floor(Math.random() * nodes.length)];
    return this.zoomToNode(node);
  }

  selectNode(node) {
    
    node.selected = !node.selected;

    // // test status updates:
    // switch (node.status) {
    //   case NodeStatus.NEW:
    //     node.status = NodeStatus.READY;
    //     break;
    //   case NodeStatus.READY:
    //     node.status = NodeStatus.ACTIVE;
    //     break;
    //   case NodeStatus.ACTIVE:
    //     node.status = NodeStatus.WARNING;
    //     break;
    //   case NodeStatus.WARNING:
    //     node.status = NodeStatus.ERROR;
    //     break;
    //   case NodeStatus.ERROR:
    //     node.status = NodeStatus.DISABLED;
    //     break;
    //   case NodeStatus.DISABLED:
    //     node.status = NodeStatus.UNKNOWN;
    //     break;
    //   case NodeStatus.UNKNOWN:
    //     node.status = NodeStatus.NEW;
    //     break;
    //   // otherwise
    //   default:
    //     node.status = NodeStatus.UNKNOWN;
    //     console.log("            Unknown status", node.status);
    // }
  }

  getSelectedNodes() {
    return this.main.root.getAllNodes(true);
  }

  getStructure() {
    if (!this.main.root) return null;
    
    var nodes = this.main.root.getAllNodes(false, true);
    const edges = [];
    this.main.root.getAllEdges(false,edges);

    // strip the nodes and edges to the base structure
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

  deselectAll() {
    // console.log("deselectAllNodes"); 
    const nodes = this.getSelectedNodes();
    // console.log("deselectAllNodes - nodes", nodes); 
    nodes.forEach((node) => node.selected = false);

    const edges = [];
    this.main.root.getAllEdges(true, edges);
    // console.log("deselectAllNodes - edges", edges);
    edges.forEach((edge) => edge.selected = false);

  }

  
  zoomToNode(node) {
    // console.log("zoomToNode", node);
    // 1. Identify the node's immediate neighbors
    const neighbors = node.getNeighbors(this.data.settings.selector);
    // console.log("zoomToNode: neighbors", neighbors);

    // select the node and its neighbors
    this.deselectAll();
    neighbors.nodes.forEach((node) => node.selected = true);
    neighbors.edges.forEach((edge) => edge.selected = true);

    // 2. Compute the bounding box
    const boundingBox = computeBoundingBox(this, neighbors.nodes);
    // console.log("zoomToNode: boundingBox", boundingBox);

    // 3. Calculate the zoom scale and translation
    // const { scale, translate } = calculateScaleAndTranslate(boundingBox, this);
    const scale = this.main.transform.k;

    if (this.data.settings.showBoundingBox) {
      const borderWidth = 2;
      this.main.container.selectAll(".boundingBox").remove();
      this.main.container
        .append("rect")
        .attr("class", "boundingBox")
        .attr("stroke-width", borderWidth)
        .attr("x", boundingBox.x)
        .attr("y", boundingBox.y)
        .attr("width", boundingBox.width)
        .attr("height", boundingBox.height);
    }

    this.main.boundingbox = {
      boundingBox: boundingBox,
      x: boundingBox.x,
      y: boundingBox.y,
      width: boundingBox.width,
      height: boundingBox.height,
      scale: scale,
    };

    // 4. Apply the zoom transform
    // this.main.canvas.svg
    //   .transition()
    //   .duration(750)
    //   .call(this.zoom.transform, d3.zoomIdentity.translate(translate.x, translate.y).scale(scale));
    this.zoomToBoundingBox(boundingBox);

    return this.main.boundingbox;
  }

  zoomToBoundingBox(boundingBox) {
    // Get the dimensions of the SVG viewport
    const svgWidth = this.main.width;
    const svgHeight = this.main.height;

    // Calculate the scale factor to fit the bounding box within the SVG
    const scaleX = svgWidth / boundingBox.width;
    const scaleY = svgHeight / boundingBox.height;
    const scale = Math.min(scaleX, scaleY); // Use the smaller scale to fit within both dimensions

    // Calculate the translation to center the bounding box in the SVG
    this.main.transform.x = (-boundingBox.width * scale) / 2 - boundingBox.x * scale;
    this.main.transform.y = (-boundingBox.height * scale) / 2 - boundingBox.y * scale;
    this.main.transform.k = scale;

    // Apply transform to the main view
    // this.main.container.attr("transform", zoomEvent.transform);
    const transform = d3.zoomIdentity
      .translate(this.main.transform.x, this.main.transform.y)
      .scale(this.main.transform.k);
    this.main.container.attr("transform", transform);

    // Update the viewport in the minimap
    this.minimap.updateViewport(transform);

    // Store the current zoom level at svg level, for the next event
    if (this.minimap.active)
      this.minimap.svg.call(this.minimap.zoom.transform, transform);

    this.isMainAndMinimapSyncing = false;
  }

  // Instance helpers to control a loading overlay
  showLoading() {
    const container = resolveLoadingHost(this.main?.svg);
    LoadingOverlay.show(container);
  }
  hideLoading() {
    LoadingOverlay.hide();
  }
}


export function getImmediateNeighbors(baseNode, graphData) {
  const neighbors = [baseNode];

  // Iterate over all edges to find connected nodes
  for (const node of graphData.nodes()) {
    if (baseNode.data.parentIds.includes(node.data.id) || baseNode.data.childrenIds.includes(node.data.id)) {
      neighbors.push(node);
    }
  }

  return neighbors;
}

export function computeBoundingBox(dashboard, nodes) {
  const padding = 2; // Add some padding

  let [minX, minY, maxX, maxY] = [Infinity, Infinity, -Infinity, -Infinity];

  const updateBounds = (x, y, width, height) => {
    // console.log("computeBoundingBox updateBounds:", x, y, width, height);
    minX = Math.min(minX, x - (width / 2));
    minY = Math.min(minY, y - height / 2);
    maxX = Math.max(maxX, x + width / 2);
    maxY = Math.max(maxY, y + height / 2);
  };
  // console.log(`                   bounds: ${minX}, ${minY}, ${maxX}, ${maxY}`);

  nodes.forEach((node) => {
    // const {
    //   x,
    //   y,
    //   data: { width, height },
    // } = node;

    // const dimensions = getRelativeBBox(node.element)
    const dimensions = getBoundingBoxRelativeToParent(node.element, dashboard.main.container);
    // const dimensions = node.element.node().getBBox();
    // minX = Math.min(minX, dimensions.x - dashboard.main.width / 2);
    // minY = Math.min(minY, dimensions.y - dashboard.main.height / 2);
    // maxX = Math.max(maxX, dimensions.x + dimensions.width - dashboard.main.width / 2);
    // maxY = Math.max(maxY, dimensions.y + dimensions.height - dashboard.main.height / 2);
    minX = Math.min(minX, dimensions.x);
    minY = Math.min(minY, dimensions.y);
    maxX = Math.max(maxX, dimensions.x + dimensions.width);
    maxY = Math.max(maxY, dimensions.y + dimensions.height);

    // console.log("computeBoundingBox dimensions:", node.id, dimensions, node);
    

    // updateBounds(x, y, width, height);
    // console.log("computeBoundingBox node:", node.id, x, y, width, height, x -(width/2));
    if (dashboard?.data?.settings?.debugMode) {
      
    }

      
  });


  return {
    x: minX - padding,
    y: minY - padding,
    width: maxX - minX + 2 * padding,
    height: maxY - minY + 2 * padding,
  };
}

function calculateScaleAndTranslate(boundingBox, dashboard) {
  // correct canvas size for scaling
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

  // compute the scale
  let scale;
  if (dashboard.layout.horizontal) {
    scale = Math.min(correctedCanvasWidth / boundingBox.width, correctedCanvasHeight / boundingBox.height);
  } else {
    scale = Math.min(correctedCanvasWidth / boundingBox.width, correctedCanvasHeight / boundingBox.height);
  }
  const isHorizontalBoundingBox = boundingBox.width / boundingBox.height > correctedCanvasWidth / correctedCanvasHeight;

  // compute the visual height and width of the bounding box
  const visualHeight = boundingBox.width * (correctedCanvasHeight / correctedCanvasWidth);
  const heightCorrection = (visualHeight - boundingBox.height) * 0.5;

  const visualWidth = boundingBox.height * (correctedCanvasWidth / correctedCanvasHeight);
  const widthCorrection = (visualWidth - boundingBox.width) * 0.5;

  // compute the base translation
  let translateX = -boundingBox.x * scale;
  let translateY = -boundingBox.y * scale;

  // add the white space to the translation
  if (dashboard.minimap.canvas.isHorizontalCanvas) translateY -= dashboard.minimap.canvas.whiteSpaceY;
  else translateX -= dashboard.minimap.canvas.whiteSpaceX;

  // add the height correction to the translation
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
  // Support both legacy minimap selector (string) and new options object
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

// Fetch + init with built-in loading start; instance hides when first draw completes
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
  console.warn("setDashboardProperty", dashboardObject, propertyPath, value);
  const properties = propertyPath.split('.');
  let obj = dashboardObject;
  for (let i = 0; i < properties.length - 1; i++) {
    console.warn("                    - ", i, properties[i], obj[properties[i]]);
    obj = obj[properties[i]];
  }
  console.warn("                    - before = ", [properties[properties.length - 1]], obj[properties[properties.length - 1]]);
  obj[properties[properties.length - 1]] = value;
  console.warn("                    -  after = ", [properties[properties.length - 1]], obj[properties[properties.length - 1]]);

  // Live-apply changes to the minimap cockpit so settings are reflected immediately
  try {
    const isMinimapChange = propertyPath.includes('minimap');
    if (!isMinimapChange) return;

    const dash = dashboardObject; // alias
    const mm = dash.data?.settings?.minimap;
    if (!mm || !dash.minimap?.active) return;

    const recalcSize = () => {
      // Use unified sizing so visual size is in monitor pixels
      if (dash.minimap?.svg) {
        dash.minimap.resize();
      }
    };

    if (propertyPath.endsWith('minimap.size') || propertyPath.includes('.minimap.size')) {
      recalcSize();
      dash.minimap.update();
      // Recompute minimap content scale used for drag compensation
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
        // Do not change collapsed state when switching to always; keep visibility as-is
      } else if (newMode === 'hover') {
        mm.pinned = false;
        // Do not change collapsed state when switching to hover
      } else if (newMode === 'disabled') {
        // Cannot destroy easily at runtime; hide cockpit
        dash.minimap.setCollapsed(true);
      }
      dash.minimap.position();
      dash.minimap.updateHoverBindings();
    }

    if (propertyPath.endsWith('minimap.pinned') || propertyPath.includes('.minimap.pinned')) {
      dash.minimap.updatePinVisualState();
      // Pinned strictly controls mode; do not touch collapsed state
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

// Centralized Loading Overlay (shared utility)
// Re-export loading helpers from the component for external usage
export { showLoader as showLoading, hideLoader as hideLoading };