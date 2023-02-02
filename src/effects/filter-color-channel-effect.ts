/* eslint-disable no-param-reassign */
import { Color } from 'ponczek/gfx/color';
import { Effect } from 'ponczek/gfx/effect';
import { Texture } from 'ponczek/gfx/texture';

/**
 * Effect for filtering RGB color channels.
 */
export class FilterColorChannelEffect extends Effect {
  /**
   * Source texture on which the filter will be applied.
   */
  public source: Texture;

  /**
   * Whether to filter out red channel.
   */
  public filterRed: boolean;

  /**
   * Whether to filter out green channel.
   */
  public filterGreen: boolean;

  /**
   * Whether to filter out blue channel.
   */
  public filterBlue: boolean;

  constructor(source: Texture, filterRed: boolean = false, filterGreen: boolean = false, filterBlue: boolean = false) {
    super();
    this.source = source;
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
