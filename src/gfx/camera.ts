/* eslint-disable no-param-reassign */
import { Engine } from 'ponczek/engine';
import { Vector2 } from 'ponczek/math/vector2';

export class Camera {
  public position: Vector2;

  private viewportHalfWidth: number;
  private viewportHalfHeight: number;

  constructor(position: Vector2 = Vector2.zero) {
    this.position = position;

    this.viewportHalfWidth = Engine.screen.width >> 1;
    this.viewportHalfHeight = Engine.screen.height >> 1;
  }

  public begin(): void {
    Engine.screen.ctx.save();
    Engine.screen.ctx.translate(-this.left, -this.top);
  }

  public end(): void {
    Engine.screen.ctx.restore();
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

  private get left(): number {
    return (this.position.x - this.viewportHalfWidth);
  }

  private get top(): number {
    return (this.position.y - this.viewportHalfHeight);
  }
}
