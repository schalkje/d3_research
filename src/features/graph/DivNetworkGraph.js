import React from 'react';
import * as d3 from 'd3';
import { select, selectAll, event } from 'd3-selection'
import { useD3 } from '../../hooks/useD3'
import './DivNetworkGraph.css';

// https://www.jotform.com/blog/better-positioning-and-transforming-with-nested-svgs/
// https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/Positions
// https://svgwrite.readthedocs.io/en/latest/classes/group.html

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


function DivNetworkGraph({ layers, nodes, links }) {
  const ref = useD3(
    (svg) => {

      // create a cluster map, to use in the simulations
      function createClusterMap() {
        const clusterMap = {};
        var i = 0;
        layers.forEach(n => {
          //if (!clusterMap[n.layer] || (n.radius > clusterMap[n.layer].radius)) clusterMap[n.layer] = n;
          if (!clusterMap[n.id]) {
            clusterMap[n.id] = n;
            clusterMap[n.id].x = container_separator + i * (container_separator + container_width);
            clusterMap[n.id].y = 20;
            clusterMap[n.id].width = container_width;
            clusterMap[n.id].height = container_height;
            clusterMap[n.id].xMiddle = clusterMap[n.id].x + (container_width / 2);
            clusterMap[n.id].yMiddle = clusterMap[n.id].y + (container_height);
            i++;
          }
        });
        return clusterMap;
      }

      let clusters = createClusterMap();


      //////////////////////////////////////////////////////////////
      //
      // Initialize drawing container
      //

      var width = layers.length * (container_width + container_separator) + container_separator;
      var height = container_height + container_top + container_separator;


      console.log('Initialize container:')
      console.log('   Width = ' + width)
      console.log('   Height = ' + height)

      const forceX_lanes = function (alpha) {
        for (i in nodes) {
          let node = nodes[i];
          const cluster = clusters[node.layer];

          if (!cluster) {
            console.log('Cluser not found for layer: "' + node.layer + '"');
          }
          else {
            node.x = cluster.xMiddle; // absolute positioning
          }
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

      var maxRadius = 10;
      var heightRadius = node_height + node_separator;
      var widthRadius = node_width + node_separator;

      const collideD = function (alpha) {
        const quadtree = d3.quadtree()
          .x(function (d) { return d.x; })
          .y(function (d) { return d.y; })
          .extent([[0, 0], [width, height]])
          .addAll(nodes);
        // https://bl.ocks.org/mbostock/7882658
        for (i in nodes) {
          let node = nodes[i];
          // let nx1 = node.x - widthRadius
            // nx2 = node.x + widthRadius
          let ny1 = node.y - heightRadius;
          let ny2 = node.y + heightRadius;
          quadtree.visit(function (quad, x1, y1, x2, y2) {
            let data = quad.data;
            if (data && data !== node) {
              // let dx = node.x - data.x;
              let dy = node.y - data.y;
              // let l = Math.sqrt(dx * dx + dy * dy); // distance between the 2 nodes

                // when they collide push them away from each other
              let overlap = !(
                  (data.x - node.x > widthRadius) || // rect1.right < rect2.left: fully on the right side
                  (node.x - data.x > widthRadius) || // rect1.left > rect2.right: fully on the keft side
                  (data.y - node.y > heightRadius) || // rect1.bottom < rect2.top: fully above
                  (node.y - data.y > heightRadius) // rect1.top > rect2.bottom: fully below
                  //  (node.x + widthRadius) < data.x || // rect1.right < rect2.left: fully on the right side
                  //  node.x > (data.x + widthRadius) || // rect1.left > rect2.right: fully on the keft side
                  // (node.y + heightRadius) < data.y || // rect1.bottom < rect2.top: fully above
                  //  node.y > (data.y + heightRadius) // rect1.top > rect2.bottom: fully below
                );
              // console.log('  overlap=' + overlap + ' <-- x1=' + node.x + ', y1=' + node.y + ' (' + node.id + ')' + ' - x2=' + data.x + ', y2=' + data.y + ' (' + data.id + ')')
              if (overlap) {
                // let lx = (l - widthRadius) / l * alpha;
                // let ly = (l - heightRadius) / l * alpha;
                let ly = 1
                let delta = 0

                if ( node.y < data.y )
                {
                  delta = ((heightRadius+dy) * (1)) / 2
                  // node.x -= dx;
                  node.y -= delta;
                  // data.x += dx;
                  data.y += delta;
                }
                else
                {
                  delta = ((heightRadius-dy) * (1)) / 2
                  // node.x -= dx;
                  node.y -= delta;
                  // data.x += dx;
                  data.y += delta;
                }

                // delta = ((heightRadius-dy) * (1 + alpha)) / 2
                // else
            //        delta = dy * alpha
                // ly = (l - heightRadius) / l * alpha;
                // dx *= lx;



                // console.log('                -> heightRadius='+heightRadius+', delta=' +delta+', x1=' + node.x + ', y1=' + node.y + ' - x2=' + data.x + ', y2=' + data.y)
              }
            }
            // return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
            return y1 > ny2 || y2 < ny1;
          });
        };
      }

      /*
       */

      const collide = function (alpha) {
        // https://bl.ocks.org/mbostock/7882658
        const quadtree = d3.quadtree()
          .x(function (d) { return d.x; })
          .y(function (d) { return d.y; })
          .extent([[0, 0], [width, height]])
          .addAll(nodes);
        return function (d) {
          let nx1 = d.x - widthRadius,
            nx2 = d.x + widthRadius,
            ny1 = d.y - heightRadius,
            ny2 = d.y + heightRadius;
          quadtree.visit(function (quad, x1, y1, x2, y2) {
            let data = quad.data;
            if (data && data !== d) {
              let dx = d.x - data.x,
                dy = d.y - data.y,
                l = Math.sqrt(dx * dx + dy * dy), // distance between the 2 nodes

                // when they collide push them away from each other
                overlap = !(
                  (d.x + widthRadius) < data.x || // rect1.right < rect2.left: fully on the right side
                  d.x > (data.x + widthRadius) || // rect1.left > rect2.right: fully on the keft side
                  (d.y + heightRadius) < data.y || // rect1.bottom < rect2.top: fully above
                  d.y > (data.y + heightRadius) // rect1.top > rect2.bottom: fully below
                );
              if (overlap) {
                let lx = (l - widthRadius) / l * alpha;
                let ly = (l - heightRadius) / l * alpha;
                d.x -= dx *= lx;
                d.y -= dy *= ly;
                data.x += dx;
                data.y += dy;
              }
            }
            return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
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

      var lanes_container = d3.select('#lanes')
      var links_container = d3.select('#links')
      var ghostlinks_container = d3.select('#ghostlinks')
      var nodes_container = d3.select('#nodes');

      // Create the lanes
      var lanes_objects = lanes_container
        .selectAll('.lane')
        .data(layers)
        .join("rect")
        .attr('x', function (d, i) {
          return container_separator + i * (container_separator + container_width);
        })
        .attr("y", container_top)
        .attr("width", container_width)
        .attr("height", container_height)
        .attr("id", function (d, i) {
          return d.id
        })
        .attr("class", function (d, i) {
          return i % 2 == 0 ? 'lane lane1' : "lane lane2"
        });

      var lanelabel_objects = lanes_container
        .selectAll('.lanelabel')
        .data(layers)
        .join("text")
        .attr('x', function (d, i) {
          return (container_separator + container_width / 2) + i * (container_separator + container_width);
        })
        .attr("y", 14)
        .text(d => d.layer)
        .attr("class", 'lanelabel');





      var node_objects = nodes_container
        .selectAll('.node')
        .data(nodes)
        .join("div")
        .attr("x", function (d) {
          return d.x - (node_width / 2);
        })
        .attr('y', function (d) {
          return d.y - (node_height / 2);
        })
        .attr("width", node_width)
        .attr("height", node_height)
        .attr("class", 'node')
        .attr("id", function (d, i) {
          return d.id
        });
        // .call(d3.drag()
        //   .on("start", drag_started)
        //   .on("drag", dragged)
        //   .on("end", drag_ended)
        // );

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

      var simulation = d3.forceSimulation(nodes)
        .force('x', alpha => forceX_lanes(alpha))
        .force('link', d3.forceLink()
          .id(d => d.id)
          .links(links)
          .distance(80)
          .strength(0.01)
        )
        // .force('charge', d3.forceManyBody().strength(-20))
        .force('center', d3.forceCenter(width / 2, height / 2))
        // .force('y', alpha => link_alignment(alpha, 1))
        .force("collide", alpha => collideD(alpha))
        .on('tick', ticked)
        .on("end", endSimulation);

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

      // function drag_started(event) {
      //   // when alpha hits 0 it stops. restart again
      //   // if (!event.active) {
      //   //   // Set the attenuation coefficient to simulate the node position movement process. The higher the value, the faster the movement. The value range is [0, 1]
      //   //   simulation.alphaTarget(0.3).restart()
      //   // }

      //   event.subject.fx = event.subject.x;
      //   event.subject.fy = event.subject.y;
      //   // d.fx = d.x
      //   // d.fy = d.y
      //   d3.select(this).attr("class", "node_grabbing");
      // }

      // function dragged(event) {
      //   // d.fx = event.x;
      //   // d.fx = event.y;
      //   event.subject.fx = event.x;
      //   event.subject.fy = event.y;
      // }

      // function drag_ended(event) {
      //   // alpha min is 0, head there
      //   if (!event.active) {
      //     simulation.alphaTarget(0)
      //   }

      //   event.subject.fx = null;
      //   event.subject.fy = null;

      //   d3.select(this).attr("class", "node");

      //   update();
      // }
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

        console.log("clusters:");
        console.log(clusters);

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

        let yDist = (node_height / 2 + line_padding); // distance from center to y location for connector
        let xDist = (node_width / 2 + line_padding); // distance from center to x location for connector

        if (alfa > a1) // top or bottom
        {
          if (target.y < source.y) // target is above source
          {
            if (source.x < target.x)
              link_x = source.x + yDist / Math.tan(alfa)
            else
              link_x = source.x - yDist / Math.tan(alfa)

            link_y = source.y - yDist;
          }
          else // target is below source
          {
            if (source.x < target.x)
              link_x = source.x + yDist / Math.tan(alfa)
            else
              link_x = source.x - yDist / Math.tan(alfa)

            link_y = source.y + yDist;
          }
        }
        else // left or right
        {
          if (target.x < source.x) // target is left
          {
            link_x = source.x - xDist;

            if (source.y < target.y) { // target is left and below
              link_y = source.y + Math.tan(alfa) * xDist
              link_y = link_y > source.y + (node_height / 2) ? source.y + (node_height / 2) : link_y
            }
            else { // target is left and above
              link_y = source.y - Math.tan(alfa) * xDist
              link_y = link_y < source.y - (node_height / 2) ? source.y - (node_height / 2) : link_y
            }
          }
          else // target is right
          {
            link_x = source.x + xDist;

            if (source.y < target.y) {
              link_y = source.y + Math.tan(alfa) * xDist
              link_y = link_y > source.y + (node_height / 2) ? source.y + (node_height / 2) : link_y
            }
            else {
              link_y = source.y - Math.tan(alfa) * xDist
              link_y = link_y < source.y - (node_height / 2) ? source.y - (node_height / 2) : link_y
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
            return d.x - (node_width / 2);
          })
          .attr('y', function (d) {
            return d.y - (node_height / 2);
          });

        node_label_objects
          .attr("x", function (d, i) {
            return d.x;
          })
          .attr('y', function (d, i) {
            return 5 + d.y;
          })

        ghostlink_objects
          .attr("x1", d => d.source.x)
          .attr("y1", d => d.source.y)
          .attr("x2", d => d.target.x)
          .attr("y2", d => d.target.y);



        link_objects
          .attr("x1", d => {
            var source = getlinkPoint(d.source, d.target);
            return source.x;
          })
          .attr("y1", d => {
            var source = getlinkPoint(d.source, d.target);
            return source.y;
          })
          .attr("x2", d => {
            var target = getlinkPoint(d.target, d.source);
            return target.x;
          })
          .attr("y2", d => {
            var target = getlinkPoint(d.target, d.source);
            return target.y;
          });
      }


      const cluster = function (alpha, traveldegradation) {
        // https://bl.ocks.org/mbostock/7881887
        return function (d) {
          const cluster = clusters[d.layer];
          if (!cluster) return;
          let dx = d.x - (cluster.x + clusterPadding);

          if (Math.abs(dx > 10)) {
            d.x -= dx; // the x is absolutely positioned by the layer
          }

          // cluster linked object between different layers on the same y
          // if (d.id === 'app_bnv' || d.id === 'stg_bnv' )
          {
            var targets = links.filter(function (link) {
              return link.source.id === d.id;
            });
            var y = 0;
            for (i in targets) {
              if (Math.abs(y) < Math.abs(targets[i].target.y))
                y = targets[i].target.y;
            }
            var dy = d.y - y;

            //console.log( '  ' + d.id + ':  d.y=' + d.y + '     y=' + y + '      dy=' + dy + '      dy*alpha=' + dy*alpha)

            d.y -= dy * alpha;

            for (i in targets) {
              travelLinks(d, targets[i].target, alpha * traveldegradation, [d.id]);
            }
          }
          // d.y = y;
        };

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
    <div id="svg_container" className="container"
      ref={ref}
      style={{
        width: "100%",
      }}
    >
      <svg width="100%" height="100%">
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
      <g id="lanes">
      </g>
      <g id="links">
      </g>
      <g id="ghostlinks">
      </g>
      <svg x="200" y="100" width="200" height="200" viewBox="0 0 100 100" style={{outline: "1px solid #DDDDDD"}}>
        <rect style={{x:"0px",y:"0px",width: "100%", height:"20px",fill: "black"}} />
        <rect style={{x:"0px",y:"20",width: "100%", height:"70",fill:"grey"}} />
        <text x="5" y="14" width="100%" className="header">TableName</text>
        <text x="5" y="30" className="column">id_table</text>
        <text x="5" y="40" className="column">number</text>
        <text x="5" y="50" className="column">name</text>


      </svg>
      <g transform="translate(50 45.5)
                  scale(1 1)">
        </g>      </svg>
      <div id="nodes"  width="100%" height="100%">
      </div>
    </div>
  );
}

export default DivNetworkGraph;
