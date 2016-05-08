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
    if (!referredByAdjacent) {

    } 
    for (let i=0; i < this.topLine.length; i++) {
      if (topLine[i].x > topLeftMargin.x && topLine[i].x < topRightMargin) {
        this.topLine = this.topLine.splice(i, 1);
        i--;
      }
    }
    this.topLine.push(topLeftMargin);
    this.topLine.push(topRightMargin);
  };
  this.updateRightLine = function(topLeft, bottomRight, referredByAdjacent) {
    let topRightMargin = new Coord(bottomRight.x + margin, topLeft.y - margin);
    let bottomRightMargin = new Coord(bottomRight.x + margin, bottomRight.y + margin);
    if (!referredByAdjacent) {
      
    } 
    for (let i=0; i < this.rightLine.length; i++) {
      if (rightLine[i].y < topRightMargin.x && rightLine[i].y > bottomRightMargin) {
        this.rightLine = this.rightLine.splice(i, 1);
        i--;
      }
    }
    this.rightLine.push(bottomRightMargin);
    this.rightLine.push(topRightMargin);
  };
  this.updateBottomLine = function(topLeft, bottomRight, referredByAdjacent) {
    let bottomLeftMargin = new Coord(topLeft.x - margin, bottomRight.y + margin);
    let bottomRightMargin = new Coord(bottomRight.x + margin, bottomRight.y + margin);
    if (!referredByAdjacent) {
      
    } 
    for (let i=0; i < this.bottomLine.length; i++) {
      if (bottomLine[i].x > bottomLeftMargin.x && bottomLine[i].x < bottomRightMargin) {
        this.bottomLine = this.bottomLine.splice(i, 1);
        i--;
      }
    }
    this.bottomLine.push(bottomLeftMargin);
    this.bottomLine.push(bottomRightMargin);
  };
  this.updateLeftLine = function(topLeft, bottomRight, referredByAdjacent) {
    let topLeftMargin = new Coord(topLeft.x - margin, topLeft.y - margin);
    let bottomLeftMargin = new Coord(topLeft.x - margin, bottomRight.y + margin);
    if (!referredByAdjacent) {
      
    } 
    for (let i=0; i < this.leftLine.length; i++) {
      if (leftLine[i].y < topLeftMargin.x && leftLine[i].y > bottomLeftMargin) {
        this.leftLine = this.leftLine.splice(i, 1);
        i--;
      }
    }
    this.leftLine.push(topLeftMargin);
    this.leftLine.push(bottomLeftMargin);
  };
}