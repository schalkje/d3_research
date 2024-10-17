import ParentNode from './nodeParent.js';

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