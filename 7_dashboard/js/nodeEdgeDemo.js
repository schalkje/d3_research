// import BaseNode from "./nodeBase.js";
import BaseContainerNode from "./nodeBaseContainer.js";
import RectangularNode from "./nodeRect.js";
import { createInternalEdge } from "./edge.js";
import { getComputedDimensions } from "./utils.js";

const DemoMode = Object.freeze({
  GRID: "grid",
  HSHIFTED: "h-shifted",
  VSHIFTED: "v-shifted",
  VSHIFTED2: "v-shifted2",
  STAIR_UP: "stair-up",
  STAIR_DOWN: "stair-down",
});

export default class EdgeDemoNode extends BaseContainerNode {
  constructor(nodeData, parentElement, createNode, settings, parentNode = null) {
    if (!nodeData.width) nodeData.width = 334;
    if (!nodeData.height) nodeData.height = 74;


    super(nodeData, parentElement, createNode, settings, parentNode);
    
    this.layout = this.data.layout || DemoMode.GRID;
    this.shiftRatio = this.data.shiftRatio || 0.6;
    this.shift2Ratio = this.data.shift2Ratio || 0.8;

    this.nodeSpacing = nodeData.nodeSpacing || { horizontal: 30, vertical: 20 };
  }

  async renderChildren() {
    // console.log("    Rendering Children for Adapter:", this.id, this.data.children);
    if (!this.data.children || this.data.children.length === 0) {
      this.data.children = [];
    }

    // render "center" node
    this.centerNode = this.createChild(null, "center", 0, 0);
    // let centerChild = {
    //     id: `center_${this.data.id}`,
    //     label: `Source`,
    //     category: "center",
    //     type: "node",
    // };
    // this.data.children.push(centerChild);

    // if (centerChild) {
    //   this.centerNode = new RectangularNode(centerChild, this.container, this.settings, this);
    //   this.centerNode.render();
    // }

    // grid layout
    switch (this.data.layout) {
      case DemoMode.GRID:
        this.gridLayout();
        break;
      case DemoMode.HSHIFTED:
        this.hshiftedLayout();
        break;
      case DemoMode.VSHIFTED:
        this.vshiftedLayout();
        break;
      case DemoMode.VSHIFTED2:
        this.vshifted2Layout();
        break;
        case DemoMode.STAIR_UP:
          this.stairUpLayout();
          break;
          case DemoMode.STAIR_DOWN:
            this.stairDownLayout();
            break;
      }

    // resize to contain all children
    this.resizeToFitChildren();

    this.renderEdges();
    this.layoutEdges();
  }

  gridLayout()
  {
    this.createChild(this.centerNode, "top", 0, -this.centerNode.data.height - this.nodeSpacing.vertical);
    this.createChild(
      this.centerNode,
      "top-right",
      this.centerNode.data.width + this.nodeSpacing.horizontal,
      -this.centerNode.data.height - this.nodeSpacing.vertical
    );
    this.createChild(this.centerNode, "right", this.centerNode.data.width + this.nodeSpacing.horizontal, 0);
    this.createChild(
      this.centerNode,
      "bottom-right",
      this.centerNode.data.width + this.nodeSpacing.horizontal,
      this.centerNode.data.height + this.nodeSpacing.vertical
    );
    this.createChild(this.centerNode, "bottom", 0, this.centerNode.data.height + this.nodeSpacing.vertical);
    this.createChild(
      this.centerNode,
      "bottom-left",
      -this.centerNode.data.width - this.nodeSpacing.horizontal,
      this.centerNode.data.height + this.nodeSpacing.vertical
    );
    this.createChild(this.centerNode, "left", -this.centerNode.data.width - this.nodeSpacing.horizontal, 0);
    this.createChild(
      this.centerNode,
      "top-left",
      -this.centerNode.data.width - this.nodeSpacing.horizontal,
      -this.centerNode.data.height - this.nodeSpacing.vertical
    );
  }
  
  hshiftedLayout() 
  {
    this.createChild(
      this.centerNode,
      "top-right",
      this.centerNode.data.width + this.nodeSpacing.horizontal,
      -this.centerNode.data.height * this.shiftRatio
    );
    this.createChild(
      this.centerNode,
      "bottom-right",
      this.centerNode.data.width + this.nodeSpacing.horizontal,
      this.centerNode.data.height * this.shiftRatio
    );

    this.createChild(
      this.centerNode,
      "top-left",
      -this.centerNode.data.width - this.nodeSpacing.horizontal,
      -this.centerNode.data.height * this.shiftRatio
    );
    this.createChild(
      this.centerNode,
      "bottom-left",
      -this.centerNode.data.width - this.nodeSpacing.horizontal,
      this.centerNode.data.height * this.shiftRatio
      // this.centerNode.data.height * 0 + this.nodeSpacing.vertical
    );
  }

  vshiftedLayout() 
  {
    this.createChild(
      this.centerNode,
      "top-left",
      -this.centerNode.data.width * this.shiftRatio,
      -this.centerNode.data.height - this.nodeSpacing.vertical
    );
    this.createChild(
      this.centerNode,
      "top-right",
      this.centerNode.data.width * this.shiftRatio,
      -this.centerNode.data.height - this.nodeSpacing.vertical
    );

    this.createChild(
      this.centerNode,
      "bottom-left",
      -this.centerNode.data.width * this.shiftRatio,
      this.centerNode.data.height + this.nodeSpacing.vertical
    );
    this.createChild(
      this.centerNode,
      "bottom-right",
      this.centerNode.data.width * this.shiftRatio,
      this.centerNode.data.height + this.nodeSpacing.vertical
    );
  }


  vshifted2Layout() 
  {
    this.createChild(
      this.centerNode,
      "top-left",
      -this.centerNode.data.width * this.shift2Ratio,
      -this.centerNode.data.height - this.nodeSpacing.vertical
    );
    this.createChild(
      this.centerNode,
      "top-right",
      this.centerNode.data.width * this.shift2Ratio,
      -this.centerNode.data.height - this.nodeSpacing.vertical
    );

    this.createChild(
      this.centerNode,
      "bottom-left",
      -this.centerNode.data.width * this.shift2Ratio,
      this.centerNode.data.height + this.nodeSpacing.vertical
    );
    this.createChild(
      this.centerNode,
      "bottom-right",
      this.centerNode.data.width * this.shift2Ratio,
      this.centerNode.data.height + this.nodeSpacing.vertical
    );
  }

  
  stairUpLayout() 
  {
    this.createChild(
      this.centerNode,
      "bottom-left",
      -this.centerNode.data.width * (1-this.shiftRatio),
      this.centerNode.data.height + this.nodeSpacing.vertical
    );
    this.createChild(
      this.centerNode,
      "top-right",
      this.centerNode.data.width * (1-this.shiftRatio),
      -this.centerNode.data.height - this.nodeSpacing.vertical
    );
  }
  
  stairDownLayout() 
  {
    this.createChild(
      this.centerNode,
      "top-left",
      -this.centerNode.data.width * (1-this.shiftRatio),
      -this.centerNode.data.height - this.nodeSpacing.vertical
    );
    this.createChild(
      this.centerNode,
      "bottom-right",
      this.centerNode.data.width * (1-this.shiftRatio),
      this.centerNode.data.height + this.nodeSpacing.vertical
    );
  }

  resizeToFitChildren() {
    const containerDimensions = getComputedDimensions(this.container);
    console.log("    Resize to fit children:", containerDimensions);
    containerDimensions.width += this.containerMargin.left + this.containerMargin.right;
    containerDimensions.height += this.containerMargin.top + this.containerMargin.bottom;
    this.resize(containerDimensions);
  }

  createChild(sourceNode, id, x, y) {
    let child = {
      id: `child_${id}`,
      label: `${id}`,
      category: "child",
      type: "node",
    };
    this.data.children.push(child);

    let childNode = new RectangularNode(child, this.container, this.settings, this);
    childNode.render();
    // childNode.move(x + this.containerMargin.left / 2, y + this.containerMargin.top / 2);
    childNode.move(
      x + (this.containerMargin.left - this.containerMargin.right) / 2,
      y + (this.containerMargin.top - this.containerMargin.bottom) / 2
    );
    // childNode.move(x, y);

    console.log(">>>> Created Child:", this.centerNode);
    // create edge
    if (sourceNode) {
      createInternalEdge(
        {
          source: sourceNode.data,
          target: child,
          isActive: true,
          type: "SSIS",
          state: "Ready",
        },
        sourceNode,
        childNode,
        this.settings
      );
    }

    return childNode;
  }

  layoutChildren() {
    // console.log("    Layout for Adapter:", this.id, this.data.layout);
    // switch (this.data.layout.arrangement) {
    //   case 1:
    //     this.layout1();
    //     break;
    //   case 2:
    //     this.layout2();
    //     break;
    //   case 3:
    //     this.layout3();
    //     break;
    // }
  }
}
