import {changeDirection} from "./util.js";
import {initializeZoom} from "./zoom.js";
import {updateMinimapViewport} from "./minimap.js";
import {draw, drawMinimap} from "./drawNetwork.js";

export function computeAndDraw(dag, mainView, minimap, layout) {
    console.log("computeAndDraw", mainView, minimap, dag);
    let dashboard = {
        main:{
            view:mainView
        },
        minimap:{
            view:minimap
        },
        layout:layout
    };

    computeLayoutAndCanvas(dashboard, dag);
  
    initializeZoom(dashboard, dag, updateMinimapViewport);
  
    draw(dashboard, dag);
  
  
    // Create minimap content group
    minimap.svg.selectAll("g").remove();
  
    dashboard.minimap.canvas = {
        svg:minimap.svg.insert("g", ":first-child"), 
        width:dashboard.main.canvas.width, 
        height:dashboard.main.canvas.height
    }
    
    
    drawMinimap(dashboard, dag);
  
    return dashboard;
    // { 
    //     layout:{
    //         horizontal:horizontal,
    //         lineGenerator:lineGenerator
    //         isEdgeCurved:isEdgeCurved
    //   },     
    //     },
    //     main:{
    //         view:mainView,
    //         canvas:{svg:mainCanvas, width:mainCanvas.width, height:mainCanvas.height},
    //         zoom:zoom
    //     },
    //     minimap:{
    //         view:minimap,
    //         canvas:{svg:minimapCanvas, width:mainCanvas.width, height:mainCanvas.height}
    //     }
    // };
  }

 
export function computeLayoutAndCanvas(dashboard, dag) {
    dashboard.main.view.svg.selectAll("*").remove();
    const svg = dashboard.main.view.svg.append("g");

    const marginX = changeDirection(8, 100, dashboard.layout.horizontal).x;
    const marginY = changeDirection(50, 8, dashboard.layout.horizontal).x;

    function getNodeSize({ data }) {
        return [
            changeDirection(data.width + marginX, data.height + marginY, dashboard.layout.horizontal).x,
            changeDirection(data.width + marginX, data.height + marginY, dashboard.layout.horizontal).y
        ];
    }

    // Apply the Sugiyama layout
    const layout = d3.sugiyama()
        .layering(d3.layeringLongestPath())
        // .decross(d3.decrossOpt()) // Option 1: Heuristic Optimization
        .decross(d3.decrossTwoLayer()) // Option 2: Two-layer Optimization
        // .decross(d3.decrossDfs()) // Option 3: Naive Approach
        .coord(d3.coordQuad())
        .nodeSize(d => getNodeSize(d));

    const { width: layoutWidth, height: layoutHeight } = layout(dag);
    const width = changeDirection(layoutWidth, layoutHeight, dashboard.layout.horizontal).x;
    const height = changeDirection(layoutWidth, layoutHeight, dashboard.layout.horizontal).y;

    dashboard.main.view.svg.attr("viewBox", [
        0,
        0,
        width,
        height
    ]);

    dashboard.minimap.view.svg.attr("viewBox", [
        0,
        0,
        width,
        height
    ]);

    dashboard.main.canvas = { svg:svg, width:width, height:height };

    return dashboard.main.canvas;
}


// Function to get the computed width and height of an element
export function getComputedDimensions(element) {
    const rect = element.node().getBoundingClientRect();
    return { width: rect.width, height: rect.height };
}