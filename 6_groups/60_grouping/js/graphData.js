export const simple = {
  settings: {
    showCenterMark: false,

    // edges
    showGhostlines: false,
  },
  nodes: [
    {
      id: "root",
      label: "Root Node",
      type: "group",
      groupType: "dynamic",
      children: [
        {
          id: "node_1",
          label: "Node 1",
          type: "Node",
          parentId: "root",
          children: [],
        },
        {
          id: "node_2",
          label: "Node 2",
          type: "Node",
          parentId: "root",
          children: [],
        },
        {
          id: "node_3",
          label: "Node 3",
          type: "Node",
          parentId: "root",
          children: [],
        },
      ],
    },
  ],
  edges: [],
};


const nested = [
  {
    id: "root",
    label: "Root Node",
    type: "group",
    groupType: "dynamic",
    children: [
      {
        id: "root2",
        label: "Root 2 Node",
        type: "group",
        groupType: "dynamic",
        parentId: "root",
        children: [
          {
            id: "node_1",
            label: "Group Node 1",
            type: "group",
            groupType: "fixed",
            parentId: "root2",
            children: [
              {
                id: "node_1_1",
                label: "Node 1.1",
                type: "Node",
                parentId: "node_1",
                children: [],
              },
              {
                id: "node_1_2",
                label: "Node 1.2",
                type: "Node",
                groupType: "dynamic",
                parentId: "node_1",
                children: [],
              },
            ],
          },
          {
            id: "node_2",
            label: "Group Node 2",
            type: "group",
            groupType: "pinned",
            parentId: "root2",
            children: [
              {
                id: "node_2_1",
                label: "Node 2.1",
                type: "Node",
                parentId: "node_2",
                children: [],
              },
            ],
          },
          {
            id: "node_3",
            label: "Node 3",
            type: "Node",
            parentId: "root2",
            children: [],
          },
        ],
      },
    ],
  },
];

