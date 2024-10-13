//////////////////////////////////////////////////////////////
//
// Setup data
//

var nodes=[
    { id: 1, name: "node 1", width: 150, height: 40, dependsOn: [] },
    { id: 7, name: "node 7", width: 150, height: 40, dependsOn: [] },
    { id: 2, name: "node 2", width: 150, height: 40, dependsOn: [1] },
    { id: 3, name: "node 3", width: 150, height: 40, dependsOn: [2] },
    { id: 4, name: "node 4", width: 150, height: 40, dependsOn: [2] },
    { id: 5, name: "node 5", width: 150, height: 40, dependsOn: [4, 7] },
    { id: 6, name: "node 6", width: 150, height: 40, dependsOn: [5] }
  ]
  
  console.log('Create links')
     
  // calculate links
  const links = [];
  
  nodes.forEach(node => {
    if (!node.dependsOn) {
      console.log('  ' + node.id + ' is independend');
      return;
    }

    // initialize x and y
    node.x=10;
    node.y=10;
  
    console.log('  ' + node.id + ' depends on ' + node.dependsOn);
    node.dependsOn.forEach(index => {
        // links.push({ source: index, target: node.id, x1: 0, y1: 0, x2: 0, y2: 0 });
        // links.push({ source: index, target: node.id, x1: undefined, y1: undefined, x2: undefined, y2: undefined });
        // links.push({ source: nodes[index], target: nodes[node.id], x1: undefined, y1: undefined, x2: undefined, y2: undefined });
        // links.push({ source: index, target: node.id, 
        //     x1: function(d) { return d.source.x },
        //     y1: function(d) { return d.source.y },
        //     x2: function(d) { return d.target.x },
        //     y2: function(d) { return d.target.y }
    // })
    links.push({ source: index, target: node.id });
    });
  });
  
  console.log(links);