import { Color } from 'marmolada/gfx/color';
import { Engine } from 'marmolada/engine';
import { GameState } from 'src/game/game-state';
import { generateRecipes } from 'src/game/recipes';

export abstract class GameManager {
  static readonly primaryColor: Color = Color.fromRGBA(0x363636);
  static readonly secondaryColor: Color = Color.fromRGBA(0xffda9e);

  static state: GameState;

  static newGame(): void {
    this.state = {
      preparedIngredients: [],
      recipes: generateRecipes(),
      orders: [],
      gold: 0,
      completedOrders: 0,
      messageBoard: { messages: [] },
      day: 0,
      goldLastDay: 0,
      debtPaid: false,
    };
  }

  static loadGame(): void {
    this.state = Engine.loadData();
  }

  static saveGame(): void {
    Engine.saveData(this.state);
  }

  static hasSavedGame(): boolean {
    return Engine.hasSavedData();
  }
}
