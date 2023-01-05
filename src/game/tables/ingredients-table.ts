import { Engine } from 'marmolada/engine';
import { Font } from 'src/game/gfx/font';
import { drawFrame } from 'src/game/gfx/frame';
import { GraphicsDevice } from 'marmolada/gfx/graphics-device';
import { Input } from 'marmolada/core/input';
import { GameManager } from 'src/game/game-manager';
import { Ingredient, Ingredients, IngredientAction, ingredientDisplayName } from 'src/game/ingredients';
import { getIngredientIcon } from 'src/game/recipes';
import { Sprite, Sprites } from 'src/game/gfx/sprites';
import { BurningStation } from 'src/game/stations/burning-station';
import { CuttingStation } from 'src/game/stations/cutting-station';
import { EnchantmentStation } from 'src/game/stations/enchantment-station';
import { GrindingStation } from 'src/game/stations/grinding-station';
import { Station, StationCompleteCallback } from 'src/game/stations/station';
import { Table } from 'src/game/tables/table';
import { SoundPlayer } from 'marmolada/sound/sound-player';
import { Random } from 'marmolada/math/random';

const random = Random.default;

export class IngredientsTable extends Table {
  selectedStation: number = 0;
  activeStation: (Station | null) = null;

  isIndredientPickerOpen: boolean = false;
  ingredientCursor: number = 0;

  ignoringInputTicks = 0;

  update(isSelected: boolean): void {
    if (this.activeStation && isSelected) {
      this.activeStation.update();
      return;
    }

    this.ignoringInputTicks -= 1;

    if (!this.isIndredientPickerOpen && Input.getButtonDown('a') && this.canUseInput(isSelected)) {
      this.isIndredientPickerOpen = true;
      SoundPlayer.playSound('menu_confirm');
      return;
    }

    if (this.isIndredientPickerOpen && isSelected) {
      if (Input.getButtonDown('up')) {
        this.ingredientCursor -= 1;
        SoundPlayer.playSound('menu_pick');
      }
      if (Input.getButtonDown('down')) {
        this.ingredientCursor += 1;
        SoundPlayer.playSound('menu_pick');
      }
      if (Input.getButtonDown('b')) {
        this.isIndredientPickerOpen = false;
        this.ingredientCursor = 0;
        return;
      }
      this.ingredientCursor = Math.clamp(this.ingredientCursor, 0, 5 - 1);

      if (Input.getButtonDown('a')) {
        const selectedIngredient: Ingredient = Ingredients[this.ingredientCursor];
        this.ingredientCursor = 0;
        this.isIndredientPickerOpen = false;

        const cb: StationCompleteCallback = (success: boolean, action: IngredientAction) => {
          if (success) {
            const amount = random.nextInt(1, 2);
            for (let a = 0; a < amount; a += 1) {
              GameManager.state.preparedIngredients.push({ ingredient: selectedIngredient, action });
            }

            SoundPlayer.playSound('good_potion');

            console.log(`preparing ingredient successful, receiving ${amount}`);
          }
          this.exitStation();
        };

        if (this.selectedStation === 0) {
          this.activeStation = new CuttingStation(cb);
        } else if (this.selectedStation === 1) {
          this.activeStation = new GrindingStation(cb);
        } else if (this.selectedStation === 2) {
          this.activeStation = new BurningStation(cb);
        } else if (this.selectedStation === 3) {
          this.activeStation = new EnchantmentStation(cb);
        }

        Engine.shouldCountTicks = false;

        SoundPlayer.playSound('menu_confirm');
      }

      return;
    }

    const prevSlectedStation = this.selectedStation;
    if (Input.getButtonDown('right') && this.canUseInput(isSelected)) {
      this.selectedStation += 1;
    }
    if (Input.getButtonDown('left') && this.canUseInput(isSelected)) {
      this.selectedStation -= 1;
    }

    if (this.selectedStation < 0) {
      this.onPreviousTableCb();
    } else if (this.selectedStation > 3) {
      this.onNextTableCb();
    } else if (Input.getButtonDown('down') && this.canUseInput(isSelected)) {
      this.openBook();
    }

    this.selectedStation = Math.clamp(this.selectedStation, 0, 3);
    if (this.selectedStation !== prevSlectedStation) SoundPlayer.playSound('menu_pick');
  }

  render(g: GraphicsDevice): void {
    g.drawTexture(Sprites.sprite('table').normal, 0, 0);

    this.drawStation(Sprites.sprite('cutting'), 10, 40, this.selectedStation === 0, g);
    this.drawStation(Sprites.sprite('grinding'), 106, 93, this.selectedStation === 1, g);
    this.drawStation(Sprites.sprite('burning'), 193, 25, this.selectedStation === 2, g);
    this.drawStation(Sprites.sprite('enchanting'), 305, 100, this.selectedStation === 3, g);

    if (this.isIndredientPickerOpen) {
      drawFrame(11, 11, 120, 97, g, () => {
        Ingredients.forEach((ing, idx) => {
          const xx: number = 11;
          const yy: number = 6 + idx * Font.charHeight;
          if (idx === this.ingredientCursor) g.drawTexture(Sprites.sprite('list_pointer_right').normal, xx, yy + 5);
          g.drawTexture(getIngredientIcon(ing), xx + 16, yy + 5);
          Font.draw(`${ingredientDisplayName(ing)}`, xx + 16 + 16 + 2, yy + 3, g);
        });
      });
    }

    if (this.activeStation) this.activeStation.render(g);
  }

  private drawStation(sprite: Sprite, x: number, y: number, isSelected: boolean, g: GraphicsDevice): void {
    const frameOffset = 4;
    if (isSelected) g.drawRect(x - frameOffset, y - frameOffset, sprite.normal.width + frameOffset * 2, sprite.normal.height + frameOffset * 2);
    g.drawTexture(sprite.normal, x, y);
  }

  private exitStation(): void {
    this.activeStation = null;
    this.ignoringInputTicks = (0.5 * 60) | 0;
    Engine.shouldCountTicks = true;
  }

  private canUseInput(isSelected: boolean): boolean {
    return this.ignoringInputTicks <= 0 && isSelected;
  }
}
