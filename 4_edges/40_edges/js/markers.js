export function createMarkers(container) {
  container
    .append("defs")
    .append("marker")
    .attr("id", "arrowhead")
    .attr("class", "marker")
    .attr("viewBox", "-0 -5 10 10")
    .attr("refX", 10)
    .attr("refY", 0)
    .attr("orient", "auto")
    .attr("markerWidth", 4)
    .attr("markerHeight", 4)
    .attr("xoverflow", "visible")
    .append("svg:path")
    .attr("d", "M 0,-5 L 10 ,0 L 0,5");

  container
    .append("defs")
    .append("marker")
    .attr("id", "circle-marker")
    .attr("class", "circlemarker")
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
}
