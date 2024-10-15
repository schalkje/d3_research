//////////////////////////////////////////////////////////////
//
// Setup data
//

var nodes1=[
    { id: 1, name: "node 1", width: 150, height: 40, dependsOn: [] },
    { id: 7, name: "node 7", width: 150, height: 40, dependsOn: [] },
    { id: 2, name: "node 2", width: 150, height: 40, dependsOn: [1] },
    { id: 3, name: "node 3", width: 150, height: 40, dependsOn: [2] },
    { id: 4, name: "node 4", width: 150, height: 40, dependsOn: [2] },
    { id: 5, name: "node 5", width: 150, height: 40, dependsOn: [4, 7] },
    { id: 6, name: "node 6", width: 150, height: 40, dependsOn: [5] }
  ]

  var nodes2 = [
    { id: 1, name: "node 1", width: 150, height: 40, dependsOn: [] },
    { id: 2, name: "node 2", width: 150, height: 40, dependsOn: [] },
    { id: 3, name: "node 3", width: 150, height: 40, dependsOn: [1] },
    { id: 4, name: "node 4", width: 150, height: 40, dependsOn: [2] },
    { id: 5, name: "node 5", width: 150, height: 40, dependsOn: [3] },
    { id: 6, name: "node 6", width: 150, height: 40, dependsOn: [2, 4] },
    { id: 7, name: "node 7", width: 150, height: 40, dependsOn: [] },
    { id: 8, name: "node 8", width: 150, height: 40, dependsOn: [7] },
    { id: 9, name: "node 9", width: 150, height: 40, dependsOn: [6] },
    { id: 10, name: "node 10", width: 150, height: 40, dependsOn: [8, 1] },
    { id: 11, name: "node 11", width: 150, height: 40, dependsOn: [] },
    { id: 12, name: "node 12", width: 150, height: 40, dependsOn: [9, 5] },
    { id: 13, name: "node 13", width: 150, height: 40, dependsOn: [11] },
    { id: 14, name: "node 14", width: 150, height: 40, dependsOn: [12] },
    { id: 15, name: "node 15", width: 150, height: 40, dependsOn: [10] },
    { id: 16, name: "node 16", width: 150, height: 40, dependsOn: [14] },
    { id: 17, name: "node 17", width: 150, height: 40, dependsOn: [16] },
    { id: 18, name: "node 18", width: 150, height: 40, dependsOn: [15] },
    { id: 19, name: "node 19", width: 150, height: 40, dependsOn: [13, 17] },
    { id: 20, name: "node 20", width: 150, height: 40, dependsOn: [18] }
];

  var nodes=nodes2;

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
      links.push({ source: index, target: node.id });
    });
  });
  
  console.log(links);