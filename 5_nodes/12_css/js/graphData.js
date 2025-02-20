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
          type: "Node",
          state: "Ready",
        },
        {
          id: "matrix",
          label: "Updating",
          code: "MTX",
          type: "Node",
          state: "Updating",
        },
        {
          id: "eximius",
          label: "Updated",
          code: "EXM",
          type: "Node",
          state: "Updated",
        },
        {
          id: "skipped",
          label: "Skipped",
          code: "EXM",
          type: "Node",
          state: "Skipped",
        },

        {
          id: "error",
          label: "Error",
          code: "EXM",
          type: "Node",
          state: "Error",
        },
        {
          id: "warning",
          label: "Warning",
          code: "EXM",
          type: "Node",
          state: "Warning",
        },
      ],
    },
  ],
  edges: [],
};


export const dataModel = nodeLane;
