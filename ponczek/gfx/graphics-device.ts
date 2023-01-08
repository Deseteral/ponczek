import { Font } from 'ponczek/gfx/font';
import { Vector2 } from 'ponczek/math/vector2';
import { Color } from 'ponczek/gfx/color';
import { Texture } from 'ponczek/gfx/texture';
import { Rectangle } from 'ponczek/math/rectangle';

export class GraphicsDevice {
  public width: number;
  public height: number;

  public activeFont: (Font | null) = null;
  public ctx: CanvasRenderingContext2D;

  public get domElement(): HTMLCanvasElement { return this.ctx.canvas; }

  private _drawTextInRectPosition = new Vector2();

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.ctx = GraphicsDevice.createCanvas(width, height);
  }

  private static createCanvas(width: number, height: number): CanvasRenderingContext2D {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('An error occured while creating canvas context');
    }

    ctx.imageSmoothingEnabled = false;

    return ctx;
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
    this.ctx.fillRect(0, 0, this.width, this.height);
    this.ctx.fillStyle = prevColor;
  }

  drawTexture(texture: Texture, x: number, y: number, w: number = texture.width, h: number = texture.height): void {
    this.ctx.drawImage(texture.drawable, (x | 0), (y | 0), w, h);
  }

  drawTexturePart(texture: Texture, sx: number, sy: number, sw: number, sh: number, dx: number, dy: number, dw: number, dh: number): void {
    this.ctx.drawImage(texture.drawable, sx, sy, sw, sh, (dx | 0), (dy | 0), dw, dh);
  }

  drawRect(x: number, y: number, w: number, h: number): void {
    x |= 0; // eslint-disable-line no-param-reassign
    y |= 0; // eslint-disable-line no-param-reassign

    this.ctx.fillRect(x, y, w, 1);
    this.ctx.fillRect(x, y + h - 1, w, 1);
    this.ctx.fillRect(x, y, 1, h);
    this.ctx.fillRect(x + w - 1, y, 1, h);
  }

  fillRect(x: number, y: number, w: number, h: number): void {
    this.ctx.fillRect((x | 0), (y | 0), w, h);
  }

  drawNinePatch(texture: Texture, x: number, y: number, w: number, h: number, patchWidth: number, patchHeight: number): void {
    x |= 0; // eslint-disable-line no-param-reassign
    y |= 0; // eslint-disable-line no-param-reassign

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

    x |= 0; // eslint-disable-line no-param-reassign
    y |= 0; // eslint-disable-line no-param-reassign

    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.rect(x, y, w, h);
    this.ctx.clip();
  }

  drawText(text: string, position: Vector2, color: Color): void {
    if (!this.activeFont) {
      console.error('No active font was set');
      return;
    }

    const fontTexture = this.activeFont.getTextureForColor(color);

    for (let idx = 0; idx < text.length; idx += 1) {
      const char = text[idx];
      this.drawTexturePart(
        fontTexture,
        this.activeFont.getSourceXForChar(char),
        this.activeFont.getSourceYForChar(char),
        this.activeFont.charWidth,
        this.activeFont.charHeight,
        (position.x + (idx * this.activeFont.charWidth)) | 0,
        (position.y) | 0,
        this.activeFont.charWidth,
        this.activeFont.charHeight,
      );
    }
  }

  drawTextInRect(text: string, rect: Rectangle, color: Color): void {
    if (!this.activeFont) {
      console.error('No active font was set');
      return;
    }

    const tokens = text.split(' ');

    let line = tokens[0];
    this._drawTextInRectPosition.set(rect.x, rect.y);

    for (let idx = 1; idx < tokens.length; idx += 1) {
      const nextLine = (line + ' ' + tokens[idx]); // eslint-disable-line prefer-template

      if (this.activeFont.getLineLengthPx(nextLine) > rect.width) {
        this.drawText(line, this._drawTextInRectPosition, color);
        line = tokens[idx];
        this._drawTextInRectPosition.y += 8;
      } else {
        line = nextLine;
      }
    }
    this.drawText(line, this._drawTextInRectPosition, color);
  }
}
