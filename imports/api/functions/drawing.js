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
  let newElem = createTextBoxElement(post, bucket);
  let dimens = dimensOf(newElem);
  
  let topLeftPos = centerPos.minus(centerOf(dimens));
  newElem.style.top = topLeftPos.yPx();
  newElem.style.left = topLeftPos.xPx();

  fSModel.addMotion(topLeftPos, topLeftPos.plus(dimens));
}

export function drawResponseTextBox(post, bucket, fSModel, sideOscillator) {
  let newElem = createTextBoxElement(post, bucket);
  let dimens = dimensOf(newElem);

  let centerPos = getPosition(fSModel, sideOscillator, dimens);
  let topLeftPos = centerPos.minus(centerOf(dimens))
  newElem.style.top = topLeftPos.yPx();
  newElem.style.left = topLeftPos.xPx();

  updateFSM(topLeftPos, dimens, fSModel, sideOscillator);
  return centerPos;
}

export function drawRadial(motionCenter, responseCenter, canCtx) {
  canCtx.beginPath();
  canCtx.strokeStyle = "black";
  canCtx.moveTo(motionCenter.x, motionCenter.y);
  canCtx.lineTo(responseCenter.x, responseCenter.y);
  canCtx.stroke();
  canCtx.closePath();
}

function createTextBoxElement(post, bucket) {
  let newElem = document.createElement("div");
    newElem.setAttribute("class", "post");
    newElem.setAttribute("id", post._id);
      let flagDiv = document.createElement("div");
      flagDiv.setAttribute("class", "flagBox");
      flagDiv.innerHTML = "Flag";
      newElem.appendChild(flagDiv);

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

  return newElem;
}

function getPosition(fSModel, sideOscillator, dimens) {
  switch(sideOscillator) {
    case 0:
      return fSModel.findSpotTop(dimens);
      break;
    case 1:
      return fSModel.findSpotRight(dimens);
      break;
    case 2:
      return fSModel.findSpotBottom(dimens);
      break;
    case 3:
      return fSModel.findSpotLeft(dimens);
      break;
    default:
      console.log("sideOscillator invalid");
  }
}

function updateFSM(topLeftPos, dimens, fSModel, sideOscillator) {
  switch(sideOscillator) {
    case 0:
      fSModel.updateTopLine(topLeftPos, topLeftPos.plus(dimens), false);
      break;
    case 1:
      fSModel.updateRightLine(topLeftPos, topLeftPos.plus(dimens), false);
      break;
    case 2:
      fSModel.updateBottomLine(topLeftPos, topLeftPos.plus(dimens), false);
      break;
    case 3:
      fSModel.updateLeftLine(topLeftPos, topLeftPos.plus(dimens), false);
      break;
    default:
      console.log("sideOscillator invalid");
  }
}

/*
  for development, to view filled space model boundaries
*/
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

function drawLine(platform, canCtx) {
  canCtx.beginPath();
  canCtx.strokeStyle = "red";
  canCtx.moveTo(platform.a.x,platform.a.y);
  canCtx.lineTo(platform.b.x,platform.b.y);
  canCtx.stroke();
  canCtx.closePath();
}