import { Camera } from 'ponczek/gfx/camera';
import { Color } from 'ponczek/gfx/color';
import { Screen } from 'ponczek/gfx/screen';
import { Input } from 'ponczek/core/input';
import { Vector2 } from 'ponczek/math/vector2';
import { Scene } from 'ponczek/core/scene';
import { SceneManager } from 'ponczek/core/scene-manager';
import { Rectangle } from 'ponczek/math/rectangle';
import { ENDESGA16PaletteIdx } from 'ponczek/palettes/endesga16-palette';
import { withTransition } from 'examples/utils/with-transition';

export class CameraTestScene extends Scene {
  private camera: Camera;
  private playerPosition: Vector2;
  private rect: Rectangle;

  private _pointerInWorld: Vector2 = Vector2.zero;
  private _rectInScreen: Vector2 = Vector2.zero;

  constructor() {
    super();
    this.camera = new Camera();
    this.playerPosition = new Vector2();
    this.rect = new Rectangle(-10, 20, 100, 200);
  }

  update(): void {
    let dx = 0;
    let dy = 0;
    const speed = 2.1;

    if (Input.getButton('left')) dx -= 1;
    if (Input.getButton('right')) dx += 1;
    if (Input.getButton('up')) dy -= 1;
    if (Input.getButton('down')) dy += 1;

    this.playerPosition.x += (dx * speed);
    this.playerPosition.y += (dy * speed);

    this.camera.lookAt(this.playerPosition);

    this.camera.screenToWorld(Input.pointer, this._pointerInWorld);
    this.camera.worldToScreen(this.rect.position, this._rectInScreen);

    if (Input.getButtonDown('b')) withTransition(() => SceneManager.popScene());
  }

  render(scr: Screen): void {
    scr.clearScreen(ENDESGA16PaletteIdx[2]);

    this.camera.begin();

    scr.color(ENDESGA16PaletteIdx[9]);
    scr.fillRectR(this.rect);

    scr.color(ENDESGA16PaletteIdx[6]);
    scr.fillRect(this.playerPosition.x, this.playerPosition.y, 20, 20);

    this.camera.end();

    scr.drawText(`Pointer position: ${Input.pointer}`, 0, 0, Color.white);
    scr.drawText(`Pointer in world position: ${this._pointerInWorld}`, 0, 8, Color.white);
    scr.drawText(`Rectangle in screen position: ${this._rectInScreen}`, 0, 16, Color.white);
  }
}
