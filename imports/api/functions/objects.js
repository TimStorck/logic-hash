import { sortBottomToTop } from './measurements.js';
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
      if (fitsAbove(dimens, platformWidth(this.topLine[i]))) {
        spot = new Coord(centerOfTopPlatform(this.topLine[i]), this.topLine[i].a.y - centerOf(dimens).y);
        break;
      } 
      //if only platform
      if (this.topLine.length === 1) {
        spot = new Coord(centerOfTopPlatform(this.topLine[i]), this.topLine[i].a.y - centerOf(dimens).y);
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
      let adjLeft = adjacentLeft(i, this.topLine);
      if (adjLeft < i) {
        if (fitsAbove(dimens, platformWidth(this.topLine[adjLeft]) + platformWidth(this.topLine[i]))) {
          spot = new Coord(this.topLine[i].b.x - centerOf(dimens).x, this.topLine[i].a.y - centerOf(dimens).y);
          break;
        }
      }
      let adjRight = adjacentRight(i, this.topLine);
      if (adjRight < i) {
        if (fitsAbove(dimens, platformWidth(this.topLine[adjRight]) + platformWidth(this.topLine[i]))) {
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
        continue;
      }
      //split any lower platform that is wider
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
    this.topLine = sortBottomToTop(this.topLine);
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