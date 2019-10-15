function randomScreenPosition(): p5.Vector {
  return createVector(random(width), random(height));
}

function centerScreenPos(): p5.Vector {
  return createVector(width / 2, height / 2);
}

function randomInt(min: number, max: number): number {
  return round(random(min, max));
}

function translateToVec(pos: p5.Vector): void {
  translate(pos.x, pos.y);
}
function maxBy<T>(list: T[], fn: (item: T) => number): T {
  return minBy(list, v => -fn(v));
}
/** Find the minimum of the given list after applying fn() to each.
 * Return the minimum, first minimum, or undefined if there are no items.
 */
function minBy<T>(list: T[], fn: (item: T) => number): T {
  if (list.length < 0) {
    return undefined;
  }
  let recordItem = list[0];
  let recordWeight = fn(list[0]);
  for (let item of list) {
    const weight = fn(item);
    if (weight < recordWeight) {
      recordWeight = weight;
      recordItem = item;
    }
  }
  return recordItem;
}

/** Repeatedly call the given function fn, num times, throwing any output away. */
function repeat(num: number, fn: (ix: number) => void) {
  for (let i = 0; i < num; i++) {
    fn(i);
  }
}

function randomBoolean(): boolean {
  return Math.random() > 0.5;
}

function mousePosAsVector(): p5.Vector {
  return createVector(mouseX, mouseY);
}

function timeIt(fn: () => void) {
  const a = millis();
  fn();
  return millis() - a;
}

/** Show a panel of text information, on multiple lines, at the given position.
 *
 * Intended for debug text. */
function showDebugText(x: number, y: number, lines: string[]) {
  const lineHeight = 40;
  textSize(24);
  const w = textWidth(maxBy(lines, l => l.length));

  fill(100, 100, 100, 200);
  strokeWeight(10);
  stroke("whitesmoke");
  rectMode(CORNER);
  rect(x - 30, y - 30, w + 60, lines.length * lineHeight + 60);

  noStroke();
  fill("black");
  textLeading(lineHeight);
  text(lines.join("\n"), x, y);
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
