//////////////////////////////////////////////////////////////
//
// Setup data
//

export const nodeLane = {
  settings: {
    showCenterMark: false,

    // edges
    showGhostlines: false,

    // ideas
    showGrid: true,
    showGroupLabels: true,
    showGroupTitles: true,
    cascadeOnStatusChange: false,
    toggleCollapseOnStatusChange: false,
  },
  nodes: [
    {
      id: "lane1",
      label: "Node status demo",
      type: "lane",
      groupType: "dynamic",
      layout: {
        displayMode: "code",
        numberOfLanes: 1,
      },
      children: [
        {
          id: "bankview",
          label: "Ready",
          code: "BNV",
          type: "node",
          state: "Ready",
        },
        {
          id: "matrix",
          label: "Updating",
          code: "MTX",
          type: "node",
          state: "Updating",
        },
        {
          id: "eximius",
          label: "Updated",
          code: "EXM",
          type: "node",
          state: "Updated",
        },
        {
          id: "skipped",
          label: "Skipped",
          code: "EXM",
          type: "node",
          state: "Skipped",
        },

        {
          id: "error",
          label: "Error",
          code: "EXM",
          type: "node",
          state: "Error",
        },
        {
          id: "warning",
          label: "Warning",
          code: "EXM",
          type: "node",
          state: "Warning",
        },
      ],
    },
  ],
  edges: [],
};


export const dataModel = nodeLane;
