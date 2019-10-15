//TODO: remove p5.Vector to have no dependence on p5
interface IQuadTree {
  insert: (p: Point) => boolean;
  query(queryRectangle: Rectangle): Point[];
}

class QuadTree implements IQuadTree {
  static staticQTCounter = 0; //this is a hack.  this is only needed
  // to give the quadtree nodes an id for debugging

  /** Build a QuadTree with the given bounds, and populate it with the given points.
   * Returns a built quadtree (a recursive structure).
   */
  static build(
    cx: number,
    cy: number,
    w: number,
    h: number,
    gPoints: Point[]
  ): QuadTree {
    const t = new QuadTree(createVector(cx, cy), w, h);
    gPoints.forEach(p => t.insert(p));
    return t;
  }

  /** Add the given point to the quadtree.
   *
   * Returns false if the point is outwith the bounds of the quadtree,
   * else true. */
  insert(p: Point): boolean {
    if (!this.rectangle.fallsWithin(p)) {
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
      //delegate to subquadtrees
      if ([this.ne, this.nw, this.se, this.sw].some(qt => qt.insert(p))) {
        return true;
      }

      throw new Error(
        "Should be unreachable.  All subquads reject point insertion."
      );
    }
  }

  /** Find all points in the quadtree falling within the given rectangle.
   *
   * Takes a bounding rectangle as limits of the query
   * Returns a list of results.
   * If given a list to populate it will add results to that list.
   */
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

  // internal -------------------------------------------------------
  subdivide() {
    const cx = this.rectangle.cx;
    const cy = this.rectangle.cy;
    const qW = this.rectangle.w / 4; //quarter width, quarter height
    const qH = this.rectangle.h / 4;
    const hW = qW * 2; // half width, half height
    const hH = qH * 2;

    this.ne = new QuadTree(createVector(cx + qW, cy - qH), hW, hH);
    this.nw = new QuadTree(createVector(cx - qW, cy - qH), hW, hH);
    this.se = new QuadTree(createVector(cx + qW, cy + qH), hW, hH);
    this.sw = new QuadTree(createVector(cx - qW, cy + qH), hW, hH);
  }

  isSubdivided(): boolean {
    return this.ne !== undefined;
  }

  // member variables  ---------------------------------------------------------
  directlyContainedPoints: Point[];
  capacity: number;
  ne?: QuadTree;
  se?: QuadTree;
  nw?: QuadTree;
  sw?: QuadTree;

  rectangle: Rectangle;
  myID: number;

  //constructor ---------------------------------------------------------------
  constructor(center: p5.Vector, w: number, h: number) {
    this.myID = QuadTree.staticQTCounter++;
    this.rectangle = new Rectangle(center.x, center.y, w, h);
    this.directlyContainedPoints = [];
    this.capacity = 20;
  }
}
