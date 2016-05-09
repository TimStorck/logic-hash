import { Coord } from './objects.js';

export function dimensOf(elem) {
  return new Coord(elem.offsetWidth, elem.offsetHeight)
}

export function centerOf(dimens) {
  return new Coord(dimens.x/2, dimens.y/2);
}

export function widthFromChars(charNo) {
  if (charNo < 50) {
    return "auto";
  } else {
    return (charNo / (Math.sqrt(charNo) / 12.9) ) + "px";
  }
}

export function fitsAbove(dimens, width) {
  if (width > dimens.x) {
    return true
  }
  return false;
}

export function platformIsLeftMost(i, line) {
  for (let j = 0; j < line.length; j++) {
    if (i === j) { 
      continue;
    }
    if (line[j].a.x < line[i].a.x) {
      return false;
    }
  }
  return true;
}

export function platformIsRightMost(i, line) {
  for (let j = 0; j < line.length; j++) {
    if (i === j) { 
      continue;
    }
    if (line[j].b.x > line[i].b.x) {
      return false;
    }
  }
  return true;
}

export function centerOfHor(left, right) {
  return Math.floor((left + right) / 2);
}

export function platformWidth(platform) {
  return platform.b.x - platform.a.x;
}

export function adjacentLeft(i, line) {
  for (let j = 0; j < line.length; j++) {
    if (j === i) {
      continue;
    }
    if (line[i].a.x === line[j].b.x) {
      return j;
    }
  }
}

export function adjacentRight(i, line) {
  for (let j = 0; j < line.length; j++) {
    if (j === i) {
      continue;
    }
    if (line[i].b.x === line[j].a.x) {
      return j;
    }
  }
}

export function sortBottomToTop(arr) {
  return arr.sort(function (a, b) {
    if (a.a.y > b.a.y) return -1;
    if (a.a.y < b.a.y) return 1;
    return 0;
  });
}