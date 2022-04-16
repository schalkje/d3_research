const radius = 50;

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


var simulation = d3.forceSimulation(nodes)
  .force(
    "link",
    d3.forceLink()
      .id(d => d.id)
      .links(links)
      .distance(100)
      .strength(0.9)
  )
  .force("x", d3.forceX(200).strength(0.1))
  .force("charge", d3.forceManyBody().strength(-1500))
  .force(
    "y",
    d3.forceY()
      .y(node => {
        // let dependedOn = this._nodeDependedOn(node);

        // if (!dependedOn) {
        console.log(node);
        console.log(this._calcPath(node));
        return this._calcPath(node) * 150 - 75;
        // }

        // return node.dependsOn.length < 1 ? 100 : 0;
      })
      .strength(node => {
        let dependedOn = this._nodeDependedOn(node);

        // if (!dependedOn || node.dependsOn.length < 1) {
        return 3;
        // }

        // not a top or bottom
        // return 0;
      })
  )
  .force("collide", d3.forceCollide(radius));

simulation.on("tick", () => {
  // render();
});

simulation.on("end", function() {
  console.log("simulation end"); 
  console.log(nodes);
  render();
});

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

render();

function render() {
  console.log('Draw nodes');
  console.log(nodes);

  var nodes_objects = container
    .selectAll('.dataset')
    .data(nodes)
    .join("circle")
    .attr("cx", function (d) {
      console.log(d.x);
      return d.x;
    })
    .attr('cy', (d) => parseInt(d.y))
    .attr('r', d => radius)
    .attr("class", 'dataset');

  console.log('Draw node labels');

  var nodeLabels_objects = container
          .selectAll('.datasetlabel')
          .data(nodes)
          .join("text")
          .attr("x", d => d.x)
          .attr('y', d => d.y)
          .text(d => d.name)
          .attr("class", 'datasetlabel');    


  console.log('Draw links')

  var links_objects = container
      .selectAll('.link')
      .data(links)
      .join("line")
      .attr("x1", d => d.source.x)
      .attr('y1', d => d.source.y + radius)
      .attr("x2", d => d.target.x)
      .attr('y2', d => d.target.y - radius)
      .attr('marker-end','url(#suit)')
      .attr("class", 'link');
}