export function Coord(x, y) {
  this.x = Math.floor(x);
  this.y = Math.floor(y);
  this.xPx = function() {
    return this.x + "px";
  };
  this.yPx = function() {
    return this.y + "px";
  };
  this.plus = function(coord) {
    return new Coord(this.x + coord.x, this.y + coord.y);
  };
  this.minus = function(coord) {
    return new Coord(this.x - coord.x, this.y - coord.y);
  };
}

export function PostOb(author, content, responseNo) {
  this.content = content;
  this.author = author;
  this.responseNo = responseNo;
  this.testMethod = function() {
    // console.log("number of responses to motion: " + this.responseNo)
  };
}

export function filledSpaceModel() {
  this.topLine = [];
  this.rightLine = [];
  this.bottomLine = [];
  this.leftLine = [];
  this.updateTopLine = function(postDimens, referredByAdjacent) {

  };
  this.updateRightLine = function(postDimens, referredByAdjacent) {

  };
  this.updateBottomLine = function(postDimens, referredByAdjacent) {

  };
  this.updateLeftLine = function(postDimens, referredByAdjacent) {

  };
}