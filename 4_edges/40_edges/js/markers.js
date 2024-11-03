export function createMarkers(container) {
  const defs = container.append("defs");

  defs
    .append("marker")
    .attr("id", "arrowhead")
    .attr("class", "marker arrowhead")
    .attr("viewBox", "-0 -5 10 10")
    .attr("refX", 10)
    .attr("refY", 0)
    .attr("orient", "auto")
    .attr("markerWidth", 4)
    .attr("markerHeight", 4)
    .attr("xoverflow", "visible")
    .append("svg:path")
    .attr("d", "M 0,-5 L 10 ,0 L 0,5");

    defs
    .append("marker")
    .attr("id", "arrow")
    .attr("class", "marker arrow")
    .attr("viewBox", "-0 -5 10 10")
    .attr("refX", 10)
    .attr("refY", 0)
    .attr("orient","auto-start-reverse")
    .attr("markerWidth", 4)
    .attr("markerHeight", 4)
    .attr("xoverflow", "visible")
    .append("svg:path")
    .attr("d", "M 0,-5 L 10 ,0 L 0,5");

    defs
    .append("marker")
    .attr("id", "mid-arrow")
    .attr("class", "marker arrow")
    .attr("viewBox", "0 -5 10 10")
    .attr("refX", 5)
    .attr("refY", 0)
    .attr("orient", "auto")
    .attr("markerWidth", 4)
    .attr("markerHeight", 4)
    .attr("xoverflow", "visible")
    .append("svg:path")
    .attr("d", "M 0,-5 L 10 ,0 L 0,5");    

// defs
//   .append("marker")
//     .attr("id","arrow")
//     .attr("viewBox","0 0 10 10")
//     .attr("refX","5")
//     .attr("refY","5")
//     .attr("markerWidth","6")
//     .attr("markerHeight","6")
//     .attr("orient","auto-start-reverse")
//     .attr("d","M 0 0 L 10 5 L 0 10 z");

  defs
    .append("marker")
    .attr("id", "circle")
    .attr("class", "marker circle")
    .attr("viewBox", "-5 -5 10 10")
    .attr("refX", 0)
    .attr("refY", 0)
    .attr("orient", "auto")
    .attr("markerWidth", 4)
    .attr("markerHeight", 4)
    .attr("xoverflow", "visible")
    .append("circle")
    .attr("cx", 0)
    .attr("cy", 0)
    .attr("r", 5);

  defs
    .append("marker")
    .attr("id", "halfcircle")
    .attr("class", "marker circle")
    .attr("viewBox", "-0 -5 10 10")
    .attr("refX", 0)
    .attr("refY", 0)
    .attr("orient", "auto")
    .attr("markerWidth", 4)
    .attr("markerHeight", 4)
    .attr("xoverflow", "visible")
    .append("circle")
    .attr("cx", 0)
    .attr("cy", 0)
    .attr("r", 5);

  const circle_arrow = defs
    .append("marker")
    .attr("id", "circlearrow")
    .attr("class", "marker circlearrow")
    .attr("viewBox", "0 -10 15 20")
    .attr("refX", 0)
    .attr("refY", 0)
    .attr("orient", "auto")
    .attr("markerWidth", 6)
    .attr("markerHeight", 6)
    .attr("xoverflow", "visible");
    circle_arrow.append("circle").attr("cx", 0).attr("cy", 0).attr("r", 7);
    circle_arrow.append("svg:path").attr("d", "M 0,-5 L 20 ,0 L 0,5");
}
