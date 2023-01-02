export class Random {
  static readonly default = new Random();

  /**
   * Returns the next random float in range [min, max).
   */
  nextFloat(min: number, max: number): number {
    return ((max - min) * Math.random()) + min;
  }

  /**
   * Returns the next random int in range [min, max].
   */
  nextInt(min: number, max: number): number {
    return Math.floor((max - min + 1) * Math.random() + min);
  }

  /**
   * Returns true or false randomly with specified odds (50/50 by default).
   * @param chance takes values between [0, 1]. Given 0 it will always return false.
   */
  nextBoolean(chance: number = 0.5): boolean {
    return (chance === 0) ? false : (Math.random() <= chance);
  }

  /**
   * Returns a random element from array.
   */
  pickOne<T>(array: T[]): T {
    return array[this.nextInt(0, array.length - 1)];
  }

  /**
   * Returns an array of random elements from given array.
   *
   * When duplicates are not allowed it will only deduplicate by indices.
   * This may lead to duplicate values being returned if the source array has duplicated values.
   */
  pickMany<T>(array: T[], pickCount: number, allowDuplicates: boolean = false): T[] {
    return allowDuplicates
      ? this.pickManyWithDuplicates(array, pickCount)
      : this.pickManyWithoutDuplicates(array, pickCount);
  }

  /*
   * Shuffles given array in place.
   */
  shuffleInPlace<T>(array: T[]): void {
    array.sort(() => (0.5 - Math.random()));
  }

  /*
   * Returns new array that is the shuffled copy of the given array.
   */
  shuffle<T>(array: T[]): T[] {
    const a = array.slice();
    this.shuffleInPlace(a);
    return a;
  }

  /**
   * Returns a random number in range [1, 4] (same as d4 dice roll).
   */
  d4(): number {
    return this.nextInt(1, 4);
  }

  /**
   * Returns a random number in range [1, 6] (same as d6 dice roll).
   */
  d6(): number {
    return this.nextInt(1, 6);
  }

  /**
   * Returns a random number in range [1, 8] (same as d8 dice roll).
   */
  d8(): number {
    return this.nextInt(1, 8);
  }

  /**
   * Returns a random number in range [1, 10] (same as d10 dice roll).
   */
  d10(): number {
    return this.nextInt(1, 10);
  }

  /**
   * Returns a random number in range [1, 12] (same as d12 dice roll).
   */
  d12(): number {
    return this.nextInt(1, 12);
  }

  /**
   * Returns a random number in range [1, 20] (same as d20 dice roll).
   */
  d20(): number {
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
}
