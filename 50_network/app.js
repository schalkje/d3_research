
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

console.log('Initialize container:')
console.log('   Width = ' + width)
console.log('   Height = ' + height)

var container = d3.select('#svg_container')
    .attr("width", width)
    .attr("height", height)
    .attr("class", "container");

var links_container = d3.select('#links')
var nodes_container = d3.select('#nodes')
    
console.log('Force simulation')

var simulation = d3.forceSimulation(datasets)
    .force('link', d3.forceLink()
        .id(d => d.id)
        .links(links)
        .distance(200)
        .strength(0.9)
    )
    .force('charge', d3.forceManyBody())
    .force('center', d3.forceCenter(width/2,height/2))
    .force("collide", d3.forceCollide(10).strength(1).iterations(100))
    .on('tick',ticked);

var tickedCount = 0
var tickedRefreshCount = 1

function ticked() {
    console.log('Ticked');
    tickedCount++;
    if (tickedCount % tickedRefreshCount === 0 )
    {
        console.log('refresh display');
        tickedRefreshCount*=2;
        renderNodes();
    }
}

simulation.on("end", function() {
    console.log("simulation end"); 
    console.log("datasets:"); 
    console.log(datasets);
    console.log("links:"); 
    console.log(links);
    renderAll();
  });


// Initial display render 
// only the nodes, because they will be moving to the right places in the simulation
renderNodes();



function getRightlinkPoint(object)
{    
    var rect=object._groups[0][0];

    var link_x = rect.x.baseVal.value + rect.width.baseVal.value;
    var link_y = rect.y.baseVal.value + rect.height.baseVal.value /2;

    return {
        x: link_x,
        y: link_y
    };
}

function getLeftlinkPoint(object)
{
    var rect=object._groups[0][0];

    var link_x = rect.x.baseVal.value;
    var link_y = rect.y.baseVal.value + rect.height.baseVal.value /2;
    
    return {
        x: link_x,
        y: link_y
    };
}

function getlinkPoint(source, target)
{
    
    // TODO: determine best link point dynamically
    var link_x = source.x + dataset_width /2;
    var link_y = source.y + dataset_height /2;
    
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
    for (i in links){
        var link = links[i];
        var linkName = link.source.id + '_' + link.target.id
        console.log('compute link ' + i + ': ' + linkName)

        // var sourceObject = d3.select('#' + link.source.id );
        // var source = getlinkPoint(sourceObject,targetObject);

        // var targetObject = d3.select('#' + link.target.id );
        // var target = getlinkPoint(targetObject,sourceObject);

        var source = getlinkPoint(link.source,link.target);
        var target = getlinkPoint(link.target,link.source);
        
        link.x1 = source.x; 
        link.y1 = source.y; 
        link.x2 = target.x; 
        link.y2 = target.y; 
        console.log(link)
    }

}

function renderNodes() {
    nodes_container
    .selectAll('.dataset')
    .data(datasets)
    .join("rect")
    .attr("x", function(d) {
        return d.x;
      })
    .attr('y', function(d) {
        return d.y;
      })
    .attr("width", dataset_width)
    .attr("height", dataset_height)
    .attr("class", 'dataset')
    .attr("id", function(d, i) {
        return d.id
    });

    nodes_container
    .selectAll('.datasetlabel')
    .data(datasets)
    .join("text")
    .attr("x", function(d, i) {
        return d.x + dataset_width/ 2;
      })
    .attr('y', function(d, i) {
        return 5 + d.y + dataset_height / 2;
      })
    .text((d) => d.dataset)
    .attr("class", 'datasetlabel');
}

function renderLinks() {
    computeLinks();

    container
        .selectAll('.link')
        .data(links)
        .enter()
        .append('line')
        .attr('x1', d => d.x1)
        .attr('y1', d => d.y1)
        .attr('x2', d => d.x2)
        .attr('y2', d => d.y2)
        // .attr('id',d => d.source + '_' + d.target)
        .attr('class','link')
        .attr("marker-end", "url(#arrow)");
}

function renderAll() {
    renderNodes();
    renderLinks();
}