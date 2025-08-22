// Public API aggregator
import * as dashboard from './dashboard.js';
import * as data from './data.js';
import { showLoading } from './loadingOverlay.js';

// Provide a function to show loading when dashboard starts loading
// This ensures loading is shown immediately when needed, not when module loads
if (typeof window !== 'undefined') {
  window.showFlowDashLoading = showLoading;
}

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
 