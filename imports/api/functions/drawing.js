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
    newElem.setAttribute("class", "post motion");
    newElem.setAttribute("id", post._id);
      let authortDiv = document.createElement("div");
      authortDiv.setAttribute("class", "author");
      authortDiv.innerHTML = post.author;
      newElem.appendChild(authortDiv);

      let contentDiv = document.createElement("div");
      contentDiv.setAttribute("class", "content");
      contentDiv.innerHTML = post.content;
      newElem.appendChild(contentDiv);
      
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
    newElem.setAttribute("id", post._id);
      let authortDiv = document.createElement("div");
      authortDiv.setAttribute("class", "author");
      authortDiv.innerHTML = post.author;
      newElem.appendChild(authortDiv);

      let contentDiv = document.createElement("div");
      contentDiv.setAttribute("class", "content");
      contentDiv.innerHTML = post.content;
      newElem.appendChild(contentDiv);

    newElem.style.width = widthFromChars(post.content.length);

  bucket.appendChild(newElem);

  let dimens = dimensOf(newElem);
  let centerPos;
  let topLeftPos;
  switch(Math.floor(Math.random() * 4) % 4) {
    case 0:
      centerPos = fSModel.findSpotLeft(dimens);
      topLeftPos = centerPos.minus(centerOf(dimens));
      fSModel.updateLeftLine(topLeftPos, topLeftPos.plus(dimens), false);
      break;
    case 1:
      centerPos = fSModel.findSpotRight(dimens);
      topLeftPos = centerPos.minus(centerOf(dimens));
      fSModel.updateRightLine(topLeftPos, topLeftPos.plus(dimens), false);
      break;
    case 2:
      centerPos = fSModel.findSpotTop(dimens);
      topLeftPos = centerPos.minus(centerOf(dimens));
      fSModel.updateTopLine(topLeftPos, topLeftPos.plus(dimens), false);
      break;
    case 3:
      centerPos = fSModel.findSpotBottom(dimens);
      topLeftPos = centerPos.minus(centerOf(dimens));
      fSModel.updateBottomLine(topLeftPos, topLeftPos.plus(dimens), false);
  }
  newElem.style.top = topLeftPos.yPx();
  newElem.style.left = topLeftPos.xPx();

  return centerPos;
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

/*
  this function is for development use, to check out the filled space model boundaries
  (called from reactive.js)
*/
function drawLine(platform, canCtx) {
  canCtx.beginPath();
  canCtx.strokeStyle = "red";
  canCtx.moveTo(platform.a.x,platform.a.y);
  canCtx.lineTo(platform.b.x,platform.b.y);
  canCtx.stroke();
  canCtx.closePath();
}

export function drawRadial(motionCenter, responseCenter, canCtx) {
  canCtx.beginPath();
  canCtx.strokeStyle = "black";
  canCtx.moveTo(motionCenter.x, motionCenter.y);
  canCtx.lineTo(responseCenter.x, responseCenter.y);
  canCtx.stroke();
  canCtx.closePath();
}