//////////////////////////////////////////////////////////////
//
// Setup data
//

export const testDataModel1 = [
  {
    id: "bankview",
    label: "Bankview",
    code: "BNV",
    type: "adapter",
    groupType: "fixed",
    children: [
      {
        id: "stg_bankview",
        label: "Staging Bankview",
        category: "staging",
        type: "node",
      },      
      {
        id: "arc_bankview",
        label: "Archive Bankview",
        category: "archive",
        type: "node",
      },      
      {
        id: "trn_bankview",
        label: "Transform Bankview",
        category: "transform",
        type: "node",
      }
    ],
  },
];


export const dataModel = testDataModel1;

// console.log('Create links')
    
// // calculate links
// const links = [];



// console.log(links);