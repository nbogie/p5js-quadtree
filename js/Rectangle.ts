class Rectangle {
  cx: number;
  cy: number;

  t: number;
  b: number;
  l: number;
  r: number;

  w: number;
  h: number;

  constructor(cx: number, cy: number, w: number, h: number) {
    this.cx = cx;
    this.cy = cy;
    this.w = w;
    this.h = h;
    this.t = this.cy - h / 2;
    this.b = this.cy + h / 2;
    this.l = this.cx - w / 2;
    this.r = this.cx + w / 2;
  }

  //modified from collidePointRect;
  //https://github.com/bmoren/p5.collide2D/blob/master/p5.collide2d.js
  fallsWithin(p: Point): boolean {
    return (
      p.pos.x >= this.l && // right of the left edge AND
      p.pos.x <= this.r && // left of the right edge AND
      p.pos.y >= this.t && // below the top AND
      p.pos.y <= this.b // above the bottom
    );
  }

  //modified from collideRectRect;
  //https://github.com/bmoren/p5.collide2D/blob/master/p5.collide2d.js
  overlaps(r2: Rectangle): boolean {
    return (
      this.r >= r2.l && // my right is right of your left
      this.l <= r2.r && // my left is left of your right
      this.t <= r2.b && // my upper is above your lower
      this.b >= r2.t // my lower is lower than your upper
    );
  }
}
