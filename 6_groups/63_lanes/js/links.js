
export function renderLinks(links, container)
{
    const radius = 0;
    const link_separator = 0;

var links_objects = container
    .selectAll('.link')
    .data(links)
    .join("line")
    .attr("x1", function(d) {
        console.log("x1 d",d, d.source, radius, link_separator);
        // console.log("    - alfa",d.target.y,d.source.y,d.target.x,d.source.x);
        // var alfa = Math.atan(Math.abs(d.target.y-d.source.y)/Math.abs(d.target.x-d.source.x));
        var alfa = d.target.x==d.source.x?0.1:Math.atan(Math.abs(d.target.y-d.source.y)/Math.abs(d.target.x-d.source.x));
        // console.log("    - alfa",alfa);
        var dx = Math.cos(alfa) * (radius + link_separator);
        // console.log("    - dx",dx);
        return d.source.x < d.target.x ? d.source.x + dx : d.source.x - dx;
      } )
    //   .attr("x1", 10 )
        .attr("y1", function(d) {
      var alfa = d.target.x==d.source.x?0.1:Math.atan(Math.abs(d.target.y-d.source.y)/Math.abs(d.target.x-d.source.x));
      var dy = Math.sin(alfa) * (radius + link_separator);
      return d.source.y < d.target.y ? d.source.y + dy : d.source.y - dy;
    } )
    .attr("x2", function(d) {
      var alfa = d.target.x==d.source.x?0.1:Math.atan(Math.abs(d.target.y-d.source.y)/Math.abs(d.target.x-d.source.x));
      var dx = Math.cos(alfa) * (radius + link_separator);
      return d.source.x < d.target.x ? d.target.x - dx : d.target.x + dx;
    } )
    .attr('y2', function(d) {
      var alfa = d.target.x==d.source.x?0.1:Math.atan(Math.abs(d.target.y-d.source.y)/Math.abs(d.target.x-d.source.x));
      var dy = Math.sin(alfa) * (radius + link_separator);
      return d.source.y < d.target.y ? d.target.y - dy : d.target.y + dy;
    })
    .attr('marker-end','url(#suit)')
    .attr("class", 'link');


}