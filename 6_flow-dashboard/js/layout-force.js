import { changeDirection } from "./util.js";
import { generateEdgePath } from "./drawNetwork.js";

export function forceLayoutAndCanvas(dashboard, dag) {
    dashboard.main.view.svg.selectAll("*").remove();
    const svg = dashboard.main.view.svg.append("g");
  
    const marginX = dashboard.layout.margin.x;
    const marginY = dashboard.layout.margin.y;
    // console.log("forceLayoutAndCanvas - marginX, marginY", marginX, marginY);
  
    function getNodeSize({ data }) {
      console.log("getNodeSize", data);
      return [
        data.width + marginX,
        data.height + marginY,
      ];
    }
  
    // Create a new force simulation layout
    // const nodes = JSON.parse(JSON.stringify(dag.nodes()));
    const nodes = dag.nodes();
    const links = dag.links();
    
  
    console.log("forceLayoutAndCanvas - nodes, links", nodes, links);
    // Initialize node positions if they are undefined
    nodes.forEach((node) => {
      if (!node.id) node.id = node.data.id || Math.random().toString(36).substr(2, 9); // Ensure each node has a unique id
      if (node.ux === undefined) node.ux = Math.random() * dashboard.main.view.width;
      if (node.uy === undefined) node.uy = Math.random() * dashboard.main.view.height;
      if (node.x === undefined) node.x = node.ux;
      if (node.y === undefined) node.y = node.uy;
      if (node.vx === undefined) node.vx = 0;
      if (node.vy === undefined) node.vy = 0;
      console.log("forceLayoutAndCanvas - node after initialization", node);
    });
    
    const collideForce = d3.forceCollide()
    .radius((d) => {
      console.log("collide force applied to node", d);
      return Math.max(getNodeSize(d)[0], getNodeSize(d)[1]) / 2;
    })
    .iterations(10);
  
    const linkForce = d3.forceLink(links)
    .id((d) => d.id)  // If your nodes have an 'id' property, use this to link nodes properly
    .distance((link) => getLinkDistance(link));
  
    console.log("forceLayoutAndCanvas - nodes, links", nodes, links);
    nodes.forEach((node, index) => {
      console.log(`Node ${index}:`, JSON.parse(JSON.stringify(node)));
    });
    
    
    links.forEach((link, index) => {
      console.log(`Link ${index}:`, link);
    });
    
    const simulation = d3.forceSimulation(nodes)
    .alpha(1)
    // .force("collide", collideForce)
    .force("link", linkForce)
      .force("charge", d3.forceManyBody().strength(-300))
      // .force("center", d3.forceCenter(dashboard.main.view.width / 2, dashboard.main.view.height / 2))
      // .force("collide", rectCollide().size((d) => getNodeSize(d)).strength(0.7))
      // .force("collide", rectCollide().size((d) => getNodeSize(d)).strength(1.5).iterations(10))
      // .force("collide", d3.forceCollide((d) => Math.max(getNodeSize(d)[0], getNodeSize(d)[1]) / 2 + 10))
      .on("tick", ticked)
      .restart();
  
    // collideForce.initialize(nodes);
  
    function ticked() {
      console.log("ticked");
      // Update node positions based on the current state of the simulation
      d3.selectAll(".node")
        // .attr("transform", (d) => `translate(${d.x}, ${d.y})`);
        .attr(
            "transform",
            (d) =>
              `translate(${changeDirection(d.x, d.y, dashboard.layout.horizontal).x - d.data.width / 2},${
                changeDirection(d.x, d.y, dashboard.layout.horizontal).y - d.data.height / 2
              })`
          );
  
        // Update link positions based on the current state of the simulation
      d3.selectAll(".edge")
        .attr("d", (edge) => {
            const points = generateEdgePath(edge, dashboard.layout);
            console.log("    ", edge, points);
            return dashboard.layout.lineGenerator(points);
        });
    }
    //     .attr("x1", (d) => {
    //         console.log("link source", d.source);
    //         return d.source.x;
    // })
    //     .attr("y1", (d) => d.source.y)
    //     .attr("x2", (d) => d.target.x)
    //     .attr("y2", (d) => d.target.y);
    // }
  
    function getLinkDistance(link) {
      console.log("getLinkDistance", link);
      // compute the distance between the source and target nodes
      // const sourceSize = getNodeSize(link.source);
      // const targetSize = getNodeSize(link.target);
      const dx = link.target.x - link.source.x;
      const dy = link.target.y - link.source.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      return distance;
      
    }
  
    // Define width and height from the current dashboard settings
    const width = changeDirection(dashboard.main.view.width, dashboard.main.view.height, dashboard.layout.horizontal).x;
    const height = changeDirection(dashboard.main.view.width, dashboard.main.view.height, dashboard.layout.horizontal).y;
  
    console.log("forceLayoutAndCanvas - width, height", width, height, dashboard.main.view, dashboard.minimap.view);
  
    dashboard.main.view.svg.attr("viewBox", [0, 0, width, height]);
    dashboard.minimap.view.svg.attr("viewBox", [0, 0, width, height]);
  
    dashboard.main.canvas = { svg: svg, width: width, height: height };
  
    return dashboard.main.canvas;
  }
  
  