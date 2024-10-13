//////////////////////////////////////////////////////////////
//
// Draw all objects
//

var nodes_objects = nodes_container
      .append("g")
      .selectAll(".node")
      .data(nodes)
      .enter()
      .append("g")
      .attr("class", (d) => `node`)
      .attr("transform", (d) => {
        console.log("node_objects d",d, d.width, d.height);
        return `translate(${d.x - d.width / 2},${d.y - d.height / 2})`;
      })
      .call(d3.drag()
        .on('start', drag_started)
        .on('drag', dragged)
        .on('end', drag_ended)
      );


const node_rect = nodes_objects
      .append("rect")
      .attr("class", (d) => `nodeRect`)
      .attr("width", (d) => d.width)
      .attr("height", (d) => d.height)
      .attr("rx", 5)
      .attr("ry", 5);


  // .selectAll('.node')
  // .data(nodes)
  // .join("circle")
  // .attr("cx", d => d.x)
  // .attr('cy', (d) => d.y)
  // .attr('r', d => radius)
  // .attr("class", 'node')
  // .call(d3.drag()
  //   .on('start', drag_started)
  //   .on('drag', dragged)
  //   .on('end', drag_ended)
  // )

//////////////////////////////////////////////////////////////
//
// Label the nodes
//

var node_label = nodes_objects
        .append("text")
        .attr("x", d => d.width/2)
        .attr('y', d => d.height/2 + 4)
        .text(d => d.name)
        .attr("class", 'node_label');
    
//////////////////////////////////////////////////////////////
//
// Create edges between nodes
//

var links_objects = links_container
    .selectAll('.link')
    .data(links)
    .join("line")
    .attr("x1", function(d) {
        console.log("x1 d",d, d.source, radius, link_separator);
        console.log("    - alfa",d.target.y,d.source.y,d.target.x,d.source.x);
        // var alfa = Math.atan(Math.abs(d.target.y-d.source.y)/Math.abs(d.target.x-d.source.x));
        var alfa = d.target.x==d.source.x?0.1:Math.atan(Math.abs(d.target.y-d.source.y)/Math.abs(d.target.x-d.source.x));
        console.log("    - alfa",alfa);
        var dx = Math.cos(alfa) * (radius + link_separator);
        // console.log("    - dx",dx);
        return d.source.x < d.target.x ? d.source.x + dx : d.source.x - dx;
      } )
    //   .attr("x1", 10 )
        .attr("y1", function(d) {
      var alfa = d.target.x==d.source.x?0.1:Math.atan(Math.abs(d.target.y-d.source.y)/Math.abs(d.target.x-d.source.x));
      var dy = Math.sin(alfa) * (radius + link_separator);
      return d.source.y < d.target.y ? d.source.y + dy : d.source.y - dy;
    } )
    .attr("x2", function(d) {
      var alfa = d.target.x==d.source.x?0.1:Math.atan(Math.abs(d.target.y-d.source.y)/Math.abs(d.target.x-d.source.x));
      var dx = Math.cos(alfa) * (radius + link_separator);
      return d.source.x < d.target.x ? d.target.x - dx : d.target.x + dx;
    } )
    .attr('y2', function(d) {
      var alfa = d.target.x==d.source.x?0.1:Math.atan(Math.abs(d.target.y-d.source.y)/Math.abs(d.target.x-d.source.x));
      var dy = Math.sin(alfa) * (radius + link_separator);
      return d.source.y < d.target.y ? d.target.y - dy : d.target.y + dy;
    })
    .attr('marker-end','url(#suit)')
    .attr("class", 'link');

//////////////////////////////////////////////////////////////
//
// Create ghostlings, direct lines between node centers
//


var ghostlinks_objects = ghostlinks_container
    .selectAll('.ghostlink')
    .data(links)
    .join("line")
    .attr('x1', function (d) { return d.source.x })
    .attr('y1', function (d) { return d.source.y })
    .attr('x2', function (d) { return d.target.x })
    .attr('y2', function (d) { return d.target.y })
    .attr("class", 'ghostlink');






//////////////////////////////////////////////////////////////
//
// Update the location for the simulation
//

function update()
{ 
  var nodes_objects = d3
  .selectAll(".node")
  .attr("transform", (d) => {
    // console.log("node_objects d",d, d.width, d.height, d.x, d.y);
    return `translate(${d.x - d.width / 2},${d.y - d.height / 2})`;
  });

  // nodes_objects
  //   .attr("cx", d => d.x)
  //   .attr("cy", d => d.y);

  // nodeLabels_objects
  //   .attr("x", d => d.x)
  //   .attr('y', d => d.y + 4);

  ghostlinks_objects
    .attr('x1', function (d) { return d.source.x })
    .attr('y1', function (d) { return d.source.y })
    .attr('x2', function (d) { return d.target.x })
    .attr('y2', function (d) { return d.target.y })

  links_objects
    .attr("x1", function(d) {
      var alfa = Math.atan(Math.abs(d.target.y-d.source.y)/Math.abs(d.target.x-d.source.x));
      var dx = Math.cos(alfa) * (radius + link_separator);
      return d.source.x < d.target.x ? d.source.x + dx : d.source.x - dx;
    } )
    .attr("y1", function(d) {
      var alfa = Math.atan(Math.abs(d.target.y-d.source.y)/Math.abs(d.target.x-d.source.x));
      var dy = Math.sin(alfa) * (radius + link_separator);
      return d.source.y < d.target.y ? d.source.y + dy : d.source.y - dy;
    } )
    .attr("x2", function(d) {
      var alfa = Math.atan(Math.abs(d.target.y-d.source.y)/Math.abs(d.target.x-d.source.x));
      var dx = Math.cos(alfa) * (radius + link_separator);
      return d.source.x < d.target.x ? d.target.x - dx : d.target.x + dx;
    } )
    .attr('y2', function(d) {
      var alfa = Math.atan(Math.abs(d.target.y-d.source.y)/Math.abs(d.target.x-d.source.x));
      var dy = Math.sin(alfa) * (radius + link_separator);
      return d.source.y < d.target.y ? d.target.y - dy : d.target.y + dy;
    })
}

// drag
function drag_started (d) {
  if (!d3.event.active) {
    // Set the attenuation coefficient to simulate the node position movement process. The higher the value, the faster the movement. The value range is [0, 1]
    simulation.alphaTarget(0.8).restart() 
  }
  d.fx = d.x;
  d.fy = d.y;
  d3.select(this).attr("class", "node_grabbing");
}

function dragged (d) {
  console.log("dragged d",d);
  // move the simulation
  d.fx = d3.event.x
  d.fy = d3.event.y
  // move the node
  d3.select(this)
  .attr("transform", "translate(" + d3.event.x + "," + d3.event.y + ")");
}

function drag_ended (d) {
  if (!d3.event.active) {
    simulation.alphaTarget(0)
  }
  d.fx = null
  d.fy = null
  d3.select(this).attr("class", "node");
}