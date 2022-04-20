console.log(d3);


let layers = [
    {'id': 'app', 'layer': 'Application'},
    {'id': 'stg', 'layer': 'Staging'},
    {'id': 'arc', 'layer': 'Staging Archive'},
    {'id': 'trn', 'layer': 'Transform'},
    {'id': 'dwh', 'layer': 'DWH'},
    // {'id': 'dm', 'layer': 'DM'},
    // {'id': 'raw', 'layer': 'RAW (Strada)'},
    // {'id': 'base', 'layer': 'BASE (Strada)'},
]

let nodes = [
    {'id': 'app_bnv', 'label': 'Bankview', 'layer': 'app', 'value': 100},
    {'id': 'app_fid', 'label': 'Fidor', 'layer': 'app', 'value': 100},
    {'id': 'app_mtx', 'label': 'Matrix', 'layer': 'app', 'value': 500},
    {'id': 'app_bgs', 'label': 'BGS', 'layer': 'app', 'value': 500},

    {'id': 'stg_bnv', 'label': 'STG_Bankview', 'layer': 'stg', 'value': 200},
    {'id': 'stg_fid', 'label': 'STG_Fidor', 'layer': 'stg', 'value': 300},
    {'id': 'stg_mtx', 'label': 'STG_Matrix', 'layer': 'stg', 'value': 400},

    {'id': 'arc_bnv', 'label': 'STG_Archive_Bankview', 'layer': 'arc', 'value': 200},
    {'id': 'arc_fid', 'label': 'STG_Archive_Fidor', 'layer': 'arc', 'value': 300},
    {'id': 'arc_mtx', 'label': 'STG_Archive_Matrix', 'layer': 'arc', 'value': 400},

    {'id': 'trn_bnv', 'label': 'Transform_Bankview', 'layer': 'trn', 'value': 200},
    {'id': 'trn_fid', 'label': 'Transform_Fidor', 'layer': 'trn', 'value': 300},
    {'id': 'trn_mtx', 'label': 'Transform_Matrix', 'layer': 'trn', 'value': 400},

    {'id': 'dwh_ods', 'label': 'ODS', 'layer': 'dwh', 'value': 400},

    {'id': 'dwh_dwh', 'label': 'DWH', 'layer': 'dwh', 'value': 400},

    // {'id': 'raw_dwh', 'label': 'DWH', 'layer': 'raw', 'value': 400},
    // {'id': 'raw_arc_bnv', 'label': 'STG_Archive_Bankview', 'layer': 'raw', 'value': 200},
    // {'id': 'raw_arc_fid', 'label': 'STG_Archive_Fidor', 'layer': 'raw', 'value': 300},
    // {'id': 'raw_arc_mtx', 'label': 'STG_Archive_Matrix', 'layer': 'raw', 'value': 400},
    // {'id': 'raw_bnv', 'label': 'Bankview', 'layer': 'raw', 'value': 200},
    // {'id': 'raw_mtx', 'label': 'Matrix', 'layer': 'raw', 'value': 200},

    // {'id': 'base_dwh', 'label': 'DWH', 'layer': 'base', 'value': 400},
    // {'id': 'base_arc_bnv', 'label': 'STG_Archive_Bankview', 'layer': 'base', 'value': 200},
    // {'id': 'base_arc_fid', 'label': 'STG_Archive_Fidor', 'layer': 'base', 'value': 300},
    // {'id': 'base_arc_mtx', 'label': 'STG_Archive_Matrix', 'layer': 'base', 'value': 400},
    // {'id': 'base_bnv', 'label': 'Bankview', 'layer': 'base', 'value': 200},
    // {'id': 'base_mtx', 'label': 'Matrix', 'layer': 'base', 'value': 200},
]




let links = [
    {'source': 'app_bnv', 'target': 'stg_bnv'},
    {'source': 'app_fid', 'target': 'stg_fid'},
    {'source': 'app_mtx', 'target': 'stg_mtx'},
    {'source': 'app_bgs', 'target': 'stg_mtx'},

    {'source': 'stg_bnv', 'target': 'arc_bnv'},
    {'source': 'stg_fid', 'target': 'arc_fid'},
    {'source': 'stg_mtx', 'target': 'arc_mtx'},

    {'source': 'stg_bnv', 'target': 'trn_bnv'},
    {'source': 'stg_fid', 'target': 'trn_fid'},
    {'source': 'stg_mtx', 'target': 'trn_mtx'},

    {'source': 'trn_bnv', 'target': 'dwh_ods'},
    {'source': 'trn_fid', 'target': 'dwh_ods'},
    {'source': 'trn_mtx', 'target': 'dwh_ods'},

    {'source': 'dwh_ods', 'target': 'dwh_dwh'},

    // {'source': 'dwh_dwh', 'target': 'raw_dwh'},
    // {'source': 'arc_bnv', 'target': 'raw_arc_bnv'},
    // {'source': 'arc_fid', 'target': 'raw_arc_fid'},
    // {'source': 'arc_mtx', 'target': 'raw_arc_mtx'},
    // {'source': 'app_bnv', 'target': 'raw_bnv'},
    // {'source': 'app_mtx', 'target': 'raw_mtx'},

    // {'source': 'raw_dwh',     'target': 'base_dwh'},
    // {'source': 'raw_arc_bnv', 'target': 'base_arc_bnv'},
    // {'source': 'raw_arc_fid', 'target': 'base_arc_fid'},
    // {'source': 'raw_arc_mtx', 'target': 'base_arc_mtx'},
    // {'source': 'raw_bnv',     'target': 'base_bnv'},
    // {'source': 'raw_mtx',     'target': 'base_mtx'},
]

// create visualisation
var container_width = 200;
var container_height = 600;
var container_separator = 10;

var padding = 5;
var clusterPadding = 20;
var color = d3.scaleOrdinal(d3.schemeCategory10);


var dataset_width = 160;
var dataset_height = 40;
var dataset_separator = 10;
var label_width = dataset_width;
var label_height = dataset_height;
const line_padding = 2;

var width = layers.length * (container_width + container_separator) + container_separator;
//1700;
var height = 600;

// create a cluster map, to use in the simulations
function createClusterMap()
{
    const clusterMap = {};
    var i = 0;
    layers.forEach(n => {
        //if (!clusterMap[n.layer] || (n.radius > clusterMap[n.layer].radius)) clusterMap[n.layer] = n;
        if (!clusterMap[n.id]) 
        {
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

d3.select('#data_container')
    .selectAll('p')
    .data(nodes)
    .join('p')
    .text(d => d.layer + '.' + d.label);


console.log('Initialize container:')
console.log('   Width = ' + width)
console.log('   Height = ' + height)

const forceX_lanes = function (alpha) {
    for (i in nodes)
    {
        let node = nodes[i];
        const cluster = clusters[node.layer];

        if (!cluster) 
        {   
            console.log('Cluser not found for layer: "' +node.layer+ '"');
        }
        else
        {
            // node.x -= (node.x - cluster.xMiddle) * alpha; // relative positioning
            // d.fx = (cluster.xMiddle);
            node.x = cluster.xMiddle; // absolute positioning
        }
    }
}


const link_alignment = function (alpha, traveldegradation) {
    // https://bl.ocks.org/mbostock/7881887
    return function (d) {

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

            console.log( '  ' + d.id + ':  d.y=' + d.y + '     y=' + y + '      dy=' + dy + '      dy*alpha=' + dy*alpha)

            d.y -= dy * alpha;

            for (i in targets) {
                travelLinks(d, targets[i].target, alpha * traveldegradation, traveldegradation, [d.id]);
            }
        }
    };

}

const link_alignmentD = function (alpha, traveldegradation) {
    // https://bl.ocks.org/mbostock/7881887
    for (i in nodes)
    {
        let node = nodes[i];
        // cluster linked object between different layers on the same y
        // if (d.id === 'app_bnv' || d.id === 'stg_bnv' )
        {
            var targets = links.filter(function (link) {
                return link.source.id === node.id;
            });
            var y = 0;
            for (i in targets) {
                if (Math.abs(y) < Math.abs(targets[i].target.y))
                    y = targets[i].target.y;
            }
            var dy = node.y - y;

            console.log( '  ' + node.id + ':  d.y=' + node.y + '     y=' + y + '      dy=' + dy + '      dy*alpha=' + dy * alpha)

            node.y -= dy * alpha;

            for (i in targets) {
                travelLinks(node, targets[i].target, alpha * traveldegradation, traveldegradation, [node.id]);
            }
        }
    };

}


var container = d3.select('#svg_container')
    .attr("width", width)
    .attr("height", height)
    .attr("class", "container");

    // Create the lanes
    container
        .selectAll('rect')
        .data(layers)
        .join("rect")
        .attr('x', function(d, i) {
            return container_separator + i * (container_separator + container_width);
        })
        .attr("y", 20)
        .attr("width", container_width)
        .attr("height", 400)
        .attr("id", function(d, i) {
            return d.id
        })
        .attr("class", function(d, i) {
            return i%2==0 ? 'lane lane1' : "lane lane2"
        });
  
    container
        .selectAll('.lanelabel')
        .data(layers)
        .join("text")
        .attr('x', function(d, i) {
            return (container_separator + container_width/2) + i * (container_separator + container_width);
            })
        .attr("y", 14)
        .text(d => d.layer)
        .attr("class", 'lanelabel');


var links_container = d3.select('#links')
var nodes_container = d3.select('#nodes')



var node = nodes_container
    .selectAll('.dataset')
    .data(nodes)
    .join("rect")
    .attr("x", function(d) {
        return d.x - (dataset_width / 2);
      })
    .attr('y', function(d) {
        return d.y - (dataset_height / 2);
      })
    .attr("width", dataset_width)
    .attr("height", dataset_height)
    .attr("class", 'dataset')
    .attr("id", function(d, i) {
        return d.id
    });

var node_label = nodes_container
    .selectAll('.datasetlabel')
    .data(nodes)
    .join("text")
    .attr("x", function(d, i) {
        return d.x;
      })
    .attr('y', function(d, i) {
        return 5 + d.y + label_height / 2;
      })
    .text((d) => d.label)
    .attr("class", 'datasetlabel');








console.log('Force simulation')

var simulation = d3.forceSimulation(nodes)
    // .alpha(0.3) // what does this do?
    .force('link', d3.forceLink()
        .id(d => d.id)
        .links(links)
        .distance(80)
        .strength(0.5)
    )
    .force('charge', d3.forceManyBody())
    .force('center', d3.forceCenter(width/2,height/2))
    .force('x', alpha => forceX_lanes(alpha) )
    // .force('y', alpha => link_alignment(alpha,0.5))
    // .force('x', d3.forceX(forceX_lanes(0.2)) )
    // .force('y', d3.forceY(link_alignment(0.1,0.5)))
    // .force("collide", alpha => d3.collide(alpha))
    // .force("collide", d3.forceCollide(-100))
    .on('tick',ticked);


var tickedCount = 0
var tickedRefreshCount = 1

function ticked() {
    // console.log('Ticked');
    tickedCount++;

       node
         
        //   
    //      .each(cluster(0.2));
        
         .each(collide(0.2));
        //   .each(forceX_lanes(0.2));
        //   .each(link_alignment(0.4));
    
    renderNodes();

    // // refresh display to see the changes animate
    // if (tickedCount % tickedRefreshCount === 0 )
    // {
    //     console.log('refresh display');
    //     tickedRefreshCount*=1.2;
    //     renderNodes();
    // }
}

simulation.on("end", function() {
    console.log("simulation end"); 
    console.log("nodes:"); 
    console.log(nodes);
    console.log("clusters:"); 
    console.log(clusters);

    renderAll();

    console.log("links:"); 
    console.log(links);
});


// Initial display render 
// only the nodes, because they will be moving to the right places in the simulation
renderNodes();


function getlinkPoint(source, target)
{
    var link_x = 0;
    var link_y = 0;
    
    var alfa = Math.atan(Math.abs(target.y-source.y)/Math.abs(target.x-source.x));

    var a1 = Math.atan(Math.abs(dataset_width / 2)/Math.abs(dataset_height/2));

    if ( alfa > a1 ) // top or bottom
    {
        let yDist = (dataset_height / 2 + line_padding); // distance from center to y location for connector
        if ( target.y < source.y ) // target is above source
        {
            if ( source.x < target.x)            
                link_x = source.x + yDist / Math.tan(alfa) 
            else
                link_x = source.x - yDist / Math.tan(alfa) 
            link_y = source.y - yDist;
        }
        else // target is below source
        {
            if ( source.x < target.x)            
                link_x = source.x + yDist / Math.tan(alfa) 
            else
                link_x = source.x - yDist / Math.tan(alfa) 
            link_y = source.y + yDist;
        }
    }
    else // left or right
    {
        let xDist = (dataset_width / 2 + line_padding); // distance from center to x location for connector
        if ( target.x < source.x ) // target is left
        {
            link_x = source.x - xDist;
            if ( source.y < target.y)            
                link_y = source.y + Math.tan(alfa) * xDist 
            else
                link_y = source.y - Math.tan(alfa) * xDist 
        }
        else // target is right
        {
            link_x = source.x + xDist;
            if ( source.y < target.y)            
                link_y = source.y + Math.tan(alfa) * xDist 
            else
                link_y = source.y - Math.tan(alfa) * xDist 
        }
    }

    return {
        x: link_x,
        y: link_y
    };
}

// Links:
// per link
// - lookup source location
// - lookup destination location
// draw arrows
function computeLinks() {
    for (i in links) {
        var link = links[i];
        var linkName = link.source.id + '_' + link.target.id
        // console.log('compute link ' + i + ': ' + linkName)

        // var sourceObject = d3.select('#' + link.source.id );
        // var source = getlinkPoint(sourceObject,targetObject);

        // var targetObject = d3.select('#' + link.target.id );
        // var target = getlinkPoint(targetObject,sourceObject);

        var source = getlinkPoint(link.source, link.target);
        var target = getlinkPoint(link.target, link.source);

        link.x1 = source.x;
        link.y1 = source.y;
        link.x2 = target.x;
        link.y2 = target.y;
        // console.log(link)
    }

}


function renderNodes() {
    node
        .attr("x", function (d) {
            return d.x - (dataset_width / 2);
        })
        .attr('y', function (d) {
            return d.y - label_height / 2;
        });

    node_label
        .attr("x", function (d, i) {
            return d.x;
        })
        .attr('y', function (d, i) {
            return 5 + d.y;
        })
}

function renderLinks() {
    computeLinks();

    links_container
        .selectAll('.link')
        .data(links)
        .enter()
        .append('line')
        .attr('x1', d => d.x1)
        .attr('y1', d => d.y1)
        .attr('x2', d => d.x2)
        .attr('y2', d => d.y2)
        // .attr('id',d => d.source + '_' + d.target)
        .attr('class', 'link')
        .attr("marker-end", "url(#arrow)");
}

function renderAll() {
    renderNodes();
    renderLinks();
}

/*
 */
var maxRadius = 10;
var heightRadius = dataset_height + dataset_separator;
var widthRadius = dataset_width + dataset_separator;
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
                if ( overlap ) {
                    lx = (l - widthRadius) / l * alpha;
                    ly = (l - heightRadius) / l * alpha;
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

// const collide1 = function (alpha) {
//     // https://bl.ocks.org/mbostock/7882658
//     const quadtree = d3.quadtree()
//         .x(function (d) { return d.x; })
//         .y(function (d) { return d.y; })
//         .extent([[0, 0], [width, height]])
//         .addAll(nodes);
//     return function (d) {
//         let r = d.radius + (maxRadius * 8) + Math.max(padding, clusterPadding),
//             nx1 = d.x - r,
//             nx2 = d.x + r,
//             ny1 = d.y - r,
//             ny2 = d.y + r;
//         quadtree.visit(function (quad, x1, y1, x2, y2) {
//             let data = quad.data;
//             if (data && data !== d) {
//                 let x = d.x - data.x,
//                     y = d.y - data.y,
//                     l = Math.sqrt(x * x + y * y),
//                     r = d.radius + data.radius + (d.cluster == data.cluster ? padding : clusterPadding);
//                 if (l < r) { // the two elements collide
//                     l = (l - r) / l * alpha;
//                     d.x -= x *= l;
//                     d.y -= y *= l;
//                     data.x += x;
//                     data.y += y;
//                 }
//             }
//             return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
//         });
//     };
// }





const cluster = function(alpha,traveldegradation) {
    // https://bl.ocks.org/mbostock/7881887
    return function (d) {
      const cluster = clusters[d.layer];
      if (!cluster) return;
        let dx = d.x - (cluster.x + clusterPadding);

        if (Math.abs(dx > 10))
        {
            d.x -= dx; // the x is absolutely positioned by the layer
        }

        // cluster linked object between different layers on the same y
        // if (d.id === 'app_bnv' || d.id === 'stg_bnv' )
        {
        var targets = links.filter(function(link)
        {
            return link.source.id === d.id;
        });
        var y = 0;
        for (i in targets)
        {
            if (Math.abs(y) < Math.abs(targets[i].target.y))
                y = targets[i].target.y;
        }
        var dy = d.y - y;

        //console.log( '  ' + d.id + ':  d.y=' + d.y + '     y=' + y + '      dy=' + dy + '      dy*alpha=' + dy*alpha)

        d.y -= dy * alpha;

        for (i in targets)
        {
            travelLinks(d,targets[i].target,alpha * traveldegradation,[d.id]);
        }
    }
        // d.y = y;
    };
   
  }


function travelLinks(origin, destination, alpha,traveldegradation, visited)
{
    // console.log('  o:' + origin.id + '-->' + destination.id + '   (len=' + visited.length+')')
    visited.push(destination.id);
    destination.y -= (destination.y - origin.y)* alpha;

    // check for follow up targets
    var targets = links.filter(function(link)
    {
        return link.source.id === destination.id;
    });
    var y = 0;

    for (i in targets)
    {
        if ( !visited.includes(targets[i].target.id))
            travelLinks(origin,targets[i].target,alpha * traveldegradation,traveldegradation,visited);
    }    

    // check for sources that are not the origninator
    var sources = links.filter(function(link)
    {
        return 
            (link.target.id === destination.id);
    });
    for (i in sources)
    {
        if ( !visited.includes(sources[i].source.id))
            travelLinks(origin,sources[i].source,alpha * traveldegradation,traveldegradation,visited);
    }    
}