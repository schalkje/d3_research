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
  shownAt: 0,
  MIN_VISIBLE_MS: 350,
  ensure(container) {
    const host = container || resolveLoadingContainer();
    if (!host) return null;

    // Reuse existing element if found
    this.el = host.querySelector('#flowdash-loading') || document.getElementById('flowdash-loading');
    if (!this.el) {
      const wrapper = document.createElement('div');
      wrapper.id = 'flowdash-loading';
      wrapper.className = 'flowdash-loading';
      wrapper.setAttribute('role', 'status');
      wrapper.setAttribute('aria-live', 'polite');

      // Overlay layout styles
      Object.assign(wrapper.style, {
        position: 'absolute',
        inset: '0',
        display: 'grid',
        placeItems: 'center',
        zIndex: '1000',
        pointerEvents: 'none',
        background: 'transparent'
      });

      // Create a relative container for z-index layering
      const inner = document.createElement('div');
      Object.assign(inner.style, {
        position: 'relative',
        display: 'grid',
        placeItems: 'center'
      });

      const text = document.createElement('span');
      text.className = 'flowdash-loading__text';
      text.textContent = 'Loading';
      Object.assign(text.style, {
        position: 'relative',
        zIndex: '2',
        fontSize: '16px',
        color: 'var(--fd-loading-fg, #222)'
      });

      const dots = document.createElement('span');
      dots.className = 'flowdash-loading__dots';
      dots.setAttribute('aria-hidden', 'true');
      Object.assign(dots.style, {
        position: 'absolute',
        zIndex: '1',
        opacity: '0.35',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        fontSize: '16px',
        color: 'var(--fd-loading-fg, #222)'
      });

      inner.appendChild(dots);
      inner.appendChild(text);
      wrapper.appendChild(inner);
      host.appendChild(wrapper);

      this.el = wrapper;
      this.dotsEl = dots;
      this.textEl = text;
    } else {
      // Ensure references if element already exists in DOM
      this.dotsEl = this.el.querySelector('.flowdash-loading__dots');
      this.textEl = this.el.querySelector('.flowdash-loading__text');
    }
    return this.el;
  },
  startDots() {
    if (!this.dotsEl) return;
    this.stopDots();
    let i = 0;
    this.timer = setInterval(() => {
      i = (i + 1) % 4;
      this.dotsEl.textContent = '.'.repeat(i);
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


