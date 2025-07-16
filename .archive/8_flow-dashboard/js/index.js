import * as Zoom from './zoom.js';
import * as Minimap from './minimap.js';
import * as GraphData from './graphData.js';
import * as DrawNetwork from './drawNetwork.js';
import * as Layout from './layout.js';
import * as Util from './util.js';

// Create a common namespace object
const FD = {};

// Attach modules to the namespace object
FD.Zoom = Zoom;
FD.Minimap = Minimap;
FD.GraphData = GraphData;
FD.DrawNetwork = DrawNetwork;
FD.Layout = Layout;
FD.Util = Util;

// Expose the namespace object to the global window object
window.FD = FD;

console.log('Webpack Flow-Dashboard loaded');