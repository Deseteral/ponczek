import { Color } from 'marmolada/gfx/color';
import { FragmentEffect } from 'marmolada/gfx/effect';
import { Engine } from 'marmolada/engine';
import { GraphicsDevice } from 'marmolada/gfx/graphics-device';
import { Scene } from 'marmolada/core/scene';

class TestEffect extends FragmentEffect {
  fragment(x: number, y: number, color: Color, w: number, h: number): Color {
    if (color.equals(Color.black)) return color;

    const z = (Math.sin(Engine.ticks / 30) + 1) / 2;
    return Color.from01(x / w, y / h, z);
  }
}

export class EffectsTestScene extends Scene {
  private testEffect = new TestEffect();

  onActivate(): void { }

  update(): void { }

  render(g: GraphicsDevice): void {
    g.clearScreen(Color.black);

    g.color(Color.green);
    g.fillRect(5, 10, 300, 200);

    this.testEffect.apply(g.ctx.canvas, g.ctx.canvas);
  }

  onDestroy(): void { }
}
