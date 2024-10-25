import BaseContainerNode from "./nodeBaseContainer.js";
import CircleNode from "./nodeCircle.js";
import RectangularNode from "./nodeRect.js";
import AdapterNode from "./nodeAdapter.js";
import GroupNode from "./nodeGroup.js";
import { getComputedDimensions } from "./utils.js";

export default class LaneNode extends BaseContainerNode {
  constructor(nodeData, parentElement, parentNode = null) {
    super(nodeData, parentElement, parentNode);

    this.nodeSpacing = { horizontal: 20, vertical: 10 };
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
    console.log("    Layout for Lanes:", this.id, this.data.layout);

    // assumption: 1 lane
    this.layoutLane(this.childNodes,`${this.id}-1`)
  }

  layoutLane(children, lineId)
  {
    const x = 0;
    var y = 0;
    // start at the top
    this.childNodes.forEach((node) => {
      const dimensions = getComputedDimensions(node.element);
      node.element.attr("transform", `translate(${x}, ${y})`);

      console.log(`LayoutLane node ${node.id}, moved to (${x}, ${y})`, dimensions)
      y += dimensions.height + this.nodeSpacing.vertical;
    });

    // resize the container
    const boundingBox = getComputedDimensions(this.container);
    // reposition the element
    this.resizeContainer(boundingBox);

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

  async arrange() {
    console.log("Arranging LaneNode:", this.id);
    // this.layoutChildren();

    // ugly way:
    // remove children and recreate
    this.container.selectAll("*").remove();
    this.renderChildren();
    
  }
}



const typeToComponent = {
  group: GroupNode,
  node: RectangularNode,
  rect: RectangularNode,
  circle: CircleNode,
  adapter: AdapterNode,
  default: CircleNode,
};
