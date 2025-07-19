//////////////////////////////////////////////////////////////
//
// Setup data
//

export const rectNode = {
  settings: {
    showCenterMark: false,

    // edges
    showGhostlines: false,
    curved: false,

    // ideas
    showGrid: true,
    showGroupLabels: true,
    showGroupTitles: true,
  },
  nodes: [
    {
      id: "simple",
      label: "Rectangular Node",
      code: "S1",
      type: "Node",
    },
  ],
  edges: [],
};

export const nodeLane = {
  settings: {
    showCenterMark: false,

    // edges
    showGhostlines: false,
    curved: false,

    // ideas
    showGrid: true,
    showGroupLabels: true,
    showGroupTitles: true,
  },
  nodes: [
    {
      id: "root",
      label: "Lane",
      type: "lane",
      groupType: "dynamic",
      children: [
        {
          id: "simple",
          label: "simple",
          code: "S1",
          type: "Node",
        },
        {
          id: "longtext",
          label: "this is a long text, going beyong the default width",
          code: "S2",
          type: "Node",
        },
        {
          id: "very long",
          label: "this is a very text taht will be cut off, because it is longer than the max width",
          code: "S3",
          type: "Node",
        },
      ],
    },
  ],
  edges: [],
};
