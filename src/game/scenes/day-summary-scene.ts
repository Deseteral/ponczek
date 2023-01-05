import { Engine } from 'ponczek/engine';
import { Font } from 'src/game/gfx/font';
import { drawFrame } from 'src/game/gfx/frame';
import { GraphicsDevice } from 'ponczek/gfx/graphics-device';
import { Input } from 'ponczek/core/input';
import { Scene } from 'ponczek/core/scene';
import { GameManager } from 'src/game/game-manager';
import { WorkshopScene } from 'src/game/scenes/workshop-scene';

export class DaySummaryScene extends Scene {
  onActivate(): void {
  }

  update(): void {
    if (Input.getButtonDown('a')) {
      Engine.changeScene(new WorkshopScene());
    }
  }

  render(g: GraphicsDevice): void {
    g.clearScreen(GameManager.secondaryColor);

    const w = 230;
    const h = 172;
    const x = (Engine.width - w) / 2;
    const y = 10;

    drawFrame(x, y, w, h, g, () => {
      Font.draw(`Day ${GameManager.state.day} completed!`, x, y, g);

      Font.draw(`You have earned ${GameManager.state.goldLastDay} gold today`, x, y + 40, g, true);
      Font.draw(`Total gold: ${GameManager.state.gold}`, x, y + 50 + 15, g, true);
      Font.draw(`Total orders handled: ${GameManager.state.completedOrders}`, x, y + 50 + 15 * 2, g, true);

      if (GameManager.state.debtPaid) {
        Font.draw("You've paid your debt!", x, y + 50 + 15 * 4, g, true);
      } else {
        Font.draw(`You still have to pay ${500 - GameManager.state.gold} gold`, x, y + 50 + 15 * 4, g, true);
        Font.draw('to pay off the debt', x, y + 50 + 15 * 5, g, true);
      }

      Font.draw('Press Enter to continue', x, y + 50 + 15 * 7, g, true);
    });
  }

  onDestroy(): void {
  }
}
