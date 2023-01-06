import { Scene } from 'ponczek/core/scene';
import { Engine } from 'ponczek/engine';
import { Color } from 'ponczek/gfx/color';
import { GraphicsDevice } from 'ponczek/gfx/graphics-device';
import { Vector2 } from 'ponczek/math/vector2';
import { XNAPalette } from 'ponczek/palettes/xna-palette';

export class MainMenuScene extends Scene {
  onActivate(): void {
    Engine.graphicsDevice.font(Engine.defaultFont);
  }

  update(): void { }

  render(g: GraphicsDevice): void {
    g.clearScreen(XNAPalette.cornflowerBlue);
    g.drawText('Ponczek', new Vector2(10, 10), Color.black);
  }

  onDestroy(): void { }
}
