export function drawTextBox(post, butcket) {
  let newElem = document.createElement("div");
  newElem.setAttribute("class", "motion");
  newElem.innerHTML = post.content;
  newElem.style.top = "250px";
  newElem.style.left = "450px";
  bucket.appendChild(newElem);
}