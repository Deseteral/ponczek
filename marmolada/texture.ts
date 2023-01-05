export type HTMLTextureSource = HTMLCanvasElement | HTMLImageElement | ImageBitmap | OffscreenCanvas;
export type Drawable = HTMLCanvasElement;

export class Texture {
  public width: number;
  public height: number;
  public get drawable(): Drawable { return this.canvas; }

  private canvas: Drawable;

  private constructor(drawable: Drawable) {
    this.canvas = drawable;
    this.width = drawable.width;
    this.height = drawable.height;
  }

  public static createEmpty(width: number, height: number): Texture {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    return new Texture(canvas);
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
