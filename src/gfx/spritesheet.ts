import { Assets } from 'ponczek/core/assets';
import { Texture } from 'ponczek/gfx/texture';

// TODO: Make this immutable
export class Sprite {
  public x: number;
  public y: number;
  public widthTiles: number;
  public heightTiles: number;
  public sheet: SpriteSheet;

  constructor(x: number, y: number, widthTiles: number, heightTiles: number, sheet: SpriteSheet) {
    this.x = x;
    this.y = y;
    this.widthTiles = widthTiles;
    this.heightTiles = heightTiles;
    this.sheet = sheet;
  }

  public get sx(): number { return this.x * this.sheet.size; }
  public get sy(): number { return this.y * this.sheet.size; }
  public get sw(): number { return this.sheet.size * this.widthTiles; }
  public get sh(): number { return this.sheet.size * this.heightTiles; }
}

export class SpriteSheet {
  public texture: Texture;
  public size: number;

  private tiles: Map<string, Sprite>;

  constructor(textureName: string, size: number) {
    this.texture = Assets.texture(textureName);
    this.size = size;
    this.tiles = new Map();
  }

  public getTile(name: string): Sprite {
    const t = this.tiles.get(name);
    if (!t) {
      throw new Error(`No such tile "${name}"`);
    }
    return t;
  }

  public addTile(name: string, x: number, y: number, widthTiles: number = 1, heightTiles: number = 1): void {
    this.tiles.set(name, new Sprite(x, y, widthTiles, heightTiles, this));
  }

  public addTiles(tiles: ({ [name: string]: { x: number, y: number, widthTiles?: number, heightTiles?: number } })): void {
    Object.entries(tiles).forEach(([name, { x, y, widthTiles, heightTiles }]) => {
      this.addTile(name, x, y, widthTiles, heightTiles);
    });
  }
}
