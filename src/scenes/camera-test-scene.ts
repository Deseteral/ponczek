import { Camera } from 'ponczek/gfx/camera';
import { Color } from 'ponczek/gfx/color';
import { GraphicsDevice } from 'ponczek/gfx/graphics-device';
import { Input } from 'ponczek/core/input';
import { Vector2 } from 'ponczek/math/vector2';
import { Scene } from 'ponczek/core/scene';
import { XNAPalette } from 'ponczek/palettes/xna-palette';

export class CameraTestScene extends Scene {
  camera: Camera;
  playerPosition: Vector2;
  redRectPosition: Vector2;

  constructor() {
    super();
    this.camera = new Camera();
    this.playerPosition = new Vector2();
    this.redRectPosition = new Vector2(-10, 20);
  }

  onActivate(): void {
  }

  update(): void {
    let dx = 0;
    let dy = 0;
    const speed = 2;

    if (Input.getKey('a')) dx -= 1;
    if (Input.getKey('d')) dx += 1;
    if (Input.getKey('w')) dy -= 1;
    if (Input.getKey('s')) dy += 1;

    this.playerPosition.x += (dx * speed);
    this.playerPosition.y += (dy * speed);

    this.camera.lookAt(this.playerPosition);

    console.table({
      'Pointer position': Input.pointer,
      'Pointer in world position': this.camera.screenToWorld(Input.pointer, new Vector2()),
      'Red rectangle screen space position': this.camera.worldToScreen(this.redRectPosition, new Vector2()),
    });
  }

  render(g: GraphicsDevice): void {
    g.clearScreen(XNAPalette.cornflowerBlue);

    this.camera.begin();

    g.color(Color.red);
    g.fillRect(this.redRectPosition.x, this.redRectPosition.y, 100, 200);

    g.color(Color.green);
    g.fillRect(this.playerPosition.x, this.playerPosition.y, 20, 20);

    this.camera.end();
  }

  onDestroy(): void {
  }
}