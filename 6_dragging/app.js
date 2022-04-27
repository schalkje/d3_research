const radius = 40;
const link_separator = 4;

var nodes=[
  { id: 1, name: "node 1", dependsOn: [] },
  { id: 7, name: "node 7", dependsOn: [] },
  { id: 2, name: "node 2", dependsOn: [1] },
  { id: 3, name: "node 3", dependsOn: [2] },
  { id: 4, name: "node 4", dependsOn: [2] },
  { id: 5, name: "node 5", dependsOn: [4, 7] },
  { id: 6, name: "node 6", dependsOn: [5] }
]

var width = 400;
var height = 800;

console.log('Create container');

var container = d3.select('#svg_container')
    .attr("width", width)
    .attr("height", height)
    .attr("class", "container");

var links_container = d3.select('#links')
var nodes_container = d3.select('#nodes')



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

// console.log(links);


var simulation = d3.forceSimulation(nodes)
  .force(
    "link",
    d3.forceLink()
      .id(d => d.id)
      .links(links)
      .distance(80) // with 100 you get link below a node
      .strength(0.9)
  )
  .force("x", d3.forceX(200).strength(0.1))
  .force("charge", d3.forceManyBody().strength(-1500))
  .on("tick", tick)
  .force(
    "y",
    d3.forceY()
      .y(node => {
        return this._calcPath(node) * 150 - 75;
      })
      .strength(node => {
        let dependedOn = this._nodeDependedOn(node);
        return 3;
      })
  )
  // .force("collide", d3.forceCollide(radius * 1.2));

var tick_counter = 0;
function tick()
{
  tick_counter++;
  // // console.log('tick')
  // if (tick_counter % 60 === 0)
  // {
  //   render();
  // }
  render();
}


// simulation.on("end", function() {
//   console.log("simulation end"); 
//   console.log(nodes);
//   render();
// });

// // componentWillUnmount() {
// //   this.simulation.stop();
// // }

function _nodeDependedOn(node) {
  let dependedOn = false;

  nodes.forEach(n => {
    dependedOn = dependedOn || n.dependsOn.includes(node.id);
  });

  return dependedOn;
}

// function _getMaxPath() {
// const { nodes } = this.state;

// const terminations = [];
// nodes.forEach(node => {
//   if (!this._nodeDependedOn(node)) {
//     terminations.push(node);
//   }
// });

// return Math.max(...terminations.map(node => this._calcPath(node)));
// }

/** 
* Recursively calculates the **longest** path in our tree
*/
function _calcPath(node, length = 1) {
  if (!node.dependsOn || node.dependsOn.length < 1) {
    return length;
  }

  return Math.max(
    ...node.dependsOn.map(id =>
      this._calcPath(nodes.find(n => n.id === id), length + 1)
    )
  );
}

// render();

// function render() {
//   // console.log('Draw nodes');
//   // console.log(nodes);

  var nodes_objects = nodes_container
    .selectAll('.dataset')
    // .data(nodes)
    .data(simulation.nodes())
    .join("circle")
    .attr("cx", function (d) {
      return d.x;
    })
    .attr('cy', (d) => parseInt(d.y))
    .attr('r', d => radius)
    .attr("class", 'dataset')
    .call(
            d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended)
    );

  // console.log('Draw node labels');

  var nodeLabels_objects = nodes_container
          .selectAll('.datasetlabel')
          .data(simulation.nodes())
          .join("text")
          .attr("x", d => d.x)
          .attr('y', d => d.y + 4)
          .text(d => d.name)
          .attr("class", 'datasetlabel');    


  // console.log('Draw links')

  var links_objects = links_container
      .selectAll('.link')
      .data(links)
      .join("line")
      .attr("x1", function(d) {
        var alfa = Math.atan(Math.abs(d.target.y-d.source.y)/Math.abs(d.target.x-d.source.x));
        var dx = Math.cos(alfa) * (radius + link_separator);
        return d.source.x;
        // return d.source.x < d.target.x ? d.source.x + dx : d.source.x - dx;
      } )
      .attr("y1", function(d) {
        var alfa = Math.atan(Math.abs(d.target.y-d.source.y)/Math.abs(d.target.x-d.source.x));
        var dy = Math.sin(alfa) * (radius + link_separator);
        return d.source.y;
        // return d.source.y < d.target.y ? d.source.y + dy : d.source.y - dy;
      } )
      .attr("x2", function(d) {
        var alfa = Math.atan(Math.abs(d.target.y-d.source.y)/Math.abs(d.target.x-d.source.x));
        var dx = Math.cos(alfa) * (radius + link_separator);
        return d.target.x;
        // return d.source.x < d.target.x ? d.target.x - dx : d.target.x + dx;
      } )
      .attr('y2', function(d) {
        var alfa = Math.atan(Math.abs(d.target.y-d.source.y)/Math.abs(d.target.x-d.source.x));
        var dy = Math.sin(alfa) * (radius + link_separator);
        return d.target.y;
        // return d.source.y < d.target.y ? d.target.y - dy : d.target.y + dy;
      })
      .attr('marker-end','url(#suit)')
      .attr("class", 'link');
// }


function dragstarted(d)
{
  d3.select('#status').text('drag started');
  // when alpha hits 0 it stops. restart again
    // simulation.alphaTarget(0.3).restart();
    d3.select(this).attr("stroke", "black");
}

function dragged(d)
{
  d3.select('#drag').text(d.name +': '+d3.event.x + ',' + d3.event.y);
    // d.fx = d3.event.x;
    // d.fy = d3.event.y;
    d.x = d3.event.x;
    d.y = d3.event.y;
    // d3.select(this).raise().attr("cx", d.x = event.x).attr("cy", d.y = event.y);
    render();
}

function dragended(d)
{
  d3.select('#status').text('drag ended');
  // alpha min is 0, head there
    // simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;

    //d3.select(this).attr("stroke", null); 
}

// function render()
// {
//   nodes_objects
//   .attr("cx", function (d) {
//     return d.x;
//   })
//   .attr('cy', (d) => parseInt(d.y));

//   nodeLabels_objects
// .attr("x", d => d.x)
// .attr('y', d => d.y + 4);
// }


function render()
{
  nodes_objects.attr("transform", function(d) {
    return "translate(" + d.x + "," + d.y + ")";
  })
  // .attr("cx", function (d) {
  //   return d.x;
  // })
  // .attr('cy', (d) => parseInt(d.y));

  nodeLabels_objects.attr("transform", function(d) {
    return "translate(" + d.x + "," + d.y + ")";
  })

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
      return d.target.x;
      // return d.source.x < d.target.x ? d.target.x - dx : d.target.x + dx;
    } )
    .attr('y2', function(d) {
      var alfa = Math.atan(Math.abs(d.target.y-d.source.y)/Math.abs(d.target.x-d.source.x));
      var dy = Math.sin(alfa) * (radius + link_separator);
      return d.target.y;
    })
}