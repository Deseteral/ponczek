import { Color } from 'ponczek/gfx/color';
import { Effect } from 'ponczek/gfx/effect';
import { Ponczek } from 'ponczek/ponczek';
import { Screen } from 'ponczek/gfx/screen';
import { Scene } from 'ponczek/core/scene';
import { SceneManager } from 'ponczek/core/scene-manager';
import { Input } from 'ponczek/core/input';

class TestEffect extends Effect {
  protected fragment(x: number, y: number, color: Color, w: number, h: number): Color {
    if (color.equals(Color.black)) return color;

    const z = (Math.sin(Ponczek.ticks / 30) + 1) / 2;
    return color.setFrom01(x / w, y / h, z);
  }
}

export class EffectsTestScene extends Scene {
  private testEffect = new TestEffect();

  update(): void {
    if (Input.getButtonDown('b')) SceneManager.popScene();
  }

  render(scr: Screen): void {
    scr.clearScreen(Color.black);

    scr.color(Color.green);
    scr.fillRect(5, 10, 200, 150);
    scr.fillRect(140, 100, 120, 120);
    scr.fillRect(10, 180, 50, 50);
    scr.fillCircle(250, 40, 25);

    this.testEffect.apply(scr.ctx.canvas);
  }
}
