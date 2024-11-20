//////////////////////////////////////////////////////////////
//
// Setup data
//

export const simple = {
  settings: {
    showCenterMark: false,

    // edges
    showGhostlines: false,
  },
  nodes: [
    {
      id: "columns1",
      label: "Columns ",
      type: "columns",
      groupType: "fixed",
      layout: {
        displayMode: "code",
      },
      children: [
        {
          id: "bankview",
          label: "Bankview",
          type: "node",
        },
        {
          id: "matrix",
          label: "Matrix",
          type: "node",
        },
      ],
    },
  ],
  edges: [],
};

export const simpleAdapters = {
  settings: {
    showCenterMark: false,

    // edges
    showGhostlines: false,
  },
  nodes: [
  {
    id: "columns1",
    label: "Columns 1",
    type: "columns",
    groupType: "fixed",
    layout: {
      displayMode: "code",
    },
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
        interactionState: {
          expanded: true,
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

export const nested = {
  settings: {
    showCenterMark: false,

    // edges
    showGhostlines: false,
  },
  nodes: [
  {
    id: "columns",
    label: "Columns Parent",
    type: "columns",
    groupType: "fixed",
    layout: {
      displayMode: "code",
    },
    children: [
      {
        id: "columns1",
        label: "Columns 1",
        type: "columns",
        groupType: "fixed",
        layout: {
          displayMode: "code",
        },
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
  },
],
edges: [],
};

export const lane = {
  settings: {
    showCenterMark: false,

    // edges
    showGhostlines: false,
  },
  nodes: [
  {
    id: "columns",
    label: "Columns",
    type: "columns",
    groupType: "fixed",
    layout: {
      displayMode: "code",
    },
    children: [
      {
        id: "lane1",
        label: "Lane 1",
        type: "lane",
        groupType: "fixed",
        layout: {
          displayMode: "code",
        },
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
  },
],
edges: [],
};

export const lanes = {
  settings: {
    showCenterMark: false,

    curved: true,

    // edges
    showGhostlines: false,
  },
  nodes: [
  {
    id: "columns",
    label: "Columns",
    type: "columns",
    groupType: "fixed",
    layout: {
      displayMode: "code",
    },
    children: [
      {
        id: "lane1",
        label: "Lane 1",
        type: "lane",
        groupType: "fixed",
        layout: {
          displayMode: "code",
        },
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
      {
        id: "lane2",
        label: "Lane 2",
        type: "lane",
        groupType: "fixed",
        layout: {
          displayMode: "code",
        },
        children: [
          {
            id: "fidor",
            label: "FIDOR",
            code: "FDR",
            type: "adapter",
            layout: {
              mode: "full",
            },
          },
          {
            id: "matrix",
            label: "Matrix",
            code: "MTX",
            type: "adapter",
            layout: {
              mode: "staging-archive",
            },
          },
          {
            id: "eximius",
            label: "Eximius",
            code: "EXI",
            type: "adapter",
            layout: {
              mode: "staging-transform",
            },
          },
        ],
      },
      {
        id: "lane3",
        label: "Lane 3",
        type: "lane",
        groupType: "fixed",
        layout: {
          displayMode: "code",
        },
        children: [
          {
            id: "stater",
            label: "Stater",
            code: "STS",
            type: "adapter",
            layout: {
              mode: "full",
              arrangement: 3,
            },
          },
          {
            id: "matrix",
            label: "Matrix",
            code: "MTX",
            type: "adapter",
            layout: {
              mode: "archive-only",
              arrangement: 3,
            },
          },
          {
            id: "eximius",
            label: "Eximius",
            code: "EXI",
            type: "adapter",
            layout: {
              mode: "staging-archive",
              arrangement: 3,
            },
          },
        ],
      },
    ],
  },
],
edges: [],
};

