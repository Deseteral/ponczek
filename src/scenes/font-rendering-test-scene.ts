import { Engine } from 'ponczek/engine';
import { GraphicsDevice } from 'ponczek/gfx/graphics-device';
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

  render(g: GraphicsDevice): void {
    g.clearScreen(ENDESGA16PaletteIdx[10]);
    g.drawText(`Current tick ${Engine.ticks}!`, 10, 10, ENDESGA16PaletteIdx[13]);
    g.drawText('This text should be in red', 10, 20, ENDESGA16PaletteIdx[5]);

    g.color(ENDESGA16PaletteIdx[11]);
    g.fillRectR(this.rect);

    g.drawTextInRect('Glib jocks quiz nymph to vex dwarf.', this.rect, ENDESGA16PaletteIdx[8]);
  }
}
