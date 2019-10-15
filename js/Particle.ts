class Particle {
  pos: p5.Vector;
  draw(): void {
    stroke("white");
    strokeWeight(1);
    point(this.pos.x, this.pos.y);
  }
  constructor(x: number, y: number) {
    this.pos = createVector(x, y);
  }
  static randomOnScreen(): Particle {
    return new Particle(random(width), random(height));
  }
  static perlinRandomOnScreen(ix: number): Particle {
    let x = width * noise(ix + frameCount / 100);
    let y = height * noise(7 * ix + frameCount / 123);
    return new Particle(x, y);
  }
}
