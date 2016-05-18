import { fSModel } from './reactive.js';
import { Coord } from './objects.js';
import { Line } from './objects.js';
import { Area } from './objects.js';
import { radiusBetween } from './measurements';
import { centerOf } from './measurements.js';

export function findBestSpot(dimens, elicitorCenter) {
  sortFSMLinesByCloseness(elicitorCenter);

  for (let i = 0; i < fSModel.lineArray.length; i++) {
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