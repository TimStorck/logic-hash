export function drawTextBox(post, butcket, coord) {
  let newElem = document.createElement("div");
  newElem.setAttribute("class", "motion");
  newElem.innerHTML = post.content;
  newElem.style.top = coord.yPx();
  newElem.style.left = coord.xPx();
  bucket.appendChild(newElem);
}