import { Engine } from 'marmolada/engine';
import { Font } from 'marmolada/font';
import { drawFrame } from 'marmolada/frame';
import { Input } from 'marmolada/input';
import { Stage } from 'marmolada/stage';
import { GameManager } from 'src/game/game-manager';
import { WorkshopStage } from 'src/game/workshop-stage';

export class DaySummaryStage extends Stage {
  onActivate(): void {
  }

  update(): void {
    if (Input.getKeyDown('a')) {
      Engine.changeStage(new WorkshopStage());
    }
  }

  render(ctx: CanvasRenderingContext2D): void {
    const w = 230;
    const h = 172;
    const x = (Engine.width - w) / 2;
    const y = 10;

    drawFrame(x, y, w, h, ctx, () => {
      Font.draw(`Day ${GameManager.state.day} completed!`, x, y, ctx);

      Font.draw(`You have earned ${GameManager.state.goldLastDay} gold today`, x, y + 40, ctx, true);
      Font.draw(`Total gold: ${GameManager.state.gold}`, x, y + 50 + 15, ctx, true);
      Font.draw(`Total orders handled: ${GameManager.state.completedOrders}`, x, y + 50 + 15 * 2, ctx, true);

      if (GameManager.state.debtPaid) {
        Font.draw("You've paid your debt!", x, y + 50 + 15 * 4, ctx, true);
      } else {
        Font.draw(`You still have to pay ${500 - GameManager.state.gold} gold`, x, y + 50 + 15 * 4, ctx, true);
        Font.draw('to pay off the debt', x, y + 50 + 15 * 5, ctx, true);
      }

      Font.draw('Press Enter to continue', x, y + 50 + 15 * 7, ctx, true);
    });
  }

  onDestroy(): void {
  }
}
