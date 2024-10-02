function computeLayout(svg, minimapSvg, dag, horizontal) {
    svg.selectAll("*").remove();
    const svg_canvas = svg.append("g");

    const marginX = changeDirection(8, 100, horizontal).x;
    const marginY = changeDirection(50, 8, horizontal).x;

    function getNodeSize({ data }) {
        return [
            changeDirection(data.width + marginX, data.height + marginY, horizontal).x,
            changeDirection(data.width + marginX, data.height + marginY, horizontal).y
        ];
    }

    // Apply the Sugiyama layout
    const layout = d3.sugiyama()
        .layering(d3.layeringLongestPath())
        .decross(d3.decrossOpt())
        .coord(d3.coordQuad())
        .nodeSize(d => getNodeSize(d));

    const { width, height } = layout(dag);
    console.log("layout size", width, height);
    svg.attr("viewBox", [
        0,
        0,
        changeDirection(width, height, horizontal).x,
        changeDirection(width, height, horizontal).y
    ]);

    minimapSvg.attr("viewBox", [
        0,
        0,
        changeDirection(width, height, horizontal).x,
        changeDirection(width, height, horizontal).y
    ]);

    return { svg_canvas, width, height };
}


// Function to get the computed width and height of an element
function getComputedDimensions(element) {
    const rect = element.node().getBoundingClientRect();
    return { width: rect.width, height: rect.height };
}