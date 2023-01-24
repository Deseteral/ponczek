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

  protected fragment(x: number, y: number, color: Color, w: number, h: number): void {
    const u = x / w;
    const v = y / h;

    const transitionColor = this.transitionTexture
      ? this.transitionTexture.data.getPixelUV(u, v)
      : Color.black;

    if (transitionColor.b < this.cutoff) {
      Color.lerp(color, this.transitionColor, this.opacity, color);
    }
  }
}
