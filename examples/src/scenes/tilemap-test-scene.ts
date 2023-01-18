import { Screen } from 'ponczek/gfx/screen';
import { Scene } from 'ponczek/core/scene';
import { Input } from 'ponczek/core/input';
import { SceneManager } from 'ponczek/core/scene-manager';
import { ENDESGA16PaletteIdx } from 'ponczek/palettes/endesga16-palette';
import { Tilemap } from 'ponczek/data/tilemap';
import { Sprite, SpriteSheet } from 'ponczek/gfx/spritesheet';
import { Random } from 'ponczek/math/random';

const random = Random.default;

interface TestTile {
  sprite: Sprite,
  flip: number,
}

class TestTilemap extends Tilemap<TestTile> {
  private tileset: SpriteSheet;

  constructor(width: number, height: number, tileset: SpriteSheet) {
    super(width, height);
    this.tileset = tileset;
  }

  protected drawTile(x: number, y: number, tile: TestTile, scr: Screen): void {
    scr.color(ENDESGA16PaletteIdx[2]);
    scr.drawSprite(tile.sprite, x * this.tileset.size, y * this.tileset.size, tile.flip);
  }
}

export class TilemapTestScene extends Scene {
  private map: TestTilemap;
  private tileset: SpriteSheet;

  constructor() {
    super();

    this.tileset = new SpriteSheet('tiles', 16);
    this.tileset.addTiles({
      'grass-0': { x: 0, y: 0 },
      'grass-1': { x: 1, y: 0 },
      'grass-2': { x: 2, y: 0 },
      'grass-3': { x: 3, y: 0 },
      'grass-4': { x: 4, y: 0 },
      wall: { x: 0, y: 1 },
    });

    const size = 128;
    this.map = new TestTilemap(128, 128, this.tileset);
    for (let y = 0; y < size; y += 1) {
      for (let x = 0; x < size; x += 1) {
        const sprite = this.tileset.getTile(`grass-${random.nextInt(0, 4)}`);
        this.map.setTileAt(x, y, { sprite, flip: random.nextInt(0, 2) });
      }
    }
  }

  update(): void {
    if (Input.getButtonDown('b')) SceneManager.popScene();
  }

  render(scr: Screen): void {
    scr.clearScreen();
    this.map.draw(0, 0, scr);
  }
}
