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
          type: "Node",
        },
        {
          id: "matrix",
          label: "Matrix",
          type: "Node",
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
      type: "Lane",
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
          type: "Node",
          layout: {
            mode: "full",
            arrangement: 1,
          },
        },
        {
          id: "ods",
          label: "ODS",
          code: "ODS",
          type: "Node",
        },
        {
          id: "dwh",
          label: "DWH",
          code: "DWH",
          type: "Node",
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
          type: "Node",
        },
        {
          id: "dwh",
          label: "DWH",
          code: "DWH",
          type: "Node",
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

export const columnsWithLane1 = {
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
              type: "Node",
              layout: {
                mode: "full",
                arrangement: 1,
              },
            },
            {
              id: "trn_matrix",
              label: "Matrix Transform",
              code: "MTX",
              type: "Node",
              layout: {
                mode: "full",
                arrangement: 2,
              },
            },
            {
              id: "trn_eximius",
              label: "EximiusTransform",
              code: "EXI",
              type: "Node",
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
          type: "Node",
        },
        {
          id: "dwh",
          label: "DWH",
          code: "DWH",
          type: "Node",
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
              type: "Node",
              layout: {
                mode: "full",
                arrangement: 1,
              },
            },
            {
              id: "trn_matrix",
              label: "Matrix Transform",
              code: "MTX",
              type: "Node",
              layout: {
                mode: "full",
                arrangement: 2,
              },
            },
            {
              id: "trn_eximius",
              label: "EximiusTransform",
              code: "EXI",
              type: "Node",
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
          type: "Node",
        },
        {
          id: "dwhs",
          label: "DWH's",
          type: "lane",
          groupType: "dynamic",
          children: [
            {
              id: "dwh1",
              label: "DWH 1",
              code: "DWH",
              type: "Node",
            },
            {
              id: "dwh2",
              label: "DWH 2",
              code: "DWH",
              type: "Node",
            },
            {
              id: "dwh3",
              label: "DWH 3",
              code: "DWH",
              type: "Node",
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
      target: "dwh1",
    },
    {
      isActive: true,
      source: "ods",
      type: "SSIS",
      state: "Ready",
      target: "dwh2",
    },
    {
      isActive: true,
      source: "ods",
      type: "SSIS",
      state: "Ready",
      target: "dwh3",
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
              "children": [
                {
                  "id": "127",
                  "label": "transform",
                  "description": "Node for dataset LOAD ",
                  "type": "Node",
                  "datasetId": 492,
                  "category": "transform",
                  "layout": null,
                  "children": [],
                  "state": "Unknown"
                }
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
              "children": [
                {
                  "id": "125",
                  "label": "transform",
                  "description": "Node for dataset LOAD ",
                  "type": "Node",
                  "datasetId": 492,
                  "category": "transform",
                  "layout": null,
                  "children": [],
                  "state": "Updated"
                }
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
              "children": [
                {
                  "id": "126",
                  "label": "transform",
                  "description": "Node for dataset LOAD ",
                  "type": "Node",
                  "datasetId": 492,
                  "category": "transform",
                  "layout": null,
                  "children": [],
                  "state": "Ready"
                }
              ],
            },
          ],
        },
        {
          id: "ods",
          label: "ODS",
          code: "ODS",
          type: "Node",
        },
        {
          id: "dwhs",
          label: "DWH's",
          type: "lane",
          groupType: "dynamic",
          children: [
            {
              id: "dwh1",
              label: "DWH 1",
              code: "DWH",
              type: "foundation",
            },
            {
              id: "dwh2",
              label: "DWH 2",
              code: "DWH",
              type: "foundation",
            },
            {
              id: "dwh3",
              label: "DWH 3",
              code: "DWH",
              type: "foundation",
            },
          ],
        },
        {
          id: "streets",
          label: "Streets",
          type: "lane",
          groupType: "dynamic",
          children: [
            {
              id: "street1",
              label: "Street 1",
              code: "DWH",
              type: "foundation",
            },
            {
              id: "street2",
              label: "Street 2",
              code: "DWH",
              type: "foundation",
            },
          ],
        },
      ],
    },
  ],
  edges: [    
    {
      isActive: true,
      source: "125",
      type: "SSIS",
      state: "Ready",
      target: "ods",
    },
    {
      isActive: true,
      source: "126",
      type: "SSIS",
      state: "Ready",
      target: "ods",
    },
    {
      isActive: true,
      source: "127",
      type: "SSIS",
      state: "Ready",
      target: "ods",
    },
    {
      isActive: true,
      source: "ods",
      type: "SSIS",
      state: "Ready",
      target: "raw_dwh1",
    },
    {
      isActive: true,
      source: "ods",
      type: "SSIS",
      state: "Ready",
      target: "raw_dwh2",
    },
    {
      isActive: true,
      source: "ods",
      type: "SSIS",
      state: "Ready",
      target: "raw_dwh3",
    },
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
    {
      isActive: true,
      source: "base_dwh1",
      type: "SSIS",
      state: "Ready",
      target: "raw_street1",
    },
    {
      isActive: true,
      source: "base_dwh2",
      type: "SSIS",
      state: "Ready",
      target: "raw_street1",
    },
    {
      isActive: true,
      source: "base_dwh1",
      type: "SSIS",
      state: "Ready",
      target: "raw_street2",
    },
    {
      isActive: true,
      source: "base_dwh2",
      type: "SSIS",
      state: "Ready",
      target: "raw_street2",
    },
    {
      isActive: true,
      source: "base_dwh3",
      type: "SSIS",
      state: "Ready",
      target: "raw_street2",
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
          type: "Node",
        },
        {
          id: "dwh",
          label: "DWH",
          code: "DWH",
          type: "Node",
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
