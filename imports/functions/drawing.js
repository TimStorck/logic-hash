import { Coord } from './objects.js';
import { Line } from './objects.js';
import { centerOf } from './measurements.js';
import { centerVert } from './measurements.js';
import { centerHor } from './measurements.js';
import { dimensOf } from './measurements.js';
import { widthFromChars } from './measurements.js';
import { flagData } from '../data/flag-data.js';
import { fSModel } from './reactive.js';
import { findBestSpot } from './placement.js';

export function drawMotionTextBox(post, butcket, centerPos) {
  let newElem = createTextBoxElement(post, bucket);
  let dimens = dimensOf(newElem);
  
  let topLeftPos = centerPos.minus(centerOf(dimens));
  newElem.style.top = topLeftPos.yPx();
  newElem.style.left = topLeftPos.xPx();
/*
  for development
*/
  // newElem.style.display = "none";

  fSModel.addBox(topLeftPos, topLeftPos.plus(dimens));
}

export function drawResponseTextBox(post, bucket, elicitorCenter, canCtx, canvas) {
  let newElem = createTextBoxElement(post, bucket);
  let dimens = dimensOf(newElem);

/*
  for development
*/
  // drawCircle(elicitorCenter, canCtx);

  let centerPos = findBestSpot(dimens, elicitorCenter, canCtx, canvas);
  let topLeftPos = centerPos.minus(centerOf(dimens))
  newElem.style.top = topLeftPos.yPx();
  newElem.style.left = topLeftPos.xPx();
/*
  for development
*/
  // newElem.style.display = "none";

  fSModel.addResponse(topLeftPos, topLeftPos.plus(dimens));
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
  for development
*/
export function drawFSModel(canCtx) {

  for (let i=0;i<fSModel.lineArray.length;i++) {
    drawLine(fSModel.lineArray[i], canCtx, "red");
    markLineSide(fSModel.lineArray[i], canCtx);
  }
}

/*
  for development
*/
export function clearCanvas(canvas, canCtx) {
  canCtx.fillStyle = "white";
  canCtx.fillRect(0,0,canvas.width, canvas.height);
}

/*
  for development
*/
export function drawLine(line, canCtx, color) {
  canCtx.beginPath();
  canCtx.strokeStyle = color;
  canCtx.moveTo(line.a.x,line.a.y);
  canCtx.lineTo(line.b.x,line.b.y);
  canCtx.stroke();
  canCtx.closePath();
}


/*
  for development
*/
function markLineSide(line, canCtx) {
  let middle;
  switch(line.side) {
    //top
    case 0:
      middle = centerHor(line);
      drawLine(new Line(
        new Coord(middle, line.a.y), 
        new Coord(middle, line.a.y - 3)), 
        canCtx,
        "red"
      );
      break;
    //right
    case 1:
      middle = centerVert(line);
      drawLine(new Line(
        new Coord(line.a.x, middle), 
        new Coord(line.a.x + 3, middle)), 
        canCtx,
        "red"
      );
      break;
    //bottom
    case 2:
      middle = centerHor(line);
      drawLine(new Line(
        new Coord(middle, line.a.y), 
        new Coord(middle, line.a.y + 3)), 
        canCtx,
        "red"
      );
      break;
    //left
    case 3:
      middle = centerVert(line);
      drawLine(new Line(
        new Coord(line.a.x, middle), 
        new Coord(line.a.x - 3, middle)), 
        canCtx,
        "red"
      );
  }
}

/*
  for development
*/
export function drawArea(area, canCtx) {
  drawLine(new Line(new Coord(area.a.x, area.a.y), new Coord(area.b.x, area.a.y)), canCtx, "yellow");
  drawLine(new Line(new Coord(area.b.x, area.a.y), new Coord(area.b.x, area.b.y)), canCtx, "yellow");
  drawLine(new Line(new Coord(area.b.x, area.b.y), new Coord(area.a.x, area.b.y)), canCtx, "yellow");
  drawLine(new Line(new Coord(area.a.x, area.b.y), new Coord(area.a.x, area.a.y)), canCtx, "yellow");
}

/*
  for development
*/
export function drawCircle(coord, canCtx) {
  canCtx.beginPath();
  canCtx.fillStyle = "red";
  canCtx.arc(coord.x, coord.y, 1,0,Math.PI*2,true);
  canCtx.fill();
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