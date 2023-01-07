import { Assets } from 'ponczek/core/assets';
import { Input } from 'ponczek/core/input';
import { SceneManager } from 'ponczek/core/scene-manager';
import { Engine } from 'ponczek/engine';
import { MainMenuScene } from 'src/scenes/main-menu-scene';

(async function main(): Promise<void> {
  await Assets.loadAssets();

  Engine.initialize(320, 240);

  Input.withGameBoyLikeBinds();

  SceneManager.pushScene(new MainMenuScene());
  Engine.start();
}());
