# Edges

## Features:
- edges are a class
- edges connect two nodes
- all types of edges can be connected
- each node has a function: getConnectionPoint; that return the connectionpoiint of a node based on a straight line

## Data features
- edges can be added to every level of the data graph?

# Visualisation

## Ghostlines
Edged have the ability to turn on ghostlines.

Ghostlines have two modes:
1. straight line from edge start to end
1. straight line from centerpoint of start node to start node connectionpoint, and straight line from end node connectionpoint to centerpoint of end node



## Questions
- How can we avoid crossing lines as much as possible
- can we join lines visual?
- How can we make an attractive image?
- How can we clean the crossing lines?
- How is edge creation initiated?
  - Edges can be internal in a group, or cross group; do we need to render them differently
  - groups can be nested, so internal / external definition is flexible per layer in the group hierarchy


## First implementation
- a function that creates edges
- input: nodes & edges

# Fetured edges
## Budled edge / Fan-out / fan-in
When multiple edges end in the same node, they can be bundled.
This means they come together at one point (might be a circle), and from that point go on as one line.

### Or simular when multiple edges start in the same node:
When multiple edges start in the same node and fan-out to multiple nodes, they can be bundled.
This means they start as one line to a join point, one point (might be a circle), and from that point go on as separate connections.
