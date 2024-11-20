//////////////////////////////////////////////////////////////
//
// Setup data
//

export const singleFoundation = {
  settings: {
    showCenterMark: false,

    // edges
    showGhostlines: false,
  },
  nodes: [
    {
      id: "bankview",
      label: "Bankview",
      code: "BNV",
      type: "foundation",
      groupType: "fixed",
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
        },
        {
          id: "matrix",
          label: "Matrix",
          code: "MTX",
          type: "foundation",
          groupType: "fixed",
          layout: {
            displayMode: "role",
          },
        },
        {
          id: "eximius",
          label: "Eximius",
          code: "EXM",
          type: "foundation",
          groupType: "fixed",
          layout: {
            displayMode: "role",
          },
        },
      ],
    },
  ],
  edges: [],
};

export const threeFullNames = {
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
            displayMode: "full",
          },
        },
        {
          id: "matrix",
          label: "Matrix",
          code: "MTX",
          type: "foundation",
          groupType: "fixed",
          layout: {
            displayMode: "full",
          },
        },
        {
          id: "eximius",
          label: "Eximius",
          code: "EXM",
          type: "foundation",
          groupType: "fixed",
          layout: {
            displayMode: "full",
          },
        },
      ],
    },
  ],
  edges: [],
};

export const threeFoundationNodesColumns = {
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
      id: "columns1",
      label: "Foundation",
      type: "columns",
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
        },
        {
          id: "matrix",
          label: "Matrix",
          code: "MTX",
          type: "foundation",
          groupType: "fixed",
          layout: {
            displayMode: "role",
          },
        },
        {
          id: "eximius",
          label: "Eximius",
          code: "EXM",
          type: "foundation",
          groupType: "fixed",
          layout: {
            displayMode: "role",
          },
        },
      ],
    },
  ],
  edges: [],
};

export const dataModel = threeFoundationNodes;
