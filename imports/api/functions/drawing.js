import { Coord } from './objects.js';
import { Platform } from './objects.js';
import { centerOf } from './measurements.js';
import { dimensOf } from './measurements.js';
import { widthFromChars } from './measurements.js';
import { rightMost } from './measurements.js';
import { leftMost } from './measurements.js';
import { topMost } from './measurements.js';
import { bottomMost } from './measurements.js';

export function drawMotionTextBox(post, butcket, centerPos, fSModel) {
  let newElem = document.createElement("div");
  newElem.setAttribute("class", "post");
  newElem.innerHTML = post.content;
  newElem.style.width = widthFromChars(post.content.length);

  bucket.appendChild(newElem);
  
  let dimens = dimensOf(newElem);
  let topLeftPos = centerPos.minus(centerOf(dimens));
  newElem.style.top = topLeftPos.yPx();
  newElem.style.left = topLeftPos.xPx();

  fSModel.addMotion(topLeftPos, topLeftPos.plus(dimens));
}

export function drawResponseTextBox(post, bucket, fSModel) {
  let newElem = document.createElement("div");
  newElem.setAttribute("class", "post");
  newElem.innerHTML = post.content;
  newElem.style.width = widthFromChars(post.content.length);

  bucket.appendChild(newElem);

  let dimens = dimensOf(newElem);
  let centerPos = findBestSpot(dimens, fSModel);
  let topLeftPos = centerPos.minus(centerOf(dimens));
  newElem.style.top = topLeftPos.yPx();
  newElem.style.left = topLeftPos.xPx();
  // fSModel.updateLeftLine(topLeftPos, topLeftPos.plus(dimens), false);
  // fSModel.updateRightLine(topLeftPos, topLeftPos.plus(dimens), false);
  // fSModel.updateTopLine(topLeftPos, topLeftPos.plus(dimens), false);
  fSModel.updateBottomLine(topLeftPos, topLeftPos.plus(dimens), false);
}

function findBestSpot(dimens, fSModel) {
  
  // return fSModel.findSpotLeft(dimens);
  // return fSModel.findSpotRight(dimens);
  // return fSModel.findSpotTop(dimens);
  return fSModel.findSpotBottom(dimens);
}

export function drawFSModel(fSModel, canvas) {
  let canCtx = canvas.getContext("2d");

  for (let i = 0; i < fSModel.topLine.length; i++) {
    drawLine(fSModel.topLine[i], canCtx);
  }
  for (let i = 0; i < fSModel.rightLine.length; i++) {
    drawLine(fSModel.rightLine[i], canCtx);
  }
  for (let i = 0; i < fSModel.bottomLine.length; i++) {
    drawLine(fSModel.bottomLine[i], canCtx);
  }
  for (let i = 0; i < fSModel.leftLine.length; i++) {
    drawLine(fSModel.leftLine[i], canCtx);
  }
}

// function drawCircle(coord, canvas) {
//   canCtx = canvas.getContext("2d");
//   canCtx.beginPath();
//   canCtx.fillStyle = "red";
//   canCtx.arc(coord.x, coord.y, 2, 0, Math.PI*2, true);
//   canCtx.fill();
//   canCtx.closePath();
// }

function drawLine(platform, canCtx) {
  canCtx.beginPath();
  canCtx.strokeStyle = "red";
  canCtx.moveTo(platform.a.x,platform.a.y);
  canCtx.lineTo(platform.b.x,platform.b.y);
  canCtx.stroke();
  canCtx.closePath();
}