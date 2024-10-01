function zoomToNode(node, graphData, zoom, width, height, horizontal) {
    // 1. Identify the node's immediate neighbors
    const neighbors = getImmediateNeighbors(node, graphData);

    // 2. Compute the bounding box
    const boundingBox = computeBoundingBox(neighbors);
    console.log("boundingBox",boundingBox);

    // 3. Calculate the zoom scale and translation
    const { scale, translate } = calculateScaleAndTranslate(boundingBox, width, height);

    console.log("scale",scale);
    console.log("translate",translate);

    // 4. Apply the zoom transform
    svg.transition()
        .duration(750)
        .call(zoom.transform, d3.zoomIdentity
            .translate(translate.x, translate.y)
            .scale(scale));
}


function getImmediateNeighbors(baseNode, graphData) {
    // console.log("getImmediateNeighbors baseNode",baseNode);
    // console.log("getImmediateNeighbors graphData",graphData);
    const neighbors = [baseNode];

    // Iterate over all edges to find connected nodes
    for (const node of graphData.nodes()) {
        if (baseNode.data.parentIds.includes(node.data.id) || baseNode.data.childrenIds.includes(node.data.id)) {
            // console.log("getImmediateNeighbors node", node);
            neighbors.push(node);
        }
    };

    return neighbors;
}

function computeBoundingBox(nodes) {
    const padding = 20; // Add some padding
    // console.log("computeBoundingBox nodes",nodes);

    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

    nodes.forEach(n => {
        console.log("computeBoundingBox node",n);
        const x = n.x;
        const y = n.y;
        const width = n.data.width;
        const height = n.data.height;

        minX = Math.min(minX, x - width / 2);
        minY = Math.min(minY, y - height / 2);
        maxX = Math.max(maxX, x + width / 2);
        maxY = Math.max(maxY, y + height / 2);
    });

    return {
        x: minX - padding,
        y: minY - padding,
        width: maxX - minX + 2 * padding,
        height: maxY - minY + 2 * padding
    };
}

function calculateScaleAndTranslate(boundingBox, svgWidth, svgHeight, horizontal) {
    const scale = Math.min(
        svgWidth / boundingBox.width,
        svgHeight / boundingBox.height
    );

    const translateX = (svgWidth / 2) - scale * (boundingBox.x + boundingBox.width / 2);
    const translateY = (svgHeight / 2) - scale * (boundingBox.y + boundingBox.height / 2);

    return {
        scale: scale,
        translate: {
            x: translateX,
            y: translateY
        }
    };
}
