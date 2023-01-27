import { Font } from 'ponczek/gfx/font';
import { Vector2 } from 'ponczek/math/vector2';
import { Color } from 'ponczek/gfx/color';
import { Texture } from 'ponczek/gfx/texture';
import { Rectangle } from 'ponczek/math/rectangle';
import { Sprite } from 'ponczek/gfx/spritesheet';

export const FLIP_H = 1 << 0;
export const FLIP_V = 1 << 1;

export class Screen {
  public width: number;
  public height: number;

  public activeFont: (Font | null) = null;
  public ctx: CanvasRenderingContext2D;

  public get domElement(): HTMLCanvasElement { return this.ctx.canvas; }

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.ctx = Screen.createCanvas(width, height);
  }

  public color(color: Color): void {
    this.ctx.fillStyle = color.cssString;
  }

  public font(font: Font): void {
    this.activeFont = font;
  }

  public clearScreen(clearColor: Color = Color.black): void {
    const prevColor = this.ctx.fillStyle;
    this.ctx.fillStyle = clearColor.cssString;
    this.ctx.fillRect(0, 0, this.width, this.height);
    this.ctx.fillStyle = prevColor;
  }

  public setPixelV(position: Vector2): void {
    this.setPixel(position.x, position.y);
  }

  public setPixel(x: number, y: number): void {
    this.fillRect((x | 0), (y | 0), 1, 1);
  }

  public drawLineV(from: Vector2, to: Vector2): void {
    this.drawLine(from.x, from.y, to.x, to.y);
  }

  public drawLine(x1: number, y1: number, x2: number, y2: number): void {
    x1 |= x1; // eslint-disable-line no-param-reassign
    y1 |= y1; // eslint-disable-line no-param-reassign
    x2 |= x2; // eslint-disable-line no-param-reassign
    y2 |= y2; // eslint-disable-line no-param-reassign

    if (x1 === x2 && y1 === y2) {
      this.setPixel(x1, y1);
      return;
    }

    if (Math.abs(x1 - x2) > Math.abs(y1 - y2)) {
      const startX = (x1 < x2) ? x1 : x2;
      const startY = (x1 < x2) ? y1 : y2;
      const endX = (x1 < x2) ? x2 : x1;
      const endY = (x1 < x2) ? y2 : y1;
      const d = (endY - startY) / (endX - startX);

      for (let xx = 0; xx < (endX - startX + 1); xx += 1) {
        this.setPixel(startX + xx, startY + ((d * xx) | 0));
      }
    } else {
      const startX = (y1 < y2) ? x1 : x2;
      const startY = (y1 < y2) ? y1 : y2;
      const endX = (y1 < y2) ? x2 : x1;
      const endY = (y1 < y2) ? y2 : y1;
      const d = (endX - startX) / (endY - startY);

      for (let yy = 0; yy < (endY - startY + 1); yy += 1) {
        this.setPixel(startX + ((d * yy) | 0), startY + yy);
      }
    }
  }

  public drawRectV(position: Vector2, w: number, h: number): void {
    this.drawRect(position.x, position.y, w, h);
  }

  public drawRectR(rect: Rectangle): void {
    this.drawRect(rect.x, rect.y, rect.width, rect.height);
  }

  public drawRect(x: number, y: number, w: number, h: number): void {
    x |= 0; // eslint-disable-line no-param-reassign
    y |= 0; // eslint-disable-line no-param-reassign

    this.ctx.fillRect(x, y, w, 1);
    this.ctx.fillRect(x, y + h - 1, w, 1);
    this.ctx.fillRect(x, y, 1, h);
    this.ctx.fillRect(x + w - 1, y, 1, h);
  }

  public fillRectV(position: Vector2, w: number, h: number): void {
    this.fillRect(position.x, position.y, w, h);
  }

  public fillRectR(rect: Rectangle): void {
    this.fillRect(rect.x, rect.y, rect.width, rect.height);
  }

  public fillRect(x: number, y: number, w: number, h: number): void {
    this.ctx.fillRect((x | 0), (y | 0), w, h);
  }

  public drawCircleV(position: Vector2, radius: number): void {
    this.drawCircle(position.x, position.y, radius);
  }

  public drawCircle(x: number, y: number, radius: number): void {
    this.circ(x, y, radius, false);
  }

  public fillCircleV(position: Vector2, radius: number): void {
    this.fillCircle(position.x, position.y, radius);
  }

  public fillCircle(x: number, y: number, radius: number): void {
    this.circ(x, y, radius, true);
  }

  public drawTextureV(texture: Texture, position: Vector2, w: number = texture.width, h: number = texture.height, flip: number = 0): void {
    this.drawTexture(texture, position.x, position.y, w, h, flip);
  }

  public drawTexture(texture: Texture, x: number, y: number, w: number = texture.width, h: number = texture.height, flip: number = 0): void {
    x |= 0; // eslint-disable-line no-param-reassign
    y |= 0; // eslint-disable-line no-param-reassign

    const flipH = !!(flip & FLIP_H);
    const flipV = !!(flip & FLIP_V);

    this.ctx.save();
    this.ctx.translate((flipH ? w : 0) + x, (flipV ? h : 0) + y);
    this.ctx.scale((flipH ? -1 : 1), (flipV ? -1 : 1));

    this.ctx.drawImage(texture.drawable, 0, 0, w, h);
    this.ctx.restore();
  }

  public drawTexturePart(texture: Texture, sx: number, sy: number, sw: number, sh: number, dx: number, dy: number, dw: number, dh: number, flip: number = 0): void {
    dx |= 0; // eslint-disable-line no-param-reassign
    dy |= 0; // eslint-disable-line no-param-reassign

    const flipH = !!(flip & FLIP_H);
    const flipV = !!(flip & FLIP_V);

    this.ctx.save();
    this.ctx.translate((flipH ? dw : 0) + dx, (flipV ? dh : 0) + dy);
    this.ctx.scale((flipH ? -1 : 1), (flipV ? -1 : 1));

    this.ctx.drawImage(texture.drawable, sx, sy, sw, sh, 0, 0, dw, dh);
    this.ctx.restore();
  }

  public drawSprite(sprite: Sprite, dx: number, dy: number, flip: number = 0, scale: number = 1): void {
    this.drawTexturePart(sprite.sheet.texture, sprite.sx, sprite.sy, sprite.sw, sprite.sh, dx, dy, sprite.sw * scale, sprite.sh * scale, flip);
  }

  public drawNineSlice(texture: Texture, x: number, y: number, w: number, h: number, patchWidth: number, patchHeight: number): void {
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

  public clip(x?: number, y?: number, w?: number, h?: number): void {
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

  public drawTextV(text: string, position: Vector2, color: Color): void {
    this.drawText(text, position.x, position.y, color);
  }

  public drawText(text: string, x: number, y: number, color: Color): void {
    this.drawTextInRect(text, x, y, Infinity, Infinity, color);
  }

  public drawTextInRectR(text: string, rect: Rectangle, color: Color): void {
    this.drawTextInRect(text, rect.x, rect.y, rect.width, rect.height, color);
  }

  public drawTextInRect(text: string, x: number, y: number, w: number, h: number, color: Color): void {
    if (!this.activeFont) {
      console.error('No active font was set');
      return;
    }

    if (w !== Infinity || h !== Infinity) {
      this.clip(x, y, w, h);
    }

    const lines = text.split('\n');
    const lineHeight = 8;
    let yy = y;

    for (let lineIdx = 0; lineIdx < lines.length; lineIdx += 1) {
      const tokens = lines[lineIdx].split(' ');
      let line = tokens[0];

      for (let idx = 1; idx < tokens.length; idx += 1) {
        const nextLine = (line + ' ' + tokens[idx]); // eslint-disable-line prefer-template

        if (this.activeFont.getLineLengthPx(nextLine) > w) {
          this.textLine(line, x, yy, color);
          line = tokens[idx];
          yy += lineHeight;
        } else {
          line = nextLine;
        }
      }
      this.textLine(line, x, yy, color);
      yy += lineHeight;
    }

    this.clip();
  }

  public getPixel(x: number, y: number, out: Color): void {
    const data = this.ctx.getImageData(x, y, 1, 1).data;
    out.setFrom0255(data[0], data[1], data[2], data[3]);
  }

  private textLine(text: string, x: number, y: number, color: Color): void {
    const font = this.activeFont!;
    const fontTexture = font.getTextureForColor(color);

    for (let idx = 0; idx < text.length; idx += 1) {
      const char = text[idx];
      this.drawTexturePart(
        fontTexture,
        font.getSourceXForChar(char),
        font.getSourceYForChar(char),
        font.charWidth,
        font.charHeight,
        (x + (idx * font.charWidth)) | 0,
        y | 0,
        font.charWidth,
        font.charHeight,
      );
    }
  }

  private circ(x: number, y: number, radius: number, fill: boolean): void {
    x |= 0; // eslint-disable-line no-param-reassign
    y |= 0; // eslint-disable-line no-param-reassign
    radius |= 0; // eslint-disable-line no-param-reassign

    for (let xx = 0; xx <= radius; xx += 1) {
      const dd = (radius * Math.sqrt(1 - ((xx ** 2) / (radius ** 2))));
      const x1 = (-xx + 0.1) | 0;
      const y1 = (-dd + 0.1) | 0;
      const x2 = (+xx - 0.1) | 0;
      const y2 = (+dd - 0.1) | 0;

      if (fill) {
        for (let yy = y1; yy <= y2; yy += 1) {
          this.setPixel(x + x1, y + yy);
          this.setPixel(x + x2, y + yy);
          this.setPixel(x + yy, y + x1);
          this.setPixel(x + yy, y + x2);
        }
      } else {
        this.setPixel(x + x1, y + y1);
        this.setPixel(x + x2, y + y1);
        this.setPixel(x + x1, y + y2);
        this.setPixel(x + x2, y + y2);
        this.setPixel(x + y1, y + x1);
        this.setPixel(x + y1, y + x2);
        this.setPixel(x + y2, y + x1);
        this.setPixel(x + y2, y + x2);
      }
    }
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
}
