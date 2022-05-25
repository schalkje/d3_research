import React from 'react';
import * as d3 from 'd3';
import { select, selectAll, event } from 'd3-selection'
import { useD3 } from '../../hooks/useD3'
import './graphStyle.css';




var width = 600;
var height = 1000;

const radius = 40;
const node_distance = radius * 2;
const link_separator = 4;


function GraphLayoutDemo({ nodes, links }) {
  const ref = useD3(
    (svg) => {
      //////////////////////////////////////////////////////////////
      //
      // Initialize drawing container
      //

      console.log('Create container');

      var container = d3.select('#svg_container')
        .attr("width", width)
        .attr("height", height)
        .attr("class", "container");

      var links_container = d3.select('#links')
      // var ghostlinks_container = d3.select('#ghostlinks')
      var nodes_container = d3.select('#nodes')







      //////////////////////////////////////////////////////////////
      //
      // Simulation
      //

      var simulation = d3.forceSimulation(nodes)
        .force(
          "link",
          d3.forceLink()
            .id(d => d.id)
            .links(links)
            .distance(node_distance) // with 100 you get link below a node
            .strength(0.9)
        )
        .force("x", d3.forceX(width / 2).strength(0.1))
        .force("charge", d3.forceManyBody().strength(-1500))
        .force(
          "y",
          d3.forceY()
            .y(node => {
              return (_calcPath(node) - 1) * (radius + node_distance) + node_distance;
            })
            .strength(node => {
              let dependedOn = _nodeDependedOn(node);

              if (!dependedOn || node.dependsOn.length < 1) {
                return 1;
              }

              // not a top or bottom
              return 0.1;
            })
        )
        .force("collide", d3.forceCollide(radius))
        .on("tick", tick)
        .on("end", endSimulation);


      var tick_counter = 0;
      function tick() {
        tick_counter++;
        console.log('tick')

        update();
      };

      function endSimulation() {
        console.log("Simulation ended after " + tick_counter + ' ticks')

        console.log("Nodes:");
        console.log(nodes);

        console.log("Links:");
        console.log(links);
      };











      //////////////////////////////////////////////////////////////
      //
      // Draw all objects
      //

      var nodes_objects = nodes_container
        .selectAll('.node')
        .data(nodes)
        .join("circle")
        .attr("cx", d => d.x)
        .attr('cy', d => d.y)
        .attr('r', d => radius)
        .attr("class", 'node')
        .call(d3.drag()
          .on('start', drag_started)
          .on('drag', dragged)
          .on('end', drag_ended)
        )

      var nodeLabels_objects = nodes_container
        .selectAll('.node_label')
        .data(nodes)
        .join("text")
        .attr("x", d => d.x)
        .attr('y', d => d.y + 4)
        .text(d => d.name)
        .attr("class", 'node_label');



      // var ghostlinks_objects = ghostlinks_container
      //   .selectAll('.ghostlink')
      //   .data(links)
      //   .join("line")
      //   .attr('x1', function (d) { return d.source.x })
      //   .attr('y1', function (d) { return d.source.y })
      //   .attr('x2', function (d) { return d.target.x })
      //   .attr('y2', function (d) { return d.target.y })
      //   .attr("class", 'ghostlink');

      var links_objects = links_container
        .selectAll('.link')
        .data(links)
        .join("line")
        .attr("x1", function (d) {
          var alfa = Math.atan(Math.abs(d.target.y - d.source.y) / Math.abs(d.target.x - d.source.x));
          var dx = Math.cos(alfa) * (radius + link_separator);
          return d.source.x < d.target.x ? d.source.x + dx : d.source.x - dx;
        })
        .attr("y1", function (d) {
          var alfa = Math.atan(Math.abs(d.target.y - d.source.y) / Math.abs(d.target.x - d.source.x));
          var dy = Math.sin(alfa) * (radius + link_separator);
          return d.source.y < d.target.y ? d.source.y + dy : d.source.y - dy;
        })
        .attr("x2", function (d) {
          var alfa = Math.atan(Math.abs(d.target.y - d.source.y) / Math.abs(d.target.x - d.source.x));
          var dx = Math.cos(alfa) * (radius + link_separator);
          return d.source.x < d.target.x ? d.target.x - dx : d.target.x + dx;
        })
        .attr('y2', function (d) {
          var alfa = Math.atan(Math.abs(d.target.y - d.source.y) / Math.abs(d.target.x - d.source.x));
          var dy = Math.sin(alfa) * (radius + link_separator);
          return d.source.y < d.target.y ? d.target.y - dy : d.target.y + dy;
        })
        .attr('marker-end', 'url(#suit)')
        .attr("class", 'link');









      //////////////////////////////////////////////////////////////
      //
      // Update the location for the simulation
      //

      function update() {
        nodes_objects
          .attr("cx", d => d.x)
          .attr("cy", d => d.y);

        nodeLabels_objects
          .attr("x", d => d.x)
          .attr('y', d => d.y + 4);

        // ghostlinks_objects
        //   .attr('x1', function (d) { return d.source.x })
        //   .attr('y1', function (d) { return d.source.y })
        //   .attr('x2', function (d) { return d.target.x })
        //   .attr('y2', function (d) { return d.target.y })

        links_objects
          .attr("x1", function (d) {
            var alfa = Math.atan(Math.abs(d.target.y - d.source.y) / Math.abs(d.target.x - d.source.x));
            var dx = Math.cos(alfa) * (radius + link_separator);
            return d.source.x < d.target.x ? d.source.x + dx : d.source.x - dx;
          })
          .attr("y1", function (d) {
            var alfa = Math.atan(Math.abs(d.target.y - d.source.y) / Math.abs(d.target.x - d.source.x));
            var dy = Math.sin(alfa) * (radius + link_separator);
            return d.source.y < d.target.y ? d.source.y + dy : d.source.y - dy;
          })
          .attr("x2", function (d) {
            var alfa = Math.atan(Math.abs(d.target.y - d.source.y) / Math.abs(d.target.x - d.source.x));
            var dx = Math.cos(alfa) * (radius + link_separator);
            return d.source.x < d.target.x ? d.target.x - dx : d.target.x + dx;
          })
          .attr('y2', function (d) {
            var alfa = Math.atan(Math.abs(d.target.y - d.source.y) / Math.abs(d.target.x - d.source.x));
            var dy = Math.sin(alfa) * (radius + link_separator);
            return d.source.y < d.target.y ? d.target.y - dy : d.target.y + dy;
          })
      }

      // drag
      function drag_started(event, d) {
        if (!event.active) {
          // Set the attenuation coefficient to simulate the node position movement process. The higher the value, the faster the movement. The value range is [0, 1]
          simulation.alphaTarget(0.8).restart()
        }
        d.fx = d.x
        d.fy = d.y
        d3.select(this).attr("class", "node_grabbing");
      }

      function dragged(event, d) {
        d.fx = event.x
        d.fy = event.y
      }

      function drag_ended(event, d) {
        if (!event.active) {
          simulation.alphaTarget(0)
        }
        d.fx = null
        d.fy = null
        d3.select(this).attr("class", "node");
      }


      function _nodeDependedOn(node) {
        let dependedOn = false;

        nodes.forEach(n => {
          dependedOn = dependedOn || n.dependsOn.includes(node.id);
        });

        return dependedOn;
      }

      /** 
      * Recursively calculates the **longest** path in our tree
      */
      function _calcPath(node, length = 1) {
        if (!node.dependsOn || node.dependsOn.length < 1) {
          return length;
        }

        return Math.max(
          ...node.dependsOn.map(id =>
            _calcPath(nodes.find(n => n.id === id), length + 1)
          )
        );
      }
    },
    [nodes.length]
  );

  return (
    <svg id="svg_container" className="container"
      ref={ref}
      style={{
        width: "100%",
      }}
    >
      <defs>
        <marker id="arrow" viewBox="0 -5 10 10" refX="10" refY="0" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M0,-5L10,0L0,5Z" />
        </marker>
        <marker id="triangle" viewBox="0 0 10 10" refX="1" refY="5" markerUnits="strokeWidth" markerWidth="10"
          markerHeight="10" orient="auto">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#f00" />
        </marker>
        <marker id="suit" viewBox="0 -5 10 10" refX="10" refY="0" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M0,-5L10,0L0,5 L10,0 L0, -5" stroke="#4679BD" opacity="0.6" />
        </marker>
        <marker id="suit_big" viewBox="0 -5 10 10" refX="10" refY="0" markerWidth="12" markerHeight="12" orient="auto">
          <path d="M0,-5L10,0L0,5 L10,0 L0, -5" stroke="#4679BD" opacity="0.6" />
        </marker>
      </defs>
      {/* using multiple g-object to support layers in the drawing */}
      <g id="links">
      </g>
      <g id="nodes">
      </g>
      {/* <g id="ghostlinks">
      </g> */}
    </svg>
  );
}

export default GraphLayoutDemo;
