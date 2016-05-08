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
  
  /*
    so that textboxes with varying amounts of characters approximate square shape.

    set up excel sheet collecting data for amounts of characters and 
    width of div that makes it look close to square. the relationship is
    something like the formula here. that divisor constant may be the relationship
    between the number of pixels of line height and pixel width
    of an average character, or a square of it or something like that.
  */
}

export function rightMost(arr) {
  return arr.sort(function (a, b) {
    if (a.x < b.x) {
      return 1;
    }
    if (a.x > b.x) {
      return -1;
    }
    // a must be equal to b
    return 0;
  })[0];
}

export function leftMost(arr) {
  return arr.sort(function (a, b) {
    if (a.x > b.x) {
      return 1;
    }
    if (a.x < b.x) {
      return -1;
    }
    // a must be equal to b
    return 0;
  })[0];
}

export function topMost(arr) {
  return arr.sort(function (a, b) {
    if (a.y < b.y) {
      return 1;
    }
    if (a.y > b.y) {
      return -1;
    }
    // a must be equal to b
    return 0;
  })[0];
}

export function bottomMost(arr) {
  return arr.sort(function (a, b) {
    if (a.y > b.y) {
      return 1;
    }
    if (a.y < b.y) {
      return -1;
    }
    // a must be equal to b
    return 0;
  })[0];
}