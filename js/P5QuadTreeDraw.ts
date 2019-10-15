//TODO: this requires p5.  keep separate from library-independent quadtree code
function drawQuadTree(tree: QuadTree): void {
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

  if (tree.isSubdivided()) {
    for (let subtree of [tree.ne, tree.nw, tree.se, tree.sw]) {
      drawQuadTree(subtree);
    }
  }
}
