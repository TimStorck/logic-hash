export function checkIfOverEdge(canvas, marginBox, canvasExpansion) {
  if (marginBox[0] != "undefined" && marginBox[0].a.y < 0) {
    if (marginBox[0].a.y * -1 > canvasExpansion[0]) {
      canvasExpansion[0] = marginBox[0].a.y * -1;
    }
  }
  if (marginBox[0] != "undefined" && marginBox[0].b.x > canvas.width) {
    if (marginBox[0].b.x - canvas.width > canvasExpansion[1]) {
      canvasExpansion[1] = marginBox[0].b.x - canvas.width;
    }
  }
  if (marginBox[2] != "undefined" && marginBox[2].b.y > canvas.height) {
    if (marginBox[2].b.y - canvas.height > canvasExpansion[2]) {
      canvasExpansion[2] = marginBox[2].b.y - canvas.height;
    }
  }
  if (marginBox[2] != "undefined" && marginBox[2].a.x < 0) {
    if (marginBox[2].a.x * -1 > canvasExpansion[3]) {
      canvasExpansion[3] = marginBox[2].a.x * -1;
    }
  }
}