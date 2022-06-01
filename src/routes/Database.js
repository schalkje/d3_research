import { useParams } from "react-router-dom";

import parse from "html-react-parser";

import * as React from 'react';
import Rating from '@mui/material/Rating';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Tables from "../features/database/Tables";
import { getLineageGraphs } from "../data/lineage_graphs";


export default function Database() {
  let params = useParams();
  // get product from data set
  const filteredGraph = getLineageGraphs().filter((graph) => graph.key === params.graphId)
  const graph = filteredGraph[0]
  console.log(graph)
  const rating = 4

  return (
    <main style={{ padding: "1rem 0" }}>
      <Card sx={{ minWidth: 275 }} variant="outlined">
        <CardContent>
          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
            {graph.type}: {params.networkId}
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
      <h2>Database tables</h2>
      {params.graphId == 'Tables' ?
        <Tables />
        : <Tables />}
    </main>
  );
}