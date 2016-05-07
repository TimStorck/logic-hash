export function Coord(x, y) {
  this.x = Math.floor(x);
  this.y = Math.floor(y);
  this.xPx = function() {
    return this.x + "px";
  }
  this.yPx = function() {
    return this.y + "px";
  }
}