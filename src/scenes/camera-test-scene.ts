import { Camera } from 'ponczek/gfx/camera';
import { Color } from 'ponczek/gfx/color';
import { GraphicsDevice } from 'ponczek/gfx/graphics-device';
import { Input } from 'ponczek/core/input';
import { Vector2 } from 'ponczek/math/vector2';
import { Scene } from 'ponczek/core/scene';
import { XNAPalette } from 'ponczek/palettes/xna-palette';
import { SceneManager } from 'ponczek/core/scene-manager';
import { Rectangle } from 'ponczek/math/rectangle';

export class CameraTestScene extends Scene {
  camera: Camera;
  playerPosition: Vector2;
  redRectangle: Rectangle;

  constructor() {
    super();
    this.camera = new Camera();
    this.playerPosition = new Vector2();
    this.redRectangle = new Rectangle(-10, 20, 100, 200);
  }

  update(): void {
    let dx = 0;
    let dy = 0;
    const speed = 2.1;

    if (Input.getKey('a')) dx -= 1;
    if (Input.getKey('d')) dx += 1;
    if (Input.getKey('w')) dy -= 1;
    if (Input.getKey('s')) dy += 1;

    this.playerPosition.x += (dx * speed);
    this.playerPosition.y += (dy * speed);

    this.camera.lookAt(this.playerPosition);

    if (Input.getButtonDown('b')) SceneManager.popScene();
  }

  render(g: GraphicsDevice): void {
    g.clearScreen(XNAPalette.cornflowerBlue);

    this.camera.begin();

    g.color(Color.red);
    g.fillRectR(this.redRectangle);

    g.color(Color.green);
    g.fillRect(this.playerPosition.x, this.playerPosition.y, 20, 20);

    this.camera.end();

    g.drawText(`Pointer position: ${Input.pointer}`, 0, 0, Color.white);
    g.drawText(`Pointer in world position: ${this.camera.screenToWorld(Input.pointer, new Vector2())}`, 0, 8, Color.white);
    g.drawText(`Pointer position: ${Input.pointer}`, 0, 16, Color.white); // TODO: This should be rect in screen position
  }
}
