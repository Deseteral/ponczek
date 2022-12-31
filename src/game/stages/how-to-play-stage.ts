import { Engine } from 'marmolada/engine';
import { Font } from 'src/game/gfx/font';
import { GraphicsDevice } from 'marmolada/graphics-device';
import { Input } from 'marmolada/input';
import { Stage } from 'marmolada/stage';
import { GameManager } from 'src/game/game-manager';
import { MainMenuStage } from 'src/game/stages/main-menu-stage';
import { SoundPlayer } from 'marmolada/sound-player';

export class HowToPlayStage extends Stage {
  lines = [
    'Use WASD or arrow keys to move',
    'Esc to go back, Enter to confirm/activate',
    '',
    'Every 10 seconds new customer comes in',
    'Press down to pull the recipe book and search for',
    'the recipe for potion that they want',
    '',
    'Use the tools on the middle table to prepare ingredients',
    'Then put those in the cauldron on the right most table',
    '',
    '',
    '',
    'Created in 48 hours for Ludum Dare 51',
    '',
    'Press escape to go back',
  ];

  onActivate(): void {
  }

  update(): void {
    if (Input.getButtonDown('b')) {
      Engine.changeStage(new MainMenuStage());
      SoundPlayer.playSound('menu_confirm');
    }
  }

  render(g: GraphicsDevice): void {
    g.clearScreen(GameManager.secondaryColor);

    g.drawRect(0, 0, Engine.width, Engine.height);

    this.lines.forEach((line, idx) => {
      Font.draw(line, 3, idx * 15, g, true);
    });
  }

  onDestroy(): void {
  }
}
