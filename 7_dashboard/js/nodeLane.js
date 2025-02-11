import BaseContainerNode from "./nodeBaseContainer.js";
import { getComputedDimensions } from "./utils.js";

export default class LaneNode extends BaseContainerNode {
  constructor(nodeData, parentElement, createNode, settings, parentNode = null) {
    console.log("LaneNode constructor", nodeData);
    super(nodeData, parentElement, createNode, settings, parentNode);
  }


  updateChildren() {
    // console.log(
    //   `      nodeLane - updateChildren - Layout for Columns: ${this.id}, ${Math.round(this.data.width)}x${Math.round(
    //     this.data.height
    //   )}`,
    //   this.data.layout,
    //   this.childNodes.length
    // );
    this.layoutLane();
  }

  layoutLane() {
    const x = 0;
    var y = 0;

    var containerDimensions = getComputedDimensions(this.container);
    // console.log(
    //   `          < layoutLane before - containerDimensions ${this.id}, (${Math.round(
    //     containerDimensions.x
    //   )},${Math.round(containerDimensions.y)}) [${Math.round(containerDimensions.width)}x${Math.round(
    //     containerDimensions.height
    //   )}] data=[${Math.round(this.data.width)}x${Math.round(this.data.height)}]`
    // );

    var previousContainerHeight = containerDimensions.height;
    var containerHeightShift = 0;
    var containerWidth = 0;
    var containerHeight = 0;

    // // start at the top
    // this.childNodes.forEach((node) => {
    //   node.element.attr("transform", `translate(${0}, ${0})`);
    //   var containerDimensions = getComputedDimensions(this.container);
    //   containerHeightShift = containerDimensions.height - previousContainerHeight;
    //   console.log(`          > RESET containerDimensions ${this.id}, (x:${containerDimensions.x},y:${containerDimensions.y}) (width:${containerDimensions.width},height:${containerDimensions.height}), containerHeightShift=${containerHeightShift}`);
    // });

    this.childNodes.forEach((node) => {
      // console.log(`    LayoutLane node ${node.id}`);

      if (containerHeight > 0) containerHeight += this.nodeSpacing.vertical + node.data.height;
      else containerHeight += node.data.height;

      y += node.data.height / 2;

      node.move(x, y);

      y += node.data.height / 2 + this.nodeSpacing.vertical;

      containerWidth = Math.max(containerWidth, node.data.width);
    });

    // console.log(
    //   `          < layoutLane resizeContainer ${this.id}, (${Math.round(containerWidth)},${Math.round(
    //     containerHeight
    //   )})`
    // );
    this.resizeContainer({ width: containerWidth, height: containerHeight });

    // console.log(`finished layout out "${this.id}"`);
    // resize the container
    var containerDimensions = getComputedDimensions(this.container);
    // console.log(
    //   `          < layoutLane before - resizecontainer ${this.id}, (${Math.round(containerDimensions.x)},${Math.round(
    //     containerDimensions.y
    //   )}) [${Math.round(containerDimensions.width)}x${Math.round(containerDimensions.height)}] data=[${Math.round(
    //     this.data.width
    //   )}x${Math.round(this.data.height)}]`
    // );
    var ctm = this.container.node().getCTM();
    // console.log(`    ctm before resize: a=${ctm.a}, b=${ctm.b}, c=${ctm.c}, d=${ctm.d}, e=${ctm.e}, f=${ctm.f}`);
    // reposition the element
    // containerDimensions.height=containerHeight; // override the height
    // this.resizeContainer(containerDimensions);
    this.resizeContainer({ width: containerWidth, height: containerHeight });
    var containerDimensions = getComputedDimensions(this.container);
    // console.log(
    //   `          < layoutLane after  - resizecontainer container ${this.id}, (${Math.round(
    //     containerDimensions.x
    //   )},${Math.round(containerDimensions.y)}) [${Math.round(containerDimensions.width)}x${Math.round(
    //     containerDimensions.height
    //   )}] data=[${Math.round(this.data.width)}x${Math.round(this.data.height)}]`
    // );
    var elementDimensions = getComputedDimensions(this.element);
    // console.log(
    //   `          < layoutLane after  - resizecontainer element   ${this.id}, (${Math.round(
    //     elementDimensions.x
    //   )},${Math.round(elementDimensions.y)}) [${Math.round(elementDimensions.width)}x${Math.round(
    //     elementDimensions.height
    //   )}] data=[${Math.round(this.data.width)}x${Math.round(this.data.height)}]`
    // );
    var containerCtm = this.container.node().getCTM();
    // console.log(
    //   `    containerCtm after  resize: a=${containerCtm.a}, b=${containerCtm.b}, c=${containerCtm.c}, d=${containerCtm.d}, e=${containerCtm.e}, f=${containerCtm.f}`
    // );
    var elementCtm = this.element.node().getCTM();
    // console.log(
    //   `    elementCtm after resize   : a=${elementCtm.a}, b=${elementCtm.b}, c=${elementCtm.c}, d=${elementCtm.d}, e=${elementCtm.e}, f=${elementCtm.f}`
    // );

    // const containerX = (elementDimensions.x + this.containerMargin.left) - containerDimensions.x;
    // const containerY = (elementDimensions.y + this.containerMargin.top) - containerDimensions.y;
    // const containerX = (elementDimensions.x + this.containerMargin.left) - containerDimensions.x;
    const containerX = 0;
    // var containerY = (elementCtm.f + elementDimensions.y + this.containerMargin.top ) - (containerCtm.f+ containerDimensions.y);
    // if (containerY != -74) containerY= -46;
    // var containerY = -(containerDimensions.height) /2;
    var containerY = -(containerHeight - this.containerMargin.top / 2) / 2;
    // var containerY = -(containerDimensions.height - this.containerMargin.top/2) /2;
    // const containerX = (elementDimensions.x) - containerDimensions.x;
    // const containerY = (elementDimensions.y) - containerDimensions.y;
    // console.log(
    //   `                                        containerX: ${elementDimensions.x}-${containerDimensions.x}+${this.containerMargin.left}=${containerX}`
    // );
    // console.log(
    //   `                                        containerY: ${elementDimensions.y}-${containerDimensions.y}+${this.containerMargin.top}=${containerY}`
    // );
    this.container.attr("transform", `translate(${containerX}, ${containerY})`);
    // this.container
    //   .attr("transform", `translate(
    //     ${this.containerMargin.left},
    //    ${this.containerMargin.top})`
    //   );
    // this.container
    //   .attr("transform", `translate(
    //     ${elementDimensions.x + this.containerMargin.left},
    //    ${elementDimensions.y + this.containerMargin.top})`
    //   );
    var containerDimensions = getComputedDimensions(this.container);
    // console.log(
    //   `          < layoutLane after move - resizecontainer container ${this.id}, (${Math.round(
    //     containerDimensions.x
    //   )},${Math.round(containerDimensions.y)}) [${Math.round(containerDimensions.width)}x${Math.round(
    //     containerDimensions.height
    //   )}] data=[${Math.round(this.data.width)}x${Math.round(this.data.height)}]`
    // );
    var elementDimensions = getComputedDimensions(this.element);
    // console.log(
    //   `          < layoutLane after move - resizecontainer element   ${this.id}, (${Math.round(
    //     elementDimensions.x
    //   )},${Math.round(elementDimensions.y)}) [${Math.round(elementDimensions.width)}x${Math.round(
    //     elementDimensions.height
    //   )}] data=[${Math.round(this.data.width)}x${Math.round(this.data.height)}]`
    // );
    var containerCtm = this.container.node().getCTM();
    // console.log(
    //   `    containerCtm after  resize: a=${containerCtm.a}, b=${containerCtm.b}, c=${containerCtm.c}, d=${containerCtm.d}, e=${containerCtm.e}, f=${containerCtm.f}`
    // );
    var elementCtm = this.element.node().getCTM();
    // console.log(
    //   `    elementCtm after resize   : a=${elementCtm.a}, b=${elementCtm.b}, c=${elementCtm.c}, d=${elementCtm.d}, e=${elementCtm.e}, f=${elementCtm.f}`
    // );

    // this.container
    //   .attr("transform", `translate(
    //     ${-boundingBox.width/2},
    //     ${-boundingBox.height/2})`
    //   );
    // this.element
    //   .attr("transform", `translate(${100}, ${0})`);
    // ${-this.containerMargin.left - boundingBox.width/2},
    // ${-this.containerMargin.top - boundingBox.height/2})`
  }

  arrange() {
    console.log("Arranging LaneNode:", this.id);
    this.updateChildren();
  }
}