import BaseNode from "./nodeBase.js";

export default class RectangularNode extends BaseNode {
  constructor(nodeData, parentElement, settings, parentNode = null) {
    if ( !nodeData.height) nodeData.height = 20;
    if ( !nodeData.width) nodeData.width = 150;

    super(nodeData, parentElement, settings, parentNode);
  }

  // Method to render the node using D3
  init(parentElement = null) {
    if (parentElement) this.parentElement = parentElement;
    // console.log("  nodeRect - init:", this.data.label, this.parentElement);
    super.init(parentElement);
    // console.log("Rendering Rectangular Node:", this.id);

    this.draw();
  }

  draw() {
        // Draw the node shape
        this.shape = this.element
        .append("rect")
        .attr("class", `node shape`)
        .attr("width", this.data.width)
        .attr("height", this.data.height)
        .attr("status", this.status)
        .attr('x', -this.data.width / 2)
        .attr('y', -this.data.height / 2)
        .attr("rx", 5)
        .attr("ry", 5);
  
      // Append text for default type
      this.element
        .append("text")
        .attr("class", "node label")
        .attr("x", 0)
        .attr("y", 0)
        .text(this.data.label);
  
  }

  redrawText(label, width) {
    this.element
      .select("rect")
      .attr("width", width)
      .attr('x', -width / 2)


      this.element
      .select("text")
      .text(label);
  }


  get status() {
    return super.status;
  }
  
  set status(value) {
    super.status = value;
    this.shape.attr("status", value);
  }

  resize(size, forced = false) {
    // console.log("  nodeRect - size", this.data.label, size);
    // const oldSize = {width: this.data.width, height: this.data.height};

    super.resize(size, forced);

    this.element
      .select("rect")
      .attr("width", this.data.width)
      .attr("height", this.data.height)
      .attr("x", -this.data.width / 2)
      .attr("y", -this.data.height / 2);

    // reposition the label based on the new size
    this.element
      .select("text")
      .attr("x", 0)
      .attr("y", 0);
      // .attr("x", this.data.width / 2 - oldSize.width / 2)
      // .attr("y", this.data.height / 2 - oldSize.height / 2);
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
