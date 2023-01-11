import { Assets } from 'ponczek/core/assets';
import { Input } from 'ponczek/core/input';
import { Engine } from 'ponczek/engine';
import { MainMenuScene } from 'examples/scenes/main-menu-scene';

(async function main(): Promise<void> {
  await Assets.loadAssets();

  Engine.initialize(320, 240, () => new MainMenuScene());
  Input.withGameBoyLikeBinds();
  Engine.start();
}());
