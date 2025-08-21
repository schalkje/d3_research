// Public API aggregator and eager loading overlay
import * as dashboard from './dashboard.js';
import * as data from './data.js';
import { showLoading } from './loadingOverlay.js';

// Show the loading overlay as soon as the bundle is evaluated (eager show)
try { showLoading(); } catch {}

// Default export combines commonly used namespaces
const api = {
  ...dashboard,
  ...data,
};

// Named re-exports for tree-shaking/named imports
export * from './dashboard.js';
export * from './data.js';

// Attach to global for non-module usage
if (typeof window !== 'undefined') {
  window.flowDashboard = api;
}

export default api;
 