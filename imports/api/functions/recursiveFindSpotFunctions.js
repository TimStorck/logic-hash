import { Coord } from './objects.js';
import { adjacentLeft } from './measurements.js';
import { adjacentRight } from './measurements.js';
import { adjacentTop } from './measurements.js';
import { adjacentBottom } from './measurements.js';
import { platformWidth } from './measurements.js';
import { platformHeight } from './measurements.js';

export function widthWithAdjacentLeft(i, line) {
  if (adjacentLeft(i, line) < i) {
    return platformWidth(line[i]) + widthWithAdjacentLeft(adjacentLeft(i, line), line);
  } else {
    return platformWidth(line[i]);
  }
}

export function widthWithAdjacentRight(i, line) {
  //if adjacent platform is lower
  if (adjacentRight(i, line) < i) {
    return platformWidth(line[i]) + widthWithAdjacentRight(adjacentRight(i, line), line);
  } else {
    return platformWidth(line[i]);
  }
}

export function heightWithAdjacentAbove(i, line) {
  if (adjacentLeft(i, line) < i) {
    return platformHeight(line[i]) + heightWithAdjacentAbove(adjacentTop(i, line), line);
  } else {
    return platformHeight(line[i]);
  }
}

export function heightWithAdjacentBelow(i, line) {
  //if adjacent platform is lower
  if (adjacentRight(i, line) < i) {
    return platformHeight(line[i]) + heightWithAdjacentBelow(adjacentBottom(i, line), line);
  } else {
    return platformHeight(line[i]);
  }
}