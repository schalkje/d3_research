//////////////////////////////////////////////////////////////
//
// Setup data
//

export const testDataModel1 = [
  {
    id: "bankview",
    label: "Bankview",
    code: "BNV",
    type: "foundation",
    groupType: "fixed",
    layout: {
      displayMode: "code",
    },
  },
];

export const testDataModel21 = [
  {
    id: "lane1",
    label: "Foundation",
    type: "lane",
    groupType: "dynamic",
    layout: {
      displayMode: "code",
      numberOfLanes: 1,
    },
    children: [
      {
        id: "bankview",
        label: "Bankview",
        code: "BNV",
        type: "foundation",
        groupType: "fixed",
        layout: {
          displayMode: "code",
        },
      },
      {
        id: "matrix",
        label: "Matrix",
        code: "MTX",
        type: "foundation",
        groupType: "fixed",
        layout: {
          displayMode: "code",
        },
      },
      {
        id: "eximius",
        label: "Eximius",
        code: "EXM",
        type: "foundation",
        groupType: "fixed",
        layout: {
          displayMode: "code",
        },
      },
      
    ],
  },
];

export const dataModel = testDataModel21;

