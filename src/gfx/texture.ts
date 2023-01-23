import { Color } from 'ponczek/gfx/color';

export type HTMLTextureSource = HTMLCanvasElement | HTMLImageElement | ImageBitmap | OffscreenCanvas;
export type Drawable = HTMLCanvasElement;

export class TextureData {
  private pixels: Color[];
  private ctx: CanvasRenderingContext2D;

  constructor(drawable: Drawable) {
    const ctx = drawable.getContext('2d');
    if (!ctx) throw new Error('Could not create graphics context in texture data');
    this.ctx = ctx;

    const w = drawable.width;
    const h = drawable.height;
    const size = w * h;
    const buffer = ctx.getImageData(0, 0, w, h);

    this.pixels = new Array(size);

    for (let idx = 0; idx < size; idx += 1) {
      const baseIdx = idx * 4;
      this.pixels[idx] = Color.from0255(
        buffer.data[baseIdx + 0],
        buffer.data[baseIdx + 1],
        buffer.data[baseIdx + 2],
        buffer.data[baseIdx + 3],
      );
    }
  }

  public setPixelIdx(idx: number, color: Color): void {
    this.pixels[idx].setFromColor(color);
  }

  public setPixel(x: number, y: number, color: Color): void {
    const idx = x + (this.ctx.canvas.width * y);
    this.setPixelIdx(idx, color);
  }

  public getPixelIdx(idx: number): Color {
    return this.pixels[idx];
  }

  public getPixel(x: number, y: number): Color {
    const idx = x + (this.ctx.canvas.width * y);
    return this.getPixelIdx(idx);
  }

  public commit(): void {
    const buffer = this.ctx.getImageData(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

    for (let idx = 0; idx < this.pixels.length; idx += 1) {
      const baseIdx = idx * 4;
      const color = this.pixels[idx];
      buffer.data[baseIdx + 0] = (color.r * 255) | 0;
      buffer.data[baseIdx + 1] = (color.g * 255) | 0;
      buffer.data[baseIdx + 2] = (color.b * 255) | 0;
      buffer.data[baseIdx + 3] = (color.a * 255) | 0;
    }

    this.ctx.putImageData(buffer, 0, 0);
  }
}

export class Texture {
  public readonly drawable: Drawable;
  public readonly width: number;
  public readonly height: number;
  public readonly data: TextureData;

  private constructor(drawable: Drawable) {
    this.drawable = drawable;
    this.width = drawable.width;
    this.height = drawable.height;
    this.data = new TextureData(this.drawable);
  }

  public static createEmpty(width: number, height: number): Texture {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    return new Texture(canvas);
  }

  public static copy(texture: Texture): Texture {
    return Texture.createFromSource(texture.drawable);
  }

  public static createFromSource(source: HTMLTextureSource): Texture {
    const canvas = document.createElement('canvas');
    canvas.width = source.width;
    canvas.height = source.height;

    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Cannot create rendering context while creating a texture');

    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(source, 0, 0);

    return new Texture(canvas);
  }
}
