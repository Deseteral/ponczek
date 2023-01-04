import { Engine } from 'marmolada/engine';
import { Texture } from 'marmolada/assets';
import { Font } from 'marmolada/font';
import { Vector2 } from 'marmolada/math/vector2';
import { Color } from 'marmolada/color';

export class GraphicsDevice {
  activeFont: (Font | null) = null;

  constructor(public ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
  }

  color(color: Color): void {
    this.ctx.fillStyle = color.htmlString;
  }

  font(font: Font): void {
    this.activeFont = font;
  }

  clearScreen(clearColor: Color = Color.black): void {
    const prevColor = this.ctx.fillStyle;
    this.ctx.fillStyle = clearColor.htmlString;
    this.ctx.fillRect(0, 0, Engine.width, Engine.height);
    this.ctx.fillStyle = prevColor;
  }

  drawTexture(texture: Texture, x: number, y: number, w: number = texture.width, h: number = texture.height): void {
    this.ctx.drawImage(texture.image, x, y, w, h);
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

  drawNinePatch(texture: Texture, x: number, y: number, w: number, h: number, patchWidth: number, patchHeight: number): void {
    // top-left corner
    this.drawTexturePart(texture, 0, 0, patchWidth, patchHeight, x - patchWidth, y - patchHeight, patchWidth, patchHeight);

    // top-right corner
    this.drawTexturePart(texture, patchWidth * 2, 0, patchWidth, patchHeight, x + w, y - patchHeight, patchWidth, patchHeight);

    // bottom-left corner
    this.drawTexturePart(texture, 0, patchHeight * 2, patchWidth, patchHeight, x - patchWidth, y + h, patchWidth, patchHeight);

    // bottom-right corner
    this.drawTexturePart(texture, patchWidth * 2, patchHeight * 2, patchWidth, patchHeight, x + w, y + h, patchWidth, patchHeight);

    // top border
    this.drawTexturePart(texture, patchWidth, 0, patchWidth, patchHeight, x, y - patchHeight, w, patchHeight);

    // bottom border
    this.drawTexturePart(texture, patchWidth, patchHeight * 2, patchWidth, patchHeight, x, y + h, w, patchHeight);

    // left border
    this.drawTexturePart(texture, 0, patchHeight, patchWidth, patchHeight, x - patchWidth, y, patchWidth, h);

    // right border
    this.drawTexturePart(texture, patchWidth * 2, patchHeight, patchWidth, patchHeight, x + w, y, patchWidth, h);

    // middle
    this.drawTexturePart(texture, patchWidth, patchHeight, patchWidth, patchHeight, x, y, w, h);
  }

  clip(x?: number, y?: number, w?: number, h?: number): void {
    if (x === undefined || y === undefined || w === undefined || h === undefined) {
      this.ctx.restore();
      return;
    }

    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.rect(x, y, w, h);
    this.ctx.clip();
  }

  drawText(text: string, position: Vector2): void {
    if (!this.activeFont) {
      console.error('No active font was set');
      return;
    }

    for (let idx = 0; idx < text.length; idx += 1) {
      const char = text[idx];
      this.drawTexturePart(
        this.activeFont.texture,
        this.activeFont.getSourceXForChar(char),
        this.activeFont.getSourceYForChar(char),
        this.activeFont.charWidth,
        this.activeFont.charHeight,
        (position.x + (idx * this.activeFont.charWidth)),
        position.y,
        this.activeFont.charWidth,
        this.activeFont.charHeight,
      );
    }
  }
}
