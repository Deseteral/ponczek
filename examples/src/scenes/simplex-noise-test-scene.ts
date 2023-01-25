import { Screen } from 'ponczek/gfx/screen';
import { Scene } from 'ponczek/core/scene';
import { SimplexNoise } from 'ponczek/math/simplex-noise';
import { Texture } from 'ponczek/gfx/texture';
import { Effect } from 'ponczek/gfx/effect';
import { Color } from 'ponczek/gfx/color';
import { Input } from 'ponczek/core/input';
import { SceneManager } from 'ponczek/core/scene-manager';
import { ENDESGA16PaletteIdx } from 'ponczek/palettes/endesga16-palette';
import { Vector2 } from 'ponczek/math/vector2';
import { Ponczek } from 'ponczek/ponczek';
import { withTransition } from 'examples/utils/with-transition';

class NoiseEffect extends Effect {
  public colorMode: boolean = false;
  public offset: Vector2 = Vector2.zero;
  public scale: number = 0.1;

  private noise: SimplexNoise;

  constructor() {
    super();
    this.regenerate();
  }

  public regenerate(): void {
    this.noise = new SimplexNoise();
  }

  protected fragment(x: number, y: number, color: Color, _w: number, _h: number): void {
    const xx = (this.offset.x + x) | 0;
    const yy = (this.offset.y + y) | 0;
    const value = this.noise.get(xx, yy, this.scale);

    if (this.colorMode) {
      if (value < 0.4) {
        color.setFromColor(ENDESGA16PaletteIdx[15]);
      } else if (value < 0.48) {
        color.setFromColor(ENDESGA16PaletteIdx[7]);
      } else if (value < 0.8) {
        color.setFromColor(ENDESGA16PaletteIdx[9]);
      } else if (value < 0.9) {
        color.setFromColor(ENDESGA16PaletteIdx[12]);
      } else {
        color.setFromColor(ENDESGA16PaletteIdx[13]);
      }
    } else {
      color.setFrom01(value, value, value);
    }
  }
}

export class SimplexNoiseTestScene extends Scene {
  private noiseTexture: Texture;
  private effect: NoiseEffect;

  constructor() {
    super();
    this.noiseTexture = Texture.createEmpty(Ponczek.screen.height, Ponczek.screen.height);
    this.effect = new NoiseEffect();
  }

  update(): void {
    if (Input.getKey('KeyE')) this.effect.scale += 0.001;
    if (Input.getKey('KeyQ')) this.effect.scale -= 0.001;

    if (Input.getButton('up')) this.effect.offset.y -= 1;
    if (Input.getButton('down')) this.effect.offset.y += 1;
    if (Input.getButton('left')) this.effect.offset.x -= 1;
    if (Input.getButton('right')) this.effect.offset.x += 1;

    if (Input.getKeyDown('Space')) this.effect.colorMode = !this.effect.colorMode;
    if (Input.getKeyDown('KeyR')) this.effect.regenerate();

    if (Input.getButtonDown('b')) withTransition(() => SceneManager.popScene());

    this.effect.apply(this.noiseTexture);
  }

  render(scr: Screen): void {
    scr.clearScreen();
    scr.drawTexture(this.noiseTexture, 0, 0);
    scr.drawTextInRect(`wasd - move\n\nq/e - change scale\n\nspace - toggle color mode\n\nr - regenerate\n\ncurrent scale: ${this.effect.scale}`, 240, 0, scr.width - 240, scr.height, Color.white);
  }
}
