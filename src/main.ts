/*
 * TODO: Remove assets from gitignore
 */

import { Assets } from 'ponczek/core/assets';
import { Engine } from 'ponczek/engine';
import { Input } from 'ponczek/core/input';
import { Sprites } from 'src/game/gfx/sprites';
import { MainMenuScene } from 'src/game/scenes/main-menu-scene';

(async function main(): Promise<void> {
  await Assets.loadAssets();
  await Sprites.loadSprites();

  Engine.initialize(400, 240);

  Input.withGameBoyLikeBinds();

  Engine.changeScene(new MainMenuScene());
  Engine.loop();
}());
