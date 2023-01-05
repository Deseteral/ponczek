/* eslint-disable no-param-reassign */
import { Engine } from 'marmolada/engine';
import { Vector2 } from 'marmolada/math/vector2';

export class Camera {
  position: Vector2;

  private ctx: CanvasRenderingContext2D;
  private viewportHalfWidth: number;
  private viewportHalfHeight: number;

  constructor(position: Vector2 = Vector2.zero) {
    this.position = position;

    this.ctx = Engine.graphicsDevice.ctx;
    this.viewportHalfWidth = this.ctx.canvas.width >> 1;
    this.viewportHalfHeight = this.ctx.canvas.height >> 1;
  }

  begin(): void {
    this.ctx.save();
    this.ctx.translate(-this.left, -this.top);
  }

  end(): void {
    this.ctx.restore();
  }

  lookAt(position: Vector2): void {
    this.position.x = position.x;
    this.position.y = position.y;
  }

  translate(translation: Vector2): void {
    this.position.add(translation);
  }

  screenToWorld(screenPosition: Vector2, out: Vector2): Vector2 {
    out.x = screenPosition.x + this.left;
    out.y = screenPosition.y + this.top;
    return out;
  }

  worldToScreen(worldPosition: Vector2, out: Vector2): Vector2 {
    out.x = (worldPosition.x - this.left);
    out.y = (worldPosition.y - this.top);
    return out;
  }

  private get left(): number {
    return (this.position.x - this.viewportHalfWidth);
  }

  private get top(): number {
    return (this.position.y - this.viewportHalfHeight);
  }
}
