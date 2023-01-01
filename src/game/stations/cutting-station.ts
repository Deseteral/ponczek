import { Engine } from 'marmolada/engine';
import { Font } from 'src/game/gfx/font';
import { drawFrame } from 'src/game/gfx/frame';
import { GraphicsDevice } from 'marmolada/graphics-device';
import { Input } from 'marmolada/input';
import { IngredientAction } from 'src/game/ingredients';
import { Sprites } from 'src/game/gfx/sprites';
import { Station } from 'src/game/stations/station';
import { SoundPlayer } from 'marmolada/sound-player';

export class CuttingStation extends Station {
  progress: number = 0;
  left: boolean = true;

  update(): void {
    if (Input.getButtonDown('left') && this.left) {
      this.left = false;
      this.progress += 0.01;
      SoundPlayer.playSound('knife');
    }

    if (Input.getButtonDown('right') && !this.left) {
      this.left = true;
      this.progress += 0.05;
      SoundPlayer.playSound('knife');
    }

    this.progress -= 0.002;
    this.progress = Math.clamp(this.progress, 0, 1);

    if (this.progress >= 1) this.onStationCompleteCallback(true, IngredientAction.CUTTING);
    if (Input.getButtonDown('b')) this.onStationCompleteCallback(false, IngredientAction.CUTTING);
  }

  render(g: GraphicsDevice): void {
    const xx = 100;
    const yy = 15;

    drawFrame(xx, yy, 100, 55, g, () => {
      // Progress bar
      g.drawRect(xx, yy, 100, 5);
      g.fillRect(xx, yy, (100 * this.progress) | 0, 5);

      // Keys
      const kxx = xx + 17;
      if (this.left) {
        g.drawTexture(Sprites.sprite('enchanting_keyleft').normal, kxx, 30);
        g.drawTexture(Sprites.sprite('enchanting_keyright').inverted, kxx + 35, 30);
      } else {
        g.drawTexture(Sprites.sprite('enchanting_keyleft').inverted, kxx, 30);
        g.drawTexture(Sprites.sprite('enchanting_keyright').normal, kxx + 35, 30);
      }
    });

    const helpWidth = 170;
    const helpX = Engine.width - helpWidth - 9 - 2;
    drawFrame(helpX, yy, helpWidth, 26, g, () => {
      Font.draw('Press left and right key', helpX, yy, g, true);
      Font.draw('alternately to cut', helpX, yy + 12, g, true);
    });
  }
}
