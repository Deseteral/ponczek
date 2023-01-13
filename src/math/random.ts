const fullMask = 0xffffffff;
const lowerMask = 0x7fffffff;
const upperMask = 0x80000000;

const w = 32;
const n = 624;
const m = 397;
const a = 0x9908b0df;
const u = 11;
const s = 7;
const b = 0x9d2c5680;
const t = 15;
const c = 0xefc60000;
const l = 18;
const f = 1812433253;

export class Random {
  public static readonly default = new Random();

  private mt: number[];
  private index: number;

  constructor(public seed: number = Date.now()) {
    this.index = n;
    this.mt = new Array<number>(n);
    this.mt[0] = (seed | 0);

    for (let idx = 1; idx < n; idx += 1) {
      const ext = this.mt[idx - 1] ^ (this.mt[idx - 1] >>> (w - 2));
      this.mt[idx] = (((f * ((ext & 0xffff0000) >>> 16)) << 16) + (f * (ext & 0xffff)) + idx) | 0;
    }
  }

  /**
   * Returns the next random float in range [min, max).
   */
  public nextFloat(min: number, max: number): number {
    return ((max - min) * this.extractNumber()) + min;
  }

  /**
   * Returns the next random int in range [min, max].
   */
  public nextInt(min: number, max: number): number {
    return ((max - min + 1) * this.extractNumber() + min) | 0;
  }

  /**
   * Returns true or false randomly with specified odds (50/50 by default).
   * @param chance takes values between [0, 1]. Given 0 it will always return false.
   */
  public nextBoolean(chance: number = 0.5): boolean {
    return (chance === 0) ? false : (this.extractNumber() <= chance);
  }

  /**
   * Returns a random element from array.
   */
  public pickOne<T>(array: T[]): T {
    return array[this.nextInt(0, array.length - 1)];
  }

  /**
   * Returns an array of random elements from given array.
   *
   * When duplicates are not allowed it will only deduplicate by indices.
   * This may lead to duplicate values being returned if the source array has duplicated values.
   */
  public pickMany<T>(array: T[], pickCount: number, allowDuplicates: boolean = false): T[] {
    return allowDuplicates
      ? this.pickManyWithDuplicates(array, pickCount)
      : this.pickManyWithoutDuplicates(array, pickCount);
  }

  /*
   * Shuffles given array in place.
   */
  public shuffleInPlace<T>(array: T[]): void {
    array.sort(() => (0.5 - this.extractNumber()));
  }

  /*
   * Returns new array that is the shuffled copy of the given array.
   */
  public shuffle<T>(array: T[]): T[] {
    const arr = array.slice();
    this.shuffleInPlace(arr);
    return arr;
  }

  /**
   * Returns a random number in range [1, 4] (same as d4 dice roll).
   */
  public d4(): number {
    return this.nextInt(1, 4);
  }

  /**
   * Returns a random number in range [1, 6] (same as d6 dice roll).
   */
  public d6(): number {
    return this.nextInt(1, 6);
  }

  /**
   * Returns a random number in range [1, 8] (same as d8 dice roll).
   */
  public d8(): number {
    return this.nextInt(1, 8);
  }

  /**
   * Returns a random number in range [1, 10] (same as d10 dice roll).
   */
  public d10(): number {
    return this.nextInt(1, 10);
  }

  /**
   * Returns a random number in range [1, 12] (same as d12 dice roll).
   */
  public d12(): number {
    return this.nextInt(1, 12);
  }

  /**
   * Returns a random number in range [1, 20] (same as d20 dice roll).
   */
  public d20(): number {
    return this.nextInt(1, 20);
  }

  private pickManyWithoutDuplicates<T>(array: T[], pickCount: number): T[] {
    if (pickCount < 0 || pickCount > array.length) throw new Error('pickCount must be a value in range [0, length]');
    if (pickCount === 0) return [];
    if (pickCount === array.length) return array.slice();

    const result = new Array<T>(pickCount);
    let idx = 0;
    const pickedIndices = new Set();

    while (idx < pickCount) {
      const randomIdx = this.nextInt(0, array.length - 1);

      if (pickedIndices.has(randomIdx)) continue;

      result[idx] = array[randomIdx];
      pickedIndices.add(idx);
      idx += 1;
    }

    return result;
  }

  private pickManyWithDuplicates<T>(array: T[], pickCount: number): T[] {
    if (pickCount < 0) throw new Error('pickCount must be greater than or equal to zero');
    if (pickCount === 0) return [];

    const result = new Array<T>(pickCount);
    for (let idx = 0; idx < pickCount; idx += 1) result[idx] = this.pickOne(array);

    return result;
  }

  private twist(): void {
    let y = 0;

    for (let idx = 0; idx < (n - m); idx += 1) {
      y = (this.mt[idx] & upperMask) | (this.mt[idx + 1] & lowerMask);
      this.mt[idx] = this.mt[idx + m] ^ (y >>> 1) ^ ((((y >>> 0) % 2) * a) & fullMask);
    }

    for (let idx = (n - m); idx < (n - 1); idx += 1) {
      y = (this.mt[idx] & upperMask) | (this.mt[idx + 1] & lowerMask);
      this.mt[idx] = this.mt[idx + (m - n)] ^ (y >>> 1) ^ ((((y >>> 0) % 2) * a) & fullMask);
    }

    y = (this.mt[n - 1] & upperMask) | (this.mt[0] & lowerMask);
    this.mt[n - 1] = this.mt[m - 1] ^ (y >>> 1) ^ ((((y >>> 0) % 2) * a) & fullMask);

    this.index = 0;
  }

  private extractNumber(): number {
    if (this.index >= n) {
      this.twist();
    }

    let y = this.mt[this.index];
    this.index += 1;

    y ^= (y >>> u);
    y ^= ((y << s) & b);
    y ^= ((y << t) & c);
    y ^= (y >>> l);

    return (y >>> 0) * (1 / 4294967296);
  }
}
