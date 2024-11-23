//////////////////////////////////////////////////////////////
//
// Setup data
//

export const testDashboard1 = {
  settings: {
    showCenterMark: false,
    showGhostlines: false,

    // ideas
    showGrid: true,
    showGroupLabels: true,
    showGroupTitles: true,
  },
  nodes: [
    {
      id: "group",
      label: "Group",
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
  edges: [
    {
      isActive: true,
      source: "bankview",
      type: "SSIS",
      state: "Ready",
      target: "matrix",
    },
  ],
};

export const testDashboard2 = {
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
      id: "group",
      label: "Group",
      type: "lane",
      groupType: "fixed",
      layout: {
        displayMode: "code",
      },
      children: [
        {
          id: "bankview",
          label: "Bankview",
          type: "adapter",
        },
        {
          id: "matrix",
          label: "Matrix",
          type: "foundation",
        },
      ],
    },
  ],
  edges: [
    {
      isActive: true,
      source: "bankview",
      type: "SSIS",
      state: "Ready",
      target: "matrix",
    },
  ],
};

export const edgeDemo = {
  settings: {
    // nodes
    showCenterMark: false,
    showConnectionPoints: true,

    // edges
    showGhostlines: false,

    // ideas
    showGrid: true,
    showGroupLabels: true,
    showGroupTitles: true,
  },
  nodes: [
    {
      id: "group",
      label: "Edge Demo",
      type: "lane",
      groupType: "fixed",
      layout: {
        displayMode: "code",
      },
      children: [
        {
          id: "edge-demo",
          label: "Grid",
          type: "edge-demo",
          layout: "grid",
        },
        {
          id: "edge-demo",
          label: "Shift horizontal",
          type: "edge-demo",
          layout: "h-shifted",
        },
        {
          id: "edge-demo",
          label: "Shift vertical",
          type: "edge-demo",
          layout: "v-shifted",
        },
        {
          id: "edge-demo",
          label: "Shift 2 vertical",
          type: "edge-demo",
          layout: "v-shifted2",
        },
        {
          id: "edge-demo",
          label: "Stair up",
          type: "edge-demo",
          layout: "stair-up",
        },
        {
          id: "edge-demo",
          label: "Stair down",
          type: "edge-demo",
          layout: "stair-down",
        },
      ],
    },
  ],
  edges: [],
};

export const curvedEdgeDemo = {
  settings: {
    // nodes
    showCenterMark: false,
    showConnectionPoints: true,

    // edges
    showGhostlines: false,
    curved: true,
    // curveMargin: 0.1, // offset for the edge point computation

    // ideas
    showGrid: true,
    showGroupLabels: true,
    showGroupTitles: true,
  },
  nodes: [
    {
      id: "group",
      label: "Edge Demo",
      type: "lane",
      groupType: "fixed",
      layout: {
        displayMode: "code",
      },
      children: [
        {
          id: "edge-demo",
          label: "Grid",
          type: "edge-demo",
          layout: "grid",
        },
        {
          id: "edge-demo",
          label: "Shift horizontal",
          type: "edge-demo",
          layout: "h-shifted",
        },
        {
          id: "edge-demo",
          label: "Shift vertical",
          type: "edge-demo",
          layout: "v-shifted",
        },
        {
          id: "edge-demo",
          label: "Shift 2 vertical",
          type: "edge-demo",
          layout: "v-shifted2",
        },
        {
          id: "edge-demo",
          label: "Stair up",
          type: "edge-demo",
          layout: "stair-up",
        },
        {
          id: "edge-demo",
          label: "Stair down",
          type: "edge-demo",
          layout: "stair-down",
          nodeSpacing: { horizontal: 30, vertical: 20 },
        },
      ],
    },
  ],
  edges: [],
};

export const columnEdgeDemo = {
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
      label: "Root",
      type: "columns",
      groupType: "dynamic",
      children: [
        {
          id: "trn_bankview",
          label: "Bankview",
          code: "BNV",
          type: "node",
          layout: {
            mode: "full",
            arrangement: 1,
          },
        },
        {
          id: "ods",
          label: "ODS",
          code: "ODS",
          type: "node",
        },
        {
          id: "dwh",
          label: "DWH",
          code: "DWH",
          type: "node",
        },
      ],
    },
  ],
  edges: [
    {
      isActive: true,
      source: "ods",
      type: "SSIS",
      state: "Ready",
      target: "dwh",
    },
    {
      isActive: true,
      source: "trn_bankview",
      type: "SSIS",
      state: "Ready",
      target: "ods",
    },
  ],
};

export const adaptedColumnEdgeDemo = {
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
      label: "Root",
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
          id: "ods",
          label: "ODS",
          code: "ODS",
          type: "node",
        },
        {
          id: "dwh",
          label: "DWH",
          code: "DWH",
          type: "node",
        },
      ],
    },
  ],
  edges: [
    {
      isActive: true,
      source: "ods",
      type: "SSIS",
      state: "Ready",
      target: "dwh",
    },
    {
      isActive: true,
      source: "trn_bankview",
      type: "SSIS",
      state: "Ready",
      target: "ods",
    }
  ],
};

export const columnsWithLane = {
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
      label: "Root",
      type: "columns",
      groupType: "dynamic",
      children: [
        {
          id: "sources",
          label: "Sources",
          type: "lane",
          groupType: "dynamic",
          children: [
            {
              id: "trn_bankview",
              label: "Bankview Transform",
              code: "BNV",
              type: "node",
              layout: {
                mode: "full",
                arrangement: 1,
              },
            },
            {
              id: "trn_matrix",
              label: "Matrix Transform",
              code: "MTX",
              type: "node",
              layout: {
                mode: "full",
                arrangement: 2,
              },
            },
            {
              id: "trn_eximius",
              label: "EximiusTransform",
              code: "EXI",
              type: "node",
              layout: {
                mode: "full",
                arrangement: 3,
              },
            },
          ],
        },
        {
          id: "ods",
          label: "ODS",
          code: "ODS",
          type: "node",
        },
        {
          id: "dwh",
          label: "DWH",
          code: "DWH",
          type: "node",
        },
      ],
    },
  ],
  edges: [
    {
      isActive: true,
      source: "ods",
      type: "SSIS",
      state: "Ready",
      target: "dwh",
    },
    {
      isActive: true,
      source: "trn_bankview",
      type: "SSIS",
      state: "Ready",
      target: "ods",
    },
    {
      isActive: true,
      source: "trn_matrix",
      type: "SSIS",
      state: "Ready",
      target: "ods",
    },
    {
      isActive: true,
      source: "trn_eximius",
      type: "SSIS",
      state: "Ready",
      target: "ods",
    },
  ],
};

export const columnsWithLane2 = {
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
      label: "Root",
      type: "columns",
      groupType: "dynamic",
      children: [
        {
          id: "sources",
          label: "Sources",
          type: "lane",
          groupType: "dynamic",
          children: [
            {
              id: "trn_bankview",
              label: "Bankview Transform",
              code: "BNV",
              type: "node",
              layout: {
                mode: "full",
                arrangement: 1,
              },
            },
            {
              id: "trn_matrix",
              label: "Matrix Transform",
              code: "MTX",
              type: "node",
              layout: {
                mode: "full",
                arrangement: 2,
              },
            },
            {
              id: "trn_eximius",
              label: "EximiusTransform",
              code: "EXI",
              type: "node",
              layout: {
                mode: "full",
                arrangement: 3,
              },
            },
          ],
        },
        {
          id: "ods",
          label: "ODS",
          code: "ODS",
          type: "node",
        },
        {
          id: "dwhs",
          label: "DWH's",
          type: "lane",
          groupType: "dynamic",
          children: [
            {
              id: "dwh",
              label: "DWH",
              code: "DWH",
              type: "node",
            },
          ],
        },
      ],
    },
  ],
  edges: [
    {
      isActive: true,
      source: "ods",
      type: "SSIS",
      state: "Ready",
      target: "dwh",
    },
    {
      isActive: true,
      source: "trn_bankview",
      type: "SSIS",
      state: "Ready",
      target: "ods",
    },
    {
      isActive: true,
      source: "trn_matrix",
      type: "SSIS",
      state: "Ready",
      target: "ods",
    },
    {
      isActive: true,
      source: "trn_eximius",
      type: "SSIS",
      state: "Ready",
      target: "ods",
    },
  ],
};

export const adapterColumnsWithLane = {
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
      label: "Root",
      type: "columns",
      groupType: "dynamic",
      children: [
        {
          id: "sources",
          label: "Sources",
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
        {
          id: "ods",
          label: "ODS",
          code: "ODS",
          type: "node",
        },
        {
          id: "dwh",
          label: "DWH",
          code: "DWH",
          type: "node",
        },
      ],
    },
  ],
  edges: [
    {
      isActive: true,
      source: "ods",
      type: "SSIS",
      state: "Ready",
      target: "dwh",
    },
    {
      isActive: true,
      source: "trn_bankview",
      type: "SSIS",
      state: "Ready",
      target: "ods",
    },
    {
      isActive: true,
      source: "trn_matrix",
      type: "SSIS",
      state: "Ready",
      target: "ods",
    },
    {
      isActive: true,
      source: "trn_eximius",
      type: "SSIS",
      state: "Ready",
      target: "ods",
    },
  ],
};

export const groupEdgeDemo = {
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
      label: "Root",
      type: "group",
      groupType: "dynamic",
      children: [
        {
          id: "sources",
          label: "Sources",
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
        {
          id: "ods",
          label: "ODS",
          code: "ODS",
          type: "node",
        },
        {
          id: "dwh",
          label: "DWH",
          code: "DWH",
          type: "node",
        },
      ],
    },
  ],
  edges: [
    {
      isActive: true,
      source: "ods",
      type: "SSIS",
      state: "Ready",
      target: "dwh",
    },
    {
      isActive: true,
      source: "trn_bankview",
      type: "SSIS",
      state: "Ready",
      target: "ods",
    },
    {
      isActive: true,
      source: "trn_matrix",
      type: "SSIS",
      state: "Ready",
      target: "ods",
    },
    {
      isActive: true,
      source: "trn_eximius",
      type: "SSIS",
      state: "Ready",
      target: "ods",
    },
  ],
};
