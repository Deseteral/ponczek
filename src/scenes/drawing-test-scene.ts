import { Engine } from 'ponczek/engine';
import { GraphicsDevice } from 'ponczek/gfx/graphics-device';
import { Scene } from 'ponczek/core/scene';
import { Input } from 'ponczek/core/input';
import { SceneManager } from 'ponczek/core/scene-manager';
import { ENDESGA16PaletteIdx } from 'ponczek/palettes/endesga16-palette';
import { Rectangle } from 'ponczek/math/rectangle';
import { Vector2 } from 'ponczek/math/vector2';
import { Color } from 'ponczek/gfx/color';

export class DrawingTestScene extends Scene {
  private rect = new Rectangle(15, 40, 100, 80);

  update(): void {
    this.rect.width = (150 + (Math.sin(Engine.ticks / 60) * 100)) | 0;

    if (Input.getButtonDown('b')) SceneManager.popScene();
  }

  render(g: GraphicsDevice): void {
    g.clearScreen(ENDESGA16PaletteIdx[15]);

    {
      g.drawText('Rectangle', new Vector2(0, 1), Color.white);

      for (let idx = 0; idx < 11; idx += 1) {
        g.color(ENDESGA16PaletteIdx[idx]);

        const n = idx + 8;
        const x = ((n * (n + 1)) / 2) - 34;
        g.fillRect(x, 10, idx + 1, idx + 1);
        g.drawRect(x, 25, idx + 1, idx + 1);
      }
    }

    {
      g.drawText('Lines', new Vector2(0, 40), Color.white);

      const size = 20;
      const baseX = 2;
      const baseY = 49;

      [
        [baseX, baseY, baseX + (size * 3), baseY],
        [baseX, baseY, baseX, (baseY + size)],
        [(baseX + size), baseY, (baseX + size), (baseY + size)],
        [(baseX + (size * 2)), baseY, (baseX + (size * 2)), (baseY + size)],
        [(baseX + (size * 3)), baseY, (baseX + (size * 3)), (baseY + size)],
        [baseX, (baseY + size), (baseX + (size * 3)), baseY],
        [(baseX + size), (baseY + size), (baseX + (size * 2)), baseY],
        [baseX, baseY, (baseX + (size * 3)), (baseY + size)],
        [(baseX + size), baseY, (baseX + (size * 2)), (baseY + size)],
      ].forEach(([x1, y1, x2, y2], idx) => {
        g.color(ENDESGA16PaletteIdx[idx]);
        g.drawLine(x1, y1, x2, y2);
      });
    }
  }
}
