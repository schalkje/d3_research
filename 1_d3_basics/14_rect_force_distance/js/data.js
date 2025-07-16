//////////////////////////////////////////////////////////////
//
// Setup data
//

var nodes0=[
  { id: 1, name: "node 1", width: 150, height: 40, dependsOn: [] },
  { id: 2, name: "node 2", width: 150, height: 40, dependsOn: [1] },
  { id: 3, name: "node 3", width: 150, height: 40, dependsOn: [2] },
]

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

var nodes3 = [
  { id: 1, name: "stg-1", width: 150, height: 40, dependsOn: [] },
  { id: 3, name: "trn-1", width: 150, height: 40, dependsOn: [1] },

  { id: 4, name: "stg-2", width: 150, height: 40, dependsOn: [] },
  { id: 6, name: "trn-2", width: 150, height: 40, dependsOn: [4] },

  { id: 7, name: "stg-3", width: 150, height: 40, dependsOn: [] },
  { id: 9, name: "trn-3", width: 150, height: 40, dependsOn: [7] },
  
  { id: 10, name: "stg-4", width: 150, height: 40, dependsOn: [] },
  { id: 12, name: "trn-4", width: 150, height: 40, dependsOn: [10] },
  
  { id: 13, name: "stg-5", width: 150, height: 40, dependsOn: [] },
  { id: 15, name: "trn-5", width: 150, height: 40, dependsOn: [13] },
  
  { id: 16, name: "stg-6", width: 150, height: 40, dependsOn: [] },
  { id: 18, name: "trn-6", width: 150, height: 40, dependsOn: [16] },
  
  { id: 19, name: "stg-7", width: 150, height: 40, dependsOn: [] },
  { id: 21, name: "trn-7", width: 150, height: 40, dependsOn: [19] },
  

  { id: 40, name: "ods", width: 150, height: 150, dependsOn: [3,6,9,12,15,18,21] },
  { id: 50, name: "dwh", width: 150, height: 150, dependsOn: [40] },

  { id: 60, name: "node 10", width: 150, height: 40, dependsOn: [50] },
  { id: 61, name: "node 11", width: 150, height: 40, dependsOn: [50] },
  { id: 62, name: "node 12", width: 150, height: 40, dependsOn: [50] },
  { id: 63, name: "node 13", width: 150, height: 40, dependsOn: [50] },
  { id: 64, name: "node 14", width: 150, height: 40, dependsOn: [50] },
  { id: 65, name: "node 15", width: 150, height: 40, dependsOn: [50] },
  { id: 66, name: "node 16", width: 150, height: 40, dependsOn: [50] },
  { id: 67, name: "node 17", width: 150, height: 40, dependsOn: [50] },
];

var nodes4 = [
  { id: 1, name: "stg-1", width: 150, height: 40, dependsOn: [] },
  { id: 2, name: "arc-1", width: 150, height: 40, dependsOn: [1] },
  { id: 3, name: "trn-1", width: 150, height: 40, dependsOn: [1] },

  { id: 4, name: "stg-2", width: 150, height: 40, dependsOn: [] },
  { id: 5, name: "arc-2", width: 150, height: 40, dependsOn: [4] },
  { id: 6, name: "trn-2", width: 150, height: 40, dependsOn: [4] },

  { id: 7, name: "stg-3", width: 150, height: 40, dependsOn: [] },
  { id: 8, name: "arc-3", width: 150, height: 40, dependsOn: [7] },
  { id: 9, name: "trn-3", width: 150, height: 40, dependsOn: [7] },
  
  { id: 10, name: "stg-4", width: 150, height: 40, dependsOn: [] },
  { id: 11, name: "arc-4", width: 150, height: 40, dependsOn: [10] },
  { id: 12, name: "trn-4", width: 150, height: 40, dependsOn: [10] },
  
  { id: 13, name: "stg-5", width: 150, height: 40, dependsOn: [] },
  { id: 14, name: "arc-5", width: 150, height: 40, dependsOn: [13] },
  { id: 15, name: "trn-5", width: 150, height: 40, dependsOn: [13] },
  
  { id: 16, name: "stg-6", width: 150, height: 40, dependsOn: [] },
  { id: 17, name: "arc-6", width: 150, height: 40, dependsOn: [16] },
  { id: 18, name: "trn-6", width: 150, height: 40, dependsOn: [16] },
  
  { id: 19, name: "stg-7", width: 150, height: 40, dependsOn: [] },
  { id: 20, name: "arc-7", width: 150, height: 40, dependsOn: [19] },
  { id: 21, name: "trn-7", width: 150, height: 40, dependsOn: [19] },
  

  { id: 40, name: "ods", width: 150, height: 150, dependsOn: [3,6,9,12,15,18,21] },
  { id: 50, name: "dwh", width: 150, height: 150, dependsOn: [40] },

  { id: 60, name: "node 10", width: 150, height: 40, dependsOn: [50] },
  { id: 61, name: "node 11", width: 150, height: 40, dependsOn: [50] },
  { id: 62, name: "node 12", width: 150, height: 40, dependsOn: [50] },
  { id: 63, name: "node 13", width: 150, height: 40, dependsOn: [50] },
  { id: 64, name: "node 14", width: 150, height: 40, dependsOn: [50] },
  { id: 65, name: "node 15", width: 150, height: 40, dependsOn: [50] },
  { id: 66, name: "node 16", width: 150, height: 40, dependsOn: [50] },
  { id: 67, name: "node 17", width: 150, height: 40, dependsOn: [50] },
];
  var nodes=nodes4;

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