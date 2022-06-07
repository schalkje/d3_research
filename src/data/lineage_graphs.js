export function getLineageGraphsByType(type) {
  return getLineageGraphs().filter((graph) => graph.type === type);
}


export const getLineageGraphs = () => [
  {
    key: 'GraphLayout',
    label: 'Graph Layout',
    type: 'network',
    description: '',
    documentation_link: 'https://cdm.thefirm.nl/'
  },
  {
    key: 'NetworkGraph',
    label: 'Network Graph',
    type: 'lineage',
    description: 'Network graph',
    documentation_link: 'https://cdm.thefirm.nl/'
  },
  {
    key: 'LayerNetworkGraph',
    label: 'Layer Network Graph',
    type: 'lineage',
    description: '',
    documentation_link: 'https://cdm.thefirm.nl/'
  },
  {
    key: 'LayerNetworkGraph2',
    label: 'Layer Network Graph 2',
    type: 'lineage',
    description: '',
    documentation_link: 'https://cdm.thefirm.nl/'
  },
  {
    key: 'ObjectNetworkGraph',
    label: 'Object node graph',
    type: 'lineage',
    description: 'Get a network graph up and running with a svg based complex object as the nodes.',
    documentation_link: 'https://cdm.thefirm.nl/'
  },
  {
    key: 'LayerNetworkGraphClass',
    label: 'Layer Network Graph Class',
    type: 'lineage',
    description: 'A class based component',
    documentation_link: 'https://cdm.thefirm.nl/'
  },
  {
    key: 'OverviewFlow',
    label: 'Overview react flow',
    type: 'flow',
    description: 'This is the overview example from the default examples. Added to see the base functionality and check if the setup is working.',
    documentation_link: 'https://reactflow.dev/docs/examples/overview/'
  },
  {
    key: 'GraphLayout',
    label: 'Hello react flow',
    type: 'flow',
    description: '',
    documentation_link: 'https://cdm.thefirm.nl/'
  },
  {
    key: 'Tables',
    label: 'Table views',
    type: 'database',
    description: '',
    documentation_link: 'https://cdm.thefirm.nl/'
  },
  {
    key: 'TableComponent',
    label: 'Table component',
    type: 'database',
    description: 'A clickable table component, that changes it\'s size and display details on a mouse click.',
    documentation_link: 'https://cdm.thefirm.nl/'
  },
]
