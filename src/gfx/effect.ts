import { Color } from 'ponczek/gfx/color';
import { Drawable, Texture } from 'ponczek/gfx/texture';

export abstract class Effect {
  protected beforePass(): void { }
  protected abstract fragment(x: number, y: number, color: Color, w: number, h: number): Color;

  public applyToTexture(source: Texture, target: Texture = source): void {
    this.apply(source.drawable, target.drawable);
  }

  public apply(source: Drawable, target: Drawable = source): void {
    const sourceCtx = source.getContext('2d');
    if (!sourceCtx) throw new Error('Could not create source context in fragment effect');

    const targetCtx = target.getContext('2d');
    if (!targetCtx) throw new Error('Could not create target context in fragment effect');

    const sourceBuffer = sourceCtx.getImageData(0, 0, source.width, source.height);
    const targetBuffer = targetCtx.getImageData(0, 0, source.width, source.height);

    this.beforePass();

    const color = new Color(0, 0, 0, 0);

    for (let idx = 0; idx < sourceBuffer.data.length; idx += 4) {
      const x = ((idx / 4) % source.width) | 0;
      const y = ((idx / 4) / source.width) | 0;

      color.setFrom0255(sourceBuffer.data[idx], sourceBuffer.data[idx + 1], sourceBuffer.data[idx + 2], sourceBuffer.data[idx + 3]);
      const outColor = this.fragment(x, y, color, source.width, source.height);

      targetBuffer.data[idx] = (outColor.r * 255) | 0;
      targetBuffer.data[idx + 1] = (outColor.g * 255) | 0;
      targetBuffer.data[idx + 2] = (outColor.b * 255) | 0;
      targetBuffer.data[idx + 3] = (outColor.a * 255) | 0;
    }

    targetCtx.putImageData(targetBuffer, 0, 0);
  }
}
