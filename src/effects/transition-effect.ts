import { Color } from 'ponczek/gfx/color';
import { Effect } from 'ponczek/gfx/effect';
import { Texture } from 'ponczek/gfx/texture';

export class TransitionEffect extends Effect {
  public cutoff: number;
  public opacity: number;
  public transitionColor: Color;
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
