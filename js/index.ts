"use strict";
//p5.disableFriendlyErrors = true;

//Credits: uses point-rectangle and rectangle-rectangle collision math from:
// https://github.com/bmoren/p5.collide2D/blob/master/p5.collide2d.js
// license: https://creativecommons.org/licenses/by-nc-sa/4.0/

interface Point {
  pos: p5.Vector;
}

let gPoints: Particle[];
let qtree: QuadTree;
let qtreeFromScratch: QuadTree;
let gQueryRectangle: Rectangle;
let isGridOn = false;
let isDrawAllPoints = false;
let isDrawQueryResults = true;

function toggleDrawAllPoints(): boolean {
  isDrawAllPoints = !isDrawAllPoints;
  return isDrawAllPoints;
}
function toggleDrawQueryResults(): boolean {
  isDrawQueryResults = !isDrawQueryResults;
  return isDrawQueryResults;
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  gPoints = [];
  const center = createVector(width / 2, height / 2);
  qtree = new QuadTree(center, width, height);
  repeat(100000, ix => gPoints.push(Particle.perlinRandomOnScreen(ix)));
  //testQTree();
}

function mouseDragged() {
  let p = new Particle(mouseX, mouseY);
  gPoints.push(p);
  qtree.insert(p);
}

function update() {
  gQueryRectangle = new Rectangle(mouseX, mouseY, 100, 100);
  gTimings.timeToBuild = timeIt(() => {
    qtreeFromScratch = QuadTree.build(
      width / 2,
      height / 2,
      width,
      height,
      gPoints
    );
  });
  //make the query and highlight the points it returns
  gTimings.timeToQuery = timeIt(
    () => (gQueryResults = qtreeFromScratch.query(gQueryRectangle))
  );
  gTimings.timeToLocateNaively = timeIt(() =>
    gPoints.filter(p => dist(p.pos.x, p.pos.y, mouseX, mouseY) < 100)
  );
}

function draw() {
  gTimings.update = timeIt(() => update());
  gTimings.drawOnly = timeIt(() => drawOnly());
}
function drawOnly() {
  background("black");
  if (isGridOn) {
    drawDebugGrid();
  }
  drawQuadTreeForP5(qtree);

  if (isDrawAllPoints) {
    //draw ALL the points in the demo
    stroke("white");
    strokeWeight(2);

    for (let p of gPoints) {
      point(p.pos.x, p.pos.y);
    }
  }

  //draw the query rectangle (follows the mouse)
  rectMode(CENTER);
  noFill();
  stroke("orange");
  strokeWeight(0.3);
  rect(
    gQueryRectangle.cx,
    gQueryRectangle.cy,
    gQueryRectangle.w,
    gQueryRectangle.h
  );

  // qtree.query(queryRectangle);
  if (isDrawQueryResults) {
    strokeWeight(7);
    stroke("red");
    for (let p of gQueryResults) {
      point(p.pos.x, p.pos.y);
    }
  }

  //debugging count
  logLines(50, height - 400, [
    "FPS: " + frameRate().toFixed(2),
    "query count: " + gQueryResults.length,
    "full count: " + gPoints.length,
    "update() (ms): " + gTimings.update.toFixed(2),
    "drawOnly() (not update) (ms): " + gTimings.drawOnly.toFixed(2),
    "query time (ms): " + gTimings.timeToQuery.toFixed(2),
    "Rebuild time (ms): " + gTimings.timeToBuild.toFixed(0),
    "Naive query (ms):" + gTimings.timeToLocateNaively.toFixed(2)
  ]);
}

let gTimings = {
  timeToBuild: 0,
  timeToQuery: 0,
  update: 0,
  drawOnly: 0,
  timeToLocateNaively: 0
};
let gQueryResults: Point[];

function logLines(x: number, y: number, lines: string[]) {
  const lineHeight = 40;
  textSize(30);
  fill("gray");
  stroke("whitesmoke");
  rectMode(CORNER);
  rect(x - 30, y - 30, width - 60, lines.length * lineHeight + 60);
  noStroke();
  fill("black");

  push();
  translate(x, y);
  lines.forEach((line: string, ix: number) => {
    translate(0, lineHeight);
    text(line, 0, 0);
  });
  pop();
}
function drawDebugGrid() {
  noStroke();
  fill("gray");
  textSize(8);
  for (let x = 0; x < width; x += 50) {
    for (let y = 0; y < height; y += 50) {
      text(`${x},${y}`, x, y);
    }
  }
}
function keyPressed() {
  if (key == "d") {
    toggleDrawAllPoints();
  }
  if (key == "q") {
    toggleDrawQueryResults();
  }
}
