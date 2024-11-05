import { createNode, createNodes } from './node.js'
import { createMarkers } from './markers.js'
import { createEdges } from './edge.js'
import { getComputedDimensions } from './utils.js';

export function initializeCanvas(divSelector) {
    // Set up the main view
    const canvasSvg = d3.select(`${divSelector}`);
    const { width: svgWidth, height: svgHeight } = canvasSvg.node().getBoundingClientRect();
    // getComputedDimensions(canvasSvg);

    console.log("initializeCanvas", canvasSvg, svgWidth, svgHeight);
    canvasSvg.attr("viewBox", [-svgWidth/2, -svgHeight/2, svgWidth, svgHeight]);

    return canvasSvg
    // return { svg: mainSvg, width: mainWidth, height: mainHeight, onDragUpdate: updateMainView };
  }

export function createDashboard(dashboard, container) {

    createMarkers(container);

    var root;
    if ( dashboard.nodes.length == 1 )
        root = createNode(dashboard.nodes[0], container, dashboard.settings);
    else {
        root = createNodes(dashboard.nodes, container, dashboard.settings);
    }
    root.render();

    if ( dashboard.edges.length > 0 )
        createEdges(root, dashboard.edges, dashboard.settings);
}
