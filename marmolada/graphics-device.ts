import { Engine } from 'marmolada/engine';
import { Texture } from 'marmolada/assets';

export class GraphicsDevice {
  constructor(public ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
  }

  color(color: string): void {
    this.ctx.fillStyle = color;
  }

  clearScreen(clearColor: string = 'black'): void {
    const prevColor = this.ctx.fillStyle;
    this.ctx.fillStyle = clearColor;
    this.ctx.fillRect(0, 0, Engine.width, Engine.height);
    this.ctx.fillStyle = prevColor;
  }

  drawTexture(texture: Texture, x: number, y: number, w?: number, h?: number): void {
    this.ctx.drawImage(texture.image, x, y, w ?? texture.width, h ?? texture.height);
  }

  drawTexturePart(texture: Texture, sx: number, sy: number, sw: number, sh: number, dx: number, dy: number, dw: number, dh: number): void {
    this.ctx.drawImage(texture.image, sx, sy, sw, sh, dx, dy, dw, dh);
  }

  drawRect(x: number, y: number, w: number, h: number): void {
    this.ctx.fillRect(x, y, w, 1);
    this.ctx.fillRect(x, y + h - 1, w, 1);
    this.ctx.fillRect(x, y, 1, h);
    this.ctx.fillRect(x + w - 1, y, 1, h);
  }

  fillRect(x: number, y: number, w: number, h: number): void {
    this.ctx.fillRect(x, y, w, h);
  }
}
