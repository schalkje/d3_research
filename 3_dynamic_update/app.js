var myData = [40, 10, 20, 60, 30];

d3.select('.chart')
  .selectAll('circle')
  .data(myData)
  .join('circle')
  .attr('cx', function(d, i) {
    return i * 100;
  })
  .attr('cy', 50)
  .attr('r', 40)
  .style('fill', 'orange');