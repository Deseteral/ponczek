import { Assets } from 'ponczek/core/assets';
import { Texture } from 'ponczek/gfx/texture';

/**
 * Single, drawable sprite. Part of spritesheet texture.
 */
export class Sprite {
  public readonly _sx: number;
  public readonly _sy: number;
  public readonly _sw: number;
  public readonly _sh: number;

  public readonly _sheet: SpriteSheet;

  private readonly x: number;
  private readonly y: number;
  private readonly widthTiles: number;
  private readonly heightTiles: number;

  /**
   * Creates new sprite from spritesheet's x-column and y-row.
   * One sprite can be made out of multiple tiles as defined by `widthTiles` and `heightTiles`.
   */
  constructor(x: number, y: number, widthTiles: number, heightTiles: number, sheet: SpriteSheet) {
    this.x = x;
    this.y = y;

    this.widthTiles = widthTiles;
    this.heightTiles = heightTiles;

    this._sheet = sheet;

    this._sx = this.x * this._sheet.size;
    this._sy = this.y * this._sheet.size;
    this._sw = this._sheet.size * this.widthTiles;
    this._sh = this._sheet.size * this.heightTiles;
  }
}

/**
 * View into large texture divided into equal, square tiles called sprites.
 */
export class SpriteSheet {
  /**
   * Width and height in pixels of single, square sprite.
   */
  public readonly size: number;

  public readonly _texture: Texture;

  private readonly columnCount: number;
  private readonly rowCount: number;
  private readonly tiles: Sprite[];

  /**
   * Creates new spritesheet for given texture with sprites of a given size (in pixels).
   */
  constructor(textureName: string, size: number) {
    this._texture = Assets.texture(textureName);
    this.size = size;
    this.columnCount = (this._texture.width / size) | 0;
    this.rowCount = (this._texture.height / size) | 0;
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
   * Returns sprite at x-column and y-row from sprite sheet.
   */
  public getSpriteAt(x: number, y: number): Sprite {
    return this.tiles[x + y * this.columnCount];
  }
}
