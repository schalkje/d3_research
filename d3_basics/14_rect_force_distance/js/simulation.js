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
  const sourceWeight = 1;
  const targetWeight = 1;

// Initialize degrees
nodes.forEach(node => {
  node.inDegree = 0;
  node.outDegree = 0;
});

// Compute in-degree and out-degree
links.forEach(link => {
    link.source.outDegree += 1;
    link.target.inDegree += 1;
});


var simulation = d3.forceSimulation(nodes)
    .force('charge', d3.forceManyBody())
    .force('center', d3.forceCenter(width / 2, height / 2))
    .force('link', d3.forceLink(links)
      .id(d => d.id)
      .distance(calculateLinkDistance)
      // .distance(200)
      // .strength(1.5)
    )
    .force('collision', rectCollide()) // Use the custom collision force
    .force('boundary', forceBoundary(0, 0, width, height))

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
    const baseDistance = 52; // Minimum distance
    const scalingFactor = 10; // Adjust to your preference
  
    // const sourceDegree = link.source.outDegree-1;
    // const targetDegree = link.target.inDegree-1;
    const sourceDegree = link.source.inDegree+link.source.outDegree-1;
    const targetDegree = link.target.outDegree+link.target.inDegree-1;
  
    // Calculate distance
    // You can design the function to emphasize either in-degree, out-degree, or both
    const distance = baseDistance + scalingFactor * (
      (sourceDegree * sourceWeight) + (targetDegree * targetWeight)
    );
  
    return Math.max(distance,200);
  }
  
  
  
  function endSimulation() 
  {
    console.log("Simulation ended after " +  tick_counter + ' ticks')
  
    console.log("Nodes:");
    console.log(nodes);
  
    console.log("Links:");
    console.log(links);
  };
  