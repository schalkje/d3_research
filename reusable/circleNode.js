function circleNode() {
  var id = Math.floor(Math.random() * 10000), //Create semi-unique ID in case user doesn't select one
    radius = 30, // default radius
    stroke = "red", // default stroke
    label = "circleNode", // default label
    cx = 50, // default cx
    cy = 50, // default cy
    classValue = "circleNode"; // default class

  function my(selection) {
    selection.each(function (data, i) {
      console.log("circleNode data: ", data);
      // console.log("circleNode this: ", this);

      var container = d3
        .select(this)
        .append("g")
        .attr("id", (d) => id * 100 + i)
        .attr("class", classValue)
        .attr("transform", `translate(${data.cx},${data.cy})`); // Apply initial transform


      container
        .append("circle")
        .attr("r", radius)
        .attr("cx", 0)
        .attr("cy", 0)
        .attr("stroke", "green")
        .attr("fill", "steelblue");

      container
        .append("text")
        .text(label)
        .attr("x", 0)
        .attr("y", 0)
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "middle")
        .attr("fill", "white");
    });
  }

  // getters and setters
  my.radius = function (value) {
    if (!arguments.length) return radius;
    radius = value;
    return my;
  };

  my.cx = function (value) {
    if (!arguments.length) return cx;
    cx = value;
    return my;
  };

  my.cy = function (value) {
    if (!arguments.length) return cy;
    cy = value;
    return my;
  };

  my.label = function (value) {
    if (!arguments.length) return label;
    label = value;
    return my;
  };

  my.class = function (value) {
    if (!arguments.length) return classValue;
    classValue = value;
    return my;
  };

  return my;
}
