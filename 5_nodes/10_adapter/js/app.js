const radius = 75;
const link_separator = 4;
// var width = 2000;
// var height = 1800;
var width = 1000;
var height = 800;

//////////////////////////////////////////////////////////////
//
// Initialize drawing container
//

// function initialize() {
  console.log('Create container');

  var container = d3.select('#svg_container')
      .attr("width", width)
      .attr("height", height)
      .attr("class", "container");

  var nodes_container = d3.select('#nodes')
