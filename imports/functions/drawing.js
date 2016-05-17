import { Coord } from './objects.js';
import { Platform } from './objects.js';
import { centerOf } from './measurements.js';
import { dimensOf } from './measurements.js';
import { widthFromChars } from './measurements.js';
import { rightMost } from './measurements.js';
import { leftMost } from './measurements.js';
import { topMost } from './measurements.js';
import { bottomMost } from './measurements.js';
import { flagData } from '../data/flag-data.js';
import { fSModel } from './reactive.js';
import { findBestSpot } from './placement.js';

export function drawMotionTextBox(post, butcket, centerPos, canvas) {
  let newElem = createTextBoxElement(post, bucket);
  let dimens = dimensOf(newElem);
  
  let topLeftPos = centerPos.minus(centerOf(dimens));
  newElem.style.top = topLeftPos.yPx();
  newElem.style.left = topLeftPos.xPx();

  fSModel.addMotion(topLeftPos, topLeftPos.plus(dimens), canvas);
}

export function drawResponseTextBox(post, bucket) {
  let newElem = createTextBoxElement(post, bucket);
  let dimens = dimensOf(newElem);

  let centerPos = findBestSpot(dimens);
  let topLeftPos = centerPos.minus(centerOf(dimens))
  // newElem.style.top = topLeftPos.yPx();
  // newElem.style.left = topLeftPos.xPx();
  newElem.style.display = "none";

  // updateFSM(topLeftPos, dimens, sideOscillator);
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
      if (hasFlag(post)) {
        let flag = findFlagObject(post.flag);
        let flagDiv = document.createElement("div");
        flagDiv.setAttribute("class", "flagBox");
        flagDiv.setAttribute("style", "background-color: " + flag.color + ";");
        flagDiv.innerHTML = "&nbsp;";
        newElem.appendChild(flagDiv);

        createFlagModal(post, bucket, flag);
      }

      if (post.elicitor == null || post.elicitor == "") {
        let motionFlagDiv = document.createElement("div");
        motionFlagDiv.setAttribute("class", "flagBox");
        motionFlagDiv.setAttribute("title", "Motion");
        motionFlagDiv.setAttribute("style", "background-color: blue;");
        motionFlagDiv.innerHTML = "&nbsp;";
        newElem.appendChild(motionFlagDiv);
      }

      let authortDiv = document.createElement("div");
      authortDiv.setAttribute("class", "author");
      authortDiv.innerHTML = post.author;
      newElem.appendChild(authortDiv);

      let contentDiv = document.createElement("div");
      contentDiv.setAttribute("class", "content");
      contentDiv.innerHTML = post.content;
      newElem.appendChild(contentDiv);

      let respondDiv = document.createElement("div");
      respondDiv.setAttribute("class", "respondBtn");
      respondDiv.innerHTML = "Respond";
      newElem.appendChild(respondDiv);
      
    newElem.style.width = widthFromChars(post.content.length);

  bucket.appendChild(newElem);


  return newElem;
}

function updateFSM(topLeftPos, dimens, sideOscillator) {
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
export function drawFSModel(canvas) {
  let canCtx = canvas.getContext("2d");

  for (let i = 0; i < fSModel.topSkyLine.length; i++) {
    drawLine(fSModel.topSkyLine[i], canCtx);
  }
  for (let i = 0; i < fSModel.rightSkyLine.length; i++) {
    drawLine(fSModel.rightSkyLine[i], canCtx);
  }
  for (let i = 0; i < fSModel.bottomSkyLine.length; i++) {
    drawLine(fSModel.bottomSkyLine[i], canCtx);
  }
  for (let i = 0; i < fSModel.leftSkyLine.length; i++) {
    drawLine(fSModel.leftSkyLine[i], canCtx);
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

function createFlagModal(post, bucket, flag) {

  let newModal = document.createElement("div");
    newModal.setAttribute("class", "flagModal");
    newModal.setAttribute("id", "fm-" + post._id);
    newModal.setAttribute("style", "background-color: " + flag.color + ";");

      let innerDiv = document.createElement("div");
      innerDiv.setAttribute("class", "fmInnerDiv");

        let headerDiv = document.createElement("div");
        headerDiv.setAttribute("class", "fmHeader");

          let authorSpan = document.createElement("span");
          authorSpan.setAttribute("class", "author");
          authorSpan.innerHTML = post.author;
          headerDiv.appendChild(authorSpan);

          let secondSpan = document.createElement("span");
          secondSpan.setAttribute("class", "headerText");
          secondSpan.innerHTML = " flagged elicitor for:";
          headerDiv.appendChild(secondSpan);

        innerDiv.appendChild(headerDiv);

        let flagName = document.createElement("div");
        flagName.setAttribute("class", "flagName");
        flagName.innerHTML = flag.name;
        innerDiv.appendChild(flagName);

        let flagDesc = document.createElement("div");
        flagDesc.setAttribute("class", "flagDesc");
        flagDesc.innerHTML = flag.description;
        innerDiv.appendChild(flagDesc);

      newModal.appendChild(innerDiv);

  bucket.appendChild(newModal);

  return newModal;
}

function hasFlag(post) {
  if(post.flag == "" || post.flag == null) {
    return false;
  } else {
    return true;
  }
}

export function findFlagObject(name) {
  for(let i = 0; i < flagData.length; i++) {
    if(flagData[i].name === name) {
      return flagData[i];
    }
  }
  return false;
}