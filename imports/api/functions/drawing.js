import { Coord } from './objects.js';
import { centerOf } from './measurements.js';
import { dimensOf } from './measurements.js';
import { widthFromChars } from './measurements.js';

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

  fSModel.updateTopLine(topLeftPos, topLeftPos.plus(dimens), true);
  fSModel.updateLeftLine(topLeftPos, topLeftPos.plus(dimens), true);
  fSModel.updateBottomLine(topLeftPos, topLeftPos.plus(dimens), true);
  fSModel.updateRightLine(topLeftPos, topLeftPos.plus(dimens), true);
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

}