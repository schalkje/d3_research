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
    
    // Ensure layout is an object, not a string
    if (typeof this.data.layout === 'string') {
      this.data.layout = { type: this.data.layout };
    }
    this.layout = this.data.layout?.type || DemoMode.GRID;
    this.shiftRatio = this.data.shiftRatio || 0.6;
    this.shift2Ratio = this.data.shift2Ratio || 0.8;

    this.nodeSpacing = nodeData.nodeSpacing || { horizontal: 30, vertical: 20 };
  }

  init(parentElement = null) {
    // Ensure demo children are present before base init so the zone system can create them
    this.ensureDemoChildren();
    super.init(parentElement);

    // Create edges from center to all surrounding demo children (once)
    const center = this.getChildNode('center');
    if (center) {
      // Create edges only to nodes present for the current layout
      const neighborIds = this.data.children
        .map(c => c.id)
        .filter(id => id !== 'center');
      neighborIds.forEach(id => {
        const target = this.getChildNode(id);
        if (target) {
          createInternalEdge({ source: center.data, target: target.data, isActive: true, type: 'SSIS', state: 'Ready' }, center, target, this.settings);
        }
      });
      // Initialize edges now that they exist
      this.initEdges();
    }
  }

  ensureDemoChildren() {
    // Build children specific to the selected layout
    const all = ['top','top-right','right','bottom-right','bottom','bottom-left','left','top-left'];
    let required = [];
    switch (this.layout) {
      case DemoMode.HSHIFTED:
        required = ['top-right','bottom-right','top-left','bottom-left'];
        break;
      case DemoMode.VSHIFTED:
        required = ['top-left','top-right','bottom-left','bottom-right'];
        break;
      case DemoMode.VSHIFTED2:
        required = ['top-left','top-right','bottom-left','bottom-right'];
        break;
      case DemoMode.STAIR_UP:
        required = ['bottom-left','top-right'];
        break;
      case DemoMode.STAIR_DOWN:
        required = ['top-left','bottom-right'];
        break;
      case DemoMode.GRID:
      default:
        required = all.slice();
        break;
    }

    const children = [{ id: 'center', label: 'center', type: 'rect' }];
    required.forEach(id => children.push({ id, label: id, type: 'rect' }));
    this.data.children = children;
  }

  getChildNode(id) {
    if (!this.childNodes) return null;
    return this.childNodes.find(n => n.id === id || n.data?.id === id) || null;
  }

  moveChild(id, x, y) {
    const node = this.getChildNode(id);
    if (node) node.move(x, y);
  }

  updateChildren() {
    // Use the zone system layout algorithm to position children so it doesn't override us later
    const innerZone = this.zoneManager?.innerContainerZone;
    if (!innerZone) return;

    const self = this;
    innerZone.setLayoutAlgorithm((childNodes, coordinateSystem) => {
      const childById = new Map(childNodes.map(n => [n.id, n]));
      const c = childById.get('center');
      if (!c) return;

      const w = c.data.width;
      const h = c.data.height;
      const sx = self.nodeSpacing.horizontal;
      const sy = self.nodeSpacing.vertical;
      const r1 = self.shiftRatio;
      const r2 = self.shift2Ratio;

      const move = (id, x, y) => { const n = childById.get(id); if (n) n.move(x, y); };
      // Always place center
      move('center', 0, 0);

      switch (self.layout) {
        case DemoMode.HSHIFTED:
          move('top-right',   w + sx, -h * r1);
          move('bottom-right',w + sx,  h * r1);
          move('top-left',   -w - sx, -h * r1);
          move('bottom-left',-w - sx,  h * r1);
          break;
        case DemoMode.VSHIFTED:
          move('top-left',    -w * r1, -h - sy);
          move('top-right',    w * r1, -h - sy);
          move('bottom-left', -w * r1,  h + sy);
          move('bottom-right', w * r1,  h + sy);
          break;
        case DemoMode.VSHIFTED2:
          move('top-left',    -w * r2, -h - sy);
          move('top-right',    w * r2, -h - sy);
          move('bottom-left', -w * r2,  h + sy);
          move('bottom-right', w * r2,  h + sy);
          break;
        case DemoMode.STAIR_UP:
          move('bottom-left', -w * (1 - r1),  h + sy);
          move('top-right',    w * (1 - r1), -h - sy);
          break;
        case DemoMode.STAIR_DOWN:
          move('top-left',    -w * (1 - r1), -h - sy);
          move('bottom-right', w * (1 - r1),  h + sy);
          break;
        case DemoMode.GRID:
        default:
          move('top',          0,       -h - sy);
          move('top-right',    w + sx,  -h - sy);
          move('right',        w + sx,   0);
          move('bottom-right', w + sx,   h + sy);
          move('bottom',       0,        h + sy);
          move('bottom-left', -w - sx,   h + sy);
          move('left',        -w - sx,   0);
          move('top-left',    -w - sx,  -h - sy);
          break;
      }
    });

    // Apply the algorithm now
    innerZone.updateChildPositions();
  }

  gridLayout() {
    const c = this.getChildNode('center');
    if (!c) return;
    const w = c.data.width;
    const h = c.data.height;
    const sx = this.nodeSpacing.horizontal;
    const sy = this.nodeSpacing.vertical;
    this.moveChild('center', 0, 0);
    this.moveChild('top', 0, -h - sy);
    this.moveChild('top-right', w + sx, -h - sy);
    this.moveChild('right', w + sx, 0);
    this.moveChild('bottom-right', w + sx, h + sy);
    this.moveChild('bottom', 0, h + sy);
    this.moveChild('bottom-left', -w - sx, h + sy);
    this.moveChild('left', -w - sx, 0);
    this.moveChild('top-left', -w - sx, -h - sy);
  }
  
  hshiftedLayout() {
    const c = this.getChildNode('center');
    if (!c) return;
    const w = c.data.width;
    const h = c.data.height;
    const sx = this.nodeSpacing.horizontal;
    const r = this.shiftRatio;
    this.moveChild('center', 0, 0);
    this.moveChild('top-right',  w + sx, -h * r);
    this.moveChild('bottom-right',  w + sx,  h * r);
    this.moveChild('top-left', -w - sx, -h * r);
    this.moveChild('bottom-left', -w - sx,  h * r);
  }

  vshiftedLayout() {
    const c = this.getChildNode('center');
    if (!c) return;
    const w = c.data.width;
    const h = c.data.height;
    const sx = this.nodeSpacing.horizontal;
    const sy = this.nodeSpacing.vertical;
    const r = this.shiftRatio;
    this.moveChild('center', 0, 0);
    this.moveChild('top-left',    -w * r, -h - sy);
    this.moveChild('top-right',    w * r, -h - sy);
    this.moveChild('bottom-left', -w * r,  h + sy);
    this.moveChild('bottom-right', w * r,  h + sy);
  }


  vshifted2Layout() {
    const c = this.getChildNode('center');
    if (!c) return;
    const w = c.data.width;
    const h = c.data.height;
    const sy = this.nodeSpacing.vertical;
    const r = this.shift2Ratio;
    this.moveChild('center', 0, 0);
    this.moveChild('top-left',    -w * r, -h - sy);
    this.moveChild('top-right',    w * r, -h - sy);
    this.moveChild('bottom-left', -w * r,  h + sy);
    this.moveChild('bottom-right', w * r,  h + sy);
  }

  
  stairUpLayout() {
    const c = this.getChildNode('center');
    if (!c) return;
    const w = c.data.width;
    const h = c.data.height;
    const sy = this.nodeSpacing.vertical;
    const r = (1 - this.shiftRatio);
    this.moveChild('center', 0, 0);
    this.moveChild('bottom-left', -w * r,  h + sy);
    this.moveChild('top-right',    w * r, -h - sy);
  }
  
  stairDownLayout() {
    const c = this.getChildNode('center');
    if (!c) return;
    const w = c.data.width;
    const h = c.data.height;
    const sy = this.nodeSpacing.vertical;
    const r = (1 - this.shiftRatio);
    this.moveChild('center', 0, 0);
    this.moveChild('top-left',    -w * r, -h - sy);
    this.moveChild('bottom-right', w * r,  h + sy);
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
      type: "rect",
    };
    this.data.children.push(child);

    let childNode = new RectangularNode(child, this.container, this.settings, this);
    childNode.render();
    
    childNode.move(
      x + (this.containerMargin.left - this.containerMargin.right) / 2,
      y + (this.containerMargin.top - this.containerMargin.bottom) / 2
    );    

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
