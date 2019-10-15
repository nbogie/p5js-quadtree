function assertTrue(assertion: boolean, text: string): void {
  if (!assertion) {
    throw new Error("AssertionError: Expected true, got false: " + text);
  }
}
function assertFalse(assertion: boolean, text: string): void {
  if (assertion) {
    throw new Error("AssertionError: Expected false, got true: " + text);
  }
}

function assertFallsWithin(p: Point, t: QuadTree) {
  assertTrue(t.fallsWithin(p), `falls within? ${p.pos}`);
}
function assertNotFallsWithin(p: Point, t: QuadTree) {
  assertFalse(t.fallsWithin(p), `falls within? ${p.pos}`);
}

function testQTree(): void {
  function mp(x: number, y: number) {
    return new Particle(x, y);
  }
  const t = new QuadTree(createVector(200, 300), 50, 40);

  assertNotFallsWithin(mp(0, 100), t);

  assertNotFallsWithin(mp(251, 300), t);
  assertNotFallsWithin(mp(149, 300), t);

  assertFallsWithin(mp(176, 281), t);
  assertNotFallsWithin(mp(174, 281), t);

  assertTrue(t.insert(mp(180, 290)), "accept point");
  assertTrue(t.insert(mp(201, 301)), "accept point");

  let r1 = new Rectangle(920, 780, 140, 120);
  let r2 = new Rectangle(918, 720, 100, 140);
  debugger;
  assertTrue(r1.overlaps(r2), "should overlap");
}
