import { Color } from 'ponczek/gfx/color';
import { Effect } from 'ponczek/gfx/effect';

/**
 * Effect for replacing single color with another color.
 */
export class ReplaceColorEffect extends Effect {
  // TODO: For performance - add support for mulitple color replacement

  /**
   * Color that will be replaced.
   */
  public sourceColor: Color;

  /**
   * Color that will be used as replacement.
   */
  public targetColor: Color;

  /**
   * Effect setup with color that will be replaced, and color that will be used as replacement.
   */
  constructor(sourceColor: Color, targetColor: Color) {
    super();
    this.sourceColor = sourceColor;
    this.targetColor = targetColor;
  }

  /**
   * Effect setup with color that will be replaced, and color that will be used as replacement.
   */
  public set(sourceColor: Color, targetColor: Color): void {
    this.sourceColor = sourceColor;
    this.targetColor = targetColor;
  }

  protected fragment(_x: number, _y: number, _w: number, _h: number, _u: number, _v: number, outColor: Color): void {
    if (outColor.equals(this.sourceColor)) {
      outColor.setFromColor(this.targetColor);
    }
  }
}
