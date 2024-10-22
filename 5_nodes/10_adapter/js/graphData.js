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
    layout: 3,
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
      },
    ],
  },
];

export const testDataModel2 = [
  {
    id: "root-base",
    label: "Base Root Node",
    type: "group",
    groupType: "dynamic",
    children: [
      {
        id: "root",
        label: "Root Node",
        type: "group",
        groupType: "dynamic",
        children: [
          {
            id: "bankview",
            label: "Bankview",
            code: "BNV",
            type: "adapter",
            layout: 1,
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
              },
            ],
          },
          {
            id: "matrix",
            label: "Matrix",
            code: "MTX",
            type: "adapter",
            layout: 2,
            groupType: "fixed",
            children: [
              {
                id: "stg_matrix",
                label: "Staging Matrix",
                category: "staging",
                type: "node",
              },
              {
                id: "arc_matrix",
                label: "Archive Matrix",
                category: "archive",
                type: "node",
              },
              {
                id: "trn_matrix",
                label: "Transform Matrix",
                category: "transform",
                type: "node",
              },
            ],
          },
          {
            id: "eximius",
            label: "Eximius",
            code: "EXI",
            type: "adapter",
            layout: 3,
            groupType: "fixed",
            children: [
              {
                id: "stg_eximius",
                label: "Staging Eximius",
                category: "staging",
                type: "node",
              },
              {
                id: "arc_eximius",
                label: "Archive Eximius",
                category: "archive",
                type: "node",
              },
              {
                id: "trn_eximius",
                label: "Transform Eximius",
                category: "transform",
                type: "node",
              },
            ],
          },
        ],
      },
    ],
  },
];

export const dataModel = testDataModel2;

// console.log('Create links')

// // calculate links
// const links = [];

// console.log(links);
