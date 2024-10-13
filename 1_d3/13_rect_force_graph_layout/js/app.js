const radius = 40;
const link_separator = 4;






//////////////////////////////////////////////////////////////
//
// Setup data
//

var nodes=[
  { id: 1, name: "node 1", dependsOn: [] },
  { id: 7, name: "node 7", dependsOn: [] },
  { id: 2, name: "node 2", dependsOn: [1] },
  { id: 3, name: "node 3", dependsOn: [2] },
  { id: 4, name: "node 4", dependsOn: [2] },
  { id: 5, name: "node 5", dependsOn: [4, 7] },
  { id: 6, name: "node 6", dependsOn: [5] }
]

console.log('Create links')
   
// calculate links
const links = [];

nodes.forEach(n => {
  if (!n.dependsOn) {
    console.log('  ' + n.id + ' is independend');
    return;
  }

  console.log('  ' + n.id + ' depends on ' + n.dependsOn);
  n.dependsOn.forEach(index => {
    links.push({ source: index, target: n.id });
  });
});

console.log(links);







//////////////////////////////////////////////////////////////
//
// Initialize drawing container
//

var width = 400;
var height = 800;

console.log('Create container');

var container = d3.select('#svg_container')
    .attr("width", width)
    .attr("height", height)
    .attr("class", "container");

var links_container = d3.select('#links')
var ghostlinks_container = d3.select('#ghostlinks')
var nodes_container = d3.select('#nodes')














//////////////////////////////////////////////////////////////
//
// Draw all objects
//

var nodes_objects = nodes_container
  .selectAll('.node')
  .data(nodes)
  .join("circle")
  .attr("cx", d => d.x)
  .attr('cy', (d) => d.y)
  .attr('r', d => radius)
  .attr("class", 'node')
  .call(d3.drag()
    .on('start', drag_started)
    .on('drag', dragged)
    .on('end', drag_ended)
  )

var nodeLabels_objects = nodes_container
        .selectAll('.node_label')
        .data(nodes)
        .join("text")
        .attr("x", d => d.x)
        .attr('y', d => d.y + 4)
        .text(d => d.name)
        .attr("class", 'node_label');
    
var links_objects = links_container
    .selectAll('.link')
    .data(links)
    .join("line")
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
    .attr('marker-end','url(#suit)')
    .attr("class", 'link');

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
  nodes_objects
    .attr("cx", d => d.x)
    .attr("cy", d => d.y);

  nodeLabels_objects
    .attr("x", d => d.x)
    .attr('y', d => d.y + 4);

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
  d.fx = d3.event.x
  d.fy = d3.event.y
}

function drag_ended (d) {
  if (!d3.event.active) {
    simulation.alphaTarget(0)
  }
  d.fx = null
  d.fy = null
  d3.select(this).attr("class", "node");
}