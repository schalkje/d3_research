import { useParams } from "react-router-dom";

import { getNetworks } from "../data/data_products";
import parse from "html-react-parser";

// import Box from '@mui/material/Box';
import * as React from 'react';
import Box from '@mui/material/Box';
import Rating from '@mui/material/Rating';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import GraphLayout from "../features/graph/GraphLayout";
import NetworkGraph from "../features/graph/NetworkGraph";
import LayerNetworkGraph from "../features/graph/LayerNetworkGraph";
import LayerNetworkGraph2 from "../features/graph/LayerNetworkGraph2";
import LayerNetworkGraphClass from "../features/graph/LayerNetworkGraphClass";
import { getNetworkBlockLayers, getNetworkBlocks, getNetworkBlockLinks } from "../data/data_product_lineage";
import { getLineageGraphs } from "../data/lineage_graphs";

//////////////////////////////////////////////////////////////
//
// Setup data
//

var nodes
console.log('Network.js - nodes: ')
console.log(nodes)


var layers = getNetworkBlockLayers('credit')
nodes = getNetworkBlocks('credit')
var links = getNetworkBlockLinks('credit')

console.log('Network.js - nodes: ' + nodes.length)
console.log(nodes)

console.log('Network.js - links: ' + links.length)
console.log(links)

nodes.forEach(node => {
  var dependsOn = []

  links.forEach(link => {
    if (node.id == link.target) {
      dependsOn.push(link.source)
    }
  })

  node.dependsOn = dependsOn
})

console.log('Network.js - nodes: ' + nodes.length)
console.log(nodes)

export default function Network() {
  let params = useParams();
  // get product from data set
  const filteredGraph = getLineageGraphs().filter((network) => network.key === params.networkId)
  const graph = filteredGraph[0]
  console.log(graph)
  const rating = 4

  return (
    <main style={{ padding: "1rem 0" }}>
     <h2>Lineage</h2>
      {params.networkId == 'GraphLayout'?
        <GraphLayout layers={layers} nodes={nodes} links={links} /> 
        : params.networkId == 'NetworkGraph' ?
        <NetworkGraph layers={layers} nodes={nodes} links={links} /> 
        : params.networkId == 'LayerNetworkGraph' ?
        <LayerNetworkGraph layers={layers} nodes={nodes} links={links} /> 
        : params.networkId == 'LayerNetworkGraph2' ?
        <LayerNetworkGraph2 layers={layers} nodes={nodes} links={links} /> 
        : params.networkId == 'LayerNetworkGraphClass' ?
        <LayerNetworkGraphClass layers={layers} nodes={nodes} links={links} /> 
          : <LayerNetworkGraph nodes={nodes} links={links} /> }
 
      <Card sx={{ minWidth: 275 }} variant="outlined">
        <CardContent>
          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
            data product - {graph.type}: {params.networkId}
          </Typography>
          <Typography variant="h5" component="div">
            {graph.label}
          </Typography>
          <Typography sx={{ mb: 1.5 }} color="text.secondary">

            <Rating
              name="simple-controlled"
              value={rating}
              onChange={(event, newValue) => {
                // setValue(newValue);
              }}
            />
          </Typography>
          <Typography variant="body2" display="block">
            {parse(graph.description)}
          </Typography>
        </CardContent>
        <CardActions>
          <Button size="small">Learn More</Button>
        </CardActions>
      </Card>

    </main>
  );
}