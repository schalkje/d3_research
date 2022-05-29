import React from 'react';
import * as d3 from 'd3';
import { select, selectAll, event } from 'd3-selection'
import { useD3 } from '../../hooks/useD3'
import './NetworkStyle.css';




var width = 1000;
var height = 600;

var node_width = 160;
var node_height = 40;
var node_separator = 30;

var label_width = node_width;
var label_height = node_height;
const line_padding = 2;

var container_width = 200;
var container_height = 600;
var container_top = 20;
var container_separator = 10;

var padding = 5;
var clusterPadding = 20;

var i = 0;


function NetworkGraph({ nodes, links }) {
  const ref = useD3(
    (svg) => {

      //////////////////////////////////////////////////////////////
      //
      // Initialize drawing container
      //

      var width = 1000;
      var height = 800;


      console.log('Initialize container:')
      console.log('   Width = ' + width)
      console.log('   Height = ' + height)


      initializeNodes();

      function initializeNodes() {
        for (var i = 0, n = nodes.length, node; i < n; ++i) {
          node = nodes[i];
          node.index = i;

          node.width = node_width;
          node.height = node_height;
        }
      }

      const link_alignment = function (alpha, traveldegradation) {
        // https://bl.ocks.org/mbostock/7881887
        for (i in nodes) {
          let node = nodes[i];

          // cluster linked object between different layers on the same y
          var targets = links.filter(function (link) {
            return link.source.id === node.id;
          });
          var dy = 0;
          for (i in targets) {
            let target = targets[i].target;
            if (Math.abs(dy) < Math.abs(node.y - target.y))
              dy = node.y - target.y;
          }

          // console.log('link_alignment:  ' + node.id + ':  node.y=' + node.y + '      dy=' + dy + '      dy*alpha=' + dy * alpha)

          node.y -= dy * alpha;

          for (i in targets) {
            travelLinks(node, targets[i].target, alpha * traveldegradation, traveldegradation, [node.id]);
          }
        };

      }

      // create the rectangle from the center out
      function getRect(node)
      {
        let x1 = node.x - (node.width / 2);
        let y1 = node.y - (node.height / 2);
        let x2 = node.x + (node.width / 2);
        let y2 = node.y + (node.height / 2);
        return {x1,y1,x2,y2}
      }

      // create the personal space from the center out
      function getPersonalSpace(node)
      {
        let x1 = node.x - (node.width / 2) - node_separator;
        let y1 = node.y - (node.height / 2) - node_separator;
        let x2 = node.x + (node.width / 2) + node_separator;
        let y2 = node.y + (node.height / 2) + node_separator;
        return {x1,y1,x2,y2}
      }

      // var maxRadius = 10;
      // var heightRadius = node_height + node_separator;
      // var widthRadius = node_width + node_separator;
      function getDistance(rect1,rect2)
      {
        let dx = 0
        let dy = 0

        if (rect1.x2<rect2.x1)  // fully on the right side
          dx = rect2.x1-rect1.x2
        else if (rect1.x1>rect2.x2) // fully on the keft side
          dx = rect1.x1-rect2.x2

        if (rect1.y2<rect2.y1) // fully above
          dy = rect2.y1-rect1.y2
        else if (rect1.y1 > rect2.y2) // fully below
          dy = rect1.y1-rect2.y2

        let l = Math.sqrt(dx * dx + dy * dy); // distance between the 2 nodes
        let overlap = (dx == 0 && dy == 0)
        return {overlap, dx, dy, l}
      }

      function getHeartDistance(rect1,rect2)
      {
        let dx = Math.abs(rect2.x-rect1.x)
        let dy = Math.abs(rect2.y-rect1.y)

        let l = Math.sqrt(dx * dx + dy * dy); // distance between the 2 nodes

        let overlap = !(
          (rect1.x2 < rect2.x1) || // rect1.right < rect2.left: fully on the right side
          (rect1.x1 > rect2.x2) || // rect1.left > rect2.right: fully on the keft side
          (rect1.y2 < rect2.y1) || // rect1.bottom < rect2.top: fully above
          (rect1.y1 > rect2.y2) // rect1.top > rect2.bottom: fully below
        );

        return {overlap, dx, dy, l}
      }

      const collideD = function (alpha) {
        console.log('collideD')
        const quadtree = d3.quadtree()
          .x(function (d) { return d.x; })
          .y(function (d) { return d.y; })
          .extent([[0, 0], [width, height]])
          .addAll(nodes);
        
        // https://bl.ocks.org/mbostock/7882658
        for (i in nodes) {
          let node = nodes[i];

          quadtree.visit(function (quad, x1, y1, x2, y2) {
            let data = quad.data;
            if (data && data !== node) {

              // when they collide push them away from each other
              let distance = getHeartDistance(node,data);
              // console.log('  overlap=' + overlap + ' <-- x1=' + node.x + ', y1=' + node.y + ' (' + node.id + ')' + ' - x2=' + data.x + ', y2=' + data.y + ' (' + data.id + ')')

              if (distance.overlap) {
                if ( node.y < data.y )
                {
                  node.y -= node.height - (distance.dy/2 * (1+alpha));
                  data.y += data.height - (distance.dy/2 * (1+alpha));
                }
                else
                {
                  node.y += node.height - (distance.dy/2 * (1+alpha));
                  data.y -= data.height - (distance.dy/2 * (1+alpha));
                }

                if ( node.x < data.x )
                {
                  node.x -= node.width - (distance.dx/2 * (1+alpha));
                  data.x += data.width - (distance.dx/2 * (1+alpha));
                }
                else
                {
                  node.x += node.width - (distance.dx/2 * (1+alpha));
                  data.x -= data.width - (distance.dx/2 * (1+alpha));
                }
                // console.log('                -> heightRadius='+heightRadius+', delta=' +delta+', x1=' + node.x + ', y1=' + node.y + ' - x2=' + data.x + ', y2=' + data.y)
              }
              return distance.overlap;
            }
          });
        };
      }

      //////////////////////////////////////////////////////////////
      //
      // Initialize drawing container
      //

      var container = d3.select('#svg_container')
        .attr("width", width)
        .attr("height", height)
        .attr("class", "container");

      var links_container = d3.select('#links')
      var ghostlinks_container = d3.select('#ghostlinks')
      var nodes_container = d3.select('#nodes');


      var node_objects = nodes_container
        .selectAll('.node')
        .data(nodes)
        .join("rect")
        // initialize size
        .attr("width", d => d.width)
        .attr("height", d => d.height)
        .attr("class", 'node')
        .attr("id", function (d, i) {
          return d.id
        });

    console.log("node_objects initialized:");
    console.log(node_objects);

      var node_label_objects = nodes_container
        .selectAll('.node_label')
        .data(nodes)
        .join("text")
        .attr("x", function (d, i) {
          return d.x;
        })
        .attr('y', function (d, i) {
          return 5 + d.y + label_height / 2;
        })
        .text((d) => d.name)
        .attr("class", 'node_label');


      var ghostlink_objects = ghostlinks_container
        .selectAll('.ghostlink')
        .data(links)
        .enter()
        .append('line')
        .attr('x1', d => d.x1)
        .attr('y1', d => d.y1)
        .attr('x2', d => d.x2)
        .attr('y2', d => d.y2)
        .attr('class', 'ghostlink');

      var link_objects = links_container
        .selectAll('.link')
        .data(links)
        .enter()
        .append('line')
        .attr('x1', d => getlinkPoint(d.source, d.target).x)
        .attr('y1', d => getlinkPoint(d.source, d.target).y)
        .attr('x2', d => getlinkPoint(d.target, d.source).x)
        .attr('y2', d => getlinkPoint(d.target, d.source).y)
        .attr('class', 'link')
        .attr("marker-end", "url(#arrow)");




      //////////////////////////////////////////////////////////////
      //
      // Possition the nodes using a simulation
      //


      console.log('Force simulation')

      // var simulation = d3.forceSimulation(nodes)
      //   .force('link', d3.forceLink()
      //     .id(d => d.id)
      //     .links(links)
      //     .distance(80)
      //     .strength(0.01)
      //   )
      //   .force('charge', d3.forceManyBody().strength(-20))
      //   .force('center', d3.forceCenter(width / 2, height / 2))
      //   // .force('y', alpha => link_alignment(alpha, 1))
      //   .force("collide", alpha => collideD(alpha))
      //   .on('tick', ticked)
      //   .on("end", endSimulation);

      var tick_counter = 0

      function ticked() {
        // console.log('Ticked');
        // tick_counter++;
        // links_container
        // .attr("x1", d => d.source.x)
        // .attr("y1", d => d.source.y)
        // .attr("x2", d => d.target.x)
        // .attr("y2", d => d.target.y);


        //    node
        // // //      .each(cluster(0.2));
        //      .each(collide(0.2));
        //   .each(forceX_lanes(0.2));
        //   .each(link_alignment(0.4));

        update();
      }

      //https://dev.to/taowen/make-react-svg-component-draggable-2kc
      //https://www.d3indepth.com/interaction/

      function drag(simulation) {
        function dragstarted(event) {
          if (!event.active) simulation.alphaTarget(0.3).restart();
          event.subject.fx = event.subject.x;
          event.subject.fy = event.subject.y;
        }

        function dragged(event) {
          event.subject.fx = event.x;
          event.subject.fy = event.y;
        }

        function dragended(event) {
          if (!event.active) simulation.alphaTarget(0);
          event.subject.fx = null;
          event.subject.fy = null;

          // update();
        }

        return d3.drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended);
      }

      //clamp: https://observablehq.com/@d3/sticky-force-layout?collection=@d3/d3-drag
      // function click(event, d) {
      //     delete d.fx;
      //     delete d.fy;
      //     d3.select(this).classed("fixed", false);
      //     simulation.alpha(1).restart();
      //   }

      function endSimulation() {
        // console.log("Simulation ended after " + tick_counter + ' ticks')
        console.log("Simulation ended")

        console.log("Nodes:");
        console.log(nodes);

        console.log("Links:");
        console.log(links);

        // one final time updating the drawing
        update();

      };


      function getlinkPoint(source, target) {
        var link_x = 0;
        var link_y = 0;

        var alfa = Math.atan(Math.abs(target.y - source.y) / Math.abs(target.x - source.x));

        var a1 = Math.atan(Math.abs(node_width / 2) / Math.abs(node_height / 2));

        let yDist = (source.height / 2 + line_padding); // distance from center to y location for connector
        let xDist = (source.width / 2 + line_padding); // distance from center to x location for connector

        if (alfa > a1) // top or bottom
        {
          if (target.y < source.y) // target is above source
          {
            if (source.x < target.x)
              link_x = source.x + yDist / Math.tan(alfa)
            else
              link_x = source.x - yDist / Math.tan(alfa)

            link_y = source.sy1;
          }
          else // target is below source
          {
            if (source.x < target.x)
              link_x = source.x + yDist / Math.tan(alfa)
            else
              link_x = source.x - yDist / Math.tan(alfa)

            link_y = source.sy2;
          }
        }
        else // left or right
        {
          if (target.x < source.x) // target is left
          {
            link_x = source.sx1;

            if (source.y < target.y) { // target is left and below
              link_y = source.y + Math.tan(alfa) * xDist
              link_y = link_y > source.y + (source.height / 2) ? source.y + (source.height / 2) : link_y
            }
            else { // target is left and above
              link_y = source.y - Math.tan(alfa) * xDist
              link_y = link_y < source.y - (source.height / 2) ? source.y - (source.height / 2) : link_y
            }
          }
          else // target is right
          {
            link_x = source.sx2;

            if (source.y < target.y) {
              link_y = source.y + Math.tan(alfa) * xDist
              link_y = link_y > source.y + (source.height / 2) ? source.y + (source.height / 2) : link_y
            }
            else {
              link_y = source.y - Math.tan(alfa) * xDist
              link_y = link_y < source.y - (source.height / 2) ? source.y - (source.height / 2) : link_y
            }
          }
        }

        return {
          x: link_x,
          y: link_y
        };
      }



      function update() {
        node_objects
          .attr("x", function (d) {
            return d.x;
          })
          .attr('y', function (d) {
            return d.y;
          });

        // node_label_objects
        //   .attr("x", function (d, i) {
        //     return d.x;
        //   })
        //   .attr('y', function (d, i) {
        //     return 5 + d.y;
        //   })

        // ghostlink_objects
        //   .attr("x1", d => d.source.x)
        //   .attr("y1", d => d.source.y)
        //   .attr("x2", d => d.target.x)
        //   .attr("y2", d => d.target.y);



        // link_objects
        //   .attr("x1", d => {
        //     var source = getlinkPoint(d.source, d.target);
        //     return source.x;
        //   })
        //   .attr("y1", d => {
        //     var source = getlinkPoint(d.source, d.target);
        //     return source.y;
        //   })
        //   .attr("x2", d => {
        //     var target = getlinkPoint(d.target, d.source);
        //     return target.x;
        //   })
        //   .attr("y2", d => {
        //     var target = getlinkPoint(d.target, d.source);
        //     return target.y;
        //   });
      }


      function travelLinks(origin, destination, alpha, traveldegradation, visited) {
        // console.log('travelLinks  o:' + origin.id + '-->' + destination.id + '   (len=' + visited.length + ')')
        visited.push(destination.id);
        destination.y -= (destination.y - origin.y) * alpha;

        // check for follow up targets
        var targets = links.filter(function (link) {
          return link.source.id === destination.id;
        });
        var y = 0;

        for (i in targets) {
          if (!visited.includes(targets[i].target.id))
            travelLinks(origin, targets[i].target, alpha * traveldegradation, traveldegradation, visited);
        }

        // check for sources that are not the origninator
        var sources = links.filter(function (link) {
          return (link.target.id === destination.id);
        });
        for (i in sources) {
          if (!visited.includes(sources[i].source.id))
            travelLinks(origin, sources[i].source, alpha * traveldegradation, traveldegradation, visited);
        }
      }
    }
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
      <g id="ghostlinks">
      </g>
    </svg>
  );
}

export default NetworkGraph;
