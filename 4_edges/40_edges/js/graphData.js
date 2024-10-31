//////////////////////////////////////////////////////////////
//
// Setup data
//

export const testDashboard1 = {
  settings: {
    layout: {
      showCenterDot: true,
      showGhostLines: true,

      // ideas
      showGrid: true,
      showGroupLabels: true,
      showGroupTitles: true,
    },
  },
  nodes: [
    {
      id: "group",
      label: "Group",
      type: "group",
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
      "isActive": true,
      "source": "bankview",
      "type": "SSIS",
      "state": "Ready",
      "target": "matrix"
    },
  ]
};

