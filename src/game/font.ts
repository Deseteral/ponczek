import { GraphicsDevice } from 'marmolada/graphics-device';
import { Sprites } from 'src/game/sprites';

export abstract class Font {
  static readonly charWidth = 10;
  static readonly charWidthSmall = 7;
  static readonly charHeight = 20;
  static readonly charHeightSmall = 14;

  static draw(text: string, x: number, y: number, g: GraphicsDevice, small: boolean = false): void {
    text.split('').forEach((letter, idx) => {
      const w = small ? Font.charWidthSmall : Font.charWidth;
      const h = small ? Font.charHeightSmall : Font.charHeight;
      const sx = (letter.charCodeAt(0) - 32) * w;
      const t = small ? Sprites.sprite('font_small').normal : Sprites.sprite('font').normal;

      g.drawTexturePart(t, sx, 0, w, h, (x + (idx * w)), y, w, h);
    });
  }

  static lineLengthPx(text: string, small: boolean): number {
    const w = small ? Font.charWidthSmall : Font.charWidth;
    return text.length * w;
  }
}
