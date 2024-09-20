function circleNode() {
    var radius = 30, // default radius
        stroke = "red", // default stroke
        cx = 50, // default cx
        cy = 50; // default cy
  
    // function my(data) {
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
        // container.append("circle")
        //     .attr("r", radius)
        //     .attr("cx", cx + 5)
        //     .attr("cy", cy + 5)
        //     .attr("stroke", "green")
        //     .attr("fill", "red");

        container.append("rect")
            .attr("width", radius)
            .attr("height", radius)
            .attr("x", cx)
            .attr("y", cy)
            .attr("opacity", 0.5)
            .attr("fill", "red");
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
  