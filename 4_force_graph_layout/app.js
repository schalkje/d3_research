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
var nodes_container = d3.select('#nodes')




//////////////////////////////////////////////////////////////
//
// Simulation
//

var simulation = d3.forceSimulation(nodes)
.force('charge', d3.forceManyBody())
.force('collision', d3.forceCollide(radius + 4))
.force('center', d3.forceCenter(width / 2, height / 2))
  .force('link', d3.forceLink(links)
    .id(d => d.id)
    .distance( 200 )
  )
  // .force('size', [width,height])
  .on("tick", tick)
  .on("end", endSimulation); 

// forceSimulation.force('link')
//   .links(links)
//   .distance( d => d.value * 100);

var tick_counter = 0;
function tick() 
{
  tick_counter++;
  console.log('tick')

  update();
};

function endSimulation() 
{
  console.log("Simulation ended after " +  tick_counter + ' ticks')

  console.log("Nodes:");
  console.log(nodes);

  console.log("Links:");
  console.log(links);
};



// // componentWillUnmount() {
// //   this.simulation.stop();
// // }

var nodes_objects = nodes_container
  .selectAll('.node')
  .data(nodes)
  .join("circle")
  .attr("cx", d => d.x)
  .attr('cy', (d) => d.y)
  .attr('r', d => radius)
  .attr("class", 'node');

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
    .attr('x1', function (d) { return 10 })
    .attr('y1', function (d) { return 10 })
    .attr('x2', function (d) { return 100 })
    .attr('y2', function (d) { return 100 })
    // .attr('x1', function (d) { return d.source.x })
    // .attr('y1', function (d) { return d.source.y })
    // .attr('x2', function (d) { return d.target.x })
    // .attr('y2', function (d) { return d.target.y })
    // .attr("x1", function(d) {
    //   var alfa = Math.atan(Math.abs(d.target.y-d.source.y)/Math.abs(d.target.x-d.source.x));
    //   var dx = Math.cos(alfa) * (radius + link_separator);
    //   return d.source.x < d.target.x ? d.source.x + dx : d.source.x - dx;
    // } )
    // .attr("y1", function(d) {
    //   var alfa = Math.atan(Math.abs(d.target.y-d.source.y)/Math.abs(d.target.x-d.source.x));
    //   var dy = Math.sin(alfa) * (radius + link_separator);
    //   return d.source.y < d.target.y ? d.source.y + dy : d.source.y - dy;
    // } )
    // .attr("x2", function(d) {
    //   var alfa = Math.atan(Math.abs(d.target.y-d.source.y)/Math.abs(d.target.x-d.source.x));
    //   var dx = Math.cos(alfa) * (radius + link_separator);
    //   return d.source.x < d.target.x ? d.target.x - dx : d.target.x + dx;
    // } )
    // .attr('y2', function(d) {
    //   var alfa = Math.atan(Math.abs(d.target.y-d.source.y)/Math.abs(d.target.x-d.source.x));
    //   var dy = Math.sin(alfa) * (radius + link_separator);
    //   return d.source.y < d.target.y ? d.target.y - dy : d.target.y + dy;
    // })
    // .attr('marker-end','url(#suit)')
    .attr("class", 'link');


function update()
{
 
  nodes_objects
    .attr("transform", d => "translate(" +d.x+ ","+d.y+")");

  nodeLabels_objects
    .attr("transform", d => "translate(" +d.x+ ","+d.y+")");

  links_objects
    .attr('x1', function (d) { return d.source.x })
    .attr('y1', function (d) { return d.source.y })
    .attr('x2', function (d) { return d.target.x })
    .attr('y2', function (d) { return d.target.y })
}

// function render() {
//   console.log('Draw nodes');
//   console.log(nodes);

//   var nodes_objects = nodes_container
//     .selectAll('.dataset')
//     .data(nodes)
//     .join("circle")
//     .attr("cx", function (d) {
//       console.log(d.x);
//       return d.x;
//     })
//     .attr('cy', (d) => parseInt(d.y))
//     .attr('r', d => radius)
//     .attr("class", 'dataset');

//   console.log('Draw node labels');

//   var nodeLabels_objects = nodes_container
//           .selectAll('.datasetlabel')
//           .data(nodes)
//           .join("text")
//           .attr("x", d => d.x)
//           .attr('y', d => d.y + 4)
//           .text(d => d.name)
//           .attr("class", 'datasetlabel');    


//   console.log('Draw links')

//   var links_objects = links_container
//       .selectAll('.link')
//       .data(links)
//       .join("line")
//       .attr("x1", function(d) {
//         var alfa = Math.atan(Math.abs(d.target.y-d.source.y)/Math.abs(d.target.x-d.source.x));
//         var dx = Math.cos(alfa) * (radius + link_separator);
//         return d.source.x < d.target.x ? d.source.x + dx : d.source.x - dx;
//       } )
//       .attr("y1", function(d) {
//         var alfa = Math.atan(Math.abs(d.target.y-d.source.y)/Math.abs(d.target.x-d.source.x));
//         var dy = Math.sin(alfa) * (radius + link_separator);
//         return d.source.y < d.target.y ? d.source.y + dy : d.source.y - dy;
//       } )
//       .attr("x2", function(d) {
//         var alfa = Math.atan(Math.abs(d.target.y-d.source.y)/Math.abs(d.target.x-d.source.x));
//         var dx = Math.cos(alfa) * (radius + link_separator);
//         return d.source.x < d.target.x ? d.target.x - dx : d.target.x + dx;
//       } )
//       .attr('y2', function(d) {
//         var alfa = Math.atan(Math.abs(d.target.y-d.source.y)/Math.abs(d.target.x-d.source.x));
//         var dy = Math.sin(alfa) * (radius + link_separator);
//         return d.source.y < d.target.y ? d.target.y - dy : d.target.y + dy;
//       })
//       .attr('marker-end','url(#suit)')
//       .attr("class", 'link');
// }