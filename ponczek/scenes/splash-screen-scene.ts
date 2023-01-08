import { GraphicsDevice } from 'ponczek/gfx/graphics-device';
import { Scene } from 'ponczek/core/scene';
import { SceneManager } from 'ponczek/core/scene-manager';
import { Texture } from 'ponczek/gfx/texture';
import { Assets } from 'ponczek/core/assets';
import { Timer } from 'ponczek/core/timer';
import { Color } from 'ponczek/gfx/color';
import { FilterColorChannelEffect } from 'ponczek/effects/filter-color-channel-effect';
import { Vector2 } from 'ponczek/math/vector2';

const transitionTime = 70;

export class SplashScreenScene extends Scene {
  private transitionToScene: Scene;
  private ponczekTexture: Texture;
  private filteredPonczekTexture: Texture;
  private filter: FilterColorChannelEffect;
  private timer: Timer;
  private stage = 0;
  private textPosition = new Vector2(5, 5);

  constructor(transitionToScene: Scene) {
    super();
    this.transitionToScene = transitionToScene;
    this.ponczekTexture = Assets.texture('ponczek');
    this.filteredPonczekTexture = Texture.createFromSource(this.ponczekTexture.drawable);
    this.filter = new FilterColorChannelEffect(true, true, true);
    this.timer = new Timer();
    this.timer.set(500);

    this.filter.apply(this.ponczekTexture.drawable, this.filteredPonczekTexture.drawable);
  }

  update(): void {
    if (this.timer.check()) {
      this.stage += 1;

      if (this.stage === 1) {
        this.filter.filterRed = false;
        this.filter.apply(this.ponczekTexture.drawable, this.filteredPonczekTexture.drawable);
        this.timer.set(transitionTime);
      }

      if (this.stage === 2) {
        this.filter.filterGreen = false;
        this.filter.apply(this.ponczekTexture.drawable, this.filteredPonczekTexture.drawable);
        this.timer.set(transitionTime);
      }

      if (this.stage === 3) {
        this.filter.filterBlue = false;
        this.filter.apply(this.ponczekTexture.drawable, this.filteredPonczekTexture.drawable);
        this.timer.set(1000);
      }

      if (this.stage === 4) {
        SceneManager.replaceScene(this.transitionToScene);
      }
    }
  }

  render(g: GraphicsDevice): void {
    g.clearScreen(Color.black);
    g.drawTexture(this.filteredPonczekTexture, 0, 0, this.filteredPonczekTexture.width, this.filteredPonczekTexture.height);
    g.drawText('Ponczek', this.textPosition, Color.white);
  }
}
