// Centralized Loading Overlay Component
// Renders a loading overlay as a DIV (not inside the SVG), with dots layered behind the text

function resolveLoadingContainer(svgSelection) {
  console.log('🎯 resolveLoadingContainer() called with:', svgSelection);
  const explicit = document.querySelector('#graph-container');
  if (explicit) {
    console.log('🎯 resolveLoadingContainer() - Found explicit #graph-container:', explicit);
    return explicit;
  }
  try {
    const node = svgSelection && svgSelection.node ? svgSelection.node() : null;
    if (node && node.parentElement) {
      console.log('🎯 resolveLoadingContainer() - Using SVG parent element:', node.parentElement);
      return node.parentElement;
    }
  } catch {}
  console.log('🎯 resolveLoadingContainer() - Falling back to document.body');
  return document.body;
}

export const LoadingOverlay = {
  el: null,
  dotsEl: null,
  textEl: null,
  timerEl: null,
  stageHistoryEl: null,
  timer: null,
  displayTimer: null,
  baseText: 'initializing',
  shownAt: 0,
  totalStartTime: 0,
  stageStartTime: 0,
  currentStage: 'initializing',
  stageHistory: [],
  MIN_VISIBLE_MS: 350,
  ensure(container) {
    console.log('🔧 LoadingOverlay.ensure() called with container:', container);
    const host = container || resolveLoadingContainer();
    if (!host) {
      console.warn('⚠️ LoadingOverlay.ensure() - No host found');
      return null;
    }
    console.log('🔧 LoadingOverlay.ensure() - Using host:', host);

    // Ensure host can position absolute children relative to itself
    try {
      const cs = (typeof window !== 'undefined' && window.getComputedStyle) ? window.getComputedStyle(host) : null;
      if (cs && cs.position === 'static') host.style.position = 'relative';
    } catch {}

    // Prefer the shared overlay host if present to match other overlays
    let overlayParent = host.querySelector('.zoom-overlay-host') || host;
    console.log('🔧 LoadingOverlay.ensure() - Using overlayParent:', overlayParent);

    // Reuse existing element if found
    this.el = overlayParent.querySelector('#flowdash-loading') || document.getElementById('flowdash-loading');
    console.log('🔧 LoadingOverlay.ensure() - Existing element found:', this.el);
    
    if (!this.el) {
      console.log('🔧 LoadingOverlay.ensure() - Creating new loading element');
      const wrapper = document.createElement('div');
      wrapper.id = 'flowdash-loading';
      wrapper.className = 'flowdash-loading';
      wrapper.setAttribute('role', 'status');
      wrapper.setAttribute('aria-live', 'polite');
      // Minimal inline style: let CSS control layout/visuals, keep pointer events disabled
      wrapper.style.pointerEvents = 'none';

      // Create text and dots spans side-by-side; CSS provides spacing and fonts
      const text = document.createElement('span');
      text.className = 'flowdash-loading__text';
      text.textContent = 'initializing';

      const dots = document.createElement('span');
      dots.className = 'flowdash-loading__dots';

      const timer = document.createElement('span');
      timer.className = 'flowdash-loading__timer';
      timer.textContent = '';

      const stageHistory = document.createElement('div');
      stageHistory.className = 'flowdash-loading__history';
      stageHistory.textContent = '';

      wrapper.appendChild(text);
      wrapper.appendChild(dots);
      wrapper.appendChild(timer);
      wrapper.appendChild(stageHistory);
      overlayParent.appendChild(wrapper);

      this.el = wrapper;
      this.dotsEl = dots;
      this.textEl = text;
      this.timerEl = timer;
      this.stageHistoryEl = stageHistory;
      console.log('🔧 LoadingOverlay.ensure() - Created new element:', this.el);
    } else {
      // Ensure references if element already exists in DOM
      console.log('🔧 LoadingOverlay.ensure() - Reusing existing element');
      this.dotsEl = this.el.querySelector('.flowdash-loading__dots');
      this.textEl = this.el.querySelector('.flowdash-loading__text');
      this.timerEl = this.el.querySelector('.flowdash-loading__timer');
      this.stageHistoryEl = this.el.querySelector('.flowdash-loading__history');
      // If overlay host now exists and the element isn't inside it, move it
      try {
        if (overlayParent && this.el.parentElement !== overlayParent) {
          overlayParent.appendChild(this.el);
        }
      } catch {}
      // Normalize any legacy inline styles from previous versions so CSS controls visuals
      try {
        // Clear wrapper full-bleed positioning/background if previously set
        const ws = this.el.style;
        ws.inset = ''; ws.top = ''; ws.left = ''; ws.right = ''; ws.bottom = '';
        ws.transform = ''; ws.background = ''; ws.zIndex = '';
        // Keep pointer-events none
        ws.pointerEvents = 'none';
        if (!this.dotsEl) {
          const dots = document.createElement('span');
          dots.className = 'flowdash-loading__dots';
          this.el.appendChild(dots);
          this.dotsEl = dots;
        }
        if (!this.textEl) {
          const text = document.createElement('span');
          text.className = 'flowdash-loading__text';
          text.textContent = 'initializing';
          this.el.insertBefore(text, this.el.firstChild);
          this.textEl = text;
        }
        if (!this.timerEl) {
          const timer = document.createElement('span');
          timer.className = 'flowdash-loading__timer';
          this.el.appendChild(timer);
          this.timerEl = timer;
        }
        if (!this.stageHistoryEl) {
          const stageHistory = document.createElement('div');
          stageHistory.className = 'flowdash-loading__history';
          this.el.appendChild(stageHistory);
          this.stageHistoryEl = stageHistory;
        }
        // Remove absolute/stacking inline styles from children so they lay out inline
        const ds = this.dotsEl.style; ds.position = ''; ds.inset = ''; ds.display = ''; ds.placeItems = ''; ds.zIndex = '';
        const ts = this.textEl.style; ts.position = ''; ts.zIndex = ''; ts.fontSize = ''; ts.color = '';
        const tms = this.timerEl?.style; if (tms) { tms.position = ''; tms.zIndex = ''; tms.fontSize = ''; tms.color = ''; }
      } catch {}
    }
    return this.el;
  },
  startDots() {
    this.stopDots();
    let i = 0;
    this.timer = setInterval(() => {
      if (!this.dotsEl) return;
      i = (i + 1) % 4; // 0 → 3
      this.dotsEl.textContent = i === 0 ? '' : Array.from({ length: i }).map(() => '.').join(' ');
    }, 450);
  },
  stopDots() {
    if (this.timer) { clearInterval(this.timer); this.timer = null; }
    if (this.dotsEl) this.dotsEl.textContent = '';
  },
  startDisplayTimer() {
    this.stopDisplayTimer();
    this.displayTimer = setInterval(() => {
      this.updateTimerDisplay();
    }, 100); // Update every 100ms for smooth display
  },
  stopDisplayTimer() {
    if (this.displayTimer) { 
      clearInterval(this.displayTimer); 
      this.displayTimer = null; 
    }
  },
  updateTimerDisplay() {
    if (!this.timerEl || !this.totalStartTime) return;
    
    const now = Date.now();
    const totalMs = now - this.totalStartTime;
    const stageMs = now - this.stageStartTime;
    
    const formatTime = (ms) => {
      if (ms < 1000) return `${ms}ms`;
      return `${(ms / 1000).toFixed(1)}s`;
    };
    
    let timerText = '';
    if (stageMs === totalMs) {
      // Same time, show only total
      timerText = `(${formatTime(totalMs)})`;
    } else {
      // Different times, show both
      timerText = `(${formatTime(stageMs)} / ${formatTime(totalMs)})`;
    }
    
    this.timerEl.textContent = timerText;
  },
  setStage(stageName) {
    const now = Date.now();
    
    // Log stage change with timing
    if (this.currentStage && this.stageStartTime) {
      const stageDuration = now - this.stageStartTime;
      const totalDuration = now - this.totalStartTime;
      console.log(`⏱️ Stage "${this.currentStage}" completed in ${stageDuration}ms (total: ${totalDuration}ms)`);
      
      // Add to stage history
      this.stageHistory.push({
        name: this.currentStage,
        duration: stageDuration,
        endTime: now
      });
      
      // Update stage history display
      this.updateStageHistoryDisplay();
    }
    
    // Start new stage
    this.currentStage = stageName;
    this.stageStartTime = now;
    console.log(`⏱️ Starting stage "${stageName}"`);
    
    // Update display
    if (this.textEl) {
      this.textEl.textContent = stageName;
    }
    this.baseText = stageName;
  },
  updateStageHistoryDisplay() {
    if (!this.stageHistoryEl) return;
    
    const formatTime = (ms) => {
      if (ms < 1000) return `${ms}ms`;
      return `${(ms / 1000).toFixed(1)}s`;
    };
    
    const historyHtml = this.stageHistory.map(stage => 
      `<div class="stage-entry">${stage.name} - ${formatTime(stage.duration)}</div>`
    ).join('');
    
    this.stageHistoryEl.innerHTML = historyHtml;
  },
  show(container) {
    console.log('🔵 LoadingOverlay.show() called with container:', container);
    const el = this.ensure(container);
    if (!el) {
      console.warn('⚠️ LoadingOverlay.show() - No element created by ensure()');
      return;
    }
    console.log('🔵 LoadingOverlay.show() - Element found/created:', el);
    
    const now = Date.now();
    this.shownAt = now;
    
    // Initialize timers if this is the first show
    if (!this.totalStartTime) {
      this.totalStartTime = now;
      this.stageStartTime = now;
      this.currentStage = this.baseText;
      this.stageHistory = [];
      console.log('⏱️ LoadingOverlay.show() - Starting total timer');
    }
    
    el.style.display = 'flex';
    console.log('🔵 LoadingOverlay.show() - Set display to flex, element display:', el.style.display);
    
    // Ensure base label and reset text before starting dots
    if (this.textEl) this.textEl.textContent = this.baseText;
    this.startDots();
    this.startDisplayTimer();
    
    console.log('🔵 LoadingOverlay.show() - Complete. Element visibility:', window.getComputedStyle(el).display);
  },
  hide() {
    console.log('🔴 LoadingOverlay.hide() called');
    if (!this.el) {
      console.warn('⚠️ LoadingOverlay.hide() - No element to hide');
      return;
    }
    const elapsed = Date.now() - this.shownAt;
    const delay = Math.max(0, this.MIN_VISIBLE_MS - elapsed);
    console.log('🔴 LoadingOverlay.hide() - Elapsed:', elapsed, 'ms, delay:', delay, 'ms');
    
    setTimeout(() => {
      if (!this.el) {
        console.warn('⚠️ LoadingOverlay.hide() timeout - No element to hide');
        return;
      }
      
      // Log final timing before hiding
      if (this.totalStartTime) {
        const now = Date.now();
        const totalDuration = now - this.totalStartTime;
        const stageDuration = now - this.stageStartTime;
        console.log(`⏱️ Final stage "${this.currentStage}" completed in ${stageDuration}ms`);
        console.log(`⏱️ Total loading duration: ${totalDuration}ms`);
        
        // Add final stage to history
        this.stageHistory.push({
          name: this.currentStage,
          duration: stageDuration,
          endTime: now
        });
        
        // Reset timers
        this.totalStartTime = 0;
        this.stageStartTime = 0;
        this.currentStage = 'initializing';
      }
      
      console.log('🔴 LoadingOverlay.hide() timeout - Setting display to none');
      this.el.style.display = 'none';
      this.stopDots();
      this.stopDisplayTimer();
      
      // Clear timer display and history
      if (this.timerEl) this.timerEl.textContent = '';
      if (this.stageHistoryEl) this.stageHistoryEl.innerHTML = '';
      
      console.log('🔴 LoadingOverlay.hide() timeout - Complete. Element display:', this.el.style.display);
    }, delay);
  }
};

export function showLoading(containerOrSelector = null) {
  console.log('🟢 showLoading() called with:', containerOrSelector);
  try {
    const container = typeof containerOrSelector === 'string'
      ? document.querySelector(containerOrSelector)
      : containerOrSelector;
    console.log('🟢 showLoading() - Resolved container:', container);
    LoadingOverlay.show(container || resolveLoadingContainer());
  } catch (error) {
    console.error('❌ Error in showLoading():', error);
  }
}

export function hideLoading() {
  console.log('🟡 hideLoading() called');
  try { 
    LoadingOverlay.hide(); 
  } catch (error) {
    console.error('❌ Error in hideLoading():', error);
  }
}

export function setLoadingStage(stageName) {
  console.log('🎬 setLoadingStage() called with:', stageName);
  try {
    LoadingOverlay.setStage(stageName);
  } catch (error) {
    console.error('❌ Error in setLoadingStage():', error);
  }
}

export function setLoadingMessage(message) {
  console.log('📝 setLoadingMessage() called with:', message);
  try {
    if (LoadingOverlay.textEl) {
      LoadingOverlay.textEl.textContent = message;
    }
    LoadingOverlay.baseText = message;
  } catch (error) {
    console.error('❌ Error in setLoadingMessage():', error);
  }
}

// Expose simple globals for legacy pages if a bundler doesn't include module exports
try {
  if (typeof window !== 'undefined') {
    window.showLoading = function(container){ try { showLoading(container); } catch {} };
    window.hideLoading = function(){ try { hideLoading(); } catch {} };
    window.setLoadingMessage = function(message){ try { setLoadingMessage(message); } catch {} };
  }
} catch {}

export { resolveLoadingContainer };


