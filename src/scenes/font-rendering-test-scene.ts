import { Engine } from 'ponczek/engine';
import { Screen } from 'ponczek/gfx/screen';
import { Scene } from 'ponczek/core/scene';
import { Input } from 'ponczek/core/input';
import { SceneManager } from 'ponczek/core/scene-manager';
import { ENDESGA16PaletteIdx } from 'ponczek/palettes/endesga16-palette';
import { Rectangle } from 'ponczek/math/rectangle';

export class FontRenderingTestScene extends Scene {
  private rect = new Rectangle(15, 40, 100, 80);

  update(): void {
    this.rect.width = (150 + (Math.sin(Engine.ticks / 60) * 100)) | 0;

    if (Input.getButtonDown('b')) SceneManager.popScene();
  }

  render(scr: Screen): void {
    scr.clearScreen(ENDESGA16PaletteIdx[10]);
    scr.drawText(`Current tick ${Engine.ticks}!`, 10, 10, ENDESGA16PaletteIdx[13]);
    scr.drawText('This text should be in red', 10, 20, ENDESGA16PaletteIdx[5]);

    scr.color(ENDESGA16PaletteIdx[11]);
    scr.fillRectR(this.rect);

    scr.drawTextInRect('Glib jocks quiz nymph to vex dwarf.', this.rect, ENDESGA16PaletteIdx[8]);
  }
}
