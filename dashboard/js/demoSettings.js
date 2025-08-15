// Reusable settings UI for demo pages

export function injectSettingsUI(options) {
  const {
    containerSelector = 'body',
    withVariation = false,
    getVariations = null,
    getBaseData,
    buildDashboard,
  } = options;

  const container = document.querySelector(containerSelector) || document.body;

  // Create controls button bar injection (Settings button)
  const controls = container.querySelector('.demo-controls');
  if (controls && !controls.querySelector('#settingsBtn')) {
    const btn = document.createElement('button');
    btn.id = 'settingsBtn';
    btn.type = 'button';
    btn.textContent = 'Settings';
    controls.prepend(btn);
  }

  // Create settings panel if not exists
  if (!container.querySelector('.settings-panel')) {
    const panel = document.createElement('section');
    panel.className = 'settings-panel';
    panel.innerHTML = `
      <div class="settings-row">
        ${withVariation ? `
        <div class="settings-group">
          <label class="settings-title">Variation</label>
          <select id="variationSelect"></select>
        </div>
        ` : ''}
        <div class="settings-group is-toggles">
          <label class="settings-title">Toggles</label>
          <div class="settings-toggles">
            <label><input type="checkbox" id="chkZoomToRoot"> Zoom to root</label>
            <label><input type="checkbox" id="chkShowBoundingBox"> Show bounding box</label>
            <label><input type="checkbox" id="chkShowCenterMark"> Center mark</label>
            <label><input type="checkbox" id="chkShowConnectionPoints"> Connection points</label>
            <label><input type="checkbox" id="chkShowGhostlines"> Ghostlines</label>
            <label><input type="checkbox" id="chkCurved"> Curved edges</label>
            <label><input type="checkbox" id="chkShowEdges" checked> Show edges</label>
          </div>
        </div>
        <div class="settings-group">
          <label class="settings-title">Edges</label>
          <div class="settings-inline">
            <label>Curve margin <input type="number" step="0.05" min="0" max="0.8" id="numCurveMargin" style="width:80px"></label>
          </div>
        </div>
      </div>
      <div class="settings-row">
        <div class="settings-group">
          <label class="settings-title">Selector</label>
          <div class="settings-inline">
            <label>Incoming <input type="number" min="0" id="numSelectorIn" style="width:70px"></label>
            <label>Outgoing <input type="number" min="0" id="numSelectorOut" style="width:70px"></label>
          </div>
        </div>
        <div class="settings-group">
          <label class="settings-title">Node spacing</label>
          <div class="settings-inline">
            <label>H <input type="number" min="0" id="numNodeSpacingH" style="width:70px"></label>
            <label>V <input type="number" min="0" id="numNodeSpacingV" style="width:70px"></label>
          </div>
        </div>
        <div class="settings-group">
          <label class="settings-title">Container margin</label>
          <div class="settings-inline">
            <label>T <input type="number" min="0" id="numMarginTop" style="width:60px"></label>
            <label>R <input type="number" min="0" id="numMarginRight" style="width:60px"></label>
            <label>B <input type="number" min="0" id="numMarginBottom" style="width:60px"></label>
            <label>L <input type="number" min="0" id="numMarginLeft" style="width:60px"></label>
          </div>
        </div>
        <div class="settings-actions">
          <button id="rebuildBtn" type="button">Rebuild</button>
        </div>
      </div>`;
    controls?.insertAdjacentElement('afterend', panel);
  }

  const settingsPanel = container.querySelector('.settings-panel');
  const settingsBtn = container.querySelector('#settingsBtn');
  if (settingsBtn && settingsPanel) {
    settingsBtn.addEventListener('click', () => {
      const isOpen = settingsPanel.classList.toggle('open');
      settingsBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      settingsBtn.textContent = isOpen ? 'Hide settings' : 'Settings';
    });
  }

  // Fill variations if provided
  if (withVariation && typeof getVariations === 'function') {
    const sel = container.querySelector('#variationSelect');
    if (sel) {
      const variations = getVariations();
      Object.keys(variations).forEach(key => {
        const opt = document.createElement('option');
        opt.value = key; opt.textContent = key;
        sel.appendChild(opt);
      });
      sel.value = Object.keys(variations)[0];
    }
  }

  function setUIFromSettings(settings = {}) {
    const get = (obj, key, def) => obj && obj[key] !== undefined ? obj[key] : def;
    document.getElementById('chkZoomToRoot').checked = !!get(settings, 'zoomToRoot', true);
    document.getElementById('chkShowBoundingBox').checked = !!get(settings, 'showBoundingBox', true);
    document.getElementById('chkShowCenterMark').checked = !!get(settings, 'showCenterMark', false);
    document.getElementById('chkShowConnectionPoints').checked = !!get(settings, 'showConnectionPoints', false);
    document.getElementById('chkShowGhostlines').checked = !!get(settings, 'showGhostlines', false);
    document.getElementById('chkCurved').checked = !!get(settings, 'curved', false);
    document.getElementById('chkShowEdges').checked = get(settings, 'showEdges', true) !== false;
    document.getElementById('numCurveMargin').value = get(settings, 'curveMargin', get(settings, 'curved', false) ? 0.1 : 0);
    const sel = settings.selector || {};
    document.getElementById('numSelectorIn').value = get(sel, 'incomming', 1);
    document.getElementById('numSelectorOut').value = get(sel, 'outgoing', 1);
    const ns = settings.nodeSpacing || {};
    document.getElementById('numNodeSpacingH').value = get(ns, 'horizontal', 20);
    document.getElementById('numNodeSpacingV').value = get(ns, 'vertical', 10);
    const cm = settings.containerMargin || {};
    document.getElementById('numMarginTop').value = get(cm, 'top', 8);
    document.getElementById('numMarginRight').value = get(cm, 'right', 8);
    document.getElementById('numMarginBottom').value = get(cm, 'bottom', 8);
    document.getElementById('numMarginLeft').value = get(cm, 'left', 8);
  }

  function getSettingsFromUI(baseSettings = {}) {
    const s = { ...baseSettings };
    s.zoomToRoot = document.getElementById('chkZoomToRoot').checked;
    s.showBoundingBox = document.getElementById('chkShowBoundingBox').checked;
    s.showCenterMark = document.getElementById('chkShowCenterMark').checked;
    s.showConnectionPoints = document.getElementById('chkShowConnectionPoints').checked;
    s.showGhostlines = document.getElementById('chkShowGhostlines').checked;
    s.curved = document.getElementById('chkCurved').checked;
    s.showEdges = document.getElementById('chkShowEdges').checked;
    const curveMargin = parseFloat(document.getElementById('numCurveMargin').value);
    if (!Number.isNaN(curveMargin)) s.curveMargin = curveMargin;
    s.selector = s.selector || {};
    const inVal = parseInt(document.getElementById('numSelectorIn').value, 10);
    const outVal = parseInt(document.getElementById('numSelectorOut').value, 10);
    if (!Number.isNaN(inVal)) s.selector.incomming = inVal;
    if (!Number.isNaN(outVal)) s.selector.outgoing = outVal;
    s.nodeSpacing = s.nodeSpacing || {};
    const h = parseInt(document.getElementById('numNodeSpacingH').value, 10);
    const v = parseInt(document.getElementById('numNodeSpacingV').value, 10);
    if (!Number.isNaN(h)) s.nodeSpacing.horizontal = h;
    if (!Number.isNaN(v)) s.nodeSpacing.vertical = v;
    s.containerMargin = s.containerMargin || {};
    const mt = parseInt(document.getElementById('numMarginTop').value, 10);
    const mr = parseInt(document.getElementById('numMarginRight').value, 10);
    const mb = parseInt(document.getElementById('numMarginBottom').value, 10);
    const ml = parseInt(document.getElementById('numMarginLeft').value, 10);
    if (!Number.isNaN(mt)) s.containerMargin.top = mt;
    if (!Number.isNaN(mr)) s.containerMargin.right = mr;
    if (!Number.isNaN(mb)) s.containerMargin.bottom = mb;
    if (!Number.isNaN(ml)) s.containerMargin.left = ml;
    return s;
  }

  // Event wiring
  const immediateInputs = [
    'chkZoomToRoot','chkShowBoundingBox','chkShowCenterMark','chkShowConnectionPoints',
    'chkShowGhostlines','chkCurved','chkShowEdges','numCurveMargin','numSelectorIn','numSelectorOut',
    'numNodeSpacingH','numNodeSpacingV','numMarginTop','numMarginRight','numMarginBottom','numMarginLeft'
  ];
  immediateInputs.forEach(id => {
    const el = container.querySelector(`#${id}`);
    el && el.addEventListener('change', () => {
      const base = typeof getBaseData === 'function' ? getBaseData() : null;
      const settings = getSettingsFromUI(base?.settings || {});
      const dataset = base ? { ...base, settings } : null;
      if (dataset && typeof buildDashboard === 'function') buildDashboard(dataset);
    });
  });

  const rebuildBtn = container.querySelector('#rebuildBtn');
  if (rebuildBtn) {
    rebuildBtn.addEventListener('click', () => {
      const base = typeof getBaseData === 'function' ? getBaseData() : null;
      const settings = getSettingsFromUI(base?.settings || {});
      const dataset = base ? { ...base, settings } : null;
      if (dataset && typeof buildDashboard === 'function') buildDashboard(dataset);
    });
  }

  // Initialize UI from current settings
  try {
    const base = typeof getBaseData === 'function' ? getBaseData() : null;
    setUIFromSettings(base?.settings || {});
  } catch {}
}


