import { Engine } from 'ponczek/engine';
import { Font } from 'src/game/gfx/font';
import { GraphicsDevice } from 'ponczek/gfx/graphics-device';
import { Input } from 'ponczek/core/input';
import { Scene } from 'ponczek/core/scene';
import { GameManager } from 'src/game/game-manager';
import { Sprites } from 'src/game/gfx/sprites';
import { WorkshopScene } from 'src/game/scenes/workshop-scene';
import { SoundPlayer } from 'ponczek/sound/sound-player';

export class StoryScene extends Scene {
  pageNumber = 0;

  pages: (string[])[] = [
    [
      "You've just graduated",
      'from The Magic School.',
      '',
      'Congratulations!',
    ],
    [
      'After 10 long years',
      "of studying. You're",
      'finally free!',
    ],
    [
      "At the School you've",
      'learned everything',
      'about magic.',
    ],
    [
      'You studied spell cas-',
      '-ting, history, making',
      'potions, physics and',
      'engineering.',
    ],
    [
      'When you were study-',
      '-ing late at the',
      "school library, you've",
      'often dreamed about',
      'seeing the world...',
    ],
    [
      '...and living in',
      'Oakville.',
    ],
    [
      'Now finally free from',
      'the burden of school',
      "life, you've decided",
      'to fulfill your dream.',
    ],
    [
      'Running away from',
      'the school gate with',
      'just one small bag',
      'of your personal',
      'belongings you head',
      'to the Royal port.',
    ],
    [
      "You've barely managed",
      'to catch the sky ship',
      'to Oakville, and after',
      'a couple of days of',
      'traveling you arrive',
      'at your destination.',
    ],
    [
      'There you take a loan',
      'for 500 gold and open',
      'your own potion store.',
    ],
    [
      "You're living the",
      'dream. Good luck and',
      'have fun!',
    ],
    [
      '',
      '',
      '',
      '',
      'Press Enter to begin',
    ],
  ];

  onActivate(): void {
  }

  update(): void {
    if (Input.getButtonDown('left')) {
      this.pageNumber -= 1;
      SoundPlayer.playSound('book');
    }
    if (Input.getButtonDown('right')) {
      this.pageNumber += 1;
      SoundPlayer.playSound('book');
    }
    this.pageNumber = Math.clamp(this.pageNumber, 0, Math.ceil(this.pages.length / 2) - 1);

    if (this.pageNumber === 5 && Input.getButtonDown('a')) {
      Engine.changeScene(new WorkshopScene());
      SoundPlayer.playSound('menu_confirm');
    }
  }

  render(g: GraphicsDevice): void {
    g.clearScreen(GameManager.secondaryColor);
    g.drawTexture(Sprites.sprite('book').normal, 0, 0);

    const t1: string[] = this.pages[this.pageNumber * 2];
    const t2: string[] = this.pages[this.pageNumber * 2 + 1];

    if (t1) {
      t1.forEach((line, idx) => {
        Font.draw(line, 47, 24 + idx * (Font.charHeightSmall + 2), g, true);
      });

      Font.draw(`${this.pageNumber * 2 + 1}`, 50, 200, g);
    }

    if (t2) {
      t2.forEach((line, idx) => {
        Font.draw(line, 212, 24 + idx * (Font.charHeightSmall + 2), g, true);
      });

      Font.draw(`${(this.pageNumber * 2 + 2).toString().padStart(2, ' ')}`, 340, 200, g);
    }
  }

  onDestroy(): void {
  }
}
