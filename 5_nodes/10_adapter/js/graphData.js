//////////////////////////////////////////////////////////////
//
// Setup data
//

export const singleAdapter = {
  settings: {
    showCenterMark: false,

    // edges
    showGhostlines: false,

    // ideas
    showGrid: true,
    showGroupLabels: true,
    showGroupTitles: true,
  },
  nodes: [
    {
    id: "bankview",
    label: "Bankview",
    code: "BNV",
    type: "adapter",
                layout: {
              mode: "full",
              arrangement: 3,
            },
  }],
  edges: [

  ]
};


export const threeLayouts = {
  settings: {
    showCenterMark: false,

    // edges
    showGhostlines: false,
    curved: false,

    // ideas
    showGrid: true,
    showGroupLabels: true,
    showGroupTitles: true,
  },
  nodes: [
  {
    id: "root",
    label: "Three differentadapter layout's",
    type: "lane",
    groupType: "dynamic",
    children: [
      {
        id: "bankview",
        label: "Bankview",
        code: "BNV",
        type: "adapter",
                    layout: {
              mode: "full",
              arrangement: 1,
            },
       },
      {
        id: "matrix",
        label: "Matrix",
        code: "MTX",
        type: "adapter",
        layout: {
              mode: "full",
              arrangement: 2,
            },
      },
      {
        id: "eximius",
        label: "Eximius",
        code: "EXI",
        type: "adapter",
                    layout: {
              mode: "full",
              arrangement: 3,
            },        
      },
    ],
  },
],
edges: [

]
};

export const threeLayoutsCurved = {
  settings: {
    showCenterMark: false,

    // edges
    showGhostlines: false,
    curved: true,

    // ideas
    showGrid: true,
    showGroupLabels: true,
    showGroupTitles: true,
  },
  nodes: [
  {
    id: "root",
    label: "Three differentadapter layout's",
    type: "lane",
    groupType: "dynamic",
    children: [
      {
        id: "bankview",
        label: "Bankview",
        code: "BNV",
        type: "adapter",
                    layout: {
              mode: "full",
              arrangement: 1,
            },
       },
      {
        id: "matrix",
        label: "Matrix",
        code: "MTX",
        type: "adapter",
        layout: {
              mode: "full",
              arrangement: 2,
            },
      },
      {
        id: "eximius",
        label: "Eximius",
        code: "EXI",
        type: "adapter",
                    layout: {
              mode: "full",
              arrangement: 3,
            },        
      },
    ],
  },
],
edges: [

]
};


