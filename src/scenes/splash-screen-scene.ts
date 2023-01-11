import { Screen } from 'ponczek/gfx/screen';
import { Scene } from 'ponczek/core/scene';
import { SceneManager } from 'ponczek/core/scene-manager';
import { Texture } from 'ponczek/gfx/texture';
import { Assets } from 'ponczek/core/assets';
import { Timer } from 'ponczek/core/timer';
import { Color } from 'ponczek/gfx/color';
import { FilterColorChannelEffect } from 'ponczek/effects/filter-color-channel-effect';

const transitionTime = 86;

export class SplashScreenScene extends Scene {
  private transitionToScene: Scene;
  private ponczekTexture: Texture;
  private filteredPonczekTexture: Texture;
  private filter: FilterColorChannelEffect;
  private timer: Timer;
  private stage = 0;

  constructor(transitionToScene: Scene) {
    super();
    this.transitionToScene = transitionToScene;
    this.ponczekTexture = Assets.texture('ponczek');
    this.filteredPonczekTexture = Texture.copy(this.ponczekTexture);
    this.filter = new FilterColorChannelEffect(true, true, true);
    this.timer = new Timer();
    this.timer.set(500);

    this.filter.applyToTexture(this.ponczekTexture, this.filteredPonczekTexture);
  }

  update(): void {
    if (this.timer.check()) {
      this.stage += 1;

      if (this.stage === 1) {
        this.filter.filterRed = false;
        this.filter.applyToTexture(this.ponczekTexture, this.filteredPonczekTexture);
        this.timer.set(transitionTime);
      }

      if (this.stage === 2) {
        this.filter.filterGreen = false;
        this.filter.applyToTexture(this.ponczekTexture, this.filteredPonczekTexture);
        this.timer.set(transitionTime);
      }

      if (this.stage === 3) {
        this.filter.filterBlue = false;
        this.filter.applyToTexture(this.ponczekTexture, this.filteredPonczekTexture);
        this.timer.set(1000);
      }

      if (this.stage === 4) {
        SceneManager.replaceScene(this.transitionToScene);
      }
    }
  }

  render(scr: Screen): void {
    scr.clearScreen(Color.black);
    scr.drawTexture(this.filteredPonczekTexture, 0, 0);
    scr.drawText('Ponczek', 5, 5, Color.white);
  }
}
