import { Color } from 'ponczek/gfx/color';
import { Texture } from 'ponczek/gfx/texture';
import { Screen } from 'ponczek/gfx/screen';

export abstract class Effect {
  protected abstract fragment(x: number, y: number, color: Color, w: number, h: number): void;

  public applyToScreen(target: Screen): void {
    const targetBuffer = target.ctx.getImageData(0, 0, target.width, target.height);

    const outColor = new Color(0, 0, 0, 0);

    for (let idx = 0; idx < targetBuffer.data.length; idx += 4) {
      const x = ((idx / 4) % target.width) | 0;
      const y = ((idx / 4) / target.width) | 0;

      outColor.setFrom0255(targetBuffer.data[idx], targetBuffer.data[idx + 1], targetBuffer.data[idx + 2], targetBuffer.data[idx + 3]);
      this.fragment(x, y, outColor, target.width, target.height);

      targetBuffer.data[idx + 0] = (outColor.r * 255) | 0;
      targetBuffer.data[idx + 1] = (outColor.g * 255) | 0;
      targetBuffer.data[idx + 2] = (outColor.b * 255) | 0;
      targetBuffer.data[idx + 3] = (outColor.a * 255) | 0;
    }

    target.ctx.putImageData(targetBuffer, 0, 0);
  }

  public apply(target: Texture): void {
    const w = target.width;
    const h = target.height;

    const outColor = new Color(0, 0, 0, 0);

    for (let idx = 0; idx < (w * h); idx += 1) {
      const x = (idx % w) | 0;
      const y = (idx / w) | 0;

      outColor.setFromColor(target.data.getPixelIdx(idx));
      this.fragment(x, y, outColor, w, h);

      target.data.setPixelIdx(idx, outColor);
    }

    target.data.commit();
  }
}
