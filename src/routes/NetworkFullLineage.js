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
import GraphLayoutDemo from "../features/graph/GraphLayoutDemo";
import { getNetworkEntities, getNetworkRelations } from "../data/data_product_lineage";

//////////////////////////////////////////////////////////////
//
// Setup data
//

var relations = getNetworkRelations('dummy')

var nodes = []
getNetworkEntities('dummy').forEach(entity => {
  nodes.push({id: entity.key, name: entity.name, dependsOn: []})

})
console.log('default nodes' + nodes.length)
console.log(nodes)

// add missing source nodes



console.log('default relations' + relations.length)
console.log(relations)

var unique_links = []
relations.forEach(node => {
  var containsNode = false
  unique_links.forEach(n => {
    if (n.source == node.source) {
      containsNode = true;
    }
  })

  if (!containsNode) {
    unique_links.push(node)
  }
})


console.log('unique_links: ' + unique_links.length)
console.log(unique_links)

var missingNodes = []
unique_links.forEach(link => {
  var containsNode = false
  nodes.forEach(n => {
    if (n.id === link.source) {
      containsNode = true;
    }
  })
  if (!containsNode) {
      missingNodes.push(link)
  }
})

console.log('missingNodes: ' + missingNodes.length)
console.log(missingNodes)


missingNodes.forEach(link => {
  nodes.push({id: link.source, name: 'e_'+link.source, dependsOn: []})
})


console.log('extra nodes: ' + nodes.length)
console.log(nodes)

const links = [];
getNetworkRelations('dummy').forEach(link => {
  links.push({source: link.source, target: link.target})
})

console.log('links')
console.log(links)

nodes.forEach(node => {
  var dependsOn = []

  relations.forEach(link => {
    if (node.id == link.target) {
      dependsOn.push(link.source)
    }
  })

  node.dependsOn = dependsOn
})

console.log('nodes: ' + nodes.length)
console.log(nodes)




export default function Networks() {
  let params = useParams();
  // get product from data set
  const filteredProduct = getNetworks().filter((product) => product.key === params.productId)
  const product = filteredProduct[0]
  console.log(product)
  const value = 4

  return (
    <main style={{ padding: "1rem 0" }}>
      <h2>Lineage</h2>
      {/* <GraphLayoutDemo nodes={nodes} links={links} /> */}

      <Card sx={{ minWidth: 275 }} variant="outlined">
        <CardContent>
          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
            data product - {product.type}: {params.productId}
          </Typography>
          <Typography variant="h5" component="div">
            {product.title}
          </Typography>
          <Typography sx={{ mb: 1.5 }} color="text.secondary">

            <Rating
              name="simple-controlled"
              value={value}
              onChange={(event, newValue) => {
                // setValue(newValue);
              }}
            />
          </Typography>
          <Typography variant="body2" display="block">
            {parse(product.description)}
          </Typography>
        </CardContent>
        <CardActions>
          <Button size="small">Learn More</Button>
        </CardActions>
      </Card>

    </main>
  );
}