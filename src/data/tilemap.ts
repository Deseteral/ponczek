import { Vector2 } from 'ponczek/math/vector2';
import { Screen } from 'ponczek/gfx/screen';

export abstract class Tilemap<TileT> {
  public width: number;
  public height: number;

  private tiles: TileT[];

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;

    this.tiles = new Array(width * height);
  }

  public getTileAt(x: number, y: number): (TileT | null) {
    return this.tiles[x + y * this.width] || null;
  }

  public setTileAt(x: number, y: number, tile: TileT): void {
    const idx = x + y * this.width;
    if (idx < this.tiles.length) {
      this.tiles[idx] = tile;
    }
  }

  public draw(drawAtX: number, drawAtY: number, scr: Screen): void {
    scr.ctx.save();
    scr.ctx.translate(drawAtX, drawAtY);

    for (let y = 0; y < this.height; y += 1) {
      for (let x = 0; x < this.width; x += 1) {
        this.drawTile(x, y, this.getTileAt(x, y)!, scr);
      }
    }

    scr.ctx.restore();
  }

  public drawV(v: Vector2, scr: Screen): void {
    this.draw(v.x, v.y, scr);
  }

  protected abstract drawTile(x: number, y: number, tile: TileT, scr: Screen): void;
}
