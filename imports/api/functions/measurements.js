import { Coord } from './objects.js';

export function dimensOf(elem) {
  return new Coord(elem.offsetWidth, elem.offsetHeight)
}

export function centerOf(dimens) {
  return new Coord(dimens.x/2, dimens.y/2);
}