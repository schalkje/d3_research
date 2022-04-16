
console.log(d3)

let layers = [
    {'id': 'id1', 'layer': 'Application'},
    {'id': 'id2', 'layer': 'Staging'},
    // {'layer': 'StagingArchive'},
    // {'layer': 'Transform'},
    // {'layer': 'DWH'},
    // {'layer': 'DM'},
    // {'layer': 'RAW'}
]

let data = [
    {'dataset': 'Bankview', 'layer': 'Application', 'value': 100},
    {'dataset': 'Fidor', 'layer': 'Application', 'value': 100},
    {'dataset': 'Matrix', 'layer': 'Application', 'value': 500},
    {'dataset': 'BGS', 'layer': 'Application', 'value': 500},

    {'dataset': 'STG_Bankview', 'layer': 'Staging', 'value': 200},
    {'dataset': 'STG_Fidor', 'layer': 'Staging', 'value': 300},
    {'dataset': 'STG_Matrix', 'layer': 'Staging', 'value': 400}
]
 

let connections = [
    {source:'Bankview',target:'STG_Bankview'},
    {source:'Fidor',target:'STG_Fidor'},
    {source:'Matrix',target:'STG_Matrix'},
    {source:'BGS',target:'STG_Matrix'}
]


// const xScale = d3.scaleBand().domain(layers.map((datapoint) => datapoint.layer)).rangeRound([0, 1500]).padding(0,1);
// const yScale = d3.scaleLinear.domain([0,15]).range([600,0]);

d3.select('#data_container')
    .selectAll('p')
    .data(data)
    .join('p')
    .text(d => d.layer + '.' + d.dataset);

// create visualisation
var container_width = 200;
var container_separator = 10;

var container = d3.select('#svg_container')
    .attr("width", 1500)
    .attr("height", 600);

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
            return d.layer
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
        .attr("y", 12)
        .text(d => d.layer)
        .attr("class", 'lanelabel');



        
// create datasets
var dataset_width = 160;
var dataset_height = 40;
var dataset_separator = 10;
// var layer;
for (i in layers){
    var layer = layers[i];

    var layer_object = d3.select('#' + layer.layer );
    var parent_x = parseInt(layer_object.attr('x')); // need to explicitly convert to int; otherwise js thinks it's a string
    var parent_y = parseInt(layer_object.attr('y'));

    console.log(layer.layer)
    console.log(parent_x)
    console.log(parent_y)

    container
        .selectAll('.dataset')
        .data(data)
        .join("rect")
        .filter(function(d,i){ 
            return d.layer == layer.layer;
         })
        .attr("x", function(d, i) {
            return 20 + parent_x;
          })
        .attr('y', function(d, i) {
            return parent_y + dataset_separator+ i * (dataset_height+dataset_separator); // + parent_x;
          })
        .attr("width", dataset_width)
        .attr("height", dataset_height)
        .attr("class", 'dataset')
        .attr("id", function(d, i) {
            return d.dataset
        });

    container
        .selectAll('.datasetlabel')
        .data(data)
        .join("text")
        .filter(function(d,i){ 
            return d.layer == layer.layer;
         })
        .attr("x", function(d, i) {
            return 20 + parent_x + dataset_width/ 2;
          })
        .attr('y', function(d, i) {
            return 5 + parent_y + dataset_separator + dataset_height / 2 + i * (dataset_height+dataset_separator); // + parent_x;
          })
        .text((d) => d.dataset)
        .attr("class", 'datasetlabel');
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
        var sourceObject = d3.select('#' + connection.source );
        var source = getRightConnectionPoint(sourceObject);

        var targetObject = d3.select('#' + connection.target );
        var target = getLeftConnectionPoint(targetObject);
        
        connection.x1 = source.x; 
        connection.y1 = source.y; 
        connection.x2 = target.x; 
        connection.y2 = target.y; 
        console.log('draw link ' + i + ': ' + connectionName)
        console.log(connection)
    }

}

computeLinks();

    container
        .selectAll('.link')
        .data(connections)
        .enter()
        .append('line')
        .attr('x1', d => d.x1)
        .attr('y1', d => d.y1)
        .attr('x2', d => d.x2)
        .attr('y2', d => d.y2)
        // .attr('id',d => d.source + '_' + d.target)
        .attr('class','link')
        .attr("marker-end", "url(#arrow)");


