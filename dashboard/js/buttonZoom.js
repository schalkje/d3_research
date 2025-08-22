export default class ZoomButton {
  constructor(parentElement, position, onClick, size = 14, isToggled = false) {
    this.position = position;
    this.isToggled = isToggled;

    this.buttonGroup = parentElement
      .append("g")
      .attr("class", "zoom-button")
      .on("click", (event) => onClick(event, this));

    this.size = size;
    this.bar = { width: this.size - 4, height: 2 };
    
    const r = this.size / 2;
    this.buttonGroup
      .append("circle")
      .attr("r", r)
      .attr("cx", position.x + r / 2)
      .attr("cy", position.y + r / 2);

    if (this.isToggled) {
      this.setPlusIcon();
    } else {
      this.setMinusIcon();
    }
  }

  toggle(collapsed = null) {
    if (collapsed !== null) {
      this.isToggled = collapsed;
    } else {
      this.isToggled = !this.isToggled;
    }
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

    this.buttonGroup
      .append("rect")
      .attr("class", "icon plus")
      .attr("x", this.position.x + (this.size - this.bar.height) / 2)
      .attr("y", this.position.y + (this.size - this.bar.width) / 2)
      .attr("width", this.bar.height)
      .attr("height", this.bar.width);

    this.buttonGroup
      .append("rect") 
      .attr("class", "icon plus")
      .attr("x", this.position.x + (this.size - this.bar.width) / 2)
      .attr("y", this.position.y + (this.size - this.bar.height) / 2)
      .attr("width", this.bar.width)
      .attr("height", this.bar.height);
  }

  setMinusIcon() {
    this.buttonGroup.selectAll(".icon").remove();
    this.buttonGroup
      .append("rect")
      .attr("class", "icon minus")
      .attr("x", this.position.x + (this.size - this.bar.width) / 2)
      .attr("y", this.position.y + (this.size - this.bar.height) / 2)
      .attr("width", this.bar.width)
      .attr("height", this.bar.height);
  }
}
