import { Color } from 'marmolada/color';
import { Engine } from 'marmolada/engine';
import { GraphicsDevice } from 'marmolada/graphics-device';
import { Vector2 } from 'marmolada/math/vector2';
import { Stage } from 'marmolada/stage';

export class FontRenderingTestStage extends Stage {
  constructor() {
    super();
    Engine.graphicsDevice.font(Engine.defaultFont);
    Engine.defaultFont.generateColorVariant(Color.red);
  }

  onActivate(): void { }

  update(): void { }

  render(g: GraphicsDevice): void {
    g.clearScreen(Color.cornflowerBlue);
    g.drawText(`Current tick ${Engine.ticks}!`, new Vector2(10, 10), Color.black);
    g.drawText('This text should be in red', new Vector2(10, 20), Color.red);
  }

  onDestroy(): void { }
}
