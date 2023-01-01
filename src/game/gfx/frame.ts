import { GraphicsDevice } from 'marmolada/graphics-device';
import { Sprites } from 'src/game/gfx/sprites';

export function drawFrame(x: number, y: number, w: number, h: number, g: GraphicsDevice, clippingRegion: () => void): void {
  g.drawNinePatch(Sprites.sprite('frame').normal, x, y, w, h, 9, 9);

  // Clipping content inside
  g.ctx.save();
  g.ctx.beginPath();
  g.ctx.rect(x, y, w, h);
  g.ctx.clip();
  clippingRegion();
  g.ctx.restore();
}
