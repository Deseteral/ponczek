import { Color } from 'ponczek/gfx/color';
import { Effect } from 'ponczek/gfx/effect';
import { Texture } from 'ponczek/gfx/texture';

/**
 * Applies special transition texture. Can be used to create animated transitions between scenes.
 * This effect will cover the screen with specified color according to cutoff value.
 * Specialized transition texture has only grayscale colors that will be progressively applied based on cutoff value.
 *
 * Can also do fullscreen fade effect. For that you should not provide transition texture and control the fade using opacity value.
 */
export class TransitionEffect extends Effect {
  /**
   * Value in range [0, 1] that corresponds to color channel value that will be cutoff.
   */
  public cutoff: number;

  /**
   * Color that will be applied for cutoff values.
   */
  public transitionColor: Color;

  /**
   * Value in range [0, 1] that represents the opacity of the effect.
   */
  public opacity: number; // TODO: This should be handled by transitionColor alpha channel?

  /**
   * Greyscale texture providing transition pattern.
   * Black pixels will be cut out first, white pixel last.
   */
  public transitionTexture: (Texture | null);

  constructor(transitionTexture?: Texture) {
    super();
    this.cutoff = transitionTexture ? 0 : 1;
    this.opacity = transitionTexture ? 1 : 0;
    this.transitionColor = Color.black;
    this.transitionTexture = transitionTexture || null;
  }

  protected fragment(_x: number, _y: number, _w: number, _h: number, u: number, v: number, outColor: Color): void {
    const transitionColor = this.transitionTexture
      ? this.transitionTexture.data.getPixelUV(u, v)
      : Color.black;

    if (transitionColor.b < this.cutoff) {
      Color.lerp(outColor, this.transitionColor, this.opacity, outColor);
    }
  }
}
