import { sortBottomToTop } from './measurements.js';
import { sortTopToBottom } from './measurements.js';
import { sortLeftToRight } from './measurements.js';
import { sortRightToLeft } from './measurements.js';
import { platformIsTopMost } from './measurements.js';
import { platformIsBottomMost } from './measurements.js';
import { platformIsRightMost } from './measurements.js';
import { platformIsLeftMost } from './measurements.js';
import { centerOf } from './measurements.js';
import { centerOfHor } from './measurements.js';
import { centerOfVert } from './measurements.js';
import { fitsHor } from './measurements.js';
import { fitsVert } from './measurements.js';
import { platformWidth } from './measurements.js';
import { platformHeight } from './measurements.js';
import { adjacentLeft } from './measurements.js';
import { adjacentRight } from './measurements.js';
import { adjacentTop } from './measurements.js';
import { adjacentBottom } from './measurements.js';
import { widthWithAdjacentLeft } from './recursiveFindSpotFunctions.js';
import { widthWithAdjacentRight } from './recursiveFindSpotFunctions.js';
import { widthWithAdjacentAbove } from './recursiveFindSpotFunctions.js';
import { widthWithAdjacentBelow } from './recursiveFindSpotFunctions.js';

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

export function PostOb(_id, author, content, responseNo) {
  this._id = _id;
  this.content = content;
  this.author = author;
  this.responseNo = responseNo;
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
      //if textbox narrower
      if (fitsHor(dimens, platformWidth(this.topLine[i]))) {
        spot = new Coord(centerOfHor(this.topLine[i].a.x, this.topLine[i].b.x), this.topLine[i].a.y - centerOf(dimens).y);
        break;
      } 
      //if only platform
      if (this.topLine.length === 1) {
        spot = new Coord(centerOfHor(this.topLine[i].a.x, this.topLine[i].b.x), this.topLine[i].a.y - centerOf(dimens).y);
        break;
      } 
      //if left edge
      if (platformIsLeftMost(i, this.topLine)) {
        spot = new Coord(this.topLine[i].b.x - centerOf(dimens).x, this.topLine[i].a.y - centerOf(dimens).y);
        break;
      } 
      //if right edge
      if (platformIsRightMost(i, this.topLine)) {
        spot = new Coord(this.topLine[i].a.x + centerOf(dimens).x, this.topLine[i].a.y - centerOf(dimens).y);
        break;
      }
      //if lowest platform
      if (i === 0) {
        continue;
      }
      //if adjacent left not protruding
      if (fitsHor(dimens, widthWithAdjacentLeft(i, this.topLine))) {
        spot = new Coord(this.topLine[i].b.x - centerOf(dimens).x, this.topLine[i].a.y - centerOf(dimens).y);
        break;
      } 
      //if adjacent right not protruding
      if (fitsHor(dimens, widthWithAdjacentRight(i, this.topLine))) {
        spot = new Coord(this.topLine[i].a.x + centerOf(dimens).x, this.topLine[i].a.y - centerOf(dimens).y);
        break;
      } 
      //if highest platform
      if (i === this.topLine.length - 1) {
        spot = new Coord(centerOfHor(this.topLine[i].a.x, this.topLine[i].b.x), this.topLine[i].a.y - centerOf(dimens).y);
        break;
      }
    }
    return spot;
  };

  this.findSpotBottom = function(dimens) {
    let spot;
    // for each platform in bottomLine
    for (let i = 0; i < this.bottomLine.length; i++) {
      //if textbox narrower
      if (fitsHor(dimens, platformWidth(this.bottomLine[i]))) {
        spot = new Coord(centerOfHor(this.bottomLine[i].a.x, this.bottomLine[i].b.x), this.bottomLine[i].a.y + centerOf(dimens).y);
        break;
      } 
      //if only platform
      if (this.bottomLine.length === 1) {
        spot = new Coord(centerOfHor(this.bottomLine[i].a.x, this.bottomLine[i].b.x), this.bottomLine[i].a.y + centerOf(dimens).y);
        break;
      } 
      //if left edge
      if (platformIsLeftMost(i, this.bottomLine)) {
        spot = new Coord(this.bottomLine[i].b.x - centerOf(dimens).x, this.bottomLine[i].a.y + centerOf(dimens).y);
        break;
      } 
      //if right edge
      if (platformIsRightMost(i, this.bottomLine)) {
        spot = new Coord(this.bottomLine[i].a.x + centerOf(dimens).x, this.bottomLine[i].a.y + centerOf(dimens).y);
        break;
      }
      //if highest platform
      if (i === 0) {
        continue;
      }
      //if adjacent left not protruding
      if (fitsHor(dimens, widthWithAdjacentLeft(i, this.bottomLine))) {
        spot = new Coord(this.bottomLine[i].b.x - centerOf(dimens).x, this.bottomLine[i].a.y + centerOf(dimens).y);
        break;
      } 
      //if adjacent right not protruding
      if (fitsHor(dimens, widthWithAdjacentRight(i, this.bottomLine))) {
        spot = new Coord(this.bottomLine[i].a.x + centerOf(dimens).x, this.bottomLine[i].a.y + centerOf(dimens).y);
        break;
      } 
      //if lowest platform
      if (i === this.bottomLine.length - 1) {
        spot = new Coord(centerOfHor(this.bottomLine[i].a.x, this.bottomLine[i].b.x), this.bottomLine[i].a.y + centerOf(dimens).y);
        break;
      }
    }
    return spot;
  };

  this.findSpotRight = function(dimens) {
    let spot;
    // for each platform in rightLine
    for (let i = 0; i < this.rightLine.length; i++) {
      //if text box shorter
      if (fitsVert(dimens, platformHeight(this.rightLine[i]))) {
        spot = new Coord(this.rightLine[i].a.x + centerOf(dimens).x, centerOfVert(this.rightLine[i].a.y, this.rightLine[i].b.y));
        break;
      } 
      //if only platform
      if (this.rightLine.length === 1) {
        spot = new Coord(this.rightLine[i].a.x + centerOf(dimens).x, centerOfVert(this.rightLine[i].a.y, this.rightLine[i].b.y));
        break;
      } 
      //if top edge
      if (platformIsTopMost(i, this.rightLine)) {
        spot = new Coord(this.rightLine[i].a.x + centerOf(dimens).x, this.rightLine[i].b.y - centerOf(dimens).y);
        break;
      } 
      //if bottom edge
      if (platformIsBottomMost(i, this.rightLine)) {
        spot = new Coord(this.rightLine[i].a.x + centerOf(dimens).x, this.rightLine[i].a.y + centerOf(dimens).y);
        break;
      }
      //if left-most platform
      if (i === 0) {
        continue;
      }
      //if adjacent top not protruding
      let adjTop = adjacentTop(i, this.rightLine);
      if (adjTop < i) {
        if (fitsVert(dimens, platformHeight(this.rightLine[adjTop]) + platformHeight(this.rightLine[i]))) {
          spot = new Coord(this.rightLine[i].a.x + centerOf(dimens).x, this.rightLine[i].b.y - centerOf(dimens).y);
          break;
        }
      }
      //if adjacent bottom not protruding
      let adjBottom = adjacentBottom(i, this.rightLine);
      if (adjBottom < i) {
        if (fitsVert(dimens, platformHeight(this.rightLine[adjBottom]) + platformHeight(this.rightLine[i]))) {
          spot = new Coord(this.rightLine[i].a.x + centerOf(dimens).x, this.rightLine[i].a.y + centerOf(dimens).y);
          break;
        }
      }
      //if right-most platform
      if (i === this.rightLine.length - 1) {
        spot = new Coord(this.rightLine[i].a.x + centerOf(dimens).x, centerOfVert(this.rightLine[i].a.y, this.rightLine[i].b.y));
        break;
      }
    }
    return spot;
  };

  this.findSpotLeft = function(dimens) {
    let spot;
    // for each platform in leftLine
    for (let i = 0; i < this.leftLine.length; i++) {
      //if text box shorter
      if (fitsVert(dimens, platformHeight(this.leftLine[i]))) {
        spot = new Coord(this.leftLine[i].a.x - centerOf(dimens).x, centerOfVert(this.leftLine[i].a.y, this.leftLine[i].b.y));
        break;
      } 
      //if only platform
      if (this.leftLine.length === 1) {
        spot = new Coord(this.leftLine[i].a.x - centerOf(dimens).x, centerOfVert(this.leftLine[i].a.y, this.leftLine[i].b.y));
        break;
      } 
      //if top edge
      if (platformIsTopMost(i, this.leftLine)) {
        spot = new Coord(this.leftLine[i].a.x - centerOf(dimens).x, this.leftLine[i].b.y - centerOf(dimens).y);
        break;
      } 
      //if bottom edge
      if (platformIsBottomMost(i, this.leftLine)) {
        spot = new Coord(this.leftLine[i].a.x - centerOf(dimens).x, this.leftLine[i].a.y + centerOf(dimens).y);
        break;
      }
      //if right-most platform
      if (i === 0) {
        continue;
      }
      //if adjacent top not protruding
      let adjTop = adjacentTop(i, this.leftLine);
      if (adjTop < i) {
        if (fitsVert(dimens, platformHeight(this.leftLine[adjTop]) + platformHeight(this.leftLine[i]))) {
          spot = new Coord(this.leftLine[i].a.x - centerOf(dimens).x, this.leftLine[i].b.y - centerOf(dimens).y);
          break;
        }
      }
      //if adjacent bottom not protruding
      let adjBottom = adjacentBottom(i, this.leftLine);
      if (adjBottom < i) {
        if (fitsVert(dimens, platformHeight(this.leftLine[adjBottom]) + platformHeight(this.leftLine[i]))) {
          spot = new Coord(this.leftLine[i].a.x - centerOf(dimens).x, this.leftLine[i].a.y + centerOf(dimens).y);
          break;
        }
      }
      //if left-most platform
      if (i === this.leftLine.length - 1) {
        spot = new Coord(this.leftLine[i].a.x - centerOf(dimens).x, centerOfVert(this.leftLine[i].a.y, this.leftLine[i].b.y));
        break;
      }
    }
    return spot;
  };

  this.updateTopLine = function(topLeft, bottomRight, referredByAdjacent) {
    let topLeftMargin = new Coord(topLeft.x - margin, topLeft.y - margin);
    let topRightMargin = new Coord(bottomRight.x + margin, topLeft.y - margin);
    for (let i=0; i < this.topLine.length; i++) {
      //remove any lower platforms within width
      if (this.topLine[i].a.x >= topLeftMargin.x && this.topLine[i].b.x <= topRightMargin.x) {
        this.topLine.splice(i, 1);
        i--;
        continue;
      }
      //split lower platform that is wider
      if (this.topLine[i].a.x < topLeftMargin.x && this.topLine[i].b.x > topRightMargin.x) {
        this.topLine.push(new Platform(
          new Coord(topRightMargin.x, this.topLine[i].b.y), 
          new Coord(this.topLine[i].b.x, this.topLine[i].b.y)
        ));
        this.topLine[i].b.x = topLeftMargin.x;
      }
      //clip any lower platforms crossing left edge
      if (this.topLine[i].b.x > topLeftMargin.x && this.topLine[i].b.x < topRightMargin.x) {
        this.topLine[i].b = new Coord(topLeftMargin.x, this.topLine[i].b.y);
      }
      //clip any lower platforms crossing right edge
      if (this.topLine[i].a.x < topRightMargin.x && this.topLine[i].a.x > topLeftMargin.x) {
        this.topLine[i].a = new Coord(topRightMargin.x, this.topLine[i].a.y);
      }
    }
    this.topLine.push(new Platform(topLeftMargin, topRightMargin));
    //check if over edge, and if so, have adjacent side update too
    if (!referredByAdjacent) {
      if (platformIsRightMost(this.topLine.length-1, this.topLine)) {
        this.updateRightLine(topLeft, bottomRight, true);
      }
      if (platformIsLeftMost(this.topLine.length-1, this.topLine)) {
        this.updateLeftLine(topLeft, bottomRight, true);
      }
    } 
    //referral block must be after push and before sort
    this.topLine = sortBottomToTop(this.topLine);
  };

  this.updateBottomLine = function(topLeft, bottomRight, referredByAdjacent) {
    let bottomLeftMargin = new Coord(topLeft.x - margin, bottomRight.y + margin);
    let bottomRightMargin = new Coord(bottomRight.x + margin, bottomRight.y + margin);
    for (let i=0; i < this.bottomLine.length; i++) {
      //remove any higher platforms within width
      if (this.bottomLine[i].a.x >= bottomLeftMargin.x && this.bottomLine[i].b.x <= bottomRightMargin.x) {
        this.bottomLine.splice(i, 1);
        i--;
        continue;
      }
      //split higher platform that is wider
      if (this.bottomLine[i].a.x < bottomLeftMargin.x && this.bottomLine[i].b.x > bottomRightMargin.x) {
        this.bottomLine.push(new Platform(
          new Coord(bottomRightMargin.x, this.bottomLine[i].b.y), 
          new Coord(this.bottomLine[i].b.x, this.bottomLine[i].b.y)
        ));
        this.bottomLine[i].b.x = bottomLeftMargin.x;
      }
      //clip any higher platforms crossing left edge
      if (this.bottomLine[i].b.x > bottomLeftMargin.x && this.bottomLine[i].b.x < bottomRightMargin.x) {
        this.bottomLine[i].b = new Coord(bottomLeftMargin.x, this.bottomLine[i].b.y);
      }
      //clip any higher platforms crossing right edge
      if (this.bottomLine[i].a.x < bottomRightMargin.x && this.bottomLine[i].a.x > bottomLeftMargin.x) {
        this.bottomLine[i].a = new Coord(bottomRightMargin.x, this.bottomLine[i].a.y);
      }
    }
    this.bottomLine.push(new Platform(bottomLeftMargin, bottomRightMargin));
    //check if over edge, and if so, have adjacent side update too
    if (!referredByAdjacent) {
      if (platformIsRightMost(this.bottomLine.length-1, this.bottomLine)) {
        this.updateRightLine(topLeft, bottomRight, true);
      }
      if (platformIsLeftMost(this.bottomLine.length-1, this.bottomLine)) {
        this.updateLeftLine(topLeft, bottomRight, true);
      }
    } 
    //referral block must be after push and before sort
    this.bottomLine = sortTopToBottom(this.bottomLine);
  };

  this.updateRightLine = function(topLeft, bottomRight, referredByAdjacent) {
    let topRightMargin = new Coord(bottomRight.x + margin, topLeft.y - margin);
    let bottomRightMargin = new Coord(bottomRight.x + margin, bottomRight.y + margin);
    for (let i=0; i < this.rightLine.length; i++) {
      //remove any left-more platforms within height
      if (this.rightLine[i].a.y >= topRightMargin.y && this.rightLine[i].b.y <= bottomRightMargin.y) {
        this.rightLine.splice(i, 1);
        i--;
        continue;
      }
      //split left-more platform that is taller
      if (this.rightLine[i].a.y < topRightMargin.y && this.rightLine[i].b.y > bottomRightMargin.y) {
        this.rightLine.push(new Platform(
          new Coord(this.rightLine[i].b.x, bottomRightMargin.y), 
          new Coord(this.rightLine[i].b.x, this.rightLine[i].b.y)
        ));
        this.rightLine[i].b.y = topRightMargin.y;
      }
      //clip left-more platform crossing top edge
      if (this.rightLine[i].b.y > topRightMargin.y && this.rightLine[i].b.y < bottomRightMargin.y) {
        this.rightLine[i].b = new Coord(this.rightLine[i].b.x, topRightMargin.y);
      }
      //clip left-more platform crossing lower edge
      if (this.rightLine[i].a.y < bottomRightMargin.y && this.rightLine[i].a.y > topRightMargin.y) {
        this.rightLine[i].a = new Coord(this.rightLine[i].a.x, bottomRightMargin.y);
      }
    }
    this.rightLine.push(new Platform(topRightMargin, bottomRightMargin));
    //check if over edge, and if so, have adjacent side update too
    if (!referredByAdjacent) {
      if (platformIsTopMost(this.rightLine.length-1, this.rightLine)) {
        this.updateTopLine(topLeft, bottomRight, true);
      }
      if (platformIsBottomMost(this.rightLine.length-1, this.rightLine)) {
        this.updateBottomLine(topLeft, bottomRight, true);
      }
    } 
    //referral block must be after push and before sort
    this.rightLine = sortLeftToRight(this.rightLine);
  };

  this.updateLeftLine = function(topLeft, bottomRight, referredByAdjacent) {
    let topLeftMargin = new Coord(topLeft.x - margin, topLeft.y - margin);
    let bottomLeftMargin = new Coord(topLeft.x - margin, bottomRight.y + margin);
    for (let i=0; i < this.leftLine.length; i++) {
      //remove any right-more platforms within height
      if (this.leftLine[i].a.y >= topLeftMargin.y && this.leftLine[i].b.y <= bottomLeftMargin.y) {
        this.leftLine.splice(i, 1);
        i--;
        continue;
      }
      //split right-more platform that is taller
      if (this.leftLine[i].a.y < topLeftMargin.y && this.leftLine[i].b.y > bottomLeftMargin.y) {
        this.leftLine.push(new Platform(
          new Coord(this.leftLine[i].b.x, bottomLeftMargin.y), 
          new Coord(this.leftLine[i].b.x, this.leftLine[i].b.y)
        ));
        this.leftLine[i].b.y = topLeftMargin.y;
      }
      //clip right-more platform crossing top edge
      if (this.leftLine[i].b.y > topLeftMargin.y && this.leftLine[i].b.y < bottomLeftMargin.y) {
        this.leftLine[i].b = new Coord(this.leftLine[i].b.x, topLeftMargin.y);
      }
      //clip right-more platform crossing lower edge
      if (this.leftLine[i].a.y < bottomLeftMargin.y && this.leftLine[i].a.y > topLeftMargin.y) {
        this.leftLine[i].a = new Coord(this.leftLine[i].a.x, bottomLeftMargin.y);
      }
    }
    this.leftLine.push(new Platform(topLeftMargin, bottomLeftMargin));
    //check if over edge, and if so, have adjacent side update too
    if (!referredByAdjacent) {
      if (platformIsTopMost(this.leftLine.length-1, this.leftLine)) {
        this.updateTopLine(topLeft, bottomRight, true);
      }
      if (platformIsBottomMost(this.leftLine.length-1, this.leftLine)) {
        this.updateBottomLine(topLeft, bottomRight, true);
      }
    } 
    //referral block must be after push and before sort
    this.leftLine = sortRightToLeft(this.leftLine);
  };

  this.addMotion = function(topLeft, bottomRight) {
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