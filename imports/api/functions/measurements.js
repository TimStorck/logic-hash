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

// export function rightMost(arr) {
//   return arr.sort(function (a, b) {
//     if (a.x < b.x) return 1;
//     if (a.x > b.x) return -1;
//     return 0;
//   })[0];
// }

// export function leftMost(arr) {
//   return arr.sort(function (a, b) {
//     if (a.x > b.x) return 1;
//     if (a.x < b.x) return -1;
//     return 0;
//   })[0];
// }

// export function topMost(arr) {
//   return arr.sort(function (a, b) {
//     if (a.y < b.y) return 1;
//     if (a.y > b.y) return -1;
//     return 0;
//   })[0];
// }

// export function bottomMost(arr) {
//   return arr.sort(function (a, b) {
//     if (a.y > b.y) return 1;
//     if (a.y < b.y) return -1;
//     return 0;
//   })[0];
// }

// export function sortLeftToRight(arr) {
//   return arr.sort(function (a, b) {
//     if (a.x > b.x) return 1;
//     if (a.x < b.x) return -1;
//     if (a.y == b.y) return -1;
//     return 1;
//   });
// }

// export function sortBottomtoTop(arr) {
//   return arr.sort(function (a, b) {
//     if (a.y > b.y) return 1;
//     if (a.y < b.y) return -1;
//     return 0;
//   });
// }

// export function sortTopToBottom(arr) {
//   return arr.sort(function (a, b) {
//     if (a.y < b.y) return 1;
//     if (a.y > b.y) return -1;
//     return 0;
//   });
// }

// export function sortRightToLeft(arr) {
//   return arr.sort(function (a, b) {
//     if (a.x < b.x) return 1;
//     if (a.x > b.x) return -1;
//     return 0;
//   });
// }

// export function closestPointLeftOf(coord, arr) {

// }

export function fitsAbove(dimens, topLinePlatform) {
  if ((topLinePlatform.b.x - topLinePlatform.a.x) > dimens.x) {
    return true
  }
  return false;
}

export function fitsToRightOf(dimens, rightLinePlatform) {
  if ((rightLinePlatform.b.y - rightLinePlatform.a.y) > dimens.y) {
    return true
  }
  return false;
}

export function fitsBelow(dimens, bottomLinePlatform) {
  if ((bottomLinePlatform.b.x - bottomLinePlatform.a.x) > dimens.x) {
    return true
  }
  return false;
}

export function fitsToLeftOf(dimens, leftLinePlatform) {
  if ((leftLinePlatform.b.y - leftLinePlatform.a.y) > dimens.y) {
    return true
  }
  return false;
}

export function platformIsLeftMost(i) {
  if (i === 0) {
    return true;
  }
  return false;
}

export function platformIsTopMost(i) {
  if (i === 0) {
    return true;
  }
  return false;
}

export function platformIsRightMost(i, arrLength) {
  if (i === arrLength - 1) {
    return true;
  }
  return false;
}

export function platformIsBottomMost(i, arrLength) {
  if (i === arrLength - 1) {
    return true;
  }
  return false;
}

export function centerOfTopPlatform(platform) {
  return ( (platform.b.x - platform.a.x) / 2 ) + platform.a.x;
}

export function centerOfRightPlatorm(platform) {
  return ( (platform.b.y - platform.a.y) / 2 ) + platform.a.y;
}

export function centerOfBottomPlatorm(platform) {
  return ( (platform.b.x - platform.a.x) / 2 ) + platform.a.x;
}

export function centerOfLeftPlatorm(platform) {
  return ( (platform.b.y - platform.a.y) / 2 ) + platform.a.y;
}

export function platformWidth(platform) {
  return platform.b.x - platform.a.x;
}

export function adjacentLeft(i, line) {
  for (let j = 0; j < line.length; j++) {
    if (j = i) {
      continue;
    }
    if (line[i].a.x === line[j].b.x) {
      return j;
    }
  }
}

export function adjacentRight(i, line) {
  for (let j = 0; j < line.length; j++) {
    if (j = i) {
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