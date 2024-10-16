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