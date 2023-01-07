import { Color } from 'ponczek/gfx/color';
import { Engine } from 'ponczek/engine';
import { GraphicsDevice } from 'ponczek/gfx/graphics-device';
import { Vector2 } from 'ponczek/math/vector2';
import { Scene } from 'ponczek/core/scene';
import { XNAPalette } from 'ponczek/palettes/xna-palette';
import { Input } from 'ponczek/core/input';
import { SceneManager } from 'ponczek/core/scene-manager';

export class FontRenderingTestScene extends Scene {
  constructor() {
    super();
    Engine.graphicsDevice.font(Engine.defaultFont);
    Engine.defaultFont.generateColorVariant(Color.red);
  }

  onActivate(): void { }

  update(): void {
    if (Input.getButtonDown('b')) SceneManager.popScene();
  }

  render(g: GraphicsDevice): void {
    g.clearScreen(XNAPalette.cornflowerBlue);
    g.drawText(`Current tick ${Engine.ticks}!`, new Vector2(10, 10), Color.black);
    g.drawText('This text should be in red', new Vector2(10, 20), Color.red);
  }

  onDestroy(): void { }
}
