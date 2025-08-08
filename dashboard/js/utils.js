// Function to compute the width of a text element
export function getTextWidth(text) //, fontSize, fontFamily) {
{
  // Create a temporary SVG element
  const svg = d3.select("body").append("svg").attr("class", "temp-svg");

  // Append a text element to the SVG
  const textElement = svg.append("text")
      .attr("x", -9999) // Position it off-screen
      .attr("y", -9999)
      // .attr("font-size", fontSize)
      // .attr("font-family", fontFamily)
      .text(text);

  // Get the width of the text element
  const width = textElement.node().getBBox().width;

  // Remove the temporary SVG element
  svg.remove();

  return width;
}

export function computeBoundingBox(nodes, horizontal = false) {
    const padding = 0; // Add some padding
    // console.log('computeBoundingBox nodes', nodes);
  
    let [minX, minY, maxX, maxY] = [Infinity, Infinity, -Infinity, -Infinity];
  
    const updateBounds = (x, y, dimension1, dimension2) => {      
      minX = Math.min(minX, x - dimension1 / 2);
      minY = Math.min(minY, y - dimension2 / 2);
      maxX = Math.max(maxX, x + dimension1 / 2);
      maxY = Math.max(maxY, y + dimension2 / 2);
    };
  
    nodes.forEach((node) => {
      const {
        x = 0,
        y = 0,
        width = 0, 
        height = 0,
      } = node;

  
      // console.log(`        node: ${node.id} = (${Math.round(x)},${Math.round(y)}) --> ${Math.round(width)}, ${Math.round(height)}:      (${Math.round(x - width / 2)},${Math.round(y - height / 2)}),(${Math.round(x + width / 2)},${Math.round(y + height / 2)})`, node);
      if (horizontal) {
        updateBounds(y, x, width, height);
        console.warn('        UNEXPECTED, shouldn\'t hit this line' );
      } else {
        updateBounds(x, y, width, height);
      }
    });

    // console.log(`        computeBoundingBox (${Math.round(minX)},${Math.round(minY)}),(${Math.round(maxX)},${Math.round(maxY)}) --> ${Math.round(maxX-minX)} x ${Math.round(maxY - minY)}`);
  
    return {
      x: minX - padding,
      y: minY - padding,
      width: maxX - minX + 2 * padding,
      height: maxY - minY + 2 * padding,
    };
  }
  
  // Function to get the computed width and height of an element
  export function getComputedDimensions(element) {
    // const rect = element.node().getBoundingClientRect();
    // console.log('getComputedDimensions', rect);
    // console.log('    bbox', element.node().getBBox());
    // console.log('    ctm', element.node().getCTM());
    return element.node().getBBox();
    // return element.node().getBoundingClientRect(); // getBoundingClientRect forces a reflow; getBBox doesn't
  }
  
  // get the bounding box of an element relative to the parent SVG
  export function getRelativeBBox(element) {
    const bbox = element.node().getBBox();
    const ctm = element.node().getCTM();
    return {
      x: ctm.e + bbox.x * ctm.a + bbox.y * ctm.c,
      y: ctm.f + bbox.x * ctm.b + bbox.y * ctm.d,
      width: bbox.width,
      height: bbox.height,
    };
  }


  export function getBoundingBoxRelativeToParent(element, parentElement) {
    // Get the bounding box of the element relative to its immediate parent
    const bbox = element.node().getBBox();

    // Get the transformation matrix of the element
    const elementCTM = element.node().getCTM();

    // Get the transformation matrix of the specified parent element
    const parentCTM = parentElement.node().getCTM();

    // Calculate the relative transformation matrix from element to parent
    const relativeCTM = parentCTM.inverse().multiply(elementCTM);

    // Calculate the bounding box coordinates relative to the specified parent
    const relativeDimensions = {
        x: relativeCTM.e + bbox.x * relativeCTM.a + bbox.y * relativeCTM.c,
        y: relativeCTM.f + bbox.x * relativeCTM.b + bbox.y * relativeCTM.d,
        width: bbox.width,
        height: bbox.height
    };

    return relativeDimensions;
}