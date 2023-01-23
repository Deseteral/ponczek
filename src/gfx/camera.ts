/* eslint-disable no-param-reassign */
import { Ponczek } from 'ponczek/ponczek';
import { Rectangle } from 'ponczek/math/rectangle';
import { Vector2 } from 'ponczek/math/vector2';

export class Camera {
  public position: Vector2;

  private viewportHalfWidth: number;
  private viewportHalfHeight: number;

  private viewportRect: Rectangle;

  constructor(position: Vector2 = Vector2.zero) {
    this.position = position;

    this.viewportHalfWidth = Ponczek.screen.width >> 1;
    this.viewportHalfHeight = Ponczek.screen.height >> 1;

    this.viewportRect = new Rectangle(position.x, position.y, Ponczek.screen.width, Ponczek.screen.height);
  }

  public begin(): void {
    Ponczek.screen.ctx.save();
    Ponczek.screen.ctx.translate(-this.left, -this.top);
  }

  public end(): void {
    Ponczek.screen.ctx.restore();
  }

  public lookAt(position: Vector2): void {
    this.position.set(position.x | 0, position.y | 0);
  }

  public translate(translation: Vector2): void {
    this.position.add(translation);
  }

  public screenToWorld(screenPosition: Vector2, out: Vector2): Vector2 {
    out.set(screenPosition.x + this.left, screenPosition.y + this.top);
    return out;
  }

  public worldToScreen(worldPosition: Vector2, out: Vector2): Vector2 {
    out.set(worldPosition.x - this.left, worldPosition.y - this.top);
    return out;
  }

  public get viewport(): Rectangle {
    this.viewportRect.position.set(this.left, this.top);
    return this.viewportRect;
  }

  private get left(): number {
    return (this.position.x - this.viewportHalfWidth);
  }

  private get top(): number {
    return (this.position.y - this.viewportHalfHeight);
  }
}
