import { Ponczek } from 'ponczek/ponczek';
import { FLIP_H, FLIP_V, Screen } from 'ponczek/gfx/screen';
import { Scene } from 'ponczek/core/scene';
import { Input } from 'ponczek/core/input';
import { SceneManager } from 'ponczek/core/scene-manager';
import { ENDESGA16PaletteIdx } from 'ponczek/palettes/endesga16-palette';
import { Rectangle } from 'ponczek/math/rectangle';
import { Color } from 'ponczek/gfx/color';
import { Texture } from 'ponczek/gfx/texture';
import { Assets } from 'ponczek/core/assets';
import { SpriteSheet } from 'ponczek/gfx/spritesheet';
import { withTransition } from 'examples/utils/with-transition';

export class DrawingTestScene extends Scene {
  private rect = new Rectangle(15, 40, 100, 80);
  private ponczek: Texture;
  private ponczekSpriteSheet: SpriteSheet;

  constructor() {
    super();
    this.ponczek = Assets.texture('ponczek_sprite');
    this.ponczekSpriteSheet = new SpriteSheet('ponczek_sprite', 16);
  }

  update(): void {
    this.rect.width = (150 + (Math.sin(Ponczek.ticks / 60) * 100)) | 0;

    if (Input.getButtonDown('b')) withTransition(() => SceneManager.popScene());
  }

  render(scr: Screen): void {
    scr.clearScreen(ENDESGA16PaletteIdx[15]);

    {
      scr.drawText('Rectangle', 0, 1, Color.white);

      for (let idx = 0; idx < 11; idx += 1) {
        scr.color(ENDESGA16PaletteIdx[idx]);

        const n = idx + 8;
        const x = ((n * (n + 1)) / 2) - 34;
        scr.fillRect(x, 10, idx + 1, idx + 1);
        scr.drawRect(x, 25, idx + 1, idx + 1);
      }
    }

    {
      scr.drawText('Line', 0, 40, Color.white);

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
        scr.color(ENDESGA16PaletteIdx[idx]);
        scr.drawLine(x1, y1, x2, y2);
      });
    }

    {
      scr.drawText('Circle', 0, 80, Color.white);

      for (let r = 1; r < 11; r += 1) {
        scr.color(ENDESGA16PaletteIdx[r]);

        scr.fillCircle((r * 20) - 10, 100, r);
        scr.drawCircle((r * 20) - 10, 115, 10 - r);
      }
    }

    {
      scr.drawText('Sprite', 0, 130, Color.white);
      const size = this.ponczek.width;
      const halfSize = size >> 1;
      const baseY = 138;

      scr.drawTexture(this.ponczek, 1, baseY);
      scr.drawTexture(this.ponczek, ((size + 1) * 1), baseY, size, size, FLIP_H);
      scr.drawTexture(this.ponczek, ((size + 1) * 2), baseY, size, size, FLIP_V);
      scr.drawTexture(this.ponczek, ((size + 1) * 3), baseY, size, size, (FLIP_H | FLIP_V));

      scr.drawSprite(this.ponczekSpriteSheet.getSpriteAt(0, 0), ((size + 1) * 4), baseY + halfSize);
      scr.drawSprite(this.ponczekSpriteSheet.getSpriteAt(1, 1), ((size + 1) * 4) + halfSize, baseY);
    }
  }
}
