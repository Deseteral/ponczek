import { Engine } from 'marmolada/engine';
import { Font } from 'src/game/gfx/font';
import { drawFrame } from 'src/game/gfx/frame';
import { GraphicsDevice } from 'marmolada/gfx/graphics-device';
import { Input } from 'marmolada/core/input';
import { Scene } from 'marmolada/core/scene';
import { GameManager } from 'src/game/game-manager';
import { Sprites } from 'src/game/gfx/sprites';
import { WorkshopScene } from 'src/game/scenes/workshop-scene';
import { HowToPlayScene } from 'src/game/scenes/how-to-play-scene';
import { StoryScene } from 'src/game/scenes/story-scene';
import { SoundPlayer } from 'marmolada/sound/sound-player';

export class MainMenuScene extends Scene {
  cursor = 0;
  hasSaveData = GameManager.hasSavedGame();

  onActivate(): void {
  }

  update(): void {
    if (Input.getButtonDown('up')) {
      this.cursor -= 1;
      SoundPlayer.playSound('menu_pick');
    }
    if (Input.getButtonDown('down')) {
      this.cursor += 1;
      SoundPlayer.playSound('menu_pick');
    }

    this.cursor = Math.clamp(this.cursor, 0, this.hasSaveData ? 2 : 1);

    if (Input.getButtonDown('a')) {
      if (this.cursor === 0) {
        GameManager.newGame();
        Engine.changeScene(new StoryScene());
      } else if (this.hasSaveData && this.cursor === 1) {
        GameManager.loadGame();
        Engine.changeScene(new WorkshopScene());
      } else if ((this.hasSaveData && this.cursor === 2) || (!this.hasSaveData && this.cursor === 1)) {
        Engine.changeScene(new HowToPlayScene());
      }

      SoundPlayer.playSound('menu_confirm');
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
