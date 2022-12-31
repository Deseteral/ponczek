import { Engine } from 'marmolada/engine';
import { Font } from 'marmolada/font';
import { drawFrame } from 'marmolada/frame';
import { GraphicsDevice } from 'marmolada/graphics-device';
import { Input } from 'marmolada/input';
import { playSound, Sound } from 'marmolada/sounds';
import { Stage } from 'marmolada/stage';
import { GameManager } from 'src/game/game-manager';
import { Sprites } from 'src/game/sprites';
import { WorkshopStage } from 'src/game/stages/workshop-stage';
import { HowToPlayStage } from 'src/game/stages/how-to-play-stage';
import { StoryStage } from 'src/game/stages/story-stage';

export class MainMenuStage extends Stage {
  cursor = 0;
  hasSaveData = GameManager.hasSavedGame();

  onActivate(): void {
  }

  update(): void {
    if (Input.getKeyDown('up')) {
      this.cursor -= 1;
      playSound(Sound.MENU_PICK);
    }
    if (Input.getKeyDown('down')) {
      this.cursor += 1;
      playSound(Sound.MENU_PICK);
    }

    this.cursor = Math.clamp(this.cursor, 0, this.hasSaveData ? 2 : 1);

    if (Input.getKeyDown('a')) {
      if (this.cursor === 0) {
        GameManager.newGame();
        Engine.changeStage(new StoryStage());
      } else if (this.hasSaveData && this.cursor === 1) {
        GameManager.loadGame();
        Engine.changeStage(new WorkshopStage());
      } else if ((this.hasSaveData && this.cursor === 2) || (!this.hasSaveData && this.cursor === 1)) {
        Engine.changeStage(new HowToPlayStage());
      }

      playSound(Sound.MENU_CONFIRM);
    }
  }

  render(g: GraphicsDevice): void {
    g.clearScreen(GameManager.secondaryColor);

    g.color(GameManager.primaryColor);
    g.drawRect(0, 0, Engine.width, Engine.height);

    g.drawTexture(Sprites.sprite('menu_logo').normal, 0, 0);

    const w = 132;
    const h = 82;
    const x = (Engine.width - w) / 2;
    const y = 90;

    drawFrame(x, y, w, h, g, () => {
      const mx = x + 16 + 2;

      g.drawTexture(Sprites.sprite('list_pointer_right').normal, x, y + 2 + (30 * this.cursor));

      Font.draw('New game', mx, y, g);

      if (this.hasSaveData) {
        Font.draw('Continue', mx, y + 30, g);
        Font.draw('How to play', mx, y + 30 * 2, g);
      } else {
        Font.draw('How to play', mx, y + 30, g);
      }
    });
  }

  onDestroy(): void {
  }
}
