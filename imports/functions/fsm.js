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
    //array of lines intersecting for each side of marginBox
    let linesIntersecting = [[],[],[],[]];
    let marginBoxSideCrossed
    //use this length that way when we add new lines they dont have to get checked
    let length = this.lineArray.length;
    for (let i = 0; i < length; i++) {
      //lineEnters returns -1 if false, or side / index of marginBox if true
      sideCrossed = lineEnters(this.lineArray[i], marginBox);
      if (sideCrossed >=0) {
        truncateOrSplit(this.lineArray[i], sideCrossed, marginBox, this.lineArray, linesIntersecting);
      }
    }
    //sort arrays of lines intersecting margin box sides from left to right or top to bottom
    linesIntersecting[0].sort(function(first, second) {
      if (first.b.x > second.b.x) {
        return 1;
      } 
      return -1;
    });
    linesIntersecting[1].sort(function(first, second) {
      if (first.b.y > second.b.y) {
        return 1;
      } 
      return -1;
    });
    linesIntersecting[2].sort(function(first, second) {
      if (first.b.x > second.b.x) {
        return 1;
      } 
      return -1;
    });
    linesIntersecting[3].sort(function(first, second) {
      if (first.b.y > second.b.y) {
        return 1;
      } 
      return -1;
    });
    if (linesIntersecting[0].length > 1) {
      // //if first line intersecting top of margin box faces right
      // if (linesIntersecting[0][0].side == 1) {
      //   //starting at second, for all lines intersecting top of margin box
      //   for (let i = 1; i < linesIntersecting[0].length; i++) {
      //     //if drawing first line, use existing marginBox line
      //     if (i == 1) {
      //       marginBox[0].a.x = linesIntersecting[0][i-1].b.x;
      //       marginBox[0].b.x = linesIntersecting[0][i].b.x;
      //     } else {
      //       //for every other one, draw line from previous one to that one
      //       if (i%2 == 1) {
      //         //draw a line from previous one
      //         this.lineArray.push(new Line(new Coord(linesIntersecting[0][i-1].b.x, linesIntersecting[0][i-1].b.y), new Coord(linesIntersecting[0][i].b.x, linesIntersecting[0][i].b.y)))
      //       } else {
      //         if (i == linesIntersecting[0].length-1) {
      //           marginBox.a.x = linesIntersecting[0][i].b.x;
      //         }
      //       }
      //     }
      //   }
      // } else {
      //   for (let i = 0; i < linesIntersecting[0].length; i++) {
      //     if (i == 0) {
      //       marginBox[0].b.x = linesIntersecting[0][i].b.x;
      //     } else {
      //       if (i%2 == 0) {
      //         this.lineArray.push(new Line(new Coord(linesIntersecting[0][i-1].b.x, linesIntersecting[0][i-1].b.y), new Coord(linesIntersecting[0][i].b.x, linesIntersecting[0][i].b.y)))
      //       }else {
      //         if (i == linesIntersecting[0].length-1) {
      //           marginBox[0].a.x = linesIntersecting[0][i].b.x;
      //         }
      //       }
      //     }
      //   }
      // }
    }
    if (linesIntersecting[1].length > 1) {
      
    }
    if (linesIntersecting[2].length > 1) {
      
    }
    if (linesIntersecting[3].length > 1) {
      
    }
  }
}

function truncateOrSplit(line, sideCrossed, marginBox, lineArray, linesIntersecting) {
  switch(sideCrossed) {
    case 0:
      //if line also crosses marginBox bottom
      if (linesCross(line, marginBox[2])) {
        //add new line below marginBox
        let newLength = lineArray.push(new Line(new Coord(line.b.x, marginBox[2].a.y), new Coord(line.b.x, line.b.y), line.side));
        //add new line to array of lines intersecting marginBox bottom
        linesIntersecting[2].push(lineArray[newLength - 1]);
      }
      //truncate line to be above marginBox
      line.b.y = marginBox[0].a.y;
      //add line to array of lines intersecting marginBox top
      linesIntersecting[0].push(line);
      break;
    case 1:
      if (linesCross(line, marginBox[3])) {
        //add new line to left of marginBox
        let newLength = lineArray.push(new Line(new Coord(line.a.x,line.a.y), new Coord(marginBox[3].b.x, line.b.y), line.side));
        linesIntersecting[3].push(lineArray[newLength - 1]);
      }
      line.a.x = marginBox[1].a.x;
      linesIntersecting[1].push(line);
      break;
    case 2:
      if (linesCross(line, marginBox[0])) {
        //add new line above marginBox
        let newLength = lineArray.push(new Line(new Coord(line.a.x,line.a.y), new Coord(line.b.x, marginBox[0].b.y), line.side));
        linesIntersecting[0].push(lineArray[newLength - 1]);
      }
      line.a.y = marginBox[2].a.y;
      linesIntersecting[2].push(line);
      break;
    case 3:
      if (linesCross(line, marginBox[1])) {
        //add new line to right of marginBox
        let newLength = lineArray.push(new Line(new Coord(marginBox[1].a.x, line.a.y), new Coord(line.b.x, line.b.y), line.side));
        linesIntersecting[1].push(lineArray[newLength - 1]);
      }
      line.b.x = marginBox[3].a.x;
      linesIntersecting[3].push(line);
      break;
  }
}

function lineEnters(line, marginBox) {
  for(let i=0; i < marginBox.length; i++) {
    if (linesCross(line, marginBox[i])) {
      return i;
    }
  }
  return -1;
}

function oppositeSide(side) {
  return (side + 2) % 4;
}

function linesCross(firstLine, secondLine) {
  //if firstLine is horizontal
  if (firstLine.a.y == firstLine.b.y) {
    if (firstLine.a.x < secondLine.a.x && secondLine.a.x < firstLine.b.x && secondLine.a.y < firstLine.a.y && firstLine.a.y < secondLine.b.y) {
      return true;
    } else {
      return false;
    }
  //firstLine is vertical
  } else {
    if (secondLine.a.x < firstLine.a.x && firstLine.a.x < secondLine.b.x && firstLine.a.y < secondLine.a.y && secondLine.a.y < firstLine.b.y) {
      return true;
    } else {
      return false;
    }
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

function truncateOrSplitDEPRECATED(lineToCross, lineDefiningSide, lineArray, marginBox) {
  let lineToSpliceOut = false;
  //handles if two lines of new marginBox cross same line
  otherCrossingLine = getOtherCrossingLine(lineToCross, lineDefiningSide, lineArray, marginBox);
  if (typeof otherCrossingLine != "undefined") {
    switch (lineDefiningSide.side) {
      case 0:
        lineArray.push(new Line(new Coord(lineToCross.a.x, otherCrossingLine.a.y), new Coord(lineToCross.b.x, lineToCross.b.y), lineToCross.side));
        //trim otherCrossingLine
        if (lineToCross.side == 1) {
          lineToSpliceOut = 3;
          otherCrossingLine.a.x = lineToCross.a.x;
        } else {
          lineToSpliceOut = 1;
          otherCrossingLine.b.x = lineToCross.a.x;
        }
        break;
      case 1:
        lineArray.push(new Line(new Coord(lineToCross.a.x, lineToCross.a.y), new Coord(otherCrossingLine.a.x, lineToCross.a.y), lineToCross.side));
        //trim otherCrossingLine
        if (lineToCross.side == 0) {
          lineToSpliceOut = 2;
          otherCrossingLine.b.y = lineToCross.a.y;
        } else {
          lineToSpliceOut = 0;
          otherCrossingLine.a.y = lineToCross.a.y;
        }
        break;
      case 2:
        lineArray.push(new Line(new Coord(lineToCross.a.x, lineToCross.a.y), new Coord(lineToCross.a.x, otherCrossingLine.a.y), lineToCross.side));
        //trim otherCrossingLine
        if (lineToCross.side == 1) {
          lineToSpliceOut = 3;
          otherCrossingLine.a.x = lineToCross.a.x;
        } else {
          lineToSpliceOut = 1;
          otherCrossingLine.b.x = lineToCross.a.x;
        }
        break;
      case 3:
        lineArray.push(new Line(new Coord(otherCrossingLine.a.x, lineToCross.a.y), new Coord(lineToCross.b.x, lineToCross.b.y), lineToCross.side));
        //trim otherCrossingLine
        if (lineToCross.side == 0) {
          lineToSpliceOut = 2;
          otherCrossingLine.b.y = lineToCross.a.y;
        } else {
          lineToSpliceOut = 0;
          otherCrossingLine.a.y = lineToCross.a.y;
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
  return lineToSpliceOut;
}

function getOtherCrossingLine(lineToCross, lineDefiningSide, lineArray, marginBox) {
  let side = oppositeSideFromLine(lineDefiningSide);
  let lineToReturn;
  for (let i = 0; i < marginBox.length; i ++) {
    if (marginBox[i].side === side) {
      if (linesCross(marginBox[i], lineToCross)) {
        switch (lineDefiningSide.side) {
          case 0:
            if (lineDefiningSide.a.y < marginBox[i].a.y) {
              lineToReturn = marginBox[i];
            }
            break;
          case 1:
            if (lineDefiningSide.a.x > marginBox[i].a.x) {
              lineToReturn = marginBox[i];
            }
            break;
          case 2:
            if (lineDefiningSide.a.y > marginBox[i].a.y) {
              lineToReturn = marginBox[i];
            }
            break;
          case 3:
            if (lineDefiningSide.a.x < marginBox[i].a.x) {
              lineToReturn = marginBox[i];
            }
            break;
        }
      }
    } 
  }
  return lineToReturn;
}

function oppositeSideFromLine(line) {
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










