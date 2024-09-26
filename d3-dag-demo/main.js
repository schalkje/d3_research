// main.js

// Sample data for nodes and links
const nodes = [
  { id: "1", data: "Node 1" },
  { id: "2", data: "Node 2" },
  { id: "3", data: "Node 3" },
];

const links = [
  { source: "1", target: "2" },
  { source: "1", target: "3" },
];

// Create a DAG using d3-dag
const stratify = d3.graphStratify();
const dag = stratify(
  nodes.map((node) => ({
    id: node.id,
    parentIds: links
      .filter((link) => link.target === node.id)
      .map((link) => link.source),
  }))
);

// Apply a layout algorithm
const layout = d3.sugiyama();
const { width, height } = layout(dag);
console.log("size", width, height);

// Debug the dag
for (const node of dag.nodes()) {
  console.log("node: ", node.id, node.x, node.y);
}
for (const { points } of dag.links()) {
  console.log("link point:", points);
}

// Select the SVG element
const svg = d3.select("svg");

// Draw links (edges)
svg
  .append("g")
  .selectAll("path")
  .data(dag.links())
  .enter()
  .append("path")
  .attr(
    "d",
    d3
      .linkVertical()
      .source((d) => ({ x: d.source.x, y: d.source.y }))
      .target((d) => ({ x: d.target.x, y: d.target.y }))
  )
  .attr("stroke", "#999")
  .attr("fill", "none");

// Draw nodes
svg
  .append("g")
  .selectAll("circle")
  .data(dag.nodes())
  .enter()
  .append("circle")
  .attr("cx", (d) => d.x)
  .attr("cy", (d) => d.y)
  .attr("r", 20)
  .attr("fill", "#69b3a2");

// Add labels
svg
  .append("g")
  .selectAll("text")
  .data(dag.nodes())
  .enter()
  .append("text")
  .attr("x", (d) => d.x)
  .attr("y", (d) => d.y + 5)
  .attr("text-anchor", "middle")
  .text((d) => d.data.data);
