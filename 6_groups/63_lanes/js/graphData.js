//////////////////////////////////////////////////////////////
//
// Setup data
//

export const testDataModel1 = [
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
        type: "node",
      },
      {
        id: "matrix",
        label: "Matrix",
        type: "node",
      },
    ],
  },
];

export const testDataModel21 = [
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
          expanded: false,
        },
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
        layout: {
          mode: "full",
          arrangement: 2,
        },
        groupType: "fixed",
        interactionState: {
          expanded: true,
        },
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
        layout: {
          mode: "full",
          arrangement: 3,
        },
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
];

export const testDataModel22 = [
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
];

export const testDataModel31 = [
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
];

export const testDataModel32 = [
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
            interactionState: {
              expanded: false,
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
              expanded: false,
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
            interactionState: {
              expanded: false,
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
            interactionState: {
              expanded: false,
            },

          },
          {
            id: "matrix",
            label: "Matrix",
            code: "MTX",
            type: "adapter",
            layout: {
              mode: "full",
            },
            interactionState: {
              expanded: false,
            },

          },
          {
            id: "eximius",
            label: "Eximius",
            code: "EXI",
            type: "adapter",
            layout: {
              mode: "full",
            },
            interactionState: {
              expanded: false,
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
            interactionState: {
              expanded: false,
            },

          },
          {
            id: "matrix",
            label: "Matrix",
            code: "MTX",
            type: "adapter",
            layout: {
              mode: "full",
              arrangement: 3,
            },
            interactionState: {
              expanded: false,
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
            interactionState: {
              expanded: false,
            },

          },
        ],
      },
    ],
  },
];

export const dataModel = testDataModel32;