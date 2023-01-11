import { Color } from 'ponczek/gfx/color';
import { Effect } from 'ponczek/gfx/effect';

export class ReplaceColorEffect extends Effect {
  // TODO: For performance - add support for mulitple color replacement
  public sourceColor: Color;
  public targetColor: Color;

  constructor(sourceColor: Color, targetColor: Color) {
    super();
    this.sourceColor = sourceColor;
    this.targetColor = targetColor;
  }

  public set(sourceColor: Color, targetColor: Color): void {
    this.sourceColor = sourceColor;
    this.targetColor = targetColor;
  }

  protected fragment(_x: number, _y: number, color: Color, _w: number, _h: number): Color {
    return color.equals(this.sourceColor)
      ? this.targetColor
      : color;
  }
}
