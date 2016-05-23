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
  //this is the outline of the filled space
  this.lineArray = [];

  this.reset = function() {
    this.lineArray = [];
  }

  //marginBox is perimeter coordinates of post div with margin space added
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
    let linesInter = [[],[],[],[]];
    let marginBoxSideCrossed
    //use this length that way when we add new lines they dont have to get checked
    let length = this.lineArray.length;

    /*
        TRUNCATE OR SPLIT

        any line from lineArray crossing a marginBox line gets truncated, 
        or split if it passes all the way through, and added to list
        of intersecting lines
    */
    for (let i = 0; i < length; i++) {
      //lineEnters returns -1 if false, or side / index of marginBox if true
      sideCrossed = lineEnters(this.lineArray[i], marginBox);
      if (sideCrossed >=0) {
        truncateOrSplit(this.lineArray[i], sideCrossed, marginBox, this.lineArray, linesInter);
      }
    }
    /*
        SORTING
    
        sort arrays of lines intersecting margin box sides from left to right or top to bottom
    */
    linesInter[0].sort(function(first, second) {
      if (first.b.x > second.b.x) {
        return 1;
      } 
      return -1;
    });
    linesInter[1].sort(function(first, second) {
      if (first.b.y > second.b.y) {
        return 1;
      } 
      return -1;
    });
    linesInter[2].sort(function(first, second) {
      if (first.b.x > second.b.x) {
        return 1;
      } 
      return -1;
    });
    linesInter[3].sort(function(first, second) {
      if (first.b.y > second.b.y) {
        return 1;
      } 
      return -1;
    });
    /*
        REMOVAL

        remove marginBox lines within outline, and outline lines within marginBox
    */
    //remove lineArray lines within marginBox
    for (let i = 0; i < this.lineArray.length; i++) {
      if (this.lineArray[i].a.x > marginBox[0].a.x && this.lineArray[i].b.x < marginBox[0].b.x &&
        this.lineArray[i].a.y > marginBox[1].a.y && this.lineArray[i].b.y < marginBox[1].b.y) {
        this.lineArray.splice(i, 1);
        i--;
      }
    }
    //remove marginBox lines within lineArray outline
    for (let i = 0; i < 4; i++) {
      //if nothing intersects this side of the marginBox
      if (linesInter[i].length === 0) {
        //if that sides adjacent sides are intersected
        if (linesInter[adjCCW(i)].length > 0 && linesInter[adjCW(i)].length > 0) {
          //if the adjacent sides' closest intersecting lines face away
          switch(i) {
            case 0:
              if (firstFacesOthers(linesInter[adjCCW(i)][0]) && firstFacesOthers(linesInter[adjCW(i)][0])) {
                findAndRemoveLine(this.lineArray, marginBox[i]);
              }
              break;
            case 1:
              if (lastFacesOthers(linesInter[adjCCW(i)][linesInter[adjCCW(i)].length - 1]) && lastFacesOthers(linesInter[adjCW(i)][linesInter[adjCW(i)].length - 1])) {
                findAndRemoveLine(this.lineArray, marginBox[i]);
              }
              break;
            case 2:
              if (lastFacesOthers(linesInter[adjCCW(i)][linesInter[adjCCW(i)].length - 1]) && lastFacesOthers(linesInter[adjCW(i)][linesInter[adjCW(i)].length - 1])) {
                findAndRemoveLine(this.lineArray, marginBox[i]);
              }
              break;
            case 3:
              if (firstFacesOthers(linesInter[adjCCW(i)][0]) && firstFacesOthers(linesInter[adjCW(i)][0])) {
                findAndRemoveLine(this.lineArray, marginBox[i]);
              }
              break;
          }
        }
      }
    }
    /*
        LINE OVERLAP

        consolidate overlapping lines and remove lines orphaned by line overlap consolidation
        (removal section doesn't test for lines that intersect edges, only lines within)
    */
    //line overlap array holds objects describing line overlap consolidation that may have occurred for marginBox
    let lolArray = [{},{},{},{}];
    //for each marginBox side
    for (let i = 0; i < 4; i++) {
      //skip removed sides
      if (typeof marginBox[i] != "undefined") {
        //for each lineArray line
        for (let j = 0; j < this.lineArray.length; j++) {
          //dont compare line to itself
          if (marginBox[i] != this.lineArray[j]) {
            //if lines overlap
            if (linesOverlap(marginBox[i], this.lineArray[j])) {
              //if lineArray line coordinate A comes first
              if (this.lineArray[j].a.x < marginBox[i].a.x || this.lineArray[j].a.y < marginBox[i].a.y) {
                //mark the points being cut out so they can be used to check for lines that should be removed
                lolArray[i] = {
                  "mBPtRemd": new Coord(marginBox[i].a.x, marginBox[i].a.y), 
                  "lAPtRemd": new Coord(this.lineArray[j].b.x, this.lineArray[j].b.y)
                };
                //stretch marginBox line to begin at lineArray line coordinate A
                marginBox[i].a.x = this.lineArray[j].a.x;
                marginBox[i].a.y = this.lineArray[j].a.y;
              //if marginBox line coordinate A comes first
              } else {
                //if lineArray coordinate B comes last
                if (marginBox[i].b.x < this.lineArray[j].b.x || marginBox[i].b.y < this.lineArray[j].b.y) {
                  lolArray[i] = {
                    "mBPtRemd": new Coord(marginBox[i].b.x, marginBox[i].b.y), 
                    "lAPtRemd": new Coord(this.lineArray[j].a.x, this.lineArray[j].a.y)
                  };
                  //stretch marginBox line to end at lineArray line coordinate B
                  marginBox[i].b.x = this.lineArray[j].b.x;
                  marginBox[i].b.y = this.lineArray[j].b.y;
                //if marginBox line coordinate B comes last, i.e. lineArray line is short little line
                } else {
                  //if overlapping lineArray line is within margin's length from right edge or bottom edge
                  if (marginBox[i].a.x !== marginBox[i].b.x && marginBox[i].b.x - this.lineArray[j].a.x <= margin ||
                    marginBox[i].a.y !== marginBox[i].b.y && marginBox[i].b.y - this.lineArray[j].a.y <= margin) {
                      //mark the points being cut out so they can be used to check for lines that should be removed
                      lolArray[i] = {
                        "mBPtRemd": new Coord(marginBox[i].b.x, marginBox[i].b.y), 
                        "lAPtRemd": new Coord(this.lineArray[j].a.x, this.lineArray[j].a.y)
                      };
                      //stretch marginBox line to end at lineArray line coordinate B
                      marginBox[i].b.x = this.lineArray[j].b.x;
                      marginBox[i].b.y = this.lineArray[j].b.y;
                  //overlapping lineArray line must be within margin's length from left or top edge
                  } else {
                    //mark the points being cut out so they can be used to check for lines that should be removed
                    lolArray[i] = {
                      "mBPtRemd": new Coord(marginBox[i].a.x, marginBox[i].a.y), 
                      "lAPtRemd": new Coord(this.lineArray[j].b.x, this.lineArray[j].b.y)
                    };
                    //stretch marginBox line to begin at lineArray line coordinate A
                    marginBox[i].a.x = this.lineArray[j].a.x;
                    marginBox[i].a.y = this.lineArray[j].a.y;
                  }
                }
              }
              //remove lineArray line
              this.lineArray.splice(j, 1);
              j--;
            }
          }
        }
      }
    }
    //check for lines orphaned by overlapping line consolidation
    //for each side of line overlap Array
    for (let i = 0; i < 4; i++) {
      //check if object is not empty and object of opposite side is also not empty
      if (typeof lolArray[i].mBPtRemd != "undefined" && typeof lolArray[oppositeSide(i)].mBPtRemd != "undefined") {
        //for each side of marginBox
        for (let j = 0; j < 4; j++) {
          //find marginBox line that matches points removed from marginBox overlapping lines
          if (marginBox[j].a.equals(lolArray[i].mBPtRemd) && marginBox[j].b.equals(lolArray[oppositeSide(i)].mBPtRemd)  || 
            marginBox[j].b.equals(lolArray[i].mBPtRemd) && marginBox[j].a.equals(lolArray[oppositeSide(i)].mBPtRemd) ) {
            //remove orphaned line
            findAndRemoveLine(this.lineArray, marginBox[j]);
            break;
          }
        }
        //find lineArray line that maches points removed from lineArray overlapping lines
        for (let j = 0; j < this.lineArray.length; j++) {
          if (this.lineArray[j].a.equals(lolArray[i].lAPtRemd) && this.lineArray[j].b.equals(lolArray[oppositeSide(i)].lAPtRemd) ||
            this.lineArray[j].b.equals(lolArray[i].lAPtRemd) && this.lineArray[j].a.equals(lolArray[oppositeSide(i)].lAPtRemd) ) {
            //remove orphaned line
            this.lineArray.splice(j, 1);
            break;
          }
        }
      }
    }
    /*
        SEGMENTING

        segment each side of marginBox if one or more lines intersect it

        explaining this algorithm is hard. if the first intersecting line faces the others,
        the segments are drawn one way, and otherwise they are drawn another way. the existing marginBox line
        should be used, rather than removing it and adding another line, so that adds a complication. 
        also, the end of a segment may be the next intersecting line, or it may be the end of what was the 
        marginBox line.
        this algorithm allows for any number of intersecting lines.
    */
    //if side 0 of marginBox has lines intersecting it from lineArray
    if (linesInter[0].length > 0) {
      //record second coordinate of marginBox side 0
      let mbb = new Coord(marginBox[0].b.x, marginBox[0].b.y);
      //if leftmost line intersecting side 0 (top) faces right
      if (firstFacesOthers(linesInter[0][0])){
        for (let i = 0; i < linesInter[0].length; i++) {
          //for even loop iterations only
          if (i%2 === 0) {
            //for first line, use existing line object in marginBox
            if (i === 0) {
              //if more intersecting lines after current
              if (i+1 < linesInter[0].length) {
                marginBox[0].a.x = linesInter[0][0].b.x;
                marginBox[0].b.x = linesInter[0][1].b.x;
              } else {
                marginBox[0].a.x = linesInter[0][0].b.x;
              }
            //after first segment drawn
            } else {
              if (i+1 < linesInter[0].length) {
                this.lineArray.push(new Line(new Coord(linesInter[0][i].b.x, linesInter[0][i].b.y), new Coord(linesInter[0][i+1].b.x, linesInter[0][i+1].b.y), marginBox[0].side));
              } else {
                this.lineArray.push(new Line(new Coord(linesInter[0][i].b.x, linesInter[0][i].b.y), new Coord(mbb.x, mbb.y), marginBox[0].side));
              }
            }
          }
        }
      } else {
        //if first line doesn't face others
        marginBox[0].b.x = linesInter[0][0].b.x;
        for (let i = 1; i < linesInter[0].length; i++) {
          if (i%2 === 1) {
            if (i+1 < linesInter[0].length) {
              this.lineArray.push(new Line(new Coord(linesInter[0][i].b.x, linesInter[0][i].b.y), new Coord(linesInter[0][i+1].b.x, linesInter[0][i+1].b.y), marginBox[0].side));
            } else {
              this.lineArray.push(new Line(new Coord(linesInter[0][i].b.x, linesInter[0][i].b.y), new Coord(mbb.x, mbb.y), marginBox[0].side));
            }
          }
        }
      }
    }
    if (linesInter[1].length > 0) {
      let mbb = new Coord(marginBox[1].b.x, marginBox[1].b.y);
      if (firstFacesOthers(linesInter[1][0])){
        for (let i = 0; i < linesInter[1].length; i++) {
          if (i%2 === 0) {
            //for first line, use existing line object in marginBox
            if (i === 0) {
              //if more intersecting lines after current
              if (i+1 < linesInter[1].length) {
                marginBox[1].a.y = linesInter[1][0].b.y;
                marginBox[1].b.y = linesInter[1][1].b.y;
              } else {
                marginBox[1].a.y = linesInter[1][0].b.y;
              }
            } else {
              if (i+1 < linesInter[1].length) {
                this.lineArray.push(new Line(new Coord(linesInter[1][i].a.x, linesInter[1][i].a.y), new Coord(linesInter[1][i+1].a.x, linesInter[1][i+1].a.y), marginBox[1].side));
              } else {
                this.lineArray.push(new Line(new Coord(linesInter[1][i].a.x, linesInter[1][i].a.y), new Coord(mbb.x, mbb.y), marginBox[1].side));
              }
            }
          }
        }
      } else {
        //if first line doesn't face others
        marginBox[1].b.y = linesInter[1][0].b.y;
        for (let i = 1; i < linesInter[1].length; i++) {
          if (i%2 === 1) {
            if (i+1 < linesInter[1].length) {
              this.lineArray.push(new Line(new Coord(linesInter[1][i].a.x, linesInter[1][i].a.y), new Coord(linesInter[1][i+1].a.x, linesInter[1][i+1].a.y), marginBox[1].side));
            } else {
              this.lineArray.push(new Line(new Coord(linesInter[1][i].a.x, linesInter[1][i].a.y), new Coord(mbb.x, mbb.y), marginBox[1].side));
            }
          }
        }
      }
    }
    if (linesInter[2].length > 0) {
      let mbb = new Coord(marginBox[2].b.x, marginBox[2].b.y);
      if (firstFacesOthers(linesInter[2][0])){
        for (let i = 0; i < linesInter[2].length; i++) {
          if (i%2 === 0) {
            if (i === 0) {
              if (i+1 < linesInter[2].length) {
                marginBox[2].a.x = linesInter[2][0].a.x;
                marginBox[2].b.x = linesInter[2][1].a.x;
              } else {
                marginBox[2].a.x = linesInter[2][0].a.x;
              }
            } else {
              if (i+1 < linesInter[2].length) {
                this.lineArray.push(new Line(new Coord(linesInter[2][i].a.x, linesInter[2][i].a.y), new Coord(linesInter[2][i+1].a.x, linesInter[2][i+1].a.y), marginBox[0].side));
              } else {
                this.lineArray.push(new Line(new Coord(linesInter[2][i].a.x, linesInter[2][i].a.y), new Coord(mbb.x, mbb.y), marginBox[2].side));
              }
            }
          }
        }
      } else {
        marginBox[2].b.x = linesInter[2][0].a.x;
        for (let i = 1; i < linesInter[2].length; i++) {
          if (i%2 === 1) {
            if (i+1 < linesInter[2].length) {
              this.lineArray.push(new Line(new Coord(linesInter[2][i].a.x, linesInter[2][i].a.y), new Coord(linesInter[2][i+1].a.x, linesInter[2][i+1].a.y), marginBox[2].side));
            } else {
              this.lineArray.push(new Line(new Coord(linesInter[2][i].a.x, linesInter[2][i].a.y), new Coord(mbb.x, mbb.y), marginBox[2].side));
            }
          }
        }
      }
    }
    if (linesInter[3].length > 0) {
      let mbb = new Coord(marginBox[3].b.x, marginBox[3].b.y);
      if (firstFacesOthers(linesInter[3][0])){
        for (let i = 0; i < linesInter[3].length; i++) {
          if (i%2 === 0) {
            //for first line, use existing line object in marginBox
            if (i === 0) {
              //if more intersecting lines after current
              if (i+1 < linesInter[3].length) {
                marginBox[3].a.y = linesInter[3][0].b.y;
                marginBox[3].b.y = linesInter[3][1].b.y;
              } else {
                marginBox[3].a.y = linesInter[3][0].b.y;
              }
            } else {
              if (i+1 < linesInter[3].length) {
                this.lineArray.push(new Line(new Coord(linesInter[3][i].b.x, linesInter[3][i].b.y), new Coord(linesInter[3][i+1].b.x, linesInter[3][i+1].b.y), marginBox[3].side));
              } else {
                this.lineArray.push(new Line(new Coord(linesInter[3][i].b.x, linesInter[3][i].b.y), new Coord(mbb.x, mbb.y), marginBox[3].side));
              }
            }
          }
        }
      } else {
        //if first line doesn't face others
        marginBox[3].b.y = linesInter[3][0].b.y;
        for (let i = 1; i < linesInter[3].length; i++) {
          if (i%2 === 1) {
            if (i+1 < linesInter[3].length) {
              this.lineArray.push(new Line(new Coord(linesInter[3][i].b.x, linesInter[3][i].b.y), new Coord(linesInter[3][i+1].b.x, linesInter[3][i+1].b.y), marginBox[3].side));
            } else {
              this.lineArray.push(new Line(new Coord(linesInter[3][i].b.x, linesInter[3][i].b.y), new Coord(mbb.x, mbb.y), marginBox[3].side));
            }
          }
        }
      }
    }
  }
}

function oppositeSide(side) {
  return (side + 2) % 4;
}

function findAndRemoveLine(lineArray, line) {
  for (let j = lineArray.length-1; j >= 0; j--) {
    if (lineArray[j] == line) {
      lineArray.splice(j, 1);
      break;
    }
  }
}

//for use with marginBox - adjacent side counter-clockwise
function adjCCW(side) {
  return (side + 3) % 4;
}

//for use with marginBox - adjacent side clockwise
function adjCW(side) {
  return (side + 1) % 4;
}

//to test last intersecting line in array of intersecting lines sorted from left to right or top to bottom
function lastFacesOthers(intersectingLine) {
  if (intersectingLine.side === 3 || intersectingLine.side === 0) {
    return true;
  }
  return false;
}

//to test first intersecting line in array of intersecting lines sorted from left to right or top to bottom
function firstFacesOthers(intersectingLine) {
  if (intersectingLine.side === 1 || intersectingLine.side === 2) {
    return true;
  }
  return false;
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

function linesOverlap(firstLine, secondLine) {
  if (firstLine.a.y === secondLine.a.y && firstLine.b.y === secondLine.b.y && firstLine.a.y === firstLine.b.y) {
    if (firstLine.a.x < secondLine.a.x && secondLine.a.x < firstLine.b.x) {
      return true;
    } else {
      if (secondLine.a.x < firstLine.a.x && firstLine.a.x < secondLine.b.x) {
        return true;
      }
    }
  }
  if (firstLine.a.x === secondLine.a.x && firstLine.b.x === secondLine.b.x && firstLine.a.x === firstLine.b.x) {
    if (firstLine.a.y < secondLine.a.y && secondLine.a.y < firstLine.b.y) {
      return true;
    } else {
      if (secondLine.a.y < firstLine.a.y && firstLine.a.y < secondLine.b.y) {
        return true;
      }
    }
  }
  return false;
}
