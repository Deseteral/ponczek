import { Color } from 'marmolada/gfx/color';
import { FragmentEffect } from 'marmolada/gfx/effect';

export class ReplaceColorEffect extends FragmentEffect {
  public sourceColor: Color;
  public targetColor: Color;

  constructor(sourceColor: Color, targetColor: Color) {
    super();
    this.sourceColor = sourceColor;
    this.targetColor = targetColor;
  }

  fragment(_x: number, _y: number, color: Color, _w: number, _h: number): Color {
    return color.equals(this.sourceColor)
      ? this.targetColor
      : color;
  }
}
