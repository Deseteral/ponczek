export type HTMLTextureSource = HTMLCanvasElement | HTMLImageElement | ImageBitmap | OffscreenCanvas;
export type Drawable = HTMLCanvasElement;

export class Texture {
  width: number;
  height: number;
  get drawable(): Drawable { return this.canvas; }

  private canvas: Drawable;

  constructor(drawable: HTMLTextureSource) {
    this.width = drawable.width;
    this.height = drawable.height;

    this.canvas = document.createElement('canvas');
    this.canvas.width = this.width;
    this.canvas.height = this.height;

    const ctx = this.canvas.getContext('2d');
    if (!ctx) throw new Error('Cannot create rendering context while creating a texture');

    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(drawable, 0, 0);
  }
}
