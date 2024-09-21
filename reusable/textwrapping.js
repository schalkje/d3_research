//Text wrapping code adapted from Mike Bostock
const d3_textWrapping = (text, width) => {
    text.each(function() {
      var text = select(this),
        words = text
          .text()
          .split(/\s+/)
          .reverse(),
        word,
        line = [],
        lineNumber = 0,
        lineHeight = 1.2, //ems
        y = text.attr("y"),
        dy = parseFloat(text.attr("dy")) || 0,
        tspan = text
          .text(null)
          .append("tspan")
          .attr("x", 0)
          .attr("dy", dy + "em")
  
      while ((word = words.pop())) {
        line.push(word)
        tspan.text(line.join(" "))
        if (tspan.node().getComputedTextLength() > width && line.length > 1) {
          line.pop()
          tspan.text(line.join(" "))
          line = [word]
          tspan = text
            .append("tspan")
            .attr("x", 0)
            .attr("dy", lineHeight + dy + "em")
            .text(word)
        }
      }
    })
  }