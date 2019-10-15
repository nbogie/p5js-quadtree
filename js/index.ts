"use strict";
//p5.disableFriendlyErrors = true;

//Credits: uses point-rectangle and rectangle-rectangle collision math from:
// https://github.com/bmoren/p5.collide2D/blob/master/p5.collide2d.js
// license: https://creativecommons.org/licenses/by-nc-sa/4.0/

interface Point {
  pos: p5.Vector;
}

let gPoints: Particle[];
let gQuadTree: QuadTree;
let gQueryRectangle: Rectangle;
let gQueryResults: Point[];

//only for performance analysis
let gTimings = {
  timeToBuild: 0,
  timeToQuery: 0,
  update: 0,
  drawOnly: 0,
  timeToLocateNaively: 0
};

interface AppOptions {
  isGridOn: boolean;
  isDrawAllPoints: boolean;
  isDrawQueryResults: boolean;
  isShowDebugText: boolean;
}

let opts = {
  isGridOn: false,
  isDrawAllPoints: true,
  isDrawQueryResults: true,
  isShowDebugText: true
};

function setup() {
  createCanvas(windowWidth, windowHeight);
  gPoints = [];
}

function mouseDragged() {
  let p = new Particle(mouseX, mouseY);
  gPoints.push(p);
}

function update() {
  gQueryRectangle = new Rectangle(mouseX, mouseY, 100, 100);
  QuadTree.staticQTCounter = 0;
  gTimings.timeToBuild = timeIt(() => {
    gQuadTree = QuadTree.build(width / 2, height / 2, width, height, gPoints);
  });
  //make the query and highlight the points it returns
  gTimings.timeToQuery = timeIt(
    () => (gQueryResults = gQuadTree.query(gQueryRectangle))
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
  opts.isGridOn && drawDebugGrid();
  drawQuadTree(gQuadTree);
  opts.isDrawAllPoints && drawAllPoints();
  drawQueryRectangle();
  opts.isDrawQueryResults && drawQueryResults();
  opts.isShowDebugText && drawDebugPanels();
}

function drawDebugPanels(): void {
  showDebugText(50, height - 400, [
    "FPS: " + frameRate().toFixed(2),
    "points from query: " + gQueryResults.length,
    "total points: " + gPoints.length,
    "update() (ms): " + gTimings.update.toFixed(2),
    "drawOnly() (not update) (ms): " + gTimings.drawOnly.toFixed(2),
    "query time (ms): " + gTimings.timeToQuery.toFixed(2),
    "Rebuild time (ms): " + gTimings.timeToBuild.toFixed(0),
    "Naive query (ms):" + gTimings.timeToLocateNaively.toFixed(2)
  ]);
  showDebugText(width / 2, height - 400, [
    "d - toggle Draw of all points",
    "q - toggle draw of Query points",
    "p - (re)Populate *many* points",
    "g - toggle draw of Grid",
    "h - hide/show this Help"
  ]);
}
function drawQueryRectangle(): void {
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
}
function drawAllPoints(): void {
  stroke("white");
  strokeWeight(2);

  for (let p of gPoints) {
    point(p.pos.x, p.pos.y);
  }
}

function drawQueryResults(): void {
  strokeWeight(7);
  stroke("red");
  for (let p of gQueryResults) {
    point(p.pos.x, p.pos.y);
  }
}

function keyPressed() {
  if (key == "d") {
    toggleDrawAllPoints();
  }
  if (key == "q") {
    toggleDrawQueryResults();
  }
  if (key == "h") {
    toggleShowDebugText();
  }
  if (key == "p") {
    populateTreeRandomly();
  }
  if (key == "g") {
    toggleDrawGrid();
  }
}
function toggleDrawAllPoints(): boolean {
  return (opts.isDrawAllPoints = !opts.isDrawAllPoints);
}

function toggleDrawQueryResults(): boolean {
  return (opts.isDrawQueryResults = !opts.isDrawQueryResults);
}

function toggleShowDebugText(): boolean {
  return (opts.isShowDebugText = !opts.isShowDebugText);
}

function toggleDrawGrid(): boolean {
  return (opts.isGridOn = !opts.isGridOn);
}

function populateTreeRandomly(): void {
  gPoints.length = 0;
  repeat(10000, ix => gPoints.push(Particle.perlinRandomOnScreen(ix)));
}
