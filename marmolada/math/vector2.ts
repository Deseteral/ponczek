const FLOATING_POINT_TOLERANCE = 0.000001;

export class Vector2 {
  x: number;
  y: number;

  constructor(x: number = 0, y: number = 0) {
    this.x = x;
    this.y = y;
  }

  add(v: Vector2): Vector2 {
    this.x += v.x;
    this.y += v.y;
    return this;
  }

  sub(v: Vector2): Vector2 {
    this.x -= v.x;
    this.y -= v.y;
    return this;
  }

  mul(scalar: number): Vector2 {
    this.x *= scalar;
    this.y *= scalar;
    return this;
  }

  div(scalar: number): Vector2 {
    this.x /= scalar;
    this.y /= scalar;
    return this;
  }

  scale(v: Vector2): Vector2 {
    this.x *= v.x;
    this.y *= v.y;
    return this;
  }

  lerp(target: Vector2, t: number): Vector2 {
    const invt = 1 - t;
    this.x = (this.x * invt) + (target.x * t);
    this.y = (this.y * invt) + (target.y * t);
    return this;
  }

  magnitude(): number {
    return Math.sqrt(this.sqrMagnitude());
  }

  sqrMagnitude(): number {
    return (this.x * this.x + this.y * this.y);
  }

  normalize(): Vector2 {
    const length = this.magnitude();
    if (length !== 0) {
      this.x /= length;
      this.y /= length;
    }
    return this;
  }

  limit(limit: number): Vector2 {
    return this.sqrLimit(limit * limit);
  }

  sqrLimit(sqrlimit: number): Vector2 {
    const sqrlen = this.sqrMagnitude();
    return (sqrlen > sqrlimit)
      ? this.mul(Math.sqrt(sqrlimit / sqrlen))
      : this;
  }

  clamp(min: number, max: number): Vector2 {
    const sqrlen = this.sqrMagnitude();
    const sqrmax = max * max;
    const sqrmin = min * min;

    if (sqrlen === 0) return this;
    if (sqrlen > sqrmax) return this.mul(Math.sqrt(sqrmax / sqrlen));
    if (sqrlen < sqrmin) return this.mul(Math.sqrt(sqrmin / sqrlen));
    return this;
  }

  setLength(length: number): Vector2 {
    return this.setSqrLength(length * length);
  }

  setSqrLength(sqrlen: number): Vector2 {
    const currentSqrLen = this.sqrMagnitude();
    return (currentSqrLen === 0 || currentSqrLen === sqrlen)
      ? this
      : this.mul(Math.sqrt(sqrlen / currentSqrLen));
  }

  angleRad(): number {
    return Math.atan2(this.y, this.x);
  }

  angleDeg(): number {
    let angle = Math.atan2(this.y, this.x) * Math.radiansToDegrees;
    if (angle < 0) angle += 360;
    return angle;
  }

  setAngleRad(radians: number): Vector2 {
    this.x = this.magnitude();
    this.y = 0;
    this.rotateRad(radians);
    return this;
  }

  setAngleDeg(degrees: number): Vector2 {
    return this.setAngleRad(degrees * Math.degreesToRadians);
  }

  rotateRad(radians: number): Vector2 {
    const cos = Math.cos(radians);
    const sin = Math.sin(radians);
    this.x = this.x * cos - this.y * sin;
    this.y = this.x * sin + this.y * cos;
    return this;
  }

  rotateDeg(degrees: number): Vector2 {
    return this.rotateRad(degrees * Math.degreesToRadians);
  }

  rotateAroundRad(pivot: Vector2, radians: number): Vector2 {
    return this.sub(pivot).rotateRad(radians).add(pivot);
  }

  rotateAroundDeg(pivot: Vector2, degrees: number): Vector2 {
    return this.sub(pivot).rotateDeg(degrees).add(pivot);
  }

  rotate90(clockwise: boolean): Vector2 {
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

  isUnit(tolerance: number = FLOATING_POINT_TOLERANCE): boolean {
    return Math.abs(this.sqrMagnitude() - 1) < tolerance;
  }

  isZero(tolerance: number = FLOATING_POINT_TOLERANCE): boolean {
    return this.sqrMagnitude() < tolerance;
  }

  equals(other: Vector2, tolerance: number = FLOATING_POINT_TOLERANCE): boolean {
    if (Math.abs(other.x - this.x) > tolerance) return false;
    if (Math.abs(other.y - this.y) > tolerance) return false;
    return true;
  }

  copy(): Vector2 {
    return new Vector2(this.x, this.y);
  }

  static dot(a: Vector2, b: Vector2): number {
    return a.x * b.x + a.y * b.y;
  }

  static cross(a: Vector2, b: Vector2): number {
    return a.x * b.y - a.y * b.x;
  }

  static sqrDistance(a: Vector2, b: Vector2): number {
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    return (dx * dx + dy * dy);
  }

  static distance(a: Vector2, b: Vector2): number {
    return Math.sqrt(Vector2.sqrDistance(a, b));
  }

  static areOnSameLine(a: Vector2, b: Vector2, tolerance: number = FLOATING_POINT_TOLERANCE): boolean {
    return Math.abs(a.x * b.y - a.y * b.x) <= tolerance;
  }

  static areCollinear(a: Vector2, b: Vector2, tolerance: number = FLOATING_POINT_TOLERANCE): boolean {
    return Vector2.areOnSameLine(a, b, tolerance) && Vector2.hasSameDirection(a, b);
  }

  static areCollinearOpposite(a: Vector2, b: Vector2, tolerance: number = FLOATING_POINT_TOLERANCE): boolean {
    return Vector2.areOnSameLine(a, b, tolerance) && Vector2.dot(a, b) < 0;
  }

  static arePerpendicular(a: Vector2, b: Vector2, tolerance: number = FLOATING_POINT_TOLERANCE): boolean {
    return Math.abs(Vector2.dot(a, b)) <= tolerance;
  }

  static angleRad(a: Vector2, b: Vector2): number {
    return Math.atan2(Vector2.cross(b, a), Vector2.dot(b, a));
  }

  static angleDeg(a: Vector2, b: Vector2): number {
    let angle = Math.atan2(Vector2.cross(b, a), Vector2.dot(b, a)) * Math.radiansToDegrees;
    if (angle < 0) angle += 360;
    return angle;
  }

  static hasSameDirection(a: Vector2, b: Vector2): boolean {
    return Vector2.dot(a, b) > 0;
  }

  static hasOppositeDirection(a: Vector2, b: Vector2): boolean {
    return Vector2.dot(a, b) < 0;
  }

  static get right(): Vector2 {
    return new Vector2(1, 0);
  }

  static get left(): Vector2 {
    return new Vector2(-1, 0);
  }

  static get up(): Vector2 {
    return new Vector2(0, -1);
  }

  static get down(): Vector2 {
    return new Vector2(0, 1);
  }

  static get zero(): Vector2 {
    return new Vector2(0, 0);
  }
}
