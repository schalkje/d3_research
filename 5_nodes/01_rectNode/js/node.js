// Node Factory to create different node types
function createNodeFactory(node, container) {
    switch (node.type) {
        case "rect":
            createRectNode(node, container);
            break;
        case "adapter":
            createRectNode(node, container);
            break;
        default:
            createDefaultNode(node, container);  // For unknown types
    }
}

// Function to create nodes with positioning and drag behavior
function createNodes(container, nodes) //, drag_started, dragged, drag_ended) 
{
    var nodes_objects = container
        .append("g")
        .selectAll(".node")
        .data(nodes)
        .enter()
        .append("g")
        .attr("class", (d) => `node ${d.Type}`)
        .attr("transform", (d) => `translate(${d.x - d.width / 2},${d.y - d.height / 2})`);
        // .call(d3.drag()
        //     .on('start', drag_started)
        //     .on('drag', dragged)
        //     .on('end', drag_ended)
        // );

    // Create nodes based on their type
    nodes_objects.each(function (d) {
        createNodeFactory(d, d3.select(this));
    });

    return nodes_objects;
}

// // Node TypeA Creation Logic
// function createTypeANode(node, container) {
//     const x_center = node.width / 2;
//     const y_center = node.height / 2 + 4;

//     // Append rectangle for TypeA
//     container.append("rect").attrs({
//         class: "nodeRect",
//         width: node.width,
//         height: node.height,
//         rx: 5,
//         ry: 5
//     });

//     // Append text for TypeA
//     container.append("text").attrs({
//         x: x_center,
//         y: y_center,
//         class: "node_label"
//     }).text(`TypeA: ${node.name}`);
// }

// // Node TypeB Creation Logic
// function createTypeBNode(node, container) {
//     const x_center = node.width / 2;
//     const y_center = node.height / 2 + 4;

//     // Append circle for TypeB
//     container.append("circle").attrs({
//         class: "nodeCircle",
//         r: Math.min(node.width, node.height) / 2,
//         cx: x_center,
//         cy: y_center - 4
//     });

//     // Append text for TypeB
//     container.append("text").attrs({
//         x: x_center,
//         y: y_center + 10,
//         class: "node_label"
//     }).text(`TypeB: ${node.name}`);
// }

// Default Node Creation Logic for unknown types
function createDefaultNode(node, container) {
    const x_center = node.width / 2;
    const y_center = node.height / 2 + 4;

    // Append a default shape, like an ellipse or rectangle, for unknown types
    container.append("ellipse")
        .attr("class", "ellipse")
        .attr("rx", node.width / 2)
        .attr("ry", node.height / 2)
        .attr("cx", x_center)
        .attr("cy", y_center);

    // Append text for default type
    container.append("text")
        .attr("x", x_center)
        .attr("y", y_center)
        .attr("class", "node_label")
        .text(`Unknown: ${node.name}`);
}


