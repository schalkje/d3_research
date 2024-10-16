  //////////////////////////////////////////////////////////////
  //
  // Simulation
  //

  // var simulation = d3.forceSimulation(nodes)
  // .force('charge', d3.forceManyBody())
  // .force('collision', d3.forceCollide(radius + 4))
  // .force('center', d3.forceCenter(width / 2, height / 2))
  //   .force('link', d3.forceLink(links)
  //     .id(d => d.id)
  //     .distance( 200 )
  //   )
  //   .on("tick", tick)
  //   .on("end", endSimulation); 

  // Initialize the nodes and links for dynamic link force
nodes.forEach(node => node.degree = 0);
links.forEach(link => {
  link.source.degree += 1;
  link.target.degree += 1;
});

var simulation = d3.forceSimulation(nodes)
    .force('charge', d3.forceManyBody())
    .force('center', d3.forceCenter(width / 2, height / 2))
    .force('link', d3.forceLink(links)
      .id(d => d.id)
      .distance(calculateLinkDistance)
      // .strength(0.5)
    )
    .force('collision', rectCollide()) // Use the custom collision force
    .force('boundary', forceBoundary(0, 0, width, height))
    // .force('avoidCrossings', avoidLinkCrossings().links(links)) 
    // .force('avoidNodeLink', avoidNodeLinkCollisions().links(links)) // Add the custom force  
    .on("tick", tick)
    .on("end", endSimulation);    
  
  
  var tick_counter = 0;
  function tick() 
  {
    tick_counter++;
    console.log('tick')
    // if (tick_counter>150)
    //   simulation.stop();
  
    update();


    
  };

  function calculateLinkDistance(link) {
    const baseDistance = 50;
    const scalingFactor = 20;
    const sourceDegree = link.source.degree - 1;
    const targetDegree = link.target.degree - 1;
    const degreeSum = sourceDegree + targetDegree;
    return baseDistance + scalingFactor * ((sourceDegree + targetDegree) / 2)
  }
  
  
  function endSimulation() 
  {
    console.log("Simulation ended after " +  tick_counter + ' ticks')
  
    console.log("Nodes:");
    console.log(nodes);
  
    console.log("Links:");
    console.log(links);
  };
  