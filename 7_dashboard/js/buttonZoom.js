export default class ZoomButton {
  constructor(parentElement, position, onClick, size = 14, isToggled = false) {
    this.position = position;
    // State to track minimized/maximized
    this.isToggled = isToggled;

    // Attach the button to the specified D3 selection (nodeGroup)
    this.buttonGroup = parentElement
      .append("g")
      .attr("class", "zoom-button")
      .on("click", (event) => onClick(event, this));

    this.size = size;
    this.bar = { width: this.size - 4, height: 2 };
    
    // Circle for hover effect
    const r = this.size / 2;
    this.buttonGroup
      .append("circle")
      .attr("r", r)
      .attr("cx", position.x + r / 2)
      .attr("cy", position.y + r / 2);

    // initialize the button icon
    if (this.isToggled) {
      this.setPlusIcon();
    } else {
      this.setMinusIcon();
    }
  }

  toggle() {
    // Toggle between plus and minus
    this.isToggled = !this.isToggled;
    if (this.isToggled) {
      this.setPlusIcon();
    } else {
      this.setMinusIcon();
    }
  }
  move(x, y) {
    this.position = { x, y };
    this.buttonGroup
      .selectAll("circle")
      .attr("cx", this.position.x + this.size / 2)
      .attr("cy", this.position.y + this.size / 2);

    if (this.isToggled) {
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

    // Add horizontal bar
    this.buttonGroup
      .append("rect") 
      .attr("class", "icon plus")
      .attr("x", this.position.x + (this.size - this.bar.width) / 2)
      .attr("y", this.position.y + (this.size - this.bar.height) / 2)
      .attr("width", this.bar.width)
      .attr("height", this.bar.height);
  }

  setMinusIcon() {
    this.buttonGroup.selectAll(".icon").remove(); // Remove extra bar for plus
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
