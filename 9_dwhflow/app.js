// console.log(d3)

d3.select('.d3_fruit').selectAll("p").style("color", "red");

d3.select('.d3_fruit')
    .selectAll('p')
    .data([1,2,3])
    .text(d => 'replace existing: ' + d)
    .enter
    .append('div')
    .text('bla');
    // .exit()
    // .remove();



// let fruits = ['Apple', 'Orange', 'Mango']

// d3.select(".d3_fruit")
//     .selectAll("p")
//     .data(fruits)
//     .enter
//     .append('p')
//     .text(data => data);





// // const container = 
// var container = d3.selectAll("svg")
// .selectAll()
// .style("fill","green")
// .style("border","black")
// .attr("width",600)
//     .attr("Height",300);

// //Create and append rectangle element
// container.append("rect")
// .attr("x", 20)
// .attr("y", 20)
// .attr("width", 200)
// .attr("height", 600)
// .attr("class", "lane lane1");

// d3.selectAll("div")
// .style("color","blue")
// .style("width","600px")
// .style("height","200px");