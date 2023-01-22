import { Vector2 } from 'ponczek/math/vector2';
import { Screen } from 'ponczek/gfx/screen';
import { Rectangle } from 'ponczek/math/rectangle';
import { Pathfinder } from 'ponczek/math/pathfinder';

export abstract class Tilemap<TileT> {
  public width: number;
  public height: number;
  public size: number;
  public pathfinder: Pathfinder;

  private tiles: TileT[];

  constructor(width: number, height: number, size: number) {
    this.width = width;
    this.height = height;
    this.size = size;

    this.tiles = new Array(width * height);
    this.pathfinder = new Pathfinder(width, height);
  }

  public getTileAt(x: number, y: number): (TileT | null) {
    return this.tiles[x + y * this.width] || null;
  }

  public getTileAtWorldPosition(x: number, y: number): (TileT | null) {
    const xx = (x / this.size) | 0;
    const yy = (y / this.size) | 0;
    return this.getTileAt(xx, yy);
  }

  public getTileAtWorldPositionV(v: Vector2): (TileT | null) {
    return this.getTileAtWorldPosition(v.x, v.y);
  }

  public setTileAt(x: number, y: number, tile: TileT, weight: number = 1): void {
    const idx = x + y * this.width;
    if (idx < this.tiles.length) {
      this.tiles[idx] = tile;
      this.pathfinder.setWeight(idx, weight);
    }
  }

  public draw(drawAtX: number, drawAtY: number, scr: Screen, renderingLimits?: Rectangle): void {
    scr.ctx.save();
    scr.ctx.translate(drawAtX, drawAtY);

    const startX = renderingLimits
      ? Math.max((renderingLimits.left / this.size) | 0, 0)
      : 0;

    const startY = renderingLimits
      ? Math.max((renderingLimits.top / this.size) | 0, 0)
      : 0;

    const endX = renderingLimits
      ? Math.min((renderingLimits.right / this.size) + 1 | 0, this.width)
      : this.width;

    const endY = renderingLimits
      ? Math.min((renderingLimits.bottom / this.size) + 1 | 0, this.height)
      : this.height;

    for (let y = startY; y < endY; y += 1) {
      for (let x = startX; x < endX; x += 1) {
        this.drawTile(x, y, this.getTileAt(x, y)!, scr);
      }
    }

    scr.ctx.restore();
  }

  public drawV(v: Vector2, scr: Screen, renderingLimits?: Rectangle): void {
    this.draw(v.x, v.y, scr, renderingLimits);
  }

  protected abstract drawTile(x: number, y: number, tile: TileT, scr: Screen): void;
}
