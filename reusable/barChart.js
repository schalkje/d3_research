(function () {
  // Based on article @ http://www.toptal.com/d3-js/towards-reusable-d3-js-charts
  // Publish a factory method for Chart instances
  // @usage:
  //     var runningChart = BarChart.instanceOf( {barPadding : 2 } );
  //     var weatherChart = BarChart.instanceOf()
  //                                .fillColor('coral');
  window.BarChart = {
    instanceOf: function(options) {
      // Publish instance
      return new Chart(options);
    },
  };

  // ***************************************************
  // Define Chart class and methods
  // ***************************************************

  /**
   * Define Chart Class
   */
  function Chart(options) {
    // Special draw `selection` method used by D3
    this.render = drawSelection.bind(this);
    this.options = initialize(options);
  }

  /**
   * Build and assign prototype methods
   */
  Chart.prototype = {
    width: makeAccessor.call(this, this.options, "width"),
    height: makeAccessor.call(this, this.options, "height"),
    barPadding: makeAccessor.call(this, this.options, "barPadding"),
    fillColor: makeAccessor.call(this, this.options, "fillColor"),
  };

  // ***************************************************
  // D3 Render method
  // ***************************************************

  /**
   * Define the D3 callback to render bar chart within the specified
   * selection DOMs
   */ function drawSelection(selection) {
    console.log("Drawing selection with options:", this.options);
    selection.each((data) => {
      var barSpacing = this.options.height / data.length;
      var barHeight = barSpacing - this.options.barPadding;
      var maxValue = d3.max(data);
      var widthScale = this.options.width / maxValue;

      console.log(
        "barSpacing:",
        barSpacing,
        "barHeight:",
        barHeight,
        "widthScale:",
        widthScale
      );

      var svg = d3
        .select(this)
        .append("svg")
        .attr("height", this.options.height)
        .attr("width", this.options.width);

      svg
        .selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("y", (d, i) => {
          return i * barSpacing;
        })
        .attr("height", barHeight)
        .attr("x", 0)
        .attr("width", (d) => {
          return d * widthScale;
        })
        .style("fill", this.options.fillColor);
    });
  }

  // ***************************************************
  // Utility methods
  // ***************************************************

  /**
   * Build a chainable property accessor AND mutator function
   */
  function makeAccessor(fields, key) {
    return function (value) {
      if (!arguments.length) return fields[key];
      fields[key] = value;
      return this;
    };
  }

  /**
   * Clone options data and initialize with defaults (if needed)
   */
  function initialize(options) {
    return extend(
      {
        width: 900,
        height: 200,
        barPadding: 1,
        fillColor: "steelblue",
      },
      options
    );
  }

  /**
   *
   */
  function extend(dst) {
    for (var i = 1, ii = arguments.length; i < ii; i++) {
      var obj = arguments[i];
      if (obj) {
        var keys = Object.keys(obj);
        for (var j = 0, jj = keys.length; j < jj; j++) {
          var key = keys[j];
          dst[key] = obj[key];
        }
      }
    }
    return dst;
  }
})();
