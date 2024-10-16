//////////////////////////////////////////////////////////////
//
// Setup data
//

var nodes0=[
  { id: 1, name: "node 1", type: "rect", width: 150, height: 40, dependsOn: [] },
  { id: 2, name: "node 2", type: "rect", width: 150, height: 40, dependsOn: [1] },
  { id: 3, name: "node 3", width: 150, height: 40, dependsOn: [2] },
]

  var nodes=nodes0;

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