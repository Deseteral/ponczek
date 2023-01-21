import { Screen } from 'ponczek/gfx/screen';
import { Scene } from 'ponczek/core/scene';
import { Input } from 'ponczek/core/input';
import { SceneManager } from 'ponczek/core/scene-manager';
import { ENDESGA16PaletteIdx } from 'ponczek/palettes/endesga16-palette';
import { Tilemap } from 'ponczek/data/tilemap';
import { SpriteSheet } from 'ponczek/gfx/spritesheet';
import { Random } from 'ponczek/math/random';
import { Camera } from 'ponczek/gfx/camera';
import { Engine } from 'ponczek/engine';
import { Color } from 'ponczek/gfx/color';
import { Vector2 } from 'ponczek/math/vector2';

const random = Random.default;

interface TestTile {
  x: number,
  y: number,
  type: 'grass' | 'wall',
  variant: number,
  flip: number,
}

class TestTilemap extends Tilemap<TestTile> {
  private tileset: SpriteSheet;

  constructor(width: number, height: number, tileset: SpriteSheet) {
    super(width, height, tileset.size);
    this.tileset = tileset;
  }

  protected drawTile(x: number, y: number, tile: TestTile, scr: Screen): void {
    scr.color(ENDESGA16PaletteIdx[2]);
    const sprite = tile.type === 'grass'
      ? this.tileset.getSprite(tile.variant)
      : this.tileset.getSpriteAt(0, 1);
    scr.drawSprite(sprite, x * this.size, y * this.size, tile.flip);
  }
}

export class TilemapTestScene extends Scene {
  private map: TestTilemap;
  private tileset: SpriteSheet;
  private camera: Camera;
  private pointerInWorld: Vector2;
  private startingTile: (TestTile | null);
  private targetTile: (TestTile | null);

  constructor() {
    super();

    this.tileset = new SpriteSheet('tiles', 16);

    const size = 128;
    this.map = new TestTilemap(128, 128, this.tileset);
    for (let y = 0; y < size; y += 1) {
      for (let x = 0; x < size; x += 1) {
        const tile: TestTile = ((x === 4 && (y < 3 || y > 5)) || (x === 12 && (y < 12 || y > 13)))
          ? { x, y, type: 'wall', variant: 0, flip: 0 }
          : { x, y, type: 'grass', variant: random.nextInt(0, 4), flip: random.nextInt(0, 2) };

        this.map.setTileAt(x, y, tile);
      }
    }

    this.camera = new Camera();
    this.camera.position.set(Engine.screen.width >> 1, Engine.screen.height >> 1);

    this.pointerInWorld = Vector2.zero;
    this.startingTile = null;
    this.targetTile = null;
  }

  update(): void {
    let dx = 0;
    let dy = 0;
    const cameraSpeed = 2;

    if (Input.getButton('left')) dx -= 1;
    if (Input.getButton('right')) dx += 1;
    if (Input.getButton('up')) dy -= 1;
    if (Input.getButton('down')) dy += 1;

    this.camera.position.x += (dx * cameraSpeed);
    this.camera.position.y += (dy * cameraSpeed);

    this.camera.screenToWorld(Input.pointer, this.pointerInWorld);
    this.targetTile = this.map.getTileAtWorldPositionV(this.pointerInWorld);

    if (Input.getKeyDown('KeyF')) {
      this.startingTile = this.targetTile;
    }

    if (Input.getButtonDown('b')) SceneManager.popScene();
  }

  render(scr: Screen): void {
    scr.clearScreen();

    this.camera.begin();
    {
      this.map.draw(0, 0, scr, this.camera.viewport);

      if (this.startingTile) {
        scr.drawSprite(this.tileset.getSpriteAt(0, 2), this.startingTile.x * this.map.size, this.startingTile.y * this.map.size);
      }
    }
    this.camera.end();

    if (this.targetTile) {
      scr.drawText(`Target tile: <${this.targetTile.x}, ${this.targetTile.y}>`, 0, 0, Color.white);
    }
  }
}
