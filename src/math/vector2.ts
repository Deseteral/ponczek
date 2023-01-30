const FLOATING_POINT_TOLERANCE = 0.000001;

/**
 * Two dimensional vector.
 */
export class Vector2 {
  /**
   * X component of this vector.
   */
  public x: number;

  /**
   * Y component of this vector.
   */
  public y: number;

  /**
   * Creates new vector.
   */
  constructor(x: number = 0, y: number = 0) {
    this.x = x;
    this.y = y;
  }

  /**
   * Sets new values for X and Y components on current vector.
   * Returns reference to itself.
   */
  public set(x: number, y: number): Vector2 {
    this.x = x;
    this.y = y;
    return this;
  }

  /**
   * Adds given vector to current vector.
   * Result values will be set on current vector.
   * Returns reference to itself.
   */
  public add(v: Vector2): Vector2 {
    this.x += v.x;
    this.y += v.y;
    return this;
  }

  /**
   * Subtracts given vector from current vector.
   * Result values will be set on current vector.
   * Returns reference to itself.
   */
  public sub(v: Vector2): Vector2 {
    this.x -= v.x;
    this.y -= v.y;
    return this;
  }

  /**
   * Multiplies current vector by given scalar.
   * Result values will be set on current vector.
   * Returns reference to itself.
   */
  public mul(scalar: number): Vector2 {
    this.x *= scalar;
    this.y *= scalar;
    return this;
  }

  /**
   * Divides current vector by given scalar.
   * Result values will be set on current vector.
   * Returns reference to itself.
   */
  public div(scalar: number): Vector2 {
    this.x /= scalar;
    this.y /= scalar;
    return this;
  }

  /**
   * Scales current vector by given vector.
   * Result values will be set on current vector.
   * Returns reference to itself.
   */
  public scale(v: Vector2): Vector2 {
    this.x *= v.x;
    this.y *= v.y;
    return this;
  }

  /**
   * Linearly interpolates between current and given vector by `t`, where `t` is a number in range [0, 1].
   * Result values will be set on current vector.
   * Returns reference to itself.
   */
  public lerp(target: Vector2, t: number): Vector2 {
    const invt = 1 - t;
    this.x = (this.x * invt) + (target.x * t);
    this.y = (this.y * invt) + (target.y * t);
    return this;
  }

  /**
   * Length of this vector.
   */
  public get magnitude(): number {
    return Math.sqrt(this.sqrMagnitude);
  }

  /**
   * Squared length of this vector.
  */
  public get sqrMagnitude(): number {
    return (this.x * this.x + this.y * this.y);
  }

  /**
   * Converts vector to unit vector while keeping it pointing in the same direction.
   * Returns reference to itself.
   */
  public normalize(): Vector2 {
    const length = this.magnitude;
    if (length !== 0) {
      this.x /= length;
      this.y /= length;
    }
    return this;
  }

  /**
   * Limits the length of current vector, by given maximum length.
   * Returns reference to itself.
   */
  public limit(limit: number): Vector2 {
    return this.sqrLimit(limit * limit);
  }

  /**
   * Limits the length of current vector, by given maximum length squared.
   * Returns reference to itself.
   */
  public sqrLimit(sqrlimit: number): Vector2 {
    const sqrlen = this.sqrMagnitude;
    return (sqrlen > sqrlimit)
      ? this.mul(Math.sqrt(sqrlimit / sqrlen))
      : this;
  }

  /**
   * Clamps length of current vector between `min` and `max` values.
   * Returns reference to itself.
   */
  public clamp(min: number, max: number): Vector2 {
    const sqrlen = this.sqrMagnitude;
    const sqrmax = max * max;
    const sqrmin = min * min;

    if (sqrlen === 0) return this;
    if (sqrlen > sqrmax) return this.mul(Math.sqrt(sqrmax / sqrlen));
    if (sqrlen < sqrmin) return this.mul(Math.sqrt(sqrmin / sqrlen));
    return this;
  }

  /**
   * Sets length of current vector.
   * Returns reference to itself.
   */
  public setLength(length: number): Vector2 {
    return this.setSqrLength(length * length);
  }

  /**
   * Sets length of current vector squared.
   * Returns reference to itself.
   */
  public setSqrLength(sqrlen: number): Vector2 {
    const currentSqrLen = this.sqrMagnitude;
    return (currentSqrLen === 0 || currentSqrLen === sqrlen)
      ? this
      : this.mul(Math.sqrt(sqrlen / currentSqrLen));
  }

  /**
   * This vectors angle in radians.
   */
  public get angleRad(): number {
    return Math.atan2(this.y, this.x);
  }

  /**
   * This vectors angle in degrees.
   */
  public get angleDeg(): number {
    let angle = Math.atan2(this.y, this.x) * Math.radiansToDegrees;
    if (angle < 0) angle += 360;
    return angle;
  }

  /**
   * Sets angle (in radians) of current vector, while keeping its length.
   * Returns reference to itself.
   */
  public setAngleRad(radians: number): Vector2 {
    this.x = this.magnitude;
    this.y = 0;
    this.rotateRad(radians);
    return this;
  }

  /**
   * Sets angle (in degrees) of current vector, while keeping its length.
   * Returns reference to itself.
   */
  public setAngleDeg(degrees: number): Vector2 {
    return this.setAngleRad(degrees * Math.degreesToRadians);
  }

  /**
   * Rotates current vector by given angle (in radians).
   * Returns reference to itself.
   */
  public rotateRad(radians: number): Vector2 {
    const cos = Math.cos(radians);
    const sin = Math.sin(radians);

    const nx = this.x * cos - this.y * sin;
    const ny = this.x * sin + this.y * cos;

    return this.set(nx, ny);
  }

  /**
   * Rotates current vector by given angle (in degrees).
   * Returns reference to itself.
   */
  public rotateDeg(degrees: number): Vector2 {
    return this.rotateRad(degrees * Math.degreesToRadians);
  }

  /**
   * Rotates current vector by given angle (in radians) around given pivot point.
   * Returns reference to itself.
   */
  public rotateAroundRad(pivot: Vector2, radians: number): Vector2 {
    return this.sub(pivot).rotateRad(radians).add(pivot);
  }

  /**
   * Rotates current vector by given angle (in degrees) around given pivot point.
   * Returns reference to itself.
   */
  public rotateAroundDeg(pivot: Vector2, degrees: number): Vector2 {
    return this.sub(pivot).rotateDeg(degrees).add(pivot);
  }

  /**
   * Rotates current vector by 90 degrees.
   */
  public rotate90(clockwise: boolean): Vector2 {
    const { x } = this;
    if (clockwise) {
      this.x = this.y;
      this.y = -x;
    } else {
      this.x = -this.y;
      this.y = x;
    }
    return this;
  }

  /**
   * Returns `true` when vector has length of 1.
   */
  public isUnit(tolerance: number = FLOATING_POINT_TOLERANCE): boolean {
    return Math.abs(this.sqrMagnitude - 1) < tolerance;
  }

  /**
   * Returns `true` when vector has length of 0.
   */
  public isZero(tolerance: number = FLOATING_POINT_TOLERANCE): boolean {
    return this.sqrMagnitude < tolerance;
  }

  /**
   * Returns `true` if current vector is equal to given vector.
   */
  public equals(other: Vector2, tolerance: number = FLOATING_POINT_TOLERANCE): boolean {
    if (Math.abs(other.x - this.x) > tolerance) return false;
    if (Math.abs(other.y - this.y) > tolerance) return false;
    return true;
  }

  /**
   * Creates new instance of vector with values of current vector.
   */
  public copy(): Vector2 {
    return new Vector2(this.x, this.y);
  }

  /**
   * Calculates dot product of two vectors.
   */
  public static dot(a: Vector2, b: Vector2): number {
    return a.x * b.x + a.y * b.y;
  }

  /**
   * Calculates cross product of two vectors.
   */
  public static cross(a: Vector2, b: Vector2): number {
    return a.x * b.y - a.y * b.x;
  }

  /**
   * Calculates squared distance between two vectors.
   */
  public static sqrDistance(a: Vector2, b: Vector2): number {
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    return (dx * dx + dy * dy);
  }

  /**
   * Calculates distance between two vectors.
   */
  public static distance(a: Vector2, b: Vector2): number {
    return Math.sqrt(Vector2.sqrDistance(a, b));
  }

  /**
   * Returns `true` when two vectors lie on the same line.
   */
  public static areOnSameLine(a: Vector2, b: Vector2, tolerance: number = FLOATING_POINT_TOLERANCE): boolean {
    return Math.abs(a.x * b.y - a.y * b.x) <= tolerance;
  }

  /**
   * Returns `true` when two vectors lie on the same line and have same direction.
   */
  public static areCollinear(a: Vector2, b: Vector2, tolerance: number = FLOATING_POINT_TOLERANCE): boolean {
    return Vector2.areOnSameLine(a, b, tolerance) && Vector2.hasSameDirection(a, b);
  }

  /**
   * Returns `true` when two vectors lie on the same line and have opposite direction.
   */
  public static areCollinearOpposite(a: Vector2, b: Vector2, tolerance: number = FLOATING_POINT_TOLERANCE): boolean {
    return Vector2.areOnSameLine(a, b, tolerance) && Vector2.hasOppositeDirection(a, b);
  }

  /**
   * Returns `true` when two vectors are perpendicular.
   */
  public static arePerpendicular(a: Vector2, b: Vector2, tolerance: number = FLOATING_POINT_TOLERANCE): boolean {
    return Math.abs(Vector2.dot(a, b)) <= tolerance;
  }

  /**
   * Calculates angle in radians between two vectors.
   */
  public static angleRad(a: Vector2, b: Vector2): number {
    return Math.atan2(Vector2.cross(b, a), Vector2.dot(b, a));
  }

  /**
   * Calculates angle in degrees between two vectors.
   */
  public static angleDeg(a: Vector2, b: Vector2): number {
    let angle = Math.atan2(Vector2.cross(b, a), Vector2.dot(b, a)) * Math.radiansToDegrees;
    if (angle < 0) angle += 360;
    return angle;
  }

  /**
   * Returns `true` then two vectors have same direction.
   */
  public static hasSameDirection(a: Vector2, b: Vector2): boolean {
    return Vector2.dot(a, b) > 0;
  }

  /**
   * Returns `true` then two vectors have opposite direction.
   */
  public static hasOppositeDirection(a: Vector2, b: Vector2): boolean {
    return Vector2.dot(a, b) < 0;
  }

  /**
   * Vector pointing to the right.
   */
  public static right(): Vector2 {
    return new Vector2(1, 0);
  }

  /**
   * Vector pointing to the left.
   */
  public static left(): Vector2 {
    return new Vector2(-1, 0);
  }

  /**
   * Vector pointing up.
   */
  public static up(): Vector2 {
    return new Vector2(0, -1);
  }

  /**
   * Vector pointing down.
   */
  public static down(): Vector2 {
    return new Vector2(0, 1);
  }

  /**
   * Zero length vector.
   */
  public static zero(): Vector2 {
    return new Vector2(0, 0);
  }

  /**
   * String representation of current vector in form of "<x, y>".
   */
  public toString(): string {
    return `<${this.x}, ${this.y}>`;
  }
}
