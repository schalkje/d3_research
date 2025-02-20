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
        type: "Node",
      },
      {
        id: "matrix",
        label: "Matrix",
        type: "Node",
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
            role: "staging",
            type: "Node",
          },
          {
            id: "arc_bankview",
            label: "Archive Bankview",
            role: "archive",
            type: "Node",
          },
          {
            id: "trn_bankview",
            label: "Transform Bankview",
            role: "transform",
            type: "Node",
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
            role: "staging",
            type: "Node",
          },
          {
            id: "arc_matrix",
            label: "Archive Matrix",
            role: "archive",
            type: "Node",
          },
          {
            id: "trn_matrix",
            label: "Transform Matrix",
            role: "transform",
            type: "Node",
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
            role: "staging",
            type: "Node",
          },
          {
            id: "arc_eximius",
            label: "Archive Eximius",
            role: "archive",
            type: "Node",
          },
          {
            id: "trn_eximius",
            label: "Transform Eximius",
            role: "transform",
            type: "Node",
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
