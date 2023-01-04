import { Engine } from 'marmolada/engine';
import { GraphicsDevice } from 'marmolada/graphics-device';
import { Vector2 } from 'marmolada/math/vector2';
import { Stage } from 'marmolada/stage';

export class FontRenderingTestStage extends Stage {
  constructor() {
    super();
    Engine.graphicsDevice.font(Engine.defaultFont);
  }

  onActivate(): void { }

  update(): void { }

  render(g: GraphicsDevice): void {
    g.clearScreen('white');
    g.drawText(`Current tick ${Engine.ticks}!`, new Vector2(10, 10));
  }

  onDestroy(): void { }
}
