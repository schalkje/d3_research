export const demoData = {
  metadata: {
    name: "mart_all_orientations_lane",
    nodeType: "lane",
    features: ["Lane container", "Five mart nodes with different orientations"],
    description: "Lane with five mart nodes demonstrating all supported orientations",
    testStatus: "Ready for Testing",
    version: "1.0.0"
  },
  settings: {
    showGhostlines: true,
    showGroupTitles: true,
    demoMode: true,
    enableTesting: true
  },
  nodes: [
    {
      id: "lane-mart-orientations",
      label: "Mart Orientations",
      type: "lane",
      layout: {
        minimumSize: { width: 600, height: 400 }
      },
      children: [
        {
          id: "mart-o-h",
          label: "Mart H",
          type: "mart",
          layout: { mode: "auto", displayMode: "full", orientation: "horizontal" },
          children: []
        },
        {
          id: "mart-o-hl",
          label: "Mart H-Line",
          type: "mart",
          layout: { mode: "auto", displayMode: "full", orientation: "horizontal_line" },
          children: []
        },
        {
          id: "mart-o-v",
          label: "Mart V",
          type: "mart",
          layout: { mode: "auto", displayMode: "full", orientation: "vertical" },
          children: []
        },
        {
          id: "mart-o-r90",
          label: "Mart R90",
          type: "mart",
          layout: { mode: "auto", displayMode: "full", orientation: "rotate90" },
          children: []
        },
        {
          id: "mart-o-r270",
          label: "Mart R270",
          type: "mart",
          layout: { mode: "auto", displayMode: "full", orientation: "rotate270" },
          children: []
        }
      ]
    }
  ],
  edges: []
};
