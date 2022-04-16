
console.log(d3)

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

// let datasets = [
//     {'id': 'app_bnv'},
//     {'id': 'app_fid'},
//     {'id': 'app_mtx'},
//     {'id': 'app_bgs'},
//     {'id': 'stg_bnv'},
//     {'id': 'stg_fid'},
//     {'id': 'stg_mtx'},
//     {'id': 'arc_bnv'},
//     {'id': 'arc_fid'},
//     {'id': 'arc_mtx'},
//     {'id': 'trn_bnv'},
//     {'id': 'trn_fid'},
//     {'id': 'trn_mtx'},
//     {'id': 'dwh_ods'},
// ]

let datasets = [
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

    // {'id': 'dwh_dwh', 'dataset': 'DWH', 'layer': 'dwh', 'value': 400},

    // {'id': 'raw_dwh', 'dataset': 'DWH', 'layer': 'raw', 'value': 400},
    // {'id': 'raw_arc_bnv', 'dataset': 'STG_Archive_Bankview', 'layer': 'raw', 'value': 200},
    // {'id': 'raw_arc_fid', 'dataset': 'STG_Archive_Fidor', 'layer': 'raw', 'value': 300},
    // {'id': 'raw_arc_mtx', 'dataset': 'STG_Archive_Matrix', 'layer': 'raw', 'value': 400},
    // {'id': 'raw_bnv', 'dataset': 'Bankview', 'layer': 'raw', 'value': 200},
    // {'id': 'raw_mtx', 'dataset': 'Matrix', 'layer': 'raw', 'value': 200},

    // {'id': 'base_dwh', 'dataset': 'DWH', 'layer': 'base', 'value': 400},
    // {'id': 'base_arc_bnv', 'dataset': 'STG_Archive_Bankview', 'layer': 'base', 'value': 200},
    // {'id': 'base_arc_fid', 'dataset': 'STG_Archive_Fidor', 'layer': 'base', 'value': 300},
    // {'id': 'base_arc_mtx', 'dataset': 'STG_Archive_Matrix', 'layer': 'base', 'value': 400},
    // {'id': 'base_bnv', 'dataset': 'Bankview', 'layer': 'base', 'value': 200},
    // {'id': 'base_mtx', 'dataset': 'Matrix', 'layer': 'base', 'value': 200},
]
 
let links = [
    {'source': 0, 'target': 4},
    {'source': 1, 'target': 5},
    {'source': 2, 'target': 6},
    {'source': 3, 'target': 6},

    {'source': 4, 'target': 7},
    {'source': 5, 'target': 8},
    {'source': 6, 'target': 9},

    {'source': 4, 'target': 10},
    {'source': 5, 'target': 11},
    {'source': 6, 'target': 12},

    {'source': 10, 'target': 13},
    {'source': 11, 'target': 13},
    {'source': 12, 'target': 13},
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

    // {'source': 'dwh_ods', 'target': 'dwh_dwh'},

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

// var color = d3.scale.category10();

// const xScale = d3.scaleBand().domain(layers.map((datapoint) => datapoint.layer)).rangeRound([0, 1500]).padding(0,1);
// const yScale = d3.scaleLinear.domain([0,15]).range([600,0]);

d3.select('#data_container')
    .selectAll('p')
    .data(datasets)
    .join('p')
    .text(d => d.layer + '.' + d.dataset);

// create visualisation
var container_width = 200;
var container_separator = 10;

var dataset_width = 160;
var dataset_height = 40;

var width = 1700;
var height = 600;

var container = d3.select('#svg_container')
    .attr("width", width)
    .attr("height", height);

var nodes = container
    .selectAll('.dataset')
    .data(datasets)
    .join("rect")
    .attr("x", function(d) {
        return d.x;
      })
    .attr('y', function(d) {
        return d.layer;
      })
    .attr("width", dataset_width)
    .attr("height", dataset_height)
    .attr("class", 'dataset')
    .attr("id", function(d, i) {
        return d.id
    });

var simulation = d3.forceSimulation(datasets)
    .force('link', d3.forceLink()
        .id(d => d.id)
        .links(links)
        .distance(100)
        .strength(0.9)
    )
    .force('charge', d3.forceManyBody())
    .force('center', d3.forceCenter(width/2,height,2))
    .on('tick',ticked);

// function ticked() {
//     var u = d3.select('svg')
//         .selectAll('circle')
//         .data(datasets)
//         .join('circle')
//         .attr('r', 5)
//         .attr('cx', function(d) {
//         return d.x
//         })
//         .attr('cy', function(d) {
//         return d.y
//         });
//     }

function ticked() {
    var u = container
        .selectAll('.dataset')
        .data(datasets)
        .join("rect")
        .attr("x", function(d) {
            return d.x;
          })
        .attr('y', function(d) {
            return d.layer;
          })
        .attr("width", dataset_width)
        .attr("height", dataset_height)
        .attr("class", 'dataset')
        .attr("id", function(d, i) {
            return d.id
        });
    }

// var force = d3.layout.force()
//     .charge(-180)
//     .linkDistance(70)
//     .size([width, height]);



// force
//     .nodes(data)
//     .links(connections)
//     .start();

