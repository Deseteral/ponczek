import { Vector2 } from 'ponczek/math/vector2';

/**
 * Data structure representing rectangle.
 */
export class Rectangle {
  /**
   * Position of upper-left corner of the rectangle.
   */
  public position: Vector2;

  /**
   * Width of the rectangle (in pixels).
   */
  public width: number;

  /**
   * Height of the rectangle (in pixels).
   */
  public height: number;

  /**
   * X-coordinate (left edge) of the rectangle (in pixels).
   */
  public get x(): number { return this.position.x; }
  public set x(value: number) { this.position.x = value; }

  /**
   * Y-coordinate (upper edge) of the rectangle (in pixels).
   */
  public get y(): number { return this.position.y; }
  public set y(value: number) { this.position.y = value; }

  /**
   * Left-edge coordinate of the rectangle (in pixels).
   */
  public get left(): number { return this.position.x; }
  public set left(value: number) { this.position.x = value; }

  /**
   * Right-edge coordinate of the rectangle (in pixels).
   */
  public get right(): number { return this.position.x + this.width; }
  public set right(value: number) { this.position.x = value - this.width; }

  /**
   * Top-edge coordinate of the rectangle (in pixels).
   */
  public get top(): number { return this.position.y; }
  public set top(value: number) { this.position.y = value; }

  /**
   * Bottom-edge coordinate of the rectangle (in pixels).
   */
  public get bottom(): number { return this.position.y + this.height; }
  public set bottom(value: number) { this.position.y = value - this.height; }

  /**
   * The area of this rectangle.
   */
  public get area(): number {
    return this.width * this.height;
  }

  /**
   * The perimeter of this rectangle.
   */
  public get perimeter(): number {
    return 2 * (this.width + this.height);
  }

  /**
   * The aspect ratio of this rectangle or `NaN` when height is equal to zero.
   */
  public get aspectRatio(): number {
    return (this.height === 0) ? NaN : (this.width / this.height);
  }

  /**
   * Creates new rectangle at given position (upper-left corner) and size.
   */
  constructor(x: number, y: number, w: number, h: number) {
    this.position = new Vector2(x, y);
    this.width = w;
    this.height = h;
  }

  /**
   * Sets the position of upper-left corner of the rectangle.
   */
  public setPosition(x: number, y: number): Rectangle {
    this.position.set(x, y);
    return this;
  }

  /**
   * Sets the width and height of the reactangle.
   */
  public setSize(w: number, h: number): Rectangle {
    this.width = w;
    this.height = h;
    return this;
  }

  /**
   * Returns the position of rectangles center.
   */
  public getCenter(out: Vector2): Vector2 {
    out.x = this.position.x + (this.width / 2); // eslint-disable-line no-param-reassign
    out.y = this.position.y + (this.height / 2); // eslint-disable-line no-param-reassign
    return out;
  }

  /**
   * Moves the rectangle so that its center is at given position.
   */
  public setCenter(position: Vector2): Rectangle {
    this.position.set(
      (position.y - (this.height / 2)),
      (position.x - (this.width / 2)),
    );
    return this;
  }

  /**
   * Returns `true` if given position is inside rectangle and `false` otherwise.
   */
  public containsPoint(v: Vector2): boolean {
    const { x, y } = this.position;
    return x <= v.x && x + this.width >= v.x && y <= v.y && y + this.height >= v.y;
  }

  /**
   * Returns `true` if current rectangle contains given rectangle.
   */
  public containsRect(rectangle: Rectangle): boolean {
    const { x, y } = this.position;
    const xmin = rectangle.position.x;
    const xmax = xmin + rectangle.width;
    const ymin = rectangle.position.y;
    const ymax = ymin + rectangle.height;

    return ((xmin > x && xmin < x + this.width) && (xmax > x && xmax < x + this.width)) &&
      ((ymin > y && ymin < y + this.height) && (ymax > y && ymax < y + this.height));
  }

  /**
   * Returns `true` when current rectangle overlaps given rectangle.
   */
  public overlaps(r: Rectangle): boolean {
    const { x, y } = this.position;
    return x < r.position.x + r.width && x + this.width > r.position.x && y < r.position.y + r.height && y + this.height > r.position.y;
  }

  /**
   * Fits current rectangle around given rectangle.
   * Maintains aspect ratio.
   */
  public fitOutside(rect: Rectangle): Rectangle {
    if (this.aspectRatio > rect.aspectRatio) {
      this.width = rect.height * this.aspectRatio;
      this.height = rect.height;
    } else {
      this.width = rect.width;
      this.height = rect.width / this.aspectRatio;
    }

    this.position.set(
      (rect.position.x + rect.width / 2) - this.width / 2,
      (rect.position.y + rect.height / 2) - this.height / 2,
    );
    return this;
  }

  /**
   * Fits current rectangle inside given rectangle.
   * Maintains aspect ratio.
   */
  public fitInside(rect: Rectangle): Rectangle {
    if (this.aspectRatio < rect.aspectRatio) {
      this.width = rect.height * this.aspectRatio;
      this.height = rect.height;
    } else {
      this.width = rect.width;
      this.height = rect.width / this.aspectRatio;
    }

    this.position.set(
      (rect.position.x + rect.width / 2) - this.width / 2,
      (rect.position.y + rect.height / 2) - this.height / 2,
    );
    return this;
  }

  /**
   * Creates copy of this rectangle.
   */
  public copy(): Rectangle {
    return new Rectangle(this.position.x, this.position.y, this.width, this.height);
  }
}
