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
  ],
};

export const dataModel = testDashboard1;
