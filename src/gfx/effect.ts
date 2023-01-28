import { Color } from 'ponczek/gfx/color';
import { Texture } from 'ponczek/gfx/texture';
import { Screen } from 'ponczek/gfx/screen';

/**
 * Graphical effect that can be applied to any `Texture` or `Screen`.
 *
 * From developer perspective effects work in similar way to fragment shaders.
 * The developer has to implement `fragment` method that decides what color any pixel should be.
 */
export abstract class Effect {
  /**
   * Decides the color of pixel. Calculated color values has to be set on the `outColor` parameter.
   * - `x` - x-coordinate of the pixel.
   * - `y` - x-coordinate of the pixel.
   * - `w` - width of the target texture/screen.
   * - `h` - height of the target texture/screen.
   * - `u` - number in range [0, 1], coordinate of the pixel in target (essentialy `x/w`).
   * - `v` - number in range [0, 1], coordinate of the pixel in target (essentialy `y/h`).
   * - `outColor` - current color of the target pixel and where the calculation result should be set.
   */
  protected abstract fragment(x: number, y: number, w: number, h: number, u: number, v: number, outColor: Color): void;

  /**
   * Applies effect to given `Screen`.
   */
  public applyToScreen(target: Screen): void {
    const targetBuffer = target.ctx.getImageData(0, 0, target.width, target.height);

    const outColor = new Color(0, 0, 0, 0);
    const w = target.width;
    const h = target.height;

    for (let idx = 0; idx < targetBuffer.data.length; idx += 4) {
      const x = ((idx / 4) % w) | 0;
      const y = ((idx / 4) / w) | 0;
      const u = x / w;
      const v = y / h;

      outColor.setFrom0255(targetBuffer.data[idx], targetBuffer.data[idx + 1], targetBuffer.data[idx + 2], targetBuffer.data[idx + 3]);
      this.fragment(x, y, w, h, u, v, outColor);

      targetBuffer.data[idx + 0] = (outColor.r * 255) | 0;
      targetBuffer.data[idx + 1] = (outColor.g * 255) | 0;
      targetBuffer.data[idx + 2] = (outColor.b * 255) | 0;
      targetBuffer.data[idx + 3] = (outColor.a * 255) | 0;
    }

    target.ctx.putImageData(targetBuffer, 0, 0);
  }

  /**
   * Applies effect to given `Texture`.
   */
  public apply(target: Texture): void {
    const w = target.width;
    const h = target.height;

    const outColor = new Color(0, 0, 0, 0);

    for (let idx = 0; idx < (w * h); idx += 1) {
      const x = (idx % w) | 0;
      const y = (idx / w) | 0;
      const u = x / w;
      const v = y / h;

      outColor.setFromColor(target.data.getPixelIdx(idx));
      this.fragment(x, y, w, h, u, v, outColor);

      target.data.setPixelIdx(idx, outColor);
    }

    target.data.commit();
  }
}
