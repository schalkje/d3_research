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

export const layoutsFull = {
  settings: {
    showCenterMark: false,

    // edges
    showGhostlines: false,
    curved: false,
  },
  nodes: [
    {
      id: "root",
      label: "All different adapter layout's",
      type: "lane",
      groupType: "dynamic",
      children: [
        {
          id: "full_full_1",
          label: "full_full_1",
          code: "BNV",
          type: "adapter",
          layout: {
            mode: "full",
            displayMode: "full",
            arrangement: 1,
          },
        },
        {
          id: "full_full_2",
          label: "full_full_2",
          code: "MTX",
          type: "adapter",
          layout: {
            mode: "full",
            displayMode: "full",
            arrangement: 2,
          },
        },
        {
          id: "eximius",
          label: "full,full,3",
          code: "EXI",
          type: "adapter",
          layout: {
            mode: "full",
            displayMode: "full",
            arrangement: 3,
          },
        },
        {
          id: "stater",
          label: "sa_full_3",
          code: "Str",
          type: "adapter",
          layout: {
            mode: "staging-archive",
            displayMode: "full",
            arrangement: 3,
          },
        },
        {
          id: "sa_full",
          label: "sa_full",
          code: "Str",
          type: "adapter",
          layout: {
            mode: "staging-archive",
            displayMode: "full",
          },
        },
        {
          id: "st_full_3",
          label: "st_full_3",
          code: "FDR",
          type: "adapter",
          layout: {
            mode: "staging-transform",
            displayMode: "full",
            arrangement: 3,
          },
        },
        {
          id: "a_full_3",
          label: "a_full_3",
          code: "MF",
          type: "adapter",
          layout: {
            mode: "archive-only",
            displayMode: "full",
            arrangement: 3,
          },
        },
      ],
    },
  ],
  edges: [],
};

export const layoutsRole = {
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
            displayMode: "role",
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
            displayMode: "role",
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
            displayMode: "role",
            arrangement: 3,
          },
        },
        {
          id: "stater",
          label: "sa_role_3",
          code: "Str",
          type: "adapter",
          layout: {
            mode: "staging-archive",
            displayMode: "role",
            arrangement: 3,
          },
        },
        {
          id: "sa_role",
          label: "sa_role",
          code: "Str",
          type: "adapter",
          layout: {
            mode: "staging-archive",
            displayMode: "role",
          },
        },
        {
          id: "st_role",
          label: "st_role",
          code: "FDR",
          type: "adapter",
          layout: {
            mode: "staging-transform",
            displayMode: "role",
          },
        },
        {
          id: "fidor",
          label: "st_role_3",
          code: "FDR",
          type: "adapter",
          layout: {
            mode: "staging-transform",
            displayMode: "role",
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
            displayMode: "role",
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

export const layoutsFullLongText = {
  settings: {
    showCenterMark: false,

    // edges
    showGhostlines: false,
    curved: false,
  },
  nodes: [
    {
      id: "root",
      label: "All different adapter layout's",
      type: "lane",
      groupType: "dynamic",
      children: [
        {
          id: "full_full_1",
          label: "full_full_1, with a longer text",
          code: "BNV",
          type: "adapter",
          layout: {
            mode: "full",
            displayMode: "full",
            arrangement: 1,
          },
        },
        {
          id: "full_full_2",
          label: "full_full_2, with a longer text",
          code: "MTX",
          type: "adapter",
          layout: {
            mode: "full",
            displayMode: "full",
            arrangement: 2,
          },
        },
        {
          id: "eximius",
          label: "full,full,3, with a longer text",
          code: "EXI",
          type: "adapter",
          layout: {
            mode: "full",
            displayMode: "full",
            arrangement: 3,
          },
        },
        {
          id: "stater",
          label: "sa_full_3, with a longer text",
          code: "Str",
          type: "adapter",
          layout: {
            mode: "staging-archive",
            displayMode: "full",
            arrangement: 3,
          },
        },
        {
          id: "sa_full",
          label: "sa_full, with a longer text",
          code: "Str",
          type: "adapter",
          layout: {
            mode: "staging-archive",
            displayMode: "full",
          },
        },
        {
          id: "st_full_3",
          label: "st_full_3, with a longer text",
          code: "FDR",
          type: "adapter",
          layout: {
            mode: "staging-transform",
            displayMode: "full",
            arrangement: 3,
          },
        },
        {
          id: "a_full_3",
          label: "a_full_3, with a longer text",
          code: "MF",
          type: "adapter",
          layout: {
            mode: "archive-only",
            displayMode: "full",
            arrangement: 3,
          },
        },
      ],
    },
  ],
  edges: [],
};