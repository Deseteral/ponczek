import { Ponczek } from 'ponczek/ponczek';
import { Screen } from 'ponczek/gfx/screen';
import { Scene } from 'ponczek/core/scene';
import { Input } from 'ponczek/core/input';
import { SceneManager } from 'ponczek/core/scene-manager';
import { ENDESGA16PaletteIdx } from 'ponczek/palettes/endesga16-palette';
import { Rectangle } from 'ponczek/math/rectangle';
import { withTransition } from 'examples/utils/with-transition';

export class FontRenderingTestScene extends Scene {
  private rect = new Rectangle(15, 40, 100, 80);

  update(): void {
    this.rect.width = (150 + (Math.sin(Ponczek.ticks / 60) * 100)) | 0;

    if (Input.getButtonDown('b')) withTransition(() => SceneManager.popScene());
  }

  render(scr: Screen): void {
    scr.clearScreen(ENDESGA16PaletteIdx[10]);
    scr.drawText(`Current tick ${Ponczek.ticks}!`, 10, 10, ENDESGA16PaletteIdx[13]);
    scr.drawText('This text should be in red', 10, 20, ENDESGA16PaletteIdx[5]);

    scr.color(ENDESGA16PaletteIdx[11]);
    scr.drawRectR(this.rect);

    scr.drawTextInRectR('Glib jocks quiz nymph to vex dwarf.\n\nSphinx of black quartz, judge my vow.', this.rect, ENDESGA16PaletteIdx[8]);

    scr.drawText('This is one line.\nThis is next line.\nHello :)', 10, 130, ENDESGA16PaletteIdx[8]);
  }
}
