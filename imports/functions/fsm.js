import { centerOf } from './measurements.js';
import { centerOfHor } from './measurements.js';
import { centerOfVert } from './measurements.js';
import { fitsHor } from './measurements.js';
import { fitsVert } from './measurements.js';
import { Coord } from './objects.js';
import { Line } from './objects.js';
import { PostOb } from './objects.js';
import { Area } from './objects.js';


export function filledSpaceModel() {
  const margin = 17;
  this.lineArray = [];

  this.reset = function() {
    this.lineArray = [];
  }

  this.addBox = function(topLeft, bottomRight) {
    let marginBox = getMarginBox(topLeft, bottomRight, margin);

    for (let i = 0; i < marginBox.length; i++) {
      this.lineArray.push(marginBox[i]);
    }
    return marginBox;
  };

  this.addResponse = function(topLeft,bottomRight) {
    let marginBox = this.addBox(topLeft,bottomRight);
    this.trimOverlap(marginBox);
  }

  this.trimOverlap = function(marginBox) {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < this.lineArray.length; j++) {
        if (linesCross(marginBox[i], this.lineArray[j])) {
          truncateOrSplit(marginBox[i], this.lineArray[j], this.lineArray);
          truncateOrSplit(this.lineArray[j], marginBox[i], this.lineArray);
        }
      }
    }
    removeOrphanLine(this.lineArray);
  }
}

function linesMeet(firstLine, secondLine) {
  if ((firstLine.a.x == secondLine.b.x && firstLine.a.y == secondLine.b.y) || 
      (firstLine.a.x == secondLine.a.x && firstLine.a.y == secondLine.a.y) ||
      (firstLine.b.x == secondLine.b.x && firstLine.b.y == secondLine.b.y) || 
      (firstLine.b.x == secondLine.a.x && firstLine.b.y == secondLine.a.y) ) {
    return true
  }
  return false;
}

function removeOrphanLine(lineArray) {
  let orphan;
  for (let i = lineArray.length - 1; i >= 0; i--){
    orphan = true;
    for (let j = lineArray.length - 1; j >= 0; j--) {
      if (i != j) {
        if (linesMeet(lineArray[i], lineArray[j])) {
          orphan = false;
          break;
        }
      }
    }
    if (orphan) {
      lineArray.splice(i, 1);
      break;
    }
  }
}

function truncateOrSplit(lineToCross, lineDefiningSide, lineArray) {
  insideCrossingLine = closestCrossingLineOnInsideSide(lineToCross, lineDefiningSide, lineArray);
  if (typeof insideCrossingLine != "undefined") {
    switch (lineDefiningSide.side) {
      case 0:
        lineArray.push(new Line(new Coord(lineToCross.a.x, insideCrossingLine.a.y), new Coord(lineToCross.b.x, lineToCross.b.y), lineToCross.side));
        //trim insideCrossingLine
        if (lineToCross.side == 1) {
          insideCrossingLine.a.x = lineToCross.a.x;
        } else {
          insideCrossingLine.b.x = lineToCross.a.x;
        }
        break;
      case 1:
        lineArray.push(new Line(new Coord(lineToCross.a.x, lineToCross.a.y), new Coord(insideCrossingLine.a.x, lineToCross.a.y), lineToCross.side));
        //trim insideCrossingLine
        if (lineToCross.side == 0) {
          insideCrossingLine.b.y = lineToCross.a.y;
        } else {
          insideCrossingLine.a.y = lineToCross.a.y;
        }
        break;
      case 2:
        lineArray.push(new Line(new Coord(lineToCross.a.x, lineToCross.a.y), new Coord(lineToCross.a.x, insideCrossingLine.a.y), lineToCross.side));
        //trim insideCrossingLine
        if (lineToCross.side == 1) {
          insideCrossingLine.a.x = lineToCross.a.x;
        } else {
          insideCrossingLine.b.x = lineToCross.a.x;
        }
        break;
      case 3:
        lineArray.push(new Line(new Coord(insideCrossingLine.a.x, lineToCross.a.y), new Coord(lineToCross.b.x, lineToCross.b.y), lineToCross.side));
        //trim insideCrossingLine
        if (lineToCross.side == 0) {
          insideCrossingLine.b.y = lineToCross.a.y;
        } else {
          insideCrossingLine.a.y = lineToCross.a.y;
        }
        break;
    }
  }
  switch (lineDefiningSide.side) {
    case 0:
      lineToCross.b.y = lineDefiningSide.a.y;
      break;
    case 1:
      lineToCross.a.x = lineDefiningSide.a.x;
      break;
    case 2:
      lineToCross.a.y = lineDefiningSide.a.y;
      break;
    case 3:
      lineToCross.b.x = lineDefiningSide.a.x;
      break;
  }
}

function closestCrossingLineOnInsideSide(lineToCross, lineDefiningSide, lineArray) {
  let side = oppositeSide(lineDefiningSide);
  let lineToReturn;
  for (let i = 0; i < lineArray.length; i ++) {
    if (lineArray[i].side === side) {
      if (linesCross(lineArray[i], lineToCross)) {
        switch (lineDefiningSide.side) {
          case 0:
            if (lineDefiningSide.a.y < lineArray[i].a.y) {
              if (typeof lineToReturn == "undefined") {
                lineToReturn = lineArray[i];
              } else {
                if (lineToReturn.a.y > lineArray[i].a.y) {
                  lineToReturn = lineArray[i];
                }
              }
            }
            break;
          case 1:
            if (lineDefiningSide.a.x > lineArray[i].a.x) {
              if (typeof lineToReturn == "undefined") {
                lineToReturn = lineArray[i];
                console.log(lineToReturn);
              } else {
                if (lineToReturn.a.x < lineArray[i].a.x) {
                  lineToReturn = lineArray[i];
                }
              }
            }
            break;
          case 2:
            if (lineDefiningSide.a.y > lineArray[i].a.y) {
              if (typeof lineToReturn == "undefined") {
                lineToReturn = lineArray[i];
              } else {
                if (lineToReturn.a.y < lineArray[i].a.y) {
                  lineToReturn = lineArray[i];
                }
              }
            }
            break;
          case 3:
            if (lineDefiningSide.a.x < lineArray[i].a.x) {
              if (typeof lineToReturn == "undefined") {
                lineToReturn = lineArray[i];
              } else {
                if (lineToReturn.a.x > lineArray[i].a.x) {
                  lineToReturn = lineArray[i];
                }
              }
            }
            break;
        }
      }
    } 
  }
  return lineToReturn;
}

function oppositeSide(line) {
  switch (line.side) {
    case 0:
      return 2;
      break;
    case 1:
      return 3;
      break;
    case 2:
      return 0;
      break;
    case 3:
      return 1;
  }
}

function getMarginBox(topLeft, bottomRight, margin) {
  let marginBox = [];
  marginBox.push(new Line(
    new Coord(topLeft.x - margin, topLeft.y - margin), 
    new Coord(bottomRight.x + margin, topLeft.y - margin),
    0
  ));
  marginBox.push(new Line(
    new Coord(bottomRight.x + margin, topLeft.y - margin), 
    new Coord(bottomRight.x + margin, bottomRight.y + margin),
    1
  ));
  marginBox.push(new Line(
    new Coord(bottomRight.x + margin, bottomRight.y + margin), 
    new Coord(topLeft.x - margin, bottomRight.y + margin),
    2
  ));
  marginBox.push(new Line(
    new Coord(topLeft.x - margin, bottomRight.y + margin), 
    new Coord(topLeft.x - margin, topLeft.y - margin),
    3
  ));
  return marginBox;
}

function linesArePerpendicular(firstLine, secondLine) {
  if (firstLine.side == 0 || firstLine.side == 2) {
    if (secondLine.side == 1 || secondLine.side == 3) {
      return true;
    } else {
      return false;
    }
  } else {
    if (secondLine.side == 0 || secondLine.side == 2) {
      return true;
    } else {
      return false;
    }
  }
}

//only compare perpendicular lines
function linesCross(firstLine, secondLine) {
  //if firstLine is horizontal
  if (firstLine.a.y == firstLine.b.y) {
    if (firstLine.a.x < secondLine.a.x && firstLine.b.x > secondLine.a.x && secondLine.a.y < firstLine.a.y && secondLine.b.y > firstLine.a.y) {
      return true;
    } else {
      return false;
    }
  //firstLine is vertical
  } else {
    if (secondLine.a.x < firstLine.a.x && secondLine.b.x > firstLine.a.x && firstLine.a.y < secondLine.a.y && firstLine.b.y > secondLine.a.y) {
      return true;
    } else {
      return false;
    }
  }
}

function linesOverlap(firstLine, secondLine) {
  //if lines are horizontal
  if (firstLine.side == 0 || firstLine.side == 2) {
    //if same y value
    if (firstLine.a.y == secondLine.a.y) {
      //if firstLine is left more
      if (firstLine.a.x < secondLine.a.x) {
        //if secondLine starts before firstLine ends
        if (firstLine.b.x > secondLine.a.x) {
          return true;
        } else {
          return false;
        }
      //secondLine is left more
      } else {
        //if firstLine starts before secondLine ends
        if (secondLine.b.x > firstLine.a.x) {
          return true;
        } else {
          return false;
        }
      }
    //different y value
    } else {
      return false;
    }
  //lines are vertical
  } else {
    //if same x value
    if (firstLine.a.x == secondLine.a.x) {
      //if firstLine is higher
      if (firstLine.a.y < secondLine.a.y) {
        //if secondLine starts before firstLine ends
        if (firstLine.b.y > secondLine.a.y) {
          return true;
        } else {
          return false;
        }
      //secondLine is higher
      } else {
        //if firstLine starts before secondLine ends
        if (secondLine.b.y > firstLine.a.y) {
          return true;
        } else {
          return false;
        }
      }
    //different x value
    } else {
      return false;
    }
  }
}




















// export function filledSpaceModel() {
//   const margin = 17;
//   this.topLine = [];
//   this.rightLine = [];
//   this.bottomLine = [];
//   this.leftLine = [];

//   this.findSpotTop = function(dimens) {
//     let spot;
//     // for each platform in topLine
//     for (let i = 0; i < this.topLine.length; i++) {
//       //if textbox narrower
//       if (fitsHor(dimens, platformWidth(this.topLine[i]))) {
//         spot = new Coord(centerOfHor(this.topLine[i].a.x, this.topLine[i].b.x), this.topLine[i].a.y - centerOf(dimens).y);
//         break;
//       } 
//       //if only platform
//       if (this.topLine.length === 1) {
//         spot = new Coord(centerOfHor(this.topLine[i].a.x, this.topLine[i].b.x), this.topLine[i].a.y - centerOf(dimens).y);
//         break;
//       } 
//       //if left edge
//       if (platformIsLeftMost(i, this.topLine)) {
//         spot = new Coord(this.topLine[i].b.x - centerOf(dimens).x, this.topLine[i].a.y - centerOf(dimens).y);
//         break;
//       } 
//       //if right edge
//       if (platformIsRightMost(i, this.topLine)) {
//         spot = new Coord(this.topLine[i].a.x + centerOf(dimens).x, this.topLine[i].a.y - centerOf(dimens).y);
//         break;
//       }
//       //if lowest platform
//       if (i === 0) {
//         continue;
//       }
//       //if adjacent left not protruding
//       if (fitsHor(dimens, widthWithAdjacentLeft(i, this.topLine))) {
//         spot = new Coord(this.topLine[i].b.x - centerOf(dimens).x, this.topLine[i].a.y - centerOf(dimens).y);
//         break;
//       } 
//       //if adjacent right not protruding
//       if (fitsHor(dimens, widthWithAdjacentRight(i, this.topLine))) {
//         spot = new Coord(this.topLine[i].a.x + centerOf(dimens).x, this.topLine[i].a.y - centerOf(dimens).y);
//         break;
//       } 
//       //if highest platform
//       if (i === this.topLine.length - 1) {
//         spot = new Coord(centerOfHor(this.topLine[i].a.x, this.topLine[i].b.x), this.topLine[i].a.y - centerOf(dimens).y);
//         break;
//       }
//     }
//     return spot;
//   };

//   this.findSpotBottom = function(dimens) {
//     let spot;
//     // for each platform in bottomLine
//     for (let i = 0; i < this.bottomLine.length; i++) {
//       //if textbox narrower
//       if (fitsHor(dimens, platformWidth(this.bottomLine[i]))) {
//         spot = new Coord(centerOfHor(this.bottomLine[i].a.x, this.bottomLine[i].b.x), this.bottomLine[i].a.y + centerOf(dimens).y);
//         break;
//       } 
//       //if only platform
//       if (this.bottomLine.length === 1) {
//         spot = new Coord(centerOfHor(this.bottomLine[i].a.x, this.bottomLine[i].b.x), this.bottomLine[i].a.y + centerOf(dimens).y);
//         break;
//       } 
//       //if left edge
//       if (platformIsLeftMost(i, this.bottomLine)) {
//         spot = new Coord(this.bottomLine[i].b.x - centerOf(dimens).x, this.bottomLine[i].a.y + centerOf(dimens).y);
//         break;
//       } 
//       //if right edge
//       if (platformIsRightMost(i, this.bottomLine)) {
//         spot = new Coord(this.bottomLine[i].a.x + centerOf(dimens).x, this.bottomLine[i].a.y + centerOf(dimens).y);
//         break;
//       }
//       //if highest platform
//       if (i === 0) {
//         continue;
//       }
//       //if adjacent left not protruding
//       if (fitsHor(dimens, widthWithAdjacentLeft(i, this.bottomLine))) {
//         spot = new Coord(this.bottomLine[i].b.x - centerOf(dimens).x, this.bottomLine[i].a.y + centerOf(dimens).y);
//         break;
//       } 
//       //if adjacent right not protruding
//       if (fitsHor(dimens, widthWithAdjacentRight(i, this.bottomLine))) {
//         spot = new Coord(this.bottomLine[i].a.x + centerOf(dimens).x, this.bottomLine[i].a.y + centerOf(dimens).y);
//         break;
//       } 
//       //if lowest platform
//       if (i === this.bottomLine.length - 1) {
//         spot = new Coord(centerOfHor(this.bottomLine[i].a.x, this.bottomLine[i].b.x), this.bottomLine[i].a.y + centerOf(dimens).y);
//         break;
//       }
//     }
//     return spot;
//   };

//   this.findSpotRight = function(dimens) {
//     let spot;
//     // for each platform in rightLine
//     for (let i = 0; i < this.rightLine.length; i++) {
//       //if text box shorter
//       if (fitsVert(dimens, platformHeight(this.rightLine[i]))) {
//         spot = new Coord(this.rightLine[i].a.x + centerOf(dimens).x, centerOfVert(this.rightLine[i].a.y, this.rightLine[i].b.y));
//         break;
//       } 
//       //if only platform
//       if (this.rightLine.length === 1) {
//         spot = new Coord(this.rightLine[i].a.x + centerOf(dimens).x, centerOfVert(this.rightLine[i].a.y, this.rightLine[i].b.y));
//         break;
//       } 
//       //if top edge
//       if (platformIsTopMost(i, this.rightLine)) {
//         spot = new Coord(this.rightLine[i].a.x + centerOf(dimens).x, this.rightLine[i].b.y - centerOf(dimens).y);
//         break;
//       } 
//       //if bottom edge
//       if (platformIsBottomMost(i, this.rightLine)) {
//         spot = new Coord(this.rightLine[i].a.x + centerOf(dimens).x, this.rightLine[i].a.y + centerOf(dimens).y);
//         break;
//       }
//       //if left-most platform
//       if (i === 0) {
//         continue;
//       }
//       //if adjacent top not protruding
//       if (fitsVert(dimens, heightWithAdjacentTop(i, this.rightLine))) {
//         spot = new Coord(this.rightLine[i].a.x + centerOf(dimens).x, this.rightLine[i].b.y - centerOf(dimens).y);
//         break;
//       } 
//       //if adjacent bottom not protruding
//       if (fitsVert(dimens, heightWithAdjacentBottom(i, this.rightLine))) {
//         spot = new Coord(this.rightLine[i].a.x + centerOf(dimens).x, this.rightLine[i].a.y + centerOf(dimens).y);
//         break;
//       } 
//       //if right-most platform
//       if (i === this.rightLine.length - 1) {
//         spot = new Coord(this.rightLine[i].a.x + centerOf(dimens).x, centerOfVert(this.rightLine[i].a.y, this.rightLine[i].b.y));
//         break;
//       }
//     }
//     return spot;
//   };

//   this.findSpotLeft = function(dimens) {
//     let spot;
//     // for each platform in leftLine
//     for (let i = 0; i < this.leftLine.length; i++) {
//       //if text box shorter
//       if (fitsVert(dimens, platformHeight(this.leftLine[i]))) {
//         spot = new Coord(this.leftLine[i].a.x - centerOf(dimens).x, centerOfVert(this.leftLine[i].a.y, this.leftLine[i].b.y));
//         break;
//       } 
//       //if only platform
//       if (this.leftLine.length === 1) {
//         spot = new Coord(this.leftLine[i].a.x - centerOf(dimens).x, centerOfVert(this.leftLine[i].a.y, this.leftLine[i].b.y));
//         break;
//       } 
//       //if top edge
//       if (platformIsTopMost(i, this.leftLine)) {
//         spot = new Coord(this.leftLine[i].a.x - centerOf(dimens).x, this.leftLine[i].b.y - centerOf(dimens).y);
//         break;
//       } 
//       //if bottom edge
//       if (platformIsBottomMost(i, this.leftLine)) {
//         spot = new Coord(this.leftLine[i].a.x - centerOf(dimens).x, this.leftLine[i].a.y + centerOf(dimens).y);
//         break;
//       }
//       //if right-most platform
//       if (i === 0) {
//         continue;
//       }
//       //if adjacent top not protruding
//       if (fitsVert(dimens, heightWithAdjacentTop(i, this.leftLine))) {
//         spot = new Coord(this.leftLine[i].a.x - centerOf(dimens).x, this.leftLine[i].b.y - centerOf(dimens).y);
//         break;
//       } 
//       //if adjacent bottom not protruding
//       if (fitsVert(dimens, heightWithAdjacentBottom(i, this.leftLine))) {
//         spot = new Coord(this.leftLine[i].a.x - centerOf(dimens).x, this.leftLine[i].a.y + centerOf(dimens).y);
//         break;
//       } 
//       //if left-most platform
//       if (i === this.leftLine.length - 1) {
//         spot = new Coord(this.leftLine[i].a.x - centerOf(dimens).x, centerOfVert(this.leftLine[i].a.y, this.leftLine[i].b.y));
//         break;
//       }
//     }
//     return spot;
//   };

//   this.updateTopLine = function(topLeft, bottomRight, referredByAdjacent) {
//     let topLeftMargin = new Coord(topLeft.x - margin, topLeft.y - margin);
//     let topRightMargin = new Coord(bottomRight.x + margin, topLeft.y - margin);
//     for (let i=0; i < this.topLine.length; i++) {
//       //remove any lower platforms within width
//       if (this.topLine[i].a.x >= topLeftMargin.x && this.topLine[i].b.x <= topRightMargin.x) {
//         this.topLine.splice(i, 1);
//         i--;
//         continue;
//       }
//       //split lower platform that is wider
//       if (this.topLine[i].a.x < topLeftMargin.x && this.topLine[i].b.x > topRightMargin.x) {
//         this.topLine.push(new Platform(
//           new Coord(topRightMargin.x, this.topLine[i].b.y), 
//           new Coord(this.topLine[i].b.x, this.topLine[i].b.y)
//         ));
//         this.topLine[i].b.x = topLeftMargin.x;
//       }
//       //clip any lower platforms crossing left edge
//       if (this.topLine[i].b.x > topLeftMargin.x && this.topLine[i].b.x < topRightMargin.x) {
//         this.topLine[i].b = new Coord(topLeftMargin.x, this.topLine[i].b.y);
//       }
//       //clip any lower platforms crossing right edge
//       if (this.topLine[i].a.x < topRightMargin.x && this.topLine[i].a.x > topLeftMargin.x) {
//         this.topLine[i].a = new Coord(topRightMargin.x, this.topLine[i].a.y);
//       }
//     }
//     this.topLine.push(new Platform(topLeftMargin, topRightMargin));
//     //check if over edge, and if so, have adjacent side update too
//     if (!referredByAdjacent) {
//       if (platformIsRightMost(this.topLine.length-1, this.topLine)) {
//         this.updateRightLine(topLeft, bottomRight, true);
//       }
//       if (platformIsLeftMost(this.topLine.length-1, this.topLine)) {
//         this.updateLeftLine(topLeft, bottomRight, true);
//       }
//     } 
//     //referral block must be after push and before sort
//     this.topLine = sortBottomToTop(this.topLine);
//   };

//   this.updateBottomLine = function(topLeft, bottomRight, referredByAdjacent) {
//     let bottomLeftMargin = new Coord(topLeft.x - margin, bottomRight.y + margin);
//     let bottomRightMargin = new Coord(bottomRight.x + margin, bottomRight.y + margin);
//     for (let i=0; i < this.bottomLine.length; i++) {
//       //remove any higher platforms within width
//       if (this.bottomLine[i].a.x >= bottomLeftMargin.x && this.bottomLine[i].b.x <= bottomRightMargin.x) {
//         this.bottomLine.splice(i, 1);
//         i--;
//         continue;
//       }
//       //split higher platform that is wider
//       if (this.bottomLine[i].a.x < bottomLeftMargin.x && this.bottomLine[i].b.x > bottomRightMargin.x) {
//         this.bottomLine.push(new Platform(
//           new Coord(bottomRightMargin.x, this.bottomLine[i].b.y), 
//           new Coord(this.bottomLine[i].b.x, this.bottomLine[i].b.y)
//         ));
//         this.bottomLine[i].b.x = bottomLeftMargin.x;
//       }
//       //clip any higher platforms crossing left edge
//       if (this.bottomLine[i].b.x > bottomLeftMargin.x && this.bottomLine[i].b.x < bottomRightMargin.x) {
//         this.bottomLine[i].b = new Coord(bottomLeftMargin.x, this.bottomLine[i].b.y);
//       }
//       //clip any higher platforms crossing right edge
//       if (this.bottomLine[i].a.x < bottomRightMargin.x && this.bottomLine[i].a.x > bottomLeftMargin.x) {
//         this.bottomLine[i].a = new Coord(bottomRightMargin.x, this.bottomLine[i].a.y);
//       }
//     }
//     this.bottomLine.push(new Platform(bottomLeftMargin, bottomRightMargin));
//     //check if over edge, and if so, have adjacent side update too
//     if (!referredByAdjacent) {
//       if (platformIsRightMost(this.bottomLine.length-1, this.bottomLine)) {
//         this.updateRightLine(topLeft, bottomRight, true);
//       }
//       if (platformIsLeftMost(this.bottomLine.length-1, this.bottomLine)) {
//         this.updateLeftLine(topLeft, bottomRight, true);
//       }
//     } 
//     //referral block must be after push and before sort
//     this.bottomLine = sortTopToBottom(this.bottomLine);
//   };

//   this.updateRightLine = function(topLeft, bottomRight, referredByAdjacent) {
//     let topRightMargin = new Coord(bottomRight.x + margin, topLeft.y - margin);
//     let bottomRightMargin = new Coord(bottomRight.x + margin, bottomRight.y + margin);
//     for (let i=0; i < this.rightLine.length; i++) {
//       //remove any left-more platforms within height
//       if (this.rightLine[i].a.y >= topRightMargin.y && this.rightLine[i].b.y <= bottomRightMargin.y) {
//         this.rightLine.splice(i, 1);
//         i--;
//         continue;
//       }
//       //split left-more platform that is taller
//       if (this.rightLine[i].a.y < topRightMargin.y && this.rightLine[i].b.y > bottomRightMargin.y) {
//         this.rightLine.push(new Platform(
//           new Coord(this.rightLine[i].b.x, bottomRightMargin.y), 
//           new Coord(this.rightLine[i].b.x, this.rightLine[i].b.y)
//         ));
//         this.rightLine[i].b.y = topRightMargin.y;
//       }
//       //clip left-more platform crossing top edge
//       if (this.rightLine[i].b.y > topRightMargin.y && this.rightLine[i].b.y < bottomRightMargin.y) {
//         this.rightLine[i].b = new Coord(this.rightLine[i].b.x, topRightMargin.y);
//       }
//       //clip left-more platform crossing lower edge
//       if (this.rightLine[i].a.y < bottomRightMargin.y && this.rightLine[i].a.y > topRightMargin.y) {
//         this.rightLine[i].a = new Coord(this.rightLine[i].a.x, bottomRightMargin.y);
//       }
//     }
//     this.rightLine.push(new Platform(topRightMargin, bottomRightMargin));
//     //check if over edge, and if so, have adjacent side update too
//     if (!referredByAdjacent) {
//       if (platformIsTopMost(this.rightLine.length-1, this.rightLine)) {
//         this.updateTopLine(topLeft, bottomRight, true);
//       }
//       if (platformIsBottomMost(this.rightLine.length-1, this.rightLine)) {
//         this.updateBottomLine(topLeft, bottomRight, true);
//       }
//     } 
//     //referral block must be after push and before sort
//     this.rightLine = sortLeftToRight(this.rightLine);
//   };

//   this.updateLeftLine = function(topLeft, bottomRight, referredByAdjacent) {
//     let topLeftMargin = new Coord(topLeft.x - margin, topLeft.y - margin);
//     let bottomLeftMargin = new Coord(topLeft.x - margin, bottomRight.y + margin);
//     for (let i=0; i < this.leftLine.length; i++) {
//       //remove any right-more platforms within height
//       if (this.leftLine[i].a.y >= topLeftMargin.y && this.leftLine[i].b.y <= bottomLeftMargin.y) {
//         this.leftLine.splice(i, 1);
//         i--;
//         continue;
//       }
//       //split right-more platform that is taller
//       if (this.leftLine[i].a.y < topLeftMargin.y && this.leftLine[i].b.y > bottomLeftMargin.y) {
//         this.leftLine.push(new Platform(
//           new Coord(this.leftLine[i].b.x, bottomLeftMargin.y), 
//           new Coord(this.leftLine[i].b.x, this.leftLine[i].b.y)
//         ));
//         this.leftLine[i].b.y = topLeftMargin.y;
//       }
//       //clip right-more platform crossing top edge
//       if (this.leftLine[i].b.y > topLeftMargin.y && this.leftLine[i].b.y < bottomLeftMargin.y) {
//         this.leftLine[i].b = new Coord(this.leftLine[i].b.x, topLeftMargin.y);
//       }
//       //clip right-more platform crossing lower edge
//       if (this.leftLine[i].a.y < bottomLeftMargin.y && this.leftLine[i].a.y > topLeftMargin.y) {
//         this.leftLine[i].a = new Coord(this.leftLine[i].a.x, bottomLeftMargin.y);
//       }
//     }
//     this.leftLine.push(new Platform(topLeftMargin, bottomLeftMargin));
//     //check if over edge, and if so, have adjacent side update too
//     if (!referredByAdjacent) {
//       if (platformIsTopMost(this.leftLine.length-1, this.leftLine)) {
//         this.updateTopLine(topLeft, bottomRight, true);
//       }
//       if (platformIsBottomMost(this.leftLine.length-1, this.leftLine)) {
//         this.updateBottomLine(topLeft, bottomRight, true);
//       }
//     } 
//     //referral block must be after push and before sort
//     this.leftLine = sortRightToLeft(this.leftLine);
//   };

//   this.addMotion = function(topLeft, bottomRight, canvas) {
//     /*
//       platform coordinates entered left to right or top to bottom.
//     */
//     this.topLine.push(new Platform(
//       new Coord(0, topLeft.y - margin), 
//       new Coord(canvas.width - 1, topLeft.y - margin)
//     ));
//     this.rightLine.push(new Platform(
//       new Coord(bottomRight.x + margin, 0), 
//       new Coord(bottomRight.x + margin, canvas.height - 1)
//     ));
//     this.bottomLine.push(new Platform(
//       new Coord(0, bottomRight.y + margin), 
//       new Coord(canvas.width - 1, bottomRight.y + margin)
//     ));
//     this.leftLine.push(new Platform(
//       new Coord(topLeft.x - margin, 0), 
//       new Coord(topLeft.x - margin, canvas.height - 1)
//     ));
//   };

//   this.reset = function() {
//     this.topLine = [];
//     this.rightLine = [];
//     this.bottomLine = [];
//     this.leftLine = [];
//   }
// }