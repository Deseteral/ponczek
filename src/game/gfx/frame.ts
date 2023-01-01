import { GraphicsDevice } from 'marmolada/graphics-device';
import { Sprites } from 'src/game/gfx/sprites';

export function drawFrame(x: number, y: number, w: number, h: number, g: GraphicsDevice, clippingRegion: () => void): void {
  g.drawNinePatch(Sprites.sprite('frame').normal, x, y, w, h, 9, 9);

  g.clip(x, y, w, h);
  clippingRegion();
  g.clip();
}
