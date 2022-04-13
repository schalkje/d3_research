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

    var parent_x = d3.select('#' + layer.layer ).attr(x)
    d3.select('#' + layer.layer )
        .selectAll('.dataset')
        .data(data)
        // .filter(":nth-child(odd)")
        // .filter(function(d){ 
        //     return d.layer == 'Staging';
        // })
        .join("rect")
        // .attr("x", parent_x + 20)
        .attr('y', dataset_height)
        .attr("width", dataset_width)
        .attr("height", dataset_height)
        .attr("class", 'dataset')
        .attr("id", function(d, i) {
            return d.dataset
        })
}

