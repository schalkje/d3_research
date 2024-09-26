// import { dagStratify, dagConnect } from 'd3-dag';

function rest(dag) {



    layering = d3.layeringSimplex()

    decrossing = d3.decrossOpt()

    coords = d3.coordQuad()

    padding = 1.5;
    const base = nodeRadius * 2 * padding;
    nodeSize = () => [base, base]

    layout = d3.sugiyama()
        .nodeSize([60, 60])
        .layering(layering)
        .decross(decrossing)
        .coord(coords)
        .nodeSize(nodeSize)

    const { width, height } = layout(dag)

    console.log("hi")
    console.log(width)
    console.log(height)

    svgSelection = d3.select("#wrapper")
        .append("svg")
        .attr("width", width)
        .attr("height", height)

    // console.log(svgNode)

  // This code only handles rendering
  // const svgNode = `<svg width=${width} height=${height}></svg>`

  // const svgSelection = d3.select(svgNode);
  const defs = svgSelection.append('defs'); // For gradients

  const steps = dag.size();
  const interp = d3.interpolateRainbow;
  const colorMap = {};
  for (const [i, node] of dag.idescendants().entries()) {
    colorMap[node.data.id] = interp(i / steps);
  }

  // How to draw edges
  const line = d3.line()
    .curve(d3.curveCatmullRom)
    .x(d => d.x)
    .y(d => d.y);

  // Plot edges
  svgSelection.append('g')
    .selectAll('path')
    .data(dag.links())
    .enter()
    .append('path')
    .attr('d', ({ points }) => line(points))
    .attr('fill', 'none')
    .attr('stroke-width', 3)
    .attr('stroke', ({source, target}) => {
      // encodeURIComponents for spaces, hope id doesn't have a `--` in it
      const gradId = encodeURIComponent(`${source.data.id}--${target.data.id}`);
      const grad = defs.append('linearGradient')
        .attr('id', gradId)
        .attr('gradientUnits', 'userSpaceOnUse')
        .attr('x1', source.x)
        .attr('x2', target.x)
        .attr('y1', source.y)
        .attr('y2', target.y);
      grad.append('stop').attr('offset', '0%').attr('stop-color', colorMap[source.data.id]);
      grad.append('stop').attr('offset', '100%').attr('stop-color', colorMap[target.data.id]);
      return `url(#${gradId})`;
    });

  // Select nodes
  const nodes = svgSelection.append('g')
    .selectAll('g')
    .data(dag.descendants())
    .enter()
    .append('g')
    .attr('transform', ({x, y}) => `translate(${x}, ${y})`);

  // Plot node circles
  nodes.append('circle')
    .attr('r', nodeRadius)
    .attr('fill', n => colorMap[n.data.id]);

  // Add text to nodes
  nodes.append('text')
    .text(d => d.data.id)
    .attr('font-weight', 'bold')
    .attr('font-family', 'sans-serif')
    .attr('text-anchor', 'middle')
    .attr('alignment-baseline', 'middle')
    .attr('fill', 'white');


}

function drawDag() {

    nodeRadius = 20
    source = "Grafo"

    sources = new Map([
        ["Grafo", ["grafo", d3.dagStratify()]],
        ["X-Shape", ["ex", d3.dagStratify()]],
        ["Zherebko", ["zherebko", d3.dagConnect()]],
    ])

    reader = d3.dagStratify()
    const dag = d3.json("https://raw.githubusercontent.com/erikbrinkman/d3-dag/main/examples/grafo.json").then(
        (dag_data) => reader(dag_data)
    )

    console.log("dag")
    console.log(dag)

  // Usep computed layout and get size
    dag.then(rest)

}

drawDag()