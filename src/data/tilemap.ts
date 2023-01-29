import { Vector2 } from 'ponczek/math/vector2';
import { Screen } from 'ponczek/gfx/screen';
import { Rectangle } from 'ponczek/math/rectangle';
import { Pathfinder } from 'ponczek/math/pathfinder';

/**
 * Data structure representing 2D grid based tile map.
 */
export abstract class Tilemap<TileT> {
  /**
   * Amount of tiles in X axis.
   */
  public readonly width: number;

  /**
   * Amount of tiles in Y axis.
   */
  public readonly height: number;

  /**
   * Size of single square tile in pixels.
   */
  public readonly sizePx: number;

  /**
   * Object that will find path between two points in this tilemap.
   */
  public readonly pathfinder: Pathfinder;

  private tiles: TileT[];

  /**
   * Creates new tilemap of given width and height, with square tiles of provided size.
   */
  constructor(width: number, height: number, sizePx: number) {
    this.width = width;
    this.height = height;
    this.sizePx = sizePx;

    this.tiles = new Array(width * height);
    this.pathfinder = new Pathfinder(width, height);
  }

  /**
   * Returns a tile at X column and Y row, or `null` is such tile does not exist.
   */
  public getTileAt(x: number, y: number): (TileT | null) {
    return this.tiles[x + y * this.width] || null;
  }

  /**
   * Returns a tile at given world position, or `null` is such tile does not exist.
   */
  public getTileAtWorldPosition(x: number, y: number): (TileT | null) {
    const xx = (x / this.sizePx) | 0;
    const yy = (y / this.sizePx) | 0;
    return this.getTileAt(xx, yy);
  }

  /**
   * Returns a tile at given world position, or `null` is such tile does not exist.
   */
  public getTileAtWorldPositionV(v: Vector2): (TileT | null) {
    return this.getTileAtWorldPosition(v.x, v.y);
  }

  /**
   * Sets tile at X column and Y row.
   *
   * `cost` is a cost of moving to that tile. This value is used during pathfinding.
   * `cost` equal to `0` implies a tile that cannot be moved into. Defaults to `1`.
   */
  public setTileAt(x: number, y: number, tile: TileT, cost: number = 1): void {
    const idx = x + y * this.width;
    if (idx < this.tiles.length) {
      this.tiles[idx] = tile;
      this.pathfinder.setCost(idx, cost);
    }
  }

  /**
   * Draws this tilemap at specified screen position.
   * When given (optional) `renderingLimits` rectangle (with world-space coordinates) it will perform culling when drawing tiles.
   */
  public draw(drawAtX: number, drawAtY: number, scr: Screen, renderingLimits?: Rectangle): void {
    scr._ctx.save();
    scr._ctx.translate(drawAtX, drawAtY);

    const startX = renderingLimits
      ? Math.max((renderingLimits.left / this.sizePx) | 0, 0)
      : 0;

    const startY = renderingLimits
      ? Math.max((renderingLimits.top / this.sizePx) | 0, 0)
      : 0;

    const endX = renderingLimits
      ? Math.min((renderingLimits.right / this.sizePx) + 1 | 0, this.width)
      : this.width;

    const endY = renderingLimits
      ? Math.min((renderingLimits.bottom / this.sizePx) + 1 | 0, this.height)
      : this.height;

    for (let y = startY; y < endY; y += 1) {
      for (let x = startX; x < endX; x += 1) {
        this.drawTile(x, y, this.getTileAt(x, y)!, scr);
      }
    }

    scr._ctx.restore();
  }

  /**
   * Draws this tilemap at specified screen position.
   * When given (optional) `renderingLimits` rectangle (with world-space coordinates) it will perform culling when drawing tiles.
   */
  public drawV(v: Vector2, scr: Screen, renderingLimits?: Rectangle): void {
    this.draw(v.x, v.y, scr, renderingLimits);
  }

  /**
   * Draws single tile from X column and Y row.
   */
  protected abstract drawTile(x: number, y: number, tile: TileT, scr: Screen): void;
}
