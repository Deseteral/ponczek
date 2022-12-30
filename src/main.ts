/*
 * TODO: Remove assets from gitignore
 */

import { Engine } from 'marmolada/engine';
import { Textures } from 'marmolada/textures';
import { MainMenuStage } from 'src/main-menu-stage';

(async function main(): Promise<void> {
  Engine.initGraphicsDevice(400, 240);

  // preloadSounds();
  await Textures.loadTextures();

  const initialStage = new MainMenuStage();
  Engine.changeStage(initialStage);

  Engine.tick();
}());
