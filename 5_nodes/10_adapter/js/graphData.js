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
    },
  ],
  edges: [],
};

export const singleLaned = {
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
      label: "Single lane",
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
      ],
    },
  ],
  edges: [],
};

export const layouts = {
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
      label: "All different adapter layout's",
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
        {
          id: "stater",
          label: "Stater",
          code: "Str",
          type: "adapter",
          layout: {
            mode: "staging-archive",
            arrangement: 3,
          },
        },
        {
          id: "fidor",
          label: "Fidor",
          code: "FDR",
          type: "adapter",
          layout: {
            mode: "staging-transform",
            arrangement: 3,
          },
        },
        {
          id: "mainframe",
          label: "Mainframe",
          code: "MF",
          type: "adapter",
          layout: {
            mode: "archive-only",
            arrangement: 3,
          },
        },
      ],
    },
  ],
  edges: [],
};

export const threeLayoutsColumns = {
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
      type: "columns",
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
  edges: [],
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
  edges: [],
};
