function rectangleNode() {
  var id = Math.floor(Math.random() * 10000), //Create semi-unique ID in case user doesn't select one
    width = 60, // default width
    height = 30, // default height
    x = 50, // default x
    y = 50, // default y
    label = "Rectangle", // default label
  classValue = "node"; // default class

  function my(selection) {
    selection.each(function (data,i) {
      console.log("rectangleNode data: ", data);

      var container = d3
        .select(this)
        .append("g")
        .attr("id", (d) => id * 100 + i)
        .attr("class", classValue)
        .attr("transform", `translate(${data.x},${data.y})`); // Apply initial transform

      container
        .append("rect")
        .attr("width", width)
        .attr("height", height)
        .attr("x", 0)
        .attr("y", 0)
        .attr("stroke", "green")
        .attr("fill", "steelblue");

      container
        .append("text")
        .text(label)
        .attr("x", (d) => d.width / 2)
        .attr("y", (d) => d.height / 2)
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "middle")
        .attr("fill", "green");
    });
  }
  // getters and setters
  my.width = function (value) {
    if (!arguments.length) return width;
    width = value;
    return my;
  };
  my.height = function (value) {
    if (!arguments.length) return height;
    height = value;
    return my;
  };
  my.x = function (value) {
    if (!arguments.length) return x;
    console.log("this",this);
    console.log("value",value);
      x = value;
      return my;
  };
  my.y = function (value) {
    if (!arguments.length) return y;
    y = value;
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
    my.classValue = value;
    this.select("rect").attr("fill", "red");
    return my;
  };

  return my;
}
