export const demoData = {
  metadata: {
    name: "foundation_all_orientations_lane",
    nodeType: "lane",
    features: ["Lane container", "Five foundation nodes with different orientations"],
    description: "Lane with five foundation nodes demonstrating all supported orientations",
    testStatus: "Ready for Testing",
    version: "1.0.0"
  },
  settings: {
    showGhostlines: false,
    showGroupTitles: true,
    demoMode: true,
    enableTesting: true
  },
  nodes: [
    {
      id: "lane-foundation-orientations",
      label: "Foundation Orientations",
      type: "lane",
      layout: {
        minimumSize: { width: 600, height: 400 }
      },
      children: [
        {
          id: "foundation-o-h",
          label: "Foundation H",
          type: "foundation",
          layout: { mode: "auto", displayMode: "full", orientation: "horizontal" },
          children: []
        },
        {
          id: "foundation-o-hl",
          label: "Foundation H-Line",
          type: "foundation",
          layout: { mode: "auto", displayMode: "full", orientation: "horizontal_line" },
          children: []
        },
        {
          id: "foundation-o-v",
          label: "Foundation V",
          type: "foundation",
          layout: { mode: "auto", displayMode: "full", orientation: "vertical" },
          children: []
        },
        {
          id: "foundation-o-r90",
          label: "Foundation R90",
          type: "foundation",
          layout: { mode: "auto", displayMode: "full", orientation: "rotate90" },
          children: []
        },
        {
          id: "foundation-o-r270",
          label: "Foundation R270",
          type: "foundation",
          layout: { mode: "auto", displayMode: "full", orientation: "rotate270" },
          children: []
        }
      ]
    }
  ],
  edges: []
};


