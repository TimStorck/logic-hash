import { Coord } from './objects.js';
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

  let postDimens = dimensOf(newElem);
  let centerPos = findBestSpot(postDimens);
  console.log(centerPos);
}

function findBestSpot(postDimens) {

  return new Coord(0, 0);
}

export function drawFSModel(fSModel, canvas) {
  for (let i = 0; i < fSModel.topLine.length; i++) {
    drawCircle(fSModel.topLine[i], canvas);
  }
  for (let i = 0; i < fSModel.rightLine.length; i++) {
    drawCircle(fSModel.rightLine[i], canvas);
  }
  for (let i = 0; i < fSModel.bottomLine.length; i++) {
    drawCircle(fSModel.bottomLine[i], canvas);
  }
  for (let i = 0; i < fSModel.leftLine.length; i++) {
    drawCircle(fSModel.leftLine[i], canvas);
  }
}

function drawCircle(coord, canvas) {
  canCtx = canvas.getContext("2d");
  canCtx.beginPath();
  canCtx.fillStyle = "red";
  canCtx.arc(coord.x, coord.y, 2, 0, Math.PI*2, true);
  canCtx.fill();
  canCtx.closePath();
}