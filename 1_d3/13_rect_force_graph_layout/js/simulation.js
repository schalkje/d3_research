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

var simulation = d3.forceSimulation(nodes)
    .force('charge', d3.forceManyBody())
    .force('center', d3.forceCenter(width / 2, height / 2))
    .force('link', d3.forceLink(links)
      .id(d => d.id)
      .distance(200)
    )
    .force('collision', rectCollide()) // Use the custom collision force
    .force('boundary', forceBoundary(0, 0, width, height)

    )
    .on("tick", tick)
    .on("end", endSimulation);    
  
  
  var tick_counter = 0;
  function tick() 
  {
    tick_counter++;
    // console.log('tick')
  
    // if (tick_counter==1)
      update();

    
  };
  
  function endSimulation() 
  {
    console.log("Simulation ended after " +  tick_counter + ' ticks')
  
    console.log("Nodes:");
    console.log(nodes);
  
    console.log("Links:");
    console.log(links);
  };
  