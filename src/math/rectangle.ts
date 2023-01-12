import { Vector2 } from 'ponczek/math/vector2';

export class Rectangle {
  public position: Vector2;
  public width: number;
  public height: number;

  public get x(): number { return this.position.x; }
  public set x(value: number) { this.position.x = value; }
  public get y(): number { return this.position.y; }
  public set y(value: number) { this.position.y = value; }

  constructor(x: number, y: number, w: number, h: number) {
    this.position = new Vector2(x, y);
    this.width = w;
    this.height = h;
  }

  public setPosition(x: number, y: number): Rectangle {
    this.position.set(x, y);
    return this;
  }

  public setSize(w: number, h: number): Rectangle {
    this.width = w;
    this.height = h;
    return this;
  }

  public getCenter(out: Vector2): Vector2 {
    out.x = this.position.x + (this.width / 2); // eslint-disable-line no-param-reassign
    out.y = this.position.y + (this.height / 2); // eslint-disable-line no-param-reassign
    return out;
  }

  public setCenter(position: Vector2): Rectangle {
    this.position.set(
      (position.y - (this.height / 2)),
      (position.x - (this.width / 2)),
    );
    return this;
  }

  public containsPoint(v: Vector2): boolean {
    const { x, y } = this.position;
    return x <= v.x && x + this.width >= v.x && y <= v.y && y + this.height >= v.y;
  }

  public containsRect(rectangle: Rectangle): boolean {
    const { x, y } = this.position;
    const xmin = rectangle.position.x;
    const xmax = xmin + rectangle.width;
    const ymin = rectangle.position.y;
    const ymax = ymin + rectangle.height;

    return ((xmin > x && xmin < x + this.width) && (xmax > x && xmax < x + this.width)) &&
      ((ymin > y && ymin < y + this.height) && (ymax > y && ymax < y + this.height));
  }

  public getArea(): number {
    return this.width * this.height;
  }

  public getPerimeter(): number {
    return 2 * (this.width + this.height);
  }

  public getAspectRatio(): number {
    return (this.height === 0) ? NaN : (this.width / this.height);
  }

  public overlaps(r: Rectangle): boolean {
    const { x, y } = this.position;
    return x < r.position.x + r.width && x + this.width > r.position.x && y < r.position.y + r.height && y + this.height > r.position.y;
  }

  public fitOutside(rect: Rectangle): Rectangle {
    const ratio = this.getAspectRatio();

    if (ratio > rect.getAspectRatio()) {
      this.width = rect.height * ratio;
      this.height = rect.height;
    } else {
      this.width = rect.width;
      this.height = rect.width / ratio;
    }

    this.position.set(
      (rect.position.x + rect.width / 2) - this.width / 2,
      (rect.position.y + rect.height / 2) - this.height / 2,
    );
    return this;
  }

  public fitInside(rect: Rectangle): Rectangle {
    const ratio = this.getAspectRatio();

    if (ratio < rect.getAspectRatio()) {
      this.width = rect.height * ratio;
      this.height = rect.height;
    } else {
      this.width = rect.width;
      this.height = rect.width / ratio;
    }

    this.position.set(
      (rect.position.x + rect.width / 2) - this.width / 2,
      (rect.position.y + rect.height / 2) - this.height / 2,
    );
    return this;
  }

  public copy(): Rectangle {
    return new Rectangle(this.position.x, this.position.y, this.width, this.height);
  }
}
