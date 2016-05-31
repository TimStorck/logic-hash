import { Coord } from './objects.js';
import { Line } from './objects.js';
import { drawFSModel } from './drawing.js';
import { Settings } from '../api/collections/settings.js';
import { clearCanvas } from './drawing.js';

//maintains outline of filled space plus specified margin distance
export function filledSpaceModel(canvas, canCtx) {
  const margin = 17;

  //this is the outline of the filled space
  this.lineArray = [];

  this.canCtx = canCtx;
  this.canvas = canvas;

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

  //fsm instantiated before canvas exists in dom, so fsm gets canvas later [used only when debugging setting applied]
  this.setCanCtx = function(canCtx) {
    this.canCtx = canCtx;
  }

  //fsm instantiated before canvas exists in dom, so fsm gets canvas later [used only when debugging setting applied]
  this.setCanvas = function(canvas) {
    this.canvas = canvas;
  }

  /*
    a new marginBox being added to the outline would overlap the edges of the prior 
    filled space outline. this method takes care of that overlap to maintain a 
    cohesive outline of the filled space
  */
  this.trimOverlap = function(marginBox) {
    //array of lines intersecting for each side of marginBox
    let linesInter = [[],[],[],[]];
    /*
        TRUNCATE OR SPLIT

        any line from prior filled space outline crossing a marginBox line gets truncated, 
        or split if it passes all the way through, and added to list
        of intersecting lines
    */
    //use this length that way when we add new lines they dont have to get checked
    let length = this.lineArray.length;
    for (let i = 0; i < length; i++) {
      //lineEnters returns -1 if false, or side / index of marginBox if true
      sideCrossed = lineEnters(this.lineArray[i], marginBox);
      if (sideCrossed >=0) {
        truncateOrSplit(this.lineArray[i], sideCrossed, marginBox, this.lineArray, linesInter);
      }
    }

    /*
      for development
    */
    try {
      if (Settings.findOne({name: "showOutlineWhileTrimming"}).value) {
        if (this.canCtx != null) {
          clearCanvas(this.canvas, this.canCtx);
          drawFSModel(this.canCtx);
        }
      }
    } catch (e) {
    }

    /*
        SORTING
    
        sort arrays of lines intersecting margin box sides from left to right or top to bottom
    */

    sortLinesInter(linesInter, true);

    /*
        REMOVAL - LA FROM MB

        remove prior outline lines totally within new marginBox
    */
    //remove lineArray lines within marginBox
    for (let i = 0; i < this.lineArray.length; i++) {
      if (this.lineArray[i].a.x > marginBox[0].a.x && this.lineArray[i].b.x < marginBox[0].b.x &&
        this.lineArray[i].a.y > marginBox[1].a.y && this.lineArray[i].b.y < marginBox[1].b.y) {
        this.lineArray.splice(i, 1);
        i--;
      }
    }


    /*
      for development
    */
    try {
      if (Settings.findOne({name: "showOutlineWhileTrimming"}).value) {
        if (this.canCtx != null) {
          clearCanvas(this.canvas, this.canCtx);
          drawFSModel(this.canCtx);
        }
      }
    } catch (e) {
    }

    /*
        LINE OVERLAP

        consolidate overlapping lines and remove lines severed by line overlap consolidation
        (removal section doesn't test for lines that intersect edges, only lines within)
    */

    //line overlap array
    let lolArray = [
      {"bChanged": false, "aChanged": false},
      {"bChanged": false, "aChanged": false},
      {"bChanged": false, "aChanged": false},
      {"bChanged": false, "aChanged": false}
    ];
    //for each marginBox side
    mbLoop:
    for (let i = 0; i < 4; i++) {
      //for each lineArray line
      for (let j = 0; j < this.lineArray.length; j++) {
        //dont compare line to itself
        if (marginBox[i] !== this.lineArray[j]) {
          //if lines overlap
          if (linesOverlap(marginBox[i], this.lineArray[j])) {
            let oppSide = oppositeSide(i);
            //if overlapping lines face each-other
            if (this.lineArray[j].side === marginBox[oppSide].side) {
              //if marginBox line is within lineArray line
              if ((this.lineArray[j].a.y === this.lineArray[j].b.y && 
                this.lineArray[j].a.x < marginBox[i].a.x && marginBox[i].b.x < this.lineArray[j].b.x) ||
                (this.lineArray[j].a.x === this.lineArray[j].b.x && 
                this.lineArray[j].a.y < marginBox[i].a.y && marginBox[i].b.y < this.lineArray[j].b.y)) {
                  //segment lineArray line
                  this.lineArray.push(new Line(marginBox[i].b, this.lineArray.b, this.lineArray[j].side));
                  this.lineArray[j].b = marginBox[i].a;
                  //remove mb line
                  findAndRemoveLine(this.lineArray, marginBox[i]);
                  //continue to next mb line
                  continue mbLoop;
              } else {
                //if lineArray line is within marginBox line
                if ((this.lineArray[j].a.y === this.lineArray[j].b.y &&
                  marginBox[i].a.x < this.lineArray[j].a.x && this.lineArray[j].b.x < marginBox[i].b.x) ||
                  (this.lineArray[j].a.x === this.lineArray[j].b.x &&
                  marginBox[i].a.y < this.lineArray[j].a.y && this.lineArray[j].b.y < marginBox[i].b.y)) {
                    //get lineArray lines connecting to loverlapping lineArray line
                    let connectingLALine1 = this.lineArray[connectingLALine(this.lineArray, this.lineArray[j], this.lineArray[j].a)];
                    let connectingLALine2 = this.lineArray[connectingLALine(this.lineArray, this.lineArray[j], this.lineArray[j].b)];
                    //remove overlapping lineArray line
                    this.lineArray.splice(j, 1);
                    j--;
                    //if connecting line is inside marginBox and doesn't protrude opposite marginBox side
                    if (lineIsInside(connectingLALine1, marginBox[i])) {
                      if (linesInter[oppSide].indexOf(connectingLALine1) === -1) {
                        findAndRemoveLine(this.lineArray, connectingLALine1);
                      }
                    } else {
                      linesInter[i].push(connectingLALine1);
                      sortLinesInter(linesInter, false, i);
                    }
                    //if connecting line is inside marginBox and doesn't protrude opposite marginBox side
                    if (lineIsInside(connectingLALine2, marginBox[i])) {
                      if (linesInter[oppSide].indexOf(connectingLALine2) === -1) {
                        findAndRemoveLine(this.lineArray, connectingLALine2);
                      }
                    } else {
                      linesInter[i].push(connectingLALine2);
                      sortLinesInter(linesInter, false, i);
                    }
                    continue;
                }
              }
              //overlapping lines must be staggered
              //if lineArray line comes first
              if ((this.lineArray[j].a.y === this.lineArray[j].b.y && 
                this.lineArray[j].a.x < marginBox[i].a.x) ||
                (this.lineArray[j].a.x === this.lineArray[j].b.x && 
                this.lineArray[j].a.y < marginBox[i].a.y)) {
                  //adjust coordinates that cross
                  let lineArrayLineEnd = this.lineArray[j].b;
                  this.lineArray[j].b = marginBox[i].a;
                  marginBox[i].a = lineArrayLineEnd;
                  //take care of connecting lineArray line
                  let connectingLALineIndex = connectingLALine(this.lineArray, marginBox[i], lineArrayLineEnd);
                  //if connecting line is inside marginBox and doesn't protrude opposite marginBox side
                  if (lineIsInside(this.lineArray[connectingLALineIndex], marginBox[i])) {
                    if (linesInter[oppSide].indexOf(this.lineArray[connectingLALineIndex]) === -1) {
                      this.lineArray.splice(connectingLALineIndex, 1);
                      j--;
                    }
                  } else {
                    linesInter[i].push(this.lineArray[connectingLALineIndex]);
                    sortLinesInter(linesInter, false, i);
                  }
              }
              continue;
            }
            //end of overlapping-lines-face-each-other section
            let overlappingLALine = this.lineArray[j];
            let connectingLALineIndex;
            let connectingMBLineIndex;
            //if lineArray line coordinate A comes first
            if (this.lineArray[j].a.x < marginBox[i].a.x || this.lineArray[j].a.y < marginBox[i].a.y) {
              //stretch marginBox line to begin at lineArray line coordinate A
              marginBox[i].a.x = this.lineArray[j].a.x;
              marginBox[i].a.y = this.lineArray[j].a.y;
              lolArray[i].aChanged = true;
              //get index of lineArray line that was connected to the lineArray line being removed at the point that overlapped
              connectingLALineIndex = connectingLALine(this.lineArray, this.lineArray[j], this.lineArray[j].b);
              //get index of mb line that was connected to the point that was removed
              connectingMBLineIndex = connectingMBLine(marginBox[i], false);
            //if marginBox line coordinate A comes first
            } else {
              //if lineArray coordinate B comes last
              if (marginBox[i].b.x < this.lineArray[j].b.x || marginBox[i].b.y < this.lineArray[j].b.y) {
                //stretch marginBox line to end at lineArray line coordinate B
                marginBox[i].b.x = this.lineArray[j].b.x;
                marginBox[i].b.y = this.lineArray[j].b.y;
                lolArray[i].bChanged = true;
                //get index of lineArray line that was connected to the lineArray line being removed at the point that overlapped
                connectingLALineIndex = connectingLALine(this.lineArray, this.lineArray[j], this.lineArray[j].a);
                //get index of mb line that was connected to the point that was removed
                connectingMBLineIndex = connectingMBLine(marginBox[i], true);
              //if marginBox line coordinate B comes last, so lineArray line is contained within, i.e. lineArray line is short little line
              } else {
                //if overlapping lineArray line is within margin's length from right edge or bottom edge
                if (marginBox[i].a.x !== marginBox[i].b.x && marginBox[i].b.x - this.lineArray[j].a.x <= margin ||
                  marginBox[i].a.y !== marginBox[i].b.y && marginBox[i].b.y - this.lineArray[j].a.y <= margin) {
                    //stretch marginBox line to end at lineArray line coordinate B
                    marginBox[i].b.x = this.lineArray[j].b.x;
                    marginBox[i].b.y = this.lineArray[j].b.y;
                    lolArray[i].bChanged = true;
                    //get index of lineArray line that was connected to the lineArray line being removed at the point that overlapped
                    connectingLALineIndex = connectingLALine(this.lineArray, this.lineArray[j], this.lineArray[j].a);
                    //get index of mb line that was connected to the point that was removed
                    connectingMBLineIndex = connectingMBLine(marginBox[i], true);
                //overlapping lineArray line must be within margin's length from left or top edge
                } else {
                  //stretch marginBox line to end at lineArray line coordinate B
                  marginBox[i].a.x = this.lineArray[j].a.x;
                  marginBox[i].a.y = this.lineArray[j].a.y;
                  lolArray[i].aChanged = true;    
                  //get index of lineArray line that was connected to the lineArray line being removed at the point that overlapped
                  connectingLALineIndex = connectingLALine(this.lineArray, this.lineArray[j], this.lineArray[j].b);
                  //get index of mb line that was connected to the point that was removed
                  connectingMBLineIndex = connectingMBLine(marginBox[i], false);
                }
              }
            }
            //if lineArray line connected to consolidated lineArray line wasn't removed already
            if (connectingLALineIndex >= 0) {
              //if lineArray line connected to consolidated lineArray line doesn't cross marginBox line opposite the consolidated marginbox line
              if (linesInter[oppSide].indexOf(this.lineArray[connectingLALineIndex]) === -1) {
                if (lineIsInside(this.lineArray[connectingLALineIndex], marginBox[i])) {
                  this.lineArray.splice(connectingLALineIndex, 1);
                  j--;
                } else {
                  linesInter[i].push(this.lineArray[connectingLALineIndex]);
                  sortLinesInter(linesInter, false, i);
                }
              }
            }
            //remove mb line if not intersected
            if (linesInter[connectingMBLineIndex].length === 0) {
              findAndRemoveLine(this.lineArray, marginBox[connectingMBLineIndex]);
            }
            //remove lineArray line
            findAndRemoveLine(this.lineArray, overlappingLALine);
            j--;
          }
        }
      }
    }

    /*
      for development
    */
    try {
      if (Settings.findOne({name: "showOutlineWhileTrimming"}).value) {
        if (this.canCtx != null) {
          clearCanvas(this.canvas, this.canCtx);
          drawFSModel(this.canCtx);
        }
      }
    } catch (e) {
    }

    /*
        REMOVAL - MB FROM LA

        remove marginBox lines totally within outline
    */
    //remove marginBox lines within lineArray outline
    for (let i = 0; i < 4; i++) {
      let opp = oppositeSide(i);
      let indexCW = adjCW(i);
      let indexCCW = adjCCW(i);
      //skip removed sides
      if (typeof marginBox[i] != "undefined") {
        //if nothing intersects this side of the marginBox and no line overlap consolidation was done on it
        if (linesInter[i].length === 0 && !lolArray[i].aChanged && !lolArray[i].bChanged) {
          //if no sides intersected
          if (linesInter[opp].length === 0 &&
            linesInter[indexCW].length === 0 &&
            linesInter[indexCCW].length === 0) {
            //if no side consolidated for line overlap
            if (!(lolArray[0].aChanged || lolArray[0].bChanged ||
              lolArray[1].aChanged || lolArray[1].bChanged ||
              lolArray[2].aChanged || lolArray[2].bChanged ||
              lolArray[3].aChanged || lolArray[3].bChanged)) {
              //remove all marginBox lines
              findAndRemoveLine(this.lineArray, marginBox[0]);
              findAndRemoveLine(this.lineArray, marginBox[1]);
              findAndRemoveLine(this.lineArray, marginBox[2]);
              findAndRemoveLine(this.lineArray, marginBox[3]);
              //end this section
              break;
            }
          }
          //if adjacent counter clockwise is intersected
          if (linesInter[indexCCW].length > 0) {
            //if intersecting line faces away
            if ( ( (i===0||i===3) && firstFacesOthers(linesInter[indexCCW][0] ) ) ||
              ( (i===1||i===2) && lastFacesOthers(linesInter[indexCCW][linesInter[indexCCW].length - 1]) ) ) {
                findAndRemoveLine(this.lineArray, marginBox[i]);
                continue;
            }
          //if adjacent counter clockwise is not intersected
          } else {
            //if line overlap consolidation was done on opposite side at that end
            if ( ( (i===0||i===1) && lolArray[opp].aChanged) ||
              ( (i===2||i===3) && lolArray[opp].bChanged) ) {
                findAndRemoveLine(this.lineArray, marginBox[i]);
                continue;
            } else {
              //if opposite side is intersected
              if (linesInter[opp].length > 0) {
                //if intersecting line at that end faces others
                if ( ( (i===0||i===1) && firstFacesOthers(linesInter[opp][0]) ) ||
                  ( (i===2||i===3) && lastFacesOthers(linesInter[opp][linesInter[opp].length - 1]) ) ) {
                    findAndRemoveLine(this.lineArray, marginBox[i]);
                    continue;
                }
              }
            }
          }
          //if adjacent clockwise is intersected
          if (linesInter[indexCW].length > 0) {
            //if intersecting line faces away
            if ( ( (i===0||i===3) && firstFacesOthers(linesInter[indexCW][0] ) ) ||
              ( (i===1||i===2) && lastFacesOthers(linesInter[indexCW][linesInter[indexCW].length - 1]) ) ) {
                findAndRemoveLine(this.lineArray, marginBox[i]);
                continue;
            }
          //if adjacent clockwise is not intersected
          } else {
            //if line overlap consolidation was done on opposite side at that end
            if ( ( (i===0||i===1) && lolArray[opp].bChanged) ||
              ( (i===2||i===3) && lolArray[opp].aChanged) ) {
                findAndRemoveLine(this.lineArray, marginBox[i]);
                continue;
            } else {
              //if opposite side is intersected
              if (linesInter[opp].length > 0) {
                //if intersecting line at that end faces others
                if ( ( (i===0||i===1) && lastFacesOthers(linesInter[opp][linesInter[opp].length - 1]) ) ||
                  ( (i===2||i===3) && firstFacesOthers(linesInter[opp][0]) ) ) {
                    findAndRemoveLine(this.lineArray, marginBox[i]);
                    continue;
                }
              }
            }
          }
        }
      }
    }

    /*
      for development
    */
    try {
      if (Settings.findOne({name: "showOutlineWhileTrimming"}).value) {
        if (this.canCtx != null) {
          clearCanvas(this.canvas, this.canCtx);
          drawFSModel(this.canCtx);
        }
      }
    } catch (e) {
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

function sortLinesInter(linesInter, sortAll, side) {
  if(sortAll) {
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
  } else {
    switch (side) {
      case 0:
        linesInter[0].sort(function(first, second) {
          if (first.b.x > second.b.x) {
            return 1;
          } 
          return -1;
        });
        break;
      case 1:
        linesInter[1].sort(function(first, second) {
          if (first.b.y > second.b.y) {
            return 1;
          } 
          return -1;
        });
        break;
      case 2:
        linesInter[2].sort(function(first, second) {
          if (first.b.x > second.b.x) {
            return 1;
          } 
          return -1;
        });
        break;
      case 3:
        linesInter[3].sort(function(first, second) {
          if (first.b.y > second.b.y) {
            return 1;
          } 
          return -1;
        });
        break;
    }
  }
}

function lineIsInside(laLine, mbLine) {
  switch (mbLine.side) {
    case 0:
      if (laLine.b.y > mbLine.b.y) {
        return true;
      }
      break;
    case 1:
      if (laLine.a.x < mbLine.b.x) {
        return true;
      }
      break;
    case 2:
      if (laLine.a.y < mbLine.b.y) {
        return true;
      }
      break;
    case 3:
      if (laLine.b.x > mbLine.b.x) {
        return true;
      }
      break;
  }
  return false;
}

//used in line overlap section of trimOverlap. returns index of connecting lineArray line
function connectingLALine(lineArray, line, point) {
  for (let i = 0; i < lineArray.length; i++) {
    if (lineArray[i] !== line) {
      if (lineArray[i].a.equals(point) || lineArray[i].b.equals(point)) {
        return i;
      }
    }
  }
  return -1;
}
 
//returns adjacent line of marginBox. bSide is a boolean indicating if you want the side connecting at the original side's b coordinate
function connectingMBLine(line, bSide) {
  switch (line.side) {
    case 0:
      if (bSide) {
        return 1;
      } else {
        return 3;
      }
      break;
    case 1:
      if (bSide) {
        return 2;
      } else {
        return 0;
      }
      break;
    case 2:
      if (bSide) {
        return 1;
      } else {
        return 3;
      }
      break;
    case 3:
      if (bSide) {
        return 2;
      } else {
        return 0;
      }
      break;
  }
}

function oppositeSide(side) {
  return (side + 2) % 4;
}

//the line objects in the marginBox array are put in the lineArray array, this finds the line object instance
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

//to test last intersecting line in array of lines intersecting marginBox side, sorted from left to right or top to bottom
function lastFacesOthers(intersectingLine) {
  if (intersectingLine.side === 3 || intersectingLine.side === 0) {
    return true;
  }
  return false;
}

//to test first intersecting line in array of lines intersecting marginBox side, sorted from left to right or top to bottom
function firstFacesOthers(intersectingLine) {
  if (intersectingLine.side === 1 || intersectingLine.side === 2) {
    return true;
  }
  return false;
}

//cuts off any line from prior lineArray outline that enters new marginBox, or splits it if it traverses the whole marginBox
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
