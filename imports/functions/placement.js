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
    let area = possiblePlacementZone(fSModel.lineArray[i], dimens);

    /*
      for development
    */
    drawArea(area, canCtx);

    linesInArea = getLinesPassingThrough(area);
    if (linesInArea.length == 0) {
      return getSpotOnLine(fSModel.lineArray[i], dimens, elicitorCenter);
      break;
    }
  }

  return new Coord(0,0);
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
  if (lineCrossesPointX(line, refPoint)) {
    // console.log("crosses refPoint along x, closest distance: " + Math.abs(refPoint.y - line.a.y));
    return Math.abs(refPoint.y - line.a.y);
  } else {
    if (lineCrossesPointY(line, refPoint)) {
      // console.log("crosses refPoint along y, closest distance: " + Math.abs(refPoint.x - line.a.x));
      return Math.abs(refPoint.x - line.a.x);
    }
  }
  // console.log("doesnt cross refPoint, closest distance: " + Math.min(radialDistance(refPoint, line.a), radialDistance(refPoint, line.b)));
  return Math.min(radialDistance(refPoint, line.a), radialDistance(refPoint, line.b));
}

function lineCrossesPointX(line, point) {
  if (line.a.x < point.x && point.x < line.b.x) {
    return true;
  }
  return false;
}

function lineCrossesPointY(line, point) {
  if (line.a.y < point.y && point.y < line.b.y) {
    return true;
  }
  return false;
}

function possiblePlacementZone(line, dimens) {
  switch(line.side) {
    case 0:
      return new Area(new Coord(line.a.x - dimens.x, line.a.y - dimens.y), new Coord(line.b.x + dimens.x, line.b.y));
      break;
    case 1:
      return new Area(new Coord(line.a.x, line.a.y - dimens.y), new Coord(line.b.x + dimens.x, line.b.y + dimens.y));
      break;
    case 2:
      return new Area(new Coord(line.a.x - dimens.x, line.a.y), new Coord(line.b.x + dimens.x, line.b.y + dimens.y));
      break;
    case 3:
      return new Area(new Coord(line.a.x - dimens.x, line.a.y - dimens.y), new Coord(line.b.x, line.b.y + dimens.y));
      break;
  }
}

function linePassesThrough(line, area) {
  switch (line.side) {
    case 0:
    case 2:
      if (
        //if line y is above area bottom and below area top
        line.a.y < area.bottomRight.y && 
        line.a.y > area.topLeft.y && (
          //and either end is inside area or they straddle it
          (line.a.x > area.topLeft.x && line.a.x < area.bottomRight.x) || 
          (line.b.x > area.topLeft.x && line.b.x < area.bottomRight.x) || 
          (line.a.x < area.topLeft.x && line.b.x > area.bottomRight.x)) ) {
        return true;
      }
      break;
    case 1:
    case 3:
      if (
        //if line x is right of area left edge and left of area right edge
        line.a.x > area.topLeft.x && 
        line.a.x < area.bottomRight.x && (
          //and either end is inside area or they straddle it
          (line.a.y > area.topLeft.y && line.a.y < area.bottomRight.y) || 
          (line.b.y > area.topLeft.y && line.b.y < area.bottomRight.y) || 
          (line.a.y < area.topLeft.y && line.b.y > area.bottomRight.y)) ) {
        return true;
      }
  }
  return false;
}

function getLinesPassingThrough(area) {
  let linesInArea = [];
  for (let i = 0; i < fSModel.lineArray.length; i++) {
    if (linePassesThrough(fSModel.lineArray[i], area)) {
      linesInArea.push(fSModel.lineArray[i]);
    } 
  }
  return linesInArea;
}

function getSpotOnLine(line, dimens, elicitorCenter) {
  switch(line.side) {
    case 0:
      if (lineCrossesPointX(line, elicitorCenter)) {
        return new Coord(elicitorCenter.x, line.a.y - centerOf(dimens).y);
      } else {
        console.log("you didnt code what to do if the area doesnt line up with elicitorCenter yet");
      }
      break;
    case 1:
      if (lineCrossesPointY(line, elicitorCenter)) {
        return new Coord(line.a.x + centerOf(dimens).x, elicitorCenter.y);
      } else {
        console.log("you didnt code what to do if the area doesnt line up with elicitorCenter yet");
      }
      break;
    case 2:
      if (lineCrossesPointX(line, elicitorCenter)) {
        return new Coord(elicitorCenter.x, line.a.y + centerOf(dimens).y);
      } else {
        console.log("you didnt code what to do if the area doesnt line up with elicitorCenter yet");
      }
      break;
    case 3:
      if (lineCrossesPointY(line, elicitorCenter)) {
        return new Coord(line.a.x - centerOf(dimens).x, elicitorCenter.y);
      } else {
        console.log("you didnt code what to do if the area doesnt line up with elicitorCenter yet");
      }
      break;
  }
}