// Reusable settings UI for demo pages
import { DEMO_DEFAULT_SETTINGS } from './configManager.js';

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
            <label><input type="checkbox" id="chkShowInnerZoneRect"> Inner zone rect</label>
          </div>
        </div>
        <div class="settings-group is-toggles">
          <label class="settings-title">Status Behavior</label>
          <div class="settings-toggles">
            <label><input type="checkbox" id="chkToggleCollapseOnStatusChange"> Auto-collapse on status change</label>
            <label><input type="checkbox" id="chkCascadeOnStatusChange"> Cascade status changes</label>
          </div>
        </div>
        <div class="settings-group">
          <label class="settings-title">Edges</label>
          <div class="settings-inline">
            <label>Curve margin <input type="number" step="0.05" min="0" max="0.8" id="numCurveMargin" style="width:80px"></label>
          </div>
        </div>
        <div class="settings-group">
          <label class="settings-title">Orientation</label>
          <div class="settings-inline">
            <label for="selOrientation">Nodes</label>
            <select id="selOrientation" style="width:160px">
              <option value="horizontal">Horizontal</option>
              <option value="horizontal_line">Horizontal (Line)</option>
              <option value="vertical">Vertical</option>
              <option value="rotate90">Rotate 90</option>
              <option value="rotate270">Rotate 270</option>
            </select>
          </div>
          <div class="settings-hint">Applies to nodes that support orientation (e.g., foundation, mart).</div>
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
        <div class="settings-group">
          <label class="settings-title">Minimap</label>
          <div class="settings-inline">
            <label>Mode
              <select id="selMinimapMode" style="width:140px">
                <option value="always" selected>Always</option>
                <option value="hover">Hover</option>
                <option value="hidden">Hidden</option>
              </select>
            </label>
            <label style="margin-left:12px">Position
              <select id="selMinimapPosition" style="width:160px">
                <option value="bottom-right" selected>Bottom-right</option>
                <option value="bottom-left">Bottom-left</option>
                <option value="top-right">Top-right</option>
                <option value="top-left">Top-left</option>
              </select>
            </label>
            <label style="margin-left:12px">Size
              <select id="selMinimapSize" style="width:120px">
                <option value="s">Small</option>
                <option value="m" selected>Medium</option>
                <option value="l">Large</option>
              </select>
            </label>
          </div>
          <div class="settings-inline" style="margin-top:8px">
            <label><input type="checkbox" id="chkMinimapScaleVisible" checked> Show scale</label>
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
    document.getElementById('chkShowInnerZoneRect').checked = !!get(settings, 'showInnerZoneRect', false);
    document.getElementById('chkToggleCollapseOnStatusChange').checked = !!get(settings, 'toggleCollapseOnStatusChange', DEMO_DEFAULT_SETTINGS.toggleCollapseOnStatusChange);
    document.getElementById('chkCascadeOnStatusChange').checked = !!get(settings, 'cascadeOnStatusChange', DEMO_DEFAULT_SETTINGS.cascadeOnStatusChange);
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

    // Minimap defaults: always visible by default
    const mm = settings.minimap || {};
    const modeSel = document.getElementById('selMinimapMode'); if (modeSel) modeSel.value = get(mm, 'mode', 'always');
    const posSel = document.getElementById('selMinimapPosition'); if (posSel) posSel.value = get(mm, 'position', 'bottom-right');
    const sizeSel = document.getElementById('selMinimapSize'); if (sizeSel) sizeSel.value = get(mm, 'size', 'm');
    const scaleVisibleChk = document.getElementById('chkMinimapScaleVisible'); if (scaleVisibleChk) scaleVisibleChk.checked = get(mm.scaleIndicator || {}, 'visible', true) !== false;

    // Orientation default from dataset (first node that supports it)
    try {
      const base = typeof getBaseData === 'function' ? getBaseData() : null;
      const nodes = base?.nodes || [];
      const withLayout = nodes.find(n => n?.layout && (n.layout.orientation || ['foundation','mart'].includes((n.type||'').toLowerCase())));
      const currentOrientation = withLayout?.layout?.orientation || 'horizontal';
      const sel = document.getElementById('selOrientation');
      if (sel) sel.value = currentOrientation;
    } catch {}
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
    s.showInnerZoneRect = document.getElementById('chkShowInnerZoneRect').checked;
    s.toggleCollapseOnStatusChange = document.getElementById('chkToggleCollapseOnStatusChange').checked;
    s.cascadeOnStatusChange = document.getElementById('chkCascadeOnStatusChange').checked;
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
    // Minimap from UI
    s.minimap = s.minimap || {};
    s.minimap.mode = (document.getElementById('selMinimapMode')?.value) || 'always';
    s.minimap.position = (document.getElementById('selMinimapPosition')?.value) || 'bottom-right';
    s.minimap.size = (document.getElementById('selMinimapSize')?.value) || 'm';
    // ensure enabled when not hidden
    s.minimap.enabled = s.minimap.mode !== 'hidden';
    s.minimap.scaleIndicator = s.minimap.scaleIndicator || {};
    s.minimap.scaleIndicator.visible = !!(document.getElementById('chkMinimapScaleVisible')?.checked);
    return s;
  }

  function buildDatasetFromUI(base) {
    // Merge with demo defaults for status behavior settings
    const demoSettings = { ...DEMO_DEFAULT_SETTINGS, ...base?.settings };
    const settings = getSettingsFromUI(demoSettings);
    const orientation = (container.querySelector('#selOrientation')?.value) || 'horizontal';
    const dataset = base ? { ...base, settings: { ...settings } } : null;
    if (dataset && Array.isArray(dataset.nodes)) {
      dataset.nodes = dataset.nodes.map(n => {
        const node = { ...n };
        node.layout = { ...(node.layout || {}) };
        // Apply to nodes that support orientation (foundation, mart) or explicitly have layout
        const type = (node.type || '').toLowerCase();
        if (['foundation','mart'].includes(type) || node.layout) {
          node.layout.orientation = orientation;
        }
        return node;
      });
    }
    return dataset;
  }

  // Event wiring
  const immediateInputs = [
    'chkZoomToRoot','chkShowBoundingBox','chkShowCenterMark','chkShowConnectionPoints',
    'chkShowGhostlines','chkCurved','chkShowEdges','chkShowInnerZoneRect','chkToggleCollapseOnStatusChange','chkCascadeOnStatusChange','numCurveMargin','numSelectorIn','numSelectorOut',
    'numNodeSpacingH','numNodeSpacingV','numMarginTop','numMarginRight','numMarginBottom','numMarginLeft',
    'selMinimapMode','selMinimapPosition','selMinimapSize','chkMinimapScaleVisible'
  ];
  immediateInputs.forEach(id => {
    const el = container.querySelector(`#${id}`);
    el && el.addEventListener('change', () => {
      const base = typeof getBaseData === 'function' ? getBaseData() : null;
      const dataset = buildDatasetFromUI(base);
      if (dataset && typeof buildDashboard === 'function') buildDashboard(dataset);
    });
  });
  // Orientation triggers rebuild
  const selOrientation = container.querySelector('#selOrientation');
  if (selOrientation) {
    selOrientation.addEventListener('change', () => {
      const base = typeof getBaseData === 'function' ? getBaseData() : null;
      const dataset = buildDatasetFromUI(base);
      if (dataset && typeof buildDashboard === 'function') buildDashboard(dataset);
    });
  }

  const rebuildBtn = container.querySelector('#rebuildBtn');
  if (rebuildBtn) {
    rebuildBtn.addEventListener('click', () => {
      const base = typeof getBaseData === 'function' ? getBaseData() : null;
      const dataset = buildDatasetFromUI(base);
      if (dataset && typeof buildDashboard === 'function') buildDashboard(dataset);
    });
  }

  // Initialize UI from current settings
  try {
    const base = typeof getBaseData === 'function' ? getBaseData() : null;
    setUIFromSettings(base?.settings || {});
    

  } catch {}
}


