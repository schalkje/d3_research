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
      id: "lane1",
      label: "Lane 1",
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

export const threeAdapters = {
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
      label: "Lane 1",
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
          type: "adapter",
          layout: {
            mode: "full",
            arrangement: 1,
          },
          groupType: "fixed",
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
          children: [
            {
              id: "stg_matrix",
              label: "Staging Matrix",
              role: "staging",
              type: "node",
            },
            {
              id: "arc_matrix",
              label: "Archive Matrix",
              role: "archive",
              type: "node",
            },
            {
              id: "trn_matrix",
              label: "Transform Matrix",
              role: "transform",
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
              role: "staging",
              type: "node",
            },
            {
              id: "arc_eximius",
              label: "Archive Eximius",
              role: "archive",
              type: "node",
            },
            {
              id: "trn_eximius",
              label: "Transform Eximius",
              role: "transform",
              type: "node",
            },
          ],
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

    // ideas
    showGrid: true,
    showGroupLabels: true,
    showGroupTitles: true,
  },
  nodes: [
    {
      id: "lane0",
      label: "Parent lane",
      type: "lane",
      groupType: "dynamic",
      layout: {
        displayMode: "code",
        numberOfLanes: 1,
      },
      children: [
        {
          id: "lane1",
          label: "Lane 1",
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
              type: "adapter",
              layout: {
                mode: "full",
                arrangement: 1,
              },
              groupType: "fixed",
              children: [
                {
                  id: "stg_bankview",
                  label: "Staging Bankview",
                  role: "staging",
                  type: "node",
                },
                {
                  id: "arc_bankview",
                  label: "Archive Bankview",
                  role: "archive",
                  type: "node",
                },
                {
                  id: "trn_bankview",
                  label: "Transform Bankview",
                  role: "transform",
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
              children: [
                {
                  id: "stg_matrix",
                  label: "Staging Matrix",
                  role: "staging",
                  type: "node",
                },
                {
                  id: "arc_matrix",
                  label: "Archive Matrix",
                  role: "archive",
                  type: "node",
                },
                {
                  id: "trn_matrix",
                  label: "Transform Matrix",
                  role: "transform",
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
                  role: "staging",
                  type: "node",
                },
                {
                  id: "arc_eximius",
                  label: "Archive Eximius",
                  role: "archive",
                  type: "node",
                },
                {
                  id: "trn_eximius",
                  label: "Transform Eximius",
                  role: "transform",
                  type: "node",
                },
              ],
            },
          ],
        },
      ],
    },
  ],
  edges: [],
};

export const testDataModel24 = {
  settings: {
    showCenterMark: false,

    // edges
    showGhostlines: false,
  },
  nodes: [
    {
      id: "root",
      label: "Group",
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
          id: "group",
          label: "Empty Lane",
          code: "EG",
          type: "lane",
          groupType: "fixed",
          children: [],
        },
        {
          id: "nestedlane",
          label: "Nested Lane",
          type: "lane",
          groupType: "dynamic",
          children: [
            {
              id: "ebankview",
              label: "eBankview",
              code: "EBV",
              type: "adapter",
              layout: {
                arrangement: 1,
              },
            },
            {
              id: "bgs",
              label: "BGS",
              code: "BGS",
              type: "adapter",
              layout: {

                arrangement: 2,
              },
            },
            {
              id: "fidor",
              label: "Fidor",
              code: "FDR",
              type: "adapter",
              layout: {
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
