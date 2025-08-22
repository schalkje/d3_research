var fruits = ['apple','banana','pear','grape']

d3.selectAll('.d3_fruit')
.selectAll('p')
.data(fruits)
.join(
    function(enter) {
        return enter
          .append('p')
          .text(d => d);
      },
      function(update) {
        return update
          .text(d => d + ' (replaced)');
      },
      function(exit) {
        return exit
          .remove();
      }
)
.style("color", "green");