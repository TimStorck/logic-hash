import { Coord } from './objects.js';

export function dimensOf(elem) {
  return new Coord(elem.offsetWidth, elem.offsetHeight)
}

export function centerOf(dimens) {
  return new Coord(dimens.x/2, dimens.y/2);
}

export function centerHor(line) {
  return Math.floor((line.a.x + line.b.x) / 2);
}

export function centerVert(line) {
  return Math.floor((line.a.y + line.b.y) / 2);
}

export function widthFromChars(charNo) {
  if (charNo < 50) {
    return "auto";
  } 
  if (charNo < 100) {
    return "170px";
  } 
  return (charNo / (Math.sqrt(charNo) / 18.9) ) + "px";
}

export function radialDistance(referencePoint, otherPoint) {
  //pythagorean theorem
  return Math.sqrt(referencePoint.minus(otherPoint).x * referencePoint.minus(otherPoint).x + referencePoint.minus(otherPoint).y * referencePoint.minus(otherPoint).y);
}

export function lineWidth(line) {
  return line.b.x - line.a.x;
}

export function lineHeight(line) {
  return line.b.y - line.a.y;
}