import BaseNode from "./nodeBase.js";

export default class RectangularNode extends BaseNode {
  constructor(nodeData, metadata, svg) {
    super(nodeData, metadata, svg);
  }

  // Method to render the node using D3
  render() {
    const container = super.renderContainer();

    // Draw the node shape
    container
      .append("rect")
      .attr("class", (d) => `node_shape`)
      .attr("width", (d) => d.width)
      .attr("height", (d) => d.height)
      .attr("rx", 5)
      .attr("ry", 5);

    // Append text for default type
    container
      .append("text")
      .attr("x", (d) => d.width / 2)
      .attr("y", (d) => d.height / 2 + 4)
      .text((d) => d.label)
      .attr("class", "node_label");
  }

  // // override the base class method to get the connection point of a rectangular node
  // getConnectionPoint(source, target) {
  //   let cornerAngles = getRectAngles(source);

  //   let dy = target.y - source.y;
  //   let dx = target.x - source.x;

  //   let angle = Math.atan2(dy,dx);
  //   if (angle < 0) angle += 2*Math.PI;

  //   // based on the quadrant the angle is in, compute the intersection point
  //   let connectionPoint = {
  //     x: 0,
  //     y: 0,
  //   };
  //   if (angle > cornerAngles[0] && angle <= cornerAngles[1]) {
  //     // top, quadrant I
  //     y = source.y - source.height / 2;
  //     x = source.x + (y - source.y) / Math.tan(angle);
  //     // console.log("       top",angle, cornerAngles[0], cornerAngles[1], x,y);
  //   } else if (angle > cornerAngles[1] || angle <= cornerAngles[2]) {
  //     // right, quadrant II
  //     x = source.x + source.width / 2;
  //     y = source.y + (x - source.x) * Math.tan(angle);
  //     // console.log("       right",angle, cornerAngles[1], cornerAngles[2], x,y);
  //   } else if (angle > cornerAngles[2] && angle <= cornerAngles[3]) {
  //     // bottom, quadrant III
  //     y = source.y + source.height / 2;
  //     x = source.x + (y - source.y) / Math.tan(angle);
  //     // console.log("       bottom",angle, cornerAngles[2], cornerAngles[3], x,y);
  //   } else {
  //     // left, quadrant IV
  //     x = source.x - source.width / 2;
  //     y = source.y + (x - source.x) * Math.tan(angle);
  //     // console.log("       left",angle, cornerAngles[3], cornerAngles[0], x,y);
  //   }
  //   return {
  //     x: x,
  //     y: y,
  //   };
  // }
}
