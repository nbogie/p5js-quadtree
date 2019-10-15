//hacky
let gQTCounter = 0;

//TODO: remove p5.Vector - have no dependence on p5
class QuadTree {
  static build(
    cx: number,
    cy: number,
    w: number,
    h: number,
    gPoints: Particle[]
  ): QuadTree {
    const t = new QuadTree(createVector(cx, cy), w, h);
    gPoints.forEach(p => t.insert(p));
    return t;
  }
  insert(p: Point): boolean {
    if (!this.fallsWithin(p)) {
      return false;
    }
    //accept directly, or delegate
    if (this.directlyContainedPoints.length < this.capacity) {
      this.directlyContainedPoints.push(p);
      return true;
    } else {
      if (!this.isSubdivided()) {
        this.subdivide();
      }
      //delegate
      if (this.ne.insert(p)) {
        return true;
      }
      if (this.nw.insert(p)) {
        return true;
      }
      if (this.se.insert(p)) {
        return true;
      }
      if (this.sw.insert(p)) {
        return true;
      }
      throw new Error(
        "Should be unreachable.  All subquads reject point insertion."
      );
    }
  }
  subdivide() {
    const cx = this.rectangle.cx;
    const cy = this.rectangle.cy;
    const qW = this.rectangle.w / 4; //quarter width, quarter height
    const qH = this.rectangle.h / 4;
    const hW = qW * 2; // half width, half height
    const hH = qH * 2;

    this.ne = new QuadTree(cv(cx + qW, cy - qH), hW, hH);
    this.nw = new QuadTree(cv(cx - qW, cy - qH), hW, hH);
    this.se = new QuadTree(cv(cx + qW, cy + qH), hW, hH);
    this.sw = new QuadTree(cv(cx - qW, cy + qH), hW, hH);
  }

  //modified from p5.collide2d.js https://github.com/bmoren/p5.collide2D/blob/master/p5.collide2d.js
  fallsWithin(p: Point): boolean {
    return this.rectangle.fallsWithin(p);
  }

  directlyContainedPoints: Point[];
  capacity: number;
  ne?: QuadTree;
  se?: QuadTree;
  nw?: QuadTree;
  sw?: QuadTree;

  rectangle: Rectangle;
  myID: number;
  constructor(center: p5.Vector, w: number, h: number) {
    this.myID = gQTCounter++;
    this.rectangle = new Rectangle(center.x, center.y, w, h);
    this.directlyContainedPoints = [];
    this.capacity = 20;
  }
  isSubdivided(): boolean {
    return this.ne !== undefined;
  }

  query(queryRectangle: Rectangle, results?: Point[]): Point[] {
    if (results == undefined) {
      results = [];
    }

    if (this.rectangle.overlaps(queryRectangle)) {
      results.push(
        ...this.directlyContainedPoints.filter(p =>
          queryRectangle.fallsWithin(p)
        )
      );

      if (this.isSubdivided()) {
        for (let subtree of [this.ne, this.nw, this.se, this.sw]) {
          subtree.query(queryRectangle, results);
        }
      }
    }

    return results;
  }
}
const cv = (x: number, y: number) => createVector(x, y);

//TODO: this requires p5.  keep separate from library-independent quadtree code
function drawQuadTreeForP5(tree: QuadTree): void {
  stroke("yellow");
  strokeWeight(0.3);
  noFill();
  rectMode(CENTER);
  rect(
    tree.rectangle.cx,
    tree.rectangle.cy,
    tree.rectangle.w,
    tree.rectangle.h
  );

  noStroke();
  fill("white");
  textSize(10);
  text(tree.myID, tree.rectangle.cx, tree.rectangle.cy);
  //text(tree.directlyContainedPoints.length, tree.center.x, tree.center.y);

  if (tree.isSubdivided()) {
    for (let subtree of [tree.ne, tree.nw, tree.se, tree.sw]) {
      drawQuadTreeForP5(subtree);
    }
  }
}
