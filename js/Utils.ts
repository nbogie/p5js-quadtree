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
    if (weight > recordWeight) {
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
