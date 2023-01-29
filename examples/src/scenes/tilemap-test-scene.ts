import { Screen } from 'ponczek/gfx/screen';
import { Scene } from 'ponczek/core/scene';
import { Input } from 'ponczek/core/input';
import { SceneManager } from 'ponczek/core/scene-manager';
import { ENDESGA16PaletteIdx } from 'ponczek/palettes/endesga16-palette';
import { Tilemap } from 'ponczek/data/tilemap';
import { SpriteSheet } from 'ponczek/gfx/spritesheet';
import { Random } from 'ponczek/math/random';
import { Camera } from 'ponczek/gfx/camera';
import { Ponczek } from 'ponczek/ponczek';
import { Color } from 'ponczek/gfx/color';
import { Vector2 } from 'ponczek/math/vector2';
import { withTransition } from 'examples/utils/with-transition';

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
    scr.drawSprite(sprite, x * this.sizePx, y * this.sizePx, tile.flip);
  }
}

export class TilemapTestScene extends Scene {
  private map: TestTilemap;
  private tileset: SpriteSheet;
  private camera: Camera;
  private pointerInWorld: Vector2;
  private startingTile: TestTile;
  private targetTile: TestTile;
  private path: Vector2[];
  private withDiagonals: boolean = false;

  constructor() {
    super();

    this.tileset = new SpriteSheet('tiles', 16);

    const size = 128;
    this.map = new TestTilemap(128, 128, this.tileset);
    for (let y = 0; y < size; y += 1) {
      for (let x = 0; x < size; x += 1) {
        const isWall = ((x === 4 && (y < 3 || y > 5)) || (x === 12 && (y < 12 || y > 13)));
        const tile: TestTile = isWall
          ? { x, y, type: 'wall', variant: 0, flip: 0 }
          : { x, y, type: 'grass', variant: random.nextInt(0, 4), flip: random.nextInt(0, 2) };

        this.map.setTileAt(x, y, tile, isWall ? 0 : 1);
      }
    }

    this.camera = new Camera();
    this.camera.position.set(Ponczek.screen.width >> 1, Ponczek.screen.height >> 1);

    this.pointerInWorld = Vector2.zero;
    this.startingTile = this.map.getTileAt(0, 0)!;
    this.targetTile = this.map.getTileAt(0, 0)!;

    this.path = [];
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

    const pointerTile = this.map.getTileAtWorldPositionV(this.pointerInWorld);
    if (pointerTile) {
      this.targetTile = pointerTile;
    }

    if (Input.getKeyDown('KeyF')) {
      this.startingTile = this.targetTile;
    }

    if (Input.getKeyDown('KeyE')) {
      this.withDiagonals = !this.withDiagonals;
    }

    this.path = this.map.pathfinder.search(this.startingTile.x, this.startingTile.y, this.targetTile.x, this.targetTile.y, this.withDiagonals);

    if (Input.getButtonDown('b')) withTransition(() => SceneManager.popScene());
  }

  render(scr: Screen): void {
    scr.clearScreen();

    this.camera.begin();
    {
      this.map.draw(0, 0, scr, this.camera.viewport);

      scr.drawSprite(this.tileset.getSpriteAt(0, 2), this.startingTile.x * this.map.sizePx, this.startingTile.y * this.map.sizePx);
      scr.drawSprite(this.tileset.getSpriteAt(0, 2), this.targetTile.x * this.map.sizePx, this.targetTile.y * this.map.sizePx);

      for (let idx = 0; idx < this.path.length; idx += 1) {
        const pathNode = this.path[idx];
        scr.drawSprite(this.tileset.getSpriteAt(1, 2), pathNode.x * this.map.sizePx, pathNode.y * this.map.sizePx);
      }
    }
    this.camera.end();

    scr.drawText('Press F to set new starting tile', 0, scr.height - 16, Color.white);
    scr.drawText('Press E to toggle diagonal flag', 0, scr.height - 8, Color.white);
  }
}
