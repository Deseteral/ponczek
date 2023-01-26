/* eslint-disable no-param-reassign */
import { Color } from 'ponczek/gfx/color';
import { Effect } from 'ponczek/gfx/effect';
import { Texture } from 'ponczek/gfx/texture';

export class FilterColorChannelEffect extends Effect {
  public source: Texture;

  public filterRed: boolean;
  public filterGreen: boolean;
  public filterBlue: boolean;

  constructor(filterRed: boolean = false, filterGreen: boolean = false, filterBlue: boolean = false) {
    super();
    this.filterRed = filterRed;
    this.filterGreen = filterGreen;
    this.filterBlue = filterBlue;
  }

  protected fragment(x: number, y: number, _w: number, _h: number, _u: number, _v: number, outColor: Color): void {
    outColor.setFromColor(this.source.data.getPixel(x, y));

    if (this.filterRed) outColor.r = 0;
    if (this.filterGreen) outColor.g = 0;
    if (this.filterBlue) outColor.b = 0;
  }
}
