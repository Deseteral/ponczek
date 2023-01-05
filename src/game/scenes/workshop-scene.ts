import { DaySummaryScene } from 'src/game/scenes/day-summary-scene';
import { Engine } from 'marmolada/engine';
import { Font } from 'src/game/gfx/font';
import { Input } from 'marmolada/core/input';
import { Scene } from 'marmolada/core/scene';
import { dayOverMessage } from 'src/game/messages';
import { drawRecipe, Recipe } from 'src/game/recipes';
import { BrewingTable } from 'src/game/tables/brewing-table';
import { ClientTable } from 'src/game/tables/client-table';
import { IngredientsTable } from 'src/game/tables/ingredients-table';
import { GameManager } from 'src/game/game-manager';
import { GraphicsDevice } from 'marmolada/gfx/graphics-device';
import { Sprites } from 'src/game/gfx/sprites';
import { SoundPlayer } from 'marmolada/sound/sound-player';

export class WorkshopScene extends Scene {
  selectedTable = 0;
  tables = [
    new ClientTable(() => this.nextTable(), () => this.prevTable(), () => this.openBook()),
    new IngredientsTable(() => this.nextTable(), () => this.prevTable(), () => this.openBook()),
    new BrewingTable(() => this.nextTable(), () => this.prevTable(), () => this.openBook()),
  ];

  isInBookView: boolean = false;
  pageNumber = 0;

  ticksUntilDayOver = (1 * 60 * 60); // 1 minute day

  goldAtTheStartOfTheDay = 0;

  onActivate(): void {
    GameManager.saveGame();

    GameManager.state.day += 1;
    this.goldAtTheStartOfTheDay = GameManager.state.gold;
  }

  update(): void {
    if (Engine.shouldCountTicks) this.ticksUntilDayOver -= 1;

    // Book view
    if (this.isInBookView) {
      this.updateBook();
      return;
    }

    // Update tables
    const thisFrameSelectedTable = this.selectedTable;
    this.tables.forEach((table, idx) => {
      table.update(thisFrameSelectedTable === idx, this.ticksUntilDayOver);
    });

    // Put day over message
    if (this.ticksUntilDayOver === 0) {
      GameManager.state.messageBoard.messages.unshift(dayOverMessage());
    }

    // Transition to day summary screen
    if (this.ticksUntilDayOver < 0 && GameManager.state.orders.length === 0) {
      Engine.changeScene(new DaySummaryScene());
    }
  }

  render(g: GraphicsDevice): void {
    g.clearScreen(GameManager.secondaryColor);

    // TODO: Add sliding between tables
    this.tables[this.selectedTable].render(g);

    if (this.isInBookView) {
      this.renderBook(g);
    }

    g.drawRect(0, 0, Engine.width, Engine.height);
  }

  nextTable(): void {
    this.selectedTable += 1;
    this.selectedTable = Math.clamp(this.selectedTable, 0, 2);
    SoundPlayer.playSound('table_move');
  }

  prevTable(): void {
    this.selectedTable -= 1;
    this.selectedTable = Math.clamp(this.selectedTable, 0, 2);
    SoundPlayer.playSound('table_move');
  }

  onDestroy(): void {
    GameManager.state.messageBoard = { messages: [] };
    GameManager.state.orders = [];

    GameManager.state.goldLastDay = GameManager.state.gold - this.goldAtTheStartOfTheDay;

    if (!GameManager.state.debtPaid && GameManager.state.gold >= 500) {
      GameManager.state.gold -= 500;
      GameManager.state.debtPaid = true;
    }
  }

  private updateBook(): void {
    if (Input.getButtonDown('up') || Input.getButtonDown('b')) {
      this.closeBook();
    }
    if (Input.getButtonDown('left')) {
      this.pageNumber -= 1;
      SoundPlayer.playSound('book');
    }
    if (Input.getButtonDown('right')) {
      this.pageNumber += 1;
      SoundPlayer.playSound('book');
    }

    this.pageNumber = Math.clamp(this.pageNumber, 0, Math.ceil(GameManager.state.recipes.length / 2) - 1);
  }

  private renderBook(g: GraphicsDevice): void {
    g.drawTexture(Sprites.sprite('book').normal, 0, 0);

    const r1: Recipe = GameManager.state.recipes[this.pageNumber * 2];
    const r2: Recipe = GameManager.state.recipes[this.pageNumber * 2 + 1];

    if (r1) {
      drawRecipe(r1, 60, 20, g);
      Font.draw(`${this.pageNumber * 2 + 1}`, 50, 200, g);
    }

    if (r2) {
      drawRecipe(r2, 225, 20, g);
      Font.draw(`${(this.pageNumber * 2 + 2).toString().padStart(2, ' ')}`, 340, 200, g);
    }

    // TODO: Add animation for changing pages
  }

  private openBook(): void {
    Engine.shouldCountTicks = false;
    this.isInBookView = true;
    SoundPlayer.playSound('table_move');
  }

  private closeBook(): void {
    Engine.shouldCountTicks = true;
    this.isInBookView = false;
    SoundPlayer.playSound('table_move');
  }
}
