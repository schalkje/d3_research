import BaseContainerNode from "./nodeBaseContainer.js";
import CircleNode from "./nodeCircle.js";
import RectangularNode from "./nodeRect.js";
import AdapterNode from "./nodeAdapter.js";
import GroupNode from "./nodeGroup.js";
import { getComputedDimensions } from "./utils.js";
import LaneNode from "./nodeLane.js";

export default class ColumnsNode extends BaseContainerNode {
  constructor(nodeData, parentElement, parentNode = null) {
    super(nodeData, parentElement, parentNode);

    this.nodeSpacing = { horizontal: 20, vertical: 10 };
    this.columns = [];
  }

  async renderChildren() {
    console.log("    Rendering Children for Group:", this.id, this.data.children);
    if (!this.data.children || this.data.children.length === 0) {
      return;
    }

    // Create an array to hold all the render promises
    const renderPromises = [];

    for (const node of this.data.children) {
      // Create the childComponent instance based on node type
      const ComponentClass = typeToComponent[node.type] || typeToComponent.default;
      const childComponent = new ComponentClass(node, this.container, this);

      console.log("Renderichildrenng Child:", childComponent);
      console.log("               :", this.data.x, this.data.y);

      this.childNodes.push(childComponent);
      // Push the render promise into the array
      renderPromises.push(childComponent.render());
    }

    // Wait for all renders to complete in parallel
    await Promise.all(renderPromises);

    this.layoutChildren();

  }

  layoutChildren() {
    console.log("    Layout for Columns:", this.id, this.data.layout);

    // compute the total hight of all children
    let totalHeight = 0;
    let maxWidth = 0;
    this.childNodes.forEach((node) => {
      const dimensions = getComputedDimensions(node.element);
      totalHeight += dimensions.height;
      maxWidth = Math.max(maxWidth, dimensions.width)
      node.dimensions = dimensions;
    });

    // const targetLaneHeight = totalHeight / this.data.layout.numberOfLanes;
    
    var lineId = 1;
    var x = 0;
    var y = 0;
    this.columns[lineId].children = [];
    this.childNodes.forEach(node=>
    {
      this.lineId[lineId].children.push(node)

      node.element.attr("transform", `translate(${x}, ${y})`);

      // y += node.dimension + this.containerMargin.


        
    }
    )

    // optimistic lane division:
    // put children in a lane, until the lane height > total height / numberOfLanes

    // assumption: 1 lane
    // layoutLane(this.childNodes,`${this.id}-1`)
  }

  // layoutLane(children, lineId)
  // {
  //   const x = 0;
  //   const y = 0;
  //   // start at the top
  //   children.foreach((node) => {
  //     node.element.attr("transform", `translate(${x}, ${y})`);

  //     const dimensions = getComputedDimensions(node.element);
  //     y += dimensions.height + this.nodeSpacing.vertical;

  //   });
  // }

  async arrange() {
    console.log("Arranging ColumnsNode:", this.id);
  }
}



const typeToComponent = {
  group: GroupNode,
  node: RectangularNode,
  lane: LaneNode,
  columns: ColumnsNode,
  rect: RectangularNode,
  circle: CircleNode,
  adapter: AdapterNode,
  default: CircleNode,
};
