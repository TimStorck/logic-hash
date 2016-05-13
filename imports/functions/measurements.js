import { Coord } from './objects.js';

export function dimensOf(elem) {
  return new Coord(elem.offsetWidth, elem.offsetHeight)
}

export function centerOf(dimens) {
  return new Coord(dimens.x/2, dimens.y/2);
}

export function centerOfHor(left, right) {
  return Math.floor((left + right) / 2);
}

export function centerOfVert(top, bottom) {
  return Math.floor((top + bottom) / 2);
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

export function platformWidth(platform) {
  return platform.b.x - platform.a.x;
}

export function platformHeight(platform) {
  return platform.b.y - platform.a.y;
}

export function fitsHor(dimens, width) {
  if (width > dimens.x) {
    return true
  }
  return false;
}

export function fitsVert(dimens, height) {
  if (height > dimens.y) {
    return true
  }
  return false;
}

export function sortBottomToTop(arr) {
  return arr.sort(function (a, b) {
    if (a.a.y > b.a.y) return -1;
    if (a.a.y < b.a.y) return 1;
    return 0;
  });
}

export function sortTopToBottom(arr) {
  return arr.sort(function (a, b) {
    if (a.a.y > b.a.y) return 1;
    if (a.a.y < b.a.y) return -1;
    return 0;
  });
}

export function sortLeftToRight(arr) {
  return arr.sort(function (a, b) {
    if (a.a.x > b.a.x) return 1;
    if (a.a.x < b.a.x) return -1;
    return 0;
  });
}

export function sortRightToLeft(arr) {
  return arr.sort(function (a, b) {
    if (a.a.x > b.a.x) return -1;
    if (a.a.x < b.a.x) return 1;
    return 0;
  });
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

export function platformIsTopMost(i, line) {
  for (let j = 0; j < line.length; j++) {
    if (i === j) { 
      continue;
    }
    if (line[j].a.y < line[i].a.y) {
      return false;
    }
  }
  return true;
}

export function platformIsBottomMost(i, line) {
  for (let j = 0; j < line.length; j++) {
    if (i === j) { 
      continue;
    }
    if (line[j].b.y > line[i].b.y) {
      return false;
    }
  }
  return true;
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

export function adjacentTop(i, line) {
  for (let j = 0; j < line.length; j++) {
    if (j === i) {
      continue;
    }
    if (line[i].a.y === line[j].b.y) {
      return j;
    }
  }
}

export function adjacentBottom(i, line) {
  for (let j = 0; j < line.length; j++) {
    if (j === i) {
      continue;
    }
    if (line[i].b.y === line[j].a.y) {
      return j;
    }
  }
}