export function roundToTwoDecimals(num) {
    return Math.round(num * 100) / 100;
}


export function changeDirection(x, y, horizontal = true) {
    if (horizontal) {
      return { x: y, y: x };
    } else {
      return { x: x, y: y };
    }
  }
  
  export function changePointDirection(points, horizontal) {
    if (horizontal) {
      return points.map((point) => [point[1], point[0]]); // Swap x and y when horizontal is true
    }
    return points; // Return points unchanged when horizontal is false
  }