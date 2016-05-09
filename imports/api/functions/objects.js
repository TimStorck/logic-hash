// import { rightMost } from './measurements.js';
// import { leftMost } from './measurements.js';
// import { topMost } from './measurements.js';
// import { bottomMost } from './measurements.js';
import { sortBottomToTop } from './measurements.js';
// import { sortTopToBottom } from './measurements.js';
// import { sortLeftToRight } from './measurements.js';
// import { sortRightToLeft } from './measurements.js';
import { platformIsTopMost } from './measurements.js';
import { platformIsBottomMost } from './measurements.js';
import { platformIsRightMost } from './measurements.js';
import { platformIsLeftMost } from './measurements.js';
import { centerOf } from './measurements.js';
import { fitsAbove } from './measurements.js';
import { fitsToRightOf } from './measurements.js';
import { fitsBelow } from './measurements.js';
import { fitsToLeftOf } from './measurements.js';
//combine horizontal ones and vertical ones (centerOf...)
import { centerOfTopPlatform } from './measurements.js';
import { centerOfRightPlatform } from './measurements.js';
import { centerOfLeftPlatform } from './measurements.js';
import { centerOfBottomPlatform } from './measurements.js';
import { platformWidth } from './measurements.js';
import { adjacentLeft } from './measurements.js';
import { adjacentRight } from './measurements.js';

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

export function Platform(coordA, coordB) {
  this.a = coordA;
  this.b = coordB;
}

export function filledSpaceModel() {
  const margin = 17;
  this.topLine = [];
  this.rightLine = [];
  this.bottomLine = [];
  this.leftLine = [];

  this.findSpotTop = function(dimens) {
    let spot;
    // for each platform in topLine
    for (let i = 0; i < this.topLine.length; i++) {
      //if narrower
      if (fitsAbove(dimens, this.topLine[i])) {
        spot = new Coord(centerOfTopPlatform(this.topLine[i]), this.topLine[i].a.y - centerOf(dimens).y);
        break;
      } 
      //if only platform
      if (platformIsLeftMost(i) && platformIsRightMost(i, this.topLine.length)) {
        spot = new Coord(centerOfTopPlatform(this.topLine[i]), this.topLine[i].a.y - centerOf(dimens).y);
        break;
      } 
      //if left edge
      if (platformIsLeftMost(i)) {
        spot = new Coord(this.topLine[i].b.x - centerOf(dimens).x, this.topLine[i].a.y - centerOf(dimens).y);
        break;
      } 
      //if right edge
      if (platformIsRightMost(i, this.topLine.length)) {
        spot = new Coord(this.topLine[i].a.x + centerOf(dimens).x, this.topLine[i].a.y - centerOf(dimens).y);
        break;
      }
      //if lowest platform
      if (i = 0) {
        continue;
      }
      let adjLeft = adjacentLeft(i, this.topLine);
      if (adjLeft < i) {
        if (fitsAbove(dimens, platfrmWidth(this.topLine[adjLeft]) + platformWidth(this.topLine[i]))) {
          spot = new Coord(this.topLine[i].b.x - centerOf(dimens).x, this.topLine[i].a.y - centerOf(dimens).y);
          break;
        }
      }
      let adjRight = adjacentRight(i, this.topLine);
      if (adjRight < i) {
        if (fitsAbove(dimens, platfrmWidth(this.topLine[adjRight]) + platformWidth(this.topLine[i]))) {
          spot = new Coord(this.topLine[i].a.x + centerOf(dimens).x, this.topLine[i].a.y - centerOf(dimens).y);
          break;
        }
      }
      if (i === this.topLine.length - 1) {
        spot = new Coord(centerOfTopPlatform(this.topLine[i]), this.topLine[i].a.y - centerOf(dimens).y);
        break;
      }
    }
    return spot;
  };

  this.updateTopLine = function(topLeft, bottomRight, referredByAdjacent) {
    let topLeftMargin = new Coord(topLeft.x - margin, topLeft.y - margin);
    let topRightMargin = new Coord(bottomRight.x + margin, topLeft.y - margin);
    //check if over edge, and if so, have adjacent side update too
    if (!referredByAdjacent) {
      if (topLeftMargin.x < this.topLine[0].a.x) {
        // updateLeftLine(topLeft, bottomRight, true);
      }
      if (topRightMargin.x > this.topLine[this.topLine.length-1].b.x) {
        // updateRightLine(topLeft, bottomRight, true);
      }
    } 
    for (let i=0; i < this.topLine.length; i++) {
      //remove any lower platforms within width
      if (this.topLine[i].a.x >= topLeftMargin.x && this.topLine[i].b.x <= topRightMargin.x) {
        this.topLine.splice(i, 1);
        i--;
        console.log("trying to remove lower platform");
        continue;
      }
      //split any lower platform that is wider
      if (this.topLine[i].a.x < topLeftMargin.x && this.topLine[i].b.x > topRightMargin.x) {
        console.log("trying to split any lower platform that is wider");
        this.topLine.push(new Platform(
          new Coord(topRightMargin.x, this.topLine[i].b.y), 
          new Coord(this.topLine[i].b.x, this.topLine[i].b.y)
        ));
        this.topLine[i].b.x = topLeftMargin.x;
      }
      //clip any lower platforms crossing left edge
      if (this.topLine[i].b.x > topLeftMargin.x && this.topLine[i].b.x < topRightMargin.x) {
        console.log("trying to clip any lower platforms crossing left edge");
        this.topLine[i].b = new Coord(topLeftMargin.x, this.topLine[i].b.y);
      }
      //clip any lower platforms crossing right edge
      if (this.topLine[i].a.x < topRightMargin.x && this.topLine[i].a.x > topLeftMargin.x) {
        console.log("trying to clip any lower platforms crossing right edge");
        this.topLine[i].a = new Coord(topRightMargin.x, this.topLine[i].a.y);
      }
    }
    this.topLine.push(new Platform(topLeftMargin, topRightMargin));
    this.topLine = sortBottomToTop(this.topLine);
    console.log(this.topLine);
  };

  /*
    referredByAdjacent prevents infinite recursion
  */
  // this.updateTopLine = function(topLeft, bottomRight, referredByAdjacent) {
  //   let topLeftMargin = new Coord(topLeft.x - margin, topLeft.y - margin);
  //   let topRightMargin = new Coord(bottomRight.x + margin, topLeft.y - margin);
  //   if (!referredByAdjacent) {
  //     if (topLeftMargin.x < leftMost(topLine)) {
  //       updateLeftLine(topLeft, bottomRight, true);
  //     }
  //     if (topRightMargin.x > rightMost(topLine)) {
  //       updateRightLine(topLeft, bottomRight, true);
  //     }
  //   } 
  //   for (let i=0; i < this.topLine.length; i++) {
  //     if (topLine[i].x > topLeftMargin.x && topLine[i].x < topRightMargin) {
  //       this.topLine = this.topLine.splice(i, 1);
  //       i--;
  //     }
  //   }
  //   this.topLine.push(topLeftMargin);
  //   this.topLine.push(topRightMargin);
  // };
  // this.updateRightLine = function(topLeft, bottomRight, referredByAdjacent) {
  //   let topRightMargin = new Coord(bottomRight.x + margin, topLeft.y - margin);
  //   let bottomRightMargin = new Coord(bottomRight.x + margin, bottomRight.y + margin);
  //   if (!referredByAdjacent) {
  //     if (topRightMargin.y < topMost(rightLine)) {
  //       updateTopLine(topLeft, bottomRight, true);
  //     }
  //     if (bottomRightMargin.y > bottomMost(rightLine)) {
  //       updateBottomLine(topLeft, bottomRight, true);
  //     }
  //   } 
  //   for (let i=0; i < this.rightLine.length; i++) {
  //     if (rightLine[i].y < topRightMargin.x && rightLine[i].y > bottomRightMargin) {
  //       this.rightLine = this.rightLine.splice(i, 1);
  //       i--;
  //     }
  //   }
  //   this.rightLine.push(bottomRightMargin);
  //   this.rightLine.push(topRightMargin);
  // };
  // this.updateBottomLine = function(topLeft, bottomRight, referredByAdjacent) {
  //   let bottomLeftMargin = new Coord(topLeft.x - margin, bottomRight.y + margin);
  //   let bottomRightMargin = new Coord(bottomRight.x + margin, bottomRight.y + margin);
  //   if (!referredByAdjacent) {
  //     if (bottomRightMargin.x > rightMost(bottomLine)) {
  //       updateRightLine(topLeft, bottomRight, true);
  //     }
  //     if (bottomLeftMargin.x < leftMost(bottomLine)) {
  //       updateLeftLine(topLeft, bottomRight, true);
  //     }
  //   } 
  //   for (let i=0; i < this.bottomLine.length; i++) {
  //     if (bottomLine[i].x > bottomLeftMargin.x && bottomLine[i].x < bottomRightMargin) {
  //       this.bottomLine = this.bottomLine.splice(i, 1);
  //       i--;
  //     }
  //   }
  //   this.bottomLine.push(bottomLeftMargin);
  //   this.bottomLine.push(bottomRightMargin);
  // };
  // this.updateLeftLine = function(topLeft, bottomRight, referredByAdjacent) {
  //   let topLeftMargin = new Coord(topLeft.x - margin, topLeft.y - margin);
  //   let bottomLeftMargin = new Coord(topLeft.x - margin, bottomRight.y + margin);
  //   if (!referredByAdjacent) {
  //     if (topLeftMargin.y < topMost(leftLine)) {
  //       updateTopLine(topLeft, bottomRight, true);
  //     }
  //     if (bottomLeftMargin.y > bottomMost(leftLine)) {
  //       updateBottomLine(topLeft, bottomRight, true);
  //     }
  //   } 
  //   for (let i=0; i < this.leftLine.length; i++) {
  //     if (leftLine[i].y < topLeftMargin.x && leftLine[i].y > bottomLeftMargin) {
  //       this.leftLine = this.leftLine.splice(i, 1);
  //       i--;
  //     }
  //   }
  //   this.leftLine.push(topLeftMargin);
  //   this.leftLine.push(bottomLeftMargin);
  // };
  this.addMotion = function(topLeft, bottomRight) {
    //these variables were causing problems
    // let topRightMargin = new Coord(bottomRight.x + margin, topLeft.y - margin);
    // let bottomRightMargin = new Coord(bottomRight.x + margin, bottomRight.y + margin);
    // let bottomLeftMargin = new Coord(topLeft.x - margin, bottomRight.y + margin);
    // let topLeftMargin = new Coord(topLeft.x - margin, topLeft.y - margin);
    /*
      platform coordinates entered left to right or top to bottom.
    */
    this.topLine.push(new Platform(
      new Coord(topLeft.x - margin, topLeft.y - margin), 
      new Coord(bottomRight.x + margin, topLeft.y - margin)
    ));
    this.rightLine.push(new Platform(
      new Coord(bottomRight.x + margin, topLeft.y - margin), 
      new Coord(bottomRight.x + margin, bottomRight.y + margin)
    ));
    this.bottomLine.push(new Platform(
      new Coord(topLeft.x - margin, bottomRight.y + margin), 
      new Coord(bottomRight.x + margin, bottomRight.y + margin)
    ));
    this.leftLine.push(new Platform(
      new Coord(topLeft.x - margin, topLeft.y - margin), 
      new Coord(topLeft.x - margin, bottomRight.y + margin)
    ));
  };
}