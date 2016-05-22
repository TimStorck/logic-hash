export function Coord(x, y) {
  this.x = Math.floor(x);
  this.y = Math.floor(y);
  this.xPx = function() {
    return this.x + "px";
  };
  this.yPx = function() {
    return this.y + "px";
  };
  this.plus = function(coord) {
    return new Coord(this.x + coord.x, this.y + coord.y);
  };
  this.minus = function(coord) {
    return new Coord(this.x - coord.x, this.y - coord.y);
  };
  this.equals = function(coord) {
    if (coord.x === this.x && coord.y === this.y) {
      return true;
    }
    return false;
  };
}

export function PostOb(_id, author, content, responseNo, flag, elicitor) {
  this._id = _id;
  this.content = content;
  this.author = author;
  this.responseNo = responseNo;
  this.flag = flag;
  this.elicitor = elicitor;
}

//vertical or horizontal
export function Line(coordA, coordB, side) {
  //if horizontal
  if(coordA.y == coordB.y) {
    //if first coordinate is left end
    if(coordA.x < coordB.x) {
      this.a = coordA;
      this.b = coordB;
    } else {
      this.a = coordB;
      this.b = coordA;
    }
  //if vertical
  } else { 
    //if first coordinate is top end
    if(coordA.y < coordB.y) {
      this.a = coordA;
      this.b = coordB;
    } else {
      this.a = coordB;
      this.b = coordA;
    }
  }
  this.side = side;
}

export function Area(topLeft, bottomRight) {
  this.topLeft = topLeft;
  this.bottomRight = bottomRight;
}