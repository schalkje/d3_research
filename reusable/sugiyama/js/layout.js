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
        // .decross(d3.decrossOpt())
        // .decross(d3.decrossOpt())
        .coord(d3.coordQuad())
        .nodeSize(d => getNodeSize(d));

    const { width: layoutWidth, height: layoutHeight } = layout(dag);
    width = changeDirection(layoutWidth, layoutHeight, horizontal).x;
    height = changeDirection(layoutWidth, layoutHeight, horizontal).y;

    svg.attr("viewBox", [
        0,
        0,
        width,
        height
    ]);

    minimapSvg.attr("viewBox", [
        0,
        0,
        width,
        height
    ]);

    return { svg_canvas, width, height };
}


// Function to get the computed width and height of an element
function getComputedDimensions(element) {
    const rect = element.node().getBoundingClientRect();
    return { width: rect.width, height: rect.height };
}