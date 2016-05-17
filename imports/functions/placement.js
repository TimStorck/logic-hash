import { fSModel } from './reactive.js';
import { Coord } from './objects.js';
import { Line } from './objects.js';
import { radiusBetween } from './measurements';

export function findBestSpot(dimens, elicitorCenter) {
  sortFSMLinesByCloseness(elicitorCenter);
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