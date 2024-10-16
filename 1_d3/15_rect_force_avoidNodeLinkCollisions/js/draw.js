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
        // console.log("node_objects d",d, d.width, d.height);
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
        // console.log("x1 d",d, d.source, radius, link_separator);
        // console.log("    - alfa",d.target.y,d.source.y,d.target.x,d.source.x);
        // var alfa = Math.atan(Math.abs(d.target.y-d.source.y)/Math.abs(d.target.x-d.source.x));
        var alfa = d.target.x==d.source.x?0.1:Math.atan(Math.abs(d.target.y-d.source.y)/Math.abs(d.target.x-d.source.x));
        // console.log("    - alfa",alfa);
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


  ghostlinks_objects
    .attr('x1', function (d) { return d.source.x })
    .attr('y1', function (d) { return d.source.y })
    .attr('x2', function (d) { return d.target.x })
    .attr('y2', function (d) { return d.target.y })


    function getRectAngles(rect)
    {
      // compute the angles of the corners of the rectangle
      let angle1 = Math.atan2(-rect.height,-rect.width);
      if (angle1 < 0) angle1 += 2*Math.PI;

      let angle2 = Math.atan2(-rect.height,rect.width);
      if (angle2 < 0) angle2 += 2*Math.PI;

      let angle3 = Math.atan2(rect.height,rect.width);
      if (angle3 < 0) angle3 += 2*Math.PI;

      let angle4 = Math.atan2(rect.height,-rect.width);
      if (angle4 < 0) angle4 += 2*Math.PI;

      return [angle1, angle2, angle3, angle4];
  }

  function getConnectionPoint(source, target) {
    let cornerAngles = getRectAngles(source);

    let dy = target.y - source.y;
    let dx = target.x - source.x;

    let angle = Math.atan2(dy,dx);
    if (angle < 0) angle += 2*Math.PI;
  
    // based on the quadrant the angle is in, compute the intersection point
    let connectionPoint = {
      x: 0,
      y: 0,
    };
    if (angle > cornerAngles[0] && angle <= cornerAngles[1]) {
      // top, quadrant I
      y = source.y - source.height / 2;
      x = source.x + (y - source.y) / Math.tan(angle);
      // console.log("       top",angle, cornerAngles[0], cornerAngles[1], x,y);
    } else if (angle > cornerAngles[1] || angle <= cornerAngles[2]) {
      // right, quadrant II
      x = source.x + source.width / 2;
      y = source.y + (x - source.x) * Math.tan(angle);
      // console.log("       right",angle, cornerAngles[1], cornerAngles[2], x,y);
    } else if (angle > cornerAngles[2] && angle <= cornerAngles[3]) {
      // bottom, quadrant III
      y = source.y + source.height / 2;
      x = source.x + (y - source.y) / Math.tan(angle);
      // console.log("       bottom",angle, cornerAngles[2], cornerAngles[3], x,y);
    } else {
      // left, quadrant IV
      x = source.x - source.width / 2;
      y = source.y + (x - source.x) * Math.tan(angle);
      // console.log("       left",angle, cornerAngles[3], cornerAngles[0], x,y);
    }
    return {
      x: x,
      y: y,
    };
  }


links_objects
    .attr("x1", function(d) {
      // console.log("x1 d",d, d.source.name, d.target.name);
      let connectionPoint = getConnectionPoint(d.source, d.target);
      return connectionPoint.x;
    } )
    .attr("y1", function(d) {
      // console.log("y1 d",d, d.source.name, d.target.name);
      let connectionPoint = getConnectionPoint(d.source, d.target);
      return connectionPoint.y;
    } )
    .attr("x2", function(d) {
      // console.log("x2 d",d, d.source.name, d.target.name);
      let connectionPoint = getConnectionPoint(d.target, d.source);
      return connectionPoint.x;
    } )
    .attr('y2', function(d) {
      // console.log("y2 d",d, d.source.name, d.target.name);
      let connectionPoint = getConnectionPoint(d.target, d.source);
      return connectionPoint.y;
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