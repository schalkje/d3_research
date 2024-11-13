export default class ZoomButton {
  constructor(parentElement, position, onClick, size = 14, isMinimized = false) {
    this.position = position;
    // State to track minimized/maximized
    this.isMinimized = isMinimized;

    // Attach the button to the specified D3 selection (nodeGroup)
    this.buttonGroup = parentElement
      .append("g")
      .attr("class", "zoom-button")
      .on("click", (event) => onClick(event, this));

    this.size = size;

    this.bar = { width: this.size - 4, height: 2 };
    const r = this.size / 2;
    // Circle for hover effect
    this.buttonGroup
      .append("circle")
      .attr("r", r)
      .attr("cx", position.x + r / 2)
      .attr("cy", position.y + r / 2);

    // initialize the button icon
    if (this.isMinimized) {
      this.setPlusIcon();
    } else {
      this.setMinusIcon();
    }
  }

  toggle() {
    // Toggle between plus and minus
    this.isMinimized = !this.isMinimized;
    if (this.isMinimized) {
      this.setPlusIcon();
    } else {
      this.setMinusIcon();
    }
  }
  move(x, y) {
    console.log(`          > move ${this}, (x:${x},y:${y})`);
    this.position = { x, y };
    this.buttonGroup
      .selectAll("circle")
      .attr("cx", this.position.x + this.size / 2)
      .attr("cy", this.position.y + this.size / 2);

    if (this.isMinimized) {
      this.setPlusIcon();
    } else {
      this.setMinusIcon();
    }
  }




  setPlusIcon() {
    this.buttonGroup.selectAll(".icon").remove();

    // Adjust icon to look like a plus
    // add vertical bar
    this.buttonGroup
      .append("rect")
      .attr("class", "icon plus")
      .attr("x", this.position.x + (this.size - this.bar.height) / 2)
      .attr("y", this.position.y + (this.size - this.bar.width) / 2)
      .attr("width", this.bar.height)
      .attr("height", this.bar.width);

    this.buttonGroup
      .append("rect") // Add horizontal bar
      .attr("class", "icon plus")
      .attr("x", this.position.x + (this.size - this.bar.width) / 2)
      .attr("y", this.position.y + (this.size - this.bar.height) / 2)
      .attr("width", this.bar.width)
      .attr("height", this.bar.height);
  }

  setMinusIcon() {
    this.buttonGroup.selectAll(".minus").remove(); // Remove extra bar for plus
    // Adjust icon to look like a minus
    this.buttonGroup
      .append("rect")
      .attr("class", "icon minus")
      .attr("x", this.position.x + (this.size - this.bar.width) / 2)
      .attr("y", this.position.y + (this.size - this.bar.height) / 2)
      .attr("width", this.bar.width)
      .attr("height", this.bar.height);
  }
}
