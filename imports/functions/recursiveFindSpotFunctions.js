// import { Coord } from './objects.js';
// import { adjacentLeft } from './measurements.js';
// import { adjacentRight } from './measurements.js';
// import { adjacentTop } from './measurements.js';
// import { adjacentBottom } from './measurements.js';
// import { platformWidth } from './measurements.js';
// import { platformHeight } from './measurements.js';

// export function widthWithAdjacentLeft(i, line) {
//   //if adjacent platform is closer to central post
//   if (adjacentLeft(i, line) < i) {
//     return platformWidth(line[i]) + widthWithAdjacentLeft(adjacentLeft(i, line), line);
//   } else {
//     return platformWidth(line[i]);
//   }
// }

// export function widthWithAdjacentRight(i, line) {
//   //if adjacent platform is closer to central post
//   if (adjacentRight(i, line) < i) {
//     return platformWidth(line[i]) + widthWithAdjacentRight(adjacentRight(i, line), line);
//   } else {
//     return platformWidth(line[i]);
//   }
// }

// export function heightWithAdjacentTop(i, line) {
//   //if adjacent platform is closer to central post
//   if (adjacentTop(i, line) < i) {
//     return platformHeight(line[i]) + heightWithAdjacentTop(adjacentTop(i, line), line);
//   } else {
//     return platformHeight(line[i]);
//   }
// }

// export function heightWithAdjacentBottom(i, line) {
//   //if adjacent platform is closer to central post
//   if (adjacentBottom(i, line) < i) {
//     return platformHeight(line[i]) + heightWithAdjacentBottom(adjacentBottom(i, line), line);
//   } else {
//     return platformHeight(line[i]);
//   }
// }