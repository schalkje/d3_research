// Data model for Network Graph Node Nesting

export const testDataModel = [
    {
      id: 'root',
      label: 'Root Node',
      type: 'group',
      groupType: 'dynamic',
      children: [
        {
          id: 'node_1',
          label: 'Group Node 1',
          type: 'group',
          groupType: 'fixed',
          parentId: 'root',
          children: [
            {
              id: 'node_1_1',
              label: 'Node 1.1',
              type: 'node',
              parentId: 'node_1',
              children: []
            },
            {
              id: 'node_1_2',
              label: 'Group Node 1.2',
              type: 'group',
              groupType: 'dynamic',
              parentId: 'node_1',
              children: [
                {
                  id: 'node_1_2_1',
                  label: 'Node 1.2.1',
                  type: 'node',
                  parentId: 'node_1_2',
                  children: []
                }
              ]
            }
          ]
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
            }
          ]
        },
        {
          id: 'node_3',
          label: 'Node 3',
          type: 'node',
          parentId: 'root',
          children: []
        }
      ]
    }
  ];
  
  export const testDataModelMetadata = {
    nodes: {
      root: { interactionState: { expanded: true }, groupType: 'dynamic' },
      node_1: { interactionState: { expanded: true }, groupType: 'fixed' },
      node_1_1: { interactionState: { expanded: false } },
      node_1_2: { interactionState: { expanded: true }, groupType: 'dynamic' },
      node_1_2_1: { interactionState: { expanded: false } },
      node_2: { interactionState: { expanded: true }, groupType: 'pinned' },
      node_2_1: { interactionState: { expanded: false } },
      node_3: { interactionState: { expanded: false } }
    }
  };