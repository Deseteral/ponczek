/*
 * TODO: Remove assets from gitignore
 */

import { Assets } from 'marmolada/assets';
import { Engine } from 'marmolada/engine';
import { Sprites } from 'src/game/sprites';
import { MainMenuStage } from 'src/game/stages/main-menu-stage';

(async function main(): Promise<void> {
  Engine.initGraphicsDevice(400, 240);

  await Assets.loadAssets();
  await Sprites.loadSprites();

  Engine.changeStage(new MainMenuStage());

  Engine.tick();
}());
