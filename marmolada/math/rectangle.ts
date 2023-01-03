/* eslint-disable no-param-reassign */
import { Vector2 } from 'marmolada/math/vector2';

export class Rectangle {
  x: number;
  y: number;
  width: number;
  height: number;

  constructor(x: number, y: number, w: number, h: number) {
    this.x = x;
    this.y = y;
    this.width = w;
    this.height = h;
  }

  get area(): number {
    return this.width * this.height;
  }

  get perimeter(): number {
    return 2 * (this.width + this.height);
  }

  get aspectRatio(): number {
    return (this.height === 0) ? NaN : (this.width / this.height);
  }

  getPosition(out: Vector2): Vector2 {
    out.x = this.x;
    out.y = this.y;
    return out;
  }

  setPosition(position: Vector2): Rectangle {
    this.x = position.x;
    this.y = position.y;
    return this;
  }

  setSize(w: number, h: number): Rectangle {
    this.width = w;
    this.height = h;
    return this;
  }

  getCenter(out: Vector2): Vector2 {
    out.x = this.x + this.width / 2;
    out.y = this.y + this.height / 2;
    return out;
  }

  setCenter(position: Vector2): Rectangle {
    this.x = (position.x - this.width / 2);
    this.y = (position.y - this.height / 2);
    return this;
  }

  containsPoint(v: Vector2): boolean {
    return this.x <= v.x && this.x + this.width >= v.x && this.y <= v.y && this.y + this.height >= v.y;
  }

  containsRect(rectangle: Rectangle): boolean {
    const xmin = rectangle.x;
    const xmax = xmin + rectangle.width;
    const ymin = rectangle.y;
    const ymax = ymin + rectangle.height;

    return ((xmin > this.x && xmin < this.x + this.width) && (xmax > this.x && xmax < this.x + this.width)) &&
      ((ymin > this.y && ymin < this.y + this.height) && (ymax > this.y && ymax < this.y + this.height));
  }

  overlaps(r: Rectangle): boolean {
    return this.x < r.x + r.width && this.x + this.width > r.x && this.y < r.y + r.height && this.y + this.height > r.y;
  }

  fitOutside(rect: Rectangle): Rectangle {
    const ratio = this.aspectRatio;

    if (ratio > rect.aspectRatio) {
      this.width = rect.height * ratio;
      this.height = rect.height;
    } else {
      this.width = rect.width;
      this.height = rect.width / ratio;
    }

    this.x = (rect.x + rect.width / 2) - this.width / 2;
    this.y = (rect.y + rect.height / 2) - this.height / 2;
    return this;
  }

  fitInside(rect: Rectangle): Rectangle {
    const ratio = this.aspectRatio;

    if (ratio < rect.aspectRatio) {
      this.width = rect.height * ratio;
      this.height = rect.height;
    } else {
      this.width = rect.width;
      this.height = rect.width / ratio;
    }

    this.x = (rect.x + rect.width / 2) - this.width / 2;
    this.y = (rect.y + rect.height / 2) - this.height / 2;
    return this;
  }

  copy(): Rectangle {
    return new Rectangle(this.x, this.y, this.width, this.height);
  }
}
