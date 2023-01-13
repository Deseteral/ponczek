import { AssetDefinition, Assets } from 'ponczek/core/assets';
import { Input } from 'ponczek/core/input';
import { STARTUP_AUTOPLAY, Engine, STARTUP_SKIP_SPLASH_SCREEN } from 'ponczek/engine';
import { MainMenuScene } from 'examples/scenes/main-menu-scene';
import textureList from '../assets/textures.json';
import soundList from '../assets/sounds.json';

(async function main(): Promise<void> {
  await Assets.loadAssets(textureList as AssetDefinition[], soundList as AssetDefinition[]);

  await Engine.initialize(320, 240, () => new MainMenuScene());
  Input.withGameBoyLikeBinds();
}());
