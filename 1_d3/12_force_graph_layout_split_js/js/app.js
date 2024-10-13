const radius = 40;
const link_separator = 4;
var width = 400;
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

  var links_container = d3.select('#links')
  var ghostlinks_container = d3.select('#ghostlinks')
  var nodes_container = d3.select('#nodes')
