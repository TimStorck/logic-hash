import { fSModel } from './reactive.js';
import { Coord } from './objects.js';
import { Line } from './objects.js';
import { Area } from './objects.js';
import { radialDistance } from './measurements';
import { centerOf } from './measurements.js';
import { drawArea } from './drawing.js';
import { drawCircle } from './drawing.js';

export function findBestSpot(dimens, elicitorCenter, canCtx) {
  sortFSMLinesByCloseness(elicitorCenter);
  /*
    for development
  */
  // drawCircle(elicitorCenter, canCtx);
  // console.log("elicitorCenter: " + elicitorCenter.x + ", " + elicitorCenter.y);

  for (let i = 0; i < fSModel.lineArray.length; i++) {
    let area = getAreaToCheck(fSModel.lineArray[i], dimens);

    /*
      for development
    */
    drawArea(area, canCtx);

    let usableAreas = checkAndRefineArea(area, dimens);
    if (usableAreas.length > 0) {
      let spotsFromAreas = [];
      let closestDistance;
      let closestIndex;
      for (let j = 0; j < usableAreas.length; j++) {
        spotsFromAreas.push(getSpotInArea(usableAreas[j], dimens, elicitorCenter));
        if (j === 0) {
          closestDistance = radialDistance(spotsFromAreas[0], elicitorCenter);
          closestIndex = 0;
        } else {
          if (radialDistance(spotsFromAreas[j], elicitorCenter) < closestDistance) {
            closestDistance = radialDistance(spotsFromAreas[j], elicitorCenter);
            closestIndex = j;
          }
        }
      }
      return spotsFromAreas[closestIndex];
    }
  }
  console.log("failed to find best spot");
}

function sortFSMLinesByCloseness(centerPoint) {
  fSModel.lineArray.sort(function (one, other) {
    if (closestDistance(centerPoint, one) > closestDistance(centerPoint, other)) return 1;
    if (closestDistance(centerPoint, one) < closestDistance(centerPoint, other)) return -1;
    return 0;
  });
}

//for vertical or horizontal lines
function closestDistance(refPoint, line) {
  // console.log("line " + line.a.x + ", " + line.a.y + " to " + line.b.x + ", " + line.b.y);
  if (linePassesPointX(line, refPoint)) {
    // console.log("crosses refPoint along x, closest distance: " + Math.abs(refPoint.y - line.a.y));
    return Math.abs(refPoint.y - line.a.y);
  } else {
    if (linePassesPointY(line, refPoint)) {
      // console.log("crosses refPoint along y, closest distance: " + Math.abs(refPoint.x - line.a.x));
      return Math.abs(refPoint.x - line.a.x);
    }
  }
  // console.log("doesnt cross refPoint, closest distance: " + Math.min(radialDistance(refPoint, line.a), radialDistance(refPoint, line.b)));
  return Math.min(radialDistance(refPoint, line.a), radialDistance(refPoint, line.b));
}

function linePassesPointX(line, point) {
  if (line.a.x < point.x && point.x < line.b.x) {
    return true;
  }
  return false;
}

function linePassesPointY(line, point) {
  if (line.a.y < point.y && point.y < line.b.y) {
    return true;
  }
  return false;
}

function areaPassesPointX(area, point) {
  if (area.a.x < point.x && point.x < area.b.x) {
    return true;
  }
  return false;
}

function areaPassesPointY(area, point) {
  if (area.a.y < point.y && point.y < area.b.y) {
    return true;
  }
  return false;
}

/*
  returns area spanning furthest possible placement of new div at one end 
  of line to fursthest possible spot at other end
*/
function getAreaToCheck(line, dimens) {
  switch(line.side) {
    case 0:
      return new Area(new Coord(line.a.x - dimens.x, line.a.y - dimens.y), new Coord(line.b.x + dimens.x, line.b.y), 0);
      break;
    case 1:
      return new Area(new Coord(line.a.x, line.a.y - dimens.y), new Coord(line.b.x + dimens.x, line.b.y + dimens.y), 1);
      break;
    case 2:
      return new Area(new Coord(line.a.x - dimens.x, line.a.y), new Coord(line.b.x + dimens.x, line.b.y + dimens.y), 2);
      break;
    case 3:
      return new Area(new Coord(line.a.x - dimens.x, line.a.y - dimens.y), new Coord(line.b.x, line.b.y + dimens.y), 3);
      break;
  }
}

function lineGoesInto(line, area) {
  switch (line.side) {
    case 0:
    case 2:
      if (
        //if line y is above area bottom and below area top
        line.a.y < area.b.y && area.a.y < line.a.y && (
          //and either end is inside area or line spans area
          (area.a.x < line.a.x && line.a.x < area.b.x) || 
          (area.a.x < line.b.x && line.b.x < area.b.x) ||
          (line.a.x <= area.a.x && area.b.x <= line.b.x)) ) {
        return true;
      }
      break;
    case 1:
    case 3:
      if (
        //if line x is right of area left edge and left of area right edge
        area.a.x < line.a.x && line.a.x < area.b.x && (
          //and either end is inside area or line spans area
          (area.a.y < line.a.y && line.a.y < area.b.y) || 
          (area.a.y < line.b.y && line.b.y < area.b.y) ||
          (line.a.y <= area.a.y && area.b.y <= line.b.y)) ) {
        return true;
      }
  }
  return false;
}

//line traverses parallel to side of area
function lineTraversesArea(line, area) {
  switch (area.side) {
    case 0:
    case 2:
      //if line y is above area bottom and below area top and points span area
      if (line.a.y < area.b.y && area.a.y < line.a.y && 
          line.a.x <= area.a.x && area.b.x <= line.b.x)  {
        return true;
      }
      break;
    case 1:
    case 3:
      //if line x is right of area left edge and left of area right edge and points span area
      if (area.a.x < line.a.x && line.a.x < area.b.x && 
          line.a.y <= area.a.y && area.b.y <= line.b.y)  {
        return true;
      }
  }
  return false;
}

/*
  takes an areaToCheck and the dimensions of the new post div, checks for lines spanning whole area along the 
  dimension that renders it unusable, and checks for other lines entering the area that would cause the area
  to be narrowed, shortened or split. returns empty array if the area cannot hold the new post div, 
  or a an area that has no lines entering it, or multiple such areas
*/
function checkAndRefineArea(area, dimens) {
  let usableAreas = [];
  usableAreas.push(area);
  for (let i = 0; i < fSModel.lineArray.length; i++) {
    if (lineTraversesArea(fSModel.lineArray[i], area)) {
      return [];
    }
    if (lineGoesInto(fSModel.lineArray[i], area)) {
      switch (area.side) {
        case 0:
        case 2:
          if (lineGoesInto(fSModel.lineArray[i], area)) {
            //if left end of line is within post-box width of right side
            if (fSModel.lineArray[i].a.x > area.b.x - dimens.x) {
              //if there is room for new post div in the area, left of the line
              if (fSModel.lineArray[i].a.x > area.a.x + dimens.x) {
                area.b.x = fSModel.lineArray[i].a.x;
                continue;
              } else {
                return [];
              }
            }
            //if right end of line is within post-box width of left side
            if (fSModel.lineArray[i].b.x < area.a.x + dimens.x) {
              //if there is room for new post div in the area, right of the line
              if (fSModel.lineArray[i].b.x < area.b.x - dimens.x) {
                area.a.x = fSModel.lineArray[i].b.x;
                continue;
              } else {
                return [];
              }
            }
            //if line splits area into two spaces that could fit post-box
            if (fSModel.lineArray[i].a.x > area.a.x + dimens.x && fSModel.lineArray[i].b.x < area.b.x - dimens.x) {
              area.b.x = fSModel.lineArray[i].a.x;
              let newAreas = checkAndRefineArea(new Area(new Coord(fSModel.lineArray[i].b.x, area.a.y), new Coord(area.b.x, area.b.y), area.side), dimens);
              for (let j = 0; j < newAreas.length; j++) {
                usableAreas.push(newAreas[j]);
              }
              continue;
            }
            //if left side of line is more than the post div's width from the left side of the area
            if (fSModel.lineArray[i].a.x > area.a.x + dimens.x) {
              area.b.x = fSModel.lineArray[i].a.x;
              continue;
            }
            //if right side of line is more than the post div's width from the right side of the area
            if (fSModel.lineArray[i].b.x < area.b.x - dimens.x) {
              area.a.x = fSModel.lineArray[i].b.x;
              continue;
            }
            //must be line starting within new-post-width distance of left side and ending within new-post-width distance of right side
            return [];
          }
          break;
        case 1:
        case 3:
          if (lineGoesInto(fSModel.lineArray[i], area)) {
            //if top end of line is within post-box height of bottom of area
            if (fSModel.lineArray[i].a.y > area.b.y - dimens.y) {
              //if there is room for new post div in the area, above the line
              if (fSModel.lineArray[i].a.y > area.a.y + dimens.y) {
                area.b.y = fSModel.lineArray[i].a.y;
                continue;
              } else {
                return [];
              }
            }
            //if bottom end of line is within post-box height of top of area
            if (fSModel.lineArray[i].b.y < area.a.y + dimens.y) {
              //if there is room for new post div in the area, below the line
              if (fSModel.lineArray[i].b.y < area.b.y - dimens.y) {
                area.a.y = fSModel.lineArray[i].b.y;
                continue;
              } else {
                return [];
              }
            }
            //if line splits area into two spaces that could fit post-box
            if (fSModel.lineArray[i].a.y > area.a.y + dimens.y && fSModel.lineArray[i].b.y < area.b.y - dimens.y) {
              area.b.y = fSModel.lineArray[i].a.y;
              let newAreas = checkAndRefineArea(new Area(new Coord(area.a.x, fSModel.lineArray[i].b.y), new Coord(area.b.x, area.b.y), area.side), dimens);
              for (let j = 0; j < newAreas.length; j++) {
                usableAreas.push(newAreas[j]);
              }
              continue;
            }
            //if top end of line is more than the post div's height from the top of the area
            if (fSModel.lineArray[i].a.y > area.a.y + dimens.y) {
              area.b.y = fSModel.lineArray[i].a.y;
              continue;
            }
            //if bottom end of line is more than the post div's height from the bottom of the area
            if (fSModel.lineArray[i].b.y < area.b.y - dimens.y) {
              area.a.y = fSModel.lineArray[i].b.y;
              continue;
            }
            //must be line starting within new-post-height of top of area and ending within new-post-height of bottom of area
            return [];
          }
          break;
      }
    } 
  }
  return usableAreas;
}

function getSpotInArea(area, dimens, eliCent) {
  let halfDimens = centerOf(dimens);
  switch(area.side) {
    case 0:
      if (areaPassesPointX(area, eliCent)) {
        if (area.a.x < eliCent.x - halfDimens.x && eliCent.x + halfDimens.x < area.b.x) {
          return new Coord(eliCent.x, area.b.y - halfDimens.y);
        }
      }
      if (isCloserToThanX(area.a, eliCent, area.b)) {
        return new Coord(area.a.x + halfDimens.x, area.b.y + halfDimens.y);
      } else {
        return new Coord(area.b.x - halfDimens.x, area.b.y + halfDimens.y);
      }
      break;
    case 1:
      if (areaPassesPointY(area, eliCent)) {
        if (area.a.y < eliCent.y - halfDimens.y && eliCent.y + halfDimens.y < area.b.y) {
          return new Coord(area.a.x + halfDimens.x, eliCent.y);
        }
      } 
      if (isCloserToThanY(area.a, eliCent, area.b)) {
        return new Coord(area.a.x + halfDimens.x, area.a.y + halfDimens.y);
      } else {
        return new Coord(area.a.x + halfDimens.x, area.b.y - halfDimens.y);
      }
      break;
    case 2:
      if (areaPassesPointX(area, eliCent)) {
        if (area.a.x < eliCent.x - halfDimens.x && eliCent.x + halfDimens.x < area.b.x) {
          return new Coord(eliCent.x, area.a.y + halfDimens.y);
        }
      }
      if (isCloserToThanX(area.a, eliCent, area.b)) {
        return new Coord(area.a.x + halfDimens.x, area.a.y + halfDimens.y);
      } else {
        return new Coord(area.b.x - halfDimens.x, area.a.y + halfDimens.y);
      }
      break;
    case 3:
      if (areaPassesPointY(area, eliCent)) {
        if (area.a.y < eliCent.y - halfDimens.y && eliCent.y + halfDimens.y < area.b.y) {
          return new Coord(area.b.x - halfDimens.x, eliCent.y);
        }
      } 
      if (isCloserToThanY(area.a, eliCent, area.b)) {
        return new Coord(area.b.x - halfDimens.x, area.a.y + halfDimens.y);
      } else {
        return new Coord(area.b.x - halfDimens.x, area.b.y - halfDimens.y);
      }
      break;
  }
}

//if comparePtA is closer to refPt along X axis than comparePtB
function isCloserToThanX(comparePtA, refPt, comparePtB) {
  if (Math.abs(refPt.x - comparePtA.x) < Math.abs(refPt.x - comparePtB.x)) {
    return true;
  }
  return false;
}

//if comparePtA is closer to refPt along Y axis than comparePtB
function isCloserToThanY(comparePtA, refPt, comparePtB) {
  if (Math.abs(refPt.y - comparePtA.y) < Math.abs(refPt.y - comparePtB.y)) {
    return true;
  }
  return false;
}