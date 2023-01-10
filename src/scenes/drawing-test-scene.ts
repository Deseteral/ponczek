import { Engine } from 'ponczek/engine';
import { FLIP_H, FLIP_V, Screen } from 'ponczek/gfx/screen';
import { Scene } from 'ponczek/core/scene';
import { Input } from 'ponczek/core/input';
import { SceneManager } from 'ponczek/core/scene-manager';
import { ENDESGA16PaletteIdx } from 'ponczek/palettes/endesga16-palette';
import { Rectangle } from 'ponczek/math/rectangle';
import { Color } from 'ponczek/gfx/color';
import { Texture } from 'ponczek/gfx/texture';
import { Assets } from 'ponczek/core/assets';

export class DrawingTestScene extends Scene {
  private rect = new Rectangle(15, 40, 100, 80);
  private sprite: Texture;

  constructor() {
    super();
    this.sprite = Assets.texture('ponczek_sprite');
  }

  update(): void {
    this.rect.width = (150 + (Math.sin(Engine.ticks / 60) * 100)) | 0;

    if (Input.getButtonDown('b')) SceneManager.popScene();
  }

  render(g: Screen): void {
    g.clearScreen(ENDESGA16PaletteIdx[15]);

    {
      g.drawText('Rectangle', 0, 1, Color.white);

      for (let idx = 0; idx < 11; idx += 1) {
        g.color(ENDESGA16PaletteIdx[idx]);

        const n = idx + 8;
        const x = ((n * (n + 1)) / 2) - 34;
        g.fillRect(x, 10, idx + 1, idx + 1);
        g.drawRect(x, 25, idx + 1, idx + 1);
      }
    }

    {
      g.drawText('Line', 0, 40, Color.white);

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

    {
      g.drawText('Circle', 0, 80, Color.white);

      for (let r = 1; r < 11; r += 1) {
        g.color(ENDESGA16PaletteIdx[r]);

        g.fillCircle((r * 20) - 10, 100, r);
        g.drawCircle((r * 20) - 10, 115, 10 - r);
      }
    }

    {
      g.drawText('Sprite', 0, 130, Color.white);
      const size = this.sprite.width;
      const halfSize = size >> 1;
      const baseY = 138;

      g.drawTexture(this.sprite, 1, baseY);
      g.drawTexture(this.sprite, ((size + 1) * 1), baseY, size, size, FLIP_H);
      g.drawTexture(this.sprite, ((size + 1) * 2), baseY, size, size, FLIP_V);
      g.drawTexture(this.sprite, ((size + 1) * 3), baseY, size, size, (FLIP_H | FLIP_V));

      g.drawTexturePart(this.sprite, 0, 0, halfSize, halfSize, ((size + 1) * 4), baseY + halfSize, halfSize, halfSize);
      g.drawTexturePart(this.sprite, 0, halfSize, halfSize, halfSize, ((size + 1) * 4) + halfSize, baseY, halfSize, halfSize, FLIP_V);
    }
  }
}
