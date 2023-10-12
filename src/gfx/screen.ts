import { Font } from 'ponczek/gfx/font';
import { Vector2 } from 'ponczek/math/vector2';
import { Color } from 'ponczek/gfx/color';
import { Texture } from 'ponczek/gfx/texture';
import { Rectangle } from 'ponczek/math/rectangle';
import { Sprite } from 'ponczek/gfx/spritesheet';

export const FLIP_H = 1 << 0;
export const FLIP_V = 1 << 1;

/**
 * Representation of video buffer used for drawing stuff onto the screen.
 *
 * Uses coordinate system with root in the upper-left corner of the screen (coordinates <0, 0>).
 * X-axis values grow to the right and Y-axis values grow down.
 */
export class Screen {
  /**
   * Width of the screen in pixels.
   */
  public readonly width: number;

  /**
   * Height of the screen in pixels.
   */
  public readonly height: number;

  /**
   * Font that will be used for drawing text.
   */
  public activeFont: (Font | null) = null;

  public readonly _ctx: CanvasRenderingContext2D;
  public get _domElement(): HTMLCanvasElement { return this._ctx.canvas; }

  /**
   * Creates new screen of specified size.
   */
  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    this._ctx = Screen.createCanvas(width, height);
  }

  /**
   * Sets active color.
   */
  public color(color: Color): void {
    this._ctx.fillStyle = color.cssString;
  }

  /**
   * Sets active font.
   */
  public font(font: Font): void {
    this.activeFont = font;
  }

  /**
   * Fills entire screen with specified color.
   */
  public clearScreen(clearColor: Color = Color.black): void {
    const prevColor = this._ctx.fillStyle;
    this._ctx.fillStyle = clearColor.cssString;
    this._ctx.fillRect(0, 0, this.width, this.height);
    this._ctx.fillStyle = prevColor;
  }

  /*
   ****************************************************************************
   * drawPixel*
   ****************************************************************************
   */

  /**
   * Draws single pixel at given position in active color.
   */
  public drawPixelV(position: Vector2): void {
    this.drawPixel(position.x, position.y);
  }

  /**
   * Draws single pixel at given position in active color.
   */
  public drawPixel(x: number, y: number): void {
    this.drawRect((x | 0), (y | 0), 1, 1);
  }

  /**
   * Makes pixel at given position transparent.
   */
  public clearPixelV(position: Vector2): void {
    this.clearPixel(position.x, position.y);
  }

  /**
   * Makes pixel at given position transparent.
   */
  public clearPixel(x: number, y: number): void {
    this.clearRect((x | 0), (y | 0), 1, 1);
  }

  /*
   ****************************************************************************
   * drawLine*
   ****************************************************************************
   */

  /**
   * Draws line between two points.
   */
  public drawLineV(from: Vector2, to: Vector2): void {
    this.drawLine(from.x, from.y, to.x, to.y);
  }

  /**
   * Draws line between two points.
   */
  public drawLine(x1: number, y1: number, x2: number, y2: number): void {
    this.line(x1, y1, x2, y2, false);
  }

  /**
   * Clears pixels in line between two points.
   */
  public clearLineV(from: Vector2, to: Vector2): void {
    this.clearLine(from.x, from.y, to.x, to.y);
  }

  /**
   * Clears pixels in line between two points.
   */
  public clearLine(x1: number, y1: number, x2: number, y2: number): void {
    this.line(x1, y1, x2, y2, true);
  }

  /*
   ****************************************************************************
   * drawRect*
   ****************************************************************************
   */

  /**
   * Draws rectangle border with upper-left corner at specified position and provided width and height.
   */
  public drawRectLinesV(position: Vector2, w: number, h: number): void {
    this.drawRectLines(position.x, position.y, w, h);
  }

  /**
   * Draws rectangle border.
   */
  public drawRectLinesR(rect: Rectangle): void {
    this.drawRectLines(rect.x, rect.y, rect.width, rect.height);
  }

  /**
   * Draws rectangle border with upper-left corner at specified position and provided width and height.
   */
  public drawRectLines(x: number, y: number, w: number, h: number): void {
    this.rect(x, y, w, h, false);
  }

  /**
   * Draws filled rectangle with upper-left corner at specified position and provided width and height.
   */
  public drawRectV(position: Vector2, w: number, h: number): void {
    this.drawRect(position.x, position.y, w, h);
  }

  /**
   * Draws filled rectangle.
   */
  public drawRectR(rect: Rectangle): void {
    this.drawRect(rect.x, rect.y, rect.width, rect.height);
  }

  /**
   * Draws filled rectangle with upper-left corner at specified position and provided width and height.
   */
  public drawRect(x: number, y: number, w: number, h: number): void {
    this._ctx.fillRect((x | 0), (y | 0), w, h);
  }

  public clearRect(x: number, y: number, w: number, h: number): void {
    this._ctx.clearRect((x | 0), (y | 0), w, h);
  }

  /*
   ****************************************************************************
   * drawCircle*
   ****************************************************************************
   */

  /**
   * Draws circle border with its center at specified position with given radius.
   */
  public drawCircleLinesV(position: Vector2, radius: number): void {
    this.drawCircleLines(position.x, position.y, radius);
  }

  /**
   * Draws circle border with its center at specified position with given radius.
   */
  public drawCircleLines(x: number, y: number, radius: number): void {
    this.circ(x, y, radius, false, false);
  }

  /**
   * Draws filled circle with its center at specified position with given radius.
   */
  public drawCircleV(position: Vector2, radius: number): void {
    this.drawCircle(position.x, position.y, radius);
  }

  public clearCircleV(position: Vector2, radius: number): void {
    this.clearCircle(position.x, position.y, radius);
  }

  /**
   * Draws filled circle with its center at specified position with given radius.
   */
  public drawCircle(x: number, y: number, radius: number): void {
    this.circ(x, y, radius, true, false);
  }

  public clearCircle(x: number, y: number, radius: number): void {
    this.circ(x, y, radius, true, true);
  }

  /*
   ****************************************************************************
   * drawTexture*
   ****************************************************************************
   */

  /**
   * Draws entire texture at given position, with optional scaling by `w`, `h` parameters.
   * Allow for horizontal and vertical flipping using `FLIP_H` and `FLIP_V` bitmask options.
   */
  public drawTextureV(texture: Texture, position: Vector2, w: number = texture.width, h: number = texture.height, flip: number = 0): void {
    this.drawTexture(texture, position.x, position.y, w, h, flip);
  }

  /**
   * Draws entire texture at given position, with optional scaling by `w`, `h` parameters.
   * Allow for horizontal and vertical flipping using `FLIP_H` and `FLIP_V` bitmask options.
   */
  public drawTexture(texture: Texture, x: number, y: number, w: number = texture.width, h: number = texture.height, flip: number = 0): void {
    x |= 0; // eslint-disable-line no-param-reassign
    y |= 0; // eslint-disable-line no-param-reassign

    const flipH = !!(flip & FLIP_H);
    const flipV = !!(flip & FLIP_V);

    this._ctx.save();
    this._ctx.translate((flipH ? w : 0) + x, (flipV ? h : 0) + y);
    this._ctx.scale((flipH ? -1 : 1), (flipV ? -1 : 1));

    this._ctx.drawImage(texture._drawable, 0, 0, w, h);
    this._ctx.restore();
  }

  /**
   * Draws part of the texture.
   * Texture part is defined by source position (`sx`, `sy`) and source size (`sw`, `sh`).
   * On screen position is defined by position (`dx`, `dy`) and scaled by width and height (`dw`, `dh`).
   * Allow for horizontal and vertical flipping using `FLIP_H` and `FLIP_V` bitmask options.
   */
  public drawTexturePart(texture: Texture, sx: number, sy: number, sw: number, sh: number, dx: number, dy: number, dw: number, dh: number, flip: number = 0): void {
    dx |= 0; // eslint-disable-line no-param-reassign
    dy |= 0; // eslint-disable-line no-param-reassign

    const flipH = !!(flip & FLIP_H);
    const flipV = !!(flip & FLIP_V);

    this._ctx.save();
    this._ctx.translate((flipH ? dw : 0) + dx, (flipV ? dh : 0) + dy);
    this._ctx.scale((flipH ? -1 : 1), (flipV ? -1 : 1));

    this._ctx.drawImage(texture._drawable, sx, sy, sw, sh, 0, 0, dw, dh);
    this._ctx.restore();
  }

  /**
   * Draws predefined sprite at given position.
   * Allow for horizontal and vertical flipping using `FLIP_H` and `FLIP_V` bitmask options.
   * Allows for scaling using scale factor (where 1 = original size as defined in provided sprite).
   */
  public drawSprite(sprite: Sprite, dx: number, dy: number, flip: number = 0, scale: number = 1): void {
    this.drawTexturePart(sprite._sheet._texture, sprite._sx, sprite._sy, sprite._sw, sprite._sh, dx, dy, sprite._sw * scale, sprite._sh * scale, flip);
  }

  /**
   * Draws a [9-slice](https://en.wikipedia.org/wiki/9-slice_scaling) with upper-left corner at specified position and with width and height.
   * This simplifed implementation allows for 9-slices with equal size patches defined by `patchWidth` and `patchHeight` parameters.
   */
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

  /**
   * Sets the area in which the drawing will be performed.
   * To reset the area to full screen call it without arguments.
   */
  public clip(x?: number, y?: number, w?: number, h?: number): void {
    if (x === undefined || y === undefined || w === undefined || h === undefined) {
      this._ctx.restore();
      return;
    }

    x |= 0; // eslint-disable-line no-param-reassign
    y |= 0; // eslint-disable-line no-param-reassign

    this._ctx.save();
    this._ctx.beginPath();
    this._ctx.rect(x, y, w, h);
    this._ctx.clip();
  }

  /**
   * Draws text at given position, and color.
   * Active font has to have generated color variant for the specified color.
   */
  public drawTextV(text: string, position: Vector2, color: Color): void {
    this.drawText(text, position.x, position.y, color);
  }

  /**
   * Draws text at given position, and color.
   * Active font has to have generated color variant for the specified color.
   */
  public drawText(text: string, x: number, y: number, color: Color): void {
    this.drawTextInRect(text, x, y, Infinity, Infinity, color);
  }

  /**
   * Draws text inside given bounds, with provided color.
   * Active font has to have generated color variant for the specified color.
   * The text will be laid out inside rectangle bounds - text will be split into new lines and clipped.
   */
  public drawTextInRectR(text: string, bounds: Rectangle, color: Color): void {
    this.drawTextInRect(text, bounds.x, bounds.y, bounds.width, bounds.height, color);
  }

  /**
   * Draws text inside given bounds, with provided color.
   * Active font has to have generated color variant for the specified color.
   * The text will be laid out inside rectangle bounds - text will be split into new lines and clipped.
   */
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

    if (w !== Infinity || h !== Infinity) {
      this.clip();
    }
  }

  /**
   * Writes the color of the pixel in `out` parameter.
   * Warning! This is performance intensive call.
   */
  public getPixel(x: number, y: number, out: Color): void {
    const data = this._ctx.getImageData(x, y, 1, 1).data;
    out.setFrom0255(data[0], data[1], data[2], data[3]);
  }

  private textLine(text: string, x: number, y: number, color: Color): void {
    const font = this.activeFont!;
    const fontTexture = font._getTextureForColor(color);

    for (let idx = 0; idx < text.length; idx += 1) {
      const char = text[idx];
      this.drawTexturePart(
        fontTexture,
        font._getSourceXForChar(char),
        font._getSourceYForChar(char),
        font.charWidth,
        font.charHeight,
        (x + (idx * font.charWidth)) | 0,
        y | 0,
        font.charWidth,
        font.charHeight,
      );
    }
  }

  private rect(x: number, y: number, w: number, h: number, clear: boolean): void {
    x |= 0; // eslint-disable-line no-param-reassign
    y |= 0; // eslint-disable-line no-param-reassign

    const drawFn = clear ? this._ctx.clearRect : this._ctx.fillRect;

    drawFn(x, y, w, 1);
    drawFn(x, y + h - 1, w, 1);
    drawFn(x, y, 1, h);
    drawFn(x + w - 1, y, 1, h);
  }

  private line(x1: number, y1: number, x2: number, y2: number, clear: boolean): void {
    x1 |= x1; // eslint-disable-line no-param-reassign
    y1 |= y1; // eslint-disable-line no-param-reassign
    x2 |= x2; // eslint-disable-line no-param-reassign
    y2 |= y2; // eslint-disable-line no-param-reassign

    const drawFn = clear ? this.clearPixel : this.drawPixel;

    if (x1 === x2 && y1 === y2) {
      drawFn(x1, y1);
      return;
    }

    if (Math.abs(x1 - x2) > Math.abs(y1 - y2)) {
      const startX = (x1 < x2) ? x1 : x2;
      const startY = (x1 < x2) ? y1 : y2;
      const endX = (x1 < x2) ? x2 : x1;
      const endY = (x1 < x2) ? y2 : y1;
      const d = (endY - startY) / (endX - startX);

      for (let xx = 0; xx < (endX - startX + 1); xx += 1) {
        drawFn(startX + xx, startY + ((d * xx) | 0));
      }
    } else {
      const startX = (y1 < y2) ? x1 : x2;
      const startY = (y1 < y2) ? y1 : y2;
      const endX = (y1 < y2) ? x2 : x1;
      const endY = (y1 < y2) ? y2 : y1;
      const d = (endX - startX) / (endY - startY);

      for (let yy = 0; yy < (endY - startY + 1); yy += 1) {
        drawFn(startX + ((d * yy) | 0), startY + yy);
      }
    }
  }

  private circ(x: number, y: number, radius: number, fill: boolean, clear: boolean): void {
    x |= 0; // eslint-disable-line no-param-reassign
    y |= 0; // eslint-disable-line no-param-reassign
    radius |= 0; // eslint-disable-line no-param-reassign

    for (let xx = 0; xx <= radius; xx += 1) {
      const dd = (radius * Math.sqrt(1 - ((xx ** 2) / (radius ** 2))));
      const x1 = (-xx + 0.1) | 0;
      const y1 = (-dd + 0.1) | 0;
      const x2 = (+xx - 0.1) | 0;
      const y2 = (+dd - 0.1) | 0;

      const fn = clear ? this.clearPixel.bind(this) : this.drawPixel.bind(this);

      if (fill) {
        for (let yy = y1; yy <= y2; yy += 1) {
          fn(x + x1, y + yy);
          fn(x + x2, y + yy);
          fn(x + yy, y + x1);
          fn(x + yy, y + x2);
        }
      } else {
        fn(x + x1, y + y1);
        fn(x + x2, y + y1);
        fn(x + x1, y + y2);
        fn(x + x2, y + y2);
        fn(x + y1, y + x1);
        fn(x + y1, y + x2);
        fn(x + y2, y + x1);
        fn(x + y2, y + x2);
      }
    }
  }

  private static createCanvas(width: number, height: number): CanvasRenderingContext2D {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    canvas.addEventListener('contextmenu', (e) => e.preventDefault());

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('An error occured while creating canvas context');
    }

    ctx.imageSmoothingEnabled = false;

    return ctx;
  }
}
