/* eslint-disable no-param-reassign */
import { Color } from 'ponczek/gfx/color';
import { FragmentEffect } from 'ponczek/gfx/effect';

export class FilterColorChannelEffect extends FragmentEffect {
  public filterRed: boolean;
  public filterGreen: boolean;
  public filterBlue: boolean;

  constructor(filterRed: boolean = false, filterGreen: boolean = false, filterBlue: boolean = false) {
    super();
    this.filterRed = filterRed;
    this.filterGreen = filterGreen;
    this.filterBlue = filterBlue;
  }

  protected fragment(_x: number, _y: number, color: Color, _w: number, _h: number): Color {
    if (this.filterRed) color.r = 0;
    if (this.filterGreen) color.g = 0;
    if (this.filterBlue) color.b = 0;
    return color;
  }
}
