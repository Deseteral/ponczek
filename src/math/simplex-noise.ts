import { Random } from 'ponczek/math/random';

/**
 * Two dimensional implementation of simplex noise.
 */
export class SimplexNoise {
  private readonly perm: number[]; // TODO: Try using ArrayBuffer for optimization

  /**
   * Creates new noise generator from given random number generator (defaults to default RNG).
   */
  constructor(random = Random.default) {
    this.perm = new Array(512);
    random.nextBytes(this.perm);
  }

  /**
   * Returns value in range [0, 1] at specified position and scale.
   */
  public get(x: number, y: number, scale: number): number {
    const g = this.generate(x * scale, y * scale);
    return ((g * 128) + 128) * (1 / 255);
  }

  private generate(x: number, y: number): number {
    const F2 = 0.366025403;
    const G2 = 0.211324865;

    let n0;
    let n1;
    let n2;

    const s = (x + y) * F2;
    const xs = x + s;
    const ys = y + s;
    const i = xs | 0;
    const j = ys | 0;

    const t = (i + j) * G2;
    const X0 = i - t;
    const Y0 = j - t;
    const x0 = x - X0;
    const y0 = y - Y0;

    const i1 = (x0 > y0) ? 1 : 0;
    const j1 = (x0 > y0) ? 0 : 1;

    const x1 = x0 - i1 + G2;
    const y1 = y0 - j1 + G2;
    const x2 = x0 - 1 + (2 * G2);
    const y2 = y0 - 1 + (2 * G2);

    const ii = i % 256;
    const jj = j % 256;

    let t0 = 0.5 - (x0 ** 2) - (y0 ** 2);
    if (t0 < 0) {
      n0 = 0;
    } else {
      t0 **= 2;
      n0 = t0 * t0 * SimplexNoise.grad(this.perm[ii + this.perm[jj]], x0, y0);
    }

    let t1 = 0.5 - x1 * x1 - y1 * y1;
    if (t1 < 0) {
      n1 = 0;
    } else {
      t1 **= 2;
      n1 = t1 * t1 * SimplexNoise.grad(this.perm[ii + i1 + this.perm[jj + j1]], x1, y1);
    }

    let t2 = 0.5 - x2 * x2 - y2 * y2;
    if (t2 < 0) {
      n2 = 0;
    } else {
      t2 **= 2;
      n2 = t2 * t2 * SimplexNoise.grad(this.perm[ii + 1 + this.perm[jj + 1]], x2, y2);
    }

    return 40 * (n0 + n1 + n2);
  }

  private static grad(hash: number, x: number, y: number): number {
    const h = hash & 0x7;
    const u = h < 4 ? x : y;
    const v = h < 4 ? y : x;
    return ((h & 0x1) !== 0 ? -u : u) + ((h & 0x2) !== 0 ? (-2 * v) : (2 * v));
  }
}
