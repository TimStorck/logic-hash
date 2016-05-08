import { Coord } from './objects.js';

export function dimensOf(elem) {
  return new Coord(elem.offsetWidth, elem.offsetHeight)
}

export function centerOf(dimens) {
  return new Coord(dimens.x/2, dimens.y/2);
}

export function widthFromChars(charNo) {
  return (charNo / (Math.sqrt(charNo) / 12.9) ) + "px";
  /*
    so that text box with few words has smaller width and 
    textboxes with varying amounts of characters approximate square shape.

    set up excel sheet collecting data for amounts of characters and 
    width of div that makes it look close to square. the relationship is
    something like the formula here. that divisor constant may be the relationship
    between the number of pixels of line height and pixel width
    of an average character, or a square of it or something like that.
  */
}