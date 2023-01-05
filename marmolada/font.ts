import { Color } from 'marmolada/color';
import { ReplaceColorEffect } from 'marmolada/effects/replace-color-effect';
import { Texture } from 'marmolada/texture';

export class Font {
  public charWidth: number;
  public charHeight: number;

  private sourceTexture: Texture;
  private colorVariants: Map<string, Texture>;

  constructor(fontBitmap: Texture, letterWidth: number, letterHeight: number) {
    this.sourceTexture = fontBitmap;
    this.charWidth = letterWidth;
    this.charHeight = letterHeight;
    this.colorVariants = new Map();
  }

  public getTextureForColor(color: Color): Texture {
    return this.colorVariants.getOrElse(color.htmlString, this.sourceTexture);
  }

  public getSourceXForChar(char: string): number {
    const charIdx = char.charCodeAt(0) - 32;
    return (charIdx * this.charWidth) % this.sourceTexture.width;
  }

  public getSourceYForChar(char: string): number {
    const charIdx = char.charCodeAt(0) - 32;
    return (((charIdx * this.charWidth) / this.sourceTexture.width) | 0) * this.charHeight;
  }

  public generateColorVariant(color: Color): void {
    const removeWhite = new ReplaceColorEffect(Color.white, Color.transparent);
    const setColor = new ReplaceColorEffect(Color.black, color);

    const texture = Texture.createFromSource(this.sourceTexture.drawable);

    removeWhite.apply(texture.drawable, texture.drawable);
    setColor.apply(texture.drawable, texture.drawable);

    this.colorVariants.set(color.htmlString, texture);
  }

  public generateColorVariants(colors: Color[]): void {
    for (let idx = 0; idx < colors.length; idx += 1) {
      this.generateColorVariant(colors[idx]);
    }
  }
}
