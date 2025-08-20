import * as data from './data.js';
import * as node from './node.js';
import * as dashboard from './dashboard.js';

const flowDashboard = {
    ...data,
    ...dashboard,
};

// Attach to the global `window` object if not in a module environment
if (typeof window !== 'undefined') {
    window.flowDashboard = flowDashboard;
}

export default flowDashboard;
 