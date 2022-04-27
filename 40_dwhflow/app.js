console.log(d3)

var width = 1700;
var height = 600;

var container_width = 200;
var container_separator = 10;

var node_width = 160;
var node_height = 40;
var node_separator = 10;





//////////////////////////////////////////////////////////////
//
// Setup data
//

let layers = [
    {'id': 'app', 'layer': 'Application'},
    {'id': 'stg', 'layer': 'Staging'},
    {'id': 'arc', 'layer': 'Staging Archive'},
    {'id': 'trn', 'layer': 'Transform'},
    {'id': 'dwh', 'layer': 'DWH'},
    {'id': 'dm', 'layer': 'DM'},
    {'id': 'raw', 'layer': 'RAW (Strada)'},
    {'id': 'base', 'layer': 'BASE (Strada)'},
]

let data = [
    {'id': 'app_bnv', 'dataset': 'Bankview', 'layer': 'app', 'value': 100},
    {'id': 'app_fid', 'dataset': 'Fidor', 'layer': 'app', 'value': 100},
    {'id': 'app_mtx', 'dataset': 'Matrix', 'layer': 'app', 'value': 500},
    {'id': 'app_bgs', 'dataset': 'BGS', 'layer': 'app', 'value': 500},

    {'id': 'stg_bnv', 'dataset': 'STG_Bankview', 'layer': 'stg', 'value': 200},
    {'id': 'stg_fid', 'dataset': 'STG_Fidor', 'layer': 'stg', 'value': 300},
    {'id': 'stg_mtx', 'dataset': 'STG_Matrix', 'layer': 'stg', 'value': 400},

    {'id': 'arc_bnv', 'dataset': 'STG_Archive_Bankview', 'layer': 'arc', 'value': 200},
    {'id': 'arc_fid', 'dataset': 'STG_Archive_Fidor', 'layer': 'arc', 'value': 300},
    {'id': 'arc_mtx', 'dataset': 'STG_Archive_Matrix', 'layer': 'arc', 'value': 400},

    {'id': 'trn_bnv', 'dataset': 'Transform_Bankview', 'layer': 'trn', 'value': 200},
    {'id': 'trn_fid', 'dataset': 'Transform_Fidor', 'layer': 'trn', 'value': 300},
    {'id': 'trn_mtx', 'dataset': 'Transform_Matrix', 'layer': 'trn', 'value': 400},

    {'id': 'dwh_ods', 'dataset': 'ODS', 'layer': 'dwh', 'value': 400},

    {'id': 'dwh_dwh', 'dataset': 'DWH', 'layer': 'dwh', 'value': 400},

    {'id': 'raw_dwh', 'dataset': 'DWH', 'layer': 'raw', 'value': 400},
    {'id': 'raw_arc_bnv', 'dataset': 'STG_Archive_Bankview', 'layer': 'raw', 'value': 200},
    {'id': 'raw_arc_fid', 'dataset': 'STG_Archive_Fidor', 'layer': 'raw', 'value': 300},
    {'id': 'raw_arc_mtx', 'dataset': 'STG_Archive_Matrix', 'layer': 'raw', 'value': 400},
    {'id': 'raw_bnv', 'dataset': 'Bankview', 'layer': 'raw', 'value': 200},
    {'id': 'raw_mtx', 'dataset': 'Matrix', 'layer': 'raw', 'value': 200},

    {'id': 'base_dwh', 'dataset': 'DWH', 'layer': 'base', 'value': 400},
    {'id': 'base_arc_bnv', 'dataset': 'STG_Archive_Bankview', 'layer': 'base', 'value': 200},
    {'id': 'base_arc_fid', 'dataset': 'STG_Archive_Fidor', 'layer': 'base', 'value': 300},
    {'id': 'base_arc_mtx', 'dataset': 'STG_Archive_Matrix', 'layer': 'base', 'value': 400},
    {'id': 'base_bnv', 'dataset': 'Bankview', 'layer': 'base', 'value': 200},
    {'id': 'base_mtx', 'dataset': 'Matrix', 'layer': 'base', 'value': 200},
]
 

let connections = [
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

    {'source': 'dwh_dwh', 'target': 'raw_dwh'},
    {'source': 'arc_bnv', 'target': 'raw_arc_bnv'},
    {'source': 'arc_fid', 'target': 'raw_arc_fid'},
    {'source': 'arc_mtx', 'target': 'raw_arc_mtx'},
    {'source': 'app_bnv', 'target': 'raw_bnv'},
    {'source': 'app_mtx', 'target': 'raw_mtx'},

    {'source': 'raw_dwh',     'target': 'base_dwh'},
    {'source': 'raw_arc_bnv', 'target': 'base_arc_bnv'},
    {'source': 'raw_arc_fid', 'target': 'base_arc_fid'},
    {'source': 'raw_arc_mtx', 'target': 'base_arc_mtx'},
    {'source': 'raw_bnv',     'target': 'base_bnv'},
    {'source': 'raw_mtx',     'target': 'base_mtx'},
]










//////////////////////////////////////////////////////////////
//
// Initialize drawing container
//

d3.select('#data_container')
    .selectAll('p')
    .data(data)
    .join('p')
    .text(d => d.layer + '.' + d.dataset);

// create visualisation

var container = d3.select('#svg_container')
    .attr("width", width)
    .attr("height", height)
    .attr("class", "container");

var links_container = d3.select('#links')
var ghostlinks_container = d3.select('#ghostlinks')
var nodes_container = d3.select('#nodes')

// Create the lanes
container
    .selectAll('rect')
    .data(layers)
    .join("rect")
    .attr('x', function(d, i) {
        return container_separator + i * (container_separator + container_width);
    })
    .attr("y", 22)
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




//////////////////////////////////////////////////////////////
//
// Possition the nodes and connections in a programmed way
//
    
// create datasets
// var layer;
for (i in layers){
    var layer = layers[i];

    var layer_object = d3.select('#' + layer.id );
    var parent_x = parseInt(layer_object.attr('x')); // need to explicitly convert to int; otherwise js thinks it's a string
    var parent_y = parseInt(layer_object.attr('y'));

    console.log('Layer: '+ layer.id + ', with label: ' + layer.layer)
    console.log(parent_x)
    console.log(parent_y)

    // var layer_data = data.filter(d => d.layer === layer.id);


    nodes_container
        .selectAll('.node')
        .data(data)
        .join("rect")
        .filter(function(d,i){ 
            return d.layer == layer.id;
         })
        .attr("x", function(d, i) {
            return 20 + parent_x;
          })
        .attr('y', function(d, i) {
            return parent_y + node_separator+ i * (node_height+node_separator); // + parent_x;
          })
        .attr("width", node_width)
        .attr("height", node_height)
        .attr("class", 'node')
        .attr("id", function(d, i) {
            return d.id
        });

    nodes_container
        .selectAll('.node_label')
        .data(data)
        .join("text")
        .filter(function(d,i){ 
            return d.layer == layer.id;
         })
        .attr("x", function(d, i) {
            return 20 + parent_x + node_width/ 2;
          })
        .attr('y', function(d, i) {
            return 5 + parent_y + node_separator + node_height / 2 + i * (node_height+node_separator); // + parent_x;
          })
        .text((d) => d.dataset)
        .attr("class", 'node_label');
}


function getRightConnectionPoint(object)
{    
    var rect=object._groups[0][0];

    var link_x = rect.x.baseVal.value + rect.width.baseVal.value;
    var link_y = rect.y.baseVal.value + rect.height.baseVal.value /2;

    return {
        x: link_x,
        y: link_y
    };
}

function getLeftConnectionPoint(object)
{
    var rect=object._groups[0][0];

    var link_x = rect.x.baseVal.value;
    var link_y = rect.y.baseVal.value + rect.height.baseVal.value /2;
    
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
function computeLinks()
{
    for (i in connections){
        var connection = connections[i];
        var connectionName = connection.source + '_' + connection.target
        console.log('compute link ' + i + ': ' + connectionName)

        var sourceObject = d3.select('#' + connection.source );
        var source = getRightConnectionPoint(sourceObject);

        var targetObject = d3.select('#' + connection.target );
        var target = getLeftConnectionPoint(targetObject);
        
        connection.x1 = source.x; 
        connection.y1 = source.y; 
        connection.x2 = target.x; 
        connection.y2 = target.y; 
        console.log(connection)
    }

}

computeLinks();

links_container
    .selectAll('.link')
    .data(connections)
    .enter()
    .append('line')
    .attr('x1', d => d.x1)
    .attr('y1', d => d.y1)
    .attr('x2', d => d.x2)
    .attr('y2', d => d.y2)
    .attr('class','link')
    .attr("marker-end", "url(#arrow)");


