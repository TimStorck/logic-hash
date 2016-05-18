import { fSModel } from './reactive.js';
import { Coord } from './objects.js';
import { Line } from './objects.js';
import { Area } from './objects.js';
import { radiusBetween } from './measurements';
import { centerOf } from './measurements.js';
import { drawArea } from './drawing.js';

export function findBestSpot(dimens, elicitorCenter, canCtx) {
  sortFSMLinesByCloseness(elicitorCenter);

  // for (let i = 0; i < fSModel.lineArray.length; i++) {
  for (let i = 0; i < 1; i++) {
    let area = possiblePlacementZone(fSModel.lineArray[i], dimens);
    drawArea(area, canCtx);
    switch(fSModel.lineArray.side) {
      case 0:

        break;
      case 1:

        break;
      case 2:

        break;
      case 3:

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
  return Math.min(
    Math.abs(refPoint.x - line.a.x),
    Math.abs(refPoint.x - line.b.x),
    Math.abs(refPoint.y - line.a.y),
    Math.abs(refPoint.y - line.b.y)
  );
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