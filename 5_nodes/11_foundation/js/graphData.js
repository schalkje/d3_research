//////////////////////////////////////////////////////////////
//
// Setup data
//

export const singleFoundation = {
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
      type: "foundation",
      groupType: "fixed",
      layout: {
        displayMode: "code",
      },
    },
  ],
  edges: [],
};

export const threeFoundationNodes = {
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
  ],
  edges: [],
};

export const dataModel = threeFoundationNodes;
