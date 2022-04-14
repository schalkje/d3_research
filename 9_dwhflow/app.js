console.log(d3)

let layers = [
    {'layer': 'Application'},
    {'layer': 'Staging'},
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
    {'dataset': 'STG_Matrix', 'layer': 'Staging', 'value': 400}]
 

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
    d3.select('#svg_container')
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
          })

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
    d3.select('#svg_container')
        .selectAll('.dataset')
        .data(data)
        // .filter(":nth-child(odd)")
        .join("rect")
        .filter(function(d,i){ 
            return d.layer == layer.layer;
         })
        // .attr("x", 20)
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
        })
}

