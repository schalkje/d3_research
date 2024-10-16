// Usage
var nodes_objects = createNodes(nodes_container, nodes) //, drag_started, dragged, drag_ended);

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

}
