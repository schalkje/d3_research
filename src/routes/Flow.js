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
import { getNetworkBlockLayers, getNetworkBlocks, getNetworkBlockLinks } from "../data/data_product_lineage";
import { getLineageGraphs } from "../data/lineage_graphs";
import OverviewFlow from '../features/flow/OverviewFlow'

//////////////////////////////////////////////////////////////
//
// Setup data
//

var nodes
console.log('Flow.js - nodes: ')
console.log(nodes)


var layers = getNetworkBlockLayers('credit')
nodes = getNetworkBlocks('credit')
var links = getNetworkBlockLinks('credit')

console.log('Flow.js - nodes: ' + nodes.length)
console.log(nodes)

console.log('Flow.js - links: ' + links.length)
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

console.log('Flow.js - nodes: ' + nodes.length)
console.log(nodes)

export default function Flow() {
  let params = useParams();
  // get product from data set
  const filteredGraph = getLineageGraphs().filter((graph) => graph.key === params.graphId)
  const graph = filteredGraph[0]
  console.log(graph)
  const rating = 4

  return (
    <main style={{ padding: "1rem 0" }}>
      <h2>React flow</h2>
      <Card sx={{ minWidth: 275 }} variant="outlined">
        <CardContent>
          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
            react-flow - {graph.type}: {params.graphId}
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
          <Button size="small" onClick={() => window.open(graph.documentation_link)}>Learn More</Button>
        </CardActions>
      </Card>

      <div id="div_container" className="container">
        {params.graphId == 'OverviewFlow' ?
          <OverviewFlow />
          : params.graphId == 'HelloFlow' ?
            <OverviewFlow layers={layers} nodes={nodes} links={links} />
            : <OverviewFlow />
        }
      </div>

    </main>
  );
}