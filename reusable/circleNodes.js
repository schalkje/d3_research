function circleNode() {
    var radius = 30, // default radius
        stroke = "red", // default stroke
        cx = 50, // default cx
        cy = 50; // default cy
  
    // function my() {
    //   // generate chart here, using `width` and `height`
    //   var container = d3.select(this);
    //   container.append("circle")
    //       .attr("r", radius)
    //       .attr("cx", cx)
    //       .attr("cy", cy)
    //       .attr("fill","blue");
    // }
  
    function my(selection) {
      selection.each(function(data) {
        var container = d3.select(this);
        container.append("circle")
            .attr("r", radius)
            .attr("cx", cx)
            .attr("cy", cy)
            .attr("stroke", "green")
            .attr("fill", "blue");
            // .fill("blue");
      });
    }

    // getters and setters
    my.radius = function(value) {
      if (!arguments.length) return radius;
      radius = value;
      return my;
    };

    my.cx = function(value) {
      if (!arguments.length) return cx;
      cx = value;
      return my;
    }

    my.cy = function(value) {
      if (!arguments.length) return cy;
      cy = value;
      return my;
    }
    
    return my;
  }
  