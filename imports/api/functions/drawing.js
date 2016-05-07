import { Coord } from './objects.js';
import { centerOf } from './measurements.js';
import { dimensOf } from './measurements.js';

export function drawTextBox(post, butcket, centerPos) {
  let newElem = document.createElement("div");
  newElem.setAttribute("class", "motion");
  newElem.innerHTML = post.content;

  bucket.appendChild(newElem);
  
  let topLeftPos = centerPos.minus(centerOf(dimensOf(newElem)));
  newElem.style.top = topLeftPos.yPx();
  newElem.style.left = topLeftPos.xPx();
}