// Data model for Network Graph Node Nesting

export const testDataModel1 = [
  {
    id: "root",
    label: "Root Node",
    type: "group",
    groupType: "dynamic",
    children: [
      {
        id: "node_1",
        label: "Node 1",
        type: "node",
        parentId: "root",
        children: [],
      },
      {
        id: "node_2",
        label: "Node 2",
        type: "node",
        parentId: "root",
        children: [],
      },
      {
        id: "node_3",
        label: "Node 3",
        type: "node",
        parentId: "root",
        children: [],
      },
    ],
  },
];
const testDataModel2 = [
  {
    id: "root",
    label: "Root Node",
    type: "group",
    groupType: "dynamic",
    children: [
      {
        id: "node_1",
        label: "Group Node 1",
        type: "group",
        groupType: "fixed",
        parentId: "root",
        children: [
          {
            id: "node_1_1",
            label: "Node 1.1",
            type: "node",
            parentId: "node_1",
            children: [],
          },
          {
            id: "node_1_2",
            label: "Node 1.2",
            type: "node",
            parentId: "node_1",
            children: [],
          },
        ],
      },
      // {
      //   id: 'node_2',
      //   label: 'Group Node 2',
      //   type: 'group',
      //   groupType: 'pinned',
      //   parentId: 'root',
      //   children: [
      //     {
      //       id: 'node_2_1',
      //       label: 'Node 2.1',
      //       type: 'node',
      //       parentId: 'node_2',
      //       children: []
      //     }
      //   ]
      // }
    ],
  },
];

const testDataModel21 = [
  {
    id: "root",
    label: "Root Node",
    type: "group",
    groupType: "dynamic",
    children: [
      {
        id: "node_1",
        label: "Group Node 1",
        type: "group",
        groupType: "fixed",
        parentId: "root",
        children: [
          {
            id: "node_1_1",
            label: "Node 1.1",
            type: "node",
            parentId: "node_1",
            children: [],
          },
          {
            id: "node_1_2",
            label: "Node 1.2",
            type: "node",
            parentId: "node_1",
            children: [],
          },
        ],
      },
      {
        id: 'node_2',
        label: 'Group Node 2',
        type: 'group',
        groupType: 'pinned',
        parentId: 'root',
        children: [
          {
            id: 'node_2_1',
            label: 'Node 2.1',
            type: 'node',
            parentId: 'node_2',
            children: []
          },
          {
            id: 'node_2_2',
            label: 'Node 2.2',
            type: 'node',
            parentId: 'node_2',
            children: []
          }
        ]
      }
    ],
  },
];
const testDataModel3 = [
  {
    id: "root",
    label: "Root Node",
    type: "group",
    groupType: "dynamic",
    children: [
      {
        id: "node_1",
        label: "Group Node 1",
        type: "group",
        groupType: "fixed",
        parentId: "root",
        children: [
          {
            id: "node_1_1",
            label: "Node 1.1",
            type: "node",
            parentId: "node_1",
            children: [],
          },
          {
            id: "node_1_2",
            label: "Group Node 1.2",
            type: "group",
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
        parentId: "root",
        children: [
          {
            id: "node_2_1",
            label: "Node 2.1",
            type: "node",
            parentId: "node_2",
            children: [],
          },
        ],
      },
      {
        id: "node_3",
        label: "Node 3",
        type: "node",
        parentId: "root",
        children: [],
      },
    ],
  },
];

const testDataModel4 = [
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
                type: "node",
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
                type: "node",
                parentId: "node_2",
                children: [],
              },
            ],
          },
          {
            id: "node_3",
            label: "Node 3",
            type: "node",
            parentId: "root2",
            children: [],
          },
        ],
      },
    ],
  },
];

export const testDataModel = testDataModel4;
