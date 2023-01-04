import { Texture } from 'marmolada/assets';

export class Font {
  public texture: Texture;
  public charWidth: number;
  public charHeight: number;

  constructor(fontBitmap: Texture, letterWidth: number, letterHeight: number) {
    this.texture = fontBitmap;
    this.charWidth = letterWidth;
    this.charHeight = letterHeight;
  }

  getSourceXForChar(char: string): number {
    const charIdx = char.charCodeAt(0) - 32;
    return (charIdx * this.charWidth) % this.texture.width;
  }

  getSourceYForChar(char: string): number {
    const charIdx = char.charCodeAt(0) - 32;
    return (((charIdx * this.charWidth) / this.texture.width) | 0) * this.charHeight;
  }
}
