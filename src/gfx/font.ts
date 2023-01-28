import { Color } from 'ponczek/gfx/color';
import { ReplaceColorEffect } from 'ponczek/effects/replace-color-effect';
import { Texture } from 'ponczek/gfx/texture';

/**
 * Monospace font representation for drawing on `Screen`.
 */
export class Font {
  /**
   * Width in pixels of single character in font spritesheet.
   */
  public readonly charWidth: number;

  /**
   * Height in pixels of single character in font spritesheet.
   */
  public readonly charHeight: number;

  private readonly sourceTexture: Texture;
  private readonly colorVariants: Map<string, Texture>;

  /**
   * Creates new font from spritesheet, width and height of a single character in pixels.
   */
  constructor(fontTexture: Texture, charWidth: number, charHeight: number) {
    this.sourceTexture = fontTexture;
    this.charWidth = charWidth;
    this.charHeight = charHeight;
    this.colorVariants = new Map();
  }

  /**
   * Calculates line length in pixels for given text.
   */
  public getLineLengthPx(text: string): number {
    return text.length * this.charWidth;
  }

  /**
   * Prepares font for drawing with specified color.
   */
  public generateColorVariant(color: Color): void {
    const removeWhite = new ReplaceColorEffect(Color.white, Color.transparent);
    const setColor = new ReplaceColorEffect(Color.black, color);

    const texture = Texture.copy(this.sourceTexture);

    removeWhite.apply(texture);
    setColor.apply(texture);

    this.colorVariants.set(color.cssString, texture);
  }

  /**
   * Prepares font for drawing with specified colors.
   */
  public generateColorVariants(colors: Color[]): void {
    for (let idx = 0; idx < colors.length; idx += 1) {
      this.generateColorVariant(colors[idx]);
    }
  }

  public _getTextureForColor(color: Color): Texture {
    return this.colorVariants.getOrElse(color.cssString, this.sourceTexture);
  }

  public _getSourceXForChar(char: string): number {
    const charIdx = char.charCodeAt(0) - 32;
    return (charIdx * this.charWidth) % this.sourceTexture.width;
  }

  public _getSourceYForChar(char: string): number {
    const charIdx = char.charCodeAt(0) - 32;
    return (((charIdx * this.charWidth) / this.sourceTexture.width) | 0) * this.charHeight;
  }
}
