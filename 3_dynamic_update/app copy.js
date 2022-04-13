// https://www.d3indepth.com/datajoins/

function getData() {
    let data = [];
    let numItems = Math.ceil(Math.random() * 5);
  
    for(let i=0; i<numItems; i++) {
      data.push(Math.random() * 60);
    }
  
    return data;
  }
  
  function update(data) {
    d3.select('.chart')
      .selectAll('circle')
      .data(data)
      .append('circle')
      .attr('cx', function(d, i) {
        return i * 100;
      })
      .attr('cy', 50)
      .attr('r', function(d) {
        return 0.5 * d;
      })
      .style('fill', function(d) {
        return d > 30 ? 'orange' : '#eee';
      });
  }
  
  function updateAll() {
    let myData = getData();
    update(myData);
  }
  
  updateAll();
  
  d3.select("button")
    .on("click", updateAll);