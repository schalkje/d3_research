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
    key: 'DivNetworkGraph',
    label: '<div> node graph',
    type: 'lineage',
    description: 'Get a network graph up and running with divs as the nodes. Div\'s are more flexible compared to rect\'s to create complicated text based views.',
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
]
