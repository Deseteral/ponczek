import { Assets } from 'ponczek/core/assets';
import { Texture } from 'ponczek/gfx/texture';

export class Sprite {
  public readonly x: number;
  public readonly y: number;

  public readonly widthTiles: number;
  public readonly heightTiles: number;

  public readonly sx: number;
  public readonly sy: number;
  public readonly sw: number;
  public readonly sh: number;

  public readonly sheet: SpriteSheet;

  constructor(x: number, y: number, widthTiles: number, heightTiles: number, sheet: SpriteSheet) {
    this.x = x;
    this.y = y;

    this.widthTiles = widthTiles;
    this.heightTiles = heightTiles;

    this.sheet = sheet;

    this.sx = this.x * this.sheet.size;
    this.sy = this.y * this.sheet.size;
    this.sw = this.sheet.size * this.widthTiles;
    this.sh = this.sheet.size * this.heightTiles;
  }
}

export class SpriteSheet {
  public readonly texture: Texture;
  public readonly size: number;

  private readonly columnCount: number;
  private readonly rowCount: number;
  private readonly tiles: Sprite[];

  constructor(textureName: string, size: number) {
    this.texture = Assets.texture(textureName);
    this.size = size;
    this.columnCount = (this.texture.width / size) | 0;
    this.rowCount = (this.texture.height / size) | 0;
    this.tiles = new Array(this.columnCount * this.rowCount);

    for (let y = 0; y < this.rowCount; y += 1) {
      for (let x = 0; x < this.columnCount; x += 1) {
        this.tiles[x + y * this.columnCount] = new Sprite(x, y, 1, 1, this);
      }
    }
  }

  /**
   * Returns n-th sprite in sprite sheet.
   */
  public getSprite(idx: number): Sprite {
    return this.tiles[idx];
  }

  /**
   * Returns sprite x column and y row from sprite sheet.
   */
  public getSpriteAt(x: number, y: number): Sprite {
    return this.tiles[x + y * this.columnCount];
  }
}
