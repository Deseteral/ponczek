import { Engine } from 'marmolada/engine';
import { GameState } from 'src/game/game-state';
import { generateRecipes } from 'src/game/recipes';

export abstract class GameManager {
  static readonly primaryColor: string = '#363636';
  static readonly secondaryColor: string = '#ffda9e';

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
