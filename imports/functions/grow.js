export function checkGrow(canvas, canCtx, marginBox) {
  if (marginBox[0] != "undefined" && marginBox[0].a.x < 0) {
    console.log(canvas.width);
    //subtract negative to add absolute value
    canvas.width = canvas.width - marginBox[0].a.x;
  }
  if (marginBox[0] != "undefined" && marginBox[0].a.y < 0) {
    console.log(canvas.height);
    //subtract negative to add absolute value
    canvas.height = canvas.height - marginBox[0].a.y;
  }
  if (marginBox[2] != "undefined" && marginBox[2].b.x > canvas.width) {
    console.log(canvas.width);
    canvas.width = marginBox[2].b.x;
  }
  if (marginBox[2] != "undefined" && marginBox[2].b.y > canvas.height) {
    console.log(canvas.height);
    canvas.height = marginBox[2].b.y;
  }
}