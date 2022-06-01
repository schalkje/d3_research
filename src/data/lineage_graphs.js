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
    key: 'LayerNetworkGraphClass',
    label: 'Layer Network Graph Class',
    type: 'lineage',
    description: 'A class based component',
    documentation_link: 'https://cdm.thefirm.nl/'
  },
  {
    key: 'GraphLayout',
    label: 'Hello react flow',
    type: 'flow',
    description: '',
    documentation_link: 'https://cdm.thefirm.nl/'
  },
  {
    key: 'GraphLayout',
    label: 'Table views',
    type: 'database',
    description: '',
    documentation_link: 'https://cdm.thefirm.nl/'
  },
]
