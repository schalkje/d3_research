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
  "edges": [
    {
      isActive: true,
      source: "bankview",
      type: "SSIS",
      state: "Ready",
      target: "matrix"
    },
  ]
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
  "edges": [
    {
      isActive: true,
      source: "bankview",
      type: "SSIS",
      state: "Ready",
      target: "matrix"
    },
  ]
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
  "edges": [
  ]
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
  "edges": [
  ]
};
