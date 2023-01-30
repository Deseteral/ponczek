/* eslint-disable no-param-reassign */
import { Ponczek } from 'ponczek/ponczek';
import { Rectangle } from 'ponczek/math/rectangle';
import { Vector2 } from 'ponczek/math/vector2';

/**
 * 2D orthographic camera.
 */
export class Camera {
  /**
   * Position of the center of camera lens in world coordinates.
   */
  public position: Vector2;

  private viewportHalfWidth: number;
  private viewportHalfHeight: number;

  private viewportRect: Rectangle;

  /**
   * Creates new camera with initial position (defaults to <0, 0>).
   */
  constructor(position: Vector2 = Vector2.zero()) {
    this.position = position;

    this.viewportHalfWidth = Ponczek.screen.width >> 1;
    this.viewportHalfHeight = Ponczek.screen.height >> 1;

    this.viewportRect = new Rectangle(position.x, position.y, Ponczek.screen.width, Ponczek.screen.height);
  }

  /**
   * Rectangle representing viewport limits in world-space.
   */
  public get viewport(): Rectangle {
    this.viewportRect.position.set(this.left, this.top);
    return this.viewportRect;
  }

  /**
   * Sets up camera for drawing. Call this before any draw calls that need to be translated.
   */
  public begin(): void {
    Ponczek.screen._ctx.save();
    Ponczek.screen._ctx.translate(-this.left, -this.top);
  }

  /**
   * Completes camera work after drawing. Call this method after all draw calls have been made.
   */
  public end(): void {
    Ponczek.screen._ctx.restore();
  }

  /**
   * Sets the camera position.
   */
  public lookAt(position: Vector2): void {
    this.position.set(position.x | 0, position.y | 0);
  }

  /**
   * Moves camera position by given vector.
   */
  public translate(translation: Vector2): void {
    this.position.add(translation);
  }

  /**
   * Takes a position in screen-space, converts it to world-space and writes it to provided `out` vector.
   */
  public screenToWorld(screenPosition: Vector2, out: Vector2): void {
    out.set(screenPosition.x + this.left, screenPosition.y + this.top);
  }

  /**
   * Takes a position in world-space, converts it to screen-space and writes it to provided `out` vector.
   */
  public worldToScreen(worldPosition: Vector2, out: Vector2): void {
    out.set(worldPosition.x - this.left, worldPosition.y - this.top);
  }

  private get left(): number {
    return (this.position.x - this.viewportHalfWidth);
  }

  private get top(): number {
    return (this.position.y - this.viewportHalfHeight);
  }
}
