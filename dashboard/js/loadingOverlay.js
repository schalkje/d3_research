// Centralized Loading Overlay Component
// Renders a loading overlay as a DIV (not inside the SVG), with dots layered behind the text

function resolveLoadingContainer(svgSelection) {
  const explicit = document.querySelector('#graph-container');
  if (explicit) return explicit;
  try {
    const node = svgSelection && svgSelection.node ? svgSelection.node() : null;
    if (node && node.parentElement) return node.parentElement;
  } catch {}
  return document.body;
}

export const LoadingOverlay = {
  el: null,
  dotsEl: null,
  textEl: null,
  timer: null,
  baseText: 'initializing',
  shownAt: 0,
  MIN_VISIBLE_MS: 350,
  ensure(container) {
    const host = container || resolveLoadingContainer();
    if (!host) return null;

    // Ensure host can position absolute children relative to itself
    try {
      const cs = (typeof window !== 'undefined' && window.getComputedStyle) ? window.getComputedStyle(host) : null;
      if (cs && cs.position === 'static') host.style.position = 'relative';
    } catch {}

    // Prefer the shared overlay host if present to match other overlays
    let overlayParent = host.querySelector('.zoom-overlay-host') || host;

    // Reuse existing element if found
    this.el = overlayParent.querySelector('#flowdash-loading') || document.getElementById('flowdash-loading');
    if (!this.el) {
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

      wrapper.appendChild(text);
      wrapper.appendChild(dots);
      overlayParent.appendChild(wrapper);

      this.el = wrapper;
      this.dotsEl = dots;
      this.textEl = text;
    } else {
      // Ensure references if element already exists in DOM
      this.dotsEl = this.el.querySelector('.flowdash-loading__dots');
      this.textEl = this.el.querySelector('.flowdash-loading__text');
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
        // Remove absolute/stacking inline styles from children so they lay out inline
        const ds = this.dotsEl.style; ds.position = ''; ds.inset = ''; ds.display = ''; ds.placeItems = ''; ds.zIndex = '';
        const ts = this.textEl.style; ts.position = ''; ts.zIndex = ''; ts.fontSize = ''; ts.color = '';
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
  show(container) {
    const el = this.ensure(container);
    if (!el) return;
    this.shownAt = Date.now();
    el.style.display = 'grid';
    // Ensure base label and reset text before starting dots
    this.baseText = 'initializing';
    if (this.textEl) this.textEl.textContent = this.baseText;
    this.startDots();
  },
  hide() {
    if (!this.el) return;
    const elapsed = Date.now() - this.shownAt;
    const delay = Math.max(0, this.MIN_VISIBLE_MS - elapsed);
    setTimeout(() => {
      if (!this.el) return;
      this.el.style.display = 'none';
      this.stopDots();
    }, delay);
  }
};

export function showLoading(containerOrSelector = null) {
  try {
    const container = typeof containerOrSelector === 'string'
      ? document.querySelector(containerOrSelector)
      : containerOrSelector;
    LoadingOverlay.show(container || resolveLoadingContainer());
  } catch {}
}

export function hideLoading() {
  try { LoadingOverlay.hide(); } catch {}
}

// Expose simple globals for legacy pages if a bundler doesn't include module exports
try {
  if (typeof window !== 'undefined') {
    window.showLoading = function(container){ try { showLoading(container); } catch {} };
    window.hideLoading = function(){ try { hideLoading(); } catch {} };
  }
} catch {}

export { resolveLoadingContainer };


