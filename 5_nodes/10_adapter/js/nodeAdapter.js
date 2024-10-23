import BaseNode from "./nodeBase.js";
import RectangularNode from "./nodeRect.js";
import { getComputedDimensions } from "./utils.js";
import { renderLinks } from "./links.js";

export default class AdapterNode extends BaseNode {
  constructor(nodeData, parentElement, parentNode = null) {
    if (!nodeData.width) nodeData.width = 334;
    if (!nodeData.height) nodeData.height = 74;
    if (!nodeData.layout) nodeData.layout = 1;

    super(nodeData, parentElement, parentNode);
    this.container = null;
    this.containerMargin = { top: 18, right: 8, bottom: 8, left: 8 };
    this.stagingNode = null;
    this.transformNode = null;
    this.archiveNode = null;
    this.nodeSpacing = {horizontal: 20, vertical: 10};
  }

  // Method to render the parent node and its children
  async render() {
    console.log("Rendering Adapter Node:", this.id);
    super.renderContainer();

    // A group/parent node consists of it's own display, a border, background and a label
    // and a container where the node is rendered

      // Append text to the top left corner of the element    
      const labelElement = this.element
      .append("text")
      .attr("x", -this.data.width / 2 + 4)
      .attr("y", -this.data.height / 2 + 4)
      .text(this.data.label)
      .attr("class", "node label parent")
      .on("click", (event) => {
        event.stopPropagation();
        this.toggleExpandCollapse(this.element);
      })

    this.minimumSize = getComputedDimensions(labelElement);
    this.minimumSize.width += 8;
    this.minimumSize.height += 4;
    if (this.data.width < this.minimumSize.width || this.data.height < this.minimumSize.height) 
    {
      this.data.width = Math.max(this.minimumSize.width,this.data.width);
      this.data.height = Math.max(this.minimumSize.height,this.data.height);
      // reposition the label based on the new size
      labelElement
        .attr("x", -this.data.width / 2 + 4)
        .attr("y", -this.data.height / 2 + 4);
    }
  

    // Draw the node shape
    this.element
      .append("rect")
      .attr("class", (d) => `node shape adapter`)
      .attr("width", this.data.width)
      .attr("height", this.data.height)
      .attr("x", -this.data.width / 2)
      .attr("y", -this.data.height / 2)
      .attr("rx", 5)
      .attr("ry", 5);

    if (this.data.interactionState.expanded) {
      this.element.classed("expanded", true);
      this.renderExpanded();
    } else {
      this.element.classed("collapsed", true);
      this.renderCollapsed();
    }
  }

  resize(boundingBox) {
    boundingBox.x -= this.containerMargin.left;
    boundingBox.y -= this.containerMargin.top;
    boundingBox.width += this.containerMargin.left + this.containerMargin.right;
    boundingBox.height += this.containerMargin.top + this.containerMargin.bottom;

    // make sure it doesn't go below minimum size
    boundingBox.width = Math.max(boundingBox.width, this.minimumSize.width);
    boundingBox.height = Math.max(boundingBox.height, this.minimumSize.height);

    super.resize(boundingBox);

    this.element
      .select("rect")
      .attr("width", this.data.width)
      .attr("height", this.data.height);
      // .attr("x", this.data.x)
      // .attr("y", this.data.y + this.containerMargin.top);

    this.element
      .select("text")
      .attr("x", this.data.x+4)
      .attr("y", this.data.y + this.containerMargin.top+4);

    const containerWidth = this.data.width - this.containerMargin.left - this.containerMargin.right;
    const containerHeight = this.data.height - this.containerMargin.top - this.containerMargin.bottom;
    this.container
      .attr("width", containerWidth)
      .attr("height", containerHeight)
      .attr("transform", `translate(0, ${this.containerMargin.top})`);
  }

  async renderExpanded() {
    // restore the expanded size if it was stored
    if (this.data.expandedSize) {
      this.data.height = this.data.expandedSize.height;
      this.data.width = this.data.expandedSize.width;
      console.log(`    Rendering Children for Parent: expanded=${this.data.expandedSize.width}x${this.data.expandedSize.height}, size=expanded=${this.data.width}x${this.data.height}`);
    }

    this.element.select("rect")
      .attr("width", this.data.width)
      .attr("height", this.data.height);


    const containerWidth = this.data.width - this.containerMargin.left - this.containerMargin.right;
    const containerHeight = this.data.height - this.containerMargin.top - this.containerMargin.bottom;
    this.container = this.element
      .append("g")
      .attr("class", (d) => `node container adapter`)
      .attr("width", containerWidth)
      .attr("height", containerHeight)
      .attr("x", -containerWidth / 2 + this.containerMargin.left)
      .attr("y", -containerHeight / 2); // + this.containerMargin.top);
      console.log("    Container:", this.data.x, this.data.y, containerWidth, containerHeight);
      // .attr("x", -containerWidth / 2 + this.containerMargin.left)
      // .attr("y", -containerHeight / 2); // + this.containerMargin.top);

    // Set expanded or collapsed state
    await this.renderChildren(this.container);
  }

  async renderCollapsed() {
    // store the expanded size before collapsing
    if (this.data.height > this.minimumSize.height || this.data.width > this.minimumSize.width )
      this.data.expandedSize = {height: this.data.height, width: this.data.width};

    // set the collapsed size
    this.data.height = this.minimumSize.height;
    this.data.width = this.minimumSize.width;

    // apply the collapsed size to the rectangle
    this.element.select("rect")
      .attr("width", this.data.width)
      .attr("height", this.data.height);
  }

  // Method to toggle expansion/collapse of the parent node
  toggleExpandCollapse(container) {
    this.data.interactionState.expanded = !this.data.interactionState.expanded;
    this.updateRender(container);
  }

  // Method to update the parent node rendering based on interaction state
  updateRender(container) {
    console.log("    Updating Render for Parent:", this.id, this.data.interactionState.expanded);
    if (this.data.interactionState.expanded) {
      container.classed("collapsed", false).classed("expanded", true);
      this.renderExpanded();
    } else {
      container.classed("expanded", false).classed("collapsed", true);
      this.removeChildren();
      this.renderCollapsed();
    }
  }

  async renderChildren(parentContainer) {
    console.log("    Rendering Children for Parent:", this.id, this.data.children);
    if (!this.data.children || this.data.children.length === 0) {
      return;
    }

    // // render "archive" node
    // let archiveChild = this.data.children.find((child) => child.category === "archive");
    // if (archiveChild) {
    //   this.archiveNode = new RectangularNode(archiveChild, parentContainer, this);
    //   this.archiveNode.render();
    // }

    // // render "staging" node
    // let stagingChild = this.data.children.find((child) => child.category === "staging");
    // if (stagingChild) {
    //   this.stagingNode = new RectangularNode(stagingChild, parentContainer, this);
    //   this.stagingNode.render();
    // }

    // // render "transform" node
    // let transformChild = this.data.children.find((child) => child.category === "transform");
    // if (transformChild) {
    //   this.transformNode = new RectangularNode(transformChild, parentContainer, this);
    //   this.transformNode.render();
    // }

    // this.layout();

    // const links = [];
    // links.push({source: this.stagingNode, target: this.transformNode});
    // links.push({source: this.stagingNode, target: this.archiveNode});
    // renderLinks(links, this.container);
  }

  layout() {
    console.log("    Layout for Adapter:", this.id, this.data.layout);
    switch (this.data.layout) {
      case 1:
        this.layout1();
        break;
      case 2:
        this.layout2();
        break;
      case 3:
        this.layout3();
        break;
    }
  }

  async layout1() {

    if (this.stagingNode) {
      const x = -this.data.width/2 + (this.stagingNode.data.width/2) + this.containerMargin.left;
      const y = -this.data.height/2 + (this.stagingNode.data.height/2) + this.containerMargin.top;      
      this.stagingNode.element.attr("transform", `translate(${x}, ${y})`);

      this.stagingNode.x = x;
      this.stagingNode.y = y;
    }

    if (this.archiveNode) {
      const x = -this.data.width/2 + (this.archiveNode.data.width/2) + this.containerMargin.left + this.stagingNode.data.width + this.nodeSpacing.horizontal;
      const y = -this.data.height/2 + (this.archiveNode.data.height/2) + this.containerMargin.top;
      this.archiveNode.element.attr("transform", `translate(${x}, ${y})`);

      this.archiveNode.x = x;
      this.archiveNode.y = y;
    }

    if (this.transformNode) {
      const x = -this.data.width/2 + (this.transformNode.data.width/2) + this.containerMargin.left + this.stagingNode.data.width/2 + 2*this.nodeSpacing.horizontal;
      const y = -this.data.height/2 + (this.transformNode.data.height/2) + this.containerMargin.top + this.archiveNode.data.height + this.nodeSpacing.vertical;
      const width = this.stagingNode.data.width + this.archiveNode.data.width - this.stagingNode.data.width/2 + this.nodeSpacing.horizontal - + 2*this.nodeSpacing.horizontal;
      const height = this.transformNode.data.height;
      this.transformNode.resize({width: width, height: height});
      this.transformNode.element.attr("transform", `translate(${x}, ${y})`);

      this.transformNode.x = x;
      this.transformNode.y = y;
    }
  }

  async layout2() {
    if (this.stagingNode) {
      const x = -this.data.width/2 + (this.stagingNode.data.width/2) + this.containerMargin.left;
      const y = -this.data.height/2 + (this.stagingNode.data.height/2) + this.containerMargin.top + this.archiveNode.data.height + this.nodeSpacing.vertical;
      this.stagingNode.element.attr("transform", `translate(${x}, ${y})`);

      this.stagingNode.x = x;
      this.stagingNode.y = y;
    }

    if (this.archiveNode) {
      const x = -this.data.width/2 + (this.archiveNode.data.width/2) + this.containerMargin.left + this.archiveNode.data.width/2 + this.nodeSpacing.horizontal;
      const y = -this.data.height/2 + (this.archiveNode.data.height/2) + this.containerMargin.top;
      this.archiveNode.element.attr("transform", `translate(${x}, ${y})`);

      this.archiveNode.x = x;
      this.archiveNode.y = y;
    }

    if (this.transformNode) {
      const x = -this.data.width/2 + (this.transformNode.data.width/2) + this.containerMargin.left + this.stagingNode.data.width + this.nodeSpacing.horizontal;
      const y = -this.data.height/2 + (this.transformNode.data.height/2) + this.containerMargin.top + this.archiveNode.data.height + this.nodeSpacing.vertical;
      this.transformNode.element.attr("transform", `translate(${x}, ${y})`);

      this.transformNode.x = x;
      this.transformNode.y = y;
    }
  }

  async layout3() {
    if (this.stagingNode) {
      const x = -this.data.width/2 + (this.stagingNode.data.width/2) + this.containerMargin.left;
      const y = -this.data.height/2 + (this.stagingNode.data.height/2) + this.containerMargin.top;
      this.stagingNode.element.attr("transform", `translate(${x}, ${y})`);
      const width = this.stagingNode.data.width;
      const height = this.archiveNode.data.height + this.transformNode.data.height + this.nodeSpacing.vertical;
      this.stagingNode.resize({width: width, height: height});

      this.stagingNode.x = x;
      this.stagingNode.y = this.stagingNode.data.height/2 - this.containerMargin.top;
    }

    if (this.archiveNode) {
      const x = -this.data.width/2 + (this.archiveNode.data.width/2) + this.containerMargin.left + this.stagingNode.data.width + this.nodeSpacing.horizontal;
      const y = -this.data.height/2 + (this.archiveNode.data.height/2) + this.containerMargin.top;
      this.archiveNode.element.attr("transform", `translate(${x}, ${y})`);

      this.archiveNode.x = x;
      this.archiveNode.y = y;
    }

    if (this.transformNode) {
      const x = -this.data.width/2 + (this.transformNode.data.width/2) + this.containerMargin.left + this.stagingNode.data.width + this.nodeSpacing.horizontal;
      const y = -this.data.height/2 + (this.transformNode.data.height/2) + this.containerMargin.top + this.archiveNode.data.height + this.nodeSpacing.vertical;
      this.transformNode.element.attr("transform", `translate(${x}, ${y})`);

      this.transformNode.x = x;
      this.transformNode.y = y;
    }
  }


  // Method to remove child nodes from the SVG
  removeChildren() {
    console.log("    Removing Children for Parent:", this.id);
    this.container.selectAll("*").remove();
    this.container.remove();
  }
}
