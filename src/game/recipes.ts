import { Font } from 'src/game/gfx/font';
import { Ingredient, IngredientAction, IngredientActions, Ingredients, PreparedIngredient } from 'src/game/ingredients';
import { findMatchingRecipe, preparedIngredientEquals } from 'src/game/recipe-logic';
import { POTION_NAMES } from 'src/game/potion-names';
import { GraphicsDevice } from 'ponczek/gfx/graphics-device';
import { Sprites } from 'src/game/gfx/sprites';
import { Random } from 'ponczek/math/random';
import { Texture } from 'ponczek/gfx/texture';

const random = Random.default;

export interface Recipe {
  name: string,
  ingredients: PreparedIngredient[],
}

export function getIngredientIcon(ingredient: Ingredient): Texture {
  switch (ingredient) {
    case Ingredient.HERB: return Sprites.sprite('herb').normal;
    case Ingredient.MUSHROOM: return Sprites.sprite('mushroom').normal;
    case Ingredient.STONE: return Sprites.sprite('stone').normal;
    case Ingredient.GOLD: return Sprites.sprite('stone').inverted;
    case Ingredient.FLOWER: return Sprites.sprite('flower').normal;
    default: return Sprites.sprite('x').normal;
  }
}

export function getIngredientActionIcon(action: IngredientAction): Texture {
  switch (action) {
    case IngredientAction.CUTTING: return Sprites.sprite('knife').normal;
    case IngredientAction.GRIDING: return Sprites.sprite('mortar').normal;
    case IngredientAction.BURNING: return Sprites.sprite('fire').normal;
    case IngredientAction.ENCHANTING: return Sprites.sprite('spell').normal;
    default: return Sprites.sprite('x').normal;
  }
}

export function drawPreparedIngredientRow(pi: PreparedIngredient, x: number, y: number, g: GraphicsDevice): void {
  g.drawTexture(getIngredientIcon(pi.ingredient), x, y);
  g.drawTexture(Sprites.sprite('x').normal, x + 16, y);
  g.drawTexture(getIngredientActionIcon(pi.action), x + 16 * 2, y);
}

export function drawRecipe(recipe: Recipe, x: number, y: number, g: GraphicsDevice): void {
  Font.draw(recipe.name, x, y, g);

  recipe.ingredients.forEach((ing, idx) => {
    const xx: number = x + 5;
    const yy: number = y + 40 + (16 + 5) * idx;
    drawPreparedIngredientRow(ing, xx, yy, g);
  });
}

export function generateRecipes(): Recipe[] {
  const recipes: Recipe[] = [];
  const recipesToPick = 15;
  const names: string[] = random.pickMany(POTION_NAMES, recipesToPick, false);

  for (let recipeIdx = 0; recipeIdx < recipesToPick; recipeIdx += 1) {
    let recipeGood = false;
    let recipeTries = 10;

    while (!recipeGood && recipeTries >= 0) {
      const ingredientCount = recipeIdx <= 5 ? random.nextInt(1, 2) : random.nextInt(3, 5);
      const ingredients: PreparedIngredient[] = [];

      for (let ingredientIdx = 0; ingredientIdx < ingredientCount; ingredientIdx += 1) {
        let ingredientGood = false;
        let ingredientTries = 10;

        while (!ingredientGood && ingredientTries >= 0) {
          const ingredient = random.pickOne(Ingredients);
          const action = random.pickOne(IngredientActions);
          const pi: PreparedIngredient = { ingredient, action };

          const foundIdx = ingredients.findIndex((pp) => preparedIngredientEquals(pi, pp));

          if (foundIdx === -1) {
            ingredients.push(pi);
            ingredientGood = true;
          }

          ingredientTries -= 1;
        }
      }

      recipeTries -= 1;

      if (findMatchingRecipe(ingredients, recipes) === null) {
        const name = names[recipes.length];
        recipes.push({ name, ingredients });
        recipeGood = true;
      }
    }
  }

  console.log(`generated ${recipes.length} recipes`, recipes);

  return recipes;
}
