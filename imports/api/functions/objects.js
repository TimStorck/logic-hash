import { rightMost } from './measurements.js';
import { leftMost } from './measurements.js';
import { topMost } from './measurements.js';
import { bottomMost } from './measurements.js';

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
  const margin = 17;
  this.topLine = [];
  this.rightLine = [];
  this.bottomLine = [];
  this.leftLine = [];
  /*
    referredByAdjacent prevents infinite recursion
  */
  this.updateTopLine = function(topLeft, bottomRight, referredByAdjacent) {
    let topLeftMargin = new Coord(topLeft.x - margin, topLeft.y - margin);
    let topRightMargin = new Coord(bottomRight.x + margin, topLeft.y - margin);
    if (referredByAdjacent) {

    } else {

    }
  };
  this.updateRightLine = function(topLeft, bottomRight, referredByAdjacent) {
    let topRightMargin = new Coord(bottomRight.x + margin, topLeft.y - margin);
    let bottomRightMargin = new Coord(bottomRight.x + margin, bottomRight.y + margin);
    if (referredByAdjacent) {
      
    } else {
      
    }
  };
  this.updateBottomLine = function(topLeft, bottomRight, referredByAdjacent) {
    let bottomLeftMargin = new Coord(topLeft.x - margin, bottomRight.y + margin);
    let bottomRightMargin = new Coord(bottomRight.x + margin, bottomRight.y + margin);
    if (referredByAdjacent) {
      
    } else {
      
    }
  };
  this.updateLeftLine = function(topLeft, bottomRight, referredByAdjacent) {
    let topLeftMargin = new Coord(topLeft.x - margin, topLeft.y - margin);
    let bottomLeftMargin = new Coord(topLeft.x - margin, bottomRight.y + margin);
    if (referredByAdjacent) {
      
    } else {
      
    }
  };
}