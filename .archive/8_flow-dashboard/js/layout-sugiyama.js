import { changeDirection } from "./util.js";

export function sugiyamaLayoutAndCanvas(dashboard, dag) {
    dashboard.main.view.svg.selectAll("*").remove();
    const svg = dashboard.main.view.svg.append("g");
  
    // const marginX = changeDirection(8, 100, dashboard.layout.horizontal).x;
    // const marginY = changeDirection(50, 8, dashboard.layout.horizontal).x;
    const marginX = dashboard.layout.margin.x;
    const marginY = dashboard.layout.margin.y;
  
    function getNodeSize({ data }) {
      // console.log("getNodeSize", data, dashboard.layout.horizontal);
      return [
        changeDirection(data.width + marginX, data.height + marginY, dashboard.layout.horizontal).x,
        changeDirection(data.width + marginX, data.height + marginY, dashboard.layout.horizontal).y,
      ];
    }
  
    // Apply the Sugiyama layout
    const layout = d3
      .sugiyama()
      .layering(d3.layeringLongestPath())
      // .layering(d3.layeringTopological())
      // .decross(d3.decrossOpt()) // Option 1: Heuristic Optimization
      // .decross(d3.decrossTwoLayer()) // Option 2: Two-layer Optimization
      .decross(d3.decrossDfs()) // Option 3: Naive Approach
      // .coord(d3.coordQuad())
      .coord(d3.coordSimplex())
      .nodeSize((d) => getNodeSize(d));
    // const layout = d3.dagLayeringTopological();
  
    const layoutResult = layout(dag);
    console.log("sugiyamaLayoutAndCanvas - layoutResult", layoutResult);

    const width = changeDirection(layoutResult.width, layoutResult.height, dashboard.layout.horizontal).x;
    const height = changeDirection(layoutResult.width, layoutResult.height, dashboard.layout.horizontal).y;
  
    console.log("computeLayoutAndCanvas - width, heigth", width, height, dashboard.main.view, dashboard.minimap.view);
  
    dashboard.main.view.svg.attr("viewBox", [0, 0, width, height]);
  
    dashboard.minimap.view.svg.attr("viewBox", [0, 0, width, height]);
  
    dashboard.main.canvas = { svg: svg, width: width, height: height };
  
    return dashboard.main.canvas;
  }
  
  