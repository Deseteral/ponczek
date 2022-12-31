import { Engine } from 'marmolada/engine';
import { Font } from 'src/game/gfx/font';
import { drawFrame } from 'marmolada/frame';
import { GraphicsDevice } from 'marmolada/graphics-device';
import { Input } from 'marmolada/input';
import { GameManager } from 'src/game/game-manager';
import { PreparedIngredient } from 'src/game/ingredients';
import { clientGoodbyeMessasge, orderCompleteMessage, recipeDoesNotExistMessage, recipeWithoutOrderMessage } from 'src/game/messages';
import { findMatchingRecipe } from 'src/game/recipe-logic';
import { drawPreparedIngredientRow, Recipe } from 'src/game/recipes';
import { Sprites } from 'src/game/gfx/sprites';
import { Table } from 'src/game/tables/table';
import { SoundPlayer } from 'marmolada/sound-player';

export class BrewingTable extends Table {
  showList = false;

  ingredientCursor = 0;
  selectedIngredientCursor = 0;
  selectedIngredients: PreparedIngredient[] = [];
  leftColumn = true;

  ticksUntilBrewingDone = 0;
  makingRecipe: (Recipe | null) = null;

  bubbleParticles: ({ x: number, y: number, velocity: number, isSmall: boolean, offset: number })[] = [];
  stopBubbleSoundCallback: ((() => void) | null) = null;

  update(isSelected: boolean): void {
    this.ticksUntilBrewingDone -= 1;

    if (this.showList && isSelected) {
      if (Input.getKeyDown('up')) {
        if (this.leftColumn) {
          this.ingredientCursor -= 1;
        } else {
          this.selectedIngredientCursor -= 1;
        }
        SoundPlayer.playSound('menu_pick');
      } else if (Input.getKeyDown('down')) {
        if (this.leftColumn) {
          this.ingredientCursor += 1;
        } else {
          this.selectedIngredientCursor += 1;
        }
        SoundPlayer.playSound('menu_pick');
      }

      if (Input.getKeyDown('left') && GameManager.state.preparedIngredients.length > 0) {
        this.leftColumn = true;
        SoundPlayer.playSound('menu_pick');
      } else if (Input.getKeyDown('right') && this.selectedIngredients.length > 0) {
        this.selectedIngredientCursor = this.selectedIngredients.length;
        this.leftColumn = false;
        SoundPlayer.playSound('menu_pick');
      }

      if (Input.getKeyDown('b')) {
        GameManager.state.preparedIngredients.push(...this.selectedIngredients);
        this.resetListState();
        this.showList = false;
      }

      if (Input.getKeyDown('a')) {
        if (this.leftColumn) {
          if (GameManager.state.preparedIngredients.length > 0) {
            const [ing] = GameManager.state.preparedIngredients.splice(this.ingredientCursor, 1);
            this.selectedIngredients.push(ing);
            this.ingredientCursor -= 1;

            if (GameManager.state.preparedIngredients.length === 0) {
              this.selectedIngredientCursor = this.selectedIngredients.length;
              this.leftColumn = false;
            }
          }
        } else {
          if (this.selectedIngredientCursor === this.selectedIngredients.length) {
            const recipe: (Recipe | null) = findMatchingRecipe(this.selectedIngredients, GameManager.state.recipes);

            this.makingRecipe = recipe;
            this.ticksUntilBrewingDone = Math.randomRange(3 * 60, 7 * 60);

            // TODO: Add looping sounds
            // if (!this.stopBubbleSoundCallback) {
            //   this.stopBubbleSoundCallback = playSound(Sound.BUBBLES, true);
            // }

            if (recipe) {
              console.log('making recipe', recipe);
            } else {
              console.log('recipe does not exist');
            }

            this.resetListState();
            this.showList = false;
          } else {
            const [ing] = this.selectedIngredients.splice(this.selectedIngredientCursor, 1);
            GameManager.state.preparedIngredients.push(ing);
            this.selectedIngredientCursor -= 1;

            if (this.selectedIngredients.length === 0) this.leftColumn = true;
          }
        }
        SoundPlayer.playSound('menu_confirm');
      }

      this.ingredientCursor = Math.clamp(this.ingredientCursor, 0, GameManager.state.preparedIngredients.length - 1);
      this.selectedIngredientCursor = Math.clamp(this.selectedIngredientCursor, 0, this.selectedIngredients.length);

      return;
    }

    if (isSelected) {
      if (Input.getKeyDown('left')) {
        this.onPreviousTableCb();
      } else if (Input.getKeyDown('a') && this.ticksUntilBrewingDone < 0) {
        this.resetListState();
        this.showList = true;
      } else if (Input.getKeyDown('down')) {
        this.openBook();
      }
    }

    // Add new particles
    if (this.ticksUntilBrewingDone > 0) {
      this.bubbleParticles.push({
        x: Math.randomRange(267, 360),
        y: Math.randomRange(70, 110),
        velocity: 0,
        isSmall: Math.random() > 0.5,
        offset: Math.randomRange(0, 1000),
      });
    }

    // Move particles
    for (let i = 0; i < this.bubbleParticles.length; i += 1) {
      this.bubbleParticles[i].velocity += 0.01;
      this.bubbleParticles[i].y -= this.bubbleParticles[i].velocity;
    }

    // Clean unused particles
    this.bubbleParticles = this.bubbleParticles.filter((b) => b.y > -10);

    // Check if brewing is done
    if (this.ticksUntilBrewingDone === 0) {
      if (this.makingRecipe) {
        const recipeInOrdersIdx: number = GameManager.state.orders.findIndex((r) => (r.name === this.makingRecipe?.name));

        if (recipeInOrdersIdx >= 0) {
          GameManager.state.orders.splice(recipeInOrdersIdx, 1);
          GameManager.state.completedOrders += 1;
          GameManager.state.gold += this.makingRecipe.ingredients.length;

          GameManager.state.messageBoard.messages.unshift(orderCompleteMessage(this.makingRecipe));
          GameManager.state.messageBoard.messages.unshift(clientGoodbyeMessasge());

          SoundPlayer.playSound('good_potion');

          console.log(`completed order ${recipeInOrdersIdx}`);
        } else {
          GameManager.state.messageBoard.messages.unshift(recipeWithoutOrderMessage());
          SoundPlayer.playSound('bad_potion');
          console.log('made potion but nobody ordered it', this.makingRecipe);
        }

        this.makingRecipe = null;
      } else {
        GameManager.state.messageBoard.messages.unshift(recipeDoesNotExistMessage());
        SoundPlayer.playSound('bad_potion');
        console.log('made potion that does not exist');
      }

      if (this.stopBubbleSoundCallback) {
        this.stopBubbleSoundCallback();
        this.stopBubbleSoundCallback = null;
      }
    }
  }

  render(g: GraphicsDevice): void {
    g.drawTexture(Sprites.sprite('table').normal, 0, 0);
    g.drawTexture(Sprites.sprite('cauldron').normal, 260, 80);

    if (this.showList) {
      const listWidth: number = 80;
      const maxCountOnPage: number = 9;

      drawFrame(11, 11, listWidth, 218, g, () => {
        Font.draw('Storage', 12, 8, g);

        const page: number = (this.ingredientCursor / maxCountOnPage) | 0;
        const startIdx: number = page * maxCountOnPage;

        for (let idx = startIdx; idx < Math.min(startIdx + 9, GameManager.state.preparedIngredients.length); idx += 1) {
          const pi: PreparedIngredient = GameManager.state.preparedIngredients[idx];

          const yy: number = 11 + Font.charHeight + (idx % maxCountOnPage) * (16 + 4);
          if (idx === this.ingredientCursor && this.leftColumn) g.drawTexture(Sprites.sprite('list_pointer_right').normal, 11, yy);
          drawPreparedIngredientRow(pi, 11 + 16 + 4, yy, g);
        }
      });

      const rightColumnX: number = 11 + listWidth + 20;
      drawFrame(rightColumnX, 11, listWidth, 218, g, () => {
        Font.draw('Selected', rightColumnX + 1, 8, g);

        const page: number = (this.selectedIngredientCursor / maxCountOnPage) | 0;
        const startIdx: number = page * maxCountOnPage;
        const pageCount: number = Math.ceil((this.selectedIngredients.length + 1) / maxCountOnPage);

        for (let idx = startIdx; idx < Math.min(startIdx + 9, this.selectedIngredients.length); idx += 1) {
          const pi: PreparedIngredient = this.selectedIngredients[idx];

          const yy: number = 11 + Font.charHeight + (idx % maxCountOnPage) * (16 + 4);
          if (idx === this.selectedIngredientCursor && !this.leftColumn) g.drawTexture(Sprites.sprite('list_pointer_right').normal, rightColumnX, yy);
          drawPreparedIngredientRow(pi, rightColumnX + 16 + 4, yy, g);
        }

        if (this.selectedIngredients.length > 0 && page === (pageCount - 1)) {
          const yy: number = 11 + Font.charHeight + (this.selectedIngredients.length % maxCountOnPage) * (16 + 4);
          if (this.selectedIngredientCursor === this.selectedIngredients.length && !this.leftColumn) {
            g.drawTexture(Sprites.sprite('list_pointer_right').normal, rightColumnX, yy + 1);
          }
          Font.draw('Brew!', rightColumnX + 16 + 4, yy, g);
        }
      });
    }

    this.bubbleParticles.forEach((bubble) => {
      const t = bubble.isSmall ? Sprites.sprite('bubble_small') : Sprites.sprite('bubble_large');
      g.drawTexture(t.normal, bubble.x + (Math.sin((Engine.ticks + bubble.offset) / 25) * 3) | 0, bubble.y);
    });
  }

  private resetListState(): void {
    this.ingredientCursor = 0;
    this.selectedIngredientCursor = 0;
    this.leftColumn = true;
    this.selectedIngredients = [];
  }
}
