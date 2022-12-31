/*
 * TODO: Remove assets from gitignore
 */

import { Assets } from 'marmolada/assets';
import { Engine } from 'marmolada/engine';
import { Input } from 'marmolada/input';
import { Sprites } from 'src/game/gfx/sprites';
import { MainMenuStage } from 'src/game/stages/main-menu-stage';

(async function main(): Promise<void> {
  await Assets.loadAssets();
  await Sprites.loadSprites();

  Engine.initialize(400, 240);

  Input.withGameBoyLikeBinds();

  Engine.changeStage(new MainMenuStage());
  Engine.tick();
}());
